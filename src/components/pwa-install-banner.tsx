"use client";

import { useState, useEffect } from "react";
import { X, Download, Smartphone, Share } from "lucide-react";
import { useInstallPrompt, InstallPlatform } from "@/hooks/use-install-prompt";
import { requestNotificationPermission } from "@/services/push/request-permission";
import { db } from "@/lib/db";

const DISMISSED_KEY = "pwa_install_banner_dismissed";

function IOSInstructions() {
  return (
    <div className="flex flex-col gap-3 mt-3">
      <p className="text-xs text-zinc-400 leading-relaxed">
        To install Occasionly on your iPhone:
      </p>
      <ol className="space-y-2">
        {[
          { icon: <Share size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />, text: 'Tap the Share button in Safari' },
          { icon: <Download size={14} className="text-violet-400 flex-shrink-0 mt-0.5" />, text: '"Add to Home Screen"' },
          { icon: <Smartphone size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />, text: 'Open from your home screen' },
        ].map((step, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="flex items-center justify-center w-4 h-4 rounded-full bg-white/5 text-[10px] font-bold text-zinc-500 flex-shrink-0 mt-0.5">
              {i + 1}
            </span>
            {step.icon}
            <span className="text-xs text-zinc-300">{step.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function platformLabel(platform: InstallPlatform): string {
  if (platform === "ios") return "Add to Home Screen";
  if (platform === "android") return "Install App";
  return "Install App";
}

interface Props {
  /** Called when the user dismisses the banner */
  onDismiss?: () => void;
}

export default function PWAInstallBanner({ onDismiss }: Props) {
  const { platform, canInstall, isInstalled, promptInstall } = useInstallPrompt();
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | null>(null);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Don't show if already dismissed this session
    const dismissed = sessionStorage.getItem(DISMISSED_KEY);
    if (!dismissed && canInstall && !isInstalled) {
      let active = true;
      let t: NodeJS.Timeout;
      
      db.events.count().then((count) => {
        if (active && count > 0) {
          // Slight delay so page renders first
          t = setTimeout(() => setVisible(true), 2500);
        }
      }).catch((err) => {
        console.warn("[PWA] Error counting events:", err);
      });

      return () => {
        active = false;
        if (t) clearTimeout(t);
      };
    }
  }, [canInstall, isInstalled]);

  if (!visible) return null;

  async function handleInstall() {
    if (platform === "ios") {
      setShowIOSGuide(true);
      return;
    }

    setInstalling(true);
    const accepted = await promptInstall();
    setInstalling(false);

    if (accepted) {
      // After install, request notification permission
      const perm = await requestNotificationPermission();
      setNotifPermission(perm);
      if (perm === "granted") {
        setTimeout(() => dismiss(), 1200);
      }
    }
  }

  function dismiss() {
    setVisible(false);
    sessionStorage.setItem(DISMISSED_KEY, "1");
    onDismiss?.();
  }

  return (
    <>
      {/* Backdrop blur on mobile */}
      <div
        className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm md:hidden animate-in fade-in duration-300"
        onClick={dismiss}
      />

      {/* Banner — slides up from bottom on mobile, fixed card on desktop */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Install Occasionly"
        className={[
          // Base
          "fixed z-[100] flex flex-col gap-4",
          // Mobile: full bottom sheet
          "bottom-0 left-0 right-0 rounded-t-3xl md:rounded-2xl",
          // Desktop: floating card bottom-right
          "md:bottom-6 md:right-6 md:left-auto md:w-[340px]",
          // Styles
          "bg-[#13141f] border border-white/[0.09] shadow-2xl shadow-black/60 p-6",
          // Animation
          "animate-in slide-in-from-bottom-4 duration-500 ease-out",
        ].join(" ")}
      >
        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Dismiss install banner"
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          {/* App icon */}
          <div className="relative flex-shrink-0">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-rose-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <span className="text-2xl select-none" aria-hidden>🎉</span>
            </div>
            {/* Online dot */}
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#13141f]" />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-bold text-white leading-tight">Occasionly</p>
            <p className="text-[11px] text-zinc-500 mt-0.5 leading-tight">
              {platform === "ios"
                ? "Add to home screen for the best experience"
                : "Install for offline access & notifications"}
            </p>
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { emoji: "⚡", label: "Instant load" },
            { emoji: "📵", label: "Works offline" },
            { emoji: "🔔", label: "Push alerts" },
          ].map((f) => (
            <span
              key={f.label}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.07] text-[10px] text-zinc-400 font-medium"
            >
              {f.emoji} {f.label}
            </span>
          ))}
        </div>

        {/* iOS specific guide */}
        {showIOSGuide && <IOSInstructions />}

        {/* Notification granted success */}
        {notifPermission === "granted" && (
          <p className="text-xs text-emerald-400 font-medium animate-in fade-in">
            ✅ Notifications enabled — you&apos;re all set!
          </p>
        )}

        {/* Actions */}
        {!showIOSGuide && notifPermission !== "granted" && (
          <div className="flex gap-2 mt-1">
            <button
              onClick={dismiss}
              className="flex-1 text-xs font-medium text-zinc-500 hover:text-zinc-300 py-2.5 rounded-xl border border-white/[0.06] hover:border-white/10 hover:bg-white/[0.03] transition-all duration-200"
            >
              Not now
            </button>
            <button
              id="pwa-install-btn"
              onClick={handleInstall}
              disabled={installing}
              className={[
                "flex-[2] flex items-center justify-center gap-2 text-xs font-semibold py-2.5 rounded-xl transition-all duration-200",
                "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500",
                "text-white shadow-lg shadow-violet-600/25 hover:shadow-violet-500/40",
                "active:scale-[0.98] disabled:opacity-60",
              ].join(" ")}
            >
              <Download size={13} className={installing ? "animate-bounce" : ""} />
              {installing ? "Installing…" : platformLabel(platform)}
            </button>
          </div>
        )}

        {/* iOS: done button */}
        {showIOSGuide && (
          <button
            onClick={dismiss}
            className="mt-1 w-full text-xs font-semibold py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-zinc-300 hover:bg-white/[0.08] transition-all duration-200"
          >
            Got it
          </button>
        )}
      </div>
    </>
  );
}
