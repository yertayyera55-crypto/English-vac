-- Lexora: one private workspace per signed-in user.
-- Run this entire file in Supabase: SQL Editor -> New query -> Run.

create table if not exists public.user_workspaces (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{"words": [], "collections": [], "streak": 0, "accuracy": 0}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_workspaces enable row level security;

grant select, insert, update on public.user_workspaces to authenticated;

drop policy if exists "Users can read their own Lexora workspace" on public.user_workspaces;
create policy "Users can read their own Lexora workspace"
  on public.user_workspaces
  for select
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can create their own Lexora workspace" on public.user_workspaces;
create policy "Users can create their own Lexora workspace"
  on public.user_workspaces
  for insert
  to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can update their own Lexora workspace" on public.user_workspaces;
create policy "Users can update their own Lexora workspace"
  on public.user_workspaces
  for update
  to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create or replace function public.touch_user_workspace_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_workspaces_updated_at on public.user_workspaces;
create trigger user_workspaces_updated_at
  before update on public.user_workspaces
  for each row execute function public.touch_user_workspace_updated_at();
