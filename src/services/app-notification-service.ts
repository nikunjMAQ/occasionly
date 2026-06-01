import { db } from "@/lib/db";

import { AppNotification } from "@/types/app-notification";

export async function addNotification(
  notification: AppNotification
) {
  return db.notifications.add(
    notification
  );
}

export async function getNotifications() {
  return db.notifications.toArray();
}

export async function markAsRead(
  id: string
) {
  return db.notifications.update(
    id,
    {
      read: true,
    }
  );
}

export async function markAsCompleted(
  id: string
) {
  return db.notifications.update(
    id,
    {
      completed: true,
    }
  );
}

export async function snoozeNotification(
  id: string,
  snoozedUntil: string
) {
  return db.notifications.update(
    id,
    {
      snoozedUntil,
    }
  );
}
