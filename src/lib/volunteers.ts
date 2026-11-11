import { getSupabaseAdmin } from "@/lib/supabase";
import type { VolunteerRecord, VolunteerStatus } from "@/lib/volunteer-types";

interface SupabaseVolunteerRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  area: string;
  availability: string;
  message: string | null;
  status: VolunteerStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

let memoryVolunteers: VolunteerRecord[] = [];

function rowToVolunteer(row: SupabaseVolunteerRow): VolunteerRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    area: row.area,
    availability: row.availability || "A combinar",
    message: row.message,
    status: row.status || "new",
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at || row.created_at,
  };
}

export async function listVolunteers(): Promise<{
  volunteers: VolunteerRecord[];
  storage: "supabase" | "local";
}> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("volunteers")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && Array.isArray(data)) {
        return {
          volunteers: (data as SupabaseVolunteerRow[]).map(rowToVolunteer),
          storage: "supabase",
        };
      }
    } catch {
      // Fallback caso a tabela ainda não tenha sido criada
    }
  }

  return {
    volunteers: [...memoryVolunteers].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    storage: "local",
  };
}

export async function createVolunteerRecord(input: {
  name: string;
  email: string;
  phone: string;
  area: string;
  availability?: string;
  message?: string | null;
}): Promise<VolunteerRecord> {
  const now = new Date().toISOString();
  const record: VolunteerRecord = {
    id: `vol-${Date.now()}`,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    area: input.area.trim(),
    availability: (input.availability || "A combinar").trim(),
    message: input.message?.trim() || null,
    status: "new",
    notes: null,
    createdAt: now,
    updatedAt: now,
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("volunteers")
      .insert({
        name: record.name,
        email: record.email,
        phone: record.phone,
        area: record.area,
        availability: record.availability,
        message: record.message,
        status: record.status,
      })
      .select("*")
      .single();
    if (!error && data) {
      return rowToVolunteer(data as SupabaseVolunteerRow);
    }
  }

  memoryVolunteers.unshift(record);
  return record;
}

export async function updateVolunteerById(params: {
  id: string;
  status?: VolunteerStatus;
  notes?: string | null;
}): Promise<VolunteerRecord | null> {
  const now = new Date().toISOString();
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const patch: Record<string, unknown> = { updated_at: now };
    if (params.status) patch.status = params.status;
    if (params.notes !== undefined) patch.notes = params.notes;

    const { data, error } = await supabase
      .from("volunteers")
      .update(patch)
      .eq("id", params.id)
      .select("*")
      .single();
    if (!error && data) {
      return rowToVolunteer(data as SupabaseVolunteerRow);
    }
  }

  const idx = memoryVolunteers.findIndex((v) => v.id === params.id);
  if (idx === -1) return null;
  memoryVolunteers[idx] = {
    ...memoryVolunteers[idx],
    ...(params.status ? { status: params.status } : {}),
    ...(params.notes !== undefined ? { notes: params.notes } : {}),
    updatedAt: now,
  };
  return memoryVolunteers[idx];
}

export async function deleteVolunteerById(id: string): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("volunteers").delete().eq("id", id);
    if (!error) return true;
  }
  const before = memoryVolunteers.length;
  memoryVolunteers = memoryVolunteers.filter((v) => v.id !== id);
  return memoryVolunteers.length < before;
}
