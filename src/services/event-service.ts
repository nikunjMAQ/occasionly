import { db } from "@/lib/db";
import { OccasionEvent } from "@/types/event";
import { v4 as uuidv4 } from "uuid";
import { addToSyncQueue } from "./sync-queue-service";

export async function addEvent(event: OccasionEvent) {
  const result = await db.events.add(event);
  await addToSyncQueue({
    id: uuidv4(),
    entityType: "event",
    entityId: event.id,
    operation: "create",
    payload: event,
    createdAt: new Date().toISOString(),
    retries: 0,
    status: "pending",
  });
  return result;
}

export async function getAllEvents() {
  return db.events.toArray();
}

export async function deleteEvent(id: string) {
  const result = await db.events.delete(id);
  await addToSyncQueue({
    id: uuidv4(),
    entityType: "event",
    entityId: id,
    operation: "delete",
    payload: null,
    createdAt: new Date().toISOString(),
    retries: 0,
    status: "pending",
  });
  return result;
}

export async function updateEvent(event: OccasionEvent) {
  const result = await db.events.update(event.id, event as any);
  await addToSyncQueue({
    id: uuidv4(),
    entityType: "event",
    entityId: event.id,
    operation: "update",
    payload: event,
    createdAt: new Date().toISOString(),
    retries: 0,
    status: "pending",
  });
  return result;
}
