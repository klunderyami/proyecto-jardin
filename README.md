# Nieto Green Care 🌿

Web App **mobile-first** para cotización de jardinería en el área de Austin, TX.
Sitio 100% web (sin empaquetado nativo): Next.js App Router + Supabase (CMS/BD) +
Google Maps + Resend, con carga instantánea vía código QR e i18n ES/EN.

## Stack

| Capa           | Tecnología                                                  |
| -------------- | ----------------------------------------------------------- |
| Framework      | Next.js 16 (App Router) + React 19 + TypeScript estricto    |
| Estilos        | Tailwind CSS v4 (mobile-first)                              |
| i18n           | next-intl + `src/locales/{es,en}.json`                      |
| BD / CMS       | Supabase (Postgres + Auth + RLS)                            |
| Mapas          | Google Maps JS API (`@react-google-maps/api`)               |
| Email          | Resend (fallback serverless tras WhatsApp/SMS)              |
| Tests          | Vitest + Testing Library                                     |

## Inicio rápido

```bash
npm install
cp .env.example .env.local   # completa tus credenciales
npm run dev                  # http://localhost:3000
```

## Scripts

```bash
npm run dev          # desarrollo
npm run build        # compilación producción
npm run start        # servidor producción
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run test         # Vitest (una pasada)
npm run test:watch   # Vitest (modo vigilado)
```

## Estructura

```
src/
├── app/
│   ├── [locale]/          # rutas localizadas (es raíz `/`, en `/en`)
│   │   ├── layout.tsx     # layout raíz + NextIntlClientProvider
│   │   ├── page.tsx       # landing
│   │   └── admin/         # Panel de Control (Fase 2)
│   └── api/               # Route Handlers (health, quotes…)
├── components/            # ui, map, admin, layout (Fase 2+)
├── i18n/                  # routing, request, navigation, types
├── lib/                   # supabase, helpers, constantes del negocio
├── locales/               # es.json · en.json
├── test/                  # setup de Vitest
└── types/                 # types/database.ts (Supabase)
supabase/migrations/       # 0001_init.sql (esquema + seed + RLS)
```

## Regla del cliente no-code

Todo texto, tarifa, galería y cobertura vive en **Supabase** (tablas con RLS:
lectura pública del catálogo, escritura solo autenticado). El cliente gestiona
su contenido desde `/admin` sin tocar código.

## Variables de entorno

Ver [`.env.example`](.env.example). Las llaves residen en `.env.local`
(nunca se sube; está en `.gitignore`).

## Supabase (configuración inicial)

1. Crea un proyecto gratuito en [supabase.com](https://supabase.com).
2. Abre **SQL Editor → New query**, pega el contenido de
   [`supabase/schema.sql`](supabase/schema.sql) y ejecútalo (tablas + RLS + seed).
3. En **Project Settings → API** copia `URL` y `anon public key` a `.env.local`.
4. En **Project Settings → API → Service Role** copia la `service_role secret`
   (solo servidor) a `SUPABASE_SERVICE_ROLE_KEY`.
5. En **Authentication → Users → Add user**, crea el usuario del cliente
   (email/contraseña) para entrar al Panel de Control.

## Fases

- [x] **Fase 1** — Repositorio, arquitectura, i18n raíz, clientes Supabase.
- [x] **Fase 2** — Panel de Control `/admin` (login, leads, tarifario, contenido) + schema.sql.
- [ ] **Fase 3** — Cotizador satelital (mapa + rangos manuales).
- [ ] **Fase 4** — Registro y notificación (SMS deep link + Resend + BD).
- [ ] **Fase 5** — Pulido mobile-first, SEO y deploy (Vercel).
