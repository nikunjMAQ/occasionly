import { getCurrentUser } from "./auth-service";
import {
  getSyncQueue,
  removeQueueItem,
} from "./sync-queue-service";
import { uploadEvent } from "./cloud-event-service";
import { pullAndMergeEvents } from "./sync-service";
import { logger } from "@/lib/logger";

export async function processSyncQueue() {
  const user =
    await getCurrentUser();

  if (!user) {
    return;
  }

  const queue =
    await getSyncQueue();

  for (const item of queue) {
    try {
      if (
        item.entityType ===
          "event" &&
        item.operation ===
          "create"
      ) {
        await uploadEvent({
          event: item.payload,
          userId: user.id,
        });
      }

      await removeQueueItem(
        item.id
      );
    } catch (error) {
      logger.log("sync", `Failed to push sync queue item ${item.id}`, error, { item });
    }
  }

  // Bidirectional pull & merge with conflict resolution
  try {
    await pullAndMergeEvents();
  } catch (error) {
    logger.log("sync", "Bidirectional down-sync merge failed", error);
  }
}
