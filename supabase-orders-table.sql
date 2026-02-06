-- Reedio Music: orders tablosu (Supabase SQL Editor'da çalıştırın)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  address text,
  items jsonb not null,
  status text not null default 'pending' check (status in ('pending', 'completed')),
  type text not null check (type in ('normal_order', 'custom_request')),
  created_at timestamptz not null default now()
);

-- RLS: Service Role Key ile server action'lar erişir; gerekirse politikalar ekleyin.
alter table public.orders enable row level security;

-- Örnek: Sadece service role tüm işlemleri yapabilsin (anon/authenticated kısıtlı)
create policy "Service role full access"
  on public.orders for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
