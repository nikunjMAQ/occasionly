import { OccasionEvent } from "@/types/event";

import {
  addReminderLog,
  getReminderLogs,
} from "./reminder-log-service";

import { v4 as uuidv4 } from "uuid";

export async function recoverMissedReminders(
  events: OccasionEvent[]
) {
  const now = new Date();

  const logs =
    await getReminderLogs();

  for (const event of events) {
    const eventDate = new Date(
      event.recurringDate
    );

    const nextOccurrence = new Date(
      now.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate()
    );

    if (nextOccurrence < now) {
      nextOccurrence.setFullYear(
        now.getFullYear() + 1
      );
    }

    const offsetDays = event.reminderOffsetDays ?? 0;
    nextOccurrence.setDate(
      nextOccurrence.getDate() - offsetDays
    );

    const reminderTime = event.reminderTime || "09:00";
    const [hours, minutes] =
      reminderTime.split(":");

    nextOccurrence.setHours(
      Number(hours)
    );

    nextOccurrence.setMinutes(
      Number(minutes)
    );

    nextOccurrence.setSeconds(0);

    const scheduledFor =
      nextOccurrence.toISOString();

    const alreadyProcessed =
      logs.some(
        (log) =>
          log.eventId ===
            event.id &&
          log.scheduledFor ===
            scheduledFor
      );

    if (alreadyProcessed) {
      continue;
    }

    const missedWindow =
      now.getTime() -
      nextOccurrence.getTime();

    const within24Hours =
      missedWindow > 0 &&
      missedWindow <
        24 * 60 * 60 * 1000;

    if (within24Hours) {
      await addReminderLog({
        id: uuidv4(),

        eventId: event.id,

        reminderDate:
          event.recurringDate,

        scheduledFor,

        sentAt:
          new Date().toISOString(),

        status: "missed",

        channel: "whatsapp",
      });
    }
  }
}
