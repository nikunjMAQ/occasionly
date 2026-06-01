import { db } from "@/lib/db";

import { ReminderLog } from "@/types/reminder-log";

export async function addReminderLog(
  log: ReminderLog
) {
  return db.reminderLogs.add(log);
}

export async function getReminderLogs() {
  return db.reminderLogs.toArray();
}

export async function hasReminderBeenSent(
  eventId: string,
  scheduledFor: string
) {
  const logs = await db.reminderLogs
    .where("eventId")
    .equals(eventId)
    .toArray();

  return logs.some((log) => log.scheduledFor === scheduledFor);
}
