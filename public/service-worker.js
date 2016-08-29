importScripts('/cache-polyfill.js');

var URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/bundle.js',
  '/favicon.ico'
];

self.addEventListener('install', function(e) {
  var cachesPromise = caches.open('my-minutes').then(function(cache) {
    return cache.addAll(URLS_TO_CACHE);
  });

  e.waitUntil(cachesPromise);
});

self.addEventListener('fetch', function(event) {
  console.log(event.request.url);

  if (event.request.method !== 'GET') {
    return;
  }

  var urlIsCached = false;
  for (var i = 0; !urlIsCached && i < URLS_TO_CACHE.length; i++) {
    if (event.request.url.indexOf(URLS_TO_CACHE[i]) !== -1) {
      urlIsCached = true;
    }
  }
  if (!urlIsCached) {
    return;
  }

  var cacheMatch = caches.match(event.request).then(function(response) {
    return response || fetch(event.request);
  });

  event.respondWith(cacheMatch);
});

self.addEventListener('push', function(event) {
  const payload = (event.data && event.data.json()) || {};
  const title = payload.title || 'My Minutes';
  const body = payload.body || 'You hit your goal!';

  var showNotificationPromise = self.registration.showNotification(title, {
    body,
    icon: 'android-chrome-192x192.png',
    tag: 'message',
  });

  event.waitUntil(showNotificationPromise);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
});
