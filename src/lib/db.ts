import Dexie, { Table } from "dexie";
import { OccasionEvent } from "@/types/event";
import { ReminderLog } from "@/types/reminder-log";
import { AppNotification } from "@/types/app-notification";
import { SyncQueueItem } from "@/types/sync-queue";
import { ConflictLog } from "@/types/conflict-log";

class OccasionlyDB extends Dexie {
  events!: Table<OccasionEvent>;
  reminderLogs!: Table<ReminderLog>;
  notifications!: Table<AppNotification>;
  syncQueue!: Table<SyncQueueItem>;
  conflictLogs!: Table<ConflictLog>;

  constructor() {
    super("occasionlyDB");

    this.version(1).stores({
      events: "id, personName, recurringDate",
      reminderLogs: "id, eventId, reminderDate",
      notifications: "id, eventId, createdAt, read",
      syncQueue: "id, entityType, entityId, operation",
      conflictLogs: "id, entityId",
    });
  }
}

export const db = new OccasionlyDB();
