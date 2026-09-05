/* ════════ Service Worker Frequency: офлайн + швидкий повторний старт ════════
   Стратегія: сторінка та ресурси віддаються з кешу миттєво (stale-while-revalidate),
   свіжа версія тихо тягнеться мережею і стає доступною з наступного запуску.
   Версію підставляє збірка — новий білд = новий кеш, старі чистяться. */
const VERSION = '2026-09-05-1739-0548bd7';
const CACHE = 'frequency-' + VERSION;
const PRECACHE = [
  './', './index.html',
  './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png',
  './vendor/jszip.min.js', './vendor/pdf.min.js', './vendor/supabase.min.js',
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // Supabase та інші домени — повз кеш
  const key = req.mode === 'navigate' ? './index.html' : req;
  e.respondWith(caches.open(CACHE).then(async c => {
    const cached = await c.match(key);
    const net = fetch(req)
      .then(res => { if (res && res.ok) c.put(key, res.clone()); return res; })
      .catch(() => null);
    if (cached) return cached;          // мережевий результат уже оновлює кеш у фоні
    const res = await net;
    return res || Response.error();
  }));
});
