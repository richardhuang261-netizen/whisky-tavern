const CACHE_NAME = 'whisky-tavern-v1';
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    'https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=ZCOOL+XiaoWei&display=swap',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => 
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).then(fetchResp => {
                if (fetchResp && fetchResp.status === 200) {
                    const clone = fetchResp.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                }
                return fetchResp;
            });
        }).catch(() => caches.match('/index.html'))
    );
});