"use client";

import { useState } from "react";
import { Calculator, ClipboardList, Settings2, type LucideIcon } from "lucide-react";
import type { Lead, PricingConfig, SiteContent } from "@/types/database";
import { cn } from "@/lib/utils";
import { LeadsTab } from "./LeadsTab";
import { PricingTab } from "./PricingTab";
import { ContentTab } from "./ContentTab";

type TabId = "leads" | "pricing" | "content";

const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: "leads", label: "Leads / Cotizaciones", icon: ClipboardList },
  { id: "pricing", label: "Tarifario & Calculadora", icon: Calculator },
  { id: "content", label: "Gestor de Contenido", icon: Settings2 },
];

interface DashboardProps {
  envReady: boolean;
  initialLeads: Lead[];
  initialPricing: PricingConfig | null;
  initialContent: SiteContent[];
}

export function Dashboard({
  envReady,
  initialLeads,
  initialPricing,
  initialContent,
}: DashboardProps) {
  const [tab, setTab] = useState<TabId>("leads");

  return (
    <div>
      {!envReady && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          ⚠️ Supabase no está configurado. Agrega tus credenciales en{" "}
          <code className="rounded bg-amber-100 px-1">.env.local</code> para
          ver datos reales.
        </div>
      )}

      <nav
        className="mb-6 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Secciones del panel"
      >
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition",
              tab === id
                ? "bg-brand-600 text-white shadow-sm"
                : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </button>
        ))}
      </nav>

      {tab === "leads" && <LeadsTab initialLeads={initialLeads} />}
      {tab === "pricing" && <PricingTab initialPricing={initialPricing} />}
      {tab === "content" && <ContentTab initialContent={initialContent} />}
    </div>
  );
}