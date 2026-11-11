import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || "";

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && (supabaseServiceKey || supabaseAnonKey));
}

let serverClient: SupabaseClient | null = null;

/**
 * Cliente Supabase para uso em rotas de API e Server Components.
 * Prioriza a Service Role Key (para operações de escrita do painel admin sem depender de RLS complexa)
 * e faz fallback para a Anon Key quando em modo público.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!serverClient) {
    serverClient = createClient(
      supabaseUrl,
      supabaseServiceKey || supabaseAnonKey,
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
