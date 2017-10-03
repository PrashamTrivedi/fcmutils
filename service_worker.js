/** An empty service worker! */
self.addEventListener('fetch', event => {
    console.log(event.request.url);
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open('files-cache').then(cache => {
            cache.addAll([
                '/',
                '/index.html',
                '/index.js',
                '/styles.css',
                '/material.min.css',
                '/material.min.js',
                '/jquery.min.js',
                '/localforage.js'
            ])
        })
    );
});