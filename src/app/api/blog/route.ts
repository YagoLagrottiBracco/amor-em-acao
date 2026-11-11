import { NextRequest, NextResponse } from "next/server";
import {
  getAllBlogPostsAsync,
  upsertBlogPostInStore,
  deleteBlogPostFromStore,
  slugify,
  type BlogPost,
} from "@/lib/blog";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getAdminSessionFromRequest } from "@/lib/admin-auth";
import type { StagedBlogAsset } from "@/lib/blog-types";

function isAuthorized(request: NextRequest): boolean {
  return Boolean(getAdminSessionFromRequest(request));
}

/**
 * Converte quaisquer imagens estagiadas no editor WYSIWYG (`blog-asset://<id>`)
 * em URLs limpas do Supabase Storage (ou Data URLs caso o Storage ainda não esteja ativo)
 * diretamente dentro do Markdown do artigo, sem deixar objetos temporários no banco.
 */
async function replaceStagedAssetsInContent(
  rawContent: string,
  assets: StagedBlogAsset[] | undefined
): Promise<string> {
  if (!Array.isArray(assets) || assets.length === 0) return rawContent;

  let finalMarkdown = rawContent;
  const supabase = getSupabaseAdmin();

  for (const asset of assets) {
    if (!asset?.id || !asset?.base64 || !asset?.contentType) continue;
    const token = `blog-asset://${asset.id}`;
    if (!finalMarkdown.includes(token)) continue;

    let resolvedUrl = `data:${asset.contentType};base64,${asset.base64}`;

    if (supabase) {
      try {
        const ext = asset.contentType.split("/")[1] || "jpg";
        const filePath = `inline/${asset.id}.${ext}`;
        const buffer = Buffer.from(asset.base64, "base64");
        const { error: uploadErr } = await supabase.storage
          .from("blog-images")
          .upload(filePath, buffer, {
            contentType: asset.contentType,
            upsert: true,
          });
        if (!uploadErr) {
          const { data: pub } = supabase.storage
            .from("blog-images")
            .getPublicUrl(filePath);
          if (pub?.publicUrl) {
            resolvedUrl = pub.publicUrl;
          }
        }
      } catch {
        // Fallback para Data URL caso o bucket não exista
      }
    }

    finalMarkdown = finalMarkdown.replaceAll(token, resolvedUrl);
  }

  return finalMarkdown;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const wantsDrafts = searchParams.get("drafts") === "1";
  if (wantsDrafts && !isAuthorized(request)) {
    return NextResponse.json(
      { error: "Sessão administrativa necessária." },
      { status: 401 }
    );
  }
  const { posts, storage } = await getAllBlogPostsAsync({
    includeDrafts: wantsDrafts,
  });
  return NextResponse.json({ posts, storage });
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { error: "Faça login como administrador para criar publicações." },
        { status: 401 }
      );
    }
    const body = await request.json();

    const { posts } = await getAllBlogPostsAsync({ includeDrafts: true });

    const title = String(body.title || "").trim();
    const excerpt = String(body.excerpt || "").trim();
    const pillText = String(body.pillText || "").trim();
    const buttonText = String(body.buttonText || "").trim();

    if (!title || !excerpt || !pillText || !buttonText) {
      return NextResponse.json(
        {
          error:
            "Título, resumo, texto do Pill da imagem e texto do botão são obrigatórios.",
        },
        { status: 400 }
      );
    }

    const baseSlug = slugify(body.slug || title) || `post-${Date.now()}`;
    let finalSlug = baseSlug;
    let counter = 2;
    while (posts.some((p) => p.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    const rawContent =
      String(body.content || "").trim() || `## Introdução\n\n${excerpt}`;
    const content = await replaceStagedAssetsInContent(
      rawContent,
      body.assets as StagedBlogAsset[] | undefined
    );

    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const autoReadingMinutes = Math.max(1, Math.ceil(wordCount / 200));

    const now = new Date().toISOString();
    const newPost: BlogPost = {
      id: body.id ? String(body.id) : `post-${Date.now()}`,
      slug: finalSlug,
      title,
      excerpt,
      pillText,
      buttonText,
      customLink: body.customLink ? String(body.customLink).trim() : undefined,
      coverImage:
        String(body.coverImage || "").trim() ||
        "/images/casa-amarela-equipe-criancas.jpg",
      coverImageAlt: String(body.coverImageAlt || "").trim() || title,
      category: String(body.category || "Comunidade").trim(),
      tags: Array.isArray(body.tags)
        ? body.tags.map((t: unknown) => String(t).trim()).filter(Boolean)
        : String(body.tags || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
      author: {
        name: String(
          body.authorName || "Equipe Editorial Amor em Ação"
        ).trim(),
        role: String(body.authorRole || "Comunicação Institucional").trim(),
      },
      publishedAt: body.publishedAt || now,
      updatedAt: now,
      readingTimeMinutes:
        Number(body.readingTimeMinutes) || autoReadingMinutes,
      featured: Boolean(body.featured),
      draft: Boolean(body.draft),
      seoTitle: String(body.seoTitle || `${title} | Amor em Ação`).trim(),
      seoDescription: String(body.seoDescription || excerpt).trim(),
      focusKeyword: String(body.focusKeyword || title).trim(),
      content,
      faq: Array.isArray(body.faq) ? body.faq : [],
    };

    const { post: saved, storage } = await upsertBlogPostInStore(newPost);
    const { posts: updatedList } = await getAllBlogPostsAsync({
      includeDrafts: true,
    });

    return NextResponse.json(
      { post: saved, posts: updatedList, storage },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Erro ao salvar artigo do blog.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { error: "Faça login como administrador para editar publicações." },
        { status: 401 }
      );
    }
    const body = await request.json();

    const { posts } = await getAllBlogPostsAsync({ includeDrafts: true });

    const id = String(body.id || "").trim();
    const existing = posts.find((p) => p.id === id || p.slug === body.slug);
    if (!existing) {
      return NextResponse.json(
        { error: "Publicação não encontrada para edição." },
        { status: 404 }
      );
    }

    const title = String(body.title ?? existing.title).trim();
    const excerpt = String(body.excerpt ?? existing.excerpt).trim();
    const pillText = String(body.pillText ?? existing.pillText).trim();
    const buttonText = String(body.buttonText ?? existing.buttonText).trim();

    if (!title || !excerpt || !pillText || !buttonText) {
      return NextResponse.json(
        {
          error:
            "Título, resumo, texto do Pill da imagem e texto do botão são obrigatórios.",
        },
        { status: 400 }
      );
    }

    const rawContent = String(body.content ?? existing.content).trim();
    const content = await replaceStagedAssetsInContent(
      rawContent,
      body.assets as StagedBlogAsset[] | undefined
    );

    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const autoReadingMinutes = Math.max(1, Math.ceil(wordCount / 200));

    const updatedPost: BlogPost = {
      ...existing,
      title,
      slug: slugify(body.slug || title) || existing.slug,
      excerpt,
      pillText,
      buttonText,
      customLink: body.customLink
        ? String(body.customLink).trim()
        : undefined,
      coverImage:
        String(body.coverImage ?? existing.coverImage).trim() ||
        existing.coverImage,
      coverImageAlt:
        String(body.coverImageAlt ?? existing.coverImageAlt).trim() || title,
      category: String(body.category ?? existing.category).trim(),
      tags: Array.isArray(body.tags)
        ? body.tags.map((t: unknown) => String(t).trim()).filter(Boolean)
        : String(body.tags || "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
      author: {
        name: String(body.authorName ?? existing.author.name).trim(),
        role: String(body.authorRole ?? existing.author.role).trim(),
      },
      publishedAt: body.publishedAt || existing.publishedAt,
      updatedAt: new Date().toISOString(),
      readingTimeMinutes:
        Number(body.readingTimeMinutes) || autoReadingMinutes,
      featured:
        typeof body.featured === "boolean" ? body.featured : existing.featured,
      draft: typeof body.draft === "boolean" ? body.draft : existing.draft,
      seoTitle: String(body.seoTitle ?? existing.seoTitle).trim(),
      seoDescription: String(
        body.seoDescription ?? existing.seoDescription
      ).trim(),
      focusKeyword: String(body.focusKeyword ?? existing.focusKeyword).trim(),
      content,
      faq: Array.isArray(body.faq) ? body.faq : existing.faq,
    };

    const { post: saved, storage } = await upsertBlogPostInStore(updatedPost);
    const { posts: nextPosts } = await getAllBlogPostsAsync({
      includeDrafts: true,
    });

    return NextResponse.json({ post: saved, posts: nextPosts, storage });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Erro ao atualizar publicação.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!isAuthorized(request)) {
      return NextResponse.json(
        { error: "Faça login como administrador para remover publicações." },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "ID da publicação não informado." },
        { status: 400 }
      );
    }

    await deleteBlogPostFromStore({ id });
    const { posts, storage } = await getAllBlogPostsAsync({
      includeDrafts: true,
    });

    return NextResponse.json({ posts, storage });
  } catch {
    return NextResponse.json(
      { error: "Erro ao remover publicação." },
      { status: 500 }
    );
  }
}
