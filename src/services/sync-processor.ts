import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { getSyncQueue } from "./sync-queue-service";
import { uploadEvent } from "./cloud-event-service";
import { pullAndMergeEvents } from "./sync-service";
import { logger } from "@/lib/logger";
import { useSyncStore } from "@/store/sync-store";

export async function flushSyncQueue() {
  if (typeof window !== "undefined" && !navigator.onLine) {
    useSyncStore.getState().setSyncState("offline");
    return;
  }

  if (!supabase) {
    useSyncStore.getState().setSyncState("guest");
    return;
  }

  try {
    // 1. Check auth session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      useSyncStore.getState().setSyncState("guest");
      return;
    }

    // 2. Fetch pending items
    const queue = await getSyncQueue();
    const pendingItems = queue.filter(
      (item) => !item.status || item.status === "pending" || item.status === "failed"
    );

    useSyncStore.getState().setPendingCount(pendingItems.length);

    if (pendingItems.length === 0) {
      useSyncStore.getState().setSyncState("synced");
      
      // Bidirectional pull & merge with conflict resolution
      try {
        await pullAndMergeEvents();
      } catch (error) {
        logger.log("sync", "Bidirectional down-sync merge failed", error);
      }
      return;
    }

    useSyncStore.getState().setSyncState("syncing");

    for (const item of pendingItems) {
      try {
        if (item.entityType === "event") {
          if (item.operation === "delete") {
            const { error } = await supabase
              .from("events")
              .delete()
              .eq("id", item.entityId);
            if (error) throw error;
          } else {
            // ensure user_id exists matching current session
            const payload = {
              ...item.payload,
              user_id: session.user.id,
            };
            await uploadEvent({
              event: payload,
              userId: session.user.id,
            });
          }
        }

        // Mark successful item as synced in IndexedDB
        await db.syncQueue.update(item.id, {
          status: "synced",
          syncedAt: Date.now(),
        } as any);
        
      } catch (error) {
        logger.log("sync", `Failed to push sync queue item ${item.id}`, error, { item });
        
        // Update failed item retryCount in IndexedDB
        await db.syncQueue.update(item.id, {
          status: "failed",
          retries: (item.retries || 0) + 1,
        } as any);
      }
    }

    // 3. Update final status
    const updatedQueue = await getSyncQueue();
    const remainingPending = updatedQueue.filter(
      (item) => !item.status || item.status === "pending" || item.status === "failed"
    );
    useSyncStore.getState().setPendingCount(remainingPending.length);

    if (remainingPending.length === 0) {
      useSyncStore.getState().setSyncState("synced");
    } else {
      useSyncStore.getState().setSyncState("failed");
    }

    // Bidirectional pull & merge
    try {
      await pullAndMergeEvents();
    } catch (error) {
      logger.log("sync", "Bidirectional down-sync merge failed", error);
    }
  } catch (err) {
    logger.log("sync", "Critical sync queue flushing exception", err);
    useSyncStore.getState().setSyncState("failed");
  }
}

// Wrapper for backward compatibility
export async function processSyncQueue() {
  return flushSyncQueue();
}
