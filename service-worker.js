const CACHE = 'cc-albercas-muestra-v2';
const CORE_FILES = [
  './',
  './index.html',
  './admin.html',
  './css/styles.css?v=2',
  './css/admin.css',
  './js/app.js?v=2',
  './js/ambiente.js',
  './js/admin.js',
  './js/supabase-config.js',
  './manifest.webmanifest',
  './images/icon-192.png',
  './images/icon-512.png',
  './images/logo-cc.png',
  './images/proyectos/alberca-muro-verde.jpg',
  './images/proyectos/alberca-residencial-amplia.jpg',
  './images/proyectos/alberca-cascada-residencial.jpg',
  './images/muestra/equipos-pentair.jpg',
  './images/muestra/sistema-pentair.jpg',
  './images/muestra/bomba-aqua-pak-silver-h.jpg',
  './images/muestra/bomba-aqua-pak-supra-f.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
      return response;
    }).catch(() => caches.match('./index.html')))
  );
});
