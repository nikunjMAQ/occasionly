import { supabase } from "@/lib/supabase";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

/**
 * Convert a base64url VAPID public key to the Uint8Array that
 * pushManager.subscribe() expects as applicationServerKey.
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function getServiceWorkerRegistrationWithTimeout(timeoutMs = 3000): Promise<ServiceWorkerRegistration> {
  return Promise.race([
    navigator.serviceWorker.ready,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Service Worker activation timed out.")), timeoutMs)
    ),
  ]);
}

/**
 * Subscribe the current browser to Web Push and persist the subscription
 * in the `push_subscriptions` Supabase table for the logged-in user.
 *
 * Idempotent: if the same endpoint is already stored, this upserts it.
 * Returns the PushSubscription object on success, null on failure.
 */
export async function subscribeUserToPush(): Promise<PushSubscription | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("[Push] PushManager not supported in this browser.");
    return null;
  }

  if (!VAPID_PUBLIC_KEY) {
    console.error("[Push] NEXT_PUBLIC_VAPID_PUBLIC_KEY is not configured.");
    return null;
  }

  try {
    // Wait for SW to be active with a timeout
    const registration = await getServiceWorkerRegistrationWithTimeout();

    // Subscribe (or retrieve existing subscription)
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn("[Push] No authenticated user — skipping subscription storage.");
      return subscription;
    }

    // Upsert into push_subscriptions (conflict on endpoint)
    const { error } = await supabase
      .from("push_subscriptions")
      .upsert(
        {
          user_id: user.id,
          endpoint: subscription.endpoint,
          subscription: subscription.toJSON(),
        },
        { onConflict: "endpoint" }
      );

    if (error) {
      console.error("[Push] Failed to save subscription:", error);
    } else {
      console.log("[Push] Subscription saved successfully.");
    }

    return subscription;
  } catch (err) {
    console.error("[Push] Subscribe failed:", err);
    return null;
  }
}

/**
 * Unsubscribe the current browser from Web Push and remove the record
 * from Supabase.
 */
export async function unsubscribeUserFromPush(): Promise<void> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  try {
    const registration = await getServiceWorkerRegistrationWithTimeout();
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return;

    const endpoint = subscription.endpoint;
    await subscription.unsubscribe();

    // Remove from Supabase
    await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
    console.log("[Push] Unsubscribed and removed from Supabase.");
  } catch (err) {
    console.error("[Push] Unsubscribe failed:", err);
  }
}

/**
 * Get the current PushSubscription for this browser, if any.
 */
export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return null;
  try {
    const registration = await getServiceWorkerRegistrationWithTimeout();
    return await registration.pushManager.getSubscription();
  } catch {
    return null;
  }
}
