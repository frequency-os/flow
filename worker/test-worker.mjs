/* Перевірка воркера без Cloudflare і без грошей.
   Запуск:  node worker/test-worker.mjs [шлях-до-воркера.js]
   Мережу підміняємо: запит до Anthropic не йде, ми лише дивимось,
   ЩО воркер туди відправив би. Так само підміняємо Supabase.      */
import { pathToFileURL } from "node:url";
import path from "node:path";

const file = path.resolve(process.argv[2] || new URL("./flow-ai-worker.js", import.meta.url).pathname);
const worker = (await import(pathToFileURL(file).href)).default;

let sent = [];                       // що воркер відправив «назовні»
globalThis.fetch = async (url, init = {}) => {
  sent.push({ url: String(url), init });
  if (String(url).includes("/auth/v1/user")) {
    const ok = String((init.headers || {}).authorization || "").startsWith("Bearer good");
    return new Response(JSON.stringify(ok ? { id: "u1", email: "me@example.com" } : { msg: "bad" }),
      { status: ok ? 200 : 401, headers: { "content-type": "application/json" } });
  }
  return new Response(JSON.stringify({ content: [{ type: "text", text: "ok" }] }),
    { status: 200, headers: { "content-type": "application/json" } });
};
const toAnthropic = () => sent.filter((s) => s.url.includes("api.anthropic.com"));
const lastPayload = () => { const a = toAnthropic(); return a.length ? JSON.parse(a[a.length - 1].init.body) : null; };

const GH = "https://frequency-os.github.io";
let ipN = 0;
async function call({ body = {}, origin = GH, method = "POST", pathName = "/", env = {}, headers = {}, ip } = {}) {
  sent = [];
  const h = { "content-type": "application/json", "cf-connecting-ip": ip || "10.0.0." + (++ipN), ...headers };
  if (origin) h.origin = origin;           // "" — запит зовсім без Origin
  const req = new Request("https://flowai.example.workers.dev" + pathName,
    { method, headers: h, body: method === "POST" ? JSON.stringify(body) : undefined });
  return worker.fetch(req, { ANTHROPIC_API_KEY: "test", ...env });
}
const msgs = [{ role: "user", content: "привіт" }];

let fails = 0;
function check(name, ok, got) {
  if (!ok) fails++;
  console.log((ok ? "✅ " : "❌ ") + name + (ok ? "" : "  → отримали: " + got));
}

