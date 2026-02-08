-- team_members ve team_categories tablolarına 'section' sütununu ekler (yoksa).
-- "Could not find the 'section' column" hatası alıyorsanız bu dosyayı
-- Supabase Dashboard → SQL Editor'da çalıştırın.

-- team_categories'a section (yoksa)
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'team_categories')
     and not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'team_categories' and column_name = 'section') then
    alter table public.team_categories add column section text not null default 'sanatci' check (section in ('yonetim', 'sanatci'));
  end if;
end $$;

-- team_members'a section (yoksa)
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'team_members')
     and not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'team_members' and column_name = 'section') then
    alter table public.team_members add column section text not null default 'sanatci' check (section in ('yonetim', 'sanatci'));
  end if;
end $$;
