import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata, getBreadcrumbJsonLd, getFaqJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title:
    "Quem Somos — Associação Humanitária Amor em Ação | História, Missão e Casa Amarela",
  description:
    "Conheça a história, missão e valores da Associação Humanitária Amor em Ação (CNPJ 21.960.082/0001-96). Acolhimento, nutrição e educação infantil na Casa Amarela em Jardim Gramacho, Duque de Caxias/RJ.",
  path: "/sobre",
  image: "/images/casa-amarela-convivencia-afeto.jpg",
  imageAlt: "Crianças reunidas com uma voluntária na Casa Amarela",
  keywords: [
    "quem somos Amor em Ação",
    "história Associação Humanitária Amor em Ação",
    "missão visão valores ONG",
    "Casa Amarela Duque de Caxias",
    "Jardim Gramacho acolhimento infantil",
    "CNPJ 21.960.082/0001-96",
  ],
});

const SOBRE_FAQS = [
  {
    question: "O que motivou a criação da Associação Humanitária Amor em Ação?",
    answer:
      "A Amor em Ação nasceu do compromisso de levar amparo prático a comunidades esquecidas e em extrema vulnerabilidade. Com a desativação do aterro de Jardim Gramacho em 2012, centenas de famílias de catadores perderam sua principal fonte de subsistência, demandando um espaço contínuo de suporte, alimentação e proteção para as crianças.",
  },
  {
    question: "Qual o propósito da Casa Amarela em Jardim Gramacho?",
    answer:
      "A Casa Amarela é o coração das operações da Amor em Ação no Rio de Janeiro. Funciona como um centro de acolhimento comunitário onde as crianças recebem refeições diárias, banho, escovação de dentes, apoio escolar, aulas de alfabetização, atividades lúdicas e atendimento com voluntários.",
  },
  {
    question: "A Amor em Ação também atua fora do Rio de Janeiro?",
    answer:
      "Sim. A instituição mantém iniciativas de impacto no sertão maranhense (em Matões do Norte/MA), promovendo atividades socioeducativas e amparo às famílias locais, além de apoiar projetos humanitários no Malawi (África), facilitando acesso a poços artesianos de água potável e reformas de salas de aula.",
  },
  {
    question: "Como a instituição se sustenta e presta contas?",
    answer:
      "Nossa sustentabilidade depende exclusivamente de doações financeiras e materiais de pessoas físicas e empresas parceiras. Mantemos um Portal da Transparência dinâmico no site, onde disponibilizamos o Estatuto Social, dados cadastrais (CNPJ 21.960.082/0001-96), balanços e registros de atividades para consulta pública.",
  },
];

