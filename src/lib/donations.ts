import { getSupabaseAdmin } from "@/lib/supabase";
import type {
  DonationRecord,
  DonationFrequency,
  DonationStatus,
} from "@/lib/donation-types";

interface SupabaseDonationRow {
  id: string;
  stripe_session_id: string | null;
  donor_name: string | null;
  donor_email: string | null;
  amount_cents: number;
  currency: string;
  frequency: DonationFrequency;
  project: string;
  status: DonationStatus;
  payment_method: "stripe" | "pix" | "transfer" | "manual";
  notes: string | null;
  created_at: string;
  updated_at: string;
}

let memoryDonations: DonationRecord[] = [];

function rowToDonation(row: SupabaseDonationRow): DonationRecord {
  return {
    id: row.id,
    stripeSessionId: row.stripe_session_id,
    donorName: row.donor_name,
    donorEmail: row.donor_email,
    amountCents: row.amount_cents,
    currency: row.currency || "BRL",
    frequency: row.frequency || "once",
    project: row.project || "casa-amarela",
    status: row.status || "pending",
    paymentMethod: row.payment_method || "stripe",
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listDonations(): Promise<{
  donations: DonationRecord[];
  storage: "supabase" | "local";
}> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && Array.isArray(data)) {
        return {
          donations: (data as SupabaseDonationRow[]).map(rowToDonation),
          storage: "supabase",
        };
      }
    } catch {
      // Fallback if table does not exist yet
    }
  }
  return {
    donations: [...memoryDonations].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    storage: "local",
  };
}

export async function createDonationRecord(
  input: Omit<DonationRecord, "id" | "createdAt" | "updatedAt"> & { id?: string }
): Promise<DonationRecord> {
  const now = new Date().toISOString();
  const record: DonationRecord = {
    id: input.id || `don-${Date.now()}`,
    stripeSessionId: input.stripeSessionId ?? null,
    donorName: input.donorName ?? null,
    donorEmail: input.donorEmail ?? null,
    amountCents: input.amountCents,
    currency: input.currency || "BRL",
    frequency: input.frequency || "once",
    project: input.project || "casa-amarela",
    status: input.status || "pending",
    paymentMethod: input.paymentMethod || "stripe",
    notes: input.notes ?? null,
    createdAt: now,
    updatedAt: now,
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("donations")
      .insert({
        stripe_session_id: record.stripeSessionId,
        donor_name: record.donorName,
        donor_email: record.donorEmail,
        amount_cents: record.amountCents,
        currency: record.currency,
        frequency: record.frequency,
        project: record.project,
        status: record.status,
        payment_method: record.paymentMethod,
        notes: record.notes,
      })
      .select("*")
      .single();
    if (!error && data) {
      return rowToDonation(data as SupabaseDonationRow);
    }
  }

  memoryDonations.unshift(record);
  return record;
}

export async function updateDonationBySessionOrId(params: {
  id?: string;
  stripeSessionId?: string;
  status?: DonationStatus;
  donorName?: string | null;
  donorEmail?: string | null;
  notes?: string | null;
}): Promise<DonationRecord | null> {
  const now = new Date().toISOString();
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const patch: Record<string, unknown> = { updated_at: now };
    if (params.status) patch.status = params.status;
    if (params.donorName !== undefined) patch.donor_name = params.donorName;
    if (params.donorEmail !== undefined) patch.donor_email = params.donorEmail;
    if (params.notes !== undefined) patch.notes = params.notes;

    const query = supabase.from("donations").update(patch);
    const filtered = params.id
      ? query.eq("id", params.id)
      : query.eq("stripe_session_id", params.stripeSessionId ?? "");

    const { data, error } = await filtered.select("*").single();
    if (!error && data) {
      return rowToDonation(data as SupabaseDonationRow);
    }
  }

  const idx = memoryDonations.findIndex(
    (d) =>
      (params.id && d.id === params.id) ||
      (params.stripeSessionId && d.stripeSessionId === params.stripeSessionId)
  );
  if (idx === -1) return null;

  memoryDonations[idx] = {
    ...memoryDonations[idx],
    ...(params.status ? { status: params.status } : {}),
    ...(params.donorName !== undefined ? { donorName: params.donorName } : {}),
    ...(params.donorEmail !== undefined
      ? { donorEmail: params.donorEmail }
      : {}),
    ...(params.notes !== undefined ? { notes: params.notes } : {}),
    updatedAt: now,
  };
  return memoryDonations[idx];
}

export async function deleteDonationById(id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("donations").delete().eq("id", id);
    if (!error) return true;
  }
  const before = memoryDonations.length;
  memoryDonations = memoryDonations.filter((d) => d.id !== id);
  return memoryDonations.length < before;
}
