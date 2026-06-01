import {
  differenceInCalendarDays,
  set,
} from "date-fns";

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
