var staticCacheName = 'my-domain-cache-v1';

// Cache files
self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(staticCacheName).then(function (cache) {
    return cache.addAll([
        "/assets/book.d5d4d78e.jpg",
        "/assets/bahanrion.988e6f8e.png",
        "/assets/komputerion.95532d34.png",
        "/assets/evaluasion.0bfe8964.png",
        "/assets/nos.fdeabbb2.jpg",
        "/index.html",
        "/assets/swipe-back.4518aff9.js",
        "/assets/index10.905aa9e7.js",
        "/assets/web-vitals.es5.min.9bcab501.js",
        "/assets/input-shims.92ecb113.js",
        "/assets/ios.transition.cdf7f680.js",
        "/assets/status-tap.a525596f.js",
        "/assets/md.transition.c26622a7.js",
        "/assets/web.6f5f70dd.js",
        "/assets/index.645c0570.css",
        "/assets/browser-ponyfill.4aaee4c4.js",
        "/assets/swiper.bundle.e4553556.js",
        "/assets/index.b3619fed.js",
    ]);
  }));
});

// Remove old data/cache
self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (cacheNames) {
    return Promise.all(cacheNames.filter(function (cacheName) {
      return cacheName.startsWith('my-domain-cache-') && cacheName != staticCacheName;
    }).map(function (cacheName) {
      return caches['delete'](cacheName);
    }));
  }));
});

// Serve files from cache
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(staticCacheName).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request, {
          mode: 'no-cors'
        }).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

self.addEventListener('message', (event) => {
  if (!event.data){
    return;
  }
  if ('skipWaiting' === event.data.action) {
    self.skipWaiting();
  }
});