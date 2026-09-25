/* ═══════════════════════════════════════════════════════════════
   Flow AI Worker — проксі між застосунком і Anthropic + голос
   ═══════════════════════════════════════════════════════════════
   Живе в Cloudflare Workers. Застосунок ніколи не звертається до
   Anthropic напряму: ключ лежить тут і в браузер не потрапляє.

   Три адреси (решта — 404):
     POST /            — розмова з моделлю (з інструментами, стрімом)
     POST /transcribe  — голос у текст (Whisper через Workers AI)
     POST /tts         — текст у голос

   Оновлено 25.09.2026: замок (Origin, ліміт, Opus, вхід Supabase) і
   правильна системна підказка агента. Подробиці — у worker/README.md.
   ═══════════════════════════════════════════════════════════════ */

/* ── Моделі ──────────────────────────────────────────────────────
   Застосунок сам обирає модель під задачу (див. aiPickModel).
   Тут ми лише перевіряємо, що назва дозволена, і підміняємо
   застарілі назви на актуальні — щоб не правити застосунок.      */

const MODEL_ALIAS = {
  // Sonnet 4.6 → Sonnet 5: новіша модель, і водночас ДЕШЕВША
  // ($2/$10 за млн замість $3/$15). Міняти застосунок не треба.
  "claude-sonnet-4-6": "claude-sonnet-5",
  // Щотижневе зведення щоденника просить Haiku з датою в назві.
  // Без цього рядка назва «невідома» і запит мовчки йшов у дорожчий Sonnet.
  "claude-haiku-4-5-20251001": "claude-haiku-4-5",
};

const MODELS = {
  // thinking: 'adaptive' — модель сама вирішує, скільки думати.
  //           null — модель цього не вміє (старіше покоління).
  // effort   — чи приймає output_config.effort
  // maxOut   — стеля відповіді
  "claude-opus-5":    { thinking: "adaptive", effort: true,  maxOut: 64000 },
  "claude-sonnet-5":  { thinking: "adaptive", effort: true,  maxOut: 64000 },
  "claude-haiku-4-5": { thinking: null,       effort: false, maxOut: 8192  },
};
const MODEL_DEFAULT = "claude-sonnet-5";

const EFFORTS = ["low", "medium", "high", "xhigh", "max"];

/* Opus — найдорожча модель ($25 за млн вихідних токенів). Застосунок
   її не просить, тож за замовчуванням вона зачинена: інакше будь-хто
   з адресою воркера ганяв би її за наш рахунок. Відчинити — змінна
   ALLOW_OPUS=1. */
const OPUS_MODELS = ["claude-opus-5"];

/* Стеля відповіді для будь-якої моделі. Застосунок просить 2048;
   8192 вистачає на довгий план. Раніше зі стрімом дозволялось 64000 —
   це близько $1.6 за один запит Opus. */
const MAX_TOKENS_CAP = 8192;

/* ── Замок: хто може кликати воркер ─────────────────────────────
   Адреса воркера лежить у публічному репо, а платимо ми. Тому:
   1) пускаємо лише сторінки зі списку (Origin);
   2) рахуємо запити з кожної IP-адреси;
   3) за бажання — вимагаємо вхід у застосунок (Supabase).

   Список Origin можна замінити змінною ALLOWED_ORIGINS (через кому).
   «:*» у кінці — будь-який порт. «null» — сторінка, відкрита з диска
   (file://). «none» — дозволити запити зовсім без Origin (curl).
   Чесне застереження: Origin легко підробити скриптом. Це замок від
   чужих САЙТІВ; від скриптів — ліміт частоти і вхід Supabase.       */
const ORIGINS_DEFAULT = [
  "https://frequency-os.github.io", // сайт (GitHub Pages)
  "null",                           // file:// — збірка, відкрита з диска
  "app://frequency",                // десктоп (Electron, desktop/main.js)
  "capacitor://localhost",          // iOS-обгортка
  "http://localhost:*",             // локальна перевірка dist/
  "http://127.0.0.1:*",
  // Без Origin: сторінка з диска в Electron (перевірено 25.09 — file://
  // там не шле Origin взагалі), нативні клієнти, curl. Закрити їх Origin-ом
  // однаково не вийде (скрипт підставить будь-який), а зламати живий
  // застосунок — легко. Від скриптів — ліміт, Opus-замок і вхід Supabase.
  "none",
];

