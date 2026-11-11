export type DonationStatus = "pending" | "paid" | "failed" | "canceled";
export type DonationFrequency = "once" | "monthly";

export interface DonationRecord {
  id: string;
  stripeSessionId?: string | null;
  donorName?: string | null;
  donorEmail?: string | null;
  amountCents: number;
  currency: string;
  frequency: DonationFrequency;
  project: string;
  status: DonationStatus;
  paymentMethod: "stripe" | "pix" | "transfer" | "manual";
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const PROJECT_LABELS: Record<string, string> = {
  "casa-amarela": "Casa Amarela (Jardim Gramacho · RJ)",
  alimentacao: "Alimentação e Higiene Infantil",
  oficinas: "Oficinas, Educação e Cultura",
  geral: "Fundo Geral — Onde for mais urgente",
};
