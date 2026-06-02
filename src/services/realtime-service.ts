import { supabase } from "@/lib/supabase";
import { db } from "@/lib/db";
import { OccasionEvent } from "@/types/event";
import { logger } from "@/lib/logger";
import { useSyncStore } from "@/store/sync-store";

export function subscribeToRealtimeEvents(
  userId: string
) {
  if (!supabase) return null;
  
  useSyncStore.getState().setRealtimeStatus("connecting");

  return supabase
    .channel("events-realtime")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "events",
        filter: `user_id=eq.${userId}`,
      },
      async (payload) => {
        try {
          console.log("Realtime payload received:", payload);

          if (payload.eventType === "DELETE") {
            const oldId = payload.old?.id;
            if (oldId) {
              await db.events.delete(oldId);
              // Trigger standard layout data refresh
              window.dispatchEvent(new Event("event-saved"));
            }
            return;
          }

          const row = payload.new as any;
          if (!row || !row.id) {
            return;
          }

          const cloudEvent: OccasionEvent = {
            id: row.id,
            personName: row.person_name,
            relationshipType: row.relationship_type as any,
            isFavorite: row.is_favorite,
            eventType: row.occasion_type as any,
            recurringDate: row.occasion_date,
            startingYear: row.starting_year || undefined,
            whatsappNumber: row.whatsapp_number,
            reminderOffsetDays: row.reminder_days_before,
            reminderTime: row.reminder_time,
            timezone: row.timezone,
            preferredReminderChannel: row.preferred_reminder_channel as any,
            tone: row.tone as any,
            notes: row.notes || undefined,
            nickname: row.nickname || undefined,
            interests: row.interests || [],
            giftIdeas: row.gift_ideas || [],
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            version: row.version,
            lastRemindedAt: row.last_reminded_at || undefined,
            nextReminderAt: row.next_reminder_at || undefined,
            reminderEnabled: row.reminder_enabled !== false,
          };

          const existing = await db.events.get(cloudEvent.id);

          if (!existing) {
            await db.events.add(cloudEvent);
            window.dispatchEvent(new Event("event-saved"));
            return;
          }

          const localVersion = existing.version || 1;
          const cloudVersion = cloudEvent.version || 1;

          const localUpdated = existing.updatedAt ? new Date(existing.updatedAt).getTime() : 0;
          const cloudUpdated = cloudEvent.updatedAt ? new Date(cloudEvent.updatedAt).getTime() : 0;

          if (cloudVersion > localVersion || (cloudVersion === localVersion && cloudUpdated > localUpdated)) {
            await db.events.put(cloudEvent);
            window.dispatchEvent(new Event("event-saved"));
          }
        } catch (error) {
          logger.log(
            "realtime",
            "Failed to process realtime database change event",
            error,
            { payload }
          );
        }
      }
    )
    .subscribe((status) => {
      console.log("Realtime connection state changed:", status);
      if (status === "SUBSCRIBED") {
        useSyncStore.getState().setRealtimeStatus("active");
      } else if (status === "TIMED_OUT" || status === "CHANNEL_ERROR") {
        useSyncStore.getState().setRealtimeStatus("connecting");
      } else if (status === "CLOSED") {
        useSyncStore.getState().setRealtimeStatus("inactive");
      }
    });
}
