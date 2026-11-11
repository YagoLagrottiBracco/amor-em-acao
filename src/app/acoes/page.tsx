import type { Metadata } from "next";
import Link from "next/link";
import { getAllActionsAsync } from "@/lib/actions";
import {
  buildMetadata,
  getBreadcrumbJsonLd,
  getItemListJsonLd,
} from "@/lib/seo";
import { ActionBlogCard } from "@/components/ActionBlogCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Nossas Ações Comunitárias e Missões | Amor em Ação",
  description:
    "Conheça todas as frentes de atuação da Associação Humanitária Amor em Ação: acolhimento infantil, ações comunitárias no Brasil e apoio humanitário.",
  path: "/acoes",
  image: "/images/casa-amarela-equipe-criancas.jpg",
  imageAlt: "Projetos e Ações Comunitárias Amor em Ação",
  keywords: [
    "ações Amor em Ação",
    "projetos comunitários",
    "Casa Amarela Gramacho",
    "missões humanitárias",
    "voluntariado e solidariedade",
  ],
});

export default async function AcoesCatalogPage() {
  const { actions } = await getAllActionsAsync({ includeDrafts: false });

  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: "Início", path: "/" },
    { name: "Nossas Ações", path: "/acoes" },
  ]);

  const itemListSchema = getItemListJsonLd(
    "Nossas Ações Comunitárias e Missões — Amor em Ação",
    "Catálogo oficial das iniciativas comunitárias e frentes de atuação social da Associação Humanitária Amor em Ação.",
    actions.map((action) => ({
      name: action.title,
      path: `/acoes/${action.slug}`,
      description: action.description,
      image: action.coverImage,
    }))
  );

  return (
    <section id="page-acoes" className="min-h-screen bg-[#fffaf5] pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Hero */}
      <div className="bg-[#29231f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20 text-center">
          <p className="text-orange-300 text-xs font-extrabold uppercase tracking-widest">
            Frentes de Atuação e Missões
          </p>
          <h1 className="display text-4xl md:text-5xl font-extrabold mt-3">
            Nossas Ações Comunitárias
          </h1>
          <p className="text-stone-300 text-lg max-w-2xl mx-auto mt-5">
            Cuidado, dignidade e oportunidade para crianças e famílias em
            situação de vulnerabilidade social.
          </p>
        </div>
      </div>

      {/* Grid de Ações */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {actions.map((action) => (
            <ActionBlogCard
              key={action.id}
              title={action.title}
              description={action.description}
              image={action.coverImage}
              imageAlt={action.coverImageAlt}
              pillText={action.navSubtitle || action.kicker}
              buttonText="Conhecer a iniciativa"
              href={`/acoes/${action.slug}`}
            />
          ))}
        </div>

        {actions.length === 0 && (
          <div className="soft-card p-12 text-center max-w-md mx-auto my-10">
            <i className="fa-solid fa-compass text-4xl text-orange-400 mb-4" />
            <h3 className="display text-xl font-extrabold text-stone-900">
              Nenhuma ação publicada no momento
            </h3>
            <p className="text-sm text-stone-600 mt-2">
              Novas iniciativas comunitárias serão publicadas em breve.
            </p>
          </div>
        )}

        {/* Banner de apoio */}
        <div className="mt-16 soft-card p-8 md:p-12 text-center bg-gradient-to-r from-orange-50 via-white to-orange-50 border-orange-200">
          <span className="section-kicker">Participe</span>
          <h2 className="display text-2xl md:text-3xl font-extrabold text-stone-900 mt-2">
            Quer fazer parte de alguma de nossas ações?
          </h2>
          <p className="text-stone-600 max-w-xl mx-auto mt-3 text-sm md:text-base leading-relaxed">
            Você pode colaborar com tempo, habilidades ou doação para apoiar o
            cuidado diário oferecido às comunidades.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Link
              href="/voluntariado"
              className="gradient-brand text-white font-extrabold px-6 py-3.5 rounded-xl shadow-md hover:opacity-95 transition"
            >
              Inscrever-se como voluntário
            </Link>
            <Link
              href="/contato"
              className="bg-white border border-orange-200 text-orange-800 font-bold px-6 py-3.5 rounded-xl hover:bg-orange-100/50 transition"
            >
              Falar com nossa equipe
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
