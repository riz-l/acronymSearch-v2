// Service Worker Version == v2.2.1
// e18: https://www.youtube.com/watch?v=ChXgikdQJR8

// Static Cache
const staticCacheName = "site-static-v1";

// Dynamic Cache
const dynamicCache = "site-dynamic-v1";

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
  "https://kit.fontawesome.com/78b1d29e85.js"
];

// Install Service Worker
self.addEventListener("install", evt => {
  // Console log to instruct that sw.js has been installed
  //   console.log('service worker has been installed');
  evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log("caching shell assets");
      cache.addAll(assets);
    })
  );
});

// Listen for Service Worker Activation
self.addEventListener("activate", evt => {
  // Console log to intercept fetch resource request
  //   console.log("service worker has been activated");
  evt.waitUntil(
    caches.keys().then(keys => {
      //   console.log(keys);
      return Promise.all(
        keys
          .filter(key => key !== staticCacheName)
          .map(key => caches.delete(key))
      );
    })
  );
});

// Fetch event
self.addEventListener("fetch", evt => {
  // Console log to intercept fetch resource request
  //   console.log('fetch event', evt);
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      // Return from cache is item is in assets, otherwise continue with normal fetch request
      return (
        cacheRes ||
        fetch(evt.request).then(fetchRes => {
          return caches.open(dynamicCache).then(cache => {
            cache.put(evt.request.url, fetchRes.clone());
            return fetchRes;
          });
        })
      );
    })
  );
});
