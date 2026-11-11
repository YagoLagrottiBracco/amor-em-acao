"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function DonorPortalClient() {
  const searchParams = useSearchParams();
  const initialSessionId = searchParams.get("session_id") || "";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleOpenPortal = async (
    targetEmail?: string,
    targetSessionId?: string
  ) => {
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: targetEmail || (email.trim() ? email.trim() : undefined),
          sessionId: targetSessionId || (initialSessionId || undefined),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        setErrorMsg(
          data.error ||
            "Não foi possível acessar o Portal do Doador no momento. Verifique o e-mail digitado."
        );
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setErrorMsg(
        "Erro de conexão ao acessar o Portal do Doador. Verifique sua conexão e tente novamente."
      );
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() && !initialSessionId) {
      setErrorMsg("Por favor, digite o e-mail cadastrado na doação.");
      return;
    }
    handleOpenPortal(email.trim(), initialSessionId || undefined);
  };

  // If session_id is in URL, user just finished a donation or clicked direct link
  useEffect(() => {
    if (initialSessionId) {
      handleOpenPortal(undefined, initialSessionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSessionId]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <div className="soft-card p-6 sm:p-10 text-center">
        <span className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 grid place-items-center text-3xl mx-auto shadow-inner">
          <i className="fa-solid fa-sliders" />
        </span>

        <p className="section-kicker mt-5">Portal de Autonomia do Doador</p>
        <h1 className="display text-3xl sm:text-4xl font-extrabold mt-1">
          Gerenciar Doações Recorrentes
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed mt-3 max-w-lg mx-auto">
          Para nós, cada doação é sagrada. Você tem total controle sobre sua
          contribuição mensal: altere dados do cartão, baixe recibos ou cancele a
          qualquer momento sem nenhuma complicação.
        </p>

        {initialSessionId && loading ? (
          <div className="my-8 p-6 bg-orange-50 border border-orange-200 rounded-2xl">
            <i className="fa-solid fa-spinner fa-spin text-2xl text-orange-600 mb-2" />
            <p className="text-sm font-bold text-orange-950">
              Conectando você ao Portal do Doador da Stripe...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto text-left">
            <label
              htmlFor="donor-portal-email"
              className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2"
            >
              Seu e-mail cadastrado na doação
            </label>
            <div className="relative">
              <input
                id="donor-portal-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                className="form-field text-base pl-11"
              />
              <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            </div>

            {errorMsg && (
              <div className="mt-4 p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-medium leading-relaxed">
                <i className="fa-solid fa-circle-exclamation mr-1.5" />
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 gradient-brand text-white font-extrabold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-60 text-center"
            >
              {loading ? (
                <span>
                  <i className="fa-solid fa-spinner fa-spin mr-2" />
                  Acessando ambiente seguro...
                </span>
              ) : (
                <span>
                  <i className="fa-solid fa-lock mr-2" />
                  Acessar Portal Seguro Stripe
                </span>
              )}
            </button>
          </form>
        )}

        {/* O que o doador pode fazer no portal */}
        <div className="mt-10 pt-8 border-t border-stone-200/80 grid sm:grid-cols-3 gap-4 text-left">
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
            <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 grid place-items-center text-sm font-bold mb-2">
              <i className="fa-regular fa-credit-card" />
            </span>
            <h2 className="text-xs font-extrabold text-stone-800">
              Formas de Pagamento
            </h2>
            <p className="text-[11px] text-stone-500 mt-1 leading-normal">
              Atualize o cartão de crédito cadastrado ou informe um novo cartão.
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 grid place-items-center text-sm font-bold mb-2">
              <i className="fa-solid fa-receipt" />
            </span>
            <h2 className="text-xs font-extrabold text-stone-800">
              Histórico & Faturas
            </h2>
            <p className="text-[11px] text-stone-500 mt-1 leading-normal">
              Baixe faturas, recibos e consulte o histórico de todas as cobranças.
            </p>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
            <span className="w-8 h-8 rounded-lg bg-red-100 text-red-700 grid place-items-center text-sm font-bold mb-2">
              <i className="fa-solid fa-ban" />
            </span>
            <h2 className="text-xs font-extrabold text-stone-800">
              Cancele quando quiser
            </h2>
            <p className="text-[11px] text-stone-500 mt-1 leading-normal">
              Cancele ou pause sua doação com 1 clique direto no sistema da Stripe.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs font-bold">
          <Link
            href="/"
            className="text-stone-500 hover:text-stone-800 transition"
          >
            &larr; Voltar para a página inicial
          </Link>
          <span className="text-stone-300">·</span>
          <Link
            href="/transparencia"
            className="text-orange-700 hover:text-orange-900 transition"
          >
            Portal da Transparência &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
