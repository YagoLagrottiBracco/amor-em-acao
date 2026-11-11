import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Doação não concluída | Amor em Ação",
  description: "O processo de doação via Stripe foi encerrado antes da conclusão.",
  path: "/doacao/cancelada",
  noIndex: true,
});

export default function DoacaoCanceladaPage() {
  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="soft-card p-8 md:p-12">
        <span className="w-16 h-16 rounded-full bg-orange-100 text-orange-700 grid place-items-center text-3xl mx-auto">
          <i className="fa-solid fa-heart-crack" />
        </span>
        <p className="section-kicker mt-5">Checkout encerrado</p>
        <h1 className="display text-3xl font-extrabold mt-2">
          Sua doação não foi finalizada
        </h1>
        <p className="text-stone-600 leading-relaxed mt-4">
          Nenhuma cobrança foi realizada. Se você encontrou alguma dúvida ou
          prefere colaborar como voluntário ou consultar diretamente a
          associação, estamos à disposição!
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link
            href="/"
            className="gradient-brand text-white font-extrabold px-6 py-3.5 rounded-xl"
          >
            Voltar ao início
          </Link>
          <Link
            href="/voluntariado"
            className="bg-orange-50 text-orange-800 font-bold px-6 py-3.5 rounded-xl"
          >
            Conhecer o Voluntariado
          </Link>
        </div>
      </div>
    </section>
  );
}
