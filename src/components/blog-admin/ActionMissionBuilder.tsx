"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PROJECT_IMAGES } from "@/lib/blog-types";
import { ActionBlockRenderer } from "@/components/actions/ActionBlockRenderer";
import type {
  ActionMission,
  ActionPageBlock,
  ActionBlockType,
  GalleryItemData,
  CardItemData,
  StatItemData,
  ContactLinkData,
} from "@/lib/action-types";

function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const COMMON_ICONS = [
  { icon: "fa-utensils", label: "Alimentação" },
  { icon: "fa-hands-holding-child", label: "Acolhimento" },
  { icon: "fa-soap", label: "Higiene" },
  { icon: "fa-puzzle-piece", label: "Brincadeiras" },
  { icon: "fa-book-open", label: "Educação" },
  { icon: "fa-droplet", label: "Água / Saúde" },
  { icon: "fa-heart", label: "Solidariedade" },
  { icon: "fa-house", label: "Moradia" },
  { icon: "fa-hands-holding-circle", label: "Comunidade" },
  { icon: "fa-shirt", label: "Vestuário" },
  { icon: "fa-hand-holding-heart", label: "Cuidado" },
  { icon: "fa-seedling", label: "Sustentabilidade" },
];

export function ActionMissionBuilder({
  actions,
  storage,
  loading,
  onRefresh,
}: {
  actions: ActionMission[];
  storage: "supabase" | "local";
  loading: boolean;
  onRefresh: () => Promise<void>;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [navSubtitle, setNavSubtitle] = useState("");
  const [kicker, setKicker] = useState("Ação Comunitária");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(PROJECT_IMAGES[0].url);
  const [coverImageAlt, setCoverImageAlt] = useState("");
  const [status, setStatus] = useState<"published" | "draft">("published");
  const [featuredInNav, setFeaturedInNav] = useState(true);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [blocks, setBlocks] = useState<ActionPageBlock[]>([]);

  const [expandedBlockId, setExpandedBlockId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"builder" | "preview">("builder");
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setNavSubtitle("");
    setKicker("Ação Comunitária");
    setDescription("");
    setCoverImage(PROJECT_IMAGES[0].url);
    setCoverImageAlt("");
    setStatus("published");
    setFeaturedInNav(true);
    setSeoTitle("");
    setSeoDescription("");
    setBlocks([
      {
        id: `hero-${Date.now()}`,
        type: "hero",
        kicker: "Ação Comunitária",
        title: "Nome da Nova Missão",
        subtitle:
          "Descreva brevemente o propósito e impacto desta missão comunitária.",
        primaryButtonText: "Quero apoiar",
        primaryButtonLink: "/voluntariado",
      },
    ]);
    setExpandedBlockId(null);
    setActiveView("builder");
    setFeedback(null);
  }

  function loadAction(action: ActionMission) {
    setEditingId(action.id);
    setTitle(action.title);
    setSlug(action.slug);
    setNavSubtitle(action.navSubtitle);
    setKicker(action.kicker);
    setDescription(action.description);
    setCoverImage(action.coverImage);
    setCoverImageAlt(action.coverImageAlt);
    setStatus(action.status);
    setFeaturedInNav(action.featuredInNav);
    setSeoTitle(action.seoTitle || "");
    setSeoDescription(action.seoDescription || "");
    setBlocks(action.blocks && action.blocks.length > 0 ? action.blocks : []);
    setExpandedBlockId(action.blocks?.[0]?.id || null);
    setActiveView("builder");
    setFeedback(null);
    window.scrollTo({ top: 350, behavior: "smooth" });
  }

  function handleAddBlock(type: ActionBlockType) {
    const id = `${type}-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 6)}`;
    let newBlock: ActionPageBlock;

    switch (type) {
      case "hero":
        newBlock = {
          id,
          type: "hero",
          kicker: kicker || "Ação Comunitária",
          title: title || "Título da Ação",
          subtitle: description || "Subtítulo da ação comunitária",
          primaryButtonText: "Quero apoiar",
          primaryButtonLink: "/voluntariado",
        };
        break;
      case "image_text":
        newBlock = {
          id,
          type: "image_text",
          image: PROJECT_IMAGES[0].url,
          imageAlt: "Foto ilustrativa da ação",
          imagePosition: "left",
          kicker: "Acolhimento e cuidado",
          title: "Atenção humanizada e suporte diário",
          text: "Descreva em detalhes o trabalho desenvolvido pelos voluntários, o atendimento às famílias e as necessidades atendidas.",
          bullets: [
            "Atendimento acolhedor e humanizado",
            "Acompanhamento comunitário próximo",
          ],
          buttonText: "Participar como voluntário",
          buttonLink: "/voluntariado",
        };
        break;
      case "text":
        newBlock = {
          id,
          type: "text",
          kicker: "Contexto comunitário",
          title: "Histórico e realidade local",
          content:
            "Escreva aqui o texto explicativo sobre esta missão comunitária. Você pode usar subtítulos (##), listas e formatação em Markdown.",
        };
        break;
      case "gallery":
        newBlock = {
          id,
          type: "gallery",
          kicker: "Registros e memórias",
          title: "Momentos da missão",
          description:
            "Registros fotográficos compartilhados que documentam as vivências e atividades com a comunidade.",
          columns: 3,
          items: [
            {
              id: `gal-1-${Date.now()}`,
              image: PROJECT_IMAGES[0].url,
              alt: "Atividade com crianças",
              title: "Encontro comunitário",
              subtitle: "Momento de convivência",
            },
            {
              id: `gal-2-${Date.now()}`,
              image: PROJECT_IMAGES[1]?.url || PROJECT_IMAGES[0].url,
              alt: "Equipe de apoio",
              title: "Apoio e dedicação",
              subtitle: "Presença dos voluntários",
            },
          ],
        };
        break;
      case "cards":
        newBlock = {
          id,
          type: "cards",
          kicker: "Eixos de ação",
          title: "Como atuamos na comunidade",
          columns: 4,
          items: [
            {
              id: `c-1-${Date.now()}`,
              icon: "fa-utensils",
              title: "Alimentação",
              description: "Apoio alimentar e refeições preparadas com cuidado.",
            },
            {
              id: `c-2-${Date.now()}`,
              icon: "fa-hands-holding-child",
              title: "Acolhimento",
              description: "Espaço seguro de convivência e proteção social.",
            },
          ],
        };
        break;
      case "stats":
        newBlock = {
          id,
          type: "stats",
          kicker: "Impacto social",
          title: "Alcance das ações",
          items: [
            {
              id: `s-1-${Date.now()}`,
              number: "50+",
              label: "Crianças acolhidas",
              description: "atendimento regular",
            },
            {
              id: `s-2-${Date.now()}`,
              number: "100%",
              label: "Amor e dedicação",
              description: "construído com você",
            },
          ],
        };
        break;
      case "quote":
        newBlock = {
          id,
          type: "quote",
          variant: "note",
          quote:
            "Cada ação comunitária é desenvolvida com base no respeito às necessidades reais dos moradores locais.",
          source: "Equipe Amor em Ação",
        };
        break;
      case "cta":
        newBlock = {
          id,
          type: "cta",
          kicker: "Faça a diferença",
          title: "Sua ajuda fortalece essa missão",
          description:
            "Com seu apoio, levamos dignidade, alimentação e presença para quem mais precisa.",
          buttonText: "Fazer uma doação",
          buttonLink: "#doar",
          secondaryButtonText: "Ser voluntário",
          secondaryButtonLink: "/voluntariado",
        };
        break;
      case "contact":
        newBlock = {
          id,
          type: "contact",
          kicker: "Informações e contato",
          title: "Onde nos encontrar",
          description:
            "Entre em contato previamente para esclarecer dúvidas sobre visitas, doações de mantimentos ou parcerias.",
          address: "Duque de Caxias — Rio de Janeiro",
          instagram: "https://www.instagram.com/ahamoremacao/",
          links: [
            {
              id: `lk-1-${Date.now()}`,
              label: "Instagram Oficial",
              url: "https://www.instagram.com/ahamoremacao/",
              style: "primary",
            },
          ],
        };
        break;
      default:
        return;
    }

    setBlocks((prev) => [...prev, newBlock]);
    setExpandedBlockId(id);
  }

  function handleMoveBlock(index: number, direction: "up" | "down") {
    setBlocks((prev) => {
      const copy = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return prev;
      const [item] = copy.splice(index, 1);
      copy.splice(targetIndex, 0, item);
      return copy;
    });
  }

  function handleRemoveBlock(id: string) {
    if (!window.confirm("Deseja remover este bloco da página?")) return;
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (expandedBlockId === id) setExpandedBlockId(null);
  }

  function updateBlock(id: string, updated: Partial<ActionPageBlock>) {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? ({ ...b, ...updated } as ActionPageBlock) : b))
    );
  }

  async function handleSave(asDraft = false) {
    if (!title.trim()) {
      setFeedback({ type: "error", text: "Informe o título da missão." });
      return;
    }
    const finalSlug = (slug.trim() || slugify(title)).trim();
    if (!finalSlug) {
      setFeedback({ type: "error", text: "Informe um slug válido." });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const payload: Partial<ActionMission> = {
        id: editingId || undefined,
        slug: finalSlug,
        title: title.trim(),
        navSubtitle:
          navSubtitle.trim() ||
          kicker.trim() ||
          "Ação Comunitária Amor em Ação",
        kicker: kicker.trim() || "Ação Comunitária",
        description: description.trim(),
        coverImage,
        coverImageAlt: coverImageAlt.trim() || title.trim(),
        status: asDraft ? "draft" : status,
        featuredInNav,
        seoTitle: seoTitle.trim() || `${title.trim()} | Amor em Ação`,
        seoDescription: seoDescription.trim() || description.trim(),
        blocks,
      };

      const res = await fetch("/api/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Não foi possível salvar a missão.");
      }

      if (data.action) {
        setEditingId(data.action.id);
        setSlug(data.action.slug);
      }

      setFeedback({
        type: "success",
        text: asDraft
          ? "Rascunho da missão salvo com sucesso!"
          : "Página da missão publicada com sucesso!",
      });

      await onRefresh();
    } catch (err) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Erro ao salvar missão.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAction(id: string, actionTitle: string) {
    if (
      !window.confirm(
        `Tem certeza que deseja remover permanentemente a missão "${actionTitle}"?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/actions?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (editingId === id) resetForm();
        await onRefresh();
      }
    } catch {
      // Ignore error and retain current state
    }
  }

  const filteredActions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return actions;
    return actions.filter((a) =>
      [a.title, a.slug, a.navSubtitle, a.kicker, a.description]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [actions, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Barra Superior */}
      <div className="soft-card p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 grid place-items-center font-extrabold text-lg">
            <i
              className={`fa-solid ${
                editingId ? "fa-pen-to-square" : "fa-compass"
              }`}
            />
          </span>
          <div>
            <h2 className="display font-extrabold text-lg text-stone-900">
              {editingId
                ? `Editando Missão: ${title || editingId}`
                : "Construtor de Páginas de Missões / Ações"}
            </h2>
            <p className="text-xs text-stone-500">
              Crie páginas isoladas com o layout nativo do projeto (como um
              Elementor simples em blocos modulares).
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
              Criar Nova Missão em Branco
            </button>
          )}

          <div className="flex rounded-xl bg-stone-100 p-1 border border-stone-200">
            <button
              type="button"
              onClick={() => setActiveView("builder")}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                activeView === "builder"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <i className="fa-solid fa-cubes mr-1" />
              Construtor ({blocks.length} blocos)
            </button>
            <button
              type="button"
              onClick={() => setActiveView("preview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                activeView === "preview"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <i className="fa-solid fa-eye mr-1" />
              Pré-visualização
            </button>
          </div>
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

      {/* Visão de Pré-visualização ao Vivo */}
      {activeView === "preview" ? (
        <div className="soft-card p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div>
              <span className="section-kicker">Prévia em Tempo Real</span>
              <h3 className="display text-xl font-extrabold text-stone-900">
                Página da Missão: {title || "Sem título"}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveView("builder")}
              className="gradient-brand text-white text-xs font-extrabold px-4 py-2 rounded-xl"
            >
              Voltar ao Construtor de Blocos
            </button>
          </div>

          <div className="border border-stone-200 rounded-3xl overflow-hidden bg-[#fffaf5] p-2 sm:p-4">
            <ActionBlockRenderer blocks={blocks} />
          </div>
        </div>
      ) : (
        /* Visão do Construtor */
        <div className="grid lg:grid-cols-[1fr_22rem] gap-8 items-start">
          {/* Coluna Esquerda: Blocos Modulares (O "Elementor" Simples) */}
          <div className="space-y-6">
            {/* Bloco 1: Metadados da Missão */}
            <div className="soft-card p-6 sm:p-8 space-y-5">
              <div>
                <span className="section-kicker">1. Configuração Geral</span>
                <h3 className="display text-2xl font-extrabold text-stone-900 mt-1">
                  Identificação da Missão &amp; Dropdown
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
                    Título da Missão *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!editingId) {
                        setSlug(slugify(e.target.value));
                      }
                    }}
                    placeholder="Ex: Casa Amarela, Ações no Nordeste..."
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 font-bold focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
                    Slug da URL (/acoes/...) *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(slugify(e.target.value))}
                    placeholder="ex: casa-amarela"
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 font-mono focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Destaque: Subtítulo no Dropdown "Nossas Ações" */}
              <div className="rounded-2xl bg-orange-50/80 border-2 border-orange-200 p-4">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-orange-950 mb-1">
                  <i className="fa-solid fa-list-check mr-1.5 text-orange-600" />
                  Subtítulo exibido no Dropdown &quot;Nossas ações&quot; *
                </label>
                <p className="text-xs text-orange-900 mb-2 leading-relaxed">
                  Este é o texto secundário que aparece diretamente abaixo do
                  título no menu superior (ex: &quot;Acolhimento em Jardim
                  Gramacho&quot;, &quot;Água e educação no Malawi&quot;).
                </p>
                <input
                  type="text"
                  value={navSubtitle}
                  onChange={(e) => setNavSubtitle(e.target.value)}
                  placeholder="Ex: Acolhimento em Jardim Gramacho"
                  className="w-full rounded-xl border border-orange-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 font-medium focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
                    Kicker / Tag Superior
                  </label>
                  <input
                    type="text"
                    value={kicker}
                    onChange={(e) => setKicker(e.target.value)}
                    placeholder="Ex: Ação Comunitária · Jardim Gramacho"
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
                    Status da Página
                  </label>
                  <select
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as "published" | "draft")
                    }
                    className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 font-bold focus:border-orange-500 focus:outline-none"
                  >
                    <option value="published">
                      🟢 Publicada (Visível no site e no dropdown)
                    </option>
                    <option value="draft">
                      🟡 Rascunho (Apenas no painel)
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
                  Descrição Resumida (Card e SEO)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Resumo da missão exibido nos cards da home e da página de ações..."
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:border-orange-500 focus:outline-none"
                />
              </div>

              {/* Imagem de Capa */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
                  Imagem de Capa (Galeria do Projeto ou URL)
                </label>
                <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                  {PROJECT_IMAGES.map((img) => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => {
                        setCoverImage(img.url);
                        if (!coverImageAlt) setCoverImageAlt(img.defaultAlt);
                      }}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                        coverImage === img.url
                          ? "border-orange-500 ring-2 ring-orange-400"
                          : "border-stone-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.label}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="URL da imagem de capa..."
                  className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-mono text-stone-900 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Bloco 2: Lista de Blocos Modulares (O Elementor) */}
            <div className="soft-card p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="section-kicker">2. Construtor Visual</span>
                  <h3 className="display text-2xl font-extrabold text-stone-900 mt-1">
                    Blocos da Página ({blocks.length})
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Adicione, reordene e customize os blocos que compõem a
                    página desta missão.
                  </p>
                </div>
              </div>

              {/* Lista dos Blocos com Accordion */}
              <div className="space-y-4">
                {blocks.map((block, index) => {
                  const isExpanded = expandedBlockId === block.id;

                  const blockTypeLabel: Record<ActionBlockType, string> = {
                    hero: "Hero Principal",
                    image_text: "Imagem + Texto",
                    text: "Texto & Conteúdo",
                    gallery: "Galeria de Fotos",
                    cards: "Grade de Cards",
                    stats: "Estatísticas / Métricas",
                    quote: "Destaque / Citação",
                    cta: "Chamada para Ação (CTA)",
                    contact: "Localização & Fontes",
                  };

                  return (
                    <div
                      key={block.id}
                      className="border border-stone-200 rounded-2xl bg-white overflow-hidden shadow-sm transition"
                    >
                      {/* Cabeçalho do Bloco */}
                      <div className="p-4 bg-stone-50/70 border-b border-stone-100 flex items-center justify-between gap-3">
                        <div
                          className="flex items-center gap-3 cursor-pointer flex-grow"
                          onClick={() =>
                            setExpandedBlockId(isExpanded ? null : block.id)
                          }
                        >
                          <span className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 text-xs font-extrabold grid place-items-center">
                            {index + 1}
                          </span>
                          <div>
                            <strong className="block text-sm font-extrabold text-stone-900">
                              {blockTypeLabel[block.type]}
                            </strong>
                            <span className="text-xs text-stone-500">
                              {"title" in block ? block.title : block.type}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveBlock(index, "up")}
                            title="Mover para cima"
                            className="w-8 h-8 rounded-lg bg-white border border-stone-200 text-stone-700 disabled:opacity-30 hover:bg-stone-100 grid place-items-center text-xs"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={index === blocks.length - 1}
                            onClick={() => handleMoveBlock(index, "down")}
                            title="Mover para baixo"
                            className="w-8 h-8 rounded-lg bg-white border border-stone-200 text-stone-700 disabled:opacity-30 hover:bg-stone-100 grid place-items-center text-xs"
                          >
                            ▼
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedBlockId(isExpanded ? null : block.id)
                            }
                            className="w-8 h-8 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 grid place-items-center text-xs"
                          >
                            <i
                              className={`fa-solid ${
                                isExpanded ? "fa-chevron-up" : "fa-chevron-down"
                              }`}
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveBlock(block.id)}
                            title="Excluir bloco"
                            className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 grid place-items-center text-xs"
                          >
                            <i className="fa-solid fa-trash-can" />
                          </button>
                        </div>
                      </div>

                      {/* Corpo do Bloco Expandido */}
                      {isExpanded && (
                        <div className="p-5 space-y-4 bg-white">
                          {/* HERO */}
                          {block.type === "hero" && (
                            <div className="space-y-4">
                              <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Kicker
                                  </label>
                                  <input
                                    type="text"
                                    value={block.kicker}
                                    onChange={(e) =>
                                      updateBlock(block.id, {
                                        kicker: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Título do Hero
                                  </label>
                                  <input
                                    type="text"
                                    value={block.title}
                                    onChange={(e) =>
                                      updateBlock(block.id, {
                                        title: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-xl border border-stone-300 p-2 text-xs font-bold"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1">
                                  Subtítulo
                                </label>
                                <textarea
                                  rows={2}
                                  value={block.subtitle}
                                  onChange={(e) =>
                                    updateBlock(block.id, {
                                      subtitle: e.target.value,
                                    })
                                  }
                                  className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                                />
                              </div>
                              <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Botão Principal (Texto e Link)
                                  </label>
                                  <div className="grid grid-cols-2 gap-2">
                                    <input
                                      type="text"
                                      placeholder="Texto"
                                      value={block.primaryButtonText || ""}
                                      onChange={(e) =>
                                        updateBlock(block.id, {
                                          primaryButtonText: e.target.value,
                                        })
                                      }
                                      className="rounded-xl border border-stone-300 p-2 text-xs"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Link (/voluntariado)"
                                      value={block.primaryButtonLink || ""}
                                      onChange={(e) =>
                                        updateBlock(block.id, {
                                          primaryButtonLink: e.target.value,
                                        })
                                      }
                                      className="rounded-xl border border-stone-300 p-2 text-xs"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Botão Secundário (Texto e Link)
                                  </label>
                                  <div className="grid grid-cols-2 gap-2">
                                    <input
                                      type="text"
                                      placeholder="Texto"
                                      value={block.secondaryButtonText || ""}
                                      onChange={(e) =>
                                        updateBlock(block.id, {
                                          secondaryButtonText: e.target.value,
                                        })
                                      }
                                      className="rounded-xl border border-stone-300 p-2 text-xs"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Link (/contato)"
                                      value={block.secondaryButtonLink || ""}
                                      onChange={(e) =>
                                        updateBlock(block.id, {
                                          secondaryButtonLink: e.target.value,
                                        })
                                      }
                                      className="rounded-xl border border-stone-300 p-2 text-xs"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* IMAGEM + TEXTO */}
                          {block.type === "image_text" && (
                            <div className="space-y-4">
                              <div className="grid sm:grid-cols-3 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Posição da Imagem
                                  </label>
                                  <select
                                    value={block.imagePosition}
                                    onChange={(e) =>
                                      updateBlock(block.id, {
                                        imagePosition: e.target.value as
                                          | "left"
                                          | "right",
                                      })
                                    }
                                    className="w-full rounded-xl border border-stone-300 p-2 text-xs font-bold"
                                  >
                                    <option value="left">Esquerda</option>
                                    <option value="right">Direita</option>
                                  </select>
                                </div>
                                <div className="sm:col-span-2">
                                  <label className="block text-xs font-bold text-stone-700 mb-1">
                                    URL da Imagem
                                  </label>
                                  <input
                                    type="text"
                                    value={block.image}
                                    onChange={(e) =>
                                      updateBlock(block.id, {
                                        image: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-xl border border-stone-300 p-2 text-xs font-mono"
                                  />
                                </div>
                              </div>
                              <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Kicker
                                  </label>
                                  <input
                                    type="text"
                                    value={block.kicker || ""}
                                    onChange={(e) =>
                                      updateBlock(block.id, {
                                        kicker: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Título da Seção
                                  </label>
                                  <input
                                    type="text"
                                    value={block.title}
                                    onChange={(e) =>
                                      updateBlock(block.id, {
                                        title: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-xl border border-stone-300 p-2 text-xs font-bold"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1">
                                  Texto / Parágrafos
                                </label>
                                <textarea
                                  rows={4}
                                  value={block.text}
                                  onChange={(e) =>
                                    updateBlock(block.id, {
                                      text: e.target.value,
                                    })
                                  }
                                  className="w-full rounded-xl border border-stone-300 p-2 text-xs leading-relaxed"
                                />
                              </div>
                            </div>
                          )}

                          {/* TEXTO / CONTEÚDO */}
                          {block.type === "text" && (
                            <div className="space-y-4">
                              <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Kicker
                                  </label>
                                  <input
                                    type="text"
                                    value={block.kicker || ""}
                                    onChange={(e) =>
                                      updateBlock(block.id, {
                                        kicker: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Título
                                  </label>
                                  <input
                                    type="text"
                                    value={block.title || ""}
                                    onChange={(e) =>
                                      updateBlock(block.id, {
                                        title: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-xl border border-stone-300 p-2 text-xs font-bold"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1">
                                  Conteúdo (Markdown)
                                </label>
                                <textarea
                                  rows={6}
                                  value={block.content}
                                  onChange={(e) =>
                                    updateBlock(block.id, {
                                      content: e.target.value,
                                    })
                                  }
                                  className="w-full rounded-xl border border-stone-300 p-2.5 text-xs font-mono"
                                />
                              </div>
                            </div>
                          )}

                          {/* GALERIA */}
                          {block.type === "gallery" && (
                            <div className="space-y-4">
                              <div className="grid sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-2">
                                  <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Título da Galeria
                                  </label>
                                  <input
                                    type="text"
                                    value={block.title}
                                    onChange={(e) =>
                                      updateBlock(block.id, {
                                        title: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-xl border border-stone-300 p-2 text-xs font-bold"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Colunas
                                  </label>
                                  <select
                                    value={block.columns || 3}
                                    onChange={(e) =>
                                      updateBlock(block.id, {
                                        columns: Number(e.target.value) as
                                          | 2
                                          | 3
                                          | 4,
                                      })
                                    }
                                    className="w-full rounded-xl border border-stone-300 p-2 text-xs font-bold"
                                  >
                                    <option value={2}>2 Colunas</option>
                                    <option value={3}>3 Colunas</option>
                                    <option value={4}>4 Colunas</option>
                                  </select>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className="text-xs font-bold text-stone-700">
                                    Fotos na Galeria ({block.items.length})
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newItem: GalleryItemData = {
                                        id: `gal-${Date.now()}`,
                                        image: PROJECT_IMAGES[0].url,
                                        alt: "Nova fotografia",
                                        title: "Título da foto",
                                        subtitle: "Legenda / data",
                                      };
                                      updateBlock(block.id, {
                                        items: [...block.items, newItem],
                                      });
                                    }}
                                    className="text-xs font-extrabold text-orange-700 hover:text-orange-800"
                                  >
                                    + Adicionar Foto
                                  </button>
                                </div>

                                <div className="space-y-2">
                                  {block.items.map((item, idx) => (
                                    <div
                                      key={item.id}
                                      className="p-3 bg-stone-50 rounded-xl border border-stone-200 grid sm:grid-cols-4 gap-2 items-center"
                                    >
                                      <input
                                        type="text"
                                        placeholder="URL da Imagem"
                                        value={item.image}
                                        onChange={(e) => {
                                          const copy = [...block.items];
                                          copy[idx].image = e.target.value;
                                          updateBlock(block.id, {
                                            items: copy,
                                          });
                                        }}
                                        className="rounded-lg border border-stone-300 p-1.5 text-xs font-mono"
                                      />
                                      <input
                                        type="text"
                                        placeholder="Título da foto"
                                        value={item.title}
                                        onChange={(e) => {
                                          const copy = [...block.items];
                                          copy[idx].title = e.target.value;
                                          updateBlock(block.id, {
                                            items: copy,
                                          });
                                        }}
                                        className="rounded-lg border border-stone-300 p-1.5 text-xs font-bold"
                                      />
                                      <input
                                        type="text"
                                        placeholder="Legenda / Data"
                                        value={item.subtitle || ""}
                                        onChange={(e) => {
                                          const copy = [...block.items];
                                          copy[idx].subtitle = e.target.value;
                                          updateBlock(block.id, {
                                            items: copy,
                                          });
                                        }}
                                        className="rounded-lg border border-stone-300 p-1.5 text-xs"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const copy = block.items.filter(
                                            (_, i) => i !== idx
                                          );
                                          updateBlock(block.id, {
                                            items: copy,
                                          });
                                        }}
                                        className="text-xs text-red-600 font-bold hover:underline"
                                      >
                                        Remover
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* CARDS COM ÍCONES */}
                          {block.type === "cards" && (
                            <div className="space-y-4">
                              <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Título da Seção
                                  </label>
                                  <input
                                    type="text"
                                    value={block.title || ""}
                                    onChange={(e) =>
                                      updateBlock(block.id, {
                                        title: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-xl border border-stone-300 p-2 text-xs font-bold"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Colunas
                                  </label>
                                  <select
                                    value={block.columns || 4}
                                    onChange={(e) =>
                                      updateBlock(block.id, {
                                        columns: Number(e.target.value) as
                                          | 2
                                          | 3
                                          | 4,
                                      })
                                    }
                                    className="w-full rounded-xl border border-stone-300 p-2 text-xs font-bold"
                                  >
                                    <option value={2}>2 Colunas</option>
                                    <option value={3}>3 Colunas</option>
                                    <option value={4}>4 Colunas</option>
                                  </select>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className="text-xs font-bold text-stone-700">
                                    Cards de Pilares ({block.items.length})
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newCard: CardItemData = {
                                        id: `c-${Date.now()}`,
                                        icon: "fa-heart",
                                        title: "Novo Pilar",
                                        description:
                                          "Descrição breve deste eixo de trabalho comunitário.",
                                      };
                                      updateBlock(block.id, {
                                        items: [...block.items, newCard],
                                      });
                                    }}
                                    className="text-xs font-extrabold text-orange-700 hover:text-orange-800"
                                  >
                                    + Adicionar Card
                                  </button>
                                </div>

                                <div className="space-y-2">
                                  {block.items.map((card, idx) => (
                                    <div
                                      key={card.id}
                                      className="p-3 bg-stone-50 rounded-xl border border-stone-200 grid sm:grid-cols-4 gap-2 items-center"
                                    >
                                      <select
                                        value={card.icon}
                                        onChange={(e) => {
                                          const copy = [...block.items];
                                          copy[idx].icon = e.target.value;
                                          updateBlock(block.id, {
                                            items: copy,
                                          });
                                        }}
                                        className="rounded-lg border border-stone-300 p-1.5 text-xs font-bold"
                                      >
                                        {COMMON_ICONS.map((ic) => (
                                          <option key={ic.icon} value={ic.icon}>
                                            {ic.label} ({ic.icon})
                                          </option>
                                        ))}
                                      </select>
                                      <input
                                        type="text"
                                        placeholder="Título"
                                        value={card.title}
                                        onChange={(e) => {
                                          const copy = [...block.items];
                                          copy[idx].title = e.target.value;
                                          updateBlock(block.id, {
                                            items: copy,
                                          });
                                        }}
                                        className="rounded-lg border border-stone-300 p-1.5 text-xs font-bold"
                                      />
                                      <input
                                        type="text"
                                        placeholder="Descrição"
                                        value={card.description}
                                        onChange={(e) => {
                                          const copy = [...block.items];
                                          copy[idx].description =
                                            e.target.value;
                                          updateBlock(block.id, {
                                            items: copy,
                                          });
                                        }}
                                        className="rounded-lg border border-stone-300 p-1.5 text-xs"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const copy = block.items.filter(
                                            (_, i) => i !== idx
                                          );
                                          updateBlock(block.id, {
                                            items: copy,
                                          });
                                        }}
                                        className="text-xs text-red-600 font-bold hover:underline"
                                      >
                                        Remover
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* CTA */}
                          {block.type === "cta" && (
                            <div className="space-y-4">
                              <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Título Chamativo
                                  </label>
                                  <input
                                    type="text"
                                    value={block.title}
                                    onChange={(e) =>
                                      updateBlock(block.id, {
                                        title: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-xl border border-stone-300 p-2 text-xs font-bold"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Kicker
                                  </label>
                                  <input
                                    type="text"
                                    value={block.kicker || ""}
                                    onChange={(e) =>
                                      updateBlock(block.id, {
                                        kicker: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1">
                                  Texto Descritivo
                                </label>
                                <textarea
                                  rows={2}
                                  value={block.description}
                                  onChange={(e) =>
                                    updateBlock(block.id, {
                                      description: e.target.value,
                                    })
                                  }
                                  className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                                />
                              </div>
                              <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Botão Principal (Texto e Link)
                                  </label>
                                  <div className="grid grid-cols-2 gap-2">
                                    <input
                                      type="text"
                                      placeholder="Texto"
                                      value={block.buttonText}
                                      onChange={(e) =>
                                        updateBlock(block.id, {
                                          buttonText: e.target.value,
                                        })
                                      }
                                      className="rounded-xl border border-stone-300 p-2 text-xs"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Link (#doar)"
                                      value={block.buttonLink}
                                      onChange={(e) =>
                                        updateBlock(block.id, {
                                          buttonLink: e.target.value,
                                        })
                                      }
                                      className="rounded-xl border border-stone-300 p-2 text-xs"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Botão Secundário
                                  </label>
                                  <div className="grid grid-cols-2 gap-2">
                                    <input
                                      type="text"
                                      placeholder="Texto"
                                      value={block.secondaryButtonText || ""}
                                      onChange={(e) =>
                                        updateBlock(block.id, {
                                          secondaryButtonText: e.target.value,
                                        })
                                      }
                                      className="rounded-xl border border-stone-300 p-2 text-xs"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Link (/voluntariado)"
                                      value={block.secondaryButtonLink || ""}
                                      onChange={(e) =>
                                        updateBlock(block.id, {
                                          secondaryButtonLink: e.target.value,
                                        })
                                      }
                                      className="rounded-xl border border-stone-300 p-2 text-xs"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* OUTROS BLOCOS: Citação, Estatísticas, Contato */}
                          {block.type === "quote" && (
                            <div className="space-y-3">
                              <div className="grid sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Estilo
                                  </label>
                                  <select
                                    value={block.variant}
                                    onChange={(e) =>
                                      updateBlock(block.id, {
                                        variant: e.target.value as
                                          | "note"
                                          | "quote",
                                      })
                                    }
                                    className="w-full rounded-xl border border-stone-300 p-2 text-xs font-bold"
                                  >
                                    <option value="note">
                                      Nota de Apuração (Alerta Amarelo)
                                    </option>
                                    <option value="quote">
                                      Citação em Destaque (Itálico Grande)
                                    </option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Fonte / Autor
                                  </label>
                                  <input
                                    type="text"
                                    value={block.source || ""}
                                    onChange={(e) =>
                                      updateBlock(block.id, {
                                        source: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1">
                                  Texto da Citação
                                </label>
                                <textarea
                                  rows={3}
                                  value={block.quote}
                                  onChange={(e) =>
                                    updateBlock(block.id, {
                                      quote: e.target.value,
                                    })
                                  }
                                  className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                                />
                              </div>
                            </div>
                          )}

                          {block.type === "stats" && (
                            <div className="space-y-3">
                              <label className="block text-xs font-bold text-stone-700">
                                Métricas Numéricas
                              </label>
                              <div className="space-y-2">
                                {block.items.map((stat, idx) => (
                                  <div
                                    key={stat.id}
                                    className="p-2.5 bg-stone-50 rounded-xl grid sm:grid-cols-3 gap-2 items-center"
                                  >
                                    <input
                                      type="text"
                                      placeholder="Número (50+)"
                                      value={stat.number}
                                      onChange={(e) => {
                                        const copy = [...block.items];
                                        copy[idx].number = e.target.value;
                                        updateBlock(block.id, { items: copy });
                                      }}
                                      className="rounded-lg border border-stone-300 p-1.5 text-xs font-extrabold"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Rótulo (Crianças)"
                                      value={stat.label}
                                      onChange={(e) => {
                                        const copy = [...block.items];
                                        copy[idx].label = e.target.value;
                                        updateBlock(block.id, { items: copy });
                                      }}
                                      className="rounded-lg border border-stone-300 p-1.5 text-xs font-bold"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Detalhe (por mês)"
                                      value={stat.description || ""}
                                      onChange={(e) => {
                                        const copy = [...block.items];
                                        copy[idx].description = e.target.value;
                                        updateBlock(block.id, { items: copy });
                                      }}
                                      className="rounded-lg border border-stone-300 p-1.5 text-xs"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {block.type === "contact" && (
                            <div className="space-y-3">
                              <div className="grid sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Título
                                  </label>
                                  <input
                                    type="text"
                                    value={block.title}
                                    onChange={(e) =>
                                      updateBlock(block.id, {
                                        title: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-xl border border-stone-300 p-2 text-xs font-bold"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-stone-700 mb-1">
                                    Instagram
                                  </label>
                                  <input
                                    type="text"
                                    value={block.instagram || ""}
                                    onChange={(e) =>
                                      updateBlock(block.id, {
                                        instagram: e.target.value,
                                      })
                                    }
                                    className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-stone-700 mb-1">
                                  Endereço
                                </label>
                                <input
                                  type="text"
                                  value={block.address || ""}
                                  onChange={(e) =>
                                    updateBlock(block.id, {
                                      address: e.target.value,
                                    })
                                  }
                                  className="w-full rounded-xl border border-stone-300 p-2 text-xs"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Botões para Adicionar Novo Bloco (Inspirado no Elementor) */}
              <div className="border-t border-stone-200 pt-6">
                <span className="block text-xs font-extrabold uppercase tracking-wider text-stone-600 mb-3">
                  + Adicionar Bloco à Página
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleAddBlock("image_text")}
                    className="p-3 rounded-xl border border-stone-200 bg-white hover:border-orange-300 hover:bg-orange-50 text-left transition cursor-pointer"
                  >
                    <i className="fa-solid fa-image text-orange-600 mr-1.5" />
                    <strong className="block text-xs text-stone-900 mt-1">
                      Imagem + Texto
                    </strong>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddBlock("gallery")}
                    className="p-3 rounded-xl border border-stone-200 bg-white hover:border-orange-300 hover:bg-orange-50 text-left transition cursor-pointer"
                  >
                    <i className="fa-solid fa-camera text-orange-600 mr-1.5" />
                    <strong className="block text-xs text-stone-900 mt-1">
                      Galeria de Fotos
                    </strong>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddBlock("cards")}
                    className="p-3 rounded-xl border border-stone-200 bg-white hover:border-orange-300 hover:bg-orange-50 text-left transition cursor-pointer"
                  >
                    <i className="fa-solid fa-cubes text-orange-600 mr-1.5" />
                    <strong className="block text-xs text-stone-900 mt-1">
                      Cards com Ícones
                    </strong>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddBlock("text")}
                    className="p-3 rounded-xl border border-stone-200 bg-white hover:border-orange-300 hover:bg-orange-50 text-left transition cursor-pointer"
                  >
                    <i className="fa-solid fa-paragraph text-orange-600 mr-1.5" />
                    <strong className="block text-xs text-stone-900 mt-1">
                      Texto / Markdown
                    </strong>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddBlock("cta")}
                    className="p-3 rounded-xl border border-stone-200 bg-white hover:border-orange-300 hover:bg-orange-50 text-left transition cursor-pointer"
                  >
                    <i className="fa-solid fa-bullhorn text-orange-600 mr-1.5" />
                    <strong className="block text-xs text-stone-900 mt-1">
                      Chamada CTA
                    </strong>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddBlock("stats")}
                    className="p-3 rounded-xl border border-stone-200 bg-white hover:border-orange-300 hover:bg-orange-50 text-left transition cursor-pointer"
                  >
                    <i className="fa-solid fa-chart-simple text-orange-600 mr-1.5" />
                    <strong className="block text-xs text-stone-900 mt-1">
                      Estatísticas
                    </strong>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddBlock("quote")}
                    className="p-3 rounded-xl border border-stone-200 bg-white hover:border-orange-300 hover:bg-orange-50 text-left transition cursor-pointer"
                  >
                    <i className="fa-solid fa-quote-left text-orange-600 mr-1.5" />
                    <strong className="block text-xs text-stone-900 mt-1">
                      Nota / Citação
                    </strong>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddBlock("contact")}
                    className="p-3 rounded-xl border border-stone-200 bg-white hover:border-orange-300 hover:bg-orange-50 text-left transition cursor-pointer"
                  >
                    <i className="fa-solid fa-location-dot text-orange-600 mr-1.5" />
                    <strong className="block text-xs text-stone-900 mt-1">
                      Localização / Fontes
                    </strong>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Publicação & Lista de Missões Existentes */}
          <div className="space-y-6">
            {/* Caixa de Publicação */}
            <div className="soft-card p-6 space-y-4">
              <span className="section-kicker">Ações</span>
              <h4 className="display text-lg font-extrabold text-stone-900">
                Publicar Página
              </h4>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured-nav-check"
                  checked={featuredInNav}
                  onChange={(e) => setFeaturedInNav(e.target.checked)}
                  className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4 cursor-pointer"
                />
                <label
                  htmlFor="featured-nav-check"
                  className="text-xs font-bold text-stone-800 cursor-pointer"
                >
                  Exibir no rodízio do dropdown &quot;Nossas ações&quot;
                </label>
              </div>

              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSave(false)}
                  className="w-full gradient-brand text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-md hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <i className="fa-solid fa-circle-notch fa-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-cloud-arrow-up" />
                      {editingId ? "Atualizar Missão" : "Publicar Missão"}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSave(true)}
                  className="w-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs py-2.5 px-4 rounded-xl transition cursor-pointer"
                >
                  Salvar como Rascunho
                </button>

                {editingId && (
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <Link
                      href={`/acoes/${slug}`}
                      target="_blank"
                      className="text-xs font-bold text-orange-700 hover:underline"
                    >
                      Ver página pública &rarr;
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDeleteAction(editingId, title)}
                      className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                    >
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Lista de Missões Existentes */}
            <div className="soft-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="section-kicker">Acervo</span>
                  <h4 className="display text-base font-extrabold text-stone-900">
                    Missões ({actions.length})
                  </h4>
                </div>
                <span className="text-[11px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                  {storage === "supabase" ? "Supabase" : "Local"}
                </span>
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar missão..."
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs focus:border-orange-500 focus:outline-none"
              />

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {filteredActions.map((action, idx) => {
                  const isCurrent = editingId === action.id;
                  const isTop3 = idx < 3;

                  return (
                    <div
                      key={action.id}
                      onClick={() => loadAction(action)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition flex items-center justify-between gap-2.5 ${
                        isCurrent
                          ? "bg-orange-50 border-orange-300 ring-2 ring-orange-200"
                          : "bg-white border-stone-200 hover:border-orange-200"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-1.5">
                          <strong className="text-xs font-extrabold text-stone-900 truncate block">
                            {action.title}
                          </strong>
                          {isTop3 && (
                            <span className="text-[10px] bg-orange-100 text-orange-800 font-extrabold px-1.5 py-0.2 rounded shrink-0">
                              Menu
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-stone-500 truncate block">
                          {action.navSubtitle || action.slug}
                        </span>
                      </div>
                      <i className="fa-solid fa-chevron-right text-stone-400 text-xs shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
