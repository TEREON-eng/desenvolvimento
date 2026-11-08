-- TEREON X: foundation of identity, private workspaces, works and explicit access.
-- Does not modify existing local lists or legacy application.
create extension if not exists pgcrypto;

create table public.x_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.x_workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id),
  name text not null check (char_length(trim(name)) between 1 and 160),
  kind text not null default 'personal' check (kind in ('personal', 'organization')),
  created_at timestamptz not null default now()
);

create table public.x_workspace_members (
  workspace_id uuid not null references public.x_workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table public.x_works (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.x_workspaces(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 160),
  description text not null default '',
  created_at timestamptz not null default now()
);

create table public.x_work_access (
  work_id uuid not null references public.x_works(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'collaborator' check (role in ('manager', 'collaborator', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (work_id, user_id)
);

create index x_workspaces_owner_idx on public.x_workspaces(owner_id);
create index x_workspace_members_user_idx on public.x_workspace_members(user_id);
create index x_works_workspace_idx on public.x_works(workspace_id);
create index x_work_access_user_idx on public.x_work_access(user_id);

alter table public.x_profiles enable row level security;
alter table public.x_workspaces enable row level security;
alter table public.x_workspace_members enable row level security;
alter table public.x_works enable row level security;
alter table public.x_work_access enable row level security;

revoke all on public.x_profiles, public.x_workspaces, public.x_workspace_members, public.x_works, public.x_work_access from anon, authenticated;
grant select, insert, update on public.x_profiles to authenticated;
grant select, insert, update on public.x_workspaces to authenticated;
grant select on public.x_workspace_members to authenticated;
grant select, insert, update on public.x_works to authenticated;
grant select on public.x_work_access to authenticated;

create policy x_profiles_select_self on public.x_profiles for select to authenticated
  using (user_id = (select auth.uid()));
create policy x_profiles_insert_self on public.x_profiles for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy x_profiles_update_self on public.x_profiles for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy x_members_select_self on public.x_workspace_members for select to authenticated
  using (user_id = (select auth.uid()));
create policy x_access_select_self on public.x_work_access for select to authenticated
  using (user_id = (select auth.uid()));

create policy x_workspaces_select on public.x_workspaces for select to authenticated
  using (
    owner_id = (select auth.uid())
    or exists (
      select 1 from public.x_workspace_members m
      where m.workspace_id = id and m.user_id = (select auth.uid())
    )
  );
create policy x_workspaces_insert_owner on public.x_workspaces for insert to authenticated
  with check (owner_id = (select auth.uid()));
create policy x_workspaces_update_owner on public.x_workspaces for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy x_works_select on public.x_works for select to authenticated
  using (
    exists (
      select 1 from public.x_workspaces w
      where w.id = workspace_id and w.owner_id = (select auth.uid())
    )
    or exists (
      select 1 from public.x_work_access a
      where a.work_id = id and a.user_id = (select auth.uid())
    )
  );
create policy x_works_insert_owner on public.x_works for insert to authenticated
  with check (
    exists (
      select 1 from public.x_workspaces w
      where w.id = workspace_id and w.owner_id = (select auth.uid())
    )
  );
create policy x_works_update_owner on public.x_works for update to authenticated
  using (
    exists (
      select 1 from public.x_workspaces w
      where w.id = workspace_id and w.owner_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.x_workspaces w
      where w.id = workspace_id and w.owner_id = (select auth.uid())
    )
  );
