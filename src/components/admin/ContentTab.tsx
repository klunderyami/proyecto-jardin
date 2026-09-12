"use client";

import { useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import type { SiteContent } from "@/types/database";
import { CONTENT_KEYS, upsertSiteContent } from "@/lib/supabase/data";
import { createClient } from "@/lib/supabase/client";

interface ContentTabProps {
  initialContent: SiteContent[];
}

/** Convierte un valor JSON (o texto por líneas) en un arreglo de cadenas. */
function parseList(raw: string): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {
    // Si no es JSON, se interpreta como una ciudad por línea.
  }
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ContentTab({ initialContent }: ContentTabProps) {
  const get = (key: string) =>
    initialContent.find((item) => item.key === key)?.value_es ?? "";
  const getEn = (key: string) =>
    initialContent.find((item) => item.key === key)?.value_en ?? "";

  const [cities, setCities] = useState<string[]>(
    parseList(get(CONTENT_KEYS.coverageCities))
  );
  const [phone, setPhone] = useState(get(CONTENT_KEYS.contactPhone));
  const [phoneE164, setPhoneE164] = useState(get(CONTENT_KEYS.contactPhoneE164));
  const [email, setEmail] = useState(get(CONTENT_KEYS.contactEmail));
  const [gallery, setGallery] = useState<string[]>(
    parseList(get(CONTENT_KEYS.gallery))
  );
  const [heroTitleEs, setHeroTitleEs] = useState(get(CONTENT_KEYS.heroTitle));
  const [heroTitleEn, setHeroTitleEn] = useState(getEn(CONTENT_KEYS.heroTitle));
  const [heroSubtitleEs, setHeroSubtitleEs] = useState(
    get(CONTENT_KEYS.heroSubtitle)
  );
  const [heroSubtitleEn, setHeroSubtitleEn] = useState(
    getEn(CONTENT_KEYS.heroSubtitle)
  );
  const [message, setMessage] = useState<string | null>(null);

  async function saveItem(key: string, es: string, en?: string) {
    const client = createClient();
    if (!client) {
      setMessage("⚠️ Supabase no está configurado.");
      return false;
    }
    const ok = await upsertSiteContent(client, key, es, en);
    if (!ok) setMessage("❌ Error al guardar (revisa la consola).");
    return ok;
  }

  async function saveCities() {
    const ok = await saveItem(
      CONTENT_KEYS.coverageCities,
      JSON.stringify(cities),
      JSON.stringify(cities)
    );
    if (ok) setMessage("✅ Ciudades de cobertura guardadas.");
  }

  async function saveContact() {
    const okPhone = await saveItem(CONTENT_KEYS.contactPhone, phone, phone);
    const okE164 = await saveItem(CONTENT_KEYS.contactPhoneE164, phoneE164, phoneE164);
    const okEmail = await saveItem(CONTENT_KEYS.contactEmail, email, email);
    if (okPhone && okE164 && okEmail)
      setMessage("✅ Contacto guardado correctamente.");
  }

  async function saveGallery() {
    const raw = gallery.map((u) => u.trim()).filter(Boolean);
    const ok = await saveItem(CONTENT_KEYS.gallery, JSON.stringify(raw), JSON.stringify(raw));
    if (ok) setMessage("✅ Galería guardada.");
  }

  async function saveHero() {
    const ok = await saveItem(
      CONTENT_KEYS.heroTitle,
      heroTitleEs,
      heroTitleEn
    );
    const ok2 = await saveItem(
      CONTENT_KEYS.heroSubtitle,
      heroSubtitleEs,
      heroSubtitleEn
    );
    if (ok && ok2) setMessage("✅ Textos de la portada guardados.");
  }
return (
    <section className="flex flex-col gap-6">
      {message ? (
        <p className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-900">
          {message}
        </p>
      ) : null}

      {/* Ciudades de cobertura */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <h2 className="mb-1 text-lg font-semibold text-neutral-900">
          Ciudades de cobertura
        </h2>
        <p className="mb-3 text-xs text-neutral-500">
          Una ciudad por línea. Se actualiza en el mapa y en la web.
        </p>
        <textarea
          value={cities.join("\n")}
          onChange={(e) =>
            setCities(
              e.target.value
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
          rows={7}
          className="w-full rounded-lg border border-neutral-300 bg-white p-3 text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
        />
        <button
          type="button"
          onClick={saveCities}
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          <Save className="h-4 w-4" aria-hidden />
          Guardar ciudades
        </button>
      </div>

      {/* Contacto */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <h2 className="mb-3 text-lg font-semibold text-neutral-900">
          Contacto
        </h2>
        <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm text-neutral-700">
            Teléfono visible
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 focus:border-brand-600 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-neutral-700">
            Teléfono E.164 (para SMS/WhatsApp)
            <input
              value={phoneE164}
              onChange={(e) => setPhoneE164(e.target.value)}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 focus:border-brand-600 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-neutral-700 sm:col-span-2">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 focus:border-brand-600 focus:outline-none"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={saveContact}
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          <Save className="h-4 w-4" aria-hidden />
          Guardar contacto
        </button>
      </div>
{/* Galería */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <h2 className="mb-1 text-lg font-semibold text-neutral-900">Galería</h2>
        <p className="mb-3 text-xs text-neutral-500">
          Una URL de imagen por línea.
        </p>
        <div className="flex flex-col gap-2">
          {gallery.map((url, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                value={url}
                onChange={(e) =>
                  setGallery((prev) =>
                    prev.map((u, i) => (i === index ? e.target.value : u))
                  )
                }
                className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-brand-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  setGallery((prev) => prev.filter((_, i) => i !== index))
                }
                className="rounded-lg p-2 text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                aria-label="Quitar imagen"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setGallery((prev) => [...prev, ""])}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Añadir imagen
          </button>
          <button
            type="button"
            onClick={saveGallery}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            <Save className="h-4 w-4" aria-hidden />
            Guardar galería
          </button>
        </div>
      </div>
{/* Textos de la portada */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5">
        <h2 className="mb-3 text-lg font-semibold text-neutral-900">
          Textos de la portada
        </h2>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-neutral-700">
              Título (ES)
              <input
                value={heroTitleEs}
                onChange={(e) => setHeroTitleEs(e.target.value)}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 focus:border-brand-600 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-neutral-700">
              Título (EN)
              <input
                value={heroTitleEn}
                onChange={(e) => setHeroTitleEn(e.target.value)}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 focus:border-brand-600 focus:outline-none"
              />
            </label>
          </div>
          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-neutral-700">
              Subtítulo (ES)
              <textarea
                value={heroSubtitleEs}
                onChange={(e) => setHeroSubtitleEs(e.target.value)}
                rows={3}
                className="rounded-lg border border-neutral-300 bg-white p-3 text-sm focus:border-brand-600 focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-neutral-700">
              Subtítulo (EN)
              <textarea
                value={heroSubtitleEn}
                onChange={(e) => setHeroSubtitleEn(e.target.value)}
                rows={3}
                className="rounded-lg border border-neutral-300 bg-white p-3 text-sm focus:border-brand-600 focus:outline-none"
              />
            </label>
          </div>
        </div>
        <button
          type="button"
          onClick={saveHero}
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          <Save className="h-4 w-4" aria-hidden />
          Guardar textos
        </button>
      </div>
    </section>
  );
}