"use client";

import { useEffect, useState } from "react";

import { getSyncQueue } from "@/services/sync-queue-service";

export default function SyncStatus() {
  const [count, setCount] =
    useState(0);

  async function loadQueue() {
    const queue =
      await getSyncQueue();

    setCount(queue.length);
  }

  useEffect(() => {
    loadQueue();

    const interval =
      setInterval(loadQueue, 5000);

    return () =>
      clearInterval(interval);
  }, []);

  return (
    <div className="text-sm font-semibold bg-gray-50 border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full shadow-2xs flex items-center gap-1.5 w-max">
      {count === 0 ? (
        <>
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
          <span>All changes synced ☁️</span>
        </>
      ) : (
        <>
          <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" />
          <span>{count} pending sync</span>
        </>
      )}
    </div>
  );
}
