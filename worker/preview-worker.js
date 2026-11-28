/* ═══════════════════════════════════════════════════════════════
   Flow Preview Worker — прев'ю посилання для картки поста
   ═══════════════════════════════════════════════════════════════
   Окремий маленький воркер (28.11.2026), щоб не чіпати головний
   flow-ai-worker: у Cloudflare він відрізняється від git.

   Одна адреса:
     POST /preview   { url }  →  { ok, title, desc, site, image }
       image — сама картинка як data:image/…;base64 (до 3 МБ) або "".

   Навіщо воркер: браузер не дає сторінці прочитати чужий сайт (CORS).
   Воркер читає сторінку поста, бере службові мітки Open Graph
   (og:image, og:title, og:description) і віддає їх застосунку.

   Замки:
   1) лише дозволені сторінки (Origin) — той самий список, що в головному;
   2) лише для тих, хто увійшов (Supabase). Без SUPABASE_URL/SUPABASE_ANON
      воркер не працює взагалі — відкритий «качальник чужих сторінок»
      нам не потрібен;
   3) ліміт запитів з однієї IP;
   4) лише http(s), стандартні порти, без IP-адрес, localhost і
      внутрішніх імен; кожне перенаправлення перевіряється так само;
   5) сторінку читаємо до 512 КБ, картинку — до 2 МБ, ≤ 6000 px по стороні, лише image/*;
      на все — 6 секунд.
   ═══════════════════════════════════════════════════════════════ */

const ORIGINS_DEFAULT = [
  "https://frequency-os.github.io", // сайт (GitHub Pages)
  "app://frequency",                // десктоп (Electron)
  "capacitor://localhost",          // iOS-обгортка
  "http://localhost:*",             // локальна перевірка dist/
  "http://127.0.0.1:*",
];
function originAllowed(origin, env) {
  const list = env.ALLOWED_ORIGINS
    ? String(env.ALLOWED_ORIGINS).split(",").map((s) => s.trim()).filter(Boolean)
    : ORIGINS_DEFAULT;
  if (list.includes("*")) return true;
  if (!origin) return list.includes("none");
  return list.some((p) => p.endsWith(":*")
    ? origin === p.slice(0, -2) || origin.startsWith(p.slice(0, -1))
    : origin === p);
}

/* ── ліміт частоти (приблизний: кожна копія воркера рахує сама) ── */
const RATE_WINDOW_MS = 60000;
const RATE_PER_MIN_DEFAULT = 20;
const rateHits = new Map();
function rateWait(ip, env) {
  const limit = +env.RATE_PER_MIN || RATE_PER_MIN_DEFAULT;
  const now = Date.now();
  let e = rateHits.get(ip);
  if (!e || now - e.t0 >= RATE_WINDOW_MS) { e = { t0: now, n: 0 }; rateHits.set(ip, e); }
  e.n++;
  if (rateHits.size > 5000) for (const [k, v] of rateHits) if (now - v.t0 >= RATE_WINDOW_MS) rateHits.delete(k);
  return e.n > limit ? Math.max(1, Math.ceil((e.t0 + RATE_WINDOW_MS - now) / 1000)) : 0;
}

/* ── вхід через Supabase (як у головному воркері) ── */
const AUTH_TTL_MS = 5 * 60000;
const authSeen = new Map();
async function authProblem(request, env) {
  const m = /^Bearer\s+(\S+)/i.exec(request.headers.get("authorization") || "");
  if (!m) return { status: 401, error: "Щоб тягнути прев'ю, увійди в застосунок (Ще → Акаунт)" };
  const tok = m[1], now = Date.now();
  if ((authSeen.get(tok) || 0) > now) return null;
  let r;
  try {
    r = await fetch(String(env.SUPABASE_URL).replace(/\/+$/, "") + "/auth/v1/user", {
      headers: { apikey: env.SUPABASE_ANON, authorization: "Bearer " + tok },
    });
  } catch (_) { return { status: 503, error: "Не вдалося перевірити вхід: Supabase не відповів" }; }
  if (!r.ok) return { status: 401, error: "Сесія застаріла — увійди в застосунок ще раз" };
  if (env.ALLOWED_USERS) {
    const u = await r.json().catch(() => null);
    const allow = String(env.ALLOWED_USERS).split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    const who = [u && u.id, u && u.email].filter(Boolean).map((s) => String(s).toLowerCase());
    if (!who.some((w) => allow.includes(w))) return { status: 403, error: "Цьому акаунту прев'ю не відкрито" };
  }
  if (authSeen.size > 1000) authSeen.clear();
  authSeen.set(tok, now + AUTH_TTL_MS);
  return null;
}

