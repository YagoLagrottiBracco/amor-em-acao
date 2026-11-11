import { NextRequest, NextResponse } from "next/server";
import {
  listVolunteers,
  createVolunteerRecord,
  updateVolunteerById,
  deleteVolunteerById,
} from "@/lib/volunteers";
import type { VolunteerStatus } from "@/lib/volunteer-types";
import { getAdminSessionFromRequest } from "@/lib/admin-auth";

function isAuthorized(request: NextRequest): boolean {
  return Boolean(getAdminSessionFromRequest(request));
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Sessão administrativa necessária." },
      { status: 401 }
    );
  }
  const { volunteers, storage } = await listVolunteers();
  return NextResponse.json({ volunteers, storage });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const name = String(data.nome || data.name || "").trim();
    const email = String(data.email || "").trim();
    const phone = String(data.telefone || data.phone || "").trim();
    const area = String(data.area || "").trim();
    const availability = String(
      data.disponibilidade || data.availability || "A combinar"
    ).trim();
    const message = data.mensagem || data.message
      ? String(data.mensagem || data.message).trim()
      : null;

    if (!name || !email || !phone || !area) {
      return NextResponse.json(
        {
          error:
            "Por favor, preencha nome completo, e-mail, telefone e área de interesse.",
        },
        { status: 400 }
      );
    }

    const volunteer = await createVolunteerRecord({
      name,
      email,
      phone,
      area,
      availability,
      message,
    });

    return NextResponse.json(
      {
        ok: true,
        volunteer,
        message: "Manifestação de interesse registrada com sucesso.",
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Não foi possível processar os dados enviados.",
      },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { error: "Faça login como administrador." },
        { status: 401 }
      );
    }
    const body = await request.json();

    const id = String(body.id || "").trim();
    if (!id) {
      return NextResponse.json(
        { error: "ID do voluntário é obrigatório." },
        { status: 400 }
      );
    }

    const validStatuses: VolunteerStatus[] = [
      "new",
      "contacted",
      "active",
      "archived",
    ];
    const status = validStatuses.includes(body.status)
      ? (body.status as VolunteerStatus)
      : undefined;

    const updated = await updateVolunteerById({
      id,
      status,
      notes: body.notes !== undefined ? String(body.notes) : undefined,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Cadastro de voluntário não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, volunteer: updated });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Erro ao atualizar voluntário.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Faça login como administrador." },
      { status: 401 }
    );
  }

  if (!id) {
    return NextResponse.json(
      { error: "ID do voluntário é obrigatório." },
      { status: 400 }
    );
  }

  const ok = await deleteVolunteerById(id);
  return NextResponse.json({ ok });
}
