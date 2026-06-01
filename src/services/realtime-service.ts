import { supabase } from "@/lib/supabase";
import { db } from "@/lib/db";
import { OccasionEvent } from "@/types/event";
import { logger } from "@/lib/logger";

export function subscribeToRealtimeEvents(
  userId: string
) {
  if (!supabase) return null;
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
          };

          const existing = await db.events.get(cloudEvent.id);

          if (!existing) {
            await db.events.add(cloudEvent);
            return;
          }

          const localVersion = existing.version || 1;
          const cloudVersion = cloudEvent.version || 1;

          if (cloudVersion > localVersion) {
            await db.events.put(cloudEvent);
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
    .subscribe();
}
