-- ============================================================
-- Roastly Coffee App - Initial Schema Migration
-- ============================================================

-- Enable required extensions
create extension if not exists "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

-- 1. Profiles (linked to Supabase auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text,
  created_at timestamptz default now()
);

-- 2. Coffees
create table public.coffees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text,
  ean text unique,
  description text,
  origin_country text,
  origin_region text,
  origin_flag text,
  altitude text,
  harvest text,
  roast_level text,
  tags jsonb default '[]'::jsonb,
  labels jsonb default '[]'::jsonb,
  carbon_score int,
  carbon_label text,
  flavor_profile jsonb default '[]'::jsonb,
  brewing_methods jsonb default '[]'::jsonb,
  emoji text,
  gradient text[],
  avg_rating numeric default 0,
  review_count int default 0,
  created_at timestamptz default now()
);

-- 3. Reviews
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  coffee_id uuid not null references public.coffees (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now(),
  unique (user_id, coffee_id)
);

-- 4. Favorites
create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  coffee_id uuid not null references public.coffees (id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, coffee_id)
);

-- 5. Scan History
create table public.scan_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  coffee_id uuid references public.coffees (id) on delete set null,
  ean_scanned text,
  found boolean,
  scanned_at timestamptz default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

create index idx_coffees_ean on public.coffees (ean);
create index idx_reviews_coffee_id on public.reviews (coffee_id);
create index idx_reviews_user_id on public.reviews (user_id);
create index idx_favorites_user_id on public.favorites (user_id);
create index idx_favorites_coffee_id on public.favorites (coffee_id);
create index idx_scan_history_user_id on public.scan_history (user_id);
create index idx_scan_history_ean on public.scan_history (ean_scanned);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.coffees enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;
alter table public.scan_history enable row level security;

-- Profiles: anyone can read, only own user can update
create policy "profiles_select" on public.profiles
  for select using (true);

create policy "profiles_update" on public.profiles
  for update using (auth.uid() = id);

-- Coffees: anyone can read, authenticated users can insert
create policy "coffees_select" on public.coffees
  for select using (true);

create policy "coffees_insert" on public.coffees
  for insert with check (auth.role() = 'authenticated');

-- Reviews: anyone can read, own user can insert/update
create policy "reviews_select" on public.reviews
  for select using (true);

create policy "reviews_insert" on public.reviews
  for insert with check (auth.uid() = user_id);

create policy "reviews_update" on public.reviews
  for update using (auth.uid() = user_id);

-- Favorites: all operations scoped to own user
create policy "favorites_select" on public.favorites
  for select using (auth.uid() = user_id);

create policy "favorites_insert" on public.favorites
  for insert with check (auth.uid() = user_id);

create policy "favorites_update" on public.favorites
  for update using (auth.uid() = user_id);

create policy "favorites_delete" on public.favorites
  for delete using (auth.uid() = user_id);

-- Scan History: all operations scoped to own user
create policy "scan_history_select" on public.scan_history
  for select using (auth.uid() = user_id);

create policy "scan_history_insert" on public.scan_history
  for insert with check (auth.uid() = user_id);

create policy "scan_history_update" on public.scan_history
  for update using (auth.uid() = user_id);

create policy "scan_history_delete" on public.scan_history
  for delete using (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Update avg_rating and review_count on coffees when reviews change
create or replace function public.update_coffee_rating()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  target_coffee_id uuid;
begin
  -- Determine which coffee to update
  if tg_op = 'DELETE' then
    target_coffee_id := old.coffee_id;
  else
    target_coffee_id := new.coffee_id;
  end if;

  update public.coffees
  set
    avg_rating = coalesce((
      select round(avg(rating)::numeric, 2)
      from public.reviews
      where coffee_id = target_coffee_id
    ), 0),
    review_count = (
      select count(*)
      from public.reviews
      where coffee_id = target_coffee_id
    )
  where id = target_coffee_id;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger on_review_change
  after insert or update or delete on public.reviews
  for each row execute function public.update_coffee_rating();

-- ============================================================
-- SEED DATA
-- ============================================================

insert into public.coffees (
  name, brand, ean, description,
  origin_country, origin_region, origin_flag,
  altitude, harvest, roast_level,
  tags, labels, carbon_score, carbon_label,
  flavor_profile, brewing_methods,
  emoji, gradient
) values
(
  'Kenya AA',
  'Roastly Reserve',
  '5901234123457',
  'A bold, full-bodied Kenyan coffee with bright acidity, blackcurrant and grapefruit notes, and a wine-like finish. Grown on the high plateaus of central Kenya.',
  'Kenya', 'Nyeri', '🇰🇪',
  '1700-2000m', '2025', 'Medium-Dark',
  '["single-origin", "specialty", "washed"]'::jsonb,
  '["Rainforest Alliance", "Direct Trade"]'::jsonb,
  28, 'B',
  '[{"label":"Acidité","v":85},{"label":"Fruité","v":80},{"label":"Floral","v":50},{"label":"Corps","v":70},{"label":"Douceur","v":55},{"label":"Amertume","v":60}]'::jsonb,
  '["pour-over", "french-press", "aeropress"]'::jsonb,
  '☕',
  ARRAY['#8B4513', '#D2691E']
),
(
  'Yirgacheffe Natural',
  'Roastly Reserve',
  '4006381333931',
  'A naturally processed Ethiopian gem bursting with blueberry and jasmine aromatics. Silky body with a sweet, lingering finish reminiscent of tropical fruit.',
  'Ethiopia', 'Yirgacheffe', '🇪🇹',
  '1800-2200m', '2025', 'Light',
  '["single-origin", "specialty", "natural"]'::jsonb,
  '["Organic", "Fair Trade"]'::jsonb,
  22, 'A',
  '[{"label":"Acidité","v":55},{"label":"Fruité","v":75},{"label":"Floral","v":85},{"label":"Corps","v":50},{"label":"Douceur","v":70},{"label":"Amertume","v":30}]'::jsonb,
  '["pour-over", "chemex", "cold-brew"]'::jsonb,
  '🫐',
  ARRAY['#4B0082', '#9370DB']
),
(
  'Colombia Huila',
  'Roastly Reserve',
  '7702032109028',
  'A classic Colombian from the Huila department with rich caramel sweetness, balanced citrus acidity, and a creamy milk chocolate body. Versatile and approachable.',
  'Colombia', 'Huila', '🇨🇴',
  '1500-1800m', '2025', 'Medium',
  '["single-origin", "specialty", "washed"]'::jsonb,
  '["UTZ Certified", "Fair Trade"]'::jsonb,
  25, 'B',
  '[{"label":"Acidité","v":50},{"label":"Fruité","v":60},{"label":"Floral","v":30},{"label":"Corps","v":75},{"label":"Douceur","v":80},{"label":"Amertume","v":45}]'::jsonb,
  '["espresso", "moka-pot", "french-press", "pour-over"]'::jsonb,
  '🍫',
  ARRAY['#D2691E', '#F4A460']
);
