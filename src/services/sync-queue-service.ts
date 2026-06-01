import { db } from "@/lib/db";

import { SyncQueueItem } from "@/types/sync-queue";

export async function addToSyncQueue(
  item: SyncQueueItem
) {
  return db.syncQueue.add(item);
}

export async function getSyncQueue() {
  return db.syncQueue.toArray();
}

export async function removeQueueItem(
  id: string
) {
  return db.syncQueue.delete(id);
}
