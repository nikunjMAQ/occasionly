"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import { addToSyncQueue } from "@/services/sync-queue-service";
import { flushSyncQueue } from "@/services/sync-processor";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Sparkles, ArrowUpRight } from "lucide-react";

export default function GuestMigrationModal() {
  const [open, setOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(0);
  const [migrating, setMigrating] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (!supabase) return;

    async function checkMigration() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        
        if (!user) {
          setOpen(false);
          return;
        }

        setCurrentUser(user);

        // Check if prompted already for this specific user
        const promptedKey = `guest_migration_prompted_${user.id}`;
        if (localStorage.getItem(promptedKey) === "true") {
          return;
        }

        // Find events without user_id (local guest events)
        const guestEvents = await db.events.filter((e) => !e.user_id).toArray();
        if (guestEvents.length > 0) {
          setGuestCount(guestEvents.length);
          setOpen(true);
        }
      } catch (err) {
        console.error("[Migration check failed]:", err);
      }
    }

    // Run check on mount
    checkMigration();

    // Listen for auth state shifts
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkMigration();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleConfirm() {
    if (!currentUser) return;
    setMigrating(true);
    try {
      const guestEvents = await db.events.filter((e) => !e.user_id).toArray();
      
      for (const event of guestEvents) {
        const updatedEvent = {
          ...event,
          user_id: currentUser.id,
          updatedAt: new Date().toISOString(),
          version: (event.version || 1) + 1,
        };

        // Write user_id locally
        await db.events.put(updatedEvent);

        // Queue upload sync
        await addToSyncQueue({
          id: uuidv4(),
          entityType: "event",
          entityId: event.id,
          operation: "create",
          payload: updatedEvent,
          createdAt: new Date().toISOString(),
          retries: 0,
          status: "pending",
        });
      }

      // Flush sync queue immediately
      await flushSyncQueue();

      toast.success("Sync completed!", {
        description: `Successfully migrated ${guestEvents.length} reminders to your account.`,
      });

      // Mark prompted
      localStorage.setItem(`guest_migration_prompted_${currentUser.id}`, "true");
      setOpen(false);
    } catch (err) {
      console.error("[Migration failed]:", err);
      toast.error("Migration failed. We'll retry syncing automatically.");
    } finally {
      setMigrating(false);
    }
  }

  function handleDismiss() {
    if (currentUser) {
      localStorage.setItem(`guest_migration_prompted_${currentUser.id}`, "true");
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleDismiss(); }}>
      <DialogContent className="max-w-md bg-[#12141c] border border-white/10 text-white rounded-3xl p-6 shadow-2xl">
        <DialogHeader className="space-y-3">
          <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
            <Sparkles className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <DialogTitle className="text-lg font-bold text-white flex items-center gap-1.5">
              Sync Local Reminders?
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
              We detected {guestCount} reminder{guestCount > 1 ? "s" : ""} saved in your local guest vault.
              Would you like to sync them with your account so they are safe in the cloud?
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 border-t border-white/5 pt-4 mt-4">
          <Button
            variant="ghost"
            onClick={handleDismiss}
            disabled={migrating}
            className="flex-1 text-xs font-semibold py-2.5 rounded-xl border border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.02]"
          >
            Keep Local Only
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={migrating}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-violet-600/20"
          >
            {migrating ? "Syncing..." : "Sync to Account"}
            <ArrowUpRight size={13} />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
