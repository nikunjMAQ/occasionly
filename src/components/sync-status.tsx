"use client";

import { useSyncStore } from "@/store/sync-store";
import { Cloud, CloudOff, CloudSync, AlertCircle } from "lucide-react";
import { flushSyncQueue } from "@/services/sync-processor";
import { toast } from "sonner";

export default function SyncStatus() {
  const { syncState, pendingCount } = useSyncStore();

  const config = {
    guest: {
      color: "bg-zinc-500/5 border-zinc-800/30 text-gray-400 shadow-sm hover:bg-zinc-500/10 hover:border-zinc-700/50 hover:shadow-[0_0_12px_rgba(156,163,175,0.15)]",
      icon: Cloud,
      label: "Stored Locally",
    },
    syncing: {
      color: "bg-indigo-500/10 border-indigo-500/25 text-indigo-400 shadow-md shadow-indigo-500/5 hover:bg-indigo-500/15 hover:border-indigo-500/40 hover:shadow-[0_0_12px_rgba(99,102,241,0.25)]",
      icon: CloudSync,
      label: `Syncing... (${pendingCount})`,
    },
    synced: {
      color: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 shadow-md shadow-emerald-500/5 hover:bg-emerald-500/15 hover:border-emerald-500/40 hover:shadow-[0_0_12px_rgba(16,185,129,0.25)]",
      icon: Cloud,
      label: "Synced Across Devices",
    },
    offline: {
      color: "bg-amber-500/10 border-amber-500/25 text-amber-400 shadow-md shadow-amber-500/5 hover:bg-amber-500/15 hover:border-amber-500/40 hover:shadow-[0_0_12px_rgba(245,158,11,0.25)]",
      icon: CloudOff,
      label: "Offline Mode",
    },
    failed: {
      color: "bg-rose-500/10 border-rose-500/25 text-rose-400 shadow-md shadow-rose-500/5 hover:bg-rose-500/15 hover:border-rose-500/40 hover:shadow-[0_0_12px_rgba(244,63,94,0.25)]",
      icon: AlertCircle,
      label: "Sync Failed",
    },
  };

  const current = config[syncState] || config.guest;
  const Icon = current.icon;

  const handleSyncClick = async () => {
    if (syncState === "syncing") return;

    if (typeof window !== "undefined" && !navigator.onLine) {
      toast.error("Offline Mode: Connect to the internet to sync updates.", {
        description: "Your changes are safe locally and will sync automatically once reconnected.",
      });
      return;
    }

    toast.promise(flushSyncQueue(), {
      loading: "Initiating remote data synchronization...",
      success: (result) => {
        if (result) {
          return "Data synchronized across all devices successfully!";
        } else {
          return "Sync finished with partial updates. We will try again automatically.";
        }
      },
      error: "Critical synchronization error occurred.",
    });
  };

  return (
    <button
      type="button"
      onClick={handleSyncClick}
      disabled={syncState === "syncing"}
      title="Click to sync data manually"
      className={`text-[10px] font-bold border px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all duration-300 tracking-wide uppercase cursor-pointer disabled:cursor-not-allowed select-none active:scale-95 transform ${current.color}`}
    >
      <Icon
        size={12}
        className={syncState === "syncing" ? "animate-spin" : ""}
      />
      <span>{current.label}</span>
    </button>
  );
}
