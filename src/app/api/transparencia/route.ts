import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/admin-auth";
import {
  getAllTransparencyDocsAsync,
  upsertTransparencyDocAsync,
  deleteTransparencyDocAsync,
} from "@/lib/transparency";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "1";

    let includeInactive = false;
    if (all) {
      const session = getAdminSessionFromRequest(request);
      if (session) {
        includeInactive = true;
      }
    }

    const { documents, storage } = await getAllTransparencyDocsAsync({
      includeInactive,
    });

    return NextResponse.json({
      documents,
      storage,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao consultar documentos de transparência." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json(
      { error: "Acesso restrito. Faça login como administrador." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    if (!body.title || !body.fileUrl || !body.category) {
      return NextResponse.json(
        {
          error:
            "Título, categoria e link/arquivo são obrigatórios para documentos de transparência.",
        },
        { status: 400 }
      );
    }

    const { document, storage } = await upsertTransparencyDocAsync(body);
    const { documents } = await getAllTransparencyDocsAsync({
      includeInactive: true,
    });

    return NextResponse.json({
      success: true,
      document,
      documents,
      storage,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao salvar documento de transparência." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  return POST(request);
}

export async function DELETE(request: NextRequest) {
  const session = getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json(
      { error: "Acesso restrito. Faça login como administrador." },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID do documento é obrigatório para exclusão." },
        { status: 400 }
      );
    }

    const { success, storage } = await deleteTransparencyDocAsync(id);
    const { documents } = await getAllTransparencyDocsAsync({
      includeInactive: true,
    });

    return NextResponse.json({
      success,
      documents,
      storage,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao excluir documento de transparência." },
      { status: 500 }
    );
  }
}
