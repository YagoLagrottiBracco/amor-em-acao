"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDonate } from "@/components/DonateContext";
import type { ActionNavSummary } from "@/lib/action-types";

const INITIAL_NAV_ACTIONS: ActionNavSummary[] = [
  {
    id: "action-atuacao-internacional",
    slug: "atuacao-internacional",
    title: "Atuação internacional",
    navSubtitle: "Água e educação no Malawi",
    coverImage: "/images/malawi-acesso-agua-poco.jpg",
    createdAt: "2024-01-03T12:00:00.000Z",
  },
  {
    id: "action-casa-amarela",
    slug: "casa-amarela",
    title: "Casa Amarela",
    navSubtitle: "Acolhimento em Jardim Gramacho",
    coverImage: "/images/casa-amarela-equipe-criancas.jpg",
    createdAt: "2024-01-01T12:00:00.000Z",
  },
  {
    id: "action-nordeste",
    slug: "nordeste",
    title: "Ações no Nordeste",
    navSubtitle: "Atividades em Matões do Norte/MA",
    coverImage: "/images/nordeste-matoes-encontro-comunitario.jpg",
    createdAt: "2024-01-02T12:00:00.000Z",
  },
];

export function Header() {
  const pathname = usePathname();
  const { openDonateModal } = useDonate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navActions, setNavActions] = useState<ActionNavSummary[]>(INITIAL_NAV_ACTIONS);
  const [totalActionsCount, setTotalActionsCount] = useState(3);

  useEffect(() => {
    let active = true;
    async function fetchNavActions() {
      try {
        const res = await fetch("/api/actions/nav");
        if (!active || !res.ok) return;
        const data = await res.json();
        if (Array.isArray(data.navActions) && data.navActions.length > 0) {
          setNavActions(data.navActions.slice(0, 3));
        }
        if (typeof data.totalCount === "number") {
          setTotalActionsCount(data.totalCount);
        }
      } catch {
        // Silently fallback to default initial actions
      }
    }
    void fetchNavActions();
    return () => {
      active = false;
    };
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isActionsActive = pathname.startsWith("/acoes");

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-[82px] flex items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="Amor em Ação - início"
            className="focus-ring rounded-lg shrink-0"
          >
            <img
              className="logo-img"
              src="/images/logo-amor-em-acao.webp"
              alt="Logo Amor em Ação"
            />
          </Link>

          <nav
            className="hidden lg:flex items-center gap-7"
            aria-label="Navegação principal"
          >
            <Link
              href="/"
              className={`nav-link text-sm font-bold ${
                isActive("/") ? "active" : ""
              }`}
            >
              Início
            </Link>

            <div className="relative group">
              <button
                type="button"
                className={`nav-link text-sm font-bold flex items-center gap-2 py-3 focus-ring rounded cursor-pointer ${
                  isActionsActive ? "active" : ""
                }`}
                aria-haspopup="true"
              >
                Nossas ações{" "}
                <i className="fa-solid fa-chevron-down text-[10px]" />
              </button>
              <div className="absolute top-full left-0 pt-2 w-72 hidden group-hover:block group-focus-within:block">
                <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-2">
                  {navActions.slice(0, 3).map((action) => (
                    <Link
                      key={action.slug}
                      href={`/acoes/${action.slug}`}
                      className="block w-full text-left rounded-xl p-3 hover:bg-orange-50 transition"
                    >
                      <b className="block text-sm text-stone-900 font-extrabold">
                        {action.title}
                      </b>
                      <small className="text-stone-500 block text-xs mt-0.5">
                        {action.navSubtitle}
                      </small>
                    </Link>
                  ))}
                  <div className="border-t border-orange-100 mt-1 pt-1.5 px-1">
                    <Link
                      href="/acoes"
                      className="block w-full text-center rounded-lg py-2 px-3 text-xs font-extrabold text-orange-700 hover:bg-orange-50 transition"
                    >
                      Ver todas as ações ({totalActionsCount}) &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/voluntariado"
              className={`nav-link text-sm font-bold ${
                isActive("/voluntariado") ? "active" : ""
              }`}
            >
              Seja voluntário
            </Link>

            <Link
              href="/transparencia"
              className={`nav-link text-sm font-bold ${
                isActive("/transparencia") ? "active" : ""
              }`}
            >
              Transparência
            </Link>

            <Link
              href="/sobre"
              className={`nav-link text-sm font-bold ${
                isActive("/sobre") ? "active" : ""
              }`}
            >
              Quem somos
            </Link>

            <Link
              href="/blog"
              className={`nav-link text-sm font-bold ${
                isActive("/blog") ? "active" : ""
              }`}
            >
              Notícias
            </Link>

            <Link
              href="/contato"
              className={`nav-link text-sm font-bold ${
                isActive("/contato") ? "active" : ""
              }`}
            >
              Contato
            </Link>
          </nav>

          <div className="hidden lg:block">
            <button
              type="button"
              onClick={() => openDonateModal()}
              className="gradient-brand text-white font-extrabold text-sm px-5 py-3 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition cursor-pointer"
            >
              <i className="fa-solid fa-heart mr-2" />
              Doe agora
            </button>
          </div>

          <button
            id="mobile-toggle"
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden w-11 h-11 rounded-xl bg-orange-50 text-orange-700 text-xl focus-ring cursor-pointer"
            aria-label="Abrir menu"
            aria-expanded={mobileMenuOpen}
          >
            <i
              className={`fa-solid ${
                mobileMenuOpen ? "fa-xmark" : "fa-bars"
              }`}
            />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden bg-white border-t border-orange-100 px-4 py-4 space-y-1"
        >
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-link"
          >
            Início
          </Link>
          <p className="px-3 pt-3 pb-1 text-[11px] font-extrabold uppercase tracking-widest text-orange-600">
            Nossas ações ({navActions.slice(0, 3).length})
          </p>
          {navActions.slice(0, 3).map((action) => (
            <Link
              key={action.slug}
              href={`/acoes/${action.slug}`}
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-link flex flex-col items-start py-2.5"
            >
              <span className="font-extrabold text-stone-900">{action.title}</span>
              <span className="text-xs text-stone-500 font-normal">
                {action.navSubtitle}
              </span>
            </Link>
          ))}
          <Link
            href="/acoes"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-link text-xs font-bold text-orange-700 bg-orange-50/60 rounded-lg py-2"
          >
            Ver todas as ações ({totalActionsCount}) &rarr;
          </Link>
          <Link
            href="/voluntariado"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-link"
          >
            Seja voluntário
          </Link>
          <Link
            href="/transparencia"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-link"
          >
            Transparência
          </Link>
          <Link
            href="/sobre"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-link"
          >
            Quem somos
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-link"
          >
            Notícias
          </Link>
          <Link
            href="/contato"
            onClick={() => setMobileMenuOpen(false)}
            className="mobile-link"
          >
            Contato
          </Link>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              openDonateModal();
            }}
            className="w-full gradient-brand text-white font-extrabold py-3 rounded-xl mt-3 cursor-pointer"
          >
            <i className="fa-solid fa-heart mr-2" />
            Doe agora
          </button>
        </div>
      )}
    </header>
  );
}
