import { OccasionEvent } from "./event";

import { ReminderLog } from "./reminder-log";

import { AppNotification } from "./app-notification";

export interface OccasionlyBackup {
  exportedAt: string;

  version: string;

  events: OccasionEvent[];

  reminderLogs: ReminderLog[];

  notifications: AppNotification[];
}
