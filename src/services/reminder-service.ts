import { fromZonedTime } from "date-fns-tz";
import { set, differenceInCalendarDays } from "date-fns";
import { OccasionEvent } from "@/types/event";
import { ReminderItem } from "@/types/reminder";

export function generateWhatsAppLink(
  number: string,
  message: string
) {
  return `https://wa.me/${number}?text=${encodeURIComponent(
    message
  )}`;
}

export function calculateNextReminderAt(event: {
  recurringDate: string; // "YYYY-MM-DD"
  reminderOffsetDays: number;
  reminderTime: string; // "HH:MM"
  timezone: string;
}): string {
  const today = new Date();
  
  const celebrationParts = event.recurringDate.split("-");
  const month = Number(celebrationParts[1]) - 1; // 0-indexed
  const day = Number(celebrationParts[2]);

  let targetYear = today.getFullYear();
  
  let celebrationDateStr = `${targetYear}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}T${event.reminderTime}:00`;
  let celebrationZoned = fromZonedTime(celebrationDateStr, event.timezone);

  if (celebrationZoned < today) {
    targetYear += 1;
    celebrationDateStr = `${targetYear}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}T${event.reminderTime}:00`;
    celebrationZoned = fromZonedTime(celebrationDateStr, event.timezone);
  }

  const reminderZoned = new Date(celebrationZoned);
  reminderZoned.setDate(reminderZoned.getDate() - event.reminderOffsetDays);

  return reminderZoned.toISOString();
}

export function getUpcomingReminders(
  events: OccasionEvent[]
): ReminderItem[] {
  const today = new Date();

  return events
    .map((event) => {
      const eventDate = new Date(
        event.recurringDate
      );

      const nextOccurrence = new Date(
        today.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate()
      );

      if (nextOccurrence < today) {
        nextOccurrence.setFullYear(
          today.getFullYear() + 1
        );
      }

      const reminderDate = new Date(
        nextOccurrence
      );

      const offsetDays = event.reminderOffsetDays ?? 0;
      reminderDate.setDate(
        reminderDate.getDate() - offsetDays
      );

      const reminderTime = event.reminderTime || "09:00";
      const [hours, minutes] = reminderTime.split(":");

      const finalReminderDate = set(
        reminderDate,
        {
          hours: Number(hours),
          minutes: Number(minutes),
          seconds: 0,
          milliseconds: 0,
        }
      );

      const daysRemaining =
        differenceInCalendarDays(
          nextOccurrence,
          today
        );

      const message = `Reminder: ${event.personName}'s ${event.eventType} is coming up 🎉`;

      return {
        event,

        reminderDate: finalReminderDate,

        daysRemaining,

        isToday: daysRemaining === 0,

        isTomorrow:
          daysRemaining === 1,

        whatsappLink:
          generateWhatsAppLink(
            event.whatsappNumber,
            message
          ),
      };
    })

    .sort(
      (a, b) =>
        a.daysRemaining -
        b.daysRemaining
    );
}
