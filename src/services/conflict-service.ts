import { db } from "@/lib/db";

import { ConflictLog } from "@/types/conflict-log";

export async function addConflictLog(
  log: ConflictLog
) {
  return db.conflictLogs.add(log);
}

export async function getConflictLogs() {
  return db.conflictLogs.toArray();
}
