"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDonate } from "@/components/DonateContext";

export function HeroButtons() {
  const { openDonateModal } = useDonate();

  return (
    <div className="flex flex-wrap gap-3 mt-8">
      <button
        type="button"
        onClick={() => openDonateModal(50, "casa-amarela")}
        className="gradient-brand px-7 py-4 rounded-xl font-extrabold shadow-lg hover:-translate-y-1 transition cursor-pointer"
      >
        <i className="fa-solid fa-heart mr-2" />
        Quero ajudar
      </button>
      <Link
        href="/sobre"
        className="border border-white/30 bg-white/5 px-7 py-4 rounded-xl font-bold hover:bg-white/10 transition"
      >
        Conheça o projeto
      </Link>
    </div>
  );
}

const IMPACT_DESCRIPTIONS: [number, string][] = [
  [
    50,
    "Uma contribuição pode apoiar despesas relacionadas à alimentação, educação ou logística, conforme as prioridades e os custos reais de cada ação.",
  ],
  [
    150,
    "Contribuições maiores podem ajudar a compor recursos para materiais educativos, alimentação ou atividades comunitárias.",
  ],
  [
    300,
    "O apoio pode fortalecer ações de abastecimento, transporte e organização de campanhas, conforme o orçamento validado.",
  ],
  [
    501,
    "Uma contribuição de maior valor pode apoiar diferentes necessidades prioritárias, definidas com transparência pela equipe responsável.",
  ],
];

export function ImpactCalculator() {
  const [amount, setAmount] = useState<number>(50);
  const { openDonateModal } = useDonate();

  const description =
    IMPACT_DESCRIPTIONS.find(([limit]) => amount < limit)?.[1] ||
    IMPACT_DESCRIPTIONS[3][1];

  return (
    <div className="soft-card max-w-2xl mx-auto mt-8 p-6 md:p-9">
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-stone-500 font-extrabold">
          Valor hipotético
        </p>
        <div className="display text-5xl font-extrabold text-orange-600 mt-2">
          R$ <span id="calc-amount">{amount.toLocaleString("pt-BR")}</span>
        </div>
        <p className="text-xs text-stone-500">contribuição simulada</p>
      </div>

      <input
        id="impact-slider"
        aria-label="Valor hipotético da contribuição"
        type="range"
        min={20}
        max={500}
        step={10}
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full accent-orange-500 mt-7 cursor-pointer"
      />
      <div className="flex justify-between text-xs text-stone-400">
        <span>R$ 20</span>
        <span>R$ 500</span>
      </div>

      <div className="mt-6 rounded-xl bg-orange-50 border border-orange-100 p-5 flex gap-4 items-start">
        <span className="w-11 h-11 rounded-full bg-orange-500 text-white grid place-items-center shrink-0">
          <i className="fa-solid fa-lightbulb" />
        </span>
        <p
          id="calc-description"
          className="text-sm text-stone-700 leading-relaxed"
        >
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => openDonateModal(amount, "casa-amarela")}
        className="w-full gradient-brand text-white font-extrabold py-3.5 rounded-xl mt-6 shadow-md hover:shadow-lg transition cursor-pointer"
      >
        <i className="fa-solid fa-heart mr-2" />
        Doar R$ {amount.toLocaleString("pt-BR")} agora (Stripe)
      </button>
    </div>
  );
}
