-- ============================================================
-- Nieto Green Care · Migración inicial (esquema + seed + RLS)
-- Tablas: app_settings, price_tiers, frequency_options,
--         waste_options, coverage_cities, gallery_items, leads
-- ============================================================

-- ---------- app_settings: contenido editable (no-code) ----------
create table if not exists public.app_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ---------- price_tiers: tarifas por sq ft y rangos ----------
create table if not exists public.price_tiers (
  id uuid primary key default gen_random_uuid(),
  min_sqft integer,
  max_sqft integer,
  price_per_sqft numeric(10,4) not null,
  active boolean not null default true,
  sort integer not null default 0,
  updated_at timestamptz not null default now(),
  check (min_sqft is null or max_sqft is null or min_sqft <= max_sqft),
  check (price_per_sqft >= 0)
);

-- ---------- frequency_options: frecuencia dinámica ----------
create table if not exists public.frequency_options (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key in ('one_time', 'weekly', 'bi_weekly')),
  label_es text not null,
  label_en text not null,
  multiplier numeric(5,2) not null default 1,
  active boolean not null default true,
  sort integer not null default 0
);

-- ---------- waste_options: residuos (Mulch / Bag & Haul) ----------
create table if not exists public.waste_options (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key in ('mulch', 'bag_haul')),
  label_es text not null,
  label_en text not null,
  surcharge numeric(10,2) not null default 0,
  active boolean not null default true,
  sort integer not null default 0
);

-- ---------- coverage_cities: cobertura editable ----------
create table if not exists public.coverage_cities (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  label_es text,
  label_en text,
  active boolean not null default true,
  sort integer not null default 0
);

-- ---------- lead_quotes: cotizaciones recibidas ----------
create table if not exists public.lead_quotes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  locale text not null default 'es' check (locale in ('es', 'en')),
  first_name text,
  last_name text,
  email text,
  phone text not null,
  address text,
  city text,
  lat double precision,
  lng double precision,
  sqft numeric(12,2),
  sqft_source text check (sqft_source in ('map', 'manual')),
  manual_range text,
  frequency_key text check (frequency_key in ('one_time', 'weekly', 'bi_weekly')),
  waste_key text check (waste_key in ('mulch', 'bag_haul')),
  price_per_sqft numeric(10,4),
  total_price numeric(12,2),
  payment_method text,
  preferred_date date,
  preferred_time text,
  instructions text,
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'closed')),
  notes text
);

create index if not exists idx_lead_quotes_created_at on public.lead_quotes (created_at desc);
create index if not exists idx_lead_quotes_status on public.lead_quotes (status);

-- ---------- trigger: updated_at ----------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_app_settings_updated_at on public.app_settings;
create trigger trg_app_settings_updated_at
  before update on public.app_settings
  for each row execute function public.set_updated_at();

-- ---------- Row Level Security ----------
alter table public.app_settings enable row level security;
alter table public.price_tiers enable row level security;
alter table public.frequency_options enable row level security;
alter table public.waste_options enable row level security;
alter table public.coverage_cities enable row level security;
alter table public.gallery_items enable row level security;
alter table public.lead_quotes enable row level security;

-- Lectura pública de catálogo/contenido
drop policy if exists "public_read_app_settings" on public.app_settings;
create policy "public_read_app_settings" on public.app_settings
  for select using (true);

drop policy if exists "public_read_price_tiers" on public.price_tiers;
create policy "public_read_price_tiers" on public.price_tiers
  for select using (true);

drop policy if exists "public_read_frequency_options" on public.frequency_options;
create policy "public_read_frequency_options" on public.frequency_options
  for select using (true);

drop policy if exists "public_read_waste_options" on public.waste_options;
create policy "public_read_waste_options" on public.waste_options
  for select using (true);

drop policy if exists "public_read_coverage_cities" on public.coverage_cities;
create policy "public_read_coverage_cities" on public.coverage_cities
  for select using (true);

