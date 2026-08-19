/* TK Web Solutions — Service Worker v4 (Speed Optimized) */
var CACHE_NAME = 'tk-web-v4';

// Critical assets to precache
var PRECACHE_URLS = [
  '/',
  '/index.html',
  '/logo.png',
  '/favicon.ico',
  '/favicon-32x32.png',
  '/favicon-16x16.png'
];

// External CDN resources to cache on first fetch
var CDN_CACHE = 'tk-cdn-v4';

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return Promise.all(
        PRECACHE_URLS.map(function(url) {
          return cache.add(url).catch(function(err) {
            console.warn('[SW] Precache skipped:', url, err.message);
          });
        })
      );
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys
          .filter(function(k) { return k !== CACHE_NAME && k !== CDN_CACHE; })
          .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e) {
  var req = e.request;

  // Skip non-GET, chrome-extension, and non-http requests
  if (req.method !== 'GET') return;
  if (req.url.startsWith('chrome-extension://')) return;
  if (req.url.startsWith('chrome://')) return;
  if (!req.url.startsWith('http')) return;

  // Skip Google Analytics/GTM (always network)
  if (req.url.includes('google-analytics.com') ||
      req.url.includes('googletagmanager.com') ||
      req.url.includes('googlesyndication.com') ||
      req.url.includes('doubleclick.net')) {
    return;
  }

  var url = new URL(req.url);
  var isSameOrigin = url.origin === self.location.origin;

  // ── HTML / Navigation → Network-first (always fresh) ──
  var isNavigation = req.mode === 'navigate' ||
    (req.headers.get('accept') || '').indexOf('text/html') !== -1;

  if (isNavigation) {
    e.respondWith(
      fetch(req)
        .then(function(res) {
          var clone = res.clone();
          caches.open(CACHE_NAME).then(function(c) { c.put(req, clone).catch(function(){}); });
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

  // ── Fonts & CDN assets → Cache-first (they never change) ──
  var isCDN = !isSameOrigin && (
    req.url.includes('fonts.googleapis.com') ||
    req.url.includes('fonts.gstatic.com') ||
    req.url.includes('cdnjs.cloudflare.com') ||
    req.url.includes('cdn.jsdelivr.net')
  );

  if (isCDN) {
    e.respondWith(
      caches.open(CDN_CACHE).then(function(cache) {
        return cache.match(req).then(function(cached) {
          if (cached) return cached;
          return fetch(req).then(function(res) {
            if (res && res.ok) cache.put(req, res.clone()).catch(function(){});
            return res;
          }).catch(function() { return cached; });
        });
      })
    );
    return;
  }

  // ── Same-origin static assets → Stale-while-revalidate ──
  var isStatic = /\.(css|js|png|jpg|jpeg|webp|gif|svg|ico|woff2?|ttf|eot)$/i.test(url.pathname);

  if (isSameOrigin && isStatic) {
    e.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(req).then(function(cached) {
          var networkFetch = fetch(req).then(function(res) {
            if (res && res.ok) cache.put(req, res.clone()).catch(function(){});
            return res;
          }).catch(function() { return cached; });
          // Return cached immediately, update in background
          return cached || networkFetch;
        });
      })
    );
    return;
  }

  // ── Everything else → Network with cache fallback ──
  e.respondWith(
    fetch(req).catch(function() {
      return caches.match(req);
    })
  );
});
