// e23: https://www.youtube.com/watch?v=ZfL61cOUImw

// Static Cache
const staticCacheName = "site-static-v5.1";
// Dynamic Cache
const dynamicCacheName = "site-dynamic-v5.1";

// Cache Assets
const assets = [
  "index.html",
  "assets/js/app.js",
  "assets/js/bootstrap.min.js",
  "assets/js/ui.js",
  "assets/css/boostrap.min.css",
  "assets/css/sidebar.css",
  "assets/css/style.css",
  "assets/img/tdi-logo.png",
  "assets/img/sponsors/dxc-black.png",
  "assets/img/sponsors/leonardo-logo.svg",
  "assets/img/icons/tdi.ico",
  "https://kit.fontawesome.com/78b1d29e85.js",
  "https://fonts.googleapis.com/css?family=Roboto:500|Poppins:600&display=swap",
  "pages/fallback.html"
];

// Limit cache size function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// Install service worker
self.addEventListener("install", evt => {
  // console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log("caching shell assets");
      cache.addAll(assets);
    })
  );
});

// Activate service worker
self.addEventListener("activate", evt => {
  // console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      // console.log(keys);
      return Promise.all(
        keys
          .filter(key => key !== staticCacheName && key !== dynamicCacheName)
          .map(key => caches.delete(key))
      );
    })
  );
});

// Fetch event - get cached
self.addEventListener("fetch", evt => {
  // console.log('fetch event', evt);
  evt.respondWith(
    caches
      .match(evt.request)
      .then(cacheRes => {
        return (
          cacheRes ||
          fetch(evt.request).then(fetchRes => {
            return caches.open(dynamicCacheName).then(cache => {
              cache.put(evt.request.url, fetchRes.clone());
              // Limits 'dynamicCacheName' cached items size
              limitCacheSize(dynamicCacheName, 15);
              return fetchRes;
            });
          })
        );
      })
      // If .html file fails to load, 'fallback.html' is returned instead
      .catch(() => {
        if (evt.request.url.indexOf(".html") > -1) {
          return caches.match("/pages/fallback.html");
        }
      })
  );
});