drop policy if exists "public_read_gallery_items" on public.gallery_items;
create policy "public_read_gallery_items" on public.gallery_items
  for select using (true);

-- Administradores (sesión autenticada) gestionan todo
drop policy if exists "auth_full_access_app_settings" on public.app_settings;
create policy "auth_full_access_app_settings" on public.app_settings
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "auth_full_access_price_tiers" on public.price_tiers;
create policy "auth_full_access_price_tiers" on public.price_tiers
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "auth_full_access_frequency_options" on public.frequency_options;
create policy "auth_full_access_frequency_options" on public.frequency_options
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "auth_full_access_waste_options" on public.waste_options;
create policy "auth_full_access_waste_options" on public.waste_options
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "auth_full_access_coverage_cities" on public.coverage_cities;
create policy "auth_full_access_coverage_cities" on public.coverage_cities
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "auth_full_access_gallery_items" on public.gallery_items;
create policy "auth_full_access_gallery_items" on public.gallery_items
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "auth_read_lead_quotes" on public.lead_quotes;
create policy "auth_read_lead_quotes" on public.lead_quotes
  for select using (auth.role() = 'authenticated');

drop policy if exists "auth_update_lead_quotes" on public.lead_quotes;
create policy "auth_update_lead_quotes" on public.lead_quotes
  for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "auth_delete_lead_quotes" on public.lead_quotes;
create policy "auth_delete_lead_quotes" on public.lead_quotes
  for delete using (auth.role() = 'authenticated');

-- ---------- Seed inicial (editable desde Panel de Control) ----------
insert into public.frequency_options (key, label_es, label_en, multiplier, sort) values
  ('one_time', 'Solo una vez', 'One-time', 1.6, 1),
  ('weekly', 'Semanal', 'Weekly', 1.0, 2),
  ('bi_weekly', 'Cada dos semanas', 'Bi-weekly', 1.2, 3)
on conflict (key) do nothing;

insert into public.waste_options (key, label_es, label_en, surcharge, sort) values
  ('mulch', 'Mulch (triturar y dejar)', 'Mulch (recycle in place)', 0, 1),
  ('bag_haul', 'Bag & Haul (retiro de residuos)', 'Bag & Haul (collect & haul)', 30, 2)
on conflict (key) do nothing;

insert into public.coverage_cities (name, label_es, label_en, sort) values
  ('Hutto', 'Hutto, TX', 'Hutto, TX', 1),
  ('Round Rock', 'Round Rock, TX', 'Round Rock, TX', 2),
  ('Georgetown', 'Georgetown, TX', 'Georgetown, TX', 3),
  ('Leander', 'Leander, TX', 'Leander, TX', 4),
  ('Cedar Park', 'Cedar Park, TX', 'Cedar Park, TX', 5),
  ('Liberty Hill', 'Liberty Hill, TX', 'Liberty Hill, TX', 6),
  ('Jarrell', 'Jarrell, TX', 'Jarrell, TX', 7)
on conflict (name) do nothing;

insert into public.price_tiers (min_sqft, max_sqft, price_per_sqft, sort) values
  (null, 1000, 0.0450, 1),      -- < 1,000
  (1000, 5000, 0.0350, 2),      -- 1k - 5k
  (5000, 10000, 0.0280, 3),     -- 5k - 10k
  (10000, null, 0.0220, 4)      -- 10k+
on conflict do nothing;

insert into public.app_settings (key, value) values
  ('brand', '{"name": "Nieto Green Care", "tagline": "Cuidado profesional de jardines en el área de Austin, TX"}'),
  ('contact', '{"phone": "(737) 314-4215", "phoneE164": "7373144215", "email": "nietogreencare@gmail.com"}'),
  ('home', '{"heroTitle_es": "Jardín impecable, sin complicaciones", "heroTitle_en": "Flawless lawn, zero hassle"}')
on conflict (key) do nothing;