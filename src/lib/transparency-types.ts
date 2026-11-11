export type TransparencyCategory =
  | "institucional"
  | "financeiro"
  | "atividades"
  | "fontes";

export const TRANSPARENCY_CATEGORY_LABELS: Record<TransparencyCategory, string> = {
  institucional: "Documentos Institucionais & Estatuto",
  financeiro: "Balanços & Demonstrações Financeiras",
  atividades: "Relatórios de Atividades & Impacto",
  fontes: "Fontes Públicas & Registros de Mídia",
};

export interface TransparencyDocument {
  id: string;
  title: string;
  category: TransparencyCategory;
  year?: string;
  fileUrl: string;
  fileSize?: string;
  description?: string;
  publishedAt: string;
  active: boolean;
  orderIndex: number;
}
