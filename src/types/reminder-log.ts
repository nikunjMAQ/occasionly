export interface ReminderLog {
  id: string;

  eventId: string;

  reminderDate: string;

  scheduledFor: string;

  sentAt: string;

  status:
    | "sent"
    | "missed";

  channel: "whatsapp";
}
