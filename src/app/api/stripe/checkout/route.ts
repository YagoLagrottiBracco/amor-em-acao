import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { SITE_CONFIG } from "@/lib/seo";
import { createDonationRecord } from "@/lib/donations";

const PROJECT_NAMES: Record<string, string> = {
  "casa-amarela": "Casa Amarela · Jardim Gramacho (Duque de Caxias/RJ)",
  alimentacao: "Alimentação e Higiene Infantil",
  oficinas: "Oficinas, Educação e Cultura",
  geral: "Fundo Geral · Onde for mais urgente",
  nordeste: "Ações no Nordeste · Matões do Norte/MA",
  internacional: "Atuação Internacional",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawAmount = Number(body.amount);
    const frequency =
      body.frequency === "subscription" ? "subscription" : "payment";
    const projectKey = String(body.project || "casa-amarela");
    const projectName =
      PROJECT_NAMES[projectKey] || "Associação Humanitária Amor em Ação";
    const donorName = body.donorName ? String(body.donorName).trim() : "";
    const donorEmail = body.donorEmail ? String(body.donorEmail).trim() : "";

    if (!rawAmount || Number.isNaN(rawAmount) || rawAmount < 5) {
      return NextResponse.json(
        { error: "O valor mínimo para doação é de R$ 5,00." },
        { status: 400 }
      );
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey || secretKey.includes("sua_chave_secreta_aqui")) {
      return NextResponse.json(
        {
          error:
            "Chave STRIPE_SECRET_KEY ainda não configurada nas variáveis de ambiente da Vercel (.env.local). Adicione sua chave secreta da Stripe para ativar o checkout em produção.",
        },
        { status: 503 }
      );
    }

    const stripe = new Stripe(secretKey);

    const origin =
      request.headers.get("origin") ||
      SITE_CONFIG.url ||
      "http://localhost:3000";

    const unitAmountCents = Math.round(rawAmount * 100);

    const session = await stripe.checkout.sessions.create({
      mode: frequency,
      payment_method_types: ["card"],
      locale: "pt-BR",
      customer_email: donorEmail || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "brl",
            unit_amount: unitAmountCents,
            product_data: {
              name:
                frequency === "subscription"
                  ? `Doação Mensal — Amor em Ação (${projectName})`
                  : `Doação Única — Amor em Ação (${projectName})`,
              description: `Contribuição destinada a: ${projectName}. Associação Humanitária Amor em Ação.`,
            },
            ...(frequency === "subscription"
              ? {
                  recurring: {
                    interval: "month",
                  },
                }
              : {}),
          },
        },
      ],
      metadata: {
        project: projectKey,
        projectName,
        donorName: donorName || "Anônimo",
        frequency,
      },
      success_url: `${origin}/doacao/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/doacao/cancelada`,
    });

    // Registra a doação diretamente no Supabase (sem necessidade de webhook)
    await createDonationRecord({
      stripeSessionId: session.id,
      donorName: donorName || null,
      donorEmail: donorEmail || null,
      amountCents: unitAmountCents,
      currency: "BRL",
      frequency: frequency === "subscription" ? "monthly" : "once",
      project: projectKey,
      status: "pending",
      paymentMethod: "stripe",
      notes: `Checkout Stripe iniciado (${projectName})`,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error("[Stripe Checkout Error]:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Erro interno ao criar sessão de doação no Stripe.",
      },
      { status: 500 }
    );
  }
}
