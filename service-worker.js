/* TK Web Solutions — Service Worker v2 (Error-Free) */
var CACHE_NAME = 'tk-web-v2';
var CACHE_URLS = [
  '/',
  '/index.html',
  '/logo.png',
  '/favicon.ico'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      // Only cache same-origin URLs — chrome-extension URLs skip hongi
      var safeurls = CACHE_URLS.filter(function(url) {
        return !url.startsWith('chrome-extension') && !url.startsWith('http');
      });
      return cache.addAll(safeurls).catch(function() {
        // Silent fail — cache optional hai
      });
    })
  );
});

self.addEventListener('fetch', function(e) {
  // Chrome extension requests ignore karo — yahi line 55 error fix karta hai
  if (e.request.url.startsWith('chrome-extension://')) return;
  if (e.request.url.startsWith('chrome://')) return;
  if (!e.request.url.startsWith('http')) return;

  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).catch(function() {
        return cached;
      });
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
});
