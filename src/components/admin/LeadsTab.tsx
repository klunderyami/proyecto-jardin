"use client";

import { useMemo, useState } from "react";
import Papa from "papaparse";
import { format } from "date-fns";
import { Download, Search, Trash2 } from "lucide-react";
import type { Lead, LeadStatus } from "@/types/database";
import { LEAD_STATUS_LABELS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { deleteLead, updateLeadStatus } from "@/lib/supabase/data";

type StatusFilter = LeadStatus | "all";

interface LeadsTabProps {
  initialLeads: Lead[];
}

export function LeadsTab({ initialLeads }: LeadsTabProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((lead) => {
      const okStatus = statusFilter === "all" || lead.status === statusFilter;
      const okSearch =
        q.length === 0 ||
        lead.client_name?.toLowerCase().includes(q) ||
        lead.phone.includes(q) ||
        lead.email?.toLowerCase().includes(q);
      return okStatus && okSearch;
    });
  }, [leads, statusFilter, search]);

  async function handleStatusChange(id: string, status: LeadStatus) {
    const client = createClient();
    if (!client) return;
    const ok = await updateLeadStatus(client, id, status);
    if (ok) {
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, status } : lead))
      );
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("¿Eliminar esta cotización de forma permanente?"))
      return;
    const client = createClient();
    if (!client) return;
    const ok = await deleteLead(client, id);
    if (ok) {
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
    }
  }

  function handleExport() {
    const rows = filtered.map((lead) => ({
      Fecha: format(new Date(lead.created_at), "yyyy-MM-dd HH:mm"),
      Cliente: lead.client_name ?? "",
      Teléfono: lead.phone,
      Email: lead.email ?? "",
      Dirección: lead.address ?? "",
      "Sq ft": lead.sq_ft ?? "",
      "Precio estimado (USD)": lead.price_estimated ?? "",
      Frecuencia: lead.service_freq ?? "",
      Residuos: lead.waste_treatment ?? "",
      "Forma de pago": lead.payment_pref ?? "",
      "Fecha preferida": lead.preferred_date ?? "",
      Notas: lead.notes ?? "",
      Estado: LEAD_STATUS_LABELS[lead.status],
    }));

    const csv = Papa.unparse(rows);
    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `leads-nieto-green-care-${format(new Date(), "yyyyMMdd-HHmm")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <label className="relative block flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              aria-hidden
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, teléfono o email…"
              className="w-full rounded-lg border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
            />
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-brand-600 focus:outline-none"
            aria-label="Filtrar por estado"
          >
            <option value="all">Todos los estados</option>
            {(["new", "contacted", "closed"] as const).map((s) => (
              <option key={s} value={s}>
                {LEAD_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={filtered.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          <Download className="h-4 w-4" aria-hidden />
          Exportar CSV ({filtered.length})
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-neutral-400">
          No hay cotizaciones para mostrar.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Teléfono</th>
                <th className="px-4 py-3 font-medium">Sq ft</th>
                <th className="px-4 py-3 font-medium">Precio est.</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-neutral-50">
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-500">
                    {format(new Date(lead.created_at), "dd/MM/yyyy HH:mm")}
                  </td>
                  <td className="px-4 py-3 font-medium text-neutral-800">
                    {lead.client_name || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{lead.phone}</td>
                  <td className="px-4 py-3">
                    {lead.sq_ft != null
                      ? Math.round(lead.sq_ft).toLocaleString("en-US")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 font-medium text-brand-800">
                    {lead.price_estimated != null
                      ? `$${Number(lead.price_estimated).toFixed(2)}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        handleStatusChange(lead.id, e.target.value as LeadStatus)
                      }
                      className="rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-xs focus:border-brand-600 focus:outline-none"
                      aria-label="Cambiar estado"
                    >
                      {(["new", "contacted", "closed"] as const).map((s) => (
                        <option key={s} value={s}>
                          {LEAD_STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(lead.id)}
                      className="rounded-lg p-1.5 text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                      aria-label={`Eliminar cotización de ${lead.client_name ?? "cliente"}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}