import type { Metadata } from "next";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { AdminDashboardClient } from "@/components/blog-admin/AdminDashboardClient";

export const metadata: Metadata = buildMetadata({
  title: "Painel Admin — Editor de Blog WYSIWYG & Doações | Amor em Ação",
  description:
    "Editor visual Milkdown Crepe WYSIWYG para publicações do blog, personalização do Pill da imagem e texto do botão do card, e verificação de doações.",
  path: "/admin/blog",
  noIndex: true,
});

export default function AdminBlogPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-stone-500">
          Carregando editor visual do blog...
        </div>
      }
    >
      <AdminDashboardClient initialTab="blog" />
    </Suspense>
  );
}
