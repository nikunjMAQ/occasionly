import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { OccasionEvent } from "@/types/event";
import { getCurrentUser } from "./auth-service";
import { v4 as uuidv4 } from "uuid";
import { addConflictLog } from "./conflict-service";

export async function pullAndMergeEvents() {
  if (!supabase) return;
  const user = await getCurrentUser();
  if (!user) {
    return;
  }

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("Failed to pull events", error);
    return;
  }

  if (!data) return;

  for (const row of data) {
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
      await db.events.add(
        cloudEvent
      );

      continue;
    }

    const localVersion =
      existing.version || 1;

    const cloudVersion =
      cloudEvent.version || 1;

    if (
      cloudVersion >
      localVersion
    ) {
      await addConflictLog({
        id: uuidv4(),

        entityId: cloudEvent.id,

        localVersion,

        cloudVersion,

        resolvedAt:
          new Date().toISOString(),

        strategy:
          "last_write_wins",
      });

      await db.events.put(
        cloudEvent
      );
    }
  }
}
