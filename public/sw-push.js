self.addEventListener('push', function(event) {
  const payload = (event.data && event.data.json()) || {};
  const title = payload.title || 'My Minutes';
  const body = payload.body || 'You hit your goal!';

  var showNotificationPromise = self.registration.showNotification(title, {
    body,
    icon: '/images/icons/android-chrome-192x192.png',
    tag: 'message',
  });

  event.waitUntil(showNotificationPromise);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
});