/* ── яку адресу дозволено відкривати ──
   Відкидаємо все, що схоже на шлях усередину мережі: IP-адреси (v4,
   v6, десяткові «2130706433»), localhost, імена без крапки, внутрішні
   зони, нестандартні порти, логін:пароль@ в адресі.                  */
const BAD_SUFFIX = [".localhost", ".local", ".internal", ".intranet", ".lan", ".home", ".corp", ".arpa", ".test", ".invalid"];
function safeTarget(raw) {
  let u;
  try { u = new URL(String(raw || "").trim()); } catch (_) { return null; }
  if (u.protocol !== "https:" && u.protocol !== "http:") return null;
  if (u.username || u.password) return null;
  if (u.port && !((u.protocol === "https:" && u.port === "443") || (u.protocol === "http:" && u.port === "80"))) return null;
  const h = u.hostname.toLowerCase().replace(/\.$/, "");
  if (!h || h === "localhost" || h.indexOf(".") < 0) return null;
  if (h.startsWith("[") || h.includes(":")) return null;            // IPv6
  if (/^[\d.]+$/.test(h) || /^0x/i.test(h)) return null;             // IPv4 у будь-якому вигляді
  if (BAD_SUFFIX.some((s) => h.endsWith(s))) return null;
  if (String(raw).length > 2000) return null;
  return u;
}

const TIMEOUT_MS = 6000;
const HTML_MAX = 512 * 1024;
const IMG_MAX = 2 * 1024 * 1024;   /* 2 МБ: більше — довго кодувати і важко телефону */
const IMG_SIDE_MAX = 6000;         /* крихітний файл на 30000×30000 пікселів поклав би вкладку на iPhone */
const IMG_TYPES = /^image\/(jpeg|jpg|png|webp|gif|avif)$/i;
/* Чесне ім'я: сайти бачать, що це прев'ю Frequency, а не людина в браузері. */
const UA = "Mozilla/5.0 (compatible; FrequencyPreview/1.0; +https://frequency-os.github.io/flow/)";

/* fetch із ручними перенаправленнями: кожну наступну адресу перевіряємо safeTarget */
async function getChecked(url, accept, signal) {
  let cur = url;
  for (let hop = 0; hop < 5; hop++) {
    const r = await fetch(cur.href, {
      redirect: "manual", signal,
      headers: { "user-agent": UA, accept, "accept-language": "uk,en;q=0.8" },
    });
    if (r.status >= 300 && r.status < 400) {
      const loc = r.headers.get("location");
      const next = loc ? safeTarget(new URL(loc, cur).href) : null;
      if (!next) return { error: "Сайт переспрямував на адресу, яку не відкриваємо" };
      cur = next; continue;
    }
    return { r, url: cur };
  }
  return { error: "Забагато перенаправлень" };
}

/* читає тіло не більше max байтів (решту відкидає) */
async function readCapped(r, max) {
  const len = +(r.headers.get("content-length") || 0);
  if (len && len > max * 4) return null;      // явно завелике — навіть не починаємо
  if (!r.body) return new Uint8Array(0);
  const reader = r.body.getReader();
  const parts = []; let n = 0;
  while (n < max) {
    const { done, value } = await reader.read();
    if (done) break;
    parts.push(value); n += value.length;
  }
  try { reader.cancel(); } catch (_) {}
  const out = new Uint8Array(Math.min(n, max)); let o = 0;
  for (const p of parts) { const take = Math.min(p.length, out.length - o); out.set(p.subarray(0, take), o); o += take; if (o >= out.length) break; }
  return { bytes: out, cut: n > max };
}

