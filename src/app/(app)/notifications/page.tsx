"use client";

import { useEffect, useState } from "react";
import { ReminderLog } from "@/types/reminder-log";
import { getReminderLogs } from "@/services/reminder-log-service";
import { ConflictLog } from "@/types/conflict-log";
import { getConflictLogs } from "@/services/conflict-service";
import PageHeader from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import RecoveryBanner from "@/components/recovery-banner";
import ReminderHistory from "@/components/reminder-history";
import ConflictViewer from "@/components/conflict-viewer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, History, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const [logs, setLogs] = useState<ReminderLog[]>([]);
  const [conflicts, setConflicts] = useState<ConflictLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadData() {
    setIsLoading(true);
    try {
      const logData = await getReminderLogs();
      setLogs(logData);
      const conflictData = await getConflictLogs();
      setConflicts(conflictData);
    } catch (e) {
      console.error("Failed to load notifications page data", e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    window.addEventListener("event-saved", loadData);
    return () => window.removeEventListener("event-saved", loadData);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          eyebrow="Logs & Alerts"
          title="Notifications Log"
          description="Monitor reminder delivery logs, recovery of offline messages, and sync conflicts."
        />
        <Button
          variant="outline"
          onClick={loadData}
          disabled={isLoading}
          className="border-white/10 text-gray-300 hover:bg-white/5 rounded-xl text-xs font-semibold px-4 py-2.5 self-start sm:self-center flex items-center gap-2"
        >
          <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
          Refresh Logs
        </Button>
      </div>

      {isLoading ? (
        <GlassCard className="p-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-6 rounded-full border-2 border-t-transparent border-violet-500 animate-spin" />
            <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase animate-pulse">
              Retrieving delivery reports...
            </p>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-6">
          {/* Recovery Warning Banner */}
          <RecoveryBanner logs={logs} />

          {/* Tabs System */}
          <Tabs defaultValue="history" className="w-full space-y-6">
            <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
              <TabsTrigger
                value="history"
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all cursor-pointer"
              >
                <History size={13} />
                Delivery History
              </TabsTrigger>
              <TabsTrigger
                value="conflicts"
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg data-[state=active]:bg-violet-600 data-[state=active]:text-white transition-all cursor-pointer"
              >
                <AlertTriangle size={13} />
                Sync Conflicts
                {conflicts.length > 0 && (
                  <span className="ml-1 bg-red-500/20 text-red-400 border border-red-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {conflicts.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="focus:outline-none">
              <GlassCard className="p-6">
                <ReminderHistory logs={logs} />
              </GlassCard>
            </TabsContent>

            <TabsContent value="conflicts" className="focus:outline-none">
              {conflicts.length === 0 ? (
                <GlassCard className="p-12 text-center flex flex-col items-center justify-center gap-4">
                  <div className="p-4 rounded-full bg-white/5 border border-white/10 text-gray-600">
                    <CheckSquare size={24} className="text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-gray-300">No sync conflicts detected</h3>
                    <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
                      All offline IndexedDB mutations successfully synchronized and consolidated with Supabase backend nodes without any conflicts.
                    </p>
                  </div>
                </GlassCard>
              ) : (
                <GlassCard className="p-6">
                  <ConflictViewer conflicts={conflicts} />
                </GlassCard>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}

// Simple placeholder for CheckSquare import inside fallback
import { CheckSquare } from "lucide-react";
