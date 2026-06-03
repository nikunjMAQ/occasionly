"use client";

import { useEffect, useState } from "react";
import { useSyncStore } from "@/store/sync-store";
import { supabase } from "@/lib/supabase";
import { db } from "@/lib/db";
import { SyncQueueItem } from "@/types/sync-queue";
import { Activity, Wifi, WifiOff, ShieldCheck, Key, RefreshCw, AlertTriangle, Trash2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { getFriendlyErrorMessage } from "@/services/toast/error-messages";
import { flushSyncQueue } from "@/services/sync-processor";

export default function DevDebugPanel() {
  const { syncState, pendingCount, lastSyncTime } = useSyncStore();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(typeof window !== "undefined" ? navigator.onLine : true);
  const [failedItems, setFailedItems] = useState<SyncQueueItem[]>([]);

  async function loadDiagnostics() {
    // 1. Get user details
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
        setUserEmail(session.user.email || "No email");
      } else {
        setUserId(null);
        setUserEmail(null);
      }
    }

    // 2. Fetch failed items from Dexie db
    try {
      const queue = await db.syncQueue.toArray();
      const failed = queue.filter(item => item.status === "failed");
      setFailedItems(failed);
    } catch (e) {
      console.error("Failed to read syncQueue diagnostics", e);
    }
  }

  useEffect(() => {
    loadDiagnostics();

    // Listeners for network status
    function updateOnlineStatus() {
      setIsOnline(navigator.onLine);
    }
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // Listen to custom auth change trigger
    window.addEventListener("auth-changed", loadDiagnostics);
    
    // Interval polling for diagnostic updates every 3 seconds
    const interval = setInterval(loadDiagnostics, 3000);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
      window.removeEventListener("auth-changed", loadDiagnostics);
      clearInterval(interval);
    };
  }, []);

  const handleClearFailedQueue = async () => {
    try {
      const queue = await db.syncQueue.toArray();
      const failedIds = queue.filter(item => item.status === "failed").map(item => item.id);
      if (failedIds.length === 0) {
        toast.info("No failed sync items to clear.");
        return;
      }
      await db.syncQueue.bulkDelete(failedIds);
      toast.success(`Cleared ${failedIds.length} failed queue items.`);
      loadDiagnostics();
    } catch (err: any) {
      toast.error(getFriendlyErrorMessage(err));
    }
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wide flex items-center gap-1.5">
          <Activity size={12} className="text-indigo-400 animate-pulse" />
          Developer Diagnostics
        </h3>
        <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-extrabold uppercase border border-indigo-500/20">
          Dev Active
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-[11px]">
        {/* Status */}
        <div className="bg-black/20 rounded-xl p-3 border border-white/[0.03]">
          <span className="text-gray-500 block mb-1">Online Status</span>
          <div className="flex items-center gap-1.5 font-semibold text-gray-200">
            {isOnline ? (
              <>
                <Wifi size={12} className="text-emerald-400" />
                <span>Online</span>
              </>
            ) : (
              <>
                <WifiOff size={12} className="text-rose-400" />
                <span>Offline</span>
              </>
            )}
          </div>
        </div>

        {/* Sync State */}
        <div className="bg-black/20 rounded-xl p-3 border border-white/[0.03]">
          <span className="text-gray-500 block mb-1">Engine State</span>
          <span className="font-semibold text-gray-200 capitalize">{syncState}</span>
        </div>

        {/* Pending Sync */}
        <div className="bg-black/20 rounded-xl p-3 border border-white/[0.03]">
          <span className="text-gray-500 block mb-1">Pending Syncs</span>
          <span className="font-semibold text-gray-200">{pendingCount} items</span>
        </div>

        {/* Last Sync */}
        <div className="bg-black/20 rounded-xl p-3 border border-white/[0.03]">
          <span className="text-gray-500 block mb-1">Last Sync</span>
          <span className="font-semibold text-gray-200">
            {lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString() : "Never"}
          </span>
        </div>
      </div>

      {/* User Session Diagnostics */}
      <div className="bg-black/20 rounded-xl p-3 border border-white/[0.03] space-y-1.5 text-[11px]">
        <div className="flex items-center gap-1.5 text-gray-400 font-medium">
          <Key size={11} className="text-violet-400" />
          <span>User Session Diagnostics</span>
        </div>
        <div className="space-y-1 pl-4">
          <div className="text-[10px] text-gray-500">
            <span className="font-semibold text-gray-400">UID: </span>
            <span className="font-mono truncate block max-w-full">{userId || "Guest / Unauthenticated"}</span>
          </div>
          {userEmail && (
            <div className="text-[10px] text-gray-500">
              <span className="font-semibold text-gray-400">Email: </span>
              <span>{userEmail}</span>
            </div>
          )}
        </div>
      </div>

      {/* Sync Exceptions / Failures */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-gray-400 font-semibold flex items-center gap-1">
            <ShieldAlert size={12} className="text-rose-400" />
            Sync Exceptions ({failedItems.length})
          </span>
          {failedItems.length > 0 && (
            <button
              onClick={handleClearFailedQueue}
              className="text-rose-400 hover:text-rose-300 font-bold text-[9px] flex items-center gap-1 transition-colors uppercase cursor-pointer"
            >
              <Trash2 size={10} />
              Clear Failures
            </button>
          )}
        </div>

        {failedItems.length === 0 ? (
          <div className="text-[10px] text-gray-600 bg-black/10 rounded-xl p-3 text-center border border-white/[0.02]">
            No synchronization errors logged. Sync engine healthy.
          </div>
        ) : (
          <div className="space-y-2 max-h-[140px] overflow-y-auto no-scrollbar pr-1">
            {failedItems.map((item) => (
              <div
                key={item.id}
                className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-2.5 space-y-1 text-[10px]"
              >
                <div className="flex items-center justify-between text-rose-400 font-semibold uppercase tracking-wider text-[9px]">
                  <span>{item.entityType} ({item.operation})</span>
                  <span>Retries: {item.retries}</span>
                </div>
                <div className="text-gray-400 text-[9px] truncate">
                  <span className="font-semibold">ID:</span> <span className="font-mono">{item.entityId}</span>
                </div>
                <div className="text-rose-300/80 bg-rose-950/20 border border-rose-500/5 rounded p-1.5 font-mono text-[9px] break-words">
                  {item.lastError || "No exception detail captured"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
