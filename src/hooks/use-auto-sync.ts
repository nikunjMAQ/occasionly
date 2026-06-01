"use client";

import { useEffect } from "react";

import { processSyncQueue } from "@/services/sync-processor";

export function useAutoSync() {
  useEffect(() => {
    processSyncQueue();

    const interval =
      setInterval(() => {
        processSyncQueue();
      }, 30000);

    return () =>
      clearInterval(interval);
  }, []);
}
