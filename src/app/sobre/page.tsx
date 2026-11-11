import type { Metadata } from "next";
import { buildMetadata, getBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Quem Somos — Associação Humanitária Amor em Ação",
  description:
    "Conheça a história, diretrizes e atuação comunitária da Associação Humanitária Amor em Ação na Casa Amarela em Jardim Gramacho, Duque de Caxias/RJ.",
  path: "/sobre",
  image: "/images/casa-amarela-convivencia-afeto.jpg",
  imageAlt: "Crianças reunidas com uma voluntária na Casa Amarela",
  keywords: [
    "quem somos Amor em Ação",
    "história Associação Humanitária Amor em Ação",
    "missão visão valores ONG",
    "Casa Amarela Duque de Caxias",
  ],
});

export default function SobrePage() {
  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: "Início", path: "/" },
    { name: "Quem Somos", path: "/sobre" },
  ]);

  return (
    <section id="page-sobre">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-[#29231f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <p className="text-orange-300 text-xs font-extrabold uppercase tracking-widest">
            Quem somos
          </p>
          <h1 className="display text-4xl md:text-5xl font-extrabold mt-3">
            Associação Humanitária Amor em Ação
          </h1>
          <p className="text-stone-300 text-lg max-w-3xl mt-5">
            Uma iniciativa de cuidado comunitário com atuação documentada na
            Casa Amarela, em Jardim Gramacho, Duque de Caxias/RJ.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 space-y-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="section-kicker">O que encontramos</p>
            <h2 className="display text-3xl font-extrabold mt-3">
              Cuidado que se transforma em presença
            </h2>
            <p className="text-stone-600 leading-relaxed mt-5">
              Fontes públicas identificam a Associação Humanitária Amor em Ação
              ligada à Casa Amarela, espaço comunitário de Jardim Gramacho. As
              reportagens consultadas descrevem ações de acolhimento de
              crianças, alimentação, higiene, brincadeiras e convivência com
              apoio de voluntários.
            </p>
            <p className="text-stone-600 leading-relaxed mt-4">
              Não encontramos uma página institucional oficial com histórico
              completo, composição atual da diretoria, missão formal ou
              relatório anual. Por isso, este perfil apresenta somente
              informações que conseguimos relacionar a fontes públicas, sem
              atribuir à associação declarações institucionais não confirmadas.
            </p>
          </div>

          <img
            src="/images/casa-amarela-convivencia-afeto.jpg"
            alt="Crianças reunidas com uma voluntária na Casa Amarela"
            className="rounded-3xl w-full h-[350px] object-cover shadow-soft"
          />
        </div>

        <div className="fact-note">
          <b>
            Diretrizes editoriais sugeridas — sujeitas à validação oficial da
            associação:
          </b>{" "}
          missão: promover acolhimento e apoio comunitário; visão: contribuir
          para uma sociedade com mais dignidade e oportunidades; valores:
          respeito, empatia, solidariedade, ética e transparência.
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div className="soft-card p-6">
            <i className="fa-solid fa-bullseye text-2xl text-orange-600" />
            <h3 className="display font-extrabold text-xl mt-4">
              Missão sugerida
            </h3>
            <p className="text-sm text-stone-600 mt-2">
              Promover acolhimento e apoio comunitário com respeito à dignidade
              de cada pessoa.
            </p>
          </div>

          <div className="soft-card p-6">
            <i className="fa-solid fa-eye text-2xl text-orange-600" />
            <h3 className="display font-extrabold text-xl mt-4">
              Visão sugerida
            </h3>
            <p className="text-sm text-stone-600 mt-2">
              Contribuir para comunidades mais acolhedoras, participativas e
              cheias de oportunidades.
            </p>
          </div>

          <div className="soft-card p-6">
            <i className="fa-solid fa-heart text-2xl text-orange-600" />
            <h3 className="display font-extrabold text-xl mt-4">
              Valores sugeridos
            </h3>
            <p className="text-sm text-stone-600 mt-2">
              Empatia, respeito, solidariedade, responsabilidade e
              transparência.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
