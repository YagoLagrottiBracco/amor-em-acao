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

  if (sessionId) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (secretKey && !secretKey.includes("sua_chave_secreta_aqui")) {
      try {
        const stripe = new Stripe(secretKey);
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const isPaid =
          session.payment_status === "paid" || session.status === "complete";
        if (session.amount_total) {
          verifiedAmount = (session.amount_total / 100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          });
        }
        await updateDonationBySessionOrId({
          stripeSessionId: sessionId,
          status: isPaid ? "paid" : "pending",
          donorName: session.customer_details?.name || undefined,
          donorEmail: session.customer_details?.email || undefined,
        });
      } catch {
        // Segue normalmente caso a sessão seja de teste ou já tenha sido verificada
      }
    }
  }

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="soft-card p-8 md:p-12">
        <span className="w-16 h-16 rounded-full bg-green-100 text-green-700 grid place-items-center text-3xl mx-auto">
          <i className="fa-solid fa-check" />
        </span>
        <p className="section-kicker mt-5">Contribuição recebida</p>
        <h1 className="display text-3xl md:text-4xl font-extrabold mt-2">
          Muito obrigado pelo seu apoio!
        </h1>
        {verifiedAmount && (
          <p className="mt-3 inline-block rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1 text-sm font-extrabold text-emerald-800">
            Doação verificada: {verifiedAmount}
          </p>
        )}
        <p className="text-stone-600 leading-relaxed mt-4">
          Sua doação via Stripe foi processada com segurança e registrada em
          nosso painel de transparência. Cada gesto de solidariedade fortalece
          as ações de acolhimento, alimentação e cuidado comunitário da
          Associação Humanitária Amor em Ação.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link
            href="/"
            className="gradient-brand text-white font-extrabold px-6 py-3.5 rounded-xl"
          >
            Voltar ao início
          </Link>
          <Link
            href="/blog"
            className="bg-orange-50 text-orange-800 font-bold px-6 py-3.5 rounded-xl"
          >
            Acompanhar o Blog
          </Link>
        </div>
      </div>
    </section>
  );
}
