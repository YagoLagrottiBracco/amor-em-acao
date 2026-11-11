import type { Metadata } from "next";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { AdminDashboardClient } from "@/components/blog-admin/AdminDashboardClient";

export const metadata: Metadata = buildMetadata({
  title: "Painel Administrativo — Blog WYSIWYG & Doações | Amor em Ação",
  description:
    "Painel administrativo para gestão de publicações do blog (Milkdown Crepe WYSIWYG) e verificação de doações integradas ao Supabase e Stripe.",
  path: "/admin",
  noIndex: true,
});

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-stone-500">
          Carregando painel administrativo...
        </div>
      }
    >
      <AdminDashboardClient initialTab="blog" />
    </Suspense>
  );
}
