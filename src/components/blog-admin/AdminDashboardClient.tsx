"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ActionBlogCard } from "@/components/ActionBlogCard";
import { BlogArticleView } from "@/components/blog/BlogArticleView";
import { VisualMarkdownEditor } from "@/components/blog-admin/VisualMarkdownEditor";
import { ActionMissionBuilder } from "@/components/blog-admin/ActionMissionBuilder";
import { TransparencyManager } from "@/components/blog-admin/TransparencyManager";
import type { ActionMission } from "@/lib/action-types";
import type { TransparencyDocument } from "@/lib/transparency-types";
import {
  PROJECT_IMAGES,
  type BlogFaqItem,
  type BlogPost,
  type StagedBlogAsset,
} from "@/lib/blog-types";
import {
  PROJECT_LABELS,
  type DonationRecord,
  type DonationStatus,
} from "@/lib/donation-types";
import {
  VOLUNTEER_STATUS_LABELS,
  type VolunteerRecord,
  type VolunteerStatus,
} from "@/lib/volunteer-types";

async function fileToBase64(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = "";
  for (let i = 0; i < bytes.length; i += 8192) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  }
  return btoa(binary);
}

function slugifyClient(text: string): string {
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

function formatWhatsAppUrl(phone: string, name: string): string {
  const digits = phone.replace(/\D/g, "");
  const fullNumber = digits.startsWith("55") ? digits : `55${digits}`;
  const text = encodeURIComponent(
    `Olá, ${name}! Recebemos sua inscrição de voluntariado no site da Associação Humanitária Amor em Ação.`
  );
  return `https://wa.me/${fullNumber}?text=${text}`;
}

export function AdminDashboardClient({
  initialTab = "blog",
}: {
  initialTab?: "blog" | "actions" | "transparency" | "donations" | "volunteers";
}) {
  const searchParams = useSearchParams();
  const editParam = searchParams.get("edit");
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<
    "blog" | "actions" | "transparency" | "donations" | "volunteers"
  >(
    tabParam === "actions"
      ? "actions"
      : tabParam === "transparency"
      ? "transparency"
      : tabParam === "donations"
      ? "donations"
      : tabParam === "volunteers"
      ? "volunteers"
      : initialTab
  );

  // ==================== ADMIN AUTHENTICATION ====================
  const [authStatus, setAuthStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");
  const [adminEmail, setAdminEmail] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // ==================== BLOG STATE ====================
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [blogStorage, setBlogStorage] = useState<"supabase" | "local">("local");
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editorKey, setEditorKey] = useState(1);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [pillText, setPillText] = useState("Duque de Caxias · RJ");
  const [buttonText, setButtonText] = useState("Conhecer a iniciativa");
  const [customLink, setCustomLink] = useState("");
  const [coverMode, setCoverMode] = useState<"gallery" | "upload" | "remote">(
    "gallery"
  );
  const [coverImage, setCoverImage] = useState(PROJECT_IMAGES[0].url);
  const [coverImageAlt, setCoverImageAlt] = useState(
    PROJECT_IMAGES[0].defaultAlt
  );
  const [category, setCategory] = useState("Casa Amarela");
  const [tagsInput, setTagsInput] = useState(
    "Casa Amarela, Jardim Gramacho, Duque de Caxias, Acolhimento Infantil"
  );
  const [authorName, setAuthorName] = useState("Equipe Editorial Amor em Ação");
  const [authorRole, setAuthorRole] = useState("Comunicação Institucional");
  const [publishedDate, setPublishedDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [featured, setFeatured] = useState(true);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [content, setContent] = useState(
    "## O impacto na comunidade\n\nEscreva aqui o conteúdo completo do artigo. Digite `/` para adicionar subtítulos, listas, citações ou imagens.\n"
  );
  const [faq, setFaq] = useState<BlogFaqItem[]>([]);
  const [stagedAssets, setStagedAssets] = useState<StagedBlogAsset[]>([]);

  const [dirty, setDirty] = useState(false);
  const [showArticlePreview, setShowArticlePreview] = useState(false);
  const [savingBlog, setSavingBlog] = useState(false);
  const [blogFeedback, setBlogFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // ==================== DONATIONS STATE ====================
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [donationStorage, setDonationStorage] = useState<"supabase" | "local">(
    "local"
  );
  const [loadingDonations, setLoadingDonations] = useState(true);
  const [donationFilterStatus, setDonationFilterStatus] =
    useState<string>("all");
  const [donationSearch, setDonationSearch] = useState("");
  const [verifyingSessionId, setVerifyingSessionId] = useState<string | null>(
    null
  );
  const [donationFeedback, setDonationFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Manual donation registration state
  const [manualDonorName, setManualDonorName] = useState("");
  const [manualDonorEmail, setManualDonorEmail] = useState("");
  const [manualAmountBRL, setManualAmountBRL] = useState("");
  const [manualFrequency, setManualFrequency] = useState<"once" | "monthly">(
    "once"
  );
  const [manualProject, setManualProject] = useState("casa-amarela");
  const [manualMethod, setManualMethod] = useState<
    "pix" | "transfer" | "stripe"
  >("pix");
  const [manualStatus, setManualStatus] = useState<DonationStatus>("paid");
  const [manualNotes, setManualNotes] = useState("");
  const [savingDonation, setSavingDonation] = useState(false);

  // ==================== VOLUNTEERS STATE ====================
  const [volunteers, setVolunteers] = useState<VolunteerRecord[]>([]);
  const [volunteerStorage, setVolunteerStorage] = useState<
    "supabase" | "local"
  >("local");
  const [loadingVolunteers, setLoadingVolunteers] = useState(true);
  const [volunteerFilterStatus, setVolunteerFilterStatus] =
    useState<string>("all");
  const [volunteerSearch, setVolunteerSearch] = useState("");

  // Warn on exit with unsaved changes
  useEffect(() => {
    const warning = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warning);
    return () => window.removeEventListener("beforeunload", warning);
  }, [dirty]);

  async function fetchBlogPosts() {
    setLoadingPosts(true);
    try {
      const res = await fetch("/api/blog?drafts=1");
      const data = await res.json();
      if (Array.isArray(data.posts)) {
        setPosts(data.posts);
      }
      if (data.storage) {
        setBlogStorage(data.storage);
      }
    } catch {
      // Fallback on network or fetch error
    } finally {
      setLoadingPosts(false);
    }
  }

  async function fetchDonations() {
    setLoadingDonations(true);
    try {
      const res = await fetch("/api/donations");
      const data = await res.json();
      if (Array.isArray(data.donations)) {
        setDonations(data.donations);
      }
      if (data.storage) {
        setDonationStorage(data.storage);
      }
    } catch {
      // Fallback on network or fetch error
    } finally {
      setLoadingDonations(false);
    }
  }

  async function fetchVolunteers() {
    setLoadingVolunteers(true);
    try {
      const res = await fetch("/api/voluntariado");
      const data = await res.json();
      if (Array.isArray(data.volunteers)) {
        setVolunteers(data.volunteers);
      }
      if (data.storage) {
        setVolunteerStorage(data.storage);
      }
    } catch {
      // Fallback on network or fetch error
    } finally {
      setLoadingVolunteers(false);
    }
  }

  // ==================== MISSIONS / ACTIONS STATE ====================
  const [actionsList, setActionsList] = useState<ActionMission[]>([]);
  const [actionStorage, setActionStorage] = useState<"supabase" | "local">(
    "local"
  );
  const [loadingActions, setLoadingActions] = useState(true);

  // ==================== TRANSPARENCY STATE ====================
  const [transparencyDocs, setTransparencyDocs] = useState<
    TransparencyDocument[]
  >([]);
  const [transparencyStorage, setTransparencyStorage] = useState<
    "supabase" | "local"
  >("local");
  const [loadingTransparency, setLoadingTransparency] = useState(true);

  async function fetchActions() {
    setLoadingActions(true);
    try {
      const res = await fetch("/api/actions?drafts=1");
      const data = await res.json();
      if (Array.isArray(data.actions)) {
        setActionsList(data.actions);
      }
      if (data.storage) {
        setActionStorage(data.storage);
      }
    } catch {
      // Fallback on network or fetch error
    } finally {
      setLoadingActions(false);
    }
  }

  async function fetchTransparencyDocs() {
    setLoadingTransparency(true);
    try {
      const res = await fetch("/api/transparencia?all=1");
      const data = await res.json();
      if (Array.isArray(data.documents)) {
        setTransparencyDocs(data.documents);
      }
      if (data.storage) {
        setTransparencyStorage(data.storage);
      }
    } catch {
      // Fallback on network or fetch error
    } finally {
      setLoadingTransparency(false);
    }
  }

  async function loadAllAdminData() {
    await Promise.all([
      fetchBlogPosts(),
      fetchActions(),
      fetchTransparencyDocs(),
      fetchDonations(),
      fetchVolunteers(),
    ]);
  }

  useEffect(() => {
    let active = true;
    async function verifyAdminSession() {
      try {
        const res = await fetch("/api/admin/auth", { cache: "no-store" });
        if (!active) return;
        if (res.ok) {
          const data = await res.json();
          setAdminEmail(data.email || "Administrador");
          setAuthStatus("authenticated");
          void loadAllAdminData();
        } else {
          setAuthStatus("unauthenticated");
        }
      } catch {
        if (active) {
          setAuthStatus("unauthenticated");
        }
      }
    }
    void verifyAdminSession();
    return () => {
      active = false;
    };
  }, []);

  async function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    if (loggingIn) return;
    setLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Credenciais inválidas.");
      }
      setAdminEmail(data.email || loginEmail.trim() || "Administrador");
      setLoginPassword("");
      setAuthStatus("authenticated");
      await loadAllAdminData();
    } catch (err) {
      setLoginError(
        err instanceof Error ? err.message : "Falha ao autenticar no painel."
      );
    } finally {
      setLoggingIn(false);
    }
  }

  async function handleAdminLogout() {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
    } catch {
      // Ignore logout request error
    }
    setAuthStatus("unauthenticated");
    setAdminEmail("");
    setPosts([]);
    setActionsList([]);
    setTransparencyDocs([]);
    setDonations([]);
    setVolunteers([]);
  }

  useEffect(() => {
    if (editParam && posts.length > 0) {
      const target = posts.find(
        (p) => p.id === editParam || p.slug === editParam
      );
      if (target) {
        loadPostIntoEditor(target);
      }
    }
  }, [editParam, posts]);

  function markChanged() {
    setDirty(true);
    setBlogFeedback(null);
  }

  function resetBlogForm() {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setPillText("Duque de Caxias · RJ");
    setButtonText("Conhecer a iniciativa");
    setCustomLink("");
    setCoverMode("gallery");
    setCoverImage(PROJECT_IMAGES[0].url);
    setCoverImageAlt(PROJECT_IMAGES[0].defaultAlt);
    setCategory("Casa Amarela");
    setTagsInput("Casa Amarela, Jardim Gramacho, Duque de Caxias");
    setAuthorName("Equipe Editorial Amor em Ação");
    setAuthorRole("Comunicação Institucional");
    setPublishedDate(new Date().toISOString().slice(0, 10));
    setFeatured(true);
    setSeoTitle("");
    setSeoDescription("");
    setFocusKeyword("");
    setContent(
      "## Introdução\n\nComece com uma ideia concreta sobre a ação comunitária ou relatório de impacto.\n"
    );
    setFaq([]);
    setStagedAssets([]);
    setDirty(false);
    setShowArticlePreview(false);
    setEditorKey((k) => k + 1);
  }

  function loadPostIntoEditor(post: BlogPost) {
    setActiveTab("blog");
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setPillText(post.pillText);
    setButtonText(post.buttonText);
    setCustomLink(post.customLink || "");
    const isGallery = PROJECT_IMAGES.some((img) => img.url === post.coverImage);
    setCoverMode(
      isGallery
        ? "gallery"
        : post.coverImage.startsWith("data:")
        ? "upload"
        : "remote"
    );
    setCoverImage(post.coverImage);
    setCoverImageAlt(post.coverImageAlt);
    setCategory(post.category);
    setTagsInput(post.tags.join(", "));
    setAuthorName(post.author.name);
    setAuthorRole(post.author.role);
    setPublishedDate(post.publishedAt.slice(0, 10));
    setFeatured(post.featured);
    setSeoTitle(post.seoTitle);
    setSeoDescription(post.seoDescription);
    setFocusKeyword(post.focusKeyword);
    setContent(post.content);
    setFaq(post.faq ?? []);
    setStagedAssets([]);
    setDirty(false);
    setBlogFeedback(null);
    setEditorKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Staging inline images for Milkdown Crepe WYSIWYG editor
  async function stageInlineAsset(file: File): Promise<string> {
    if (
      !/^image\/(png|jpeg|webp|avif)$/.test(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      throw new Error("Use PNG, JPEG, WebP ou AVIF até 5 MB");
    }
    const alt = window
      .prompt("Descreva a imagem para leitores de tela e SEO (alt text):")
      ?.trim();
    if (!alt) {
      throw new Error("Texto alternativo obrigatório para acessibilidade e SEO");
    }
    const bitmap = await createImageBitmap(file);
    const width = bitmap.width;
    const height = bitmap.height;
    bitmap.close();
    const id = crypto.randomUUID().replaceAll("-", "");
    const encoded = await fileToBase64(file);
    setStagedAssets((current) => [
      ...current,
      {
        id,
        filename: file.name,
        contentType: file.type,
        base64: encoded,
        alt,
        width,
        height,
      },
    ]);
    markChanged();
    return `blog-asset://${id}`;
  }

  async function handleCoverUpload(file: File) {
    try {
      if (
        !/^image\/(png|jpeg|webp|avif)$/.test(file.type) ||
        file.size > 5 * 1024 * 1024
      ) {
        throw new Error("Use PNG, JPEG, WebP ou AVIF até 5 MB");
      }
      const encoded = await fileToBase64(file);
      setCoverImage(`data:${file.type};base64,${encoded}`);
      if (!coverImageAlt) {
        setCoverImageAlt(title || file.name.replace(/\.[^.]+$/, ""));
      }
      setCoverMode("upload");
      markChanged();
    } catch (err) {
      setBlogFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Imagem inválida",
      });
    }
  }

  const assetPreviews = useMemo(() => {
    return Object.fromEntries(
      stagedAssets.map((asset) => [
        `blog-asset://${asset.id}`,
        `data:${asset.contentType};base64,${asset.base64}`,
      ])
    );
  }, [stagedAssets]);

  const previewPost = useMemo<BlogPost>(() => {
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    const parsedTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    return {
      id: editingId || "preview-post",
      slug: slug || slugifyClient(title) || "previa-artigo",
      title:
        title ||
        "Casa Amarela em Jardim Gramacho: acolhimento e cuidado infantil",
      excerpt:
        excerpt ||
        "Iniciativa comunitária da Associação Humanitária Amor em Ação em Jardim Gramacho, com acolhimento, alimentação, higiene, convivência e atividades para crianças.",
      pillText: pillText || "Duque de Caxias · RJ",
      buttonText: buttonText || "Conhecer a iniciativa",
      customLink: customLink.trim() || undefined,
      coverImage: coverImage || PROJECT_IMAGES[0].url,
      coverImageAlt: coverImageAlt || title || "Imagem de capa do artigo",
      category: category || "Casa Amarela",
      tags: parsedTags,
      author: {
        name: authorName || "Equipe Editorial Amor em Ação",
        role: authorRole || "Comunicação Institucional",
      },
      publishedAt: publishedDate
        ? new Date(`${publishedDate}T12:00:00.000Z`).toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readingTimeMinutes,
      featured,
      seoTitle: seoTitle || `${title || "Artigo"} | Amor em Ação`,
      seoDescription: seoDescription || excerpt,
      focusKeyword: focusKeyword || title,
      content,
      faq,
    };
  }, [
    editingId,
    slug,
    title,
    excerpt,
    pillText,
    buttonText,
    customLink,
    coverImage,
    coverImageAlt,
    category,
    tagsInput,
    authorName,
    authorRole,
    publishedDate,
    featured,
    seoTitle,
    seoDescription,
    focusKeyword,
    content,
    faq,
  ]);

  async function saveArticle(asDraft: boolean) {
    if (savingBlog) return;
    setSavingBlog(true);
    setBlogFeedback(null);

    try {
      const payload = {
        id: editingId || undefined,
        title: title.trim(),
        slug: (slug.trim() || slugifyClient(title)).trim(),
        excerpt: excerpt.trim(),
        pillText: pillText.trim(),
        buttonText: buttonText.trim(),
        customLink: customLink.trim() || undefined,
        coverImage,
        coverImageAlt: coverImageAlt.trim() || title.trim(),
        category: category.trim(),
        tags: tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        authorName: authorName.trim(),
        authorRole: authorRole.trim(),
        publishedAt: publishedDate
          ? new Date(`${publishedDate}T12:00:00.000Z`).toISOString()
          : new Date().toISOString(),
        readingTimeMinutes: previewPost.readingTimeMinutes,
        featured,
        draft: asDraft,
        seoTitle: seoTitle.trim() || `${title.trim()} | Amor em Ação`,
        seoDescription: seoDescription.trim() || excerpt.trim(),
        focusKeyword: focusKeyword.trim() || title.trim(),
        content,
        faq: faq.filter((item) => item.question.trim() && item.answer.trim()),
        assets: stagedAssets,
      };

      const res = await fetch("/api/blog", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Não foi possível salvar a publicação.");
      }

      if (Array.isArray(data.posts)) {
        setPosts(data.posts);
      }
      if (data.storage) {
        setBlogStorage(data.storage);
      }
      if (data.post) {
        setEditingId(data.post.id);
        setSlug(data.post.slug);
        setContent(data.post.content);
        setStagedAssets([]);
      }
      setDirty(false);
      setBlogFeedback({
        type: "success",
        text: asDraft
          ? `Rascunho salvo com sucesso (${
              data.storage === "supabase" ? "Supabase" : "Memória Local"
            })!`
          : `Publicação salva e publicada com sucesso (${
              data.storage === "supabase" ? "Supabase" : "Memória Local"
            })!`,
      });
    } catch (err) {
      setBlogFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Erro ao salvar artigo.",
      });
    } finally {
      setSavingBlog(false);
    }
  }

  async function handleDeletePost(id: string, postTitle: string) {
    if (
      !window.confirm(
        `Tem certeza que deseja excluir a publicação "${postTitle}"?`
      )
    ) {
      return;
    }
    try {
      const res = await fetch(
        `/api/blog?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (res.ok && Array.isArray(data.posts)) {
        setPosts(data.posts);
        if (editingId === id) {
          resetBlogForm();
        }
      }
    } catch {
      // Fallback on network or fetch error
    }
  }

  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return posts;
    return posts.filter((p) =>
      [p.title, p.slug, p.pillText, p.buttonText, p.category, ...p.tags]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [posts, searchQuery]);

  // ==================== DONATIONS ACTIONS ====================
  async function handleRegisterManualDonation(e: React.FormEvent) {
    e.preventDefault();
    if (savingDonation) return;
    setSavingDonation(true);
    setDonationFeedback(null);

    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName: manualDonorName.trim() || "Apoiador Solidário",
          donorEmail: manualDonorEmail.trim() || null,
          amountBRL: Number(manualAmountBRL.replace(",", ".")),
          frequency: manualFrequency,
          project: manualProject,
          paymentMethod: manualMethod,
          status: manualStatus,
          notes: manualNotes.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao registrar doação.");
      }
      setManualDonorName("");
      setManualDonorEmail("");
      setManualAmountBRL("");
      setManualNotes("");
      setDonationFeedback({
        type: "success",
        text: "Doação registrada com sucesso no painel!",
      });
      await fetchDonations();
    } catch (err) {
      setDonationFeedback({
        type: "error",
        text:
          err instanceof Error ? err.message : "Falha ao registrar doação.",
      });
    } finally {
      setSavingDonation(false);
    }
  }

  async function handleVerifyStripeSession(stripeSessionId: string) {
    setVerifyingSessionId(stripeSessionId);
    setDonationFeedback(null);
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify_stripe",
          stripeSessionId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Não foi possível consultar a Stripe.");
      }
      setDonationFeedback({
        type: "success",
        text: `Sessão verificada na Stripe! Status do pagamento: ${data.stripePaymentStatus}.`,
      });
      await fetchDonations();
    } catch (err) {
      setDonationFeedback({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Erro ao verificar sessão na Stripe.",
      });
    } finally {
      setVerifyingSessionId(null);
    }
  }

  async function handleUpdateDonationStatus(
    id: string,
    status: DonationStatus
  ) {
    try {
      const res = await fetch("/api/donations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status,
        }),
      });
      if (res.ok) {
        await fetchDonations();
      }
    } catch {
      // Fallback on network or fetch error
    }
  }

  async function handleDeleteDonation(id: string) {
    if (!window.confirm("Deseja remover este registro de doação?")) return;
    try {
      const res = await fetch(
        `/api/donations?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        await fetchDonations();
      }
    } catch {
      // Fallback on network or fetch error
    }
  }

  const donationStats = useMemo(() => {
    const paid = donations.filter((d) => d.status === "paid");
    const pending = donations.filter((d) => d.status === "pending");
    const monthlyPaid = paid.filter((d) => d.frequency === "monthly");
    const totalPaidCents = paid.reduce((acc, d) => acc + d.amountCents, 0);
    return {
      totalPaidBRL: (totalPaidCents / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
      paidCount: paid.length,
      pendingCount: pending.length,
      monthlyCount: monthlyPaid.length,
    };
  }, [donations]);

  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      if (donationFilterStatus !== "all" && d.status !== donationFilterStatus) {
        return false;
      }
      const q = donationSearch.toLowerCase().trim();
      if (!q) return true;
      return [
        d.donorName,
        d.donorEmail,
        d.project,
        d.paymentMethod,
        d.stripeSessionId,
        d.notes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [donations, donationFilterStatus, donationSearch]);

  // ==================== VOLUNTEERS ACTIONS ====================
  async function handleUpdateVolunteerStatus(
    id: string,
    status: VolunteerStatus
  ) {
    try {
      const res = await fetch("/api/voluntariado", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status,
        }),
      });
      if (res.ok) {
        await fetchVolunteers();
      }
    } catch {
      // Ignore network error
    }
  }

  async function handleDeleteVolunteer(id: string, name: string) {
    if (
      !window.confirm(
        `Deseja remover a inscrição de voluntariado de "${name}"?`
      )
    ) {
      return;
    }
    try {
      const res = await fetch(
        `/api/voluntariado?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        await fetchVolunteers();
      }
    } catch {
      // Ignore network error
    }
  }

  const volunteerStats = useMemo(() => {
    return {
      total: volunteers.length,
      newCount: volunteers.filter((v) => v.status === "new").length,
      contactedCount: volunteers.filter((v) => v.status === "contacted").length,
      activeCount: volunteers.filter((v) => v.status === "active").length,
    };
  }, [volunteers]);

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((v) => {
      if (
        volunteerFilterStatus !== "all" &&
        v.status !== volunteerFilterStatus
      ) {
        return false;
      }
      const q = volunteerSearch.toLowerCase().trim();
      if (!q) return true;
      return [v.name, v.email, v.phone, v.area, v.availability, v.message]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [volunteers, volunteerFilterStatus, volunteerSearch]);

  const isSupabaseConnected =
    blogStorage === "supabase" ||
    actionStorage === "supabase" ||
    transparencyStorage === "supabase" ||
    donationStorage === "supabase" ||
    volunteerStorage === "supabase";

  // ==================== SESSION VERIFICATION VIEW ====================
  if (authStatus === "loading") {
    return (
      <div className="min-h-[75vh] bg-[#fffaf5] flex items-center justify-center px-4">
        <div className="soft-card p-10 max-w-md w-full text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl gradient-brand text-white mx-auto grid place-items-center text-2xl shadow-md">
            <i className="fa-solid fa-circle-notch fa-spin" />
          </div>
          <h1 className="display text-xl font-extrabold text-stone-900">
            Verificando sessão administrativa...
          </h1>
          <p className="text-sm text-stone-600">
            Validando permissões de acesso ao painel da Associação Humanitária
            Amor em Ação.
          </p>
        </div>
      </div>
    );
  }

  // ==================== ADMIN LOGIN VIEW ====================
  if (authStatus === "unauthenticated") {
    return (
      <div className="min-h-[82vh] bg-[#fffaf5] flex items-center justify-center px-4 py-12">
        <div className="soft-card max-w-md w-full p-7 sm:p-9 space-y-6 border border-orange-200/80 shadow-xl">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl gradient-brand text-white mx-auto grid place-items-center text-2xl shadow-md">
              <i className="fa-solid fa-user-shield" />
            </div>
            <span className="section-kicker block pt-1">Acesso Restrito</span>
            <h1 className="display text-2xl sm:text-3xl font-extrabold text-stone-900">
              Login Administrativo
            </h1>
            <p className="text-sm text-stone-600 leading-relaxed">
              Entre com sua conta administrativa para gerenciar publicações do
              blog, verificar doações e acompanhar inscrições de voluntariado.
            </p>
          </div>

          {loginError && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-bold text-red-800 flex items-start gap-2.5"
            >
              <i className="fa-solid fa-circle-exclamation text-red-600 mt-0.5 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label
                htmlFor="admin-login-email"
                className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5"
              >
                E-mail do Administrador
              </label>
              <div className="relative">
                <i className="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
                <input
                  id="admin-login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@amoremacao.org.br"
                  className="w-full rounded-xl border border-stone-300 bg-white pl-10 pr-4 py-3 text-sm text-stone-900 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-login-password"
                className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5"
              >
                Senha
              </label>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm" />
                <input
                  id="admin-login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-stone-300 bg-white pl-10 pr-4 py-3 text-sm text-stone-900 focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full gradient-brand text-white font-extrabold text-sm py-3.5 px-6 rounded-xl shadow-md hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loggingIn ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin" />
                  Autenticando...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket" />
                  Entrar no Painel Admin
                </>
              )}
            </button>
          </form>

          <div className="rounded-xl bg-orange-50/80 border border-orange-200/80 p-3.5 text-xs text-stone-600 leading-relaxed">
            <strong className="text-stone-800 block mb-0.5">
              <i className="fa-solid fa-key text-orange-600 mr-1.5" />
              Autenticação Segura:
            </strong>
            Entre com as credenciais cadastradas no{" "}
            <strong>Supabase Auth</strong> (Authentication &rarr; Users ou via
            script SQL <code>supabase/create_admin.sql</code>).
          </div>

          <div className="text-center pt-1">
            <Link
              href="/"
              className="text-xs font-bold text-stone-500 hover:text-orange-700 transition"
            >
              &larr; Voltar para o site público
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf5] pb-20">
      {/* Cabeçalho do Painel Admin */}
      <div className="bg-[#29231f] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/20 border border-orange-400/30 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-orange-300">
                  <i className="fa-solid fa-shield-halved" /> Painel
                  Administrativo
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs font-bold text-stone-200">
                  <i className="fa-solid fa-user-check text-emerald-400" />
                  {adminEmail}
                </span>
              </div>
              <h1 className="display text-3xl sm:text-4xl font-extrabold mt-3">
                Gestão Geral: Blog, Missões, Transparência &amp; Apoio
              </h1>
              <p className="text-stone-300 text-sm sm:text-base mt-2 max-w-2xl">
                Crie artigos com o editor visual Milkdown Crepe, construa novas
                páginas de missões com blocos modulares dinâmicos, gerencie
                documentos da transparência e consulte doações e voluntários.
              </p>
            </div>

            {/* Navegação de Abas Principais */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setActiveTab("blog")}
                className={`px-4 py-3 rounded-xl font-extrabold text-sm transition flex items-center gap-2 cursor-pointer ${
                  activeTab === "blog"
                    ? "gradient-brand text-white shadow-md"
                    : "bg-white/10 text-stone-200 hover:bg-white/15"
                }`}
              >
                <i className="fa-solid fa-pen-nib" />
                Blog ({posts.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("actions")}
                className={`px-4 py-3 rounded-xl font-extrabold text-sm transition flex items-center gap-2 cursor-pointer ${
                  activeTab === "actions"
                    ? "gradient-brand text-white shadow-md"
                    : "bg-white/10 text-stone-200 hover:bg-white/15"
                }`}
              >
                <i className="fa-solid fa-compass" />
                Missões &amp; Ações ({actionsList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("transparency")}
                className={`px-4 py-3 rounded-xl font-extrabold text-sm transition flex items-center gap-2 cursor-pointer ${
                  activeTab === "transparency"
                    ? "gradient-brand text-white shadow-md"
                    : "bg-white/10 text-stone-200 hover:bg-white/15"
                }`}
              >
                <i className="fa-solid fa-file-shield" />
                Transparência ({transparencyDocs.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("donations")}
                className={`px-4 py-3 rounded-xl font-extrabold text-sm transition flex items-center gap-2 cursor-pointer ${
                  activeTab === "donations"
                    ? "gradient-brand text-white shadow-md"
                    : "bg-white/10 text-stone-200 hover:bg-white/15"
                }`}
              >
                <i className="fa-solid fa-heart" />
                Doações ({donations.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("volunteers")}
                className={`px-4 py-3 rounded-xl font-extrabold text-sm transition flex items-center gap-2 cursor-pointer ${
                  activeTab === "volunteers"
                    ? "gradient-brand text-white shadow-md"
                    : "bg-white/10 text-stone-200 hover:bg-white/15"
                }`}
              >
                <i className="fa-solid fa-hands-helping" />
                Voluntariados ({volunteers.length})
              </button>
              <Link
                href="/blog"
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-xl text-sm font-bold transition"
              >
                Ver Blog{" "}
                <i className="fa-solid fa-arrow-up-right-from-square ml-1 text-xs" />
              </Link>
              <button
                type="button"
                onClick={handleAdminLogout}
                title="Encerrar sessão administrativa"
                className="bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl text-sm font-extrabold transition flex items-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-right-from-bracket" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        {/* ==================================================================== */}
        {/* ABA 1: EDITOR DE BLOG WYSIWYG (MILKDOWN CREPE + CARD PILL/BOTÃO)     */}
        {/* ==================================================================== */}
        {activeTab === "blog" && (
          <div className="space-y-10">
            {/* Barra superior: Status de edição + botão Novo Artigo */}
            <div className="soft-card p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 grid place-items-center font-extrabold">
                  <i
                    className={`fa-solid ${
                      editingId ? "fa-pen-to-square" : "fa-plus"
                    }`}
                  />
                </span>
                <div>
                  <h2 className="display font-extrabold text-lg text-stone-900">
                    {editingId
                      ? `Editando publicação: ${title || editingId}`
                      : "Nova Publicação no Blog"}
                  </h2>
                  <p className="text-xs text-stone-500">
                    {dirty
                      ? "Há alterações não salvas neste navegador"
                      : "Pronto para edição visual (Milkdown Crepe) ou Markdown"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {editingId && (
                  <button
                    type="button"
                    onClick={resetBlogForm}
                    className="px-4 py-2.5 rounded-xl border border-orange-200 bg-orange-50 text-orange-800 text-xs font-extrabold hover:bg-orange-100 transition"
                  >
                    <i className="fa-solid fa-plus mr-1.5" />
                    Criar Novo Artigo em Branco
                  </button>
                )}
              </div>
            </div>

            {/* Grid Principal: Formulário de Metadados + Preview em Tempo Real do Card */}
            <div className="grid lg:grid-cols-[1fr_23rem] gap-8 items-start">
              <div className="soft-card p-6 sm:p-8 space-y-6">
                <div>
                  <span className="section-kicker">1. Estrutura e Card</span>
                  <h3 className="display text-2xl font-extrabold text-stone-900 mt-1">
                    Dados do Artigo e Personalização do Card
                  </h3>
                </div>

                {/* DESTAQUE: Configuração do Pill da Imagem e do Texto do Botão (Igual à Imagem) */}
                <div className="rounded-2xl bg-orange-50/80 border-2 border-orange-200 p-5">
                  <div className="flex items-center gap-2 text-orange-900 font-extrabold text-sm mb-3">
                    <i className="fa-solid fa-wand-magic-sparkles text-orange-600" />
                    Personalização Visual do Card (Conforme o Layout de
                    Referência)
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="block text-xs font-bold text-stone-700">
                      Texto no &ldquo;Pill&rdquo; da Imagem (canto superior
                      esquerdo) *
                      <input
                        type="text"
                        value={pillText}
                        onChange={(e) => {
                          setPillText(e.target.value);
                          markChanged();
                        }}
                        placeholder="Ex.: Duque de Caxias · RJ ou Participe"
                        className="form-field mt-1.5 font-semibold text-orange-900"
                        required
                      />
                      <span className="block text-[11px] text-stone-500 mt-1 font-normal">
                        Exemplos: &ldquo;Duque de Caxias · RJ&rdquo;,
                        &ldquo;Participe&rdquo;, &ldquo;Compromisso
                        público&rdquo;
                      </span>
                    </label>

                    <label className="block text-xs font-bold text-stone-700">
                      Texto do Botão do Card (rodapé com seta →) *
                      <input
                        type="text"
                        value={buttonText}
                        onChange={(e) => {
                          setButtonText(e.target.value);
                          markChanged();
                        }}
                        placeholder="Ex.: Conhecer a iniciativa ou Quero participar"
                        className="form-field mt-1.5 font-semibold text-orange-900"
                        required
                      />
                      <span className="block text-[11px] text-stone-500 mt-1 font-normal">
                        Exemplos: &ldquo;Conhecer a iniciativa&rdquo;,
                        &ldquo;Quero participar&rdquo;, &ldquo;Ver
                        informações&rdquo;
                      </span>
                    </label>
                  </div>
                </div>

                {/* Título, Slug e Resumo */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <label className="block text-sm font-bold text-stone-800 sm:col-span-2">
                    Título do Artigo (H1) *
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => {
                        const nextTitle = e.target.value;
                        setTitle(nextTitle);
                        if (!editingId) {
                          setSlug(slugifyClient(nextTitle));
                        }
                        markChanged();
                      }}
                      placeholder="Ex.: Casa Amarela em Jardim Gramacho: como o acolhimento transforma a infância"
                      className="form-field mt-1.5 text-base font-bold"
                      required
                    />
                  </label>

                  <label className="block text-xs font-bold text-stone-700">
                    Slug da URL Amigável (SEO) *
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => {
                        setSlug(slugifyClient(e.target.value));
                        markChanged();
                      }}
                      placeholder="casa-amarela-jardim-gramacho"
                      className="form-field mt-1.5 font-mono text-xs"
                      required
                    />
                  </label>

                  <label className="block text-xs font-bold text-stone-700">
                    Link de Destino Customizado (opcional)
                    <input
                      type="text"
                      value={customLink}
                      onChange={(e) => {
                        setCustomLink(e.target.value);
                        markChanged();
                      }}
                      placeholder="Vazio = abre /blog/slug (ou ex.: /voluntariado)"
                      className="form-field mt-1.5 text-xs"
                    />
                  </label>

                  <label className="block text-sm font-bold text-stone-800 sm:col-span-2">
                    Resumo para Leitores, Card e Buscadores (Excerpt) *
                    <textarea
                      rows={3}
                      value={excerpt}
                      onChange={(e) => {
                        setExcerpt(e.target.value);
                        markChanged();
                      }}
                      placeholder="Texto curto que aparece na descrição do card e no resumo do artigo..."
                      className="form-field mt-1.5 text-sm"
                      required
                    />
                  </label>

                  <label className="block text-xs font-bold text-stone-700">
                    Categoria Editorial
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        markChanged();
                      }}
                      placeholder="Ex.: Casa Amarela, Voluntariado, Transparência"
                      className="form-field mt-1.5 text-sm"
                    />
                  </label>

                  <label className="block text-xs font-bold text-stone-700">
                    Data de Publicação
                    <input
                      type="date"
                      value={publishedDate}
                      onChange={(e) => {
                        setPublishedDate(e.target.value);
                        markChanged();
                      }}
                      className="form-field mt-1.5 text-sm"
                    />
                  </label>

                  <label className="block text-xs font-bold text-stone-700 sm:col-span-2">
                    Tags (separadas por vírgula)
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => {
                        setTagsInput(e.target.value);
                        markChanged();
                      }}
                      placeholder="Casa Amarela, Jardim Gramacho, Duque de Caxias, Infância"
                      className="form-field mt-1.5 text-sm"
                    />
                  </label>
                </div>

                {/* Capa Compartilhada */}
                <fieldset className="rounded-2xl border border-stone-200 p-5">
                  <legend className="px-2 font-extrabold text-sm text-stone-800">
                    Imagem de Capa do Card e do Artigo
                  </legend>
                  <div className="mb-4 flex flex-wrap gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setCoverMode("gallery")}
                      className={`px-3.5 py-1.5 rounded-lg font-bold border transition ${
                        coverMode === "gallery"
                          ? "bg-orange-100 border-orange-300 text-orange-900"
                          : "bg-white border-stone-200 text-stone-600"
                      }`}
                    >
                      Acervo Oficial Amor em Ação
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverMode("upload")}
                      className={`px-3.5 py-1.5 rounded-lg font-bold border transition ${
                        coverMode === "upload"
                          ? "bg-orange-100 border-orange-300 text-orange-900"
                          : "bg-white border-stone-200 text-stone-600"
                      }`}
                    >
                      Enviar Arquivo (PNG/JPG/WebP/AVIF)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverMode("remote")}
                      className={`px-3.5 py-1.5 rounded-lg font-bold border transition ${
                        coverMode === "remote"
                          ? "bg-orange-100 border-orange-300 text-orange-900"
                          : "bg-white border-stone-200 text-stone-600"
                      }`}
                    >
                      URL Externa (HTTPS)
                    </button>
                  </div>

                  {coverMode === "gallery" && (
                    <div className="space-y-3">
                      <select
                        value={
                          PROJECT_IMAGES.some((i) => i.url === coverImage)
                            ? coverImage
                            : PROJECT_IMAGES[0].url
                        }
                        onChange={(e) => {
                          const found = PROJECT_IMAGES.find(
                            (i) => i.url === e.target.value
                          );
                          setCoverImage(e.target.value);
                          if (found) setCoverImageAlt(found.defaultAlt);
                          markChanged();
                        }}
                        className="form-field text-sm"
                      >
                        {PROJECT_IMAGES.map((img) => (
                          <option key={img.url} value={img.url}>
                            {img.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {coverMode === "upload" && (
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/avif"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) void handleCoverUpload(file);
                        }}
                        className="form-field text-xs"
                      />
                    </div>
                  )}

                  {coverMode === "remote" && (
                    <div className="space-y-3">
                      <input
                        type="url"
                        value={coverImage}
                        onChange={(e) => {
                          setCoverImage(e.target.value);
                          markChanged();
                        }}
                        placeholder="https://exemplo.org/minha-foto.jpg"
                        className="form-field text-sm"
                      />
                    </div>
                  )}

                  <label className="block text-xs font-bold text-stone-700 mt-3">
                    Texto Alternativo da Imagem (Acessibilidade e SEO) *
                    <input
                      type="text"
                      value={coverImageAlt}
                      onChange={(e) => {
                        setCoverImageAlt(e.target.value);
                        markChanged();
                      }}
                      placeholder="Descreva a fotografia para leitores de tela e Google Imagens"
                      className="form-field mt-1 text-xs"
                    />
                  </label>
                </fieldset>

                {/* Editor Visual WYSIWYG Milkdown Crepe (Igual ao Portfólio) */}
                <section aria-label="Corpo do artigo">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div>
                      <span className="section-kicker">
                        2. Editor Visual WYSIWYG &amp; Markdown
                      </span>
                      <h3 className="display text-xl font-extrabold text-stone-900">
                        Corpo Completo do Artigo
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditorKey((k) => k + 1)}
                      className="text-xs font-bold text-orange-700 hover:underline"
                    >
                      <i className="fa-solid fa-rotate mr-1" />
                      Recarregar no Editor Visual
                    </button>
                  </div>
                  <p className="mb-3 text-xs text-stone-500">
                    Use subtítulos H2/H3 (eles geram automaticamente o sumário
                    lateral &ldquo;Neste artigo&rdquo;), listas, citações, links
                    de fontes e imagens com descrição. O título acima já é o H1.
                  </p>

                  <VisualMarkdownEditor
                    key={editorKey}
                    value={content}
                    onChange={(nextMarkdown) => {
                      setContent(nextMarkdown);
                      markChanged();
                    }}
                    onStageAsset={stageInlineAsset}
                  />
                </section>

                {/* SEO Avançado & FAQ Schema */}
                <details className="rounded-2xl border border-stone-200 bg-stone-50/60 p-5">
                  <summary className="cursor-pointer font-extrabold text-sm text-stone-900 flex items-center justify-between">
                    <span>
                      <i className="fa-solid fa-magnifying-glass-chart text-orange-600 mr-2" />
                      3. Otimização de SEO &amp; Perguntas Frequentes (Schema.org
                      FAQPage)
                    </span>
                    <span className="text-xs text-orange-700 font-bold">
                      Expandir / Recolher
                    </span>
                  </summary>

                  <div className="mt-5 grid sm:grid-cols-2 gap-4">
                    <label className="block text-xs font-bold text-stone-700">
                      Título SEO (Meta Title)
                      <input
                        type="text"
                        value={seoTitle}
                        onChange={(e) => {
                          setSeoTitle(e.target.value);
                          markChanged();
                        }}
                        placeholder={`${
                          title || "Título do Artigo"
                        } | Amor em Ação`}
                        className="form-field mt-1 text-xs"
                      />
                    </label>
                    <label className="block text-xs font-bold text-stone-700">
                      Palavra-chave em Foco (Focus Keyword)
                      <input
                        type="text"
                        value={focusKeyword}
                        onChange={(e) => {
                          setFocusKeyword(e.target.value);
                          markChanged();
                        }}
                        placeholder="Ex.: Casa Amarela Jardim Gramacho"
                        className="form-field mt-1 text-xs"
                      />
                    </label>
                    <label className="block text-xs font-bold text-stone-700 sm:col-span-2">
                      Meta Description (140 a 160 caracteres para o Google)
                      <textarea
                        rows={2}
                        value={seoDescription}
                        onChange={(e) => {
                          setSeoDescription(e.target.value);
                          markChanged();
                        }}
                        placeholder={
                          excerpt ||
                          "Descrição otimizada para os resultados de busca..."
                        }
                        className="form-field mt-1 text-xs"
                      />
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-stone-800 sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => {
                          setFeatured(e.target.checked);
                          markChanged();
                        }}
                        className="h-4 w-4 accent-orange-600"
                      />
                      Destacar este card na página inicial (Home)
                    </label>
                  </div>

                  {/* Perguntas Frequentes (FAQ) */}
                  <div className="mt-6 pt-5 border-t border-stone-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-extrabold text-stone-800">
                        Perguntas Frequentes do Artigo (Rich Snippets no Google)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setFaq((curr) => [
                            ...curr,
                            { question: "", answer: "" },
                          ]);
                          markChanged();
                        }}
                        className="text-xs font-extrabold text-orange-700 hover:underline"
                      >
                        + Adicionar Pergunta
                      </button>
                    </div>
                    <div className="space-y-3">
                      {faq.map((item, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-stone-200 bg-white p-3.5 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-stone-400">
                              Pergunta #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setFaq((curr) =>
                                  curr.filter((_, i) => i !== idx)
                                );
                                markChanged();
                              }}
                              className="text-xs text-red-600 hover:underline"
                            >
                              Remover
                            </button>
                          </div>
                          <input
                            type="text"
                            value={item.question}
                            onChange={(e) => {
                              const next = [...faq];
                              next[idx] = {
                                ...next[idx],
                                question: e.target.value,
                              };
                              setFaq(next);
                              markChanged();
                            }}
                            placeholder="Pergunta frequente..."
                            className="form-field text-xs"
                          />
                          <textarea
                            rows={2}
                            value={item.answer}
                            onChange={(e) => {
                              const next = [...faq];
                              next[idx] = {
                                ...next[idx],
                                answer: e.target.value,
                              };
                              setFaq(next);
                              markChanged();
                            }}
                            placeholder="Resposta objetiva..."
                            className="form-field text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </details>

                {/* Barra de Ações: Ver Prévia Completa / Salvar Rascunho / Publicar */}
                <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowArticlePreview((p) => !p)}
                    className="px-5 py-3 rounded-xl border border-stone-300 bg-white text-stone-800 font-extrabold text-sm hover:bg-stone-50 transition"
                  >
                    <i className="fa-regular fa-eye mr-2 text-orange-600" />
                    {showArticlePreview
                      ? "Fechar Prévia do Artigo"
                      : "Ver Prévia Completa do Artigo"}
                  </button>

                  <button
                    type="button"
                    disabled={savingBlog}
                    onClick={() => void saveArticle(true)}
                    className="px-5 py-3 rounded-xl border border-orange-200 bg-orange-50 text-orange-900 font-extrabold text-sm hover:bg-orange-100 transition disabled:opacity-50"
                  >
                    Salvar Rascunho
                  </button>

                  <button
                    type="button"
                    disabled={savingBlog}
                    onClick={() => void saveArticle(false)}
                    className="gradient-brand text-white px-6 py-3 rounded-xl font-extrabold text-sm shadow-md hover:opacity-95 transition disabled:opacity-50"
                  >
                    <i className="fa-solid fa-cloud-arrow-up mr-2" />
                    {savingBlog
                      ? "Salvando…"
                      : editingId
                      ? "Publicar Alterações"
                      : "Publicar Artigo"}
                  </button>

                  {dirty && (
                    <span className="text-xs text-amber-700 font-semibold ml-auto">
                      ● Alterações não salvas
                    </span>
                  )}
                </div>

                {blogFeedback && (
                  <div
                    role="status"
                    className={`rounded-2xl p-4 text-sm font-semibold border ${
                      blogFeedback.type === "success"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                        : "bg-red-50 border-red-200 text-red-800"
                    }`}
                  >
                    {blogFeedback.text}
                    {blogFeedback.type === "success" && slug && (
                      <div className="mt-2">
                        <Link
                          href={`/blog/${slug}`}
                          className="underline font-extrabold text-emerald-950"
                        >
                          Abrir artigo publicado (/blog/{slug}) →
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Coluna Lateral: Prévia em Tempo Real do Card (Idêntico à Imagem) */}
              <aside className="lg:sticky lg:top-28 space-y-5">
                <div className="soft-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="section-kicker">Prévia ao vivo do Card</span>
                    <span className="text-[11px] font-bold text-stone-400">
                      Home &amp; Catálogo
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mb-4">
                    Veja exatamente como o card aparece na página inicial e no
                    blog, com o <strong>Pill</strong> na foto e o{" "}
                    <strong>texto do botão</strong> personalizados:
                  </p>
                  <ActionBlogCard
                    title={previewPost.title}
                    description={previewPost.excerpt}
                    image={previewPost.coverImage}
                    imageAlt={previewPost.coverImageAlt}
                    pillText={previewPost.pillText}
                    buttonText={previewPost.buttonText}
                    href={
                      previewPost.customLink || `/blog/${previewPost.slug}`
                    }
                  />
                </div>

                <div className="soft-card p-5 bg-orange-50/60 border-orange-200 text-xs text-stone-600 space-y-2">
                  <p className="font-extrabold text-stone-900">
                    <i className="fa-solid fa-circle-check text-orange-600 mr-1.5" />
                    Qualidade Editorial do Portfólio
                  </p>
                  <ul className="space-y-1.5 list-disc pl-4">
                    <li>
                      Editor visual <strong>Milkdown Crepe</strong> com suporte
                      a Markdown GFM e checagem de roundtrip.
                    </li>
                    <li>
                      Sumário automático (<strong>Neste artigo</strong>) gerado
                      pelos subtítulos H2 e H3.
                    </li>
                    <li>
                      Leitura em voz alta (<strong>Ouvir este artigo</strong>) e{" "}
                      <strong>Modo leitura focado</strong> integrados.
                    </li>
                  </ul>
                </div>
              </aside>
            </div>

            {/* Prévia Privada Completa do Artigo */}
            {showArticlePreview && (
              <section
                aria-label="Prévia privada do artigo"
                className="rounded-3xl border-2 border-orange-300 bg-[#fffaf5] overflow-hidden shadow-lg"
              >
                <div className="bg-orange-100/90 border-b border-orange-200 px-6 py-3.5 flex items-center justify-between">
                  <p className="text-sm font-extrabold text-orange-950">
                    <i className="fa-regular fa-eye mr-2" />
                    Prévia Privada da Página do Artigo ·{" "}
                    {previewPost.readingTimeMinutes} min de leitura
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowArticlePreview(false)}
                    className="text-xs font-bold text-orange-900 underline"
                  >
                    Fechar prévia
                  </button>
                </div>
                <div className="p-6 sm:p-10">
                  <BlogArticleView
                    post={previewPost}
                    assetPreviews={assetPreviews}
                    isPreview
                  />
                </div>
              </section>
            )}

            {/* Lista de Publicações Cadastradas */}
            <section className="soft-card p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <span className="section-kicker">Acervo Publicado</span>
                  <h3 className="display text-2xl font-extrabold text-stone-900 mt-1">
                    Publicações no Banco ({posts.length})
                  </h3>
                </div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por título, pill, botão ou tag..."
                  className="form-field sm:w-80 text-sm"
                />
              </div>

              {loadingPosts ? (
                <p className="text-sm text-stone-500 py-8 text-center">
                  Carregando publicações...
                </p>
              ) : filteredPosts.length === 0 ? (
                <p className="text-sm text-stone-500 py-8 text-center">
                  Nenhuma publicação cadastrada ainda. Use o editor acima para
                  criar o primeiro artigo!
                </p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className="rounded-2xl border border-stone-200 bg-white p-5 flex flex-col justify-between gap-4 hover:border-orange-300 transition"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2.5">
                          <span className="bg-orange-100 text-orange-800 text-xs font-extrabold px-3 py-1 rounded-full">
                            Pill: {post.pillText}
                          </span>
                          <span className="bg-stone-100 text-stone-700 text-xs font-bold px-3 py-1 rounded-full">
                            Botão: {post.buttonText} →
                          </span>
                          {post.draft ? (
                            <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                              Rascunho
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                              Publicado
                            </span>
                          )}
                        </div>
                        <h4 className="display font-extrabold text-lg text-stone-900">
                          {post.title}
                        </h4>
                        <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-stone-400 font-mono truncate max-w-[14rem]">
                          /blog/{post.slug}
                        </span>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-700 font-bold hover:bg-stone-50"
                          >
                            Ver página
                          </Link>
                          <button
                            type="button"
                            onClick={() => loadPostIntoEditor(post)}
                            className="px-3 py-1.5 rounded-lg bg-orange-100 text-orange-900 font-extrabold hover:bg-orange-200"
                          >
                            Editar no WYSIWYG
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              void handleDeletePost(post.id, post.title)
                            }
                            className="px-2.5 py-1.5 rounded-lg text-red-600 hover:bg-red-50 font-bold"
                            aria-label={`Excluir ${post.title}`}
                          >
                            <i className="fa-regular fa-trash-can" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ABA 2: MISSÕES / AÇÕES (ELEMENTOR-LIKE MODULAR PAGE BUILDER)         */}
        {/* ==================================================================== */}
        {activeTab === "actions" && (
          <ActionMissionBuilder
            actions={actionsList}
            storage={actionStorage}
            loading={loadingActions}
            onRefresh={fetchActions}
          />
        )}

        {/* ==================================================================== */}
        {/* ABA 3: GESTÃO DO PORTAL DA TRANSPARÊNCIA                             */}
        {/* ==================================================================== */}
        {activeTab === "transparency" && (
          <TransparencyManager
            documents={transparencyDocs}
            storage={transparencyStorage}
            loading={loadingTransparency}
            onRefresh={fetchTransparencyDocs}
          />
        )}

        {/* ==================================================================== */}
        {/* ABA 4: PAINEL DE VERIFICAÇÃO E GESTÃO DE DOAÇÕES (STRIPE & PIX)      */}
        {/* ==================================================================== */}
        {activeTab === "donations" && (
          <div className="space-y-8">
            {/* KPIs de Doações */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="soft-card p-6">
                <span className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
                  Total Confirmado
                </span>
                <div className="display text-3xl font-extrabold text-emerald-700 mt-2">
                  {donationStats.totalPaidBRL}
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Soma das doações com status pago
                </p>
              </div>

              <div className="soft-card p-6">
                <span className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
                  Doações Confirmadas
                </span>
                <div className="display text-3xl font-extrabold text-stone-900 mt-2">
                  {donationStats.paidCount}
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Pagamentos verificados (Stripe / Pix)
                </p>
              </div>

              <div className="soft-card p-6">
                <span className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
                  Aguardando Confirmação
                </span>
                <div className="display text-3xl font-extrabold text-amber-600 mt-2">
                  {donationStats.pendingCount}
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Checkouts iniciados ou em análise
                </p>
              </div>

              <div className="soft-card p-6">
                <span className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
                  Apoiadores Mensais
                </span>
                <div className="display text-3xl font-extrabold text-orange-600 mt-2">
                  {donationStats.monthlyCount}
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Doações recorrentes ativas
                </p>
              </div>
            </div>

            {donationFeedback && (
              <div
                role="status"
                className={`rounded-2xl p-4 text-sm font-semibold border ${
                  donationFeedback.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                {donationFeedback.text}
              </div>
            )}

            <div className="grid lg:grid-cols-[1fr_23rem] gap-8 items-start">
              {/* Tabela de Doações */}
              <div className="soft-card p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <span className="section-kicker">
                      Histórico de Contribuições
                    </span>
                    <h2 className="display text-2xl font-extrabold text-stone-900 mt-1">
                      Doações Registradas ({filteredDonations.length})
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={donationFilterStatus}
                      onChange={(e) => setDonationFilterStatus(e.target.value)}
                      className="form-field w-auto text-xs font-bold py-2"
                    >
                      <option value="all">Todos os status</option>
                      <option value="paid">Confirmadas (Pagas)</option>
                      <option value="pending">Pendentes</option>
                      <option value="canceled">Canceladas</option>
                    </select>
                    <input
                      type="search"
                      value={donationSearch}
                      onChange={(e) => setDonationSearch(e.target.value)}
                      placeholder="Buscar doador, e-mail, projeto..."
                      className="form-field w-52 text-xs py-2"
                    />
                  </div>
                </div>

                {loadingDonations ? (
                  <p className="text-sm text-stone-500 py-8 text-center">
                    Carregando doações...
                  </p>
                ) : filteredDonations.length === 0 ? (
                  <p className="text-sm text-stone-500 py-8 text-center">
                    Nenhuma doação registrada ainda.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {filteredDonations.map((don) => {
                      const amountFormatted = (
                        don.amountCents / 100
                      ).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: don.currency || "BRL",
                      });
                      const dateFormatted = new Date(
                        don.createdAt
                      ).toLocaleString("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      });
                      return (
                        <div
                          key={don.id}
                          className="rounded-2xl border border-stone-200 bg-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="display font-extrabold text-lg text-stone-900">
                                {amountFormatted}
                              </span>
                              <span
                                className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                                  don.status === "paid"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : don.status === "pending"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-stone-100 text-stone-600"
                                }`}
                              >
                                {don.status === "paid"
                                  ? "Confirmada"
                                  : don.status === "pending"
                                  ? "Pendente"
                                  : "Cancelada"}
                              </span>
                              <span className="text-xs font-bold bg-orange-50 text-orange-800 px-2.5 py-0.5 rounded-full">
                                {don.frequency === "monthly"
                                  ? "Mensal"
                                  : "Doação Única"}
                              </span>
                              <span className="text-xs font-semibold text-stone-500 uppercase">
                                via {don.paymentMethod}
                              </span>
                            </div>

                            <div className="text-sm font-bold text-stone-800">
                              {don.donorName || "Apoiador Anônimo"}{" "}
                              {don.donorEmail && (
                                <span className="text-xs font-normal text-stone-500">
                                  ({don.donorEmail})
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-stone-500">
                              Destino:{" "}
                              <strong>
                                {PROJECT_LABELS[don.project] || don.project}
                              </strong>{" "}
                              · {dateFormatted}
                            </div>

                            {don.notes && (
                              <p className="text-xs text-stone-600 italic mt-1">
                                &ldquo;{don.notes}&rdquo;
                              </p>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            {don.stripeSessionId && (
                              <button
                                type="button"
                                disabled={
                                  verifyingSessionId === don.stripeSessionId
                                }
                                onClick={() =>
                                  void handleVerifyStripeSession(
                                    don.stripeSessionId!
                                  )
                                }
                                className="px-3 py-1.5 rounded-lg border border-orange-200 bg-orange-50 text-orange-900 text-xs font-extrabold hover:bg-orange-100 transition"
                              >
                                <i className="fa-solid fa-rotate mr-1" />
                                {verifyingSessionId === don.stripeSessionId
                                  ? "Verificando..."
                                  : "Verificar no Stripe"}
                              </button>
                            )}

                            {don.status !== "paid" && (
                              <button
                                type="button"
                                onClick={() =>
                                  void handleUpdateDonationStatus(
                                    don.id,
                                    "paid"
                                  )
                                }
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-extrabold hover:bg-emerald-700 transition"
                              >
                                <i className="fa-solid fa-check mr-1" />
                                Confirmar
                              </button>
                            )}

                            {don.status === "paid" && (
                              <button
                                type="button"
                                onClick={() =>
                                  void handleUpdateDonationStatus(
                                    don.id,
                                    "pending"
                                  )
                                }
                                className="px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 text-xs font-bold hover:bg-stone-50"
                              >
                                Marcar pendente
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => void handleDeleteDonation(don.id)}
                              className="px-2.5 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs font-bold"
                              aria-label="Excluir registro de doação"
                            >
                              <i className="fa-regular fa-trash-can" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Formulário Lateral: Registrar Doação Manualmente (Pix / Transferência) */}
              <aside className="soft-card p-6">
                <span className="section-kicker">Registro Rápido</span>
                <h3 className="display text-xl font-extrabold text-stone-900 mt-1">
                  Registrar Doação Recebida
                </h3>
                <p className="text-xs text-stone-500 mt-1 mb-5">
                  As doações pelo Checkout Stripe aparecem automaticamente. Use
                  este formulário para registrar doações recebidas via Pix,
                  transferência ou presencialmente.
                </p>

                <form
                  onSubmit={handleRegisterManualDonation}
                  className="space-y-3.5"
                >
                  <label className="block text-xs font-bold text-stone-700">
                    Nome do Doador / Empresa
                    <input
                      type="text"
                      value={manualDonorName}
                      onChange={(e) => setManualDonorName(e.target.value)}
                      placeholder="Ex.: Maria Silva ou Anônimo"
                      className="form-field mt-1 text-sm"
                    />
                  </label>

                  <label className="block text-xs font-bold text-stone-700">
                    E-mail ou Contato (opcional)
                    <input
                      type="text"
                      value={manualDonorEmail}
                      onChange={(e) => setManualDonorEmail(e.target.value)}
                      placeholder="contato@exemplo.com"
                      className="form-field mt-1 text-sm"
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs font-bold text-stone-700">
                      Valor (R$) *
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        value={manualAmountBRL}
                        onChange={(e) => setManualAmountBRL(e.target.value)}
                        placeholder="100.00"
                        className="form-field mt-1 text-sm font-bold"
                        required
                      />
                    </label>

                    <label className="block text-xs font-bold text-stone-700">
                      Frequência
                      <select
                        value={manualFrequency}
                        onChange={(e) =>
                          setManualFrequency(
                            e.target.value as "once" | "monthly"
                          )
                        }
                        className="form-field mt-1 text-sm"
                      >
                        <option value="once">Única</option>
                        <option value="monthly">Mensal</option>
                      </select>
                    </label>
                  </div>

                  <label className="block text-xs font-bold text-stone-700">
                    Frente / Projeto Destino
                    <select
                      value={manualProject}
                      onChange={(e) => setManualProject(e.target.value)}
                      className="form-field mt-1 text-sm"
                    >
                      <option value="casa-amarela">
                        Casa Amarela (Jardim Gramacho)
                      </option>
                      <option value="alimentacao">
                        Alimentação e Higiene Infantil
                      </option>
                      <option value="oficinas">
                        Oficinas, Educação e Cultura
                      </option>
                      <option value="geral">Fundo Geral</option>
                    </select>
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs font-bold text-stone-700">
                      Método
                      <select
                        value={manualMethod}
                        onChange={(e) =>
                          setManualMethod(
                            e.target.value as "pix" | "transfer" | "stripe"
                          )
                        }
                        className="form-field mt-1 text-sm"
                      >
                        <option value="pix">Pix</option>
                        <option value="transfer">Transferência</option>
                        <option value="stripe">Stripe</option>
                      </select>
                    </label>

                    <label className="block text-xs font-bold text-stone-700">
                      Status
                      <select
                        value={manualStatus}
                        onChange={(e) =>
                          setManualStatus(e.target.value as DonationStatus)
                        }
                        className="form-field mt-1 text-sm"
                      >
                        <option value="paid">Confirmada</option>
                        <option value="pending">Pendente</option>
                      </select>
                    </label>
                  </div>

                  <label className="block text-xs font-bold text-stone-700">
                    Observação / Comprovante
                    <textarea
                      rows={2}
                      value={manualNotes}
                      onChange={(e) => setManualNotes(e.target.value)}
                      placeholder="Ex.: Doação confirmada no extrato bancário..."
                      className="form-field mt-1 text-xs"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={savingDonation}
                    className="w-full gradient-brand text-white font-extrabold text-sm py-3.5 rounded-xl shadow-sm hover:opacity-95 transition disabled:opacity-50"
                  >
                    {savingDonation
                      ? "Salvando..."
                      : "Registrar Doação no Painel"}
                  </button>
                </form>
              </aside>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ABA 3: PAINEL DE VOLUNTARIADOS INSCRITOS (/api/voluntariado)         */}
        {/* ==================================================================== */}
        {activeTab === "volunteers" && (
          <div className="space-y-8">
            {/* KPIs de Voluntariados */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="soft-card p-6">
                <span className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
                  Total de Inscritos
                </span>
                <div className="display text-3xl font-extrabold text-stone-900 mt-2">
                  {volunteerStats.total}
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Manifestações enviadas pelo formulário
                </p>
              </div>

              <div className="soft-card p-6">
                <span className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
                  Novos (Aguardando Contato)
                </span>
                <div className="display text-3xl font-extrabold text-amber-600 mt-2">
                  {volunteerStats.newCount}
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Novos voluntários para chamar no WhatsApp
                </p>
              </div>

              <div className="soft-card p-6">
                <span className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
                  Contatados
                </span>
                <div className="display text-3xl font-extrabold text-orange-600 mt-2">
                  {volunteerStats.contactedCount}
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Em alinhamento com a coordenação
                </p>
              </div>

              <div className="soft-card p-6">
                <span className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
                  Voluntários Ativos
                </span>
                <div className="display text-3xl font-extrabold text-emerald-700 mt-2">
                  {volunteerStats.activeCount}
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Participando das ações comunitárias
                </p>
              </div>
            </div>

            <div className="soft-card p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <span className="section-kicker">
                    Inscrições do Formulário (/voluntariado)
                  </span>
                  <h2 className="display text-2xl font-extrabold text-stone-900 mt-1">
                    Voluntários Inscritos ({filteredVolunteers.length})
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={volunteerFilterStatus}
                    onChange={(e) => setVolunteerFilterStatus(e.target.value)}
                    className="form-field w-auto text-xs font-bold py-2"
                  >
                    <option value="all">Todos os status</option>
                    <option value="new">Novos (Aguardando contato)</option>
                    <option value="contacted">Contatados</option>
                    <option value="active">Ativos</option>
                    <option value="archived">Arquivados</option>
                  </select>
                  <input
                    type="search"
                    value={volunteerSearch}
                    onChange={(e) => setVolunteerSearch(e.target.value)}
                    placeholder="Buscar nome, área, WhatsApp..."
                    className="form-field w-60 text-xs py-2"
                  />
                </div>
              </div>

              {loadingVolunteers ? (
                <p className="text-sm text-stone-500 py-8 text-center">
                  Carregando voluntários...
                </p>
              ) : filteredVolunteers.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <p className="text-sm text-stone-500">
                    Nenhuma inscrição de voluntariado encontrada.
                  </p>
                  <Link
                    href="/voluntariado"
                    className="inline-block text-xs font-extrabold text-orange-700 underline"
                  >
                    Abrir página pública de Voluntariado (/voluntariado) →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredVolunteers.map((vol) => {
                    const dateFormatted = new Date(
                      vol.createdAt
                    ).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    });

                    return (
                      <div
                        key={vol.id}
                        className="rounded-2xl border border-stone-200 bg-white p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                      >
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="display font-extrabold text-lg text-stone-900">
                              {vol.name}
                            </h3>
                            <span
                              className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                                vol.status === "new"
                                  ? "bg-amber-100 text-amber-800"
                                  : vol.status === "contacted"
                                  ? "bg-orange-100 text-orange-800"
                                  : vol.status === "active"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-stone-100 text-stone-600"
                              }`}
                            >
                              {VOLUNTEER_STATUS_LABELS[vol.status] ||
                                vol.status}
                            </span>
                            <span className="text-xs font-bold bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full">
                              {vol.availability}
                            </span>
                            <span className="text-xs text-stone-400">
                              {dateFormatted}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-stone-600">
                            <span>
                              <strong className="text-stone-800">Área:</strong>{" "}
                              {vol.area}
                            </span>
                            <span>
                              <strong className="text-stone-800">
                                WhatsApp/Tel:
                              </strong>{" "}
                              {vol.phone}
                            </span>
                            <span>
                              <strong className="text-stone-800">
                                E-mail:
                              </strong>{" "}
                              {vol.email}
                            </span>
                          </div>

                          {vol.message && (
                            <p className="text-xs text-stone-600 bg-orange-50/50 border border-orange-100 rounded-xl p-3 leading-relaxed">
                              &ldquo;{vol.message}&rdquo;
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <a
                            href={formatWhatsAppUrl(vol.phone, vol.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-extrabold hover:bg-emerald-700 transition inline-flex items-center gap-1.5"
                          >
                            <i className="fa-brands fa-whatsapp text-sm" />
                            WhatsApp
                          </a>

                          <a
                            href={`mailto:${vol.email}?subject=${encodeURIComponent(
                              "Voluntariado — Associação Humanitária Amor em Ação"
                            )}`}
                            className="px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 text-xs font-bold hover:bg-stone-50 transition inline-flex items-center gap-1.5"
                          >
                            <i className="fa-regular fa-envelope" />
                            E-mail
                          </a>

                          <select
                            value={vol.status}
                            onChange={(e) =>
                              void handleUpdateVolunteerStatus(
                                vol.id,
                                e.target.value as VolunteerStatus
                              )
                            }
                            aria-label={`Status de ${vol.name}`}
                            className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-extrabold text-orange-900"
                          >
                            <option value="new">Novo</option>
                            <option value="contacted">Contatado</option>
                            <option value="active">Ativo</option>
                            <option value="archived">Arquivado</option>
                          </select>

                          <button
                            type="button"
                            onClick={() =>
                              void handleDeleteVolunteer(vol.id, vol.name)
                            }
                            className="px-2.5 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold"
                            aria-label={`Excluir voluntário ${vol.name}`}
                          >
                            <i className="fa-regular fa-trash-can" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
