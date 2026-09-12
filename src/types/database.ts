/**
 * Tipos de la base de datos Supabase (Nieto Green Care · Fase 2).
 * Espejo de supabase/schema.sql.
 *
 * NOTA: Usamos `type` (no `interface`) para Row/Insert/Update porque
 * TypeScript solo otorga índice implícito (Record<string, unknown>) a
 * los object literal types, requisito del GenericTable de supabase-js.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type LeadStatus = "new" | "contacted" | "closed";
export type ServiceFreq = "one_time" | "weekly" | "bi_weekly";
export type WasteTreatment = "mulch" | "bag_haul";

// ---------- leads ----------
export type Lead = {
  id: string;
  created_at: string;
  client_name: string | null;
  phone: string;
  email: string | null;
  address: string | null;
  sq_ft: number | null;
  price_estimated: number | null;
  payment_pref: string | null;
  service_freq: ServiceFreq | null;
  waste_treatment: WasteTreatment | null;
  preferred_date: string | null;
  notes: string | null;
  status: LeadStatus;
};

export type LeadInsert = {
  phone: string;
  client_name?: string | null;
  email?: string | null;
  address?: string | null;
  sq_ft?: number | null;
  price_estimated?: number | null;
  payment_pref?: string | null;
  service_freq?: ServiceFreq | null;
  waste_treatment?: WasteTreatment | null;
  preferred_date?: string | null;
  notes?: string | null;
  status?: LeadStatus;
};

export type LeadUpdate = Partial<LeadInsert>;

// ---------- pricing_config ----------
export type PricingConfig = {
  id: string;
  base_rate_per_sqft: number;
  min_price: number;
  tier_1000: number;
  tier_5000: number;
  tier_10000: number;
  mulch_extra: number;
  bag_haul_extra: number;
  updated_at: string | null;
};

export type PricingConfigInsert = Partial<Omit<PricingConfig, "id">>;

export type PricingConfigUpdate = {
  base_rate_per_sqft?: number;
  min_price?: number;
  tier_1000?: number;
  tier_5000?: number;
  tier_10000?: number;
  mulch_extra?: number;
  bag_haul_extra?: number;
};

// ---------- site_content ----------
export type SiteContent = {
  id: string;
  key: string;
  value_es: string;
  value_en: string;
  updated_at: string | null;
};

export type SiteContentInsert = {
  key: string;
  value_es: string;
  value_en?: string;
};

export type SiteContentUpdate = Partial<Omit<SiteContentInsert, "key">>;

// ---------- Database ----------
export interface Database {
  public: {
    Tables: {
      leads: {
        Row: Lead;
        Insert: LeadInsert;
        Update: LeadUpdate;
        Relationships: [];
      };
      pricing_config: {
        Row: PricingConfig;
        Insert: PricingConfigInsert;
        Update: PricingConfigUpdate;
        Relationships: [];
      };
      site_content: {
        Row: SiteContent;
        Insert: SiteContentInsert;
        Update: SiteContentUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}