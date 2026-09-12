-- ============================================================
-- Nieto Green Care · ESQUEMA SUPABASE (Fase 2)
-- Tablas: leads, pricing_config, site_content
-- + RLS (Row Level Security) + Seed inicial
--
-- Aplicar en Supabase Dashboard -> SQL Editor -> New query,
-- o con CLI: supabase db push (con el proyecto vinculado).
-- ============================================================

-- ---------- leads: cotizaciones recibidas ----------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  client_name text,
  phone text not null,
  email text,
  address text,
  sq_ft numeric(12,2),
  price_estimated numeric(12,2),
  payment_pref text,
  service_freq text check (service_freq in ('one_time', 'weekly', 'bi_weekly')),
  waste_treatment text check (waste_treatment in ('mulch', 'bag_haul')),
  preferred_date date,
  notes text,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed'))
);

create index if not exists idx_leads_created_at on public.leads (created_at desc);
create index if not exists idx_leads_status on public.leads (status);

-- ---------- pricing_config: tarifario no-code ----------
create table if not exists public.pricing_config (
  id uuid primary key default gen_random_uuid(),
  base_rate_per_sqft numeric(10,4) not null default 0.035,
  min_price numeric(10,2) not null default 39,
  tier_1000 numeric(10,4) not null default 0.045,
  tier_5000 numeric(10,4) not null default 0.035,
  tier_10000 numeric(10,4) not null default 0.028,
  mulch_extra numeric(10,2) not null default 0,
  bag_haul_extra numeric(10,2) not null default 30,
  updated_at timestamptz not null default now()
);

-- ---------- site_content: textos web, ciudades, galería ----------
create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value_es text not null default '',
  value_en text not null default '',
  updated_at timestamptz not null default now()
);
-- ---------- trigger: updated_at ----------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_pricing_config_updated_at on public.pricing_config;
create trigger trg_pricing_config_updated_at
  before update on public.pricing_config
  for each row execute function public.set_updated_at();

drop trigger if exists trg_site_content_updated_at on public.site_content;
create trigger trg_site_content_updated_at
  before update on public.site_content
  for each row execute function public.set_updated_at();

-- ---------- Row Level Security ----------
alter table public.leads enable row level security;
alter table public.pricing_config enable row level security;
alter table public.site_content enable row level security;

-- leads: el público puede crear, solo el admin puede leer/editar/borrar
drop policy if exists "public_insert_leads" on public.leads;
create policy "public_insert_leads" on public.leads
  for insert with check (true);

drop policy if exists "auth_read_leads" on public.leads;
create policy "auth_read_leads" on public.leads
  for select using (auth.role() = 'authenticated');

drop policy if exists "auth_update_leads" on public.leads;
create policy "auth_update_leads" on public.leads
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "auth_delete_leads" on public.leads;
create policy "auth_delete_leads" on public.leads
  for delete using (auth.role() = 'authenticated');

-- pricing_config: lectura pública (cálculo de cotización), escritura solo admin
drop policy if exists "public_read_pricing_config" on public.pricing_config;
create policy "public_read_pricing_config" on public.pricing_config
  for select using (true);

drop policy if exists "auth_all_pricing_config" on public.pricing_config;
create policy "auth_all_pricing_config" on public.pricing_config
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- site_content: lectura pública (sitio web), escritura solo admin
drop policy if exists "public_read_site_content" on public.site_content;
create policy "public_read_site_content" on public.site_content
  for select using (true);

drop policy if exists "auth_all_site_content" on public.site_content;
create policy "auth_all_site_content" on public.site_content
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
-- ---------- SEED DATA INICIAL (editable desde Panel de Control) ----------

-- Tarifario por defecto (Mow Managers Austin como referencia)
insert into public.pricing_config
  (base_rate_per_sqft, min_price, tier_1000, tier_5000, tier_10000, mulch_extra, bag_haul_extra)
values
  (0.035, 39, 0.045, 0.035, 0.028, 0, 30);

-- Contenido inicial: ciudades de cobertura, contacto, textos y galería
insert into public.site_content (key, value_es, value_en) values
  ('coverage_cities',
   '["Hutto TX","Round Rock TX","Georgetown TX","Leander TX","Cedar Park TX","Liberty Hill TX","Jarrell TX"]',
   '["Hutto TX","Round Rock TX","Georgetown TX","Leander TX","Cedar Park TX","Liberty Hill TX","Jarrell TX"]'),
  ('contact_phone', '(737) 314-4215', '(737) 314-4215'),
  ('contact_phone_e164', '+17373144215', '+17373144215'),
  ('contact_email', 'nietogreencare@gmail.com', 'nietogreencare@gmail.com'),
  ('brand_name', 'Nieto Green Care', 'Nieto Green Care'),
  ('tagline', 'Cuidado profesional de jardines en el área de Austin, TX', 'Professional lawn care in the Austin, TX area'),
  ('hero_title', 'Jardín impecable, sin complicaciones', 'Flawless lawn, zero hassle'),
  ('hero_subtitle',
   'Cotización en segundos: calcula el área de tu jardín con el mapa satelital o elige un rango de tamaño.',
   'Get your quote in seconds: measure your lawn with the satellite map or pick a size range.'),
  ('gallery', '[]', '[]')
on conflict (key) do nothing;