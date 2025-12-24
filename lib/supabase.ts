import Constants from "expo-constants";
import { createClient } from "@supabase/supabase-js";

// Resolve values from Expo public env or `extra` in app config
const extra = Constants.expoConfig?.extra ?? Constants.manifest?.extra ?? {};
const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL || (extra as any).supabaseUrl || "";
const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  (extra as any).supabaseAnonKey ||
  "";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing Supabase config. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to .env.local (see .env.local.example)."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