export default function SobrePage() {
  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: "Início", path: "/" },
    { name: "Quem Somos", path: "/sobre" },
  ]);
  const faqSchema = getFaqJsonLd(SOBRE_FAQS);

  return (
    <section id="page-sobre" className="bg-[#fffaf5] min-h-screen pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="bg-[#29231f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <p className="text-orange-300 text-xs font-extrabold uppercase tracking-widest">
            Nossa Trajetória e Propósito
          </p>
          <h1 className="display text-4xl md:text-5xl font-extrabold mt-3">
            Associação Humanitária Amor em Ação
          </h1>
          <p className="text-stone-300 text-lg max-w-3xl mt-5 leading-relaxed">
            Uma obra de cuidado comunitário e transformação social com sede na
            Casa Amarela, em Jardim Gramacho (Duque de Caxias/RJ), estendendo
            esperança ao Nordeste brasileiro e à África.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 space-y-16">
        {/* BLOCO HISTÓRIA */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="section-kicker">Nossa Origem</p>
            <h2 className="display text-3xl font-extrabold mt-3 text-stone-900">
              Onde a necessidade encontrou o afeto e a dignidade
            </h2>
            <p className="text-stone-600 leading-relaxed mt-5">
              Jardim Gramacho abrigou durante décadas o maior aterro sanitário da
              América Latina. Quando o aterro foi desativado em 2012, milhares de
              trabalhadores e catadores ficaram desprovidos de alternativas de
              renda, deixando crianças e jovens expostos a carências
              nutricionais, educacionais e estruturais severas.
            </p>
            <p className="text-stone-600 leading-relaxed mt-4">
              A <strong>Associação Humanitária Amor em Ação</strong> ergueu a{" "}
              <strong>Casa Amarela</strong> para ser um porto seguro. Não apenas
              um ponto de distribuição, mas um lugar de convívio diário,
              alimentação balanceada, higiene, reforço escolar e construção de
              autoestima para a infância da região.
            </p>
          </div>

          <div className="relative">
            <img
              src="/images/casa-amarela-convivencia-afeto.jpg"
              alt="Crianças reunidas com uma voluntária na Casa Amarela em Jardim Gramacho"
              className="rounded-3xl w-full h-[380px] object-cover shadow-soft border border-orange-100"
            />
            <div className="absolute -bottom-5 -right-3 md:-right-5 bg-white p-4 rounded-2xl shadow-lg border border-stone-100 max-w-[240px]">
              <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                Presença Constante
              </p>
              <p className="text-xs text-stone-600 mt-1">
                Refeições, banho, afeto e reforço escolar diário para dezenas de
                crianças.
              </p>
            </div>
          </div>
        </div>

        {/* MISSÃO, VISÃO E VALORES */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="section-kicker">Diretrizes Institucionais</p>
            <h2 className="display text-3xl font-extrabold mt-2 text-stone-900">
              Nossa Missão, Visão e Princípios
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="soft-card p-8 border-t-4 border-t-orange-500">
              <span className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 grid place-items-center text-2xl mb-4">
                <i className="fa-solid fa-bullseye" />
              </span>
              <h3 className="display font-extrabold text-xl text-stone-900">
                Missão
              </h3>
              <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                Servir a pessoas e famílias que vivem em extrema vulnerabilidade
                social e pobreza, proporcionando cuidado diário, alimentação,
                educação e afeto para que vivam com dignidade e cidadania.
              </p>
            </div>

            <div className="soft-card p-8 border-t-4 border-t-amber-500">
              <span className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 grid place-items-center text-2xl mb-4">
                <i className="fa-solid fa-eye" />
              </span>
              <h3 className="display font-extrabold text-xl text-stone-900">
                Visão
              </h3>
              <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                Ser um refúgio permanente de transformação e oportunidade para as
                comunidades atendidas, rompendo ciclos de carência através do amor
                prático e do desenvolvimento comunitário.
              </p>
            </div>

            <div className="soft-card p-8 border-t-4 border-t-red-500">
              <span className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 grid place-items-center text-2xl mb-4">
                <i className="fa-solid fa-heart" />
              </span>
              <h3 className="display font-extrabold text-xl text-stone-900">
                Valores
              </h3>
              <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                Amor em ação, respeito incondicional à dignidade humana,
                transparência irrestrita com recursos públicos, empatia,
                integridade moral e responsabilidade social.
              </p>
            </div>
          </div>
        </div>

        {/* AS 3 FRENTES DE ATUAÇÃO */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-stone-200/80 shadow-sm">
          <p className="section-kicker">Onde atuamos</p>
          <h2 className="display text-3xl font-extrabold mt-2 text-stone-900">
            Nossas Três Frentes de Solidariedade
          </h2>
          <p className="text-stone-600 mt-3 max-w-3xl leading-relaxed">
            A Associação Humanitária Amor em Ação divide seus esforços em eixos
            estratégicos que atendem necessidades urgentes de cada território:
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="p-6 rounded-2xl bg-[#fffaf5] border border-orange-100">
              <h4 className="font-extrabold text-stone-900 text-lg flex items-center gap-2">
                <i className="fa-solid fa-house-chimney text-orange-600" />
                Casa Amarela (Gramacho)
              </h4>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                Atendimento continuado com refeições, apoio escolar, higiene
                pessoal e acolhimento para crianças de Jardim Gramacho (Duque de
                Caxias/RJ).
              </p>
              <Link
                href="/acoes/casa-amarela"
                className="inline-block mt-4 text-xs font-bold text-orange-600 hover:text-orange-700"
              >
                Conhecer a Casa Amarela &rarr;
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-[#fffaf5] border border-orange-100">
              <h4 className="font-extrabold text-stone-900 text-lg flex items-center gap-2">
                <i className="fa-solid fa-sun text-amber-600" />
                Sertão do Nordeste (MA)
              </h4>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                Iniciativas comunitárias em Matões do Norte/MA, levando suporte
                nutricional, oficinas de arte e recreação para famílias
                sertanejas.
              </p>
              <Link
                href="/acoes/nordeste"
                className="inline-block mt-4 text-xs font-bold text-orange-600 hover:text-orange-700"
              >
                Conhecer a atuação no Nordeste &rarr;
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-[#fffaf5] border border-orange-100">
              <h4 className="font-extrabold text-stone-900 text-lg flex items-center gap-2">
                <i className="fa-solid fa-earth-africa text-emerald-600" />
                Internacional (Malawi)
              </h4>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                Projetos humanitários de perfuração de poços artesianos de água
                limpa, construção de salas de aula e apoio infantil no sudeste
                da África.
              </p>
              <Link
                href="/acoes/atuacao-internacional"
                className="inline-block mt-4 text-xs font-bold text-orange-600 hover:text-orange-700"
              >
                Conhecer o projeto Malawi &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* PERGUNTAS FREQUENTES (FAQ COM SCHEMA.ORG PARA SEO NO GOOGLE) */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="section-kicker">Perguntas Institucionais</p>
            <h2 className="display text-3xl font-extrabold mt-2 text-stone-900">
              Dúvidas Frequentes sobre a Instituição
            </h2>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {SOBRE_FAQS.map((faq, idx) => (
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
      </div>
    </section>
  );
}
