importScripts('/cache-polyfill.js');

self.addEventListener('install', function(e) {
  var cachesPromise = caches.open('my-minutes').then(function(cache) {
    return cache.addAll([
      '/',
      '/index.html',
      '/bundle.js',
      '/favicon.ico'
      ]);
  });

  e.waitUntil(cachesPromise);
});

self.addEventListener('fetch', function(event) {
 console.log(event.request.url);

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
