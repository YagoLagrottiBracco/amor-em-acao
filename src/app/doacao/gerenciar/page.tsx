import React, { Suspense } from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { DonorPortalClient } from "./DonorPortalClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Gerenciar Doação Recorrente — Portal do Doador | Amor em Ação",
  description:
    "Acesse o Portal do Doador do Amor em Ação para atualizar cartões de crédito, baixar recibos ou gerenciar sua doação mensal recorrente com total autonomia e segurança.",
  path: "/doacao/gerenciar",
  noIndex: true,
});

export default function GerenciarDoacaoPage() {
  return (
    <main className="min-h-screen bg-[#fffaf5] flex flex-col justify-center">
      <Suspense
        fallback={
          <div className="py-24 text-center">
            <i className="fa-solid fa-spinner fa-spin text-3xl text-orange-600 mb-3" />
            <p className="text-sm font-semibold text-stone-600">
              Carregando portal do doador...
            </p>
          </div>
        }
      >
        <DonorPortalClient />
      </Suspense>
    </main>
  );
}
