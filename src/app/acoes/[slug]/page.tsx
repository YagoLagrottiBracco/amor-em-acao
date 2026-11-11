import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata, getBreadcrumbJsonLd } from "@/lib/seo";
import {
  getActionBySlugAsync,
  getAllActionsAsync,
  DEFAULT_ACTION_MISSIONS,
} from "@/lib/actions";
import { ActionBlockRenderer } from "@/components/actions/ActionBlockRenderer";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const { actions } = await getAllActionsAsync({ includeDrafts: false });
  const slugs = actions.length > 0 ? actions : DEFAULT_ACTION_MISSIONS;
  return slugs.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const action = await getActionBySlugAsync(slug);

  if (!action) {
    return buildMetadata({
      title: "Ação não encontrada | Amor em Ação",
      description: "A iniciativa que você procura não foi encontrada.",
      noIndex: true,
    });
  }

  return buildMetadata({
    title: action.seoTitle || `${action.title} | Amor em Ação`,
    description: action.seoDescription || action.description,
    path: `/acoes/${action.slug}`,
    image: action.coverImage,
    imageAlt: action.coverImageAlt || action.title,
    keywords: [
      action.title,
      action.kicker,
      "Amor em Ação projetos sociais",
      "ações humanitárias",
      "missões comunitárias",
    ],
  });
}

export default async function ActionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const action = await getActionBySlugAsync(slug);

  if (!action) {
    notFound();
  }

  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: "Início", path: "/" },
    { name: "Nossas Ações", path: "/acoes" },
    { name: action.title, path: `/acoes/${action.slug}` },
  ]);

  return (
    <article className="min-h-screen bg-[#fffaf5] pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ActionBlockRenderer blocks={action.blocks} />
    </article>
  );
}
