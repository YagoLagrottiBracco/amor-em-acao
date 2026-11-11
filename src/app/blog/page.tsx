import type { Metadata } from "next";
import { SITE_CONFIG, buildMetadata, getBreadcrumbJsonLd } from "@/lib/seo";
import { getAllBlogPostsAsync } from "@/lib/blog";
import { BlogCatalogClient } from "@/components/BlogCatalogClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title:
    "Blog e Publicações — Ações Comunitárias, Casa Amarela e Transparência | Amor em Ação",
  description:
    "Acompanhe os artigos, relatórios de impacto social, guias de voluntariado e histórias da Casa Amarela (Jardim Gramacho, Duque de Caxias/RJ) no blog oficial Amor em Ação.",
  path: "/blog",
  image: "/images/casa-amarela-equipe-criancas.jpg",
  imageAlt: "Blog Associação Humanitária Amor em Ação",
  keywords: [
    "blog Amor em Ação",
    "notícias Casa Amarela Jardim Gramacho",
    "artigos voluntariado e impacto social",
    "terceiro setor Duque de Caxias",
  ],
});

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const { posts } = await getAllBlogPostsAsync({ includeDrafts: false });

  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: "Início", path: "/" },
    { name: "Blog", path: "/blog" },
  ]);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Blog Amor em Ação — Projetos, Voluntariado e Transparência",
    description:
      "Publicações institucionais e educativas da Associação Humanitária Amor em Ação.",
    url: `${SITE_CONFIG.url}/blog`,
    inLanguage: "pt-BR",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_CONFIG.url}/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <section id="page-blog">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="bg-[#29231f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20 text-center">
          <p className="text-orange-300 text-xs font-extrabold uppercase tracking-widest">
            Informação, Memória e Cidadania
          </p>
          <h1 className="display text-4xl md:text-5xl font-extrabold mt-3">
            Blog Amor em Ação
          </h1>
          <p className="text-stone-300 text-lg max-w-2xl mx-auto mt-5">
            Conheça nossas iniciativas, registros históricos, orientações para
            voluntários e práticas de transparência em artigos completos.
          </p>
        </div>
      </div>

      <BlogCatalogClient
        posts={posts}
        initialQuery={resolvedParams?.q || ""}
      />
    </section>
  );
}
