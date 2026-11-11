"use client";

import React, { useState } from "react";
import { useDonate } from "@/components/DonateContext";

export function VolunteerForm() {
  const { toast } = useDonate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSubmitting(true);

    try {
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      const res = await fetch("/api/voluntariado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error || "Não foi possível registrar seu interesse.");
        return;
      }
      toast(
        "Manifestação de interesse registrada no sistema! Nossa equipe entrará em contato."
      );
      form.reset();
    } catch {
      toast(
        "Erro de conexão ao enviar formulário. Tente novamente ou fale pelo Instagram @ahamoremacao."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      id="volunteer-form"
      onSubmit={handleSubmit}
      className="soft-card p-6 md:p-8 space-y-5"
    >
      <div>
        <h2 className="display text-2xl font-extrabold">
          Cadastro de interesse
        </h2>
        <p className="text-sm text-stone-500 mt-1">
          Os campos marcados com * são obrigatórios.
        </p>
      </div>

      <div>
        <label htmlFor="vol-name" className="block text-sm font-bold mb-2">
          Nome completo *
        </label>
        <input
          id="vol-name"
          name="nome"
          required
          autoComplete="name"
          className="form-field"
          placeholder="Seu nome"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="vol-email" className="block text-sm font-bold mb-2">
            E-mail *
          </label>
          <input
            id="vol-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="form-field"
            placeholder="voce@email.com"
          />
        </div>
        <div>
          <label htmlFor="vol-phone" className="block text-sm font-bold mb-2">
            Telefone / WhatsApp *
          </label>
          <input
            id="vol-phone"
            name="telefone"
            type="tel"
            required
            autoComplete="tel"
            className="form-field"
            placeholder="(00) 00000-0000"
          />
        </div>
      </div>

      <div>
        <label htmlFor="vol-area" className="block text-sm font-bold mb-2">
          Área de interesse *
        </label>
        <select id="vol-area" name="area" required className="form-field">
          <option value="">Selecione uma área</option>
          <option>Educação e atividades com crianças</option>
          <option>Saúde e assistência</option>
          <option>Comunicação, mídias e design</option>
          <option>Logística e campanhas</option>
          <option>Organização de eventos</option>
          <option>Voluntariado geral</option>
        </select>
      </div>

      <div>
        <label htmlFor="vol-mode" className="block text-sm font-bold mb-2">
          Disponibilidade
        </label>
        <select id="vol-mode" name="disponibilidade" className="form-field">
          <option>Presencial</option>
          <option>Remota</option>
          <option>Híbrida</option>
          <option>A combinar</option>
        </select>
      </div>

      <div>
        <label htmlFor="vol-message" className="block text-sm font-bold mb-2">
          Conte um pouco sobre como gostaria de ajudar
        </label>
        <textarea
          id="vol-message"
          name="mensagem"
          rows={4}
          className="form-field"
          placeholder="Experiências, habilidades e disponibilidade..."
        />
      </div>

      <label className="flex gap-3 items-start text-xs text-stone-500">
        <input
          type="checkbox"
          required
          className="mt-1 accent-orange-600 cursor-pointer"
        />
        <span>
          Autorizo o contato para tratar desta manifestação de interesse e
          declaro que li as informações de privacidade.
        </span>
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="gradient-brand text-white font-extrabold w-full py-4 rounded-xl cursor-pointer disabled:opacity-60 transition"
      >
        {submitting ? "Enviando..." : "Enviar manifestação de interesse"}{" "}
        <i className="fa-solid fa-arrow-right ml-2" />
      </button>

      <p className="text-xs text-stone-400 leading-relaxed">
        Para agilizar seu atendimento, recomendamos também entrar em contato
        diretamente pelo perfil oficial @ahamoremacao no Instagram.
      </p>
    </form>
  );
}
