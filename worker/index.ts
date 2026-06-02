// worker/index.ts
// Runs inside the Service Worker (ServiceWorkerGlobalScope).
// Compiled separately with tsconfig.worker.json which uses lib: ["webworker"].

self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();

  const url: string | undefined = event.notification?.data?.url;
  if (!url) return;

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Focus an existing tab if it already has that URL open
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return (client as WindowClient).focus();
          }
        }
        // Otherwise open a new window/tab
        return self.clients.openWindow(url);
      })
  );
});
