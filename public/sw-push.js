self.addEventListener('push', function(event) {
  const payload = (event.data && event.data.json()) || {};
  const title = payload.title || 'My Minutes';
  const body = payload.body || 'You hit your goal!';

  var showNotificationPromise = self.registration.showNotification(title, {
    body,
    icon: '/images/icons/android-chrome-192x192.png',
    tag: 'message',
    data: payload,
  });

  event.waitUntil(showNotificationPromise);
});

self.addEventListener('notificationclick', function(event) {
  // Android doesn't close the notification when you click on it
  // See: http://crbug.com/463146 (wontfix)
  event.notification.close();

  // Focus or open notification payload's onNotificationClickUrl or '/'.
  var path = event.notification.data.onNotificationClickUrl || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url == path && 'focus' in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(path);
      }
    })
  );
});
