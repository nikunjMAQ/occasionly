import { ReminderLog } from "@/types/reminder-log";

export function alreadySentReminder({
  logs,
  eventId,
  scheduledFor,
}: {
  logs: ReminderLog[];

  eventId: string;

  scheduledFor: string;
}) {
  return logs.some(
    (log) =>
      log.eventId === eventId &&
      log.scheduledFor ===
        scheduledFor
  );
}
