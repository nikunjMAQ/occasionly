import { supabase } from "@/lib/supabase";
import { OccasionEvent } from "@/types/event";

export async function uploadEvent({
  event,
  userId,
}: {
  event: OccasionEvent;
  userId: string;
}) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("events")
    .upsert({
      id: event.id,
      user_id: userId,
      person_name: event.personName,
      occasion_type: event.eventType,
      occasion_date: event.recurringDate,
      reminder_days_before: event.reminderOffsetDays,
      reminder_time: event.reminderTime,
      timezone: event.timezone,
      relationship_type: event.relationshipType,
      nickname: event.nickname || null,
      interests: event.interests || [],
      gift_ideas: event.giftIdeas || [],
      notes: event.notes || null,
      is_favorite: event.isFavorite,
      whatsapp_number: event.whatsappNumber,
      preferred_reminder_channel: event.preferredReminderChannel,
      tone: event.tone,
      starting_year: event.startingYear || null,
      updated_at: new Date().toISOString(),
      version: event.version,
      last_reminded_at: event.lastRemindedAt || null,
      next_reminder_at: event.nextReminderAt || null,
      reminder_enabled: event.reminderEnabled !== false,
    });

  if (error) {
    throw error;
  }

  return data;
}
