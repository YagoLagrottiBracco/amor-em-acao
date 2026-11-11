import type { Metadata } from "next";
import { buildMetadata, getBreadcrumbJsonLd, getFaqJsonLd } from "@/lib/seo";
import { VolunteerForm } from "@/components/VolunteerForm";

export const metadata: Metadata = buildMetadata({
  title:
    "Seja Voluntário — Apoie a Casa Amarela e Nossas Ações | Amor em Ação",
  description:
    "Cadastre seu interesse para atuar como voluntário presencial em Jardim Gramacho (Duque de Caxias/RJ) ou remoto. Ajude em educação infantil, alimentação, logística, comunicação e eventos.",
  path: "/voluntariado",
  image: "/images/acao-comunitaria-plantio-jardim.jpg",
  imageAlt: "Ação comunitária de plantio com voluntários e crianças",
  keywords: [
    "seja voluntário Amor em Ação",
    "voluntariado Duque de Caxias",
    "voluntariado Jardim Gramacho",
    "trabalho voluntário ONG infantil",
    "voluntariado remoto ONG",
    "horas complementares voluntariado RJ",
  ],
});

const VOLUNTARIADO_FAQS = [
  {
    question: "Quem pode se inscrever como voluntário na Amor em Ação?",
    answer:
      "Qualquer pessoa maior de 18 anos (ou jovens com autorização dos responsáveis) disposta a compartilhar afeto, dedicação e habilidades para o fortalecimento comunitário de crianças e famílias em situação de vulnerabilidade.",
  },
  {
    question: "Preciso residir no Rio de Janeiro para participar?",
    answer:
      "Não. Enquanto as atividades na Casa Amarela (em Jardim Gramacho, Duque de Caxias/RJ) exigem presença física, oferecemos frentes de voluntariado remoto em áreas como comunicação, design, captação de recursos, tecnologia e gestão.",
  },
  {
    question: "Como funciona o contato após o preenchimento do formulário?",
    answer:
      "Nossa equipe analisa as manifestações de interesse e entra em contato via WhatsApp ou e-mail de acordo com a programação das ações comunitárias, oficinas de reforço escolar e campanhas de arrecadação.",
  },
  {
    question: "A Amor em Ação fornece certificado de horas complementares?",
    answer:
      "Sim. Voluntários com participação ativa e documentada nas atividades da instituição podem solicitar declaração comprobatória para cômputo de horas complementares em instituições de ensino superior.",
  },
];

export default function VoluntariadoPage() {
  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: "Início", path: "/" },
    { name: "Seja Voluntário", path: "/voluntariado" },
  ]);
  const faqSchema = getFaqJsonLd(VOLUNTARIADO_FAQS);

  return (
    <section id="page-voluntariado" className="bg-[#fffaf5] min-h-screen pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="bg-[#29231f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-orange-300 text-xs font-extrabold uppercase tracking-widest">
            Faça parte da nossa rede de afeto
          </p>
          <h1 className="display text-4xl md:text-5xl font-extrabold mt-3">
            Seu tempo e talento transformam realidades
          </h1>
          <p className="text-stone-300 max-w-2xl mx-auto mt-5 leading-relaxed">
            Compartilhe seu carinho, conhecimento e dedicação. A presença de
            cada voluntário constrói dignidade para as crianças da Casa Amarela.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid lg:grid-cols-[.8fr_1.2fr] gap-10">
        <div>
          <p className="section-kicker">Como participar</p>
          <h2 className="display text-3xl font-extrabold mt-3 text-stone-900">
            Toda transformação começa com a decisão de servir.
          </h2>
          <p className="text-stone-600 mt-4 leading-relaxed">
            Preencha o formulário ao lado para registrar sua disponibilidade. A
            inscrição é uma manifestação de interesse que permite conectar seu
            perfil às necessidades das nossas oficinas e campanhas.
          </p>

          <div className="space-y-4 mt-8">
            <div className="flex gap-3">
              <span className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 grid place-items-center shrink-0">
                <i className="fa-solid fa-laptop" />
              </span>
              <div>
                <b>Voluntariado remoto</b>
                <p className="text-sm text-stone-500">
                  Comunicação, mídias sociais, design, captação e apoio digital.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <span className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 grid place-items-center shrink-0">
                <i className="fa-solid fa-people-group" />
              </span>
              <div>
                <b>Voluntariado presencial (Casa Amarela)</b>
                <p className="text-sm text-stone-500">
                  Apoio no reforço escolar, alimentação, recreação e eventos em
                  Jardim Gramacho.
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
                  Arrecadação e triagem de alimentos, roupas, brinquedos e
                  materiais didáticos.
                </p>
              </div>
            </div>
          </div>
        </div>

        <VolunteerForm />
      </div>

      {/* FAQ SECTION */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="section-kicker">Perguntas sobre voluntariado</p>
          <h2 className="display text-3xl font-extrabold mt-2 text-stone-900">
            Dúvidas Frequentes sobre o Voluntariado
          </h2>
        </div>

        <div className="space-y-4">
          {VOLUNTARIADO_FAQS.map((faq, idx) => (
            <details
              key={idx}
              className="group bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm transition hover:border-orange-300"
            >
              <summary className="font-extrabold text-stone-900 cursor-pointer list-none flex justify-between items-center gap-4 text-base md:text-lg">
                <span>{faq.question}</span>
                <span className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 grid place-items-center shrink-0 group-open:rotate-180 transition-transform">
                  <i className="fa-solid fa-chevron-down text-xs" />
                </span>
              </summary>
              <p className="mt-4 text-stone-600 leading-relaxed text-sm md:text-base border-t border-stone-100 pt-4">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
