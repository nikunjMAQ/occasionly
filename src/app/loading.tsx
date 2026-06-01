"use client";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0b0d12] flex items-center justify-center relative overflow-hidden">
      {/* Decorative ambient glowing backdrops */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0,transparent_50%)] pointer-events-none" />

      <div className="flex flex-col items-center gap-4 relative z-10">
        <div className="h-10 w-10 rounded-full border-[3px] border-t-transparent border-violet-500 animate-spin shadow-md shadow-violet-500/20" />
        <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase animate-pulse">
          Loading vault states...
        </p>
      </div>
    </div>
  );
}
