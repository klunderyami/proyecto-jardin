import { NextResponse } from "next/server";

/** Endpoint de salud para verificar el despliegue y la configuración. */
export function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: {
      supabase: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      googleMaps: Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY),
      resend: Boolean(process.env.RESEND_API_KEY),
      appUrl: Boolean(process.env.NEXT_PUBLIC_APP_URL),
    },
  });
}