/* 1. Системна підказка агента — масив блоків (AI-1) */
{
  await call({ body: { model: "claude-sonnet-4-6", messages: msgs, system: [
    { type: "text", text: "STABLE-персона", cache_control: { type: "ephemeral" } },
    { type: "text", text: "DYNAMIC-дата" },
  ] } });
  const s = (lastPayload() || {}).system;
  const txt = JSON.stringify(s);
  check("масив system не стає «[object Object]»", !txt.includes("[object Object]"), txt);
  check("масив system доходить обома блоками з кеш-позначкою на першому",
    Array.isArray(s) && s.length === 2 && s[0].text === "STABLE-персона" && s[1].text === "DYNAMIC-дата"
      && s[0].cache_control && !s[1].cache_control, txt);
}
/* 2. Рядок system — як раніше */
{
  await call({ body: { messages: msgs, system: "Ти помічник" } });
  const s = (lastPayload() || {}).system;
  check("рядок system → один блок з кешем",
    Array.isArray(s) && s.length === 1 && s[0].text === "Ти помічник" && s[0].cache_control, JSON.stringify(s));
}
/* 3. Чужий сайт */
{
  const r = await call({ origin: "https://evil.example", body: { messages: msgs } });
  check("чужий Origin → 403 і в Anthropic нічого не пішло", r.status === 403 && toAnthropic().length === 0,
    r.status + ", запитів до Anthropic: " + toAnthropic().length);
  const p = await call({ origin: "https://evil.example", method: "OPTIONS" });
  check("чужий Origin, передперевірка OPTIONS → 403", p.status === 403, p.status);
  const ok = await call({ method: "OPTIONS" });
  check("свій сайт, OPTIONS → 204, Origin віддзеркалено, authorization дозволено",
    ok.status === 204 && ok.headers.get("access-control-allow-origin") === GH
      && /authorization/.test(ok.headers.get("access-control-allow-headers") || ""),
    ok.status + " " + ok.headers.get("access-control-allow-origin") + " " + ok.headers.get("access-control-allow-headers"));
  // file:// в Electron не шле Origin зовсім — за замовчуванням таких пускаємо
  const noOrigin = await call({ origin: "", body: { messages: msgs } });
  check("запит без Origin (file:// в Electron) за замовчуванням пускаємо", noOrigin.status === 200, noOrigin.status);
  const strict = await call({ origin: "", env: { ALLOWED_ORIGINS: GH }, body: { messages: msgs } });
  check("ALLOWED_ORIGINS без «none» → запит без Origin 403", strict.status === 403, strict.status);
}
/* 4. Живі місця, звідки ходить застосунок */
for (const o of ["null", "app://frequency", "capacitor://localhost", "http://localhost:4173", GH]) {
  const r = await call({ origin: o, body: { messages: msgs } });
  check("Origin " + o + " пускаємо", r.status === 200 && r.headers.get("access-control-allow-origin") === o,
    r.status + " " + r.headers.get("access-control-allow-origin"));
}
{
  const env = { ALLOWED_ORIGINS: "https://x.test" };
  const a = await call({ env, body: { messages: msgs } });
  const b = await call({ env, origin: "https://x.test", body: { messages: msgs } });
  check("ALLOWED_ORIGINS замінює список", a.status === 403 && b.status === 200, a.status + "/" + b.status);
}
/* 5. Opus і стеля відповіді */
{
  const r = await call({ body: { model: "claude-opus-5", stream: true, max_tokens: 64000, messages: msgs } });
  check("Opus без ALLOW_OPUS → відмова 403, в Anthropic нічого", r.status === 403 && toAnthropic().length === 0,
    r.status + ", запитів до Anthropic: " + toAnthropic().length);
  const r2 = await call({ env: { ALLOW_OPUS: "1" }, body: { model: "claude-opus-5", stream: true, max_tokens: 64000, messages: msgs } });
  const p = lastPayload() || {};
  check("Opus з ALLOW_OPUS=1 проходить, але max_tokens ≤ 8192", r2.status === 200 && p.model === "claude-opus-5" && p.max_tokens <= 8192,
    r2.status + " " + p.model + " " + p.max_tokens);
  await call({ body: { model: "claude-sonnet-4-6", stream: true, max_tokens: 64000, messages: msgs } });
  const p2 = lastPayload() || {};
  check("Sonnet зі стрімом просить 64000 → стеля 8192", p2.model === "claude-sonnet-5" && p2.max_tokens === 8192,
    p2.model + " " + p2.max_tokens);
  await call({ body: { model: "claude-haiku-4-5-20251001", messages: msgs } });
  check("Haiku з датою в назві лишається Haiku (не дорожчий Sonnet)", (lastPayload() || {}).model === "claude-haiku-4-5",
    (lastPayload() || {}).model);
}
/* 6. Невідома адреса */
{
  const r = await call({ pathName: "/translate", body: { text: "Привіт", target: "en" } });
  check("/translate → 404, модель не кличемо", r.status === 404 && toAnthropic().length === 0, r.status);
}
/* 7. Ліміт частоти на IP */
{
  let last;
  for (let i = 0; i < 31; i++) last = await call({ ip: "9.9.9.9", body: { messages: msgs } });
  check("31-й запит за хвилину з однієї IP → 429 з Retry-After",
    last.status === 429 && +last.headers.get("retry-after") > 0, last.status + " " + last.headers.get("retry-after"));
  const other = await call({ ip: "9.9.9.10", body: { messages: msgs } });
  check("інша IP при цьому працює", other.status === 200, other.status);
}
/* 8. Вхід через Supabase */
{
  const r0 = await call({ body: { messages: msgs } });
  check("без SUPABASE_* токен не потрібен (як було)", r0.status === 200, r0.status);
  const env = { SUPABASE_URL: "https://proj.supabase.co", SUPABASE_ANON: "anon" };
  const a = await call({ env, body: { messages: msgs } });
  check("з SUPABASE_*: без токена → 401", a.status === 401 && toAnthropic().length === 0, a.status);
  const b = await call({ env, headers: { authorization: "Bearer bad" }, body: { messages: msgs } });
  check("з SUPABASE_*: чужий/старий токен → 401", b.status === 401 && toAnthropic().length === 0, b.status);
  const c = await call({ env, headers: { authorization: "Bearer good" }, body: { messages: msgs } });
  const asked = sent.find((s) => s.url === "https://proj.supabase.co/auth/v1/user");
  check("з SUPABASE_*: живий токен → 200, питали саме /auth/v1/user", c.status === 200 && !!asked, c.status);
  const d = await call({ env: { ...env, ALLOWED_USERS: "other@example.com" }, headers: { authorization: "Bearer good2" }, body: { messages: msgs } });
  check("ALLOWED_USERS без цієї людини → не пускаємо", d.status === 401 || d.status === 403, d.status);
}

console.log(fails ? "\n❌ Не пройшло перевірок: " + fails : "\n✅ Воркер: усі перевірки пройдено");
process.exit(fails ? 1 : 0);
