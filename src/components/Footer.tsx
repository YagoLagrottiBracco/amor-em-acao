"use client";

import React from "react";
import Link from "next/link";
import { useDonate } from "@/components/DonateContext";

export function Footer() {
  const { openDonateModal } = useDonate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#29231f] text-white pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-9 pb-10">
          <div>
            <Link href="/" className="inline-block focus-ring rounded-lg">
              <img
                src="/images/logo-amor-em-acao.webp"
                alt="Amor em Ação"
                className="w-48 h-auto bg-white rounded-lg p-2"
              />
            </Link>
            <p className="text-stone-400 text-sm leading-relaxed mt-5">
              Associação Humanitária Amor em Ação · Casa Amarela, Jardim
              Gramacho, Duque de Caxias/RJ.
            </p>
            <p className="text-stone-500 text-xs mt-2">
              CNPJ de referência pública: 21.960.082/0001-96
            </p>
          </div>

          <div>
            <h3 className="font-extrabold mb-4">Nossas ações</h3>
            <ul className="space-y-3 text-sm text-stone-400">
              <li>
                <Link
                  href="/acoes/atuacao-internacional"
                  className="hover:text-orange-300 transition"
                >
                  Atuação internacional
                </Link>
              </li>
              <li>
                <Link
                  href="/acoes/casa-amarela"
                  className="hover:text-orange-300 transition"
                >
                  Casa Amarela
                </Link>
              </li>
              <li>
                <Link
                  href="/acoes/nordeste"
                  className="hover:text-orange-300 transition"
                >
                  Ações no Nordeste
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-orange-300 transition"
                >
                  Notícias e Artigos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-extrabold mb-4">Institucional</h3>
            <ul className="space-y-3 text-sm text-stone-400">
              <li>
                <Link
                  href="/sobre"
                  className="hover:text-orange-300 transition"
                >
                  Quem somos
                </Link>
              </li>
              <li>
                <Link
                  href="/voluntariado"
                  className="hover:text-orange-300 transition"
                >
                  Seja voluntário
                </Link>
              </li>
              <li>
                <Link
                  href="/transparencia"
                  className="hover:text-orange-300 transition"
                >
                  Transparência
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="hover:text-orange-300 transition"
                >
                  Contato
                </Link>
              </li>
              <li>
                <Link
                  href="/doacao/gerenciar"
                  className="hover:text-orange-300 transition text-stone-400 text-xs inline-flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-sliders text-orange-400/80" />
                  Gerenciar doação recorrente
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-orange-300 transition text-stone-500 text-xs"
                >
                  <i className="fa-solid fa-gear mr-1.5" />
                  Painel Admin (Blog &amp; Doações)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-extrabold mb-4">Participe</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Quer apoiar financeiramente, divulgar ou construir uma parceria?
              Contribua agora ou fale com a equipe responsável pelo projeto.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => openDonateModal()}
                className="gradient-brand text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow hover:opacity-95 transition cursor-pointer"
              >
                <i className="fa-solid fa-heart mr-1.5" />
                Doar com Stripe
              </button>
              <Link
                href="/contato"
                className="border border-orange-400/50 text-orange-200 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-orange-500/10 transition"
              >
                Entre em contato
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row gap-4 items-center justify-between text-xs text-stone-400">
          <p>
            © {currentYear} Amor em Ação. Conteúdo institucional sujeito à
            confirmação.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              className="hover:text-orange-300 transition"
              href="https://www.instagram.com/ahamoremacao/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-instagram mr-1" />
              Instagram: @ahamoremacao
            </a>
            <span className="hidden sm:inline text-stone-600">|</span>
            <p className="text-stone-400">
              Desenvolvido por{" "}
              <a
                href="https://lagrotti.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-300 hover:text-orange-400 font-bold underline underline-offset-4 transition"
              >
                Yago Lagrotti Bracco
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
