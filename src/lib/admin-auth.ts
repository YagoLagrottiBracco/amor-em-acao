import crypto from "crypto";
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const ADMIN_COOKIE_NAME = "amor_em_acao_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSigningSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "amor-em-acao-fallback-signing-key-2026"
  );
}

export interface AdminSessionPayload {
  email: string;
  exp: number;
}

export function createSessionToken(email: string): string {
  const payload: AdminSessionPayload = {
    email,
    exp: Date.now() + SESSION_DURATION_MS,
  };
  const encoded = Buffer.from(JSON.stringify(payload), "utf-8").toString(
    "base64url"
  );
  const signature = crypto
    .createHmac("sha256", getSigningSecret())
    .update(encoded)
    .digest("base64url");
  return `${encoded}.${signature}`;
}

export function verifySessionToken(
  token?: string | null
): AdminSessionPayload | null {
  if (!token || !token.includes(".")) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expectedSig = crypto
    .createHmac("sha256", getSigningSecret())
    .update(encoded)
    .digest("base64url");

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSig);
  if (
    sigBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf-8")
    ) as AdminSessionPayload;
    if (!payload.exp || Date.now() > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function getAdminSessionFromRequest(
  request: NextRequest
): AdminSessionPayload | null {
  const cookieToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(cookieToken);
}

/**
 * Validates admin credentials exclusively against Supabase Auth (`signInWithPassword`).
 * Administrators are provisioned directly in Supabase (Authentication -> Users or supabase/create_admin.sql).
 */
export async function authenticateAdminCredentials(
  email: string,
  password: string
): Promise<{ ok: boolean; email?: string; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  if (!cleanEmail || !cleanPass) {
    return { ok: false, error: "Informe seu e-mail e sua senha." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !supabaseKey) {
    return {
      ok: false,
      error:
        "Supabase não configurado. Verifique as chaves NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  try {
    const authClient = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await authClient.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPass,
    });

    if (error || !data?.user?.email) {
      return {
        ok: false,
        error:
          "E-mail ou senha inválidos. Verifique as credenciais cadastradas no Supabase Auth.",
      };
    }

    return { ok: true, email: data.user.email };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Erro ao autenticar no Supabase Auth.";
    return {
      ok: false,
      error: message,
    };
  }
}