function originAllowed(origin, env) {
  const list = env.ALLOWED_ORIGINS
    ? String(env.ALLOWED_ORIGINS).split(",").map((s) => s.trim()).filter(Boolean)
    : ORIGINS_DEFAULT;
  if (list.includes("*")) return true;
  // Чужий САЙТ у браузері завжди має Origin — його відсіє список нижче.
  // Без Origin приходять не-сайти; їх пускає слово «none» у списку.
  if (!origin) return list.includes("none");
  return list.some((p) => p.endsWith(":*")
    ? origin === p.slice(0, -2) || origin.startsWith(p.slice(0, -1))
    : origin === p);
}

/* Ліміт частоти: лічильник на IP у пам'яті воркера. Cloudflare тримає
   кілька копій воркера, і кожна рахує сама, тож ліміт приблизний, але
   цикл «тисяча запитів підряд» він зупиняє. Один хід агента — до 6
   запитів, тож 30 на хвилину людині не заважають. Розмова і голос
   рахуються окремо, щоб озвучка не з'їдала ліміт розмови.          */
const RATE_WINDOW_MS = 60000;
const RATE_PER_MIN_DEFAULT = 30;
const rateHits = new Map();

function rateWait(ip, kind, env) {
  const limit = +env.RATE_PER_MIN || RATE_PER_MIN_DEFAULT;
  const now = Date.now();
  const key = kind + ":" + ip;
  let e = rateHits.get(key);
  if (!e || now - e.t0 >= RATE_WINDOW_MS) {
    e = { t0: now, n: 0 };
    rateHits.set(key, e);
  }
  e.n++;
  // прибирання, щоб пам'ять не росла від тисяч різних адрес
  if (rateHits.size > 5000) {
    for (const [k, v] of rateHits) if (now - v.t0 >= RATE_WINDOW_MS) rateHits.delete(k);
  }
  return e.n > limit ? Math.max(1, Math.ceil((e.t0 + RATE_WINDOW_MS - now) / 1000)) : 0;
}

/* Вхід через Supabase — вмикається лише коли задані SUPABASE_URL і
   SUPABASE_ANON. Застосунок шле «Authorization: Bearer <токен сесії>»,
   ми питаємо Supabase, чи токен живий. Перевірений токен пам'ятаємо
   5 хвилин, щоб не питати на кожен крок агента.
   ALLOWED_USERS (необов'язково) — пошти або id через кому: тоді
   пускаємо лише цих людей, а не будь-кого, хто увійшов через Google. */
const AUTH_TTL_MS = 5 * 60000;
const authSeen = new Map();

async function authProblem(request, env) {
  const m = /^Bearer\s+(\S+)/i.exec(request.headers.get("authorization") || "");
  if (!m) return { status: 401, error: "Щоб користуватись AI, увійди в застосунок (Ще → Акаунт)" };
  const tok = m[1];
  const now = Date.now();
  if ((authSeen.get(tok) || 0) > now) return null;
  let r;
  try {
    r = await fetch(String(env.SUPABASE_URL).replace(/\/+$/, "") + "/auth/v1/user", {
      headers: { apikey: env.SUPABASE_ANON, authorization: "Bearer " + tok },
    });
  } catch (_) {
    return { status: 503, error: "Не вдалося перевірити вхід: Supabase не відповів" };
  }
  if (!r.ok) return { status: 401, error: "Сесія застаріла — увійди в застосунок ще раз" };
  if (env.ALLOWED_USERS) {
    const u = await r.json().catch(() => null);
    const allow = String(env.ALLOWED_USERS).split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    const who = [u && u.id, u && u.email].filter(Boolean).map((s) => String(s).toLowerCase());
    if (!who.some((w) => allow.includes(w))) return { status: 403, error: "Цьому акаунту AI не відкрито" };
  }
  if (authSeen.size > 1000) authSeen.clear();
  authSeen.set(tok, now + AUTH_TTL_MS);
  return null;
}

/* ── Голос ────────────────────────────────────────────────────── */
/* Голос ElevenLabs за замовчуванням. Замінюється змінною
   ELEVENLABS_VOICE_ID, якщо вона задана. */
/* Голос ElevenLabs за замовчуванням — «George» із їхнього ж
   швидкого старту: вбудований, доступний безкоштовним акаунтам.
   Тримаємо саме ID, бо читання переліку голосів вимагає окремого
   права (voices_read), якого в ключі може не бути — і тоді все
   падало з 401 ще до синтезу. */
