import { db } from "@/lib/db";

import { OccasionlyBackup } from "@/types/backup";

export async function exportBackup(): Promise<OccasionlyBackup> {
  const events =
    await db.events.toArray();

  const reminderLogs =
    await db.reminderLogs.toArray();

  const notifications =
    await db.notifications.toArray();

  return {
    exportedAt:
      new Date().toISOString(),

    version: "1.0.0",

    events,

    reminderLogs,

    notifications,
  };
}

export async function importBackup(
  backup: OccasionlyBackup
) {
  await db.events.clear();

  await db.reminderLogs.clear();

  await db.notifications.clear();

  await db.events.bulkAdd(
    backup.events
  );

  await db.reminderLogs.bulkAdd(
    backup.reminderLogs
  );

  await db.notifications.bulkAdd(
    backup.notifications
  );
}
