// worker/index.ts
declare let self: any;

self.addEventListener("notificationclick", (event: any) => {
  event.notification.close();
  const url = event.notification?.data?.url;
  if (url) {
    event.waitUntil(
      self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList: any) => {
        // Try to focus existing window if possible, otherwise open new
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(url);
        }
      })
    );
  }
});
