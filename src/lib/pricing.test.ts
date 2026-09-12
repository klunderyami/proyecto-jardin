import { describe, expect, it } from "vitest";
import type { PricingConfig } from "@/types/database";
import { calculateQuote, pickRate, wasteExtraFor } from "./pricing";

const cfg: PricingConfig = {
  id: "1",
  base_rate_per_sqft: 0.035,
  min_price: 39,
  tier_1000: 0.045,
  tier_5000: 0.035,
  tier_10000: 0.028,
  mulch_extra: 0,
  bag_haul_extra: 30,
  updated_at: null,
};

describe("pickRate", () => {
  it("usa la tarifa de tier según el rango", () => {
    expect(pickRate(cfg, 500)).toBe(0.045);
    expect(pickRate(cfg, 1000)).toBe(0.035);
    expect(pickRate(cfg, 3000)).toBe(0.035);
    expect(pickRate(cfg, 6000)).toBe(0.028);
    expect(pickRate(cfg, 50000)).toBe(0.028);
  });
});

describe("calculateQuote", () => {
  it("aplica el precio mínimo a jardines pequeños", () => {
    const q = calculateQuote(cfg, 500);
    expect(q.subtotal).toBe(39);
    expect(q.total).toBe(39);
  });

  it("calcula subtotal por sq ft en rangos medios", () => {
    const q = calculateQuote(cfg, 2000);
    expect(q.subtotal).toBe(70);
    expect(q.total).toBe(70);
  });

  it("suma recargo bag & haul", () => {
    const q = calculateQuote(cfg, 2000, "bag_haul");
    expect(q.wasteExtra).toBe(30);
    expect(q.total).toBe(100);
  });

  it("mulch no agrega recargo", () => {
    const q = calculateQuote(cfg, 2000, "mulch");
    expect(q.wasteExtra).toBe(0);
  });

  it("aplica descuento de tier para jardines grandes", () => {
    const q = calculateQuote(cfg, 10000);
    expect(q.ratePerSqft).toBe(0.028);
    expect(q.subtotal).toBe(280);
  });
});

describe("wasteExtraFor", () => {
  it("retorna 0 cuando no hay tratamiento definido", () => {
    expect(wasteExtraFor(cfg, null)).toBe(0);
  });
});