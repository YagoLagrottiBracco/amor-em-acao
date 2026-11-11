import type { Metadata } from "next";
import { buildMetadata, getBreadcrumbJsonLd } from "@/lib/seo";
import { VolunteerForm } from "@/components/VolunteerForm";

export const metadata: Metadata = buildMetadata({
  title: "Seja Voluntário — Participe das Ações | Amor em Ação",
  description:
    "Cadastre seu interesse para atuar como voluntário presencial ou remoto na Associação Humanitária Amor em Ação. Apoie educação, logística, eventos ou comunicação.",
  path: "/voluntariado",
  image: "/images/acao-comunitaria-plantio-jardim.jpg",
  imageAlt: "Ação comunitária de plantio com voluntários e crianças",
  keywords: [
    "seja voluntário Amor em Ação",
    "voluntariado Duque de Caxias",
    "voluntariado Jardim Gramacho",
    "trabalho voluntário ONG infantil",
  ],
});

export default function VoluntariadoPage() {
  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: "Início", path: "/" },
    { name: "Seja Voluntário", path: "/voluntariado" },
  ]);

  return (
    <section id="page-voluntariado">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-[#29231f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-orange-300 text-xs font-extrabold uppercase tracking-widest">
            Faça parte da rede
          </p>
          <h1 className="display text-4xl md:text-5xl font-extrabold mt-3">
            Seu talento também pode transformar
          </h1>
          <p className="text-stone-300 max-w-2xl mx-auto mt-5">
            Compartilhe seu tempo, conhecimento e vontade de contribuir. Existem
            diferentes maneiras de participar.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid lg:grid-cols-[.8fr_1.2fr] gap-10">
        <div>
          <p className="section-kicker">Como participar</p>
          <h2 className="display text-3xl font-extrabold mt-3">
            Toda contribuição começa com disponibilidade para ajudar.
          </h2>
          <p className="text-stone-600 mt-4 leading-relaxed">
            Preencha o formulário ao lado para demonstrar seu interesse. A
            inscrição é apenas uma manifestação de interesse e não confirma vaga
            ou escala de voluntariado.
          </p>

          <div className="space-y-4 mt-8">
            <div className="flex gap-3">
              <span className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 grid place-items-center shrink-0">
                <i className="fa-solid fa-laptop" />
              </span>
              <div>
                <b>Voluntariado remoto</b>
                <p className="text-sm text-stone-500">
                  Comunicação, design, organização e apoio digital.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 grid place-items-center shrink-0">
                <i className="fa-solid fa-people-group" />
              </span>
              <div>
                <b>Voluntariado presencial</b>
                <p className="text-sm text-stone-500">
                  Apoio em atividades, eventos e ações locais.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 grid place-items-center shrink-0">
                <i className="fa-solid fa-box-open" />
              </span>
              <div>
                <b>Campanhas e logística</b>
                <p className="text-sm text-stone-500">
                  Organização e mobilização de doações.
                </p>
              </div>
            </div>
          </div>
        </div>

        <VolunteerForm />
      </div>
    </section>
  );
}
