import type { Metadata } from "next";
import Link from "next/link";
import Stripe from "stripe";
import { buildMetadata } from "@/lib/seo";
import { updateDonationBySessionOrId } from "@/lib/donations";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Doação Confirmada — Muito Obrigado! | Amor em Ação",
  description:
    "Sua contribuição para a Associação Humanitária Amor em Ação foi processada com sucesso.",
  path: "/doacao/sucesso",
  noIndex: true,
});

export default async function DoacaoSucessoPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  let verifiedAmount: string | null = null;
  let isSubscription = false;

  if (sessionId) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (secretKey && !secretKey.includes("sua_chave_secreta_aqui")) {
      try {
        const stripe = new Stripe(secretKey);
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const isPaid =
          session.payment_status === "paid" || session.status === "complete";

        if (session.mode === "subscription") {
          isSubscription = true;
        }

        if (session.amount_total) {
          verifiedAmount = (session.amount_total / 100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          });
        }

        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id;

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

        await updateDonationBySessionOrId({
          stripeSessionId: sessionId,
          stripeCustomerId: customerId || null,
          stripeSubscriptionId: subscriptionId || null,
          status: isPaid ? "paid" : "pending",
          donorName: session.customer_details?.name || undefined,
          donorEmail: session.customer_details?.email || undefined,
        });
      } catch {
        // Proceed normally if session is in test mode or already verified
      }
    }
  }

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="soft-card p-8 md:p-12">
        <span className="w-16 h-16 rounded-full bg-green-100 text-green-700 grid place-items-center text-3xl mx-auto shadow-inner">
          <i className="fa-solid fa-check" />
        </span>
        <p className="section-kicker mt-5">Contribuição recebida</p>
        <h1 className="display text-3xl md:text-4xl font-extrabold mt-2">
          {isSubscription
            ? "Você agora é um Doador Mensal!"
            : "Muito obrigado pelo seu apoio!"}
        </h1>

        {verifiedAmount && (
          <p className="mt-3 inline-block rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1 text-sm font-extrabold text-emerald-800">
            Doação verificada: {verifiedAmount} {isSubscription ? "/mês" : ""}
          </p>
        )}

        <p className="text-stone-600 leading-relaxed mt-4">
          Sua doação via Stripe foi processada com segurança e registrada em
          nosso painel de transparência. Cada gesto de solidariedade fortalece
          as ações de acolhimento, alimentação e cuidado comunitário da
          Associação Humanitária Amor em Ação.
        </p>

        {isSubscription && (
          <div className="mt-6 p-5 bg-orange-50/80 border border-orange-200 rounded-2xl text-left">
            <div className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 grid place-items-center text-lg shrink-0">
                <i className="fa-solid fa-repeat" />
              </span>
              <div>
                <h2 className="text-sm font-extrabold text-orange-950">
                  Gerenciamento da sua Doação Recorrente
                </h2>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Você possui total autonomia sobre sua contribuição mensal. A
                  qualquer momento, você pode atualizar sua forma de pagamento,
                  baixar recibos fiscais ou cancelar sua assinatura sem
                  burocracia pelo Portal do Doador.
                </p>
                {sessionId && (
                  <Link
                    href={`/doacao/gerenciar?session_id=${encodeURIComponent(sessionId)}`}
                    className="inline-flex items-center gap-2 mt-3 text-xs font-bold text-orange-700 hover:text-orange-900 bg-white border border-orange-200 px-4 py-2 rounded-lg shadow-sm hover:shadow transition"
                  >
                    <i className="fa-solid fa-sliders text-orange-600" />
                    Acessar Portal do Doador agora
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link
            href="/"
            className="gradient-brand text-white font-extrabold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition"
          >
            Voltar ao início
          </Link>
          <Link
            href="/blog"
            className="bg-orange-50 text-orange-800 font-bold px-6 py-3.5 rounded-xl hover:bg-orange-100 transition"
          >
            Acompanhar o Blog
          </Link>
          <Link
            href="/transparencia"
            className="border border-stone-200 text-stone-700 font-bold px-6 py-3.5 rounded-xl hover:bg-stone-50 transition"
          >
            Ver Transparência
          </Link>
        </div>
      </div>
    </section>
  );
}
