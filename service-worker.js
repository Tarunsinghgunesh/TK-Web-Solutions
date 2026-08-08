/* TK Web Solutions — Service Worker v3 (Error-Free) */
var CACHE_NAME = 'tk-web-v3';
var CACHE_URLS = [
  '/',
  '/index.html',
  '/logo.png',
  '/favicon.ico'
];

self.addEventListener('install', function(e) {
  self.skipWaiting(); // activate the new SW as soon as it finishes installing
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      // Cache each URL independently so one missing file (e.g. favicon.ico)
      // doesn't fail the entire precache batch (cache.addAll is all-or-nothing).
      var safeUrls = CACHE_URLS.filter(function(url) {
        return !url.startsWith('chrome-extension') && !url.startsWith('http');
      });
      return Promise.all(
        safeUrls.map(function(url) {
          return cache.add(url).catch(function(err) {
            console.warn('Service worker pre-cache skipped for', url, err);
          });
        })
      );
    })
  );
});

self.addEventListener('fetch', function(e) {
  var req = e.request;

  // Only handle same-origin GET requests
  if (req.method !== 'GET') return;
  if (req.url.startsWith('chrome-extension://')) return;
  if (req.url.startsWith('chrome://')) return;
  if (!req.url.startsWith('http')) return;

  // Network-first for HTML/navigation requests so visitors always get the
  // latest deployed page instead of a stale cached copy (this was previously
  // cache-first for everything, which could serve an outdated index.html
  // indefinitely after a deploy). Falls back to cache when offline.
  var isNavigation = req.mode === 'navigate' ||
    (req.headers.get('accept') || '').indexOf('text/html') !== -1;

  if (isNavigation) {
    e.respondWith(
      fetch(req)
        .then(function(res) {
          var resClone = res.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(req, resClone).catch(function() {});
          });
          return res;
        })
        .catch(function() {
          return caches.match(req).then(function(cached) {
            return cached || caches.match('/index.html');
          });
        })
    );
    return;
  }

  // Cache-first (with network fallback) for static assets
  e.respondWith(
    caches.match(req).then(function(cached) {
      if (cached) return cached;
      return fetch(req)
        .then(function(res) {
          // Only cache valid, basic (same-origin) responses
          if (res && res.ok && res.type === 'basic') {
            var resClone = res.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(req, resClone).catch(function() {});
            });
          }
          return res;
        })
        .catch(function(err) {
          console.error('Network fetch failed in service worker:', err);
          return Response.error();
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
    }).then(function() {
      return self.clients.claim(); // take control of open tabs immediately
    })
  );
});
