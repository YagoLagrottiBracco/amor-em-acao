import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  authenticateAdminCredentials,
  createSessionToken,
  getAdminSessionFromRequest,
} from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  const session = getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    email: session.email,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || "");
    const password = String(body.password || "");

    const result = await authenticateAdminCredentials(email, password);
    if (!result.ok || !result.email) {
      return NextResponse.json(
        { error: result.error || "Credenciais inválidas." },
        { status: 401 }
      );
    }

    const token = createSessionToken(result.email);
    const response = NextResponse.json({
      authenticated: true,
      email: result.email,
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Não foi possível processar o login." },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
