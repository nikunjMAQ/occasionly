function getEnv(
  value: string | undefined,
  key: string
) {
  if (!value) {
    throw new Error(
      `Missing env variable: ${key}`
    );
  }

  return value;
}

export const env = {
  supabaseUrl: getEnv(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    "NEXT_PUBLIC_SUPABASE_URL"
  ),

  supabaseAnonKey: getEnv(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  ),

  geminiApiKey: getEnv(
    process.env.NEXT_PUBLIC_GEMINI_API_KEY,
    "NEXT_PUBLIC_GEMINI_API_KEY"
  ),
};
