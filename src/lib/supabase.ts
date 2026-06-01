import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    // Suppress automatic session refresh network calls when offline
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

/** Returns true when Supabase is configured and reachable. */
export function isSupabaseEnabled(): boolean {
  return !!supabase;
}

