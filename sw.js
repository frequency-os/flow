/* ════════ Service Worker Frequency: офлайн + швидкий повторний старт ════════
   Стратегія:
   · сторінка (навігація) — спершу мережа, щоб нова версія приходила з ПЕРШОГО
     запуску після публікації. Нема мережі або вона повисла довше NAV_WAIT —
     віддаємо збережену копію, і застосунок відкривається офлайн;
   · решта файлів (vendor/, іконки, маніфест) — з кешу цієї версії, мережа лише
     якщо файла там ще нема. Вони міняються тільки разом із версією.
   Версію підставляє збірка — новий білд = новий кеш, старі чистяться. */
const VERSION = '2026-10-10-0118-5e59d1a';
const CACHE = 'frequency-' + VERSION;
// Сторінка кешується ОДИН раз, під цим ключем. Раніше './' і './index.html'
// лежали двома копіями по 2.8 МБ, хоча це той самий файл.
const INDEX = './index.html';
const PRECACHE = [
  INDEX,
  './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png',
  './hero-assets.js',     // кадри героїв загону (48-hero.js), ліниво після старту
  './hero-outfits.js',    // одяг героїв (шафа 48-hero.js)
  './fonts-caveat.css',   // рукописний шрифт, вантажиться після першого кадру (01-base.js)
  './vendor/jszip.min.js', './vendor/pdf.min.js', './vendor/supabase.min.js',
];
const NAV_WAIT = 4000; // мс: далі чекати мережу немає сенсу — показуємо копію
const NAV_ABORT = 15000; // мс: сервер так і не відповів — обриваємо запит зовсім

self.addEventListener('install', e => {
  self.skipWaiting();
  // cache:'reload' — повз HTTP-кеш браузера: інакше в кеш нової версії
  // могла б лягти стара сторінка (GitHub Pages тримає її 10 хв).
  e.waitUntil(caches.open(CACHE).then(c =>
    c.addAll(PRECACHE.map(u => new Request(u, { cache: 'reload' })))));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Мітка версії файла від сервера. Та сама мітка — той самий файл.
const stamp = r => (r && (r.headers.get('etag') || r.headers.get('last-modified'))) || '';

/* Оновлюємо офлайн-копію сторінки лише тоді, коли вона справді інша.
   Раніше кожен старт переписував 2.8 МБ у Cache Storage, навіть якщо
   нічого не змінилось. */
async function keepIndex(c, res){
  const old = await c.match(INDEX);
  const s = stamp(res);
  if (old && s && stamp(old) === s) return;
  await c.put(INDEX, res);
}

function navigate(e){
  const opened = caches.open(CACHE);
  // no-cache: браузер перепитає сервер (304, якщо не змінилось), а не
  // віддасть сторінку зі свого HTTP-кешу — так нова версія видна одразу.
  // Копію знімаємо одразу, доки тіло відповіді ще ніхто не почав читати.
  // Як копію сторінки беремо лише HTML без переадресації: пряме відкриття,
  // скажімо, vendor/pdf.min.js не повинно лягти в кеш замість сторінки.
  const isPage = r => r && r.ok && !r.redirected && /text\/html/i.test(r.headers.get('content-type') || '');
  // Запит, на який сервер не відповідає взагалі, обриваємо через NAV_ABORT.
  // Інакше waitUntil тримає його до TCP-таймауту: наступні старти стоять за
  // ним у черзі й бачать стару копію, а новий воркер не стає активним.
  // Таймер знімаємо, щойно прийшли заголовки, — повільне, але живе
  // завантаження сторінки на поганій мережі не ріжемо.
  const ctl = typeof AbortController === 'function' ? new AbortController() : null;
  const kill = ctl ? setTimeout(() => ctl.abort(), NAV_ABORT) : 0;
  const net = fetch(e.request.url, { cache: 'no-cache', credentials: 'same-origin', signal: ctl ? ctl.signal : undefined })
    .then(res => { clearTimeout(kill); return { res, copy: isPage(res) ? res.clone() : null }; },
          err => { clearTimeout(kill); throw err; });
  // waitUntil — синхронно, поки подія жива: запис копії доживе, навіть
  // якщо сторінку вже віддали з кешу через таймаут.
  e.waitUntil(Promise.all([opened, net])
    .then(([c, n]) => n.copy ? keepIndex(c, n.copy) : null).catch(() => {}));
  // Навігації не можна віддати відповідь, що пройшла через переадресацію, —
  // браузер покаже помилку. Тоді просимо його самого перейти за адресою.
  const out = r => r.redirected ? Response.redirect(r.url, 302) : r;
  return opened.then(async c => {
    const cached = await c.match(INDEX);
    if (!cached) return net.then(n => out(n.res), () => Response.error());
    return new Promise(resolve => {
      const t = setTimeout(() => resolve(cached), NAV_WAIT);
      net.then(n => { clearTimeout(t); resolve(n.res && n.res.ok ? out(n.res) : cached); },
               () => { clearTimeout(t); resolve(cached); });
    });
  });
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // Supabase та інші домени — повз кеш
  if (req.mode === 'navigate') {
    // Офлайн-копія — лише сам Frequency (корінь або index.html). Інші сторінки
    // сайту (гра misto.html) ідуть повз воркер: інакше navigate() записав би
    // їх у кеш замість застосунку, і Frequency без мережі відкривався б ними.
    if (!/\/(index\.html)?$/.test(url.pathname)) return;
    e.respondWith(navigate(e)); return;
  }
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(req);
    if (hit) return hit;
    const res = await fetch(req).catch(() => null);
    if (res && res.ok && res.type === 'basic') e.waitUntil(c.put(req, res.clone()).catch(() => {}));
    return res || Response.error();
  }));
});
