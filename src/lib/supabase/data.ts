import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Database,
  Lead,
  LeadInsert,
  LeadStatus,
  PricingConfig,
  PricingConfigUpdate,
  SiteContent,
} from "@/types/database";

export type Db = SupabaseClient<Database>;

/** Claves del contenido editable (site_content). */
export const CONTENT_KEYS = {
  coverageCities: "coverage_cities",
  contactPhone: "contact_phone",
  contactPhoneE164: "contact_phone_e164",
  contactEmail: "contact_email",
  brandName: "brand_name",
  tagline: "tagline",
  heroTitle: "hero_title",
  heroSubtitle: "hero_subtitle",
  gallery: "gallery",
} as const;

// ================== Tarifario ==================

export async function fetchPricingConfig(
  db: Db
): Promise<PricingConfig | null> {
  const { data, error } = await db
    .from("pricing_config")
    .select("*")
    .order("id")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[data] fetchPricingConfig:", error.message);
    return null;
  }
  return data;
}

export async function updatePricingConfig(
  db: Db,
  id: string,
  patch: PricingConfigUpdate
): Promise<boolean> {
  const { error } = await db.from("pricing_config").update(patch).eq("id", id);
  if (error) console.error("[data] updatePricingConfig:", error.message);
  return !error;
}

// ================== Contenido editable ==================

export async function fetchAllContent(db: Db): Promise<SiteContent[]> {
  const { data, error } = await db.from("site_content").select("*");
  if (error) {
    console.error("[data] fetchAllContent:", error.message);
    return [];
  }
  return data ?? [];
}

export async function fetchContentByKey(
  db: Db,
  key: string
): Promise<SiteContent | null> {
  const { data, error } = await db
    .from("site_content")
    .select("*")
    .eq("key", key)
    .maybeSingle();

  if (error) {
    console.error("[data] fetchContentByKey:", error.message);
    return null;
  }
  return data;
}

export async function upsertSiteContent(
  db: Db,
  key: string,
  valueEs: string,
  valueEn?: string
): Promise<boolean> {
  const { error } = await db.from("site_content").upsert(
    {
      key,
      value_es: valueEs,
      value_en: valueEn ?? valueEs,
    },
    { onConflict: "key" }
  );
  if (error) console.error("[data] upsertSiteContent:", error.message);
  return !error;
}

// ================== Leads ==================

export async function fetchLeads(
  db: Db,
  status: LeadStatus | "all" = "all"
): Promise<Lead[]> {
  let query = db
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[data] fetchLeads:", error.message);
    return [];
  }
  return data ?? [];
}

export async function updateLeadStatus(
  db: Db,
  id: string,
  status: LeadStatus
): Promise<boolean> {
  const { error } = await db.from("leads").update({ status }).eq("id", id);
  if (error) console.error("[data] updateLeadStatus:", error.message);
  return !error;
}

export async function deleteLead(db: Db, id: string): Promise<boolean> {
  const { error } = await db.from("leads").delete().eq("id", id);
  if (error) console.error("[data] deleteLead:", error.message);
  return !error;
}

/** Inserta una cotización desde el formulario público (RLS permite insert). */
export async function insertLead(
  db: Db,
  lead: LeadInsert
): Promise<Lead | null> {
  const { data, error } = await db
    .from("leads")
    .insert(lead)
    .select("*")
    .single();
  if (error) {
    console.error("[data] insertLead:", error.message);
    return null;
  }
  return data;
}