import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { SITE_CONFIG } from "@/lib/seo";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = body.email ? String(body.email).trim().toLowerCase() : "";
    const sessionId = body.sessionId ? String(body.sessionId).trim() : "";

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey || secretKey.includes("sua_chave_secreta_aqui")) {
      return NextResponse.json(
        {
          error:
            "A chave STRIPE_SECRET_KEY não está configurada no ambiente. Configure as chaves do Stripe para ativar o portal.",
        },
        { status: 503 }
      );
    }

    const stripe = new Stripe(secretKey);
    const origin =
      request.headers.get("origin") ||
      SITE_CONFIG.url ||
      "http://localhost:3000";
    const returnUrl = `${origin}/doacao/gerenciar`;

    let customerId: string | null = null;

    // 1. If sessionId is provided (e.g. from /doacao/sucesso)
    if (sessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.customer) {
          customerId =
            typeof session.customer === "string"
              ? session.customer
              : session.customer.id;
        } else if (session.customer_details?.email) {
          const list = await stripe.customers.list({
            email: session.customer_details.email,
            limit: 1,
          });
          if (list.data.length > 0) {
            customerId = list.data[0].id;
          }
        }
      } catch (err) {
        console.warn("[Stripe Portal] Failed to retrieve session:", err);
      }
    }

    // 2. If email is provided, search Stripe customers
    if (!customerId && email) {
      const customers = await stripe.customers.list({
        email,
        limit: 1,
      });

      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        // Fallback: search Supabase donations by email
        const supabase = getSupabaseAdmin();
        if (supabase) {
          const { data } = await supabase
            .from("donations")
            .select("stripe_customer_id, stripe_session_id")
            .eq("donor_email", email)
            .order("created_at", { ascending: false })
            .limit(1);

          if (data && data[0]?.stripe_customer_id) {
            customerId = data[0].stripe_customer_id;
          } else if (data && data[0]?.stripe_session_id) {
            try {
              const session = await stripe.checkout.sessions.retrieve(
                data[0].stripe_session_id
              );
              if (session.customer) {
                customerId =
                  typeof session.customer === "string"
                    ? session.customer
                    : session.customer.id;
              }
            } catch {
              // Ignore fallback error
            }
          }
        }
      }
    }

    if (!customerId) {
      return NextResponse.json(
        {
          error:
            "Nenhuma doação ou assinatura foi localizada para o e-mail informado. Por favor, verifique se digitou o mesmo e-mail utilizado na doação.",
        },
        { status: 404 }
      );
    }

    // 3. Create Stripe Customer Billing Portal Session
    try {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      return NextResponse.json({ url: portalSession.url });
    } catch (portalErr) {
      const message =
        portalErr instanceof Error
          ? portalErr.message
          : "Erro ao gerar sessão do portal.";

      // Common Stripe setup notice: Customer Portal settings need to be saved once in Dashboard
      if (
        message.includes("configuration") ||
        message.includes("customer portal") ||
        message.includes("activate")
      ) {
        return NextResponse.json(
          {
            error:
              "O Portal do Cliente Stripe ainda precisa ser ativado no painel da Stripe. Acesse Dashboard Stripe > Configurações > Portal do Cliente e salve as opções.",
          },
          { status: 400 }
        );
      }

      return NextResponse.json({ error: message }, { status: 500 });
    }
  } catch (err) {
    console.error("[Stripe Portal Error]:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Erro interno ao conectar ao Portal do Doador.",
      },
      { status: 500 }
    );
  }
}
