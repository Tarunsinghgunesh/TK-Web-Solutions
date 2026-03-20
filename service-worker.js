// TK Web Solutions — Service Worker
// Version: 1.0

const CACHE_NAME = 'tkwebsolutions-v1';
const OFFLINE_URL = '/offline.html';

// Files to cache
const CACHE_FILES = [
  '/',
  '/index.html',
  '/logo.png',
  '/favicon.ico',
  '/blog/blog.html',
  '/about.html',
  '/manifest.json'
];

// Install
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHE_FILES);
    })
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName !== CACHE_NAME;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch — Network first, cache fallback
self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(function(response) {
        // Cache fresh response
        if (response && response.status === 200) {
          var responseClone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(function() {
        // Offline — serve from cache
        return caches.match(event.request)
          .then(function(cachedResponse) {
            if (cachedResponse) return cachedResponse;
            // Return homepage if nothing cached
            return caches.match('/index.html');
          });
      })
  );
});
