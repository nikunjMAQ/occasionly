import { OccasionEvent } from "@/types/event";
import { showNotification } from "./notification-service";
import { generateNotification } from "./notification-generator";
import { v4 as uuidv4 } from "uuid";
import {
  addReminderLog,
  getReminderLogs,
} from "./reminder-log-service";
import { alreadySentReminder } from "./reminder-eligibility";

export async function checkDueReminders(
  events: OccasionEvent[]
) {
  const now = new Date();
  const logs = await getReminderLogs();

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

    const alreadySent =
      alreadySentReminder({
        logs,
        eventId: event.id,
        scheduledFor,
      });

    if (alreadySent) {
      continue;
    }

    const difference =
      Math.abs(
        now.getTime() -
          nextOccurrence.getTime()
      );

    const withinOneMinute =
      difference <
      60 * 1000;

    if (withinOneMinute) {
      showNotification(
        "Occasionly Reminder 🎉",
        `${event.personName}'s ${event.eventType} reminder`
      );

      await generateNotification(event);

      await addReminderLog({
        id: uuidv4(),

        eventId: event.id,

        reminderDate:
          event.recurringDate,

        scheduledFor,

        sentAt:
          new Date().toISOString(),

        status: "sent",

        channel: "whatsapp",
      });
    }
  }
}
