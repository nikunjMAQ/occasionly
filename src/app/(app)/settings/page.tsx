"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import DataManagement from "@/components/data-management";
import { ShieldCheck, HardDrive, RefreshCw } from "lucide-react";

export default function SettingsPage() {
  const [syncTime, setSyncTime] = useState<string>("Up to date");

  function triggerSync() {
    setSyncTime("Synchronizing...");
    setTimeout(() => {
      setSyncTime("Just now");
      window.dispatchEvent(new Event("event-saved"));
    }, 1500);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        eyebrow="Configuration"
        title="Settings & Systems"
        description="Manage your local offline backup stores, sync engine parameters, and offline persistence states."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Local Data Management */}
        <GlassCard className="p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">
                Local Data Management
              </h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Occasionly persists all database objects inside a high-performance local-first IndexedDB container. Ensure your relationship memory vault is securely backed up and restorable.
            </p>
          </div>
          <div className="border-t border-white/5 pt-4 mt-4">
            <DataManagement refresh={() => {}} />
          </div>
        </GlassCard>

        {/* Sync Settings */}
        <GlassCard className="p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">
                Sync Engine Settings
              </h3>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Synchronize offline mutations seamlessly with Supabase data pools once connectivity is restored. LWW mechanisms guarantee conflict resolutions.
            </p>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-gray-550">Cloud Sync Status:</span>
              <span className="text-gray-300 font-semibold">{syncTime}</span>
            </div>
          </div>
          <div className="border-t border-white/5 pt-4 mt-4">
            <button
              onClick={triggerSync}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw size={12} className={syncTime === "Synchronizing..." ? "animate-spin" : ""} />
              Force Full Sync
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

