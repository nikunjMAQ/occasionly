"use client";

import { useEffect } from "react";
import GlassCard from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global crash captured by Error Boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0b0d12] flex items-center justify-center p-6">
      {/* Radial glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06)_0,transparent_60%)] pointer-events-none" />

      <GlassCard className="p-8 max-w-md w-full text-center space-y-6 border-white/10 rounded-3xl shadow-2xl relative z-10">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/10">
          <AlertCircle size={28} />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Something went wrong
          </h1>
          <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
            Occasionly encountered an unexpected error. Don&apos;t worry, your offline persistence cache remains completely safe.
          </p>
        </div>

        <div className="bg-black/20 rounded-xl p-3.5 border border-white/5 text-left overflow-x-auto max-h-24">
          <p className="text-[10px] font-mono text-gray-400 break-all leading-normal">
            {error.message || "Unknown error boundary capture"}
          </p>
        </div>

        <Button
          onClick={reset}
          className="w-full bg-violet-600 hover:bg-violet-750 text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-violet-600/25 transition-all"
        >
          <RefreshCw size={14} />
          Retry Operation
        </Button>
      </GlassCard>
    </div>
  );
}
