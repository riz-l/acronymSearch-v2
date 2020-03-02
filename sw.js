// Service Worker Version == v2.2.1
// e17: https://www.youtube.com/watch?v=g9LfyCZjeKI
// Static Cache
const staticCacheName = 'site-static';

// Cache Assets
const assets = [
    'index.html',
    'assets/js/app.js',
    'assets/js/bootstrap.min.js',
    'assets/js/ui.js',
    'assets/css/boostrap.min.css',
    'assets/css/sidebar.css',
    'assets/css/style.css',
    'assets/img/tdi-logo.png',
    'assets/img/sponsors/dxc-black.png',
    'assets/img/sponsors/leonardo-logo.svg',
    'assets/img/icons/tdi.ico',
    'pages/error.html',
    'https://kit.fontawesome.com/78b1d29e85.js'
];

// Install Service Worker
self.addEventListener('install', evt => {
    // Console log to instruct that sw.js has been installed
    // console.log('service worker has been installed');
    evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            console.log('caching shell assets');
            cache.addAll(assets);
        })
    );
});

// Listen for Service Worker Activation
self.addEventListener('activate', evt => {
    console.log('service worker has been activated');
});

// Fetch event
self.addEventListener('fetch', evt => {
    // Console log to intercept fetch resource request
    // console.log('fetch event', evt);
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            // Return from cache is item is in assets, otherwise continue with normal fetch request
            return cacheRes || fetch(evt.request);
        })
    );
});