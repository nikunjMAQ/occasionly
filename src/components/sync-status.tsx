"use client";

import { useSyncStore } from "@/store/sync-store";
import { Cloud, CloudOff, CloudSync, AlertCircle } from "lucide-react";

export default function SyncStatus() {
  const { syncState, pendingCount } = useSyncStore();

  const config = {
    guest: {
      color: "bg-zinc-500/5 border-white/5 text-gray-400 shadow-sm",
      icon: Cloud,
      label: "Stored Locally",
    },
    syncing: {
      color: "bg-indigo-500/10 border-indigo-500/25 text-indigo-400 shadow-md shadow-indigo-500/5",
      icon: CloudSync,
      label: `Syncing... (${pendingCount})`,
    },
    synced: {
      color: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 shadow-md shadow-emerald-500/5",
      icon: Cloud,
      label: "Synced Across Devices",
    },
    offline: {
      color: "bg-amber-500/10 border-amber-500/25 text-amber-400 shadow-md shadow-amber-500/5",
      icon: CloudOff,
      label: "Offline Mode",
    },
    failed: {
      color: "bg-rose-500/10 border-rose-500/25 text-rose-400 shadow-md shadow-rose-500/5",
      icon: AlertCircle,
      label: "Sync Failed",
    },
  };

  const current = config[syncState] || config.guest;
  const Icon = current.icon;

  return (
    <div
      className={`text-[10px] font-bold border px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all duration-300 tracking-wide uppercase ${current.color}`}
    >
      <Icon
        size={12}
        className={syncState === "syncing" ? "animate-spin" : ""}
      />
      <span>{current.label}</span>
    </div>
  );
}
