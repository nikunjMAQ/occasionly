export interface LocalNotificationPayload {
  title: string;
  body: string;
  /** URL to open when the notification is clicked (e.g. WhatsApp deep link) */
  url?: string;
  icon?: string;
  badge?: string;
  tag?: string;
}

/**
 * Send a local (client-side) push notification via the Service Worker.
 * Falls back to the basic Notification API if SW is unavailable.
 */
export async function sendLocalNotification(
  payload: LocalNotificationPayload
): Promise<void> {
  if (typeof window === "undefined") return;

  const { title, body, url, icon = "/icons/icon-192x192.png", badge = "/icons/badge-72x72.png", tag } = payload;

  const options: NotificationOptions = {
    body,
    icon,
    badge,
    tag,
    data: { url },
    requireInteraction: false,
  };

  // Prefer SW-backed notification (works when tab is in background)
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready.catch(() => null);
    if (registration) {
      await registration.showNotification(title, options);
      return;
    }
  }

  // Fallback: basic Notification API (foreground only)
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, options);
  }
}
