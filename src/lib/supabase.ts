import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";

// Supports both modern Supabase Publishable Key (sb_publishable_...) and legacy Anon Key (JWT)
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
  "";

// Supports both modern Supabase Secret Key (sb_secret_...) and legacy Service Role Key (JWT)
const supabaseSecretKey =
  process.env.SUPABASE_SECRET_KEY?.trim() ||
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
  "";

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && (supabaseSecretKey || supabasePublishableKey));
}

let serverClient: SupabaseClient | null = null;

/**
 * Supabase server client for API routes and Server Components.
 * Prioritizes Secret / Service Role Key for administrative operations
 * and falls back to Publishable / Anon Key when in read-only public context.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!serverClient) {
    serverClient = createClient(
      supabaseUrl,
      supabaseSecretKey || supabasePublishableKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
  }
  return serverClient;
}
