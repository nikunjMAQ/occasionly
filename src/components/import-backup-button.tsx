"use client";

import { importBackup } from "@/services/backup-service";
import { logger } from "@/lib/logger";

export default function ImportBackupButton({
  refresh,
}: {
  refresh: () => void;
}) {
  async function handleImport(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    try {
      const text =
        await file.text();

      const backup =
        JSON.parse(text);

      await importBackup(
        backup
      );

      refresh();
    } catch (error) {
      logger.log("backup", "Database backup import/restoration failed", error);
      alert("Invalid backup file format. Could not restore database.");
    }
  }

  return (
    <label className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-5 py-3 rounded-xl cursor-pointer inline-block transition shadow-2xs border border-gray-300/40">
      Import Backup

      <input
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
    </label>
  );
}
