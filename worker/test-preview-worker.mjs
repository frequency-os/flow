/* Перевірка воркера прев'ю без Cloudflare.
   Запуск:  node worker/test-preview-worker.mjs
   Мережу підміняємо: «сайти» нижче — вигадані відповіді.          */
import { pathToFileURL } from "node:url";
import path from "node:path";

const file = path.resolve(new URL("./preview-worker.js", import.meta.url).pathname);
const worker = (await import(pathToFileURL(file).href)).default;

const PNG = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 1, 2, 3, 4]);
let sent = [];
globalThis.fetch = async (url, init = {}) => {
  url = String(url); sent.push(url);
  const H = (o) => ({ headers: o });
  if (url.includes("/auth/v1/user")) {
    const ok = String((init.headers || {}).authorization || "").startsWith("Bearer good");
    return new Response(JSON.stringify(ok ? { id: "u1", email: "me@example.com" } : {}), { status: ok ? 200 : 401 });
  }
  if (url === "https://site.example.com/post")
    return new Response(`<html><head><title>Запасна назва</title>
      <meta content="Паста &amp; томати" property="og:title">
      <meta property='og:description' content='Рецепт на 20 хв &#8212; смачно'>
      <meta property="og:image" content="/img/cover.png"></head></html>`, H({ "content-type": "text/html; charset=utf-8" }));
  if (url === "https://site.example.com/img/cover.png") return new Response(PNG, H({ "content-type": "image/png" }));
  if (url === "https://site.example.com/to-local") return new Response("", { status: 302, headers: { location: "http://127.0.0.1/admin" } });
  if (url === "https://site.example.com/to-ok") return new Response("", { status: 301, headers: { location: "/post" } });
  if (url === "https://site.example.com/bad-img")
    return new Response(`<meta property="og:image" content="https://site.example.com/evil.svg"><meta property="og:title" content="Т">`, H({ "content-type": "text/html" }));
  if (url === "https://site.example.com/evil.svg") return new Response("<svg onload=alert(1)>", H({ "content-type": "image/svg+xml" }));
  if (url === "https://site.example.com/huge")
    return new Response(`<meta property="og:image" content="https://site.example.com/huge.png">`, H({ "content-type": "text/html" }));
  if (url === "https://site.example.com/huge.png") {
    const b = new Uint8Array(40); b.set([137, 80, 78, 71, 13, 10, 26, 10]); b.set([0, 0, 0x75, 0x30, 0, 0, 0x75, 0x30], 16);   // 30000×30000
    return new Response(b, H({ "content-type": "image/png" }));
  }
  if (url === "https://site.example.com/pdf") return new Response("%PDF", H({ "content-type": "application/pdf" }));
  return new Response("not found", { status: 404 });
};

const GH = "https://frequency-os.github.io";
const ENV = { SUPABASE_URL: "https://sb.example.co", SUPABASE_ANON: "anon" };
let ipN = 0;
async function call({ body = { url: "https://site.example.com/post" }, origin = GH, method = "POST", pathName = "/preview", env = ENV, tok = "good1" } = {}) {
  sent = [];
  const h = { "content-type": "application/json", "cf-connecting-ip": "10.0.0." + (++ipN) };
  if (origin) h.origin = origin;
  if (tok) h.authorization = "Bearer " + tok;
  const req = new Request("https://flow-preview.example.workers.dev" + pathName,
    { method, headers: h, body: method === "POST" ? JSON.stringify(body) : undefined });
  const r = await worker.fetch(req, env);
  let j = null; try { j = await r.clone().json(); } catch (_) {}
  return { s: r.status, j, r };
}
let fails = 0;
const check = (name, ok, got) => { if (!ok) fails++; console.log((ok ? "✅ " : "❌ ") + name + (ok ? "" : "  → " + JSON.stringify(got))); };

let x = await call();
check("прев'ю: назва з og:title, сутності розкодовано", x.s === 200 && x.j.title === "Паста & томати", x);
check("прев'ю: опис із &#8212;", x.j && x.j.desc === "Рецепт на 20 хв — смачно", x.j);
check("прев'ю: відносна картинка → data:image/png", x.j && x.j.image.startsWith("data:image/png;base64,"), x.j && x.j.image.slice(0, 40));
check("CORS віддзеркалює дозволену сторінку", x.r.headers.get("access-control-allow-origin") === GH, x.r.headers.get("access-control-allow-origin"));

x = await call({ origin: "https://evil.example" });
check("чужий сайт → 403", x.s === 403, x.s);
x = await call({ tok: "" });
check("без входу → 401", x.s === 401, x.s);
x = await call({ tok: "bad" });
check("протухла сесія → 401", x.s === 401, x.s);
x = await call({ env: {} });
check("без SUPABASE_* воркер не працює → 503, назовні нічого", x.s === 503 && sent.length === 0, [x.s, sent]);
x = await call({ pathName: "/" });
check("інша адреса → 404", x.s === 404, x.s);
x = await call({ method: "GET" });
check("GET → 405", x.s === 405, x.s);

for (const u of ["http://127.0.0.1/", "http://localhost:8787/", "https://[::1]/", "http://2130706433/", "http://0x7f000001/",
  "https://printer.local/", "https://intranet/", "file:///etc/passwd", "javascript:alert(1)", "https://user:pw@site.example.com/",
  "https://site.example.com:8443/", "https://metadata.internal/"]) {
  x = await call({ body: { url: u } });
  check("не відкриваємо " + u, x.s === 400 && !sent.some((s) => !s.includes("/auth/v1/user")), [x.s, sent]);
}
x = await call({ body: { url: "https://site.example.com/to-local" } });
check("перенаправлення на 127.0.0.1 зупинено", x.s === 422 && !sent.some((s) => s.includes("127.0.0.1")), [x.s, sent]);
x = await call({ body: { url: "https://site.example.com/to-ok" } });
check("звичайне перенаправлення працює", x.s === 200 && x.j.title === "Паста & томати", x.j);
x = await call({ body: { url: "https://site.example.com/bad-img" } });
check("SVG не віддаємо як картинку", x.s === 200 && x.j.image === "", x.j);
x = await call({ body: { url: "https://site.example.com/huge" } });
check("картинку 30000×30000 не віддаємо", x.s === 200 && x.j.image === "", x.j);
x = await call({ body: { url: "https://site.example.com/pdf" } });
check("не сторінка (pdf) → 422", x.s === 422, x.s);
x = await call({ body: { url: "https://site.example.com/nope" } });
check("404 сайту → 502", x.s === 502, x.s);

let last;
for (let i = 0; i < 22; i++) {
  const req = new Request("https://w/preview", { method: "POST", headers: { origin: GH, "cf-connecting-ip": "9.9.9.9", authorization: "Bearer good2", "content-type": "application/json" }, body: JSON.stringify({ url: "https://site.example.com/post" }) });
  last = await worker.fetch(req, ENV);
}
check("ліміт: 22-й запит за хвилину → 429", last.status === 429, last.status);

console.log(fails ? `\n❌ Провалено: ${fails}` : "\n✅ Усі перевірки воркера прев'ю пройдено");
process.exit(fails ? 1 : 0);
