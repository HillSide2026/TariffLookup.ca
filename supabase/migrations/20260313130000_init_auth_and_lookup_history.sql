create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.lookup_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  destination_country text not null,
  product_description text,
  submitted_hs_code text,
  resolved_hs_code text not null,
  input_mode text not null,
  classification_confidence text not null,
  classification_method text not null,
  classification_rationale text not null,
  mfn_tariff_rate text not null,
  preferential_tariff_rate text not null,
  agreement_basis text not null,
  source text not null,
  source_tier text not null,
  coverage_status text not null,
  effective_date date not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists lookup_history_user_id_created_at_idx
  on public.lookup_history (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.lookup_history enable row level security;

create or replace function public.handle_profile_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.handle_profile_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update
  set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "lookup_history_select_own" on public.lookup_history;
create policy "lookup_history_select_own"
on public.lookup_history
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "lookup_history_insert_own" on public.lookup_history;
create policy "lookup_history_insert_own"
on public.lookup_history
for insert
to authenticated
with check (auth.uid() = user_id);
