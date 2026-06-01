import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

export const supabase = createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);

/** Returns true when Supabase is configured and reachable. */
export function isSupabaseEnabled(): boolean {
  return !!supabase;
}

