self.addEventListener('push', function (event) {
    if (event.data) {
        try {
            const data = event.data.json();
            const options = {
                body: data.body,
                icon: '/vite.svg', // Default icon
                badge: '/vite.svg',
                data: { url: data.url || '/' },
                vibrate: [200, 100, 200]
            };
            event.waitUntil(
                self.registration.showNotification(data.title || 'New Notification', options)
            );
        } catch (e) {
            console.error('Push event data parsing error:', e);
            // Fallback if not JSON
            event.waitUntil(
                self.registration.showNotification('New Notification', { body: event.data.text() })
            );
        }
    }
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            const urlToOpen = event.notification.data.url || '/';
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
