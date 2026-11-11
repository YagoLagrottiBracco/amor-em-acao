"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

interface DonateContextValue {
  openDonateModal: (initialAmount?: number, initialProject?: string) => void;
  closeDonateModal: () => void;
  toast: (message: string) => void;
}

const DonateContext = createContext<DonateContextValue | undefined>(undefined);

export function useDonate() {
  const ctx = useContext(DonateContext);
  if (!ctx) {
    throw new Error("useDonate must be used within a DonateProvider");
  }
  return ctx;
}

const PRESET_AMOUNTS = [25, 50, 100, 200, 500];

const PROJECTS = [
  { id: "casa-amarela", label: "Casa Amarela · Jardim Gramacho/RJ" },
  { id: "geral", label: "Onde for mais urgente (Fundo Geral)" },
  { id: "nordeste", label: "Ações no Nordeste · Maranhão" },
  { id: "internacional", label: "Atuação Internacional" },
];

export function DonateProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>("50");
  const [frequency, setFrequency] = useState<"payment" | "subscription">(
    "payment"
  );
  const [project, setProject] = useState<string>("casa-amarela");
  const [donorName, setDonorName] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showBackTop, setShowBackTop] = useState(false);

  const toast = useCallback((message: string) => {
    setToastMsg(message);
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const timer = setTimeout(() => setToastMsg(null), 4200);
    return () => clearTimeout(timer);
  }, [toastMsg]);

  const openDonateModal = useCallback(
    (initialAmount?: number, initialProject?: string) => {
      if (initialAmount && initialAmount >= 5) {
        setAmount(initialAmount);
        setCustomAmount(String(initialAmount));
      }
      if (initialProject) {
        setProject(initialProject);
      }
      setErrorMsg(null);
      setIsOpen(true);
      document.body.classList.add("modal-open");
    },
    []
  );

  const closeDonateModal = useCallback(() => {
    setIsOpen(false);
    setErrorMsg(null);
    document.body.classList.remove("modal-open");
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowBackTop(window.scrollY > 450);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDonateModal();
    };
    window.addEventListener("scroll", onScroll);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeDonateModal]);

  const handlePresetClick = (val: number) => {
    setAmount(val);
    setCustomAmount(String(val));
    setErrorMsg(null);
  };

  const handleCustomAmountChange = (val: string) => {
    setCustomAmount(val);
    const parsed = Number(val.replace(",", "."));
    if (!Number.isNaN(parsed)) {
      setAmount(parsed);
    }
    setErrorMsg(null);
  };

  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!amount || amount < 5) {
      setErrorMsg("O valor mínimo para doação via Stripe é de R$ 5,00.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          frequency,
          project,
          donorName: donorName.trim() || undefined,
          donorEmail: donorEmail.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(
          data.error ||
            "Não foi possível iniciar o pagamento no momento. Verifique as configurações do Stripe."
        );
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        setErrorMsg("URL de checkout não recebida da Stripe.");
        setLoading(false);
      }
    } catch {
      setErrorMsg(
        "Erro de conexão ao comunicar com o servidor de doações. Tente novamente."
      );
      setLoading(false);
    }
  };

  return (
    <DonateContext.Provider
      value={{ openDonateModal, closeDonateModal, toast }}
    >
      {children}

      {/* MODAL DE DOAÇÃO INTEGRADO COM STRIPE */}
      {isOpen && (
        <div
          id="donateModal"
          className="fixed inset-0 z-50 flex bg-black/65 backdrop-blur-sm items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="donate-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDonateModal();
          }}
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl my-auto">
            <button
              type="button"
              onClick={closeDonateModal}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 transition cursor-pointer"
              aria-label="Fechar"
            >
              <i className="fa-solid fa-xmark" />
            </button>

            <div className="text-center">
              <span className="w-14 h-14 rounded-full bg-orange-100 text-orange-600 grid place-items-center text-2xl mx-auto">
                <i className="fa-solid fa-heart" />
              </span>
              <h2
                id="donate-title"
                className="display text-2xl font-extrabold mt-3"
              >
                Apoie o Amor em Ação
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                Faça sua contribuição segura via Stripe ou consulte o canal
                oficial da associação.
              </p>
            </div>

            <form onSubmit={handleStripeCheckout} className="mt-5 space-y-4">
              {/* Frequência */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFrequency("payment")}
                  className={`py-2.5 text-xs font-extrabold rounded-lg transition cursor-pointer ${
                    frequency === "payment"
                      ? "bg-white text-orange-700 shadow-sm"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Doação Única
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency("subscription")}
                  className={`py-2.5 text-xs font-extrabold rounded-lg transition cursor-pointer ${
                    frequency === "subscription"
                      ? "bg-white text-orange-700 shadow-sm"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  Mensal Recorrente
                </button>
              </div>

              {/* Valores Rápidos */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-500 mb-2">
                  Escolha um valor (R$)
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePresetClick(preset)}
                      className={`py-2.5 rounded-xl font-extrabold text-sm border transition cursor-pointer ${
                        amount === preset
                          ? "border-orange-500 bg-orange-50 text-orange-700"
                          : "border-stone-200 bg-white text-stone-700 hover:border-orange-300"
                      }`}
                    >
                      R$ {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Valor customizado e Destino */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="donate-custom-amount"
                    className="block text-xs font-bold text-stone-600 mb-1"
                  >
                    Valor personalizado (R$)
                  </label>
                  <input
                    id="donate-custom-amount"
                    type="number"
                    min={5}
                    step="1"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="form-field text-sm font-bold"
                    placeholder="Ex: 50"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="donate-project"
                    className="block text-xs font-bold text-stone-600 mb-1"
                  >
                    Frente de atuação
                  </label>
                  <select
                    id="donate-project"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="form-field text-sm"
                  >
                    {PROJECTS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dados opcionais do doador */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="donor-name"
                    className="block text-xs font-bold text-stone-600 mb-1"
                  >
                    Seu nome (opcional)
                  </label>
                  <input
                    id="donor-name"
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="form-field text-sm"
                    placeholder="Nome completo"
                  />
                </div>
                <div>
                  <label
                    htmlFor="donor-email"
                    className="block text-xs font-bold text-stone-600 mb-1"
                  >
                    E-mail p/ recibo (opcional)
                  </label>
                  <input
                    id="donor-email"
                    type="email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="form-field text-sm"
                    placeholder="voce@email.com"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl p-3 font-medium">
                  <i className="fa-solid fa-circle-exclamation mr-1.5" />
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-brand text-white font-extrabold py-3.5 rounded-xl text-center block shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span>
                    <i className="fa-solid fa-spinner fa-spin mr-2" />
                    Conectando ao Stripe...
                  </span>
                ) : (
                  <span>
                    <i className="fa-solid fa-lock mr-2" />
                    Doar R$ {Number(amount || 0).toLocaleString("pt-BR")}
                    {frequency === "subscription" ? "/mês" : ""} via Stripe
                  </span>
                )}
              </button>
            </form>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 mt-4">
              <p className="text-[11px] uppercase tracking-widest font-extrabold text-amber-800">
                Nota de transparência
              </p>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                O pagamento online é processado de forma criptografada via{" "}
                <b>Stripe</b>. Para doações diretas ou confirmação de dados
                bancários oficiais, consulte o perfil público da associação.
              </p>
            </div>

            <div className="mt-4 flex gap-2">
              <a
                href="https://www.instagram.com/ahamoremacao/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeDonateModal}
                className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold text-xs py-3 rounded-xl text-center transition"
              >
                <i className="fa-brands fa-instagram mr-1.5" />
                Consultar @ahamoremacao
              </a>
              <button
                type="button"
                onClick={closeDonateModal}
                className="px-5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs py-3 rounded-xl transition cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST GLOBAL */}
      {toastMsg && (
        <div
          id="toast"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[60] bg-stone-900 text-white text-sm font-bold px-5 py-3 rounded-xl shadow-xl max-w-md text-center"
          role="status"
          aria-live="polite"
        >
          {toastMsg}
        </div>
      )}

      {/* BOTÃO VOLTAR AO TOPO */}
      {showBackTop && (
        <button
          id="back-top"
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-5 right-5 z-30 w-12 h-12 rounded-full gradient-brand text-white shadow-lg cursor-pointer hover:scale-105 transition"
          aria-label="Voltar ao topo"
        >
          <i className="fa-solid fa-arrow-up" />
        </button>
      )}
    </DonateContext.Provider>
  );
}
