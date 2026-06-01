import { ReminderLog } from "@/types/reminder-log";

export default function RecoveryBanner({
  logs,
}: {
  logs: ReminderLog[];
}) {
  const missedLogs = logs.filter(
    (log) =>
      log.status === "missed"
  );

  if (missedLogs.length === 0) {
    return null;
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm animate-pulse">
      <div>
        <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2">
          ⚠️ Missed Reminders Detected
        </h2>

        <p className="mt-1 text-amber-800">
          You have{" "}
          <span className="font-bold underline">{missedLogs.length}</span> missed
          reminder(s) since your last session. We have captured them in your history so you don't lose track!
        </p>
      </div>
    </div>
  );
}
