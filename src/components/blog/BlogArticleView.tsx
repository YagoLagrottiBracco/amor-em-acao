/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog-types";
import { getBlogOutline } from "@/lib/blog-outline";
import { BlogMarkdown } from "@/components/blog/BlogMarkdown";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { ListenToArticle } from "@/components/blog/ListenToArticle";
import { ReadingModeToggle } from "@/components/blog/ReadingModeToggle";

interface BlogArticleViewProps {
  post: BlogPost;
  assetPreviews?: Record<string, string>;
  pageUrl?: string;
  isPreview?: boolean;
}

export function BlogArticleView({
  post,
  assetPreviews,
  pageUrl,
  isPreview = false,
}: BlogArticleViewProps) {
  const outline = getBlogOutline(post.content);
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(
    new Date(
      Number.isNaN(Date.parse(post.publishedAt))
        ? new Date().toISOString()
        : post.publishedAt
    )
  );

  const mergedAssetPreviews = {
    ...(assetPreviews ?? {}),
  };

  return (
    <div className="h-entry">
      {!isPreview && (
        <ReadingProgress
          targetId="article-body"
          minutes={post.readingTimeMinutes}
        />
      )}

      {/* Breadcrumb */}
      {!isPreview && (
        <nav
          aria-label="Breadcrumb"
          className="mb-6 text-xs text-stone-500 flex flex-wrap items-center gap-2 print:hidden"
        >
          <Link href="/" className="hover:text-orange-700 transition">
            Início
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/blog" className="hover:text-orange-700 transition">
            Blog &amp; Ações
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-stone-800 font-semibold truncate max-w-xs sm:max-w-md">
            {post.title}
          </span>
        </nav>
      )}

      {/* Header estruturado igual ao portfólio */}
      <header className="soft-card p-6 sm:p-10 mb-8">
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <span className="bg-orange-100 text-orange-800 text-xs font-extrabold px-3.5 py-1.5 rounded-full">
            {post.pillText}
          </span>
          <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
            {post.category}
          </span>
          <span className="text-xs text-stone-400 flex items-center gap-1.5 ml-auto">
            <i className="fa-regular fa-clock" aria-hidden="true"></i>
            {post.readingTimeMinutes} min de leitura
          </span>
        </div>

        <h1 className="p-name display text-2xl sm:text-4xl lg:text-[2.65rem] font-extrabold text-stone-900 leading-tight">
          {post.title}
        </h1>

        <p className="p-summary mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="mt-6 pt-5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-brand text-white flex items-center justify-center font-extrabold text-sm">
              AA
            </div>
            <div>
              <div className="p-author font-bold text-stone-800">
                {post.author.name}
              </div>
              <div>{post.author.role}</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span>
              <i className="fa-regular fa-calendar mr-1.5 text-orange-600"></i>
              Publicado em{" "}
              <time dateTime={post.publishedAt} className="dt-published font-semibold text-stone-700">
                {formattedDate}
              </time>
            </span>
          </div>
        </div>

        {/* Ferramentas interativas de leitura do portfólio: Ouvir artigo + Modo Leitura */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <ListenToArticle title={post.title} targetId="article-body" />
          <ReadingModeToggle />
        </div>
      </header>

      {/* Imagem de capa com Pill idêntico ao card */}
      <figure className="relative rounded-3xl overflow-hidden border border-orange-100 shadow-sm mb-10 bg-stone-100 aspect-[16/9]">
        <img
          src={post.coverImage}
          alt={post.coverImageAlt || post.title}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-4 left-4 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-xs font-extrabold text-orange-800 shadow-sm">
          {post.pillText}
        </span>
      </figure>

      {/* Grid: Corpo do Artigo + Sumário lateral (Outline/TOC automático de H2 e H3) */}
      <div className="grid lg:grid-cols-[minmax(0,1fr)_17rem] gap-8 items-start">
        <div className="min-w-0 space-y-8">
          <div id="article-body" className="soft-card p-6 sm:p-10 e-content">
            <BlogMarkdown
              content={post.content}
              assetPreviews={mergedAssetPreviews}
              pageUrl={isPreview ? undefined : pageUrl}
            />

            {/* Tags para SEO */}
            {post.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-stone-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-stone-500 mr-1">
                  Temas relacionados:
                </span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-orange-50 text-orange-800 border border-orange-200 px-3 py-1 rounded-full font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Seção de Perguntas Frequentes (FAQ) */}
          {post.faq && post.faq.length > 0 && (
            <section
              aria-label="Perguntas frequentes sobre o tema"
              className="soft-card p-6 sm:p-10"
            >
              <div className="section-kicker mb-2">Dúvidas comuns (FAQ)</div>
              <h2 className="display text-2xl font-extrabold text-stone-900 mb-6">
                Perguntas frequentes sobre este tema
              </h2>
              <div className="space-y-4">
                {post.faq.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl bg-orange-50/50 border border-orange-100 p-5"
                  >
                    <h3 className="font-bold text-stone-900 text-base">
                      {item.question}
                    </h3>
                    <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sumário lateral fixo ("Neste artigo") idêntico ao portfólio */}
        {outline.length > 0 && (
          <aside className="order-first lg:order-last print:hidden">
            <nav
              aria-label="Neste artigo"
              className="soft-card p-5 lg:sticky lg:top-28"
            >
              <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-orange-800">
                Neste artigo
              </p>
              <ol className="space-y-2 text-sm">
                {outline.map((heading) => (
                  <li
                    key={heading.id}
                    className={heading.depth === 3 ? "pl-3.5" : ""}
                  >
                    <a
                      href={`#${heading.id}`}
                      className="text-stone-600 hover:text-orange-700 hover:underline underline-offset-4 transition block leading-snug"
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
        )}
      </div>
    </div>
  );
}
