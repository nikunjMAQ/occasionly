"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { subscribeToRealtimeEvents } from "@/services/realtime-service";

export function useRealtimeSync() {
  useEffect(() => {
    let subscription: any = null;

    async function initSubscription() {
      if (!supabase) return;

      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (e) {
          // ignore unsubscribe failures
        }
        subscription = null;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        subscription = subscribeToRealtimeEvents(session.user.id);
      }
    }

    initSubscription();

    // Dynamic listener for authentication state alterations
    if (supabase) {
      const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
        async () => {
          await initSubscription();
        }
      );

      return () => {
        subscription?.unsubscribe();
        authListener.unsubscribe();
      };
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, []);
}
