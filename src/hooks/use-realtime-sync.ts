"use client";

import { useEffect } from "react";

import { getCurrentUser } from "@/services/auth-service";

import { subscribeToRealtimeEvents } from "@/services/realtime-service";

export function useRealtimeSync() {
  useEffect(() => {
    let subscription: any;

    async function init() {
      const user =
        await getCurrentUser();

      if (!user) {
        return;
      }

      subscription =
        subscribeToRealtimeEvents(
          user.id
        );
    }

    init();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);
}
