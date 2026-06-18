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
