-- Reedio Music – Yönetim Merkezi veritabanı şeması
-- Supabase SQL Editor'da tek seferde çalıştırabilirsiniz (tekrar çalıştırmada hata vermez).

-- 1. products tablosu
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null check (price >= 0),
  image_url text,
  category text not null default 'Diğer',
  stock integer not null default 0 check (stock >= 0),
  created_at timestamptz not null default now()
);

-- Mevcut products tablosunda stock sütunu yoksa ekle
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'products' and column_name = 'stock'
  ) then
    alter table public.products add column stock integer not null default 0 check (stock >= 0);
  end if;
end $$;

alter table public.products enable row level security;

drop policy if exists "Products public read" on public.products;
create policy "Products public read"
  on public.products for select
  using (true);

drop policy if exists "Products service role full" on public.products;
create policy "Products service role full"
  on public.products for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- 2. orders tablosu
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  address text,
  items jsonb not null,
  status text not null default 'pending_approval' check (
    status in ('pending_approval', 'approved_waiting', 'delivered', 'rejected')
  ),
  type text not null check (type in ('normal_order', 'custom_request')),
  created_at timestamptz not null default now()
);

do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'orders') then
    alter table public.orders drop constraint if exists orders_status_check;
    update public.orders set status = 'pending_approval' where status = 'pending' or status not in ('pending_approval','approved_waiting','delivered','rejected');
    update public.orders set status = 'delivered' where status = 'completed';
    alter table public.orders add constraint orders_status_check check (
      status in ('pending_approval', 'approved_waiting', 'delivered', 'rejected')
    );
    alter table public.orders alter column status set default 'pending_approval';
  end if;
end $$;

alter table public.orders enable row level security;

drop policy if exists "Orders service role full" on public.orders;
create policy "Orders service role full"
  on public.orders for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- 3. contact_messages tablosu
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

drop policy if exists "Contact insert anon" on public.contact_messages;
create policy "Contact insert anon"
  on public.contact_messages for insert
  with check (true);

drop policy if exists "Contact service role read" on public.contact_messages;
create policy "Contact service role read"
  on public.contact_messages for select
  using (auth.role() = 'service_role');

-- 4. Storage: product-images bucket
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Product images public read" on storage.objects;
create policy "Product images public read"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "Product images service role upload" on storage.objects;
create policy "Product images service role upload"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'service_role');

drop policy if exists "Product images service role delete" on storage.objects;
create policy "Product images service role delete"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'service_role');

-- 5. team_categories tablosu (Ekibimiz kategorileri: gruplar, bantlar vb.)
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

-- 6. team_members tablosu (Ekibimiz)
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text,
  bio text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Not: category_id ve section mevcut kurulumlara yukarıdaki do $$ blokları ile eklenir.

-- team_members'a category_id ekle (yoksa)
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'team_members')
     and not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'team_members' and column_name = 'category_id') then
    alter table public.team_members add column category_id uuid references public.team_categories(id) on delete set null;
  end if;
end $$;

-- team_categories'a section ekle (yoksa)
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'team_categories')
     and not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'team_categories' and column_name = 'section') then
    alter table public.team_categories add column section text not null default 'sanatci' check (section in ('yonetim', 'sanatci'));
  end if;
end $$;

-- team_members'a section ekle (yoksa)
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'team_members')
     and not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'team_members' and column_name = 'section') then
    alter table public.team_members add column section text not null default 'sanatci' check (section in ('yonetim', 'sanatci'));
  end if;
end $$;

alter table public.team_members enable row level security;

drop policy if exists "Team members public read" on public.team_members;
create policy "Team members public read"
  on public.team_members for select
  using (true);

drop policy if exists "Team members service role full" on public.team_members;
create policy "Team members service role full"
  on public.team_members for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- 7. Storage: team-images bucket (3:4 fotoğraflar)
insert into storage.buckets (id, name, public)
values ('team-images', 'team-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Team images public read" on storage.objects;
create policy "Team images public read"
  on storage.objects for select
  using (bucket_id = 'team-images');

drop policy if exists "Team images service role upload" on storage.objects;
create policy "Team images service role upload"
  on storage.objects for insert
  with check (bucket_id = 'team-images' and auth.role() = 'service_role');

drop policy if exists "Team images service role delete" on storage.objects;
create policy "Team images service role delete"
  on storage.objects for delete
  using (bucket_id = 'team-images' and auth.role() = 'service_role');
