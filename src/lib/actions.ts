import { getSupabaseAdmin } from "@/lib/supabase";
import type {
  ActionMission,
  ActionNavSummary,
  ActionPageBlock,
} from "@/lib/action-types";

export const DEFAULT_ACTION_MISSIONS: ActionMission[] = [
  {
    id: "action-casa-amarela",
    slug: "casa-amarela",
    title: "Casa Amarela",
    navSubtitle: "Acolhimento em Jardim Gramacho",
    kicker: "Ação comunitária · Jardim Gramacho",
    description:
      "Espaço comunitário da Associação Humanitária Amor em Ação localizado em Jardim Gramacho, Duque de Caxias/RJ, com acolhimento, alimentação, higiene e atividades para crianças.",
    coverImage: "/images/casa-amarela-equipe-criancas.jpg",
    coverImageAlt: "Crianças e equipe em frente à Casa Amarela em Jardim Gramacho",
    status: "published",
    featuredInNav: true,
    createdAt: "2024-01-01T12:00:00.000Z",
    updatedAt: "2024-01-01T12:00:00.000Z",
    seoTitle: "Casa Amarela em Jardim Gramacho (Duque de Caxias/RJ) | Amor em Ação",
    seoDescription:
      "Conheça a Casa Amarela em Jardim Gramacho, Duque de Caxias/RJ: espaço comunitário da Associação Humanitária Amor em Ação com alimentação, higiene e acolhimento infantil.",
    blocks: [
      {
        id: "hero-ca",
        type: "hero",
        kicker: "Ação comunitária · Jardim Gramacho",
        title: "Casa Amarela",
        subtitle:
          "Espaço ligado à Associação Humanitária Amor em Ação, localizado em Jardim Gramacho, Duque de Caxias, no Rio de Janeiro.",
        primaryButtonText: "Quero apoiar",
        primaryButtonLink: "/voluntariado",
      },
      {
        id: "img-text-ca",
        type: "image_text",
        image: "/images/casa-amarela-equipe-criancas.jpg",
        imageAlt: "Crianças e equipe em frente à Casa Amarela",
        imagePosition: "left",
        kicker: "Acolhimento e cuidado",
        title: "Um espaço de convivência e atenção às crianças",
        text: "Reportagem publicada pela Rádio 93 FM em 11 de abril de 2023 descreve a Casa Amarela como um espaço onde crianças recebem atenção de voluntários, almoço, lanche, apoio à higiene pessoal, banho e oportunidades de brincar em ambiente limpo e acolhedor.\n\nUma publicação da VT Soluções, de 2021, relatou que a unidade atendia aproximadamente 50 crianças por dia naquele período e oferecia alimentação, brincadeiras, playground e atividades de convivência.",
        bullets: [
          "Alimentação balanceada e lanche diário",
          "Espaço seguro de convivência e lazer infantil",
          "Apoio a hábitos de higiene e cuidados pessoais",
          "Oficinas manuais e atividades socioeducativas",
        ],
      },
      {
        id: "gallery-ca",
        type: "gallery",
        kicker: "Memórias da comunidade",
        title: "Registros da Casa Amarela",
        description:
          "Fotografias extraídas de publicações do perfil @ahamoremacao com momentos de convivência, afeto e cuidado com as crianças.",
        columns: 3,
        items: [
          {
            id: "gal-ca-1",
            image: "/images/casa-amarela-equipe-criancas.jpg",
            alt: "Crianças e equipe em frente à Casa Amarela",
            title: "A Casa Amarela",
            subtitle: "Jardim Gramacho · Duque de Caxias",
          },
          {
            id: "gal-ca-2",
            image: "/images/casa-amarela-convivencia-afeto.jpg",
            alt: "Crianças reunidas com uma voluntária",
            title: "Convivência e afeto",
            subtitle: "Atenção e carinho no dia a dia",
          },
          {
            id: "gal-ca-3",
            image: "/images/casa-amarela-brincadeiras-agua.jpg",
            alt: "Crianças brincando com água em um dia de calor",
            title: "Brincadeiras e alegria",
            subtitle: "Infância com dignidade e diversão",
          },
          {
            id: "gal-ca-4",
            image: "/images/casa-amarela-infancia-sorriso.jpg",
            alt: "Duas crianças sorrindo para a câmera",
            title: "Infância e espontaneidade",
            subtitle: "Sorrisos que inspiram nossa missão",
          },
          {
            id: "gal-ca-5",
            image: "/images/casa-amarela-conquista-especial.jpg",
            alt: "Retrato sorridente de uma criança",
            title: "Uma conquista especial",
            subtitle: "Desenvolvimento a cada passo",
          },
          {
            id: "gal-ca-6",
            image: "/images/acao-comunitaria-plantio-jardim.jpg",
            alt: "Voluntários e crianças cuidando de um pequeno jardim",
            title: "Ação comunitária",
            subtitle: "Plantio e cuidado com o ambiente",
          },
        ],
      },
      {
        id: "cards-ca",
        type: "cards",
        kicker: "Frentes de apoio",
        title: "Eixos de atendimento na unidade",
        columns: 4,
        items: [
          {
            id: "c-1",
            icon: "fa-utensils",
            title: "Alimentação",
            description: "Almoço e lanche preparados com carinho para as crianças atendidas.",
          },
          {
            id: "c-2",
            icon: "fa-hands-holding-child",
            title: "Acolhimento",
            description: "Atenção de voluntários e vínculo comunitário seguro.",
          },
          {
            id: "c-3",
            icon: "fa-soap",
            title: "Higiene",
            description: "Banho, lavagem das mãos e estímulo ao autocuidado.",
          },
          {
            id: "c-4",
            icon: "fa-puzzle-piece",
            title: "Brincar e conviver",
            description: "Playground, jogos pedagógicos e vivências coletivas.",
          },
        ],
      },
      {
        id: "contact-ca",
        type: "contact",
        kicker: "Localização e contato público",
        title: "Jardim Gramacho · Duque de Caxias/RJ",
        description:
          "A Casa Amarela está localizada na Rua Tocantins, nº 30, Jardim Gramacho, Duque de Caxias/RJ. Confirme previamente dias e horários de funcionamento antes de realizar visitas presenciais.",
        address: "Rua Tocantins, nº 30 — Jardim Gramacho, Duque de Caxias/RJ",
        instagram: "https://www.instagram.com/ahamoremacao/",
        links: [
          {
            id: "lk-1",
            label: "Ver Instagram Oficial",
            url: "https://www.instagram.com/ahamoremacao/",
            style: "primary",
          },
          {
            id: "lk-2",
            label: "Reportagem Rádio 93 FM",
            url: "https://radio93.com.br/noticias/espaco-arolde-oliveira/espaco-social-conheca-o-projeto-que-abencoa-criancas-em-jardim-gramacho/",
            style: "secondary",
          },
        ],
      },
    ],
  },
  {
    id: "action-nordeste",
    slug: "nordeste",
    title: "Ações no Nordeste",
    navSubtitle: "Atividades em Matões do Norte/MA",
    kicker: "Registros enviados · Maranhão",
    description:
      "Registros fotográficos compartilhados mostram atividades comunitárias e oficinas infantis em Matões do Norte, no Maranhão.",
    coverImage: "/images/nordeste-matoes-encontro-comunitario.jpg",
    coverImageAlt: "Encontro comunitário em Matões do Norte",
    status: "published",
    featuredInNav: true,
    createdAt: "2024-01-02T12:00:00.000Z",
    updatedAt: "2024-01-02T12:00:00.000Z",
    seoTitle: "Ações no Nordeste — Matões do Norte (MA) | Amor em Ação",
    seoDescription:
      "Registros fotográficos de atividades comunitárias e oficinas infantis promovidas em Matões do Norte, Maranhão.",
    blocks: [
      {
        id: "hero-ne",
        type: "hero",
        kicker: "Registros enviados · Maranhão",
        title: "Ações no Nordeste",
        subtitle:
          "Registros fotográficos compartilhados pela associação mostram atividades com crianças em Matões do Norte, Maranhão.",
        primaryButtonText: "Seja voluntário",
        primaryButtonLink: "/voluntariado",
      },
      {
        id: "gallery-ne",
        type: "gallery",
        kicker: "Matões do Norte · Maranhão",
        title: "Momentos de convivência e atividades com crianças",
        description:
          "Fotografias enviadas retratando momentos de recreação, desenho e distribuição de brinquedos no interior do Maranhão.",
        columns: 4,
        items: [
          {
            id: "gal-ne-1",
            image: "/images/nordeste-matoes-brincar-compartilhar.jpg",
            alt: "Criança segurando um brinquedo em Matões do Norte",
            title: "Brincar e compartilhar",
            subtitle: "Matões do Norte/MA",
          },
          {
            id: "gal-ne-2",
            image: "/images/nordeste-matoes-entrega-presente.jpg",
            alt: "Menina segurando uma caixa de bonecas",
            title: "Entrega de presentes",
            subtitle: "Alegria e carinho comunitário",
          },
          {
            id: "gal-ne-3",
            image: "/images/nordeste-matoes-atividade-desenho.jpg",
            alt: "Criança participando de atividade de desenho",
            title: "Atividade de desenho",
            subtitle: "Expressão artística e estímulo",
          },
          {
            id: "gal-ne-4",
            image: "/images/nordeste-matoes-encontro-comunitario.jpg",
            alt: "Encontro de crianças e adultos ao ar livre",
            title: "Encontro comunitário",
            subtitle: "União e presença no sertão",
          },
        ],
      },
      {
        id: "cta-ne",
        type: "cta",
        kicker: "Como fazer parte",
        title: "Leve esperança para onde ela é mais urgente",
        description:
          "Participe das nossas frentes de ação pelo Brasil com voluntariado, mobilização ou doação pontual.",
        buttonText: "Quero ser voluntário",
        buttonLink: "/voluntariado",
        secondaryButtonText: "Falar no WhatsApp",
        secondaryButtonLink: "https://wa.me/5521999999999",
      },
    ],
  },
  {
    id: "action-atuacao-internacional",
    slug: "atuacao-internacional",
    title: "Atuação internacional",
    navSubtitle: "Água e educação no Malawi",
    kicker: "Informação em apuração",
    description:
      "Registros históricos sobre ações comunitárias, construção de salas de aula e perfuração de poços de água no Malawi.",
    coverImage: "/images/malawi-acesso-agua-poco.jpg",
    coverImageAlt: "Criança bebendo água de uma torneira de poço no Malawi",
    status: "published",
    featuredInNav: true,
    createdAt: "2024-01-03T12:00:00.000Z",
    updatedAt: "2024-01-03T12:00:00.000Z",
    seoTitle: "Atuação Internacional — Registros no Malawi | Amor em Ação",
    seoDescription:
      "Registros históricos de ações comunitárias, construção de salas de aula e acesso à água no Malawi.",
    blocks: [
      {
        id: "hero-mw",
        type: "hero",
        kicker: "Informação em apuração",
        title: "Atuação internacional",
        subtitle:
          "Registros históricos de ações humanitárias e comunitárias no continente africano, com foco em água potável e educação.",
        primaryButtonText: "Conhecer projetos",
        primaryButtonLink: "/acoes",
      },
      {
        id: "gallery-mw",
        type: "gallery",
        kicker: "Registros históricos enviados",
        title: "Publicações sobre ações no Malawi",
        description:
          "Imagens extraídas de registros de missões humanitárias com foco em acesso à água tratada e melhoria da infraestrutura escolar.",
        columns: 4,
        items: [
          {
            id: "gal-mw-1",
            image: "/images/malawi-construcao-salas-aula.jpg",
            alt: "Construção de salas de aula no Malawi",
            title: "Salas de aula",
            subtitle: "Infraestrutura para aprendizagem",
          },
          {
            id: "gal-mw-2",
            image: "/images/malawi-acesso-agua-poco.jpg",
            alt: "Criança bebendo água de uma torneira de poço",
            title: "Acesso à água potável",
            subtitle: "Poços artesianos para a comunidade",
          },
          {
            id: "gal-mw-3",
            image: "/images/malawi-construcao-comunitaria.jpg",
            alt: "Crianças e voluntários durante construção",
            title: "Construção comunitária",
            subtitle: "Participação coletiva",
          },
          {
            id: "gal-mw-4",
            image: "/images/malawi-poco-agua-potavel.jpg",
            alt: "Poço artesiano instalado no vilarejo",
            title: "Saneamento básico",
            subtitle: "Dignidade e saúde",
          },
        ],
      },
      {
        id: "quote-mw",
        type: "quote",
        variant: "note",
        quote:
          "Registros de campo documentam momentos específicos de viagem e apoio internacional. As informações detalhadas e o status atual dos projetos podem ser solicitados formalmente à associação.",
        source: "Comunicação Institucional Amor em Ação",
      },
      {
        id: "cta-mw",
        type: "cta",
        kicker: "Apoie nossas frentes",
        title: "Apoie a transformação de vidas",
        description:
          "Sua contribuição apoia ações no Brasil e onde houver vulnerabilidade social extrema.",
        buttonText: "Fazer uma doação",
        buttonLink: "#doar",
      },
    ],
  },
];

