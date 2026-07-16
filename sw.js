/* Service Worker de BETH YOSEF (app instalable)
   Estrategia: "stale-while-revalidate" — muestra AL INSTANTE lo que ya
   tiene guardado (funciona aunque los datos vayan lentos) y actualiza en
   segundo plano para la próxima vez. */
const CACHE = 'bethyosef-v2';

self.addEventListener('install', function (e) { self.skipWaiting(); });

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(
    caches.match(req).then(function (cached) {
      var red = fetch(req).then(function (res) {
        try {
          var copia = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copia); }).catch(function () {});
        } catch (err) {}
        return res;
      }).catch(function () { return cached; });
      return cached || red;   // si ya está guardado, lo muestra YA; si no, espera la red
    })
  );
});
