"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/page-header";
import GlassCard from "@/components/ui/glass-card";
import DataManagement from "@/components/data-management";
import {
  ShieldCheck,
  HardDrive,
  RefreshCw,
  Bell,
  BellOff,
  BellRing,
  Loader2,
  Check,
  X,
  Mail,
  MessageCircle,
  Smartphone,
} from "lucide-react";
import { usePushSubscription } from "@/hooks/use-push-subscription";

// ─── Push Notifications Card ────────────────────────────────────────────────

function PushNotificationsCard() {
  const { status, subscribe, unsubscribe } = usePushSubscription();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  const isSubscribed = status === "subscribed";
  const isDenied = status === "denied";
  const isLoading = status === "loading";
  const isUnsupported = status === "unsupported";

  async function handleToggle() {
    setTestResult(null);
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  }

  async function handleTest() {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/test-push", { method: "POST" });
      const data = await res.json();
      setTestResult(data.sent > 0 ? "success" : "error");
    } catch {
      setTestResult("error");
    } finally {
      setTesting(false);
      setTimeout(() => setTestResult(null), 4000);
    }
  }

  function StatusBadge() {
    if (isUnsupported) {
      return (
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-2.5 py-1">
          <X size={10} /> Not Supported
        </span>
      );
    }
    if (isDenied) {
      return (
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-400 bg-red-400/10 border border-red-400/20 rounded-full px-2.5 py-1">
          <BellOff size={10} /> Blocked
        </span>
      );
    }
    if (isLoading) {
      return (
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 bg-zinc-400/10 border border-zinc-400/20 rounded-full px-2.5 py-1">
          <Loader2 size={10} className="animate-spin" /> Checking…
        </span>
      );
    }
    if (isSubscribed) {
      return (
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2.5 py-1">
          <Check size={10} /> Enabled
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 bg-zinc-500/10 border border-zinc-500/20 rounded-full px-2.5 py-1">
        <BellOff size={10} /> Off
      </span>
    );
  }

  return (
    <GlassCard className="p-6 space-y-5 col-span-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-violet-500/15 flex items-center justify-center flex-shrink-0">
            <Bell className="h-4.5 w-4.5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">
              Push Notifications
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed max-w-md">
              Get lock-screen alerts when a reminder fires — even when the app is closed.
              Tap the notification to open WhatsApp with a pre-filled wish.
            </p>
          </div>
        </div>
        <StatusBadge />
      </div>

      {/* Delivery preview */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Mail, label: "Email reminder", color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/20", active: true },
          { icon: Smartphone, label: "Mobile push", color: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/20", active: isSubscribed },
          { icon: MessageCircle, label: "WhatsApp wish", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", active: true },
        ].map((item) => (
          <div
            key={item.label}
            className={[
              "flex flex-col items-center justify-center gap-2 rounded-xl py-4 border transition-all duration-300",
              item.active ? `${item.bg} ${item.border}` : "bg-white/[0.02] border-white/[0.06] opacity-40",
            ].join(" ")}
          >
            <item.icon size={18} className={item.active ? item.color : "text-zinc-600"} />
            <span className={`text-[10px] font-semibold text-center leading-tight ${item.active ? "text-zinc-300" : "text-zinc-600"}`}>
              {item.label}
            </span>
            {item.active && (
              <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-0.5">
                <Check size={8} /> Active
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Denial message */}
      {isDenied && (
        <div className="flex items-start gap-3 rounded-xl bg-red-400/5 border border-red-400/15 p-4">
          <BellOff size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-red-300">Notifications blocked by browser</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Go to your browser settings → Site permissions → Notifications, and allow Occasionly.
            </p>
          </div>
        </div>
      )}

      {/* Unsupported message */}
      {isUnsupported && (
        <div className="flex items-start gap-3 rounded-xl bg-amber-400/5 border border-amber-400/15 p-4">
          <BellRing size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-300">Push not supported</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Install Occasionly as a PWA from Chrome or Safari 16.4+ and reopen settings.
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      {!isUnsupported && !isDenied && (
        <div className="flex flex-col sm:flex-row gap-3 border-t border-white/5 pt-4">
          <button
            id="push-toggle-btn"
            onClick={handleToggle}
            disabled={isLoading}
            className={[
              "flex-1 flex items-center justify-center gap-2 text-xs font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-60",
              isSubscribed
                ? "bg-white/[0.05] border border-white/10 text-zinc-400 hover:bg-red-400/10 hover:border-red-400/20 hover:text-red-300"
                : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-violet-600/20",
            ].join(" ")}
          >
            {isLoading ? (
              <Loader2 size={13} className="animate-spin" />
            ) : isSubscribed ? (
              <BellOff size={13} />
            ) : (
              <Bell size={13} />
            )}
            {isLoading
              ? "Please wait…"
              : isSubscribed
              ? "Disable Push Notifications"
              : "Enable Push Notifications"}
          </button>

          {isSubscribed && (
            <button
              id="push-test-btn"
              onClick={handleTest}
              disabled={testing}
              className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-zinc-300 hover:bg-white/[0.08] transition-all duration-200 disabled:opacity-60"
            >
              {testing ? (
                <Loader2 size={13} className="animate-spin" />
              ) : testResult === "success" ? (
                <Check size={13} className="text-emerald-400" />
              ) : testResult === "error" ? (
                <X size={13} className="text-red-400" />
              ) : (
                <BellRing size={13} />
              )}
              {testing
                ? "Sending…"
                : testResult === "success"
                ? "Notification sent!"
                : testResult === "error"
                ? "Send failed — check console"
                : "Send Test Notification"}
            </button>
          )}
        </div>
      )}
    </GlassCard>
  );
}

// ─── Settings Page ───────────────────────────────────────────────────────────

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
        description="Manage push notifications, offline backup stores, and sync engine parameters."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Push Notifications — spans full width */}
        <PushNotificationsCard />

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
              Occasionly persists all records inside a local-first IndexedDB container.
              Ensure your relationship memory vault is securely backed up and restorable.
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
              Synchronize offline mutations seamlessly with Supabase data pools once
              connectivity is restored. LWW mechanisms guarantee conflict resolution.
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