let localActionsStore: ActionMission[] = [...DEFAULT_ACTION_MISSIONS];

function rowToAction(row: any): ActionMission {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    navSubtitle: row.nav_subtitle || "",
    kicker: row.kicker || "Ação Comunitária",
    description: row.description || "",
    coverImage: row.cover_image || "/images/casa-amarela-equipe-criancas.jpg",
    coverImageAlt: row.cover_image_alt || row.title,
    status: row.status === "draft" ? "draft" : "published",
    featuredInNav: row.featured_in_nav ?? true,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
    seoTitle: row.seo_title || undefined,
    seoDescription: row.seo_description || undefined,
    blocks: Array.isArray(row.blocks) ? row.blocks : [],
  };
}

/**
 * Retorna todas as missões (ou apenas as publicadas para visitantes).
 */
export async function getAllActionsAsync({
  includeDrafts = false,
}: {
  includeDrafts?: boolean;
} = {}): Promise<{ actions: ActionMission[]; storage: "supabase" | "local" }> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      let query = supabase
        .from("action_missions")
        .select("*")
        .order("created_at", { ascending: false });

      if (!includeDrafts) {
        query = query.eq("status", "published");
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return {
          actions: data.map(rowToAction),
          storage: "supabase",
        };
      }

      // Se a tabela no Supabase estiver vazia, sincroniza as 3 ações iniciais padrão
      if (!error && data && data.length === 0) {
        for (const mission of DEFAULT_ACTION_MISSIONS) {
          await supabase.from("action_missions").insert({
            id: mission.id,
            slug: mission.slug,
            title: mission.title,
            nav_subtitle: mission.navSubtitle,
            kicker: mission.kicker,
            description: mission.description,
            cover_image: mission.coverImage,
            cover_image_alt: mission.coverImageAlt,
            status: mission.status,
            featured_in_nav: mission.featuredInNav,
            blocks: mission.blocks,
            created_at: mission.createdAt,
            updated_at: mission.updatedAt,
            seo_title: mission.seoTitle,
            seo_description: mission.seoDescription,
          });
        }
        return {
          actions: DEFAULT_ACTION_MISSIONS,
          storage: "supabase",
        };
      }
    } catch {
      // Ignorar e usar local
    }
  }

  const list = includeDrafts
    ? localActionsStore
    : localActionsStore.filter((a) => a.status === "published");

  return {
    actions: [...list].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    storage: "local",
  };
}