const EL11_VOICE_DEFAULT = "JBFqnCBsd6RMkjVDRZzb";

const TTS_VOICES = ["uk-UA-OstapNeural", "uk-UA-PolinaNeural", "en-US-AvaMultilingualNeural", "ru-RU-DmitryNeural"];

/* Скільки чекати на модель, перш ніж здатися. Довгі агентні ходи
   з думанням бувають повільні, але вічно висіти теж не можна. */
const UPSTREAM_TIMEOUT_MS = 180000;

export default {
  async fetch(request, env) {
    env = env || {};
    /* CORS: замість «*» віддзеркалюємо лише дозволену сторінку —
       тоді браузер на чужому сайті не прочитає відповідь. */
    const origin = request.headers.get("origin") || "";
    const originOk = originAllowed(origin, env);
    const cors = {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      // authorization — для токена сесії Supabase (див. authProblem)
      "Access-Control-Allow-Headers": "content-type, authorization, x-flow-key",
      "Vary": "Origin",
    };
    if (originOk && origin) cors["Access-Control-Allow-Origin"] = origin;
    const json = (obj, status = 200, extra) =>
      new Response(JSON.stringify(obj), { status, headers: { ...cors, "content-type": "application/json", ...(extra || {}) } });

    if (!originOk) return json({ error: "Цій сторінці не дозволено звертатись до воркера" }, 403);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return json({ error: "POST only" }, 405);

    /* Явні адреси. Раніше будь-який шлях (напр. /translate, якого тут
       нема) провалювався в розмову з моделлю. Тепер — чесне 404, і
       такі запити не з'їдають ліміт частоти. «//tts» від зайвої
       скісної риски в адресі теж розуміємо. */
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/{2,}/g, "/").replace(/(.)\/$/, "$1");
    const kind = path === "/" ? "chat" : (path === "/transcribe" || path === "/tts") ? "voice" : "";
    if (!kind) return json({ error: "Невідома адреса воркера: " + path }, 404);

    const wait = rateWait(request.headers.get("cf-connecting-ip") || "?", kind, env);
    if (wait) {
      return json({ error: "Забагато запитів. Спробуй за " + wait + " с" }, 429, { "Retry-After": String(wait) });
    }

    if (env.SUPABASE_URL && env.SUPABASE_ANON) {
      const bad = await authProblem(request, env);
      if (bad) return json({ error: bad.error }, bad.status);
    }

    /* ── Старий пароль FLOW_SECRET ─────────────────────────────────
       Лишився для сумісності. Справжнім захистом він не є: щоб
       застосунок його слав, пароль довелось би покласти в публічний
       код. Справжній замок — вхід Supabase вище.                   */
    if (env.FLOW_SECRET) {
      const given = request.headers.get("x-flow-key") || "";
      if (given !== env.FLOW_SECRET) {
        return json({ error: "Невірний або відсутній ключ доступу (x-flow-key)" }, 401);
      }
    }

    /* ═══ ГОЛОС → ТЕКСТ ═══ */
    if (path === "/transcribe") {
      try {
        if (!env.AI) return json({ text: "", error: "Workers AI binding (AI) не підключений" }, 500);
        let bytes;
        const ct = request.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const body = await request.json();
          const b64 = body.audio_b64 || "";
          if (!b64) return json({ text: "", error: "Порожнє аудіо" }, 400);
          const bin = atob(b64);
          bytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        } else {
          const buf = await request.arrayBuffer();
          bytes = new Uint8Array(buf);
        }
        if (!bytes || bytes.length < 800) return json({ text: "", error: "Порожнє аудіо" }, 400);
        const b64in = base64FromBytes(bytes);
        let out;
        try {
          out = await env.AI.run("@cf/openai/whisper-large-v3-turbo", { audio: b64in, language: "uk" });
        } catch (_) {
          out = await env.AI.run("@cf/openai/whisper", { audio: [...bytes] });
        }
        const text = String((out && (out.text || out.transcription)) || "").trim();
        return json({ text });
      } catch (e) {
        return json({ text: "", error: String((e && e.message) || e) }, 500);
      }
    }

    /* ═══ ТЕКСТ → ГОЛОС ═══
       Через офіційний Azure Speech. Раніше тут був реверс приватного
       ендпоінта Edge Read Aloud — він дозволяє запити з домашніх адрес
       і МОВЧКИ відмовляє дата-центрам (перевірено: з Mac приходить
       15 КБ звуку, з воркера — нуль при тих самих токені й голосі).
       Полагодити це в коді неможливо, тому шлях офіційний.

       Потрібні змінні: AZURE_SPEECH_KEY і AZURE_SPEECH_REGION.
       Без них повертаємо зрозумілу відмову — застосунок сам перейде
       на системний голос. */
    if (path === "/tts") {
      try {
        const body = await request.json();
        const text = String(body.text || "").trim().slice(0, 800);
        if (!text) return json({ error: "порожній text" }, 400);

        const rate = /^[+-]\d{1,3}%$/.test(body.rate || "") ? body.rate : "+6%";
        const pitch = /^[+-]\d{1,3}(Hz|%)$/.test(body.pitch || "") ? body.pitch : "+0Hz";

        /* ── ElevenLabs ────────────────────────────────────────────
           Стоїть першим, бо реєстрація без картки — а Azure блокує
           створення акаунтів. Безкоштовно 10 тис. символів на місяць:
           на короткі репліки помічника вистачає, на довгі тексти ні.
           Коли ліміт вичерпано, ElevenLabs віддає 401/429 — і ми
           чесно повертаємо помилку, після чого застосунок бере
           системний голос. Тобто озвучка не зникає, лише спрощується. */
        /* Ім'я змінної люди пишуть по-різному, а помилка «ключа немає»
           виглядає однаково. Приймаємо всі розумні варіанти. */
        const el11Key = env.ELEVENLABS_KEY || env.ELEVEN_LABS_KEY
          || env.ELEVENLABS_API_KEY || env.XI_API_KEY || "";

        if (el11Key) {
          /* Вибір голосу.
             Безкоштовним акаунтам ElevenLabs дозволяє через API лише
             ВБУДОВАНІ голоси (voice_type=default). Голоси з бібліотеки
             повертають 402 «paid_plan_required» — на цьому ми й стояли.
             Тому за замовчуванням беремо перший вбудований. */
          let voiceId = env.ELEVENLABS_VOICE_ID || EL11_VOICE_DEFAULT;
          let why = "";

          if (!voiceId) {
            const lv = await fetch(
              "https://api.elevenlabs.io/v2/voices?voice_type=default&page_size=20",
              { headers: { "xi-api-key": el11Key } }
            );
            if (lv.ok) {
              const list = await lv.json().catch(() => null);
              const vs = (list && list.voices) || [];
              voiceId = (vs[0] && vs[0].voice_id) || "";
              if (!voiceId) why = "перелік вбудованих голосів порожній";
            } else {
              why = "HTTP " + lv.status + " " + (await lv.text().catch(() => "")).slice(0, 120);
            }
          }
          if (!voiceId) {
            return json({ error: "ElevenLabs: не вдалося визначити голос", причина: why || "невідома" }, 502);
          }

          const r11 = await fetch(
            "https://api.elevenlabs.io/v1/text-to-speech/" + voiceId + "?output_format=mp3_44100_128",
            {
              method: "POST",
              headers: { "xi-api-key": el11Key, "content-type": "application/json" },
              body: JSON.stringify({
                text,
                // flash — швидша й дешевша за символами, 32 мови разом з українською
                model_id: env.ELEVENLABS_MODEL || "eleven_flash_v2_5",
                voice_settings: { stability: 0.4, similarity_boost: 0.75 },
              }),
            }
          );
          if (!r11.ok) {
            const d = (await r11.text().catch(() => "")).slice(0, 250);
            /* 402 на конкретному голосі означає «цей голос платний».
               Не здаємось: беремо перший вбудований і пробуємо ще раз. */
            /* Раніше тут стояло ще й !env.ELEVENLABS_VOICE_ID — тобто запасний
               шлях НЕ спрацьовував саме тоді, коли голос заданий вручну і
               виявився платним. А це якраз найчастіший випадок. */
            if (r11.status === 402) {
              const lv = await fetch(
                "https://api.elevenlabs.io/v2/voices?voice_type=default&page_size=20",
                { headers: { "xi-api-key": el11Key } }
              );
              const list = lv.ok ? await lv.json().catch(() => null) : null;
              const fromApi = ((list && list.voices) || []).map((v) => v.voice_id);
              // перелік може бути недоступний (ключ без права voices_read) —
              // тоді пробуємо вбудований, відомий наперед
              const alt = fromApi.concat([EL11_VOICE_DEFAULT]).filter((id) => id && id !== voiceId)[0];
              if (alt) {
                const r2 = await fetch(
                  "https://api.elevenlabs.io/v1/text-to-speech/" + alt + "?output_format=mp3_44100_128",
                  {
                    method: "POST",
                    headers: { "xi-api-key": el11Key, "content-type": "application/json" },
                    body: JSON.stringify({
                      text,
                      model_id: env.ELEVENLABS_MODEL || "eleven_flash_v2_5",
                      voice_settings: { stability: 0.4, similarity_boost: 0.75 },
                    }),
                  }
                );
                if (r2.ok) {
                  const mp3b = await r2.arrayBuffer();
                  if (mp3b && mp3b.byteLength >= 400) {
                    return new Response(mp3b, {
                      status: 200,
                      headers: { ...cors, "content-type": "audio/mpeg", "cache-control": "no-store",
                                 "X-TTS-Engine": "elevenlabs", "X-TTS-Voice": alt },
                    });
                  }
                }
              }
            }
            return json({
              error: "ElevenLabs: HTTP " + r11.status,
              відповідь: d,
              голос: voiceId,
              підказка: r11.status === 402
                ? "цей голос доступний лише платним акаунтам — потрібен вбудований (voice_type=default)"
                : undefined,
            }, 502);
          }
          const mp3 = await r11.arrayBuffer();
          if (!mp3 || mp3.byteLength < 400) return json({ error: "ElevenLabs повернув порожнє аудіо" }, 502);
          return new Response(mp3, {
            status: 200,
            headers: { ...cors, "content-type": "audio/mpeg", "cache-control": "no-store", "X-TTS-Engine": "elevenlabs" },
          });
        }

        if (!env.AZURE_SPEECH_KEY || !env.AZURE_SPEECH_REGION) {
          return json({
            error: "Нейронний голос не налаштований: додай ELEVENLABS_KEY",
          }, 503);
        }

        const voice = TTS_VOICES.includes(body.voice) ? body.voice : "uk-UA-OstapNeural";
        const lang = voice.slice(0, 5);

        const ssml = "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='" + lang + "'>"
          + "<voice name='" + voice + "'>"
          + "<prosody pitch='" + pitch + "' rate='" + rate + "'>" + xmlEsc(text) + "</prosody>"
          + "</voice></speak>";

        const r = await fetch(
          "https://" + env.AZURE_SPEECH_REGION + ".tts.speech.microsoft.com/cognitiveservices/v1",
          {
            method: "POST",
            headers: {
              "Ocp-Apim-Subscription-Key": env.AZURE_SPEECH_KEY,
              "Content-Type": "application/ssml+xml",
              "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
              "User-Agent": "Frequency",
            },
            body: ssml,
          }
        );

        if (!r.ok) {
          const detail = (await r.text().catch(() => "")).slice(0, 200);
          return json({ error: "Azure TTS: HTTP " + r.status + (detail ? " · " + detail : "") }, 502);
        }

        const mp3 = await r.arrayBuffer();
        if (!mp3 || mp3.byteLength < 400) return json({ error: "Azure TTS повернув порожнє аудіо" }, 502);

        return new Response(mp3, {
          status: 200,
          headers: { ...cors, "content-type": "audio/mpeg", "cache-control": "no-store", "X-TTS-Engine": "azure" },
        });
      } catch (e) {
        return json({ error: String((e && e.message) || e) }, 502);
      }
    }

    /* ═══ РОЗМОВА З МОДЕЛЛЮ ═══ */
    try {
      if (!env.ANTHROPIC_API_KEY) {
        return json({ error: "На воркері не заданий ANTHROPIC_API_KEY" }, 500);
      }

      const body = await request.json();
      const wantStream = !!body.stream;

      /* Модель: підміняємо застарілу назву, перевіряємо дозвіл */
      let model = String(body.model || "");
      if (MODEL_ALIAS[model]) model = MODEL_ALIAS[model];
      if (!MODELS[model]) model = MODEL_DEFAULT;
      if (OPUS_MODELS.includes(model) && String(env.ALLOW_OPUS || "") !== "1") {
        return json({ error: "Opus на цьому воркері вимкнений (відкрити — змінна ALLOW_OPUS=1)", model }, 403);
      }
      const caps = MODELS[model];

      /* Стеля відповіді. Колись тут стояло жорстке 4096 — довгі плани
         обривались на півслові; потім зі стрімом дозволялось 64000 —
         це вже дірка в гаманці. Тепер: не більше MAX_TOKENS_CAP. */
      const asked = +body.max_tokens || 2048;
      const ceiling = Math.min(caps.maxOut, MAX_TOKENS_CAP);
      const maxTok = Math.min(Math.max(asked, 256), ceiling);

      const payload = {
        model,
        max_tokens: maxTok,
        messages: Array.isArray(body.messages) ? body.messages : [],
      };

      /* ── Кешування підказки ──────────────────────────────────────
         Системна підказка й опис 14 інструментів однакові з ходу в
         хід, але досі летіли в модель щоразу заново. Позначаємо їх
         як кешовані: повторне читання коштує близько десятої частини
         ціни. В агентному циклі, де ходів буває 3-5, це помітно.

         Агент шле підказку вже готовими блоками: незмінна частина з
         позначкою кешу + свіжа (дата, контекст). Раніше воркер робив з
         масиву String(...) і модель отримувала «[object Object],[object
         Object]» замість персони, правил і сьогоднішньої дати. Тепер
         масив проходить як є (лише текстові блоки), рядок — як раніше. */
      if (Array.isArray(body.system)) {
        const blocks = body.system
          .filter((b) => b && b.type === "text" && typeof b.text === "string" && b.text)
          .map((b) => (b.cache_control
            ? { type: "text", text: b.text, cache_control: b.cache_control }
            : { type: "text", text: b.text }));
        if (blocks.length) payload.system = blocks;
      } else if (body.system) {
        payload.system = [{
          type: "text",
          text: String(body.system),
          cache_control: { type: "ephemeral" },
        }];
      }

      if (Array.isArray(body.tools) && body.tools.length) {
        const tools = body.tools.map((t) => ({ ...t }));
        // кеш-межа ставиться на ОСТАННІЙ інструмент — так у кеш
        // потрапляє весь їх перелік разом
        tools[tools.length - 1] = {
          ...tools[tools.length - 1],
          cache_control: { type: "ephemeral" },
        };
        payload.tools = tools;
      }
      if (body.tool_choice) payload.tool_choice = body.tool_choice;

      /* ── Думання ─────────────────────────────────────────────────
         Найбільша зміна. Модель сама вирішує, скільки міркувати над
         задачею. Саме це відрізняє «склав список» від «побачив
         закономірність» — тобто рівно те, що потрібно для пошуку
         патернів у щоденнику й для складання плану дня.

         Вмикаємо лише там, де модель це вміє. Застосунок повертає
         блоки думання назад у розмову (conv.push з усім content),
         тому агентний цикл від цього не ламається.                 */
      if (caps.thinking === "adaptive" && body.thinking !== false) {
        payload.thinking = { type: "adaptive" };
      }

      /* Глибина роботи. Застосунок може попросити свою; за
         замовчуванням не задаємо нічого — це те саме, що 'high'. */
      if (caps.effort && EFFORTS.includes(body.effort)) {
        payload.output_config = { effort: body.effort };
      }

      if (wantStream) payload.stream = true;

      /* ── Запит до Anthropic ── */
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), UPSTREAM_TIMEOUT_MS);
      let r;
      try {
        r = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-api-key": env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify(payload),
          signal: ctl.signal,
        });
      } catch (e) {
        clearTimeout(timer);
        if (e && e.name === "AbortError") {
          return json({ error: "Модель не відповіла за " + Math.round(UPSTREAM_TIMEOUT_MS / 1000) + " с" }, 504);
        }
        throw e;
      }
      clearTimeout(timer);

      if (wantStream && r.ok && r.body) {
        return new Response(r.body, {
          status: r.status,
          headers: { ...cors, "content-type": "text/event-stream", "cache-control": "no-cache" },
        });
      }

      const data = await r.json();

      /* ── Зрозуміла помилка ───────────────────────────────────────
         Раніше застосунок показував голе «HTTP 400» — і шукати
         причину не було де. Тепер віддаємо те, що сказала Anthropic:
         скінчились кошти, невідома модель, задовгий запит тощо.     */
      if (!r.ok) {
        const msg = (data && data.error && data.error.message) || ("HTTP " + r.status);
        return json({ error: msg, type: (data && data.error && data.error.type) || null, model }, r.status);
      }

      return json(data, r.status);
    } catch (e) {
      return json({ error: String((e && e.message) || e) }, 500);
    }
  },
};

function base64FromBytes(bytes) {
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

function xmlEsc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
