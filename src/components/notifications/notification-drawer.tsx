"use client";

import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bell, Check, Clock, CheckSquare } from "lucide-react";
import { AppNotification } from "@/types/app-notification";
import { 
  markAsCompleted, 
  markAsRead, 
  snoozeNotification 
} from "@/services/app-notification-service";
import { getSnoozeUntil } from "@/services/reminder-action-service";

export default function NotificationDrawer({
  notifications,
  refresh,
}: {
  notifications: AppNotification[];
  refresh?: () => void;
}) {
  const activeNotifications = notifications.filter((n) => {
    if (n.completed) return false;
    if (n.snoozedUntil && new Date(n.snoozedUntil) > new Date()) return false;
    return true;
  });

  const unreadCount = activeNotifications.filter((n) => !n.read).length;

  async function handleRead(id: string) {
    await markAsRead(id);
    if (refresh) refresh();
  }

  async function handleComplete(id: string) {
    await markAsCompleted(id);
    if (refresh) refresh();
  }

  async function handleSnooze(id: string) {
    await snoozeNotification(id, getSnoozeUntil(1));
    if (refresh) refresh();
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          id="notifications-bell-trigger"
          variant="ghost" 
          size="icon" 
          className="relative rounded-xl border border-white/10 text-gray-400 hover:text-white w-10 h-10 bg-white/5 cursor-pointer"
        >
          <Bell className="h-4.5 w-4.5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-extrabold shadow-sm animate-bounce">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-80 sm:w-[450px] bg-[#12141c] border-l border-white/10 text-white p-6 flex flex-col justify-between z-50">
        <div className="space-y-6 flex-1 flex flex-col min-h-0">
          <SheetHeader className="border-b border-white/5 pb-4">
            <SheetTitle className="text-2xl font-bold flex items-center gap-2 text-white">
              <Bell className="h-5 w-5 text-indigo-400" />
              <span>Inbox Activity</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20 ml-2">
                  {unreadCount} Unread
                </span>
              )}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto pr-1 space-y-4 pt-1">
            {activeNotifications.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
                <span className="text-3xl">✨</span>
                <h4 className="text-sm font-bold text-gray-200">Inbox is completely clear</h4>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  You are all caught up! No active alerts, birthdays, or anniversary reminders.
                </p>
              </div>
            ) : (
              activeNotifications.map((notif) => (
                <div 
                  key={notif.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col gap-3 ${
                    !notif.read 
                      ? "bg-indigo-500/5 border-indigo-500/20 shadow-sm" 
                      : "bg-white/5 border-white/5"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                      <h4 className={`text-sm font-bold ${!notif.read ? "text-gray-100" : "text-gray-400"}`}>
                        {notif.title}
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                    {!notif.read && (
                      <span className="h-2 w-2 rounded-full bg-indigo-400 flex-shrink-0 mt-1.5 shadow-sm animate-pulse" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    {!notif.read && (
                      <button
                        onClick={() => handleRead(notif.id)}
                        className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold text-indigo-400 flex items-center gap-1 cursor-pointer transition shadow-3xs"
                      >
                        <Check className="h-3 w-3" /> Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => handleComplete(notif.id)}
                      className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold text-emerald-400 flex items-center gap-1 cursor-pointer transition shadow-3xs"
                    >
                      <CheckSquare className="h-3 w-3" /> Done
                    </button>
                    <button
                      onClick={() => handleSnooze(notif.id)}
                      className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold text-amber-400 flex items-center gap-1 cursor-pointer transition shadow-3xs"
                    >
                      <Clock className="h-3 w-3" /> Snooze 1h
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
