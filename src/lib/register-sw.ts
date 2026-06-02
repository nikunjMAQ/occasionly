/**
 * Service Worker registration helper.
 * Returns the SW registration so callers can subscribe to push later.
 */
export async function registerSW(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });

    // Trigger update check immediately
    registration.update().catch(() => {});

    console.log("[SW] Registered with scope:", registration.scope);
    return registration;
  } catch (error) {
    console.error("[SW] Registration failed:", error);
    return null;
  }
}
