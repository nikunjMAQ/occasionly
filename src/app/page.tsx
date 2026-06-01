"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0b0d12] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-t-transparent border-violet-500 animate-spin" />
        <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase animate-pulse">
          Redirecting to Relationship OS...
        </p>
      </div>
    </div>
  );
}
