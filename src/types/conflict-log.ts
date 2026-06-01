export interface ConflictLog {
  id: string;

  entityId: string;

  localVersion: number;

  cloudVersion: number;

  resolvedAt: string;

  strategy: "last_write_wins";
}
