"use client";

import { useEffect, useState } from "react";
import { useNetworkStatus } from "@/hooks/use-network-status";

export default function NetworkStatus() {
  const online = useNetworkStatus();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="text-sm font-semibold bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full shadow-2xs flex items-center gap-1.5 w-max text-gray-400">
        <span className="w-2.5 h-2.5 rounded-full bg-gray-300 animate-pulse" />
        <span>Checking...</span>
      </div>
    );
  }

  return (
    <div
      className={`text-sm font-semibold bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full shadow-2xs flex items-center gap-1.5 w-max transition-colors duration-300 ${
        online
          ? "text-green-600"
          : "text-red-500"
      }`}
    >
      <span className={`w-2.5 h-2.5 rounded-full animate-pulse transition-colors duration-300 ${online ? "bg-green-500" : "bg-red-500"}`} />
      <span>{online ? "Online 🌐" : "Offline ⚠️"}</span>
    </div>
  );
}
