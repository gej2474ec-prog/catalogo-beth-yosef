/* Service Worker de BETH YOSEF (app instalable)
   Estrategia: primero internet (para tener siempre lo nuevo),
   y si no hay conexion, usa lo guardado. */
const CACHE = 'bethyosef-v1';

self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { self.clients.claim(); });

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // Solo manejar GET del mismo sitio (no la Hoja de Google ni otros)
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(
    fetch(req)
      .then((res) => {
        const copia = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copia)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req))
  );
});
