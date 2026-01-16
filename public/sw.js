const CACHE_NAME = 'language-gems-v1';
const OFFLINE_URL = '/offline';

// Assets to cache on install (minimum for offline experience)
const PRECACHE_ASSETS = [
    '/offline',
    '/favicon.ico',
    '/logo.png',
    '/manifest.json',
];

// Install event - cache offline page and critical assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Pre-caching offline page');
            return cache.addAll(PRECACHE_ASSETS);
        })
    );
    // Activate immediately
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== CACHE_NAME)
                    .map((cacheName) => caches.delete(cacheName))
            );
        })
    );
    // Take control immediately
    self.clients.claim();
});

// Fetch event - network first, fallback to cache or offline page
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip API requests (always need network)
    if (event.request.url.includes('/api/')) return;

    // Skip external requests
    if (!event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clone the response for caching
                const responseClone = response.clone();

                // Cache successful responses for navigation requests
                if (response.ok && (event.request.mode === 'navigate' ||
                    event.request.destination === 'document' ||
                    event.request.destination === 'script' ||
                    event.request.destination === 'style' ||
                    event.request.destination === 'image')) {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }

                return response;
            })
            .catch(() => {
                // Network failed - try cache first
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    // For navigation requests, show offline page
                    if (event.request.mode === 'navigate') {
                        return caches.match(OFFLINE_URL);
                    }

                    // For other requests, return a simple offline response
                    return new Response('Offline', {
                        status: 503,
                        statusText: 'Service Unavailable',
                    });
                });
            })
    );
});

// Handle messages from the app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
