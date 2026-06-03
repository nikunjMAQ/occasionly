"use client";

import { ReactNode, useState, useEffect } from "react";
import Sidebar from "./sidebar";
import {
  Bell,
  Plus,
  Menu,
  Sun,
  Moon,
  LayoutDashboard,
  Calendar as CalendarIcon,
  Users,
  Settings as SettingsIcon,
  BarChart3,
  Search,
  Mail as MailIcon,
} from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AppNotification } from "@/types/app-notification";
import { getNotifications } from "@/services/app-notification-service";
import { getReminderLogs } from "@/services/reminder-log-service";
import { getConflictLogs } from "@/services/conflict-service";
import { ReminderLog } from "@/types/reminder-log";
import { ConflictLog } from "@/types/conflict-log";
import NotificationDrawer from "../notifications/notification-drawer";
import { useUIStore } from "@/store/ui-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AddEventForm from "../add-event-form";
import DataManagement from "../data-management";
import ReminderHistory from "../reminder-history";
import ConflictViewer from "../conflict-viewer";
import SyncStatus from "../sync-status";
import NetworkStatus from "../network-status";
import AuthButton from "../auth-button";
import RealtimeStatus from "../realtime-status";
import DevDebugPanel from "../dev-debug-panel";
import { OccasionEvent } from "@/types/event";
import { getAllEvents } from "@/services/event-service";
import CommandPalette from "../command-palette";
import { flushSyncQueue } from "@/services/sync-processor";
import { supabase } from "@/lib/supabase";
import { useRealtimeSync } from "@/hooks/use-realtime-sync";
import { registerSW } from "@/lib/register-sw";
import PWAInstallBanner from "../pwa-install-banner";

