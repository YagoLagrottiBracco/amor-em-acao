import { NextRequest, NextResponse } from "next/server";
import { getAdminSessionFromRequest } from "@/lib/admin-auth";
import {
  getAllActionsAsync,
  upsertActionAsync,
  deleteActionAsync,
  getActionBySlugAsync,
} from "@/lib/actions";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const includeDrafts = searchParams.get("drafts") === "1";

    if (slug) {
      const action = await getActionBySlugAsync(slug);
      if (!action) {
        return NextResponse.json(
          { error: "Ação não encontrada." },
          { status: 404 }
        );
      }
      return NextResponse.json({ action });
    }

    if (includeDrafts) {
      const session = getAdminSessionFromRequest(request);
      if (!session) {
        return NextResponse.json(
          { error: "Não autorizado para listar rascunhos." },
          { status: 401 }
        );
      }
    }

    const { actions, storage } = await getAllActionsAsync({
      includeDrafts,
    });

    return NextResponse.json({
      actions,
      storage,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno ao consultar ações." },
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
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: "Título e slug são obrigatórios para a página de ação." },
        { status: 400 }
      );
    }

    const { action, storage } = await upsertActionAsync(body);
    const { actions } = await getAllActionsAsync({ includeDrafts: true });

    return NextResponse.json({
      success: true,
      action,
      actions,
      storage,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao salvar página de ação." },
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
        { error: "ID da ação é obrigatório para exclusão." },
        { status: 400 }
      );
    }

    const { success, storage } = await deleteActionAsync(id);
    const { actions } = await getAllActionsAsync({ includeDrafts: true });

    return NextResponse.json({
      success,
      actions,
      storage,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao excluir página de ação." },
      { status: 500 }
    );
  }
}
