// worker/index.ts
// Runs inside the Service Worker (ServiceWorkerGlobalScope).
// Compiled separately with tsconfig.worker.json which uses lib: ["webworker"].

// ─── PUSH EVENT ──────────────────────────────────────────────────────────────
// Fired when the server sends a push notification (via web-push / Edge Function).
// The browser wakes up this SW even if the app tab is closed.
self.addEventListener("push", (event: PushEvent) => {
  let data: { title: string; body: string; url?: string } = {
    title: "Occasionly 🎉",
    body: "You have a new reminder.",
  };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch {
    // If JSON parse fails, fall back to text
    data.body = event.data?.text() ?? data.body;
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/badge-72x72.png",
      data: { url: data.url ?? "/" },
      requireInteraction: false,
      // vibrate pattern for Android
      vibrate: [200, 100, 200],
    } as NotificationOptions)
  );
});

// ─── NOTIFICATION CLICK ───────────────────────────────────────────────────────
// Fired when the user taps the notification.
// Opens the URL from notification.data.url (WhatsApp deep link or app URL).
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
        // Otherwise open a new window/tab (opens WhatsApp or the app)
        return self.clients.openWindow(url);
      })
  );
});
