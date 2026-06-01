"use client";

import { AppNotification } from "@/types/app-notification";

import {
  markAsCompleted,
  markAsRead,
  snoozeNotification,
} from "@/services/app-notification-service";

import { getSnoozeUntil } from "@/services/reminder-action-service";

export default function NotificationCenter({
  notifications,
  refresh,
}: {
  notifications: AppNotification[];

  refresh: () => void;
}) {
  async function handleRead(
    id: string
  ) {
    await markAsRead(id);

    refresh();
  }

  async function handleComplete(
    id: string
  ) {
    await markAsCompleted(id);

    refresh();
  }

  async function handleSnooze(
    id: string
  ) {
    await snoozeNotification(
      id,
      getSnoozeUntil(1)
    );

    refresh();
  }

  // Filter out completed and snoozed notifications
  const activeNotifications = notifications.filter((n) => {
    if (n.completed) {
      return false;
    }
    if (n.snoozedUntil && new Date(n.snoozedUntil) > new Date()) {
      return false;
    }
    return true;
  });

  if (activeNotifications.length === 0) {
    return (
      <section className="space-y-4">
        <h2 className="text-3xl font-bold">
          Notification Center 🔔
        </h2>
        <p className="text-gray-500 italic border rounded-2xl p-5 bg-gray-50/50">
          Inbox is clear. No active alerts.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bold">
        Notification Center 🔔
      </h2>

      <div className="space-y-4">
        {activeNotifications.map(
          (notification) => (
            <div
              key={notification.id}
              className={`border rounded-2xl p-5 space-y-3 transition bg-white shadow-xs ${
                !notification.read ? "border-blue-200 bg-blue-50/20" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {
                      notification.title
                    }
                  </h3>

                  <p className="text-gray-600 mt-1">
                    {
                      notification.message
                    }
                  </p>
                </div>

                {!notification.read && (
                  <span className="bg-blue-500 w-2.5 h-2.5 rounded-full shadow-xs animate-ping" />
                )}
              </div>

              <div className="flex gap-3 pt-1">
                {!notification.read && (
                  <button
                    onClick={() =>
                      handleRead(
                        notification.id
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition shadow-xs"
                  >
                    Mark Read
                  </button>
                )}

                {!notification.completed && (
                  <>
                    <button
                      onClick={() =>
                        handleComplete(
                          notification.id
                        )
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition shadow-xs"
                    >
                      Done
                    </button>

                    <button
                      onClick={() =>
                        handleSnooze(
                          notification.id
                        )
                      }
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition shadow-xs"
                    >
                      Snooze 1 Hour
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
