/**
 * Tipos de la base de datos Supabase (proyecto Nieto Green Care).
 * Espejo de supabase/migrations/0001_init.sql.
 * Se puede regenerar con `supabase gen types typescript`.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Locale = "es" | "en";
export type FrequencyKey = "one_time" | "weekly" | "bi_weekly";
export type WasteKey = "mulch" | "bag_haul";
export type SqftSource = "map" | "manual";
export type LeadStatus = "new" | "contacted" | "quoted" | "closed";

// ---------- app_settings ----------
export interface AppSetting {
  id: string;
  key: string;
  value: Json;
  updated_at: string | null;
}
export interface AppSettingInsert {
  key: string;
  value: Json;
}
export type AppSettingUpdate = Partial<AppSettingInsert>;

// ---------- price_tiers ----------
export interface PriceTier {
  id: string;
  min_sqft: number | null;
  max_sqft: number | null;
  price_per_sqft: number;
  active: boolean;
  sort: number | null;
  updated_at: string | null;
}
export interface PriceTierInsert {
  min_sqft?: number | null;
  max_sqft?: number | null;
  price_per_sqft: number;
  active?: boolean;
  sort?: number | null;
}
export type PriceTierUpdate = Partial<PriceTierInsert>;

// ---------- frequency_options ----------
export interface FrequencyOption {
  id: string;
  key: FrequencyKey;
  label_es: string;
  label_en: string;
  multiplier: number;
  active: boolean;
  sort: number | null;
}
export interface FrequencyOptionInsert {
  key: FrequencyKey;
  label_es: string;
  label_en: string;
  multiplier: number;
  active?: boolean;
  sort?: number | null;
}
export type FrequencyOptionUpdate = Partial<FrequencyOptionInsert>;

// ---------- waste_options ----------
export interface WasteOption {
  id: string;
  key: WasteKey;
  label_es: string;
  label_en: string;
  surcharge: number;
  active: boolean;
  sort: number | null;
}
export interface WasteOptionInsert {
  key: WasteKey;
  label_es: string;
  label_en: string;
  surcharge?: number;
  active?: boolean;
  sort?: number | null;
}
export type WasteOptionUpdate = Partial<WasteOptionInsert>;

// ---------- coverage_cities ----------
export interface CoverageCity {
  id: string;
  name: string;
  label_es: string | null;
  label_en: string | null;
  active: boolean;
  sort: number | null;
}
export interface CoverageCityInsert {
  name: string;
  label_es?: string | null;
  label_en?: string | null;
  active?: boolean;
  sort?: number | null;
}
export type CoverageCityUpdate = Partial<CoverageCityInsert>;

// ---------- gallery_items ----------
export interface GalleryItem {
  id: string;
  url: string;
  alt_es: string | null;
  alt_en: string | null;
  sort: number | null;
  active: boolean;
}
export interface GalleryItemInsert {
  url: string;
  alt_es?: string | null;
  alt_en?: string | null;
  sort?: number | null;
  active?: boolean;
}
export type GalleryItemUpdate = Partial<GalleryItemInsert>;

// ---------- lead_quotes ----------
export interface LeadQuote {
  id: string;
  created_at: string;
  locale: Locale;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string;
  address: string | null;
  city: string | null;
  lat: number | null;
  lng: number | null;
  sqft: number | null;
  sqft_source: SqftSource | null;
  manual_range: string | null;
  frequency_key: FrequencyKey | null;
  waste_key: WasteKey | null;
  price_per_sqft: number | null;
  total_price: number | null;
  payment_method: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  instructions: string | null;
  status: LeadStatus;
  notes: string | null;
}
export interface LeadQuoteInsert {
  locale: Locale;
  phone: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  lat?: number | null;
  lng?: number | null;
  sqft?: number | null;
  sqft_source?: SqftSource | null;
  manual_range?: string | null;
  frequency_key?: FrequencyKey | null;
  waste_key?: WasteKey | null;
  price_per_sqft?: number | null;
  total_price?: number | null;
  payment_method?: string | null;
  preferred_date?: string | null;
  preferred_time?: string | null;
  instructions?: string | null;
  status?: LeadStatus;
  notes?: string | null;
}
export type LeadQuoteUpdate = Partial<LeadQuoteInsert>;

// ---------- Database ----------
export interface Database {
  public: {
    Tables: {
      app_settings: {
        Row: AppSetting;
        Insert: AppSettingInsert;
        Update: AppSettingUpdate;
      };
      price_tiers: {
        Row: PriceTier;
        Insert: PriceTierInsert;
        Update: PriceTierUpdate;
      };
      frequency_options: {
        Row: FrequencyOption;
        Insert: FrequencyOptionInsert;
        Update: FrequencyOptionUpdate;
      };
      waste_options: {
        Row: WasteOption;
        Insert: WasteOptionInsert;
        Update: WasteOptionUpdate;
      };
      coverage_cities: {
        Row: CoverageCity;
        Insert: CoverageCityInsert;
        Update: CoverageCityUpdate;
      };
      gallery_items: {
        Row: GalleryItem;
        Insert: GalleryItemInsert;
        Update: GalleryItemUpdate;
      };
      lead_quotes: {
        Row: LeadQuote;
        Insert: LeadQuoteInsert;
        Update: LeadQuoteUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}