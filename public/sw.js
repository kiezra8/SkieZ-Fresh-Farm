// SkieZ Fresh Farm — Service Worker
// Provides offline support and fast repeat loads

const CACHE_NAME = 'skiez-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png',
];

// Install: pre-cache shell assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch(() => {
                // Silently fail on individual assets
            });
        })
    );
    self.skipWaiting();
});

// Activate: clear old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

// Fetch: network-first for API, cache-first for static assets
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip non-GET and Supabase API calls (always fresh)
    if (event.request.method !== 'GET') return;
    if (url.hostname.includes('supabase.co')) return;
    if (url.hostname.includes('fonts.googleapis.com')) return;
    if (url.hostname.includes('unsplash.com')) return;

    // Network-first strategy with cache fallback
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Cache successful responses
                if (response && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // Offline fallback: serve from cache
                return caches.match(event.request).then((cached) => {
                    if (cached) return cached;
                    // Final fallback: serve index.html for navigation requests
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                });
            })
    );
});
