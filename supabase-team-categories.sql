-- Ekibimiz kategorileri için gerekli tablo ve ayarlar
-- Supabase Dashboard → SQL Editor → bu dosyanın içeriğini yapıştırıp Run edin.

-- 1. team_categories tablosu
create table if not exists public.team_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text,
  sort_order integer not null default 0,
  section text not null default 'sanatci' check (section in ('yonetim', 'sanatci')),
  created_at timestamptz not null default now()
);

alter table public.team_categories enable row level security;

drop policy if exists "Team categories public read" on public.team_categories;
create policy "Team categories public read"
  on public.team_categories for select
  using (true);

drop policy if exists "Team categories service role full" on public.team_categories;
create policy "Team categories service role full"
  on public.team_categories for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- 2. team_members'a category_id sütunu (yoksa ekle)
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'team_members')
     and not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'team_members' and column_name = 'category_id') then
    alter table public.team_members add column category_id uuid references public.team_categories(id) on delete set null;
  end if;
end $$;

-- 3. team_categories'a section sütunu (yoksa ekle)
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'team_categories')
     and not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'team_categories' and column_name = 'section') then
    alter table public.team_categories add column section text not null default 'sanatci' check (section in ('yonetim', 'sanatci'));
  end if;
end $$;

-- 4. team_members'a section sütunu (yoksa ekle)
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'team_members')
     and not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'team_members' and column_name = 'section') then
    alter table public.team_members add column section text not null default 'sanatci' check (section in ('yonetim', 'sanatci'));
  end if;
end $$;
