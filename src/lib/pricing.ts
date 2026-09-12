import type { PricingConfig } from "@/types/database";

export interface QuoteBreakdown {
  ratePerSqft: number;
  subtotal: number;
  wasteExtra: number;
  total: number;
}

export type WasteChoice = "mulch" | "bag_haul" | null;

/** Tarifa por sq ft según el rango de tamaño del jardín. */
export function pickRate(cfg: PricingConfig, sqft: number): number {
  if (sqft < 1000) return Number(cfg.tier_1000);
  if (sqft <= 5000) return Number(cfg.tier_5000);
  return Number(cfg.tier_10000);
}

/** Recargo por tratamiento de residuos (Mulch / Bag & Haul). */
export function wasteExtraFor(
  cfg: PricingConfig,
  waste: WasteChoice
): number {
  if (waste === "bag_haul") return Number(cfg.bag_haul_extra);
  if (waste === "mulch") return Number(cfg.mulch_extra);
  return 0;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Calcula la cotización:
 * subtotal = max(min_price, sqft * rate) + recargo por residuos.
 */
export function calculateQuote(
  cfg: PricingConfig,
  sqft: number,
  waste: WasteChoice = null
): QuoteBreakdown {
  const ratePerSqft = pickRate(cfg, sqft);
  const raw = sqft * ratePerSqft;
  const subtotal = Math.max(Number(cfg.min_price), round2(raw));
  const wasteExtra = wasteExtraFor(cfg, waste);
  return {
    ratePerSqft,
    subtotal,
    wasteExtra,
    total: round2(subtotal + wasteExtra),
  };
}

/** Formatea un monto en USD. */
export function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}