function decodeEntities(s) {
  return String(s || "")
    .replace(/&#x([0-9a-f]{1,6});/gi, (_, h) => { const c = parseInt(h, 16); return c > 0 && c < 0x110000 ? String.fromCodePoint(c) : ""; })
    .replace(/&#(\d{1,7});/g, (_, d) => { const c = +d; return c > 0 && c < 0x110000 ? String.fromCodePoint(c) : ""; })
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}
/* мітки <meta> у будь-якому порядку атрибутів: property/name → content */
function metaTags(html) {
  const out = {};
  const re = /<meta\b[^>]*>/gi; let m;
  while ((m = re.exec(html))) {
    const tag = m[0];
    const key = /\b(?:property|name)\s*=\s*["']([^"']{1,60})["']/i.exec(tag);
    const val = /\bcontent\s*=\s*("([^"]*)"|'([^']*)')/i.exec(tag);
    if (!key || !val) continue;
    const k = key[1].toLowerCase();
    if (!(k in out)) out[k] = decodeEntities(val[2] != null ? val[2] : val[3]);
  }
  const t = /<title[^>]*>([^<]{1,400})<\/title>/i.exec(html);
  if (t) out["html:title"] = decodeEntities(t[1]);
  return out;
}
const clip = (s, n) => { s = String(s || "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s; };

/* розміри картинки з заголовка файлу (PNG, GIF, JPEG); невідомий формат — null */
function imgDims(b) {
  if (b.length > 24 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47)
    return { w: (b[16] << 24 | b[17] << 16 | b[18] << 8 | b[19]) >>> 0, h: (b[20] << 24 | b[21] << 16 | b[22] << 8 | b[23]) >>> 0 };
  if (b.length > 10 && b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return { w: b[6] | b[7] << 8, h: b[8] | b[9] << 8 };
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1], len = b[i + 2] << 8 | b[i + 3];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { w: b[i + 7] << 8 | b[i + 8], h: b[i + 5] << 8 | b[i + 6] };
      if (len < 2) break;
      i += 2 + len;
    }
  }
  return null;
}

function toBase64(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

export default {
  async fetch(request, env) {
    env = env || {};
    const origin = request.headers.get("origin") || "";
    const originOk = originAllowed(origin, env);
    const cors = {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "content-type, authorization",
      "Vary": "Origin",
    };
    if (originOk && origin) cors["Access-Control-Allow-Origin"] = origin;
    const json = (obj, status = 200, extra) =>
      new Response(JSON.stringify(obj), { status, headers: { ...cors, "content-type": "application/json", ...(extra || {}) } });

    if (!originOk) return json({ error: "Цій сторінці не дозволено звертатись до воркера" }, 403);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return json({ error: "POST only" }, 405);
    const path = new URL(request.url).pathname.replace(/\/{2,}/g, "/").replace(/(.)\/$/, "$1");
    if (path !== "/preview") return json({ error: "Невідома адреса воркера: " + path }, 404);

    if (!env.SUPABASE_URL || !env.SUPABASE_ANON) return json({ error: "Воркер прев'ю не налаштовано (SUPABASE_URL, SUPABASE_ANON)" }, 503);
    const wait = rateWait(request.headers.get("cf-connecting-ip") || "?", env);
    if (wait) return json({ error: "Забагато запитів. Спробуй за " + wait + " с" }, 429, { "Retry-After": String(wait) });
    const bad = await authProblem(request, env);
    if (bad) return json({ error: bad.error }, bad.status);

    let body;
    try { body = await request.json(); } catch (_) { return json({ error: "Очікую JSON { url }" }, 400); }
    const target = safeTarget(body && body.url);
    if (!target) return json({ error: "Таку адресу не відкриваємо" }, 400);

    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
    try {
      const page = await getChecked(target, "text/html,application/xhtml+xml;q=0.9,*/*;q=0.5", ac.signal);
      if (page.error) return json({ error: page.error }, 422);
      if (!page.r.ok) return json({ error: "Сайт відповів " + page.r.status }, 502);
      const ct = page.r.headers.get("content-type") || "";
      if (ct && !/html|xml/i.test(ct)) return json({ error: "Це не сторінка (" + clip(ct, 40) + ")" }, 422);
      const got = await readCapped(page.r, HTML_MAX);
      if (!got) return json({ error: "Сторінка завелика" }, 422);
      const html = new TextDecoder("utf-8", { fatal: false }).decode(got.bytes);
      const mt = metaTags(html);

      const title = clip(mt["og:title"] || mt["twitter:title"] || mt["html:title"] || "", 200);
      const desc = clip(mt["og:description"] || mt["twitter:description"] || mt["description"] || "", 400);
      const site = clip(mt["og:site_name"] || "", 60);

      let image = "";
      const imgRaw = mt["og:image:secure_url"] || mt["og:image"] || mt["twitter:image"] || mt["twitter:image:src"] || "";
      const imgUrl = imgRaw ? safeTarget(new URL(imgRaw, page.url).href) : null;
      if (imgUrl) {
        const im = await getChecked(imgUrl, "image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8", ac.signal);
        if (!im.error && im.r.ok) {
          const ict = (im.r.headers.get("content-type") || "").split(";")[0].trim();
          if (IMG_TYPES.test(ict)) {
            const ib = await readCapped(im.r, IMG_MAX);
            const dm = ib && ib.bytes.length ? imgDims(ib.bytes) : null;
            const tooBig = dm && (dm.w > IMG_SIDE_MAX || dm.h > IMG_SIDE_MAX || !dm.w || !dm.h);
            if (ib && !ib.cut && ib.bytes.length && !tooBig) image = "data:" + ict.toLowerCase() + ";base64," + toBase64(ib.bytes);
          }
        }
      }
      return json({ ok: true, title, desc, site, image });
    } catch (e) {
      return json({ error: e && e.name === "AbortError" ? "Сайт не відповів за 6 секунд" : "Не вдалося прочитати сторінку" }, 504);
    } finally {
      clearTimeout(timer);
    }
  },
};
