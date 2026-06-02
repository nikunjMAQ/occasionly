"use client";

import { useState, useEffect, useCallback } from "react";
import {
  subscribeUserToPush,
  unsubscribeUserFromPush,
  getCurrentPushSubscription,
} from "@/services/push/subscribe-user";
import { requestNotificationPermission, getNotificationPermission } from "@/services/push/request-permission";

export type PushSubscriptionStatus = "unsupported" | "loading" | "unsubscribed" | "subscribed" | "denied";

interface UsePushSubscriptionReturn {
  status: PushSubscriptionStatus;
  permission: NotificationPermission | "unsupported";
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
}

export function usePushSubscription(): UsePushSubscriptionReturn {
  const [status, setStatus] = useState<PushSubscriptionStatus>("loading");
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");

  // Detect support & check existing state on mount
  useEffect(() => {
    async function init() {
      if (
        typeof window === "undefined" ||
        !("serviceWorker" in navigator) ||
        !("PushManager" in window)
      ) {
        setStatus("unsupported");
        setPermission("unsupported");
        return;
      }

      const perm = getNotificationPermission();
      setPermission(perm === "unsupported" ? "denied" : perm);

      if (perm === "denied") {
        setStatus("denied");
        return;
      }

      const existing = await getCurrentPushSubscription();
      setStatus(existing ? "subscribed" : "unsubscribed");
    }

    init();
  }, []);

  const subscribe = useCallback(async () => {
    setStatus("loading");

    // 1. Request permission first
    const perm = await requestNotificationPermission();
    setPermission(perm);

    if (perm !== "granted") {
      setStatus("denied");
      return;
    }

    // 2. Subscribe and save
    const sub = await subscribeUserToPush();
    setStatus(sub ? "subscribed" : "unsubscribed");
  }, []);

  const unsubscribe = useCallback(async () => {
    setStatus("loading");
    await unsubscribeUserFromPush();
    setStatus("unsubscribed");
  }, []);

  return { status, permission, subscribe, unsubscribe };
}
