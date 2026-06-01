"use client";

import { exportBackup } from "@/services/backup-service";
import { logger } from "@/lib/logger";

export default function ExportBackupButton() {
  async function handleExport() {
    try {
      const backup =
        await exportBackup();

      const blob = new Blob(
        [
          JSON.stringify(
            backup,
            null,
            2
          ),
        ],
        {
          type: "application/json",
        }
      );

      const url =
        URL.createObjectURL(blob);

      const a =
        document.createElement("a");

      a.href = url;

      a.download =
        "occasionly-backup.json";

      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      logger.log("backup", "Database backup export failed", error);
      alert("Failed to export backup. Please try again.");
    }
  }

  return (
    <button
      onClick={handleExport}
      className="bg-black hover:bg-gray-800 text-white px-5 py-3 rounded-xl cursor-pointer font-medium transition shadow-xs"
    >
      Export Backup
    </button>
  );
}