/**
 * Retorna exatamente as 3 ações mais recentes adicionadas para exibição no dropdown "Nossas ações"
 */
export async function getRecentNavActionsAsync(
  limit = 3
): Promise<ActionNavSummary[]> {
  const { actions } = await getAllActionsAsync({ includeDrafts: false });
  const featured = actions.filter((a) => a.featuredInNav !== false);
  const items = featured.length > 0 ? featured : actions;

  return items.slice(0, limit).map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    navSubtitle: a.navSubtitle || a.kicker || "Conheça a iniciativa",
    coverImage: a.coverImage,
    createdAt: a.createdAt,
  }));
}

/**
 * Busca uma ação individual pelo slug
 */
export async function getActionBySlugAsync(
  slug: string
): Promise<ActionMission | null> {
  const cleanSlug = slug.toLowerCase().trim();
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("action_missions")
        .select("*")
        .eq("slug", cleanSlug)
        .maybeSingle();

      if (!error && data) {
        return rowToAction(data);
      }
    } catch {
      // Ignorar
    }
  }

  const found = localActionsStore.find(
    (a) => a.slug.toLowerCase().trim() === cleanSlug
  );
  return found || null;
}

/**
 * Cria ou atualiza uma ação/missão
 */
export async function upsertActionAsync(
  payload: Partial<ActionMission> & { title: string; slug: string }
): Promise<{ action: ActionMission; storage: "supabase" | "local" }> {
  const now = new Date().toISOString();
  const id =
    payload.id ||
    `action-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

  const missionToSave: ActionMission = {
    id,
    slug: payload.slug.trim().toLowerCase(),
    title: payload.title.trim(),
    navSubtitle: payload.navSubtitle?.trim() || "",
    kicker: payload.kicker?.trim() || "Ação Comunitária",
    description: payload.description?.trim() || "",
    coverImage:
      payload.coverImage || "/images/casa-amarela-equipe-criancas.jpg",
    coverImageAlt: payload.coverImageAlt?.trim() || payload.title.trim(),
    status: payload.status === "draft" ? "draft" : "published",
    featuredInNav: payload.featuredInNav ?? true,
    createdAt: payload.createdAt || now,
    updatedAt: now,
    seoTitle: payload.seoTitle?.trim() || `${payload.title} | Amor em Ação`,
    seoDescription: payload.seoDescription?.trim() || payload.description?.trim() || "",
    blocks: Array.isArray(payload.blocks) ? payload.blocks : [],
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const dbRow = {
        id: missionToSave.id,
        slug: missionToSave.slug,
        title: missionToSave.title,
        nav_subtitle: missionToSave.navSubtitle,
        kicker: missionToSave.kicker,
        description: missionToSave.description,
        cover_image: missionToSave.coverImage,
        cover_image_alt: missionToSave.coverImageAlt,
        status: missionToSave.status,
        featured_in_nav: missionToSave.featuredInNav,
        blocks: missionToSave.blocks,
        created_at: missionToSave.createdAt,
        updated_at: missionToSave.updatedAt,
        seo_title: missionToSave.seoTitle,
        seo_description: missionToSave.seoDescription,
      };

      const { data, error } = await supabase
        .from("action_missions")
        .upsert(dbRow, { onConflict: "slug" })
        .select()
        .single();

      if (!error && data) {
        return {
          action: rowToAction(data),
          storage: "supabase",
        };
      }
    } catch {
      // Ignorar e salvar local
    }
  }

  const existingIndex = localActionsStore.findIndex(
    (a) => a.id === missionToSave.id || a.slug === missionToSave.slug
  );

  if (existingIndex >= 0) {
    localActionsStore[existingIndex] = missionToSave;
  } else {
    localActionsStore.unshift(missionToSave);
  }

  return {
    action: missionToSave,
    storage: "local",
  };
}

/**
 * Remove uma ação pelo ID
 */
export async function deleteActionAsync(
  id: string
): Promise<{ success: boolean; storage: "supabase" | "local" }> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { error } = await supabase
        .from("action_missions")
        .delete()
        .eq("id", id);
      if (!error) {
        return { success: true, storage: "supabase" };
      }
    } catch {
      // Ignorar
    }
  }

  localActionsStore = localActionsStore.filter((a) => a.id !== id);
  return { success: true, storage: "local" };
}
