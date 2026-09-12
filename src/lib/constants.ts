/**
 * Datos públicos del negocio.
 * Fuente única de contacto: el cliente NO edita código;
 * en Fases posteriores estos valores serán editables desde Supabase.
 */
export const BUSINESS = {
  phone: process.env.NEXT_PUBLIC_PHONE ?? "7373144215",
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? "(737) 314-4215",
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL ?? "nietogreencare@gmail.com",
} as const;

/**
 * Construye un enlace nativo SMS: sms:+17373144215?body=...
 * El cuerpo se codifica y se prellenará con el desglose de la cotización.
 */
export function buildSmsLink(message = ""): string {
  const base = `sms:+1${BUSINESS.phone}`;
  if (!message) return base;
  return `${base}?body=${encodeURIComponent(message)}`;
}