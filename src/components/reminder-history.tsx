"use client";

import { ReminderLog } from "@/types/reminder-log";

export default function ReminderHistory({
  logs,
}: {
  logs: ReminderLog[];
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold">
        Reminder History
      </h2>

      {logs.length === 0 ? (
        <p className="text-gray-500 italic">No reminders sent yet.</p>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="border rounded-xl p-4 bg-white shadow-xs"
            >
              <p className="font-semibold text-gray-700">
                Event ID: <span className="font-mono text-sm text-gray-500">{log.eventId}</span>
              </p>

              <p className="text-gray-600">
                Sent At:{" "}
                {new Date(
                  log.sentAt
                ).toLocaleString()}
              </p>

              <p className="text-gray-600">
                Status:{" "}
                <span
                  className={`capitalize font-medium ${
                    log.status === "missed"
                      ? "text-red-500 font-semibold"
                      : "text-green-600"
                  }`}
                >
                  {log.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
