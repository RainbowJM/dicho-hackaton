const staticCacheName = 'site-static-v7';
const assets = [
    '/',
    '/offline', 
    '/styles/style.css',
    '/scripts/loading.js',
    '/scripts/preview.js',
    '/scripts/script.js'
];

self.addEventListener('install', (event) => {

    // The promise that skipWaiting() returns can be safely ignored.
    // bron: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting 
    
    console.log("Service worker has been installed")
    event.waitUntil(
    caches.open(staticCacheName).then(cache => {
        console.log("catching shell assets");
        cache.addAll(assets);
    }).then(() => self.skipWaiting())
  )
});
  
// activate service worker
self.addEventListener('activate', event => {
    console.log('Activating service worker')
    event.waitUntil(
        caches.keys()
            .then(names => {
                return Promise.all(names
                    .filter(name => name !== cacheName && name !== runtimeCacheName)
                    .map(key => caches.delete(key)))
            })
    )
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((cacheRes) => {
        if (cacheRes) {
          return cacheRes;
        }
        return fetch(event.request).catch(() => {
          return caches.match("/offline");
        });
      })
    );
  });