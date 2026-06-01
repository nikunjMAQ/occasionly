"use client";

import { useSyncStore } from "@/store/sync-store";
import { Radio } from "lucide-react";

export default function RealtimeStatus() {
  const { realtimeStatus } = useSyncStore();

  if (realtimeStatus === "inactive") {
    return null;
  }

  const config = {
    connecting: {
      color: "bg-amber-500/10 border-amber-500/25 text-amber-400 shadow-md shadow-amber-500/5",
      label: "Realtime Reconnecting...",
      pulse: "bg-amber-400 animate-ping",
    },
    active: {
      color: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 shadow-md shadow-emerald-500/5",
      label: "Live Sync Active 🟢",
      pulse: "bg-emerald-450 animate-pulse",
    },
    error: {
      color: "bg-rose-500/10 border-rose-500/25 text-rose-400 shadow-md shadow-rose-500/5",
      label: "Realtime Disconnected",
      pulse: "bg-rose-500 animate-ping",
    },
  };

  const current = config[realtimeStatus] || config.connecting;

  return (
    <div
      className={`text-[10px] font-bold border px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all duration-300 tracking-wide uppercase select-none ${current.color}`}
    >
      <span className="relative flex h-2 w-2">
        <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${current.pulse}`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${realtimeStatus === "active" ? "bg-emerald-500" : realtimeStatus === "connecting" ? "bg-amber-500" : "bg-rose-500"}`} />
      </span>
      <span className="flex items-center gap-1">
        <Radio size={10} className={realtimeStatus === "connecting" ? "animate-pulse" : ""} />
        <span>{current.label}</span>
      </span>
    </div>
  );
}
