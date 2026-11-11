import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo";
import { getAllBlogPostsAsync } from "@/lib/blog";
import { getAllActionsAsync } from "@/lib/actions";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/acoes`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/voluntariado`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/transparencia`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
  ];

  const [{ posts }, { actions }] = await Promise.all([
    getAllBlogPostsAsync({ includeDrafts: false }),
    getAllActionsAsync({ includeDrafts: false }),
  ]);

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.publishedAt),
    changeFrequency: "weekly",
    priority: post.featured ? 0.9 : 0.8,
  }));

  const actionRoutes: MetadataRoute.Sitemap = actions.map((action) => ({
    url: `${baseUrl}/acoes/${action.slug}`,
    lastModified: new Date(action.updatedAt || action.createdAt),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticRoutes, ...actionRoutes, ...blogRoutes];
}
