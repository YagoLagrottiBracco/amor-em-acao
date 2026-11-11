"use client";

import React, { useState, useMemo } from "react";
import type {
  TransparencyDocument,
  TransparencyCategory,
} from "@/lib/transparency-types";
import { TRANSPARENCY_CATEGORY_LABELS } from "@/lib/transparency-types";

export function TransparencyManager({
  documents,
  storage,
  loading,
  onRefresh,
}: {
  documents: TransparencyDocument[];
  storage: "supabase" | "local";
  loading: boolean;
  onRefresh: () => Promise<void>;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState<TransparencyCategory>("institucional");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [fileUrl, setFileUrl] = useState("");
  const [fileSize, setFileSize] = useState("PDF");
  const [description, setDescription] = useState("");
  const [orderIndex, setOrderIndex] = useState(0);
  const [active, setActive] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    useState<string>("all");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setCategory("institucional");
    setYear(new Date().getFullYear().toString());
    setFileUrl("");
    setFileSize("PDF");
    setDescription("");
    setOrderIndex(0);
    setActive(true);
    setFeedback(null);
  }

  function loadDoc(doc: TransparencyDocument) {
    setEditingId(doc.id);
    setTitle(doc.title);
    setCategory(doc.category);
    setYear(doc.year || "");
    setFileUrl(doc.fileUrl);
    setFileSize(doc.fileSize || "PDF");
    setDescription(doc.description || "");
    setOrderIndex(doc.orderIndex || 0);
    setActive(doc.active);
    setFeedback(null);
    window.scrollTo({ top: 350, behavior: "smooth" });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !fileUrl.trim()) {
      setFeedback({
        type: "error",
        text: "Título e Link/Arquivo são obrigatórios.",
      });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const payload: Partial<TransparencyDocument> = {
        id: editingId || undefined,
        title: title.trim(),
        category,
        year: year.trim() || undefined,
        fileUrl: fileUrl.trim(),
        fileSize: fileSize.trim() || undefined,
        description: description.trim() || undefined,
        orderIndex: Number(orderIndex) || 0,
        active,
      };

      const res = await fetch("/api/transparencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error || "Não foi possível salvar o documento de transparência."
        );
      }

      setFeedback({
        type: "success",
        text: editingId
          ? "Documento de transparência atualizado!"
          : "Novo documento adicionado com sucesso!",
      });

      resetForm();
      await onRefresh();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Erro ao salvar documento.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, docTitle: string) {
    if (
      !window.confirm(
        `Tem certeza que deseja remover o documento "${docTitle}"?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/transparencia?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (editingId === id) resetForm();
        await onRefresh();
      }
    } catch {
      // Ignorar
    }
  }

  async function handleToggleActive(doc: TransparencyDocument) {
    try {
      await fetch("/api/transparencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...doc,
          active: !doc.active,
        }),
      });
      await onRefresh();
    } catch {
      // Ignorar
    }
  }

  const filteredDocs = useMemo(() => {
    return documents.filter((d) => {
      if (
        selectedCategoryFilter !== "all" &&
        d.category !== selectedCategoryFilter
      ) {
        return false;
      }
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return [d.title, d.category, d.year, d.description, d.fileSize]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [documents, selectedCategoryFilter, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Barra Superior */}
      <div className="soft-card p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 grid place-items-center font-extrabold text-lg">
            <i className="fa-solid fa-file-shield" />
          </span>
          <div>
            <h2 className="display font-extrabold text-lg text-stone-900">
              Gestão do Portal da Transparência
            </h2>
            <p className="text-xs text-stone-500">
              Adicione e gerencie balanços patrimoniais, relatórios de
              atividades, estatuto social e fontes públicas verificadas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-xl border border-orange-200 bg-orange-50 text-orange-800 text-xs font-extrabold hover:bg-orange-100 transition cursor-pointer"
            >
              <i className="fa-solid fa-plus mr-1.5" />
              Adicionar Novo Documento
            </button>
          )}

          <a
            href="/transparencia"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 border border-stone-200 text-stone-800 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <span>Ver Portal Público</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-[11px]" />
          </a>
        </div>
      </div>

      {feedback && (
        <div
          role="alert"
          className={`rounded-2xl p-4 text-xs font-bold flex items-center justify-between gap-3 ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : "bg-red-50 text-red-900 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <i
              className={`fa-solid ${
                feedback.type === "success"
                  ? "fa-circle-check text-emerald-600"
                  : "fa-triangle-exclamation text-red-600"
              }`}
            />
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-stone-400 hover:text-stone-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Grid: Formulário de Cadastro/Edição + Tabela de Documentos */}
      <div className="grid lg:grid-cols-[22rem_1fr] gap-8 items-start">
        {/* Formulário */}
        <div className="soft-card p-6 sm:p-7 space-y-5">
          <div>
            <span className="section-kicker">
              {editingId ? "Edição" : "Cadastro"}
            </span>
            <h3 className="display text-xl font-extrabold text-stone-900 mt-1">
              {editingId ? "Editar Documento" : "Novo Documento / Relatório"}
            </h3>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
                Título do Documento *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Balanço Patrimonial 2024, Estatuto Social..."
                className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 font-bold focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
                Categoria de Transparência *
              </label>
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as TransparencyCategory)
                }
                className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 font-bold focus:border-orange-500 focus:outline-none"
              >
                <option value="institucional">
                  🏛️ Documentos Institucionais &amp; Estatuto
                </option>
                <option value="financeiro">
                  💰 Balanços &amp; Demonstrações Financeiras
                </option>
                <option value="atividades">
                  📋 Relatórios de Atividades &amp; Impacto
                </option>
                <option value="fontes">
                  📰 Fontes Públicas &amp; Registros de Mídia
                </option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
                  Ano / Período
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Ex: 2024, 2023, Ativo"
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs text-stone-900 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
                  Tamanho / Tipo
                </label>
                <input
                  type="text"
                  value={fileSize}
                  onChange={(e) => setFileSize(e.target.value)}
                  placeholder="Ex: PDF · 1.4 MB"
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs text-stone-900 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
                Link do Documento / Arquivo PDF *
              </label>
              <input
                type="url"
                required
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://... (Link para o PDF, Google Drive ou link oficial)"
                className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-mono text-stone-900 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
                Descrição ou Resumo
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve resumo sobre o conteúdo do documento..."
                className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs text-stone-900 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="doc-active-check"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4 cursor-pointer"
              />
              <label
                htmlFor="doc-active-check"
                className="text-xs font-bold text-stone-800 cursor-pointer"
              >
                Visível no portal público de transparência
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full gradient-brand text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {saving ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-file-circle-check" />
                  {editingId ? "Atualizar Documento" : "Cadastrar Documento"}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Tabela de Documentos Cadastrados */}
        <div className="soft-card p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="section-kicker">Acervo de Transparência</span>
              <h3 className="display text-xl font-extrabold text-stone-900 mt-0.5">
                Documentos ({documents.length})
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-700 font-bold focus:outline-none"
              >
                <option value="all">Todas as Categorias</option>
                <option value="institucional">Institucional &amp; Estatuto</option>
                <option value="financeiro">Financeiro &amp; Balanços</option>
                <option value="atividades">Relatórios de Atividades</option>
                <option value="fontes">Fontes Públicas &amp; Mídia</option>
              </select>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar documento..."
                className="rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-700 focus:outline-none w-44"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-700 font-extrabold border-b border-stone-200 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Título / Documento</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Ano</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-stone-50/60 transition group"
                  >
                    <td className="p-3">
                      <strong className="block font-bold text-stone-900 text-sm">
                        {doc.title}
                      </strong>
                      {doc.description && (
                        <p className="text-stone-500 text-[11px] line-clamp-1 mt-0.5">
                          {doc.description}
                        </p>
                      )}
                      {doc.fileSize && (
                        <span className="text-[10px] text-stone-400">
                          {doc.fileSize}
                        </span>
                      )}
                    </td>

                    <td className="p-3">
                      <span className="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-orange-100/70 text-orange-800">
                        {TRANSPARENCY_CATEGORY_LABELS[doc.category]}
                      </span>
                    </td>

                    <td className="p-3 font-bold text-stone-700">
                      {doc.year || "—"}
                    </td>

                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(doc)}
                        className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full cursor-pointer transition ${
                          doc.active
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        }`}
                      >
                        {doc.active ? "Ativo" : "Inativo"}
                      </button>
                    </td>

                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Abrir arquivo/link"
                          className="w-7 h-7 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 grid place-items-center text-xs"
                        >
                          <i className="fa-solid fa-arrow-up-right-from-square" />
                        </a>
                        <button
                          type="button"
                          onClick={() => loadDoc(doc)}
                          title="Editar"
                          className="w-7 h-7 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 grid place-items-center text-xs cursor-pointer"
                        >
                          <i className="fa-solid fa-pen" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(doc.id, doc.title)}
                          title="Excluir"
                          className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 grid place-items-center text-xs cursor-pointer"
                        >
                          <i className="fa-solid fa-trash-can" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredDocs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-stone-500">
                      Nenhum documento encontrado para este filtro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
