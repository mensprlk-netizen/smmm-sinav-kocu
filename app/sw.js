// Service worker: uygulamayı çevrimdışı çalıştırır.
importScripts('sw-manifest.js');
const PREFIX = 'smmm-koc-';
const CACHE = PREFIX + self.__VERSION;

// Hepsi ya da hiç: bir dosya inemezse kurulum başarısız olur, eski sürüm hizmet vermeye devam eder.
// HTTP önbelleği atlanır; böylece yeni sürüm eski dosyalardan kurulmaz.
self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const existed = await caches.has(CACHE);
    const cache = await caches.open(CACHE);
    try {
      await Promise.all(self.__PRECACHE.map(async (u) => {
        const req = new Request(new URL(u, location.href).href, { cache: 'reload' });
        const res = await fetch(req);
        if (!res.ok) throw new Error('Önbelleğe alınamadı: ' + u + ' (' + res.status + ')');
        await cache.put(req, res);
      }));
    } catch (err) {
      // Yarım dolu önbellek kalmasın; ama önceden var olan (hizmet veren) önbelleğe dokunulmaz.
      if (!existed) await caches.delete(CACHE);
      throw err;
    }
  })());
});

// Aynı kaynağı paylaşan başka uygulamaların önbelleklerine dokunulmaz.
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) {
      if (k.startsWith(PREFIX) && k !== CACHE) { try { await caches.delete(k); } catch { /* sonraki sefer */ } }
    }
    await self.clients.claim();
  })());
});

self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(e.request, { ignoreSearch: true });
    if (hit) return hit;
    let res;
    try {
      res = await fetch(e.request);
    } catch {
      if (e.request.mode === 'navigate') {
        const home = await cache.match('./index.html');
        if (home) return home;
      }
      return new Response('', { status: 503 });
    }
    if (res.ok) { try { await cache.put(e.request, res.clone()); } catch { /* kota vb. */ } }
    return res;
  })());
});
