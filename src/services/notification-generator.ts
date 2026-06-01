import { OccasionEvent } from "@/types/event";

import { v4 as uuidv4 } from "uuid";

import { addNotification } from "./app-notification-service";

export async function generateNotification(
  event: OccasionEvent
) {
  await addNotification({
    id: uuidv4(),

    eventId: event.id,

    title: `${event.personName}'s ${event.eventType}`,

    message:
      "Reminder from Occasionly 🎉",

    createdAt:
      new Date().toISOString(),

    read: false,

    completed: false,
  });
}
