const CACHE_NAME = 'launica-v13.7-offline';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './app.js',
  'https://cdn-icons-png.flaticon.com/512/3443/3443314.png' // Tu icono de dona
];

// Instalar y guardar interfaz
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Limpiar versiones viejas si actualizas
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Interceptar peticiones
self.addEventListener('fetch', e => {
  // CRÍTICO: Dejar que Firebase maneje sus propias conexiones para no romper la sincronización
  if (e.request.url.includes('firestore.googleapis.com') || e.request.url.includes('firebase')) {
      return; 
  }

  // Para todo lo demás (tu diseño, HTML, icono), usar caché si no hay red
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request).then(fetchRes => {
          return caches.open(CACHE_NAME).then(cache => {
              // Guardar dinámicamente tipografías o librerías (XLSX) al navegar
              if (e.request.method === 'GET') {
                  cache.put(e.request.url, fetchRes.clone());
              }
              return fetchRes;
          });
      });
    }).catch(() => {
        // Si falla todo, cargar la vista principal
        return caches.match('./index.html');
    })
  );
});
