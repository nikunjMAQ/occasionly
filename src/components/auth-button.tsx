"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, signInWithGoogle, signOut } from "@/services/auth-service";
import { LogIn, LogOut, User } from "lucide-react";

export default function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      // Silently fail — no Supabase or offline
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  // While loading, render nothing (avoid layout shift)
  if (loading) return null;

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-400">
          <User size={11} className="text-emerald-400" />
          <span className="truncate max-w-[120px]">{user.email}</span>
        </div>
        <button
          type="button"
          onClick={async () => {
            await signOut();
            setUser(null);
          }}
          title="Sign out"
          className="p-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <LogOut size={11} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signInWithGoogle()}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-500 hover:text-gray-300 hover:bg-white/8 hover:border-white/15 transition-colors cursor-pointer"
    >
      <LogIn size={11} />
      <span>Sign in</span>
    </button>
  );
}
