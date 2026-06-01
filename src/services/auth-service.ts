import { supabase } from "@/lib/supabase";

export async function signInWithGoogle() {
  if (!supabase) return { data: null, error: new Error("Supabase not configured") };
  return supabase.auth.signInWithOAuth({ provider: "google" });
}

export async function signOut() {
  if (!supabase) return;
  return supabase.auth.signOut();
}

export async function getCurrentUser() {
  if (!supabase) return null;
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      // Network errors (offline, Supabase paused) are non-fatal — return null quietly
      if (
        error.message?.includes("Failed to fetch") ||
        error.message?.includes("NetworkError") ||
        error.status === 0
      ) {
        return null;
      }
      console.warn("[auth] getUser error:", error.message);
    }
    return user ?? null;
  } catch (err: any) {
    // Swallow transient network failures silently
    if (
      err?.message?.includes("Failed to fetch") ||
      err?.name === "TypeError"
    ) {
      return null;
    }
    console.warn("[auth] unexpected error:", err);
    return null;
  }
}
