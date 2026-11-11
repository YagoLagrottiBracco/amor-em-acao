import { getSupabaseAdmin } from "@/lib/supabase";
import type {
  TransparencyDocument,
  TransparencyCategory,
} from "@/lib/transparency-types";

export const DEFAULT_TRANSPARENCY_DOCUMENTS: TransparencyDocument[] = [
  {
    id: "doc-cnpj",
    title: "Comprovante de Inscrição e Situação Cadastral (CNPJ)",
    category: "institucional",
    year: "Ativo",
    fileUrl:
      "https://www.consultascnpj.com/associacao-humanitaria-amor-em-acao/21960082000196",
    fileSize: "Consulta Oficial",
    description:
      "CNPJ 21.960.082/0001-96 associado à Associação Humanitária Amor em Ação com sede em Duque de Caxias/RJ.",
    publishedAt: "2024-01-01T12:00:00.000Z",
    active: true,
    orderIndex: 1,
  },
  {
    id: "doc-radio93",
    title: "Reportagem Rádio 93 FM — Projeto Social em Jardim Gramacho",
    category: "fontes",
    year: "2023",
    fileUrl:
      "https://radio93.com.br/noticias/espaco-arolde-oliveira/espaco-social-conheca-o-projeto-que-abencoa-criancas-em-jardim-gramacho/",
    fileSize: "Mídia Externa",
    description:
      "Matéria veiculada em 11 de abril de 2023 sobre o acolhimento, alimentação e higiene de crianças na Casa Amarela.",
    publishedAt: "2023-04-11T12:00:00.000Z",
    active: true,
    orderIndex: 2,
  },
  {
    id: "doc-vtsolucoes",
    title: "Registro de Apoio Comunitário — VT Soluções",
    category: "fontes",
    year: "2021",
    fileUrl:
      "https://www.vtsolucoes.com.br/vt-solucoes-doa-mil-reais-em-compras-para-a-casa-amarela/",
    fileSize: "Mídia Externa",
    description:
      "Publicação de apoio e compras de mantimentos para a unidade da Casa Amarela em 2021.",
    publishedAt: "2021-05-10T12:00:00.000Z",
    active: true,
    orderIndex: 3,
  },
  {
    id: "doc-associacao-ide",
    title: "Referência de Parceria e Missões Urbanas — Associação IDE",
    category: "fontes",
    year: "2022",
    fileUrl: "https://associacaoide.org.br/missoes-urbanas/",
    fileSize: "Mídia Externa",
    description:
      "Registro de visitas e ações sociais conjuntas realizadas com a comunidade local.",
    publishedAt: "2022-09-01T12:00:00.000Z",
    active: true,
    orderIndex: 4,
  },
  {
    id: "doc-instagram-oficial",
    title: "Canal Público Oficial no Instagram (@ahamoremacao)",
    category: "fontes",
    year: "Contínuo",
    fileUrl: "https://www.instagram.com/ahamoremacao/",
    fileSize: "Rede Social",
    description:
      "Canal público com registros em foto e vídeo das atividades e convocações da associação.",
    publishedAt: "2024-01-01T12:00:00.000Z",
    active: true,
    orderIndex: 5,
  },
];

let localTransparencyStore: TransparencyDocument[] = [
  ...DEFAULT_TRANSPARENCY_DOCUMENTS,
];

function rowToDoc(row: any): TransparencyDocument {
  return {
    id: row.id,
    title: row.title,
    category: row.category as TransparencyCategory,
    year: row.year || undefined,
    fileUrl: row.file_url,
    fileSize: row.file_size || undefined,
    description: row.description || undefined,
    publishedAt: row.published_at || new Date().toISOString(),
    active: row.active ?? true,
    orderIndex: row.order_index ?? 0,
  };
}

export async function getAllTransparencyDocsAsync({
  includeInactive = false,
}: {
  includeInactive?: boolean;
} = {}): Promise<{
  documents: TransparencyDocument[];
  storage: "supabase" | "local";
}> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      let query = supabase
        .from("transparency_documents")
        .select("*")
        .order("order_index", { ascending: true })
        .order("published_at", { ascending: false });

      if (!includeInactive) {
        query = query.eq("active", true);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return {
          documents: data.map(rowToDoc),
          storage: "supabase",
        };
      }

      if (!error && data && data.length === 0) {
        for (const doc of DEFAULT_TRANSPARENCY_DOCUMENTS) {
          await supabase.from("transparency_documents").insert({
            id: doc.id,
            title: doc.title,
            category: doc.category,
            year: doc.year,
            file_url: doc.fileUrl,
            file_size: doc.fileSize,
            description: doc.description,
            published_at: doc.publishedAt,
            active: doc.active,
            order_index: doc.orderIndex,
          });
        }
        return {
          documents: DEFAULT_TRANSPARENCY_DOCUMENTS,
          storage: "supabase",
        };
      }
    } catch {
      // Ignorar e usar local
    }
  }

  const list = includeInactive
    ? localTransparencyStore
    : localTransparencyStore.filter((d) => d.active);

  return {
    documents: [...list].sort(
      (a, b) =>
        a.orderIndex - b.orderIndex ||
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    ),
    storage: "local",
  };
}

export async function upsertTransparencyDocAsync(
  payload: Partial<TransparencyDocument> & {
    title: string;
    fileUrl: string;
    category: TransparencyCategory;
  }
): Promise<{ document: TransparencyDocument; storage: "supabase" | "local" }> {
  const id =
    payload.id ||
    `doc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const now = new Date().toISOString();

  const docToSave: TransparencyDocument = {
    id,
    title: payload.title.trim(),
    category: payload.category,
    year: payload.year?.trim() || undefined,
    fileUrl: payload.fileUrl.trim(),
    fileSize: payload.fileSize?.trim() || undefined,
    description: payload.description?.trim() || undefined,
    publishedAt: payload.publishedAt || now,
    active: payload.active ?? true,
    orderIndex: payload.orderIndex ?? 0,
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const dbRow = {
        id: docToSave.id,
        title: docToSave.title,
        category: docToSave.category,
        year: docToSave.year,
        file_url: docToSave.fileUrl,
        file_size: docToSave.fileSize,
        description: docToSave.description,
        published_at: docToSave.publishedAt,
        active: docToSave.active,
        order_index: docToSave.orderIndex,
      };

      const { data, error } = await supabase
        .from("transparency_documents")
        .upsert(dbRow)
        .select()
        .single();

      if (!error && data) {
        return {
          document: rowToDoc(data),
          storage: "supabase",
        };
      }
    } catch {
      // Ignorar
    }
  }

  const existingIndex = localTransparencyStore.findIndex(
    (d) => d.id === docToSave.id
  );
  if (existingIndex >= 0) {
    localTransparencyStore[existingIndex] = docToSave;
  } else {
    localTransparencyStore.unshift(docToSave);
  }

  return {
    document: docToSave,
    storage: "local",
  };
}

export async function deleteTransparencyDocAsync(
  id: string
): Promise<{ success: boolean; storage: "supabase" | "local" }> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { error } = await supabase
        .from("transparency_documents")
        .delete()
        .eq("id", id);
      if (!error) {
        return { success: true, storage: "supabase" };
      }
    } catch {
      // Ignorar
    }
  }

  localTransparencyStore = localTransparencyStore.filter((d) => d.id !== id);
  return { success: true, storage: "local" };
}
