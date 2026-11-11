import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  listDonations,
  createDonationRecord,
  updateDonationBySessionOrId,
  deleteDonationById,
} from "@/lib/donations";
import type { DonationFrequency, DonationStatus } from "@/lib/donation-types";
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
  const { donations, storage } = await listDonations();
  return NextResponse.json({ donations, storage });
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { error: "Faça login como administrador." },
        { status: 401 }
      );
    }
    const body = await request.json();

    // Ação opcional: Verificar uma sessão diretamente na API do Stripe (sem webhook)
    if (body.action === "verify_stripe" && body.stripeSessionId) {
      const secretKey = process.env.STRIPE_SECRET_KEY;
      if (!secretKey || secretKey.includes("sua_chave_secreta_aqui")) {
        return NextResponse.json(
          {
            error:
              "STRIPE_SECRET_KEY ainda não está configurada para consultar a API da Stripe.",
          },
          { status: 503 }
        );
      }
      const stripe = new Stripe(secretKey);
      const session = await stripe.checkout.sessions.retrieve(
        String(body.stripeSessionId).trim()
      );
      const isPaid =
        session.payment_status === "paid" || session.status === "complete";
      const updated = await updateDonationBySessionOrId({
        stripeSessionId: session.id,
        status: isPaid ? "paid" : "pending",
        donorName: session.customer_details?.name || undefined,
        donorEmail: session.customer_details?.email || undefined,
      });

      return NextResponse.json({
        ok: true,
        donation: updated,
        stripePaymentStatus: session.payment_status,
      });
    }

    // Registro manual de doação (Pix, transferência bancária ou Stripe manual)
    const amountBRL = Number(body.amountBRL);
    if (!amountBRL || Number.isNaN(amountBRL) || amountBRL <= 0) {
      return NextResponse.json(
        { error: "Informe um valor válido em reais (R$)." },
        { status: 400 }
      );
    }

    const frequency: DonationFrequency =
      body.frequency === "monthly" ? "monthly" : "once";
    const status: DonationStatus = ["pending", "paid", "failed", "canceled"].includes(
      body.status
    )
      ? body.status
      : "paid";

    const created = await createDonationRecord({
      donorName: body.donorName ? String(body.donorName).trim() : "Apoiador Anônimo",
      donorEmail: body.donorEmail ? String(body.donorEmail).trim() : null,
      amountCents: Math.round(amountBRL * 100),
      currency: "BRL",
      frequency,
      project: String(body.project || "casa-amarela"),
      status,
      paymentMethod:
        body.paymentMethod === "pix" ||
        body.paymentMethod === "transfer" ||
        body.paymentMethod === "stripe"
          ? body.paymentMethod
          : "manual",
      notes: body.notes ? String(body.notes).trim() : null,
    });

    return NextResponse.json({ ok: true, donation: created });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Erro ao processar doação.",
      },
      { status: 500 }
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

    if (!body.id) {
      return NextResponse.json(
        { error: "ID da doação é obrigatório." },
        { status: 400 }
      );
    }

    const updated = await updateDonationBySessionOrId({
      id: String(body.id),
      status: body.status,
      donorName: body.donorName,
      donorEmail: body.donorEmail,
      notes: body.notes,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Doação não encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, donation: updated });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Erro ao atualizar doação.",
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
      { error: "ID da doação é obrigatório." },
      { status: 400 }
    );
  }

  const ok = await deleteDonationById(id);
  return NextResponse.json({ ok });
}
