import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata, getBreadcrumbJsonLd } from "@/lib/seo";
import { getAllTransparencyDocsAsync } from "@/lib/transparency";
import {
  TRANSPARENCY_CATEGORY_LABELS,
  type TransparencyCategory,
} from "@/lib/transparency-types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Transparência e Prestação de Contas (CNPJ 21.960.082/0001-96) | Amor em Ação",
  description:
    "Consulte os dados cadastrais públicos da Associação Humanitária Amor em Ação (CNPJ 21.960.082/0001-96), estatuto, relatórios de atividades, balanços e fontes externas verificadas.",
  path: "/transparencia",
  image: "/images/casa-amarela-convivencia-afeto.jpg",
  imageAlt: "Transparência e compromisso público — Associação Humanitária Amor em Ação",
  keywords: [
    "transparência Amor em Ação",
    "CNPJ 21.960.082/0001-96",
    "Associação Humanitária Amor em Ação transparência",
    "prestação de contas ONG",
    "balanço social terceiro setor",
  ],
});

export default async function TransparenciaPage() {
  const { documents } = await getAllTransparencyDocsAsync({
    includeInactive: false,
  });

  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: "Início", path: "/" },
    { name: "Transparência", path: "/transparencia" },
  ]);

  const categoriesOrder: TransparencyCategory[] = [
    "institucional",
    "financeiro",
    "atividades",
    "fontes",
  ];

  const docsByCategory = categoriesOrder.reduce((acc, cat) => {
    acc[cat] = documents.filter((d) => d.category === cat);
    return acc;
  }, {} as Record<TransparencyCategory, typeof documents>);

  return (
    <section id="page-transparencia" className="min-h-screen bg-[#fffaf5] pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-[#29231f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-orange-300 text-xs font-extrabold uppercase tracking-widest">
            Compromisso e Prestação de Contas
          </p>
          <h1 className="display text-4xl md:text-5xl font-extrabold mt-3">
            Portal da Transparência
          </h1>
          <p className="text-stone-300 max-w-2xl mx-auto mt-5 text-base md:text-lg leading-relaxed">
            A transparência fortalece a confiança entre apoiadores, voluntários e
            comunidade. Consulte os documentos institucionais, relatórios e fontes
            públicas verificadas.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 space-y-12">
        {/* Identificação Cadastral Oficial */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="soft-card p-7 sm:p-8">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 grid place-items-center text-xl mb-4">
              <i className="fa-solid fa-building-columns" />
            </div>
            <span className="section-kicker">Dados Oficiais</span>
            <h2 className="display text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
              Identificação Institucional
            </h2>
            <div className="mt-4 space-y-2.5 text-sm text-stone-700">
              <p>
                <strong>Razão Social:</strong> Associação Humanitária Amor em Ação
              </p>
              <p>
                <strong>CNPJ:</strong> 21.960.082/0001-96
              </p>
              <p>
                <strong>Natureza Jurídica:</strong> Associação Privada sem fins
                lucrativos
              </p>
              <p>
                <strong>Sede:</strong> Rua Tocantins, nº 30 — Jardim Gramacho, Duque
                de Caxias/RJ, CEP 25055-320
              </p>
            </div>
            <a
              className="gradient-brand text-white text-xs font-extrabold px-4 py-2.5 rounded-xl inline-flex items-center gap-2 mt-5 shadow-sm hover:opacity-95 transition"
              href="https://www.consultascnpj.com/associacao-humanitaria-amor-em-acao/21960082000196"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Verificar situação cadastral</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-[11px]" />
            </a>
          </div>

          <div className="soft-card p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 grid place-items-center text-xl mb-4">
                <i className="fa-solid fa-shield-halved" />
              </div>
              <span className="section-kicker">Diretrizes de Governança</span>
              <h2 className="display text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
                Transparência Ativa
              </h2>
              <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                Nossos relatórios, balanços e atas de eleição são disponibilizados
                aqui conforme emissão oficial. Caso necessite de algum documento
                específico ou cópia autenticada, solicite diretamente à nossa
                equipe administrativa.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-stone-100">
              <Link
                href="/contato"
                className="text-orange-700 hover:text-orange-800 text-xs font-extrabold inline-flex items-center gap-1.5"
              >
                <i className="fa-solid fa-envelope" />
                <span>Solicitar documento ou esclarecimento &rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Categorias de Documentos Dinâmicos */}
        {categoriesOrder.map((cat) => {
          const docs = docsByCategory[cat] || [];
          if (docs.length === 0) return null;

          return (
            <div key={cat} className="space-y-4">
              <div className="border-b border-orange-200/80 pb-3">
                <span className="section-kicker">Acervo de Documentos</span>
                <h3 className="display text-2xl font-extrabold text-stone-900 mt-1">
                  {TRANSPARENCY_CATEGORY_LABELS[cat]}
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {docs.map((doc) => (
                  <div
                    key={doc.id}
                    className="soft-card p-6 flex flex-col justify-between hover:border-orange-300 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-2.5">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-100/80 text-orange-800">
                          {TRANSPARENCY_CATEGORY_LABELS[doc.category]}
                        </span>
                        {doc.year && (
                          <span className="text-xs font-bold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                            {doc.year}
                          </span>
                        )}
                      </div>

                      <h4 className="font-extrabold text-lg text-stone-900 mt-2">
                        {doc.title}
                      </h4>

                      {doc.description && (
                        <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                          {doc.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                      {doc.fileSize && (
                        <span className="text-xs font-medium text-stone-500">
                          <i className="fa-solid fa-file-pdf mr-1 text-red-500" />
                          {doc.fileSize}
                        </span>
                      )}
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gradient-brand text-white text-xs font-extrabold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 shadow-sm hover:opacity-95 transition ml-auto"
                      >
                        <span>Acessar</span>
                        <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Informação de transparência ativa */}
        <div className="fact-note">
          <strong className="block mb-1">
            <i className="fa-solid fa-circle-info mr-1.5" />
            Prestação de contas contínua:
          </strong>
          Os documentos publicados neste portal são atualizados periodicamente
          pela diretoria da Associação Humanitária Amor em Ação. As fontes externas
          citadas são reportagens e registros públicos de terceiros documentando
          visitas, coberturas jornalísticas e apoios comunitários prestados.
        </div>
      </div>
    </section>
  );
}
