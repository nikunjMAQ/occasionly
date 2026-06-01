import { ReminderItem } from "@/types/reminder";

export function getReminderPriority(
  reminder: ReminderItem
) {
  if (
    reminder.event.isFavorite
  ) {
    return "high";
  }

  if (reminder.isToday) {
    return "medium";
  }

  return "normal";
}
