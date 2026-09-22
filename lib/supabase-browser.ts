import { createClient, type SupabaseClient } from "@supabase/supabase-js";
let client: SupabaseClient | undefined;
export function getSupabase() {
  // This is the public browser key, never the server service-role key.
  client ??= createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xnvfmurtqcsehtdgqnfl.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_3YQK7gIEg507BPGi_68aEg_7QEGFAFo",
    { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "implicit" } }
  );
  return client;
}
