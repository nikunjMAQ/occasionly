export interface AppNotification {
  id: string;

  eventId: string;

  title: string;

  message: string;

  createdAt: string;

  read: boolean;

  completed: boolean;

  snoozedUntil?: string;
}
