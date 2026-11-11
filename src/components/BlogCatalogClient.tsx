"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blog-types";
import { ActionBlogCard } from "@/components/ActionBlogCard";

export function BlogCatalogClient({
  posts,
  initialQuery = "",
}: {
  posts: BlogPost[];
  initialQuery?: string;
}) {
  const [search, setSearch] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(posts.map((p) => p.category)));
    return ["Todas", ...cats];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCat =
        selectedCategory === "Todas" || post.category === selectedCategory;
      const q = search.trim().toLowerCase();
      if (!q) return matchesCat;
      const matchesText =
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.pillText.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesText;
    });
  }, [posts, search, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Barra de busca e filtro por categoria */}
      <div className="soft-card p-5 md:p-6 mb-10 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        <div className="relative flex-grow max-w-xl">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por tema, região, palavra-chave..."
            aria-label="Buscar artigos no blog"
            className="form-field pl-11"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition cursor-pointer ${
                selectedCategory === cat
                  ? "gradient-brand text-white shadow-sm"
                  : "bg-orange-50 text-orange-800 hover:bg-orange-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Cards no padrão exato da imagem (Pill + Título + Resumo + Botão customizável) */}
      {filteredPosts.length === 0 ? (
        <div className="soft-card p-12 text-center">
          <i className="fa-regular fa-newspaper text-4xl text-orange-400" />
          <h2 className="display text-2xl font-extrabold mt-4">
            Nenhuma publicação encontrada
          </h2>
          <p className="text-stone-500 text-sm mt-2">
            Tente ajustar os termos da busca ou selecionar outra categoria.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedCategory("Todas");
            }}
            className="mt-5 bg-orange-100 text-orange-800 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <ActionBlogCard
              key={post.id}
              title={post.title}
              description={post.excerpt}
              image={post.coverImage}
              imageAlt={post.coverImageAlt}
              pillText={post.pillText}
              buttonText={post.buttonText}
              href={post.customLink || `/blog/${post.slug}`}
            />
          ))}
        </div>
      )}

      {/* Barra discreta para o administrador */}
      <div className="mt-14 pt-8 border-t border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
        <p>
          Todos os artigos são estruturados com dados semânticos Schema.org (
          <code>BlogPosting</code> e <code>FAQPage</code>) para indexação no
          Google.
        </p>
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-2 bg-white border border-orange-200 text-orange-800 font-extrabold px-4 py-2.5 rounded-xl hover:bg-orange-50 transition shrink-0"
        >
          <i className="fa-solid fa-pen-to-square" />
          Painel Admin: Criar / Editar Cards e Artigos
        </Link>
      </div>
    </div>
  );
}
