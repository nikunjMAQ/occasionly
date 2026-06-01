import { ReminderItem } from "./reminder";

export interface DashboardSections {
  missed: ReminderItem[];

  today: ReminderItem[];

  tomorrow: ReminderItem[];

  thisWeek: ReminderItem[];

  later: ReminderItem[];
}
