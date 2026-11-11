import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_CONFIG, buildMetadata, getBreadcrumbJsonLd } from "@/lib/seo";
import { getAllBlogPostsAsync, getBlogPostBySlugAsync } from "@/lib/blog";
import { ActionBlogCard } from "@/components/ActionBlogCard";
import { BlogArticleView } from "@/components/blog/BlogArticleView";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlugAsync(slug);

  if (!post) {
    return buildMetadata({
      title: "Artigo não encontrado | Amor em Ação",
      description: "A publicação solicitada não foi localizada.",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: post.seoTitle || `${post.title} | Amor em Ação`,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage,
    imageAlt: post.coverImageAlt,
    keywords: [post.focusKeyword, post.category, ...post.tags].filter(Boolean),
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authors: [post.author.name],
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlugAsync(slug);

  if (!post || post.draft) {
    notFound();
  }

  const { posts: allPosts } = await getAllBlogPostsAsync({
    includeDrafts: false,
  });
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  const canonicalUrl = `${SITE_CONFIG.url}/blog/${post.slug}`;
  const fullImageUrl = post.coverImage.startsWith("http")
    ? post.coverImage
    : `${SITE_CONFIG.url}${post.coverImage}`;

  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: "Início", path: "/" },
    { name: "Notícias", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: [fullImageUrl],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: post.author.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      "@id": `${SITE_CONFIG.url}/#organization`,
    },
    articleSection: post.category,
    keywords: [post.focusKeyword, ...post.tags].filter(Boolean).join(", "),
    inLanguage: "pt-BR",
  };

  const faqSchema =
    post.faq && post.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <article className="py-12 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <BlogArticleView post={post} pageUrl={canonicalUrl} />

        {/* Box de chamada para ação */}
        <div className="soft-card p-7 md:p-9 mt-10 bg-orange-50 border-orange-200 flex flex-col md:flex-row items-center justify-between gap-6 print:hidden">
          <div>
            <p className="section-kicker">Faça parte dessa corrente</p>
            <h2 className="display text-2xl font-extrabold mt-1">
              Quer apoiar as iniciativas do Amor em Ação?
            </h2>
            <p className="text-sm text-stone-600 mt-2 max-w-xl">
              Colabore com seu tempo no voluntariado ou faça uma doação online
              para fortalecer as atividades comunitárias.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/voluntariado"
              className="gradient-brand text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-sm"
            >
              Quero ser voluntário
            </Link>
            <Link
              href="/transparencia"
              className="bg-white border border-orange-200 text-orange-800 font-bold text-sm px-5 py-3.5 rounded-xl"
            >
              Ver transparência
            </Link>
          </div>
        </div>
      </div>

      {/* Artigos Relacionados no mesmo padrão de Card */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-16 print:hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="section-kicker">Continue lendo</p>
              <h2 className="display text-2xl md:text-3xl font-extrabold mt-1">
                Outras publicações em destaque
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-orange-700 font-extrabold text-sm hover:underline"
            >
              Ver todos <i className="fa-solid fa-arrow-right ml-1" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((rel) => (
              <ActionBlogCard
                key={rel.id}
                title={rel.title}
                description={rel.excerpt}
                image={rel.coverImage}
                imageAlt={rel.coverImageAlt}
                pillText={rel.pillText}
                buttonText={rel.buttonText}
                href={rel.customLink || `/blog/${rel.slug}`}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
