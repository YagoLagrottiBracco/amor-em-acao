export type VolunteerStatus = "new" | "contacted" | "active" | "archived";

export interface VolunteerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  area: string;
  availability: string;
  message?: string | null;
  status: VolunteerStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const VOLUNTEER_STATUS_LABELS: Record<VolunteerStatus, string> = {
  new: "Novo (aguardando contato)",
  contacted: "Contatado",
  active: "Ativo no voluntariado",
  archived: "Arquivado",
};
