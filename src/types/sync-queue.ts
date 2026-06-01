export interface SyncQueueItem {
  id: string;

  entityType:
    | "event"
    | "notification"
    | "reminder_log";

  entityId: string;

  operation:
    | "create"
    | "update"
    | "delete";

  payload: any;

  createdAt: string;

  retries: number;

  status?: "pending" | "synced" | "failed";

  syncedAt?: number;

  lastError?: string;
}
