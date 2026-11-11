import { getSupabaseAdmin } from "@/lib/supabase";
import { PROJECT_IMAGES, type BlogPost, type BlogFaqItem } from "@/lib/blog-types";

export { PROJECT_IMAGES, type BlogPost, type BlogFaqItem };

interface SupabaseBlogRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  pill_text: string;
  button_text: string;
  custom_link: string | null;
  cover_image: string;
  cover_image_alt: string;
  category: string;
  tags: string[];
  author_name: string;
  author_role: string;
  reading_time_minutes: number;
  featured: boolean;
  draft: boolean;
  seo_title: string;
  seo_description: string;
  focus_keyword: string;
  content: string;
  faq: BlogFaqItem[] | null;
  published_at: string;
  updated_at: string;
}

// Fallback em memória apenas para quando variáveis do Supabase ainda não estiverem preenchidas
let memoryPosts: BlogPost[] = [];

function rowToPost(row: SupabaseBlogRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    pillText: row.pill_text || "Amor em Ação",
    buttonText: row.button_text || "Ler artigo completo",
    customLink: row.custom_link || undefined,
    coverImage: row.cover_image || "/images/casa-amarela-equipe-criancas.jpg",
    coverImageAlt: row.cover_image_alt || row.title,
    category: row.category || "Institucional",
    tags: Array.isArray(row.tags) ? row.tags : [],
    author: {
      name: row.author_name || "Equipe Editorial Amor em Ação",
      role: row.author_role || "Comunicação Institucional",
    },
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    readingTimeMinutes: row.reading_time_minutes || 4,
    featured: Boolean(row.featured),
    draft: Boolean(row.draft),
    seoTitle: row.seo_title || row.title,
    seoDescription: row.seo_description || row.excerpt,
    focusKeyword: row.focus_keyword || "",
    content: row.content || "",
    faq: Array.isArray(row.faq) ? row.faq : [],
  };
}

function postToRow(post: BlogPost): SupabaseBlogRow {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    pill_text: post.pillText,
    button_text: post.buttonText,
    custom_link: post.customLink || null,
    cover_image: post.coverImage,
    cover_image_alt: post.coverImageAlt,
    category: post.category,
    tags: post.tags,
    author_name: post.author.name,
    author_role: post.author.role,
    reading_time_minutes: post.readingTimeMinutes,
    featured: Boolean(post.featured),
    draft: Boolean(post.draft),
    seo_title: post.seoTitle,
    seo_description: post.seoDescription,
    focus_keyword: post.focusKeyword,
    content: post.content,
    faq: post.faq ?? [],
    published_at: post.publishedAt,
    updated_at: post.updatedAt,
  };
}

export async function getAllBlogPostsAsync(options?: {
  includeDrafts?: boolean;
}): Promise<{ posts: BlogPost[]; storage: "supabase" | "local" }> {
  const includeDrafts = Boolean(options?.includeDrafts);
  const supabase = getSupabaseAdmin();

  if (supabase) {
    try {
      let query = supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false });
      if (!includeDrafts) {
        query = query.eq("draft", false);
      }
      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        return {
          posts: sortPostsByDate((data as SupabaseBlogRow[]).map(rowToPost)),
          storage: "supabase",
        };
      }
    } catch {
      // Fallback caso a tabela ainda não tenha sido criada
    }
  }

  const filtered = memoryPosts.filter((p) => includeDrafts || !p.draft);
  return { posts: sortPostsByDate(filtered), storage: "local" };
}

export async function getFeaturedBlogPostsAsync(limit = 3): Promise<BlogPost[]> {
  const { posts } = await getAllBlogPostsAsync({ includeDrafts: false });
  const featured = posts.filter((p) => p.featured);
  if (featured.length >= limit) {
    return featured.slice(0, limit);
  }
  return posts.slice(0, limit);
}

export async function getBlogPostBySlugAsync(
  slug: string
): Promise<BlogPost | undefined> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (!error && data) {
        return rowToPost(data as SupabaseBlogRow);
      }
    } catch {
      // Fallback em memória
    }
  }
  return memoryPosts.find((p) => p.slug === slug);
}

export async function upsertBlogPostInStore(post: BlogPost): Promise<{
  post: BlogPost;
  storage: "supabase" | "local";
}> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const row = postToRow(post);
    const { data, error } = await supabase
      .from("blog_posts")
      .upsert(row, { onConflict: "id" })
      .select("*")
      .single();
    if (error) {
      throw new Error(`Erro no Supabase (blog_posts): ${error.message}`);
    }
    if (data) {
      return {
        post: rowToPost(data as SupabaseBlogRow),
        storage: "supabase",
      };
    }
  }

  const idx = memoryPosts.findIndex(
    (p) => p.id === post.id || p.slug === post.slug
  );
  if (idx >= 0) {
    memoryPosts[idx] = post;
  } else {
    memoryPosts.unshift(post);
  }
  return { post, storage: "local" };
}

export async function deleteBlogPostFromStore(params: {
  id?: string;
  slug?: string;
}): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const query = supabase.from("blog_posts").delete();
    const filtered = params.id
      ? query.eq("id", params.id)
      : query.eq("slug", params.slug ?? "");
    const { error } = await filtered;
    if (error) {
      throw new Error(`Erro ao excluir no Supabase: ${error.message}`);
    }
    return true;
  }

  const before = memoryPosts.length;
  memoryPosts = memoryPosts.filter(
    (p) => p.id !== params.id && p.slug !== params.slug
  );
  return memoryPosts.length < before;
}

export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function sortPostsByDate(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
