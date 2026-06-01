import ExportBackupButton from "./export-backup-button";

import ImportBackupButton from "./import-backup-button";

export default function DataManagement({
  refresh,
}: {
  refresh: () => void;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bold">
        Data Management 💾
      </h2>

      <div className="border rounded-2xl p-6 bg-white shadow-xs space-y-4">
        <p className="text-gray-600 text-sm">
          Keep your connections safe. Export your offline database as a portable JSON file to preserve your data or restore your backup seamlessly at any time.
        </p>
        <div className="flex gap-4 flex-wrap">
          <ExportBackupButton />

          <ImportBackupButton
            refresh={refresh}
          />
        </div>
      </div>
    </section>
  );
}
