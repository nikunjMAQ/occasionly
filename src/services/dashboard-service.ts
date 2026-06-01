import { ReminderItem } from "@/types/reminder";

import { DashboardSections } from "@/types/dashboard";

export function buildDashboardSections(
  reminders: ReminderItem[]
): DashboardSections {
  return {
    missed: reminders.filter(
      (r) => r.daysRemaining < 0
    ),

    today: reminders.filter(
      (r) => r.daysRemaining === 0
    ),

    tomorrow: reminders.filter(
      (r) => r.daysRemaining === 1
    ),

    thisWeek: reminders.filter(
      (r) =>
        r.daysRemaining > 1 &&
        r.daysRemaining <= 7
    ),

    later: reminders.filter(
      (r) => r.daysRemaining > 7
    ),
  };
}
