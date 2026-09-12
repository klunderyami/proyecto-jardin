"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import type { PricingConfig } from "@/types/database";
import { calculateQuote, formatUsd } from "@/lib/pricing";
import { createClient } from "@/lib/supabase/client";
import { updatePricingConfig } from "@/lib/supabase/data";

const FALLBACK: PricingConfig = {
  id: "",
  base_rate_per_sqft: 0.035,
  min_price: 39,
  tier_1000: 0.045,
  tier_5000: 0.035,
  tier_10000: 0.028,
  mulch_extra: 0,
  bag_haul_extra: 30,
  updated_at: null,
};

const FIELDS: { key: keyof PricingConfig; label: string; step: string }[] = [
  { key: "base_rate_per_sqft", label: "Tarifa base por sq ft (USD)", step: "0.0001" },
  { key: "min_price", label: "Precio mínimo del servicio (USD)", step: "1" },
  { key: "tier_1000", label: "Tarifa jardines < 1,000 sq ft", step: "0.0001" },
  { key: "tier_5000", label: "Tarifa 1,000 – 5,000 sq ft", step: "0.0001" },
  { key: "tier_10000", label: "Tarifa > 5,000 sq ft", step: "0.0001" },
  { key: "mulch_extra", label: "Recargo Mulch (USD)", step: "1" },
  { key: "bag_haul_extra", label: "Recargo Bag & Haul (USD)", step: "1" },
];

type NumericKey =
  | "base_rate_per_sqft"
  | "min_price"
  | "tier_1000"
  | "tier_5000"
  | "tier_10000"
  | "mulch_extra"
  | "bag_haul_extra";

interface PricingTabProps {
  initialPricing: PricingConfig | null;
}

export function PricingTab({ initialPricing }: PricingTabProps) {
  const [cfg, setCfg] = useState<PricingConfig>(initialPricing ?? FALLBACK);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const [previewSqft, setPreviewSqft] = useState(2000);
  const [previewWaste, setPreviewWaste] = useState<"mulch" | "bag_haul" | null>(null);
  const preview = calculateQuote(cfg, Math.max(0, previewSqft || 0), previewWaste);

  function setField(key: NumericKey, raw: string) {
    const value = Number(raw);
    if (Number.isNaN(value)) return;
    setCfg((prev) => ({ ...prev, [key]: value }));
    setSavedMsg(null);
  }

  async function handleSave() {
    const client = createClient();
    if (!client || !cfg.id) {
      setSavedMsg("⚠️ Supabase no está configurado o no hay fila de tarifario todavía.");
      return;
    }
    setSaving(true);
    const ok = await updatePricingConfig(client, cfg.id, {
      base_rate_per_sqft: cfg.base_rate_per_sqft,
      min_price: cfg.min_price,
      tier_1000: cfg.tier_1000,
      tier_5000: cfg.tier_5000,
      tier_10000: cfg.tier_10000,
      mulch_extra: cfg.mulch_extra,
      bag_haul_extra: cfg.bag_haul_extra,
    });
    setSaving(false);
    setSavedMsg(ok ? "✅ Tarifario guardado correctamente." : "❌ Error al guardar (revisa la consola).");
  }
return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Formulario de tarifas */}
        <div className="flex-1 rounded-2xl border border-neutral-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            Tarifario no-code
          </h2>
          <div className="flex flex-col gap-3">
            {FIELDS.map(({ key, label, step }) => (
              <label key={key} className="flex flex-col gap-1 text-sm text-neutral-700">
                {label}
                <input
                  type="number"
                  step={step}
                  min="0"
                  value={cfg[key as NumericKey]}
                  onChange={(e) => setField(key as NumericKey, e.target.value)}
                  className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                />
              </label>
            ))}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
            >
              <Save className="h-4 w-4" aria-hidden />
              {saving ? "Guardando…" : "Guardar tarifario"}
            </button>
            {savedMsg ? (
              <p className="text-sm text-neutral-600">{savedMsg}</p>
            ) : null}
          </div>
        </div>

        {/* Calculadora de vista previa */}
        <div className="w-full rounded-2xl border border-brand-200 bg-brand-50 p-5 lg:w-80">
          <h2 className="mb-4 text-lg font-semibold text-brand-900">
            Calculadora (vista previa)
          </h2>
          <div className="flex flex-col gap-3 text-sm">
            <label className="flex flex-col gap-1 text-neutral-700">
              Área (sq ft)
              <input
                type="number"
                min="0"
                value={previewSqft}
                onChange={(e) => setPreviewSqft(Number(e.target.value))}
                className="rounded-lg border border-brand-300 bg-white px-3 py-2 focus:border-brand-600 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-neutral-700">
              Residuos
              <select
                value={previewWaste ?? ""}
                onChange={(e) =>
                  setPreviewWaste(
                    (e.target.value || null) as "mulch" | "bag_haul" | null
                  )
                }
                className="rounded-lg border border-brand-300 bg-white px-3 py-2 focus:border-brand-600 focus:outline-none"
              >
                <option value="">Sin recargo</option>
                <option value="mulch">Mulch</option>
                <option value="bag_haul">Bag &amp; Haul</option>
              </select>
            </label>

            <dl className="mt-2 flex flex-col gap-1 rounded-xl bg-white p-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-500">Tarifa por sq ft</dt>
                <dd className="font-medium">${preview.ratePerSqft.toFixed(4)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Subtotal</dt>
                <dd className="font-medium">{formatUsd(preview.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Recargo residuos</dt>
                <dd className="font-medium">{formatUsd(preview.wasteExtra)}</dd>
              </div>
              <div className="mt-1 flex justify-between border-t border-neutral-100 pt-2 text-base font-semibold text-brand-800">
                <dt>Total estimado</dt>
                <dd>{formatUsd(preview.total)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}