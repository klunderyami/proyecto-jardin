import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * Cliente de Supabase para navegador (Componentes Cliente).
 * Retorna null si las variables de entorno no están configuradas.
 */
export function createClient(): ReturnType<
  typeof createBrowserClient<Database>
> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.warn(
      "[supabase:client] NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY no configuradas."
    );
    return null;
  }

  return createBrowserClient<Database>(url, anonKey);
}