export default function AppShell({
  children,
}: {
  children: ReactNode;
}) {
  useRealtimeSync();

  const [isDark, setIsDark] = useState(true);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [logs, setLogs] = useState<ReminderLog[]>([]);
  const [conflicts, setConflicts] = useState<ConflictLog[]>([]);
  const [events, setEvents] = useState<OccasionEvent[]>([]);

  const {
    addReminderOpen,
    closeAddReminder,
    editingEvent,
    settingsOpen,
    setSettingsOpen,
    openCommandPalette,
    openAddReminder,
  } = useUIStore();

  async function loadSystemStates() {
    try {
      const eventData = await getAllEvents();
      setEvents(eventData);
      const notificationData = await getNotifications();
      setNotifications(notificationData);
      const logData = await getReminderLogs();
      setLogs(logData);
      const conflictData = await getConflictLogs();
      setConflicts(conflictData);
    } catch (e) {
      console.error("Failed to load systems in layout shell", e);
    }
  }

  useEffect(() => {
    loadSystemStates();

    // 1. Register Service Worker
    registerSW();

    // 2. App Boot Sync
    flushSyncQueue();

    // 3. Online Return Listener
    function handleOnline() {
      flushSyncQueue();
    }
    window.addEventListener("online", handleOnline);

    // 4. Auth Change Listener (flushes when guest logs in)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (authEvent, session) => {
        if (authEvent === "SIGNED_IN") {
          await flushSyncQueue();
        }
        window.dispatchEvent(new Event("auth-changed"));
      }
    );

    // Re-fetch system logs and notifications when an event is saved/deleted
    window.addEventListener("event-saved", loadSystemStates);

    return () => {
      window.removeEventListener("event-saved", loadSystemStates);
      window.removeEventListener("online", handleOnline);
      subscription.unsubscribe();
    };
  }, []);

  function toggleTheme() {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  }

  const mobileNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Calendar", href: "/calendar", icon: CalendarIcon },
    { name: "People", href: "/people", icon: Users },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Settings", href: "/settings", icon: SettingsIcon },
    { name: "Contact", href: "/contact", icon: MailIcon },
  ];

  return (
    <div className="min-h-screen bg-[#0f1115] text-zinc-150 flex font-sans antialiased overflow-x-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Area Wrapper */}
      <div className="flex flex-col flex-1 min-w-0 md:pl-60">
        {/* Topbar Header */}
        <header className="sticky top-0 z-40 flex-shrink-0 h-20 bg-black/20 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 gap-6 transition-colors duration-300">
          {/* Mobile menu trigger */}
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-zinc-400 hover:text-white"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 p-0 bg-[#0f1115] border-r border-white/10 text-white"
              >
                <div className="flex flex-col h-full py-5 justify-between">
                  <div>
                    <div className="px-6 flex flex-col gap-1.5">
                      <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-400 via-violet-400 to-rose-400 bg-clip-text text-transparent">
                        Occasionly 🎉
                      </span>
                      <p className="text-xs text-gray-500 font-medium tracking-wide">
                        Relationship OS
                      </p>
                    </div>
                    <Separator className="my-4 bg-white/10" />
                    <nav className="px-4 space-y-1.5">
                      {mobileNavigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="group flex items-center px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer font-medium text-sm"
                        >
                          <item.icon className="mr-3 h-4.5 w-4.5 flex-shrink-0" />
                          {item.name}
                        </Link>
                      ))}
                    </nav>
                  </div>
                  <div className="px-6 py-4 border-t border-white/10 bg-black/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs border border-indigo-500/35">
                        NK
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-200">
                          Nikunj Gupta
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className="text-gray-400 hover:text-white"
                    >
                      {isDark ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Moon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Mobile Header Title */}
            <span className="md:hidden text-lg font-extrabold bg-gradient-to-r from-indigo-400 via-violet-400 to-rose-400 bg-clip-text text-transparent">
              Occasionly
            </span>
          </div>

          {/* Center: Search trigger (desktop only) */}
          <button
            onClick={openCommandPalette}
            className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/8 text-gray-500 hover:text-gray-300 hover:bg-white/8 hover:border-white/15 transition-all duration-200 text-sm cursor-pointer group min-w-[220px]"
          >
            <Search size={14} className="flex-shrink-0" />
            <span className="flex-1 text-left text-xs">
              Search people, actions...
            </span>
            <span className="flex items-center gap-0.5">
              <kbd className="text-[9px] font-mono bg-white/5 border border-white/10 rounded px-1 py-0.5 group-hover:border-white/20">
                ⌘
              </kbd>
              <kbd className="text-[9px] font-mono bg-white/5 border border-white/10 rounded px-1 py-0.5 group-hover:border-white/20">
                K
              </kbd>
            </span>
          </button>

          {/* Quick Header Actions: Sync & Notifications */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 text-[11px] border-r border-white/5 pr-4">
              <SyncStatus />
              <RealtimeStatus />
              <NetworkStatus />
              <AuthButton />
            </div>

            {/* Notification Bell Slide-over Drawer */}
            <NotificationDrawer
              notifications={notifications}
              refresh={loadSystemStates}
            />
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto focus:outline-none relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 transition-all duration-300">
            {children}
          </div>
        </main>
      </div>

      {/* Floating Action Button (Universal FAB) */}
      <Button
        onClick={openAddReminder}
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-violet-600 text-white hover:bg-violet-750 shadow-lg shadow-violet-600/30 flex items-center justify-center z-50 transition-all duration-200 cursor-pointer scale-100 hover:scale-105 active:scale-95 border border-white/10"
        size="icon"
        title="Add Reminder"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Unified Settings & Data Operations Modal */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto bg-[#12141c] border border-white/10 rounded-3xl shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              ⚙️ Settings & System Data
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500 mt-1">
              Export/import backups, monitor logs, and manage offline data operations.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 space-y-2">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wide">Data Operations</h3>
                <p className="text-[11px] text-gray-600 mb-3">Backup or recover your local IndexedDB records seamlessly.</p>
                <DataManagement refresh={loadSystemStates} />
              </div>
              <DevDebugPanel />
            </div>
            <div className="space-y-4">
              <ReminderHistory logs={logs} />
              <ConflictViewer conflicts={conflicts} />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add / Edit Dialog */}
      <Dialog open={addReminderOpen} onOpenChange={(open) => {
        if (!open) {
          closeAddReminder();
          document.body.style.overflow = "";
        }
      }}>
        <DialogContent className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-[calc(100%-2rem)] gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 outline-none sm:max-w-[500px] h-auto bg-[#12141c] border border-white/10 sm:rounded-3xl shadow-2xl p-0 sm:p-6 flex flex-col max-h-[85vh] overflow-y-auto max-sm:fixed max-sm:bottom-0 max-sm:top-auto max-sm:left-0 max-sm:right-0 max-sm:translate-x-0 max-sm:translate-y-0 max-sm:max-w-full max-sm:rounded-b-none max-sm:rounded-t-[32px] max-sm:border-t max-sm:border-white/10 max-sm:max-h-[92vh] max-sm:gap-0">
          {/* Drag Handle for Bottom Sheet on Mobile */}
          <div className="w-12 h-1 bg-white/20 rounded-full mx-auto my-2.5 sm:hidden flex-shrink-0" />

          {/* Mobile Sticky Header */}
          <div className="sticky top-0 z-10 bg-[#12141c] border-b border-white/5 px-6 pb-4 pt-1 flex items-center justify-between sm:hidden flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                closeAddReminder();
                document.body.style.overflow = "";
              }}
              className="text-sm font-semibold text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              ← Close
            </button>
            <span className="font-bold text-white text-sm">
              {editingEvent ? "Edit Reminder" : "Add Reminder"}
            </span>
            <div className="w-12" />
          </div>

          <div className="p-6 sm:p-0 flex-1 overflow-y-auto max-sm:pb-32">
            <DialogHeader className="hidden sm:block">
              <DialogTitle className="text-xl font-bold text-white">
                {editingEvent ? "✏️ Edit Reminder" : "✨ Add Reminder"}
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 mt-1">
                Configure details, AI preferred tones, and notifications for this memory milestone.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <AddEventForm
                onEventSaved={() => {
                  closeAddReminder();
                  document.body.style.overflow = "";
                  // Dispatch standard HTML5 save trigger
                  window.dispatchEvent(new Event("event-saved"));
                }}
                editingEvent={editingEvent}
                clearEditing={() => {
                  closeAddReminder();
                  document.body.style.overflow = "";
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>


      {/* Global Command Palette Search */}
      <CommandPalette events={events} onAddReminder={openAddReminder} />

      {/* PWA Install Banner (shows automatically after 2.5s if installable) */}
      <PWAInstallBanner />
    </div>
  );
}
