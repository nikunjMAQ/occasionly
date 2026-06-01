import { OccasionEvent } from "./event";

export interface ReminderItem {
  event: OccasionEvent;

  reminderDate: Date;

  daysRemaining: number;

  isToday: boolean;

  isTomorrow: boolean;

  whatsappLink: string;
}
