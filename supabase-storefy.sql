create table if not exists public.storefy_workspaces (
  user_id uuid primary key references auth.users(id) on delete cascade,
  products jsonb not null default '[]'::jsonb,
  sites jsonb not null default '[]'::jsonb,
  active_site_id text,
  updated_at timestamptz not null default now()
);

alter table public.storefy_workspaces enable row level security;

drop policy if exists "storefy_workspaces_select_own" on public.storefy_workspaces;
create policy "storefy_workspaces_select_own"
on public.storefy_workspaces
for select
using (auth.uid() = user_id);

drop policy if exists "storefy_workspaces_insert_own" on public.storefy_workspaces;
create policy "storefy_workspaces_insert_own"
on public.storefy_workspaces
for insert
with check (auth.uid() = user_id);

drop policy if exists "storefy_workspaces_update_own" on public.storefy_workspaces;
create policy "storefy_workspaces_update_own"
on public.storefy_workspaces
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create table if not exists public.storefy_public_stores (
  slug text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  store_config jsonb not null,
  products jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.storefy_public_stores enable row level security;

drop policy if exists "storefy_public_stores_select_public" on public.storefy_public_stores;
create policy "storefy_public_stores_select_public"
on public.storefy_public_stores
for select
using (true);

drop policy if exists "storefy_public_stores_insert_own" on public.storefy_public_stores;
create policy "storefy_public_stores_insert_own"
on public.storefy_public_stores
for insert
with check (auth.uid() = user_id);

drop policy if exists "storefy_public_stores_update_own" on public.storefy_public_stores;
create policy "storefy_public_stores_update_own"
on public.storefy_public_stores
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create table if not exists public.storefy_user_integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  encrypted_token text not null,
  token_iv text not null,
  token_tag text not null,
  token_last4 text not null,
  account_email text,
  account_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider)
);

alter table public.storefy_user_integrations enable row level security;

drop policy if exists "storefy_user_integrations_no_client_select" on public.storefy_user_integrations;
drop policy if exists "storefy_user_integrations_no_client_insert" on public.storefy_user_integrations;
drop policy if exists "storefy_user_integrations_no_client_update" on public.storefy_user_integrations;
drop policy if exists "storefy_user_integrations_no_client_delete" on public.storefy_user_integrations;
