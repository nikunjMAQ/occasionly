"use client";

import { ConflictLog } from "@/types/conflict-log";

export default function ConflictViewer({
  conflicts,
}: {
  conflicts: ConflictLog[];
}) {
  if (conflicts.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4 border-t pt-8">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <span>Sync Conflicts</span>
        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold">
          {conflicts.length} Resolved
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conflicts.map((conflict) => (
          <div
            key={conflict.id}
            className="border border-red-100 rounded-2xl p-5 bg-red-50/10 shadow-3xs flex flex-col gap-2 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mr-8 -mt-8" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono bg-red-100/60 text-red-800 px-2 py-1 rounded-md">
                LWW Resolution
              </span>
              <span className="text-xs text-gray-400">
                {new Date(conflict.resolvedAt).toLocaleTimeString()}
              </span>
            </div>

            <p className="text-sm font-semibold text-gray-700">
              Entity ID: <span className="font-mono text-xs text-gray-500">{conflict.entityId}</span>
            </p>

            <div className="flex gap-4 mt-2">
              <div className="flex-1 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-400">Local Version</p>
                <p className="text-lg font-bold text-gray-700">v{conflict.localVersion}</p>
              </div>
              <div className="flex-1 bg-green-50/50 p-2.5 rounded-xl border border-green-100">
                <p className="text-xs text-green-600 font-medium">Cloud Version (Winner)</p>
                <p className="text-lg font-bold text-green-700">v{conflict.cloudVersion}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
