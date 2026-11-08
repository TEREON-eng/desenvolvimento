-- TEREON X · Universo / Motor de Obras (lab v1).
-- Reuse existing identity and workspace structure.
alter table public.x_works add column if not exists status text not null default 'planning';
alter table public.x_works drop constraint if exists x_works_status_valid;
alter table public.x_works add constraint x_works_status_valid
  check (status in ('planning','active','paused','completed','archived'));
alter table public.x_works drop constraint if exists x_works_name_length;
alter table public.x_works add constraint x_works_name_length check (length(btrim(name)) between 1 and 160);
alter table public.x_works drop constraint if exists x_works_description_length;
alter table public.x_works add constraint x_works_description_length check (length(description) <= 2000);
alter table public.x_workspaces drop constraint if exists x_workspaces_name_length;
alter table public.x_workspaces add constraint x_workspaces_name_length check (length(btrim(name)) between 1 and 120);
revoke all on public.x_works from authenticated,anon;
grant select on public.x_works to authenticated;
grant insert(workspace_id,name,description,status) on public.x_works to authenticated;
grant update(name,description,status) on public.x_works to authenticated;
revoke all on public.x_workspaces from authenticated,anon;
grant select on public.x_workspaces to authenticated;
grant insert(owner_id,name,kind) on public.x_workspaces to authenticated;
grant update(name) on public.x_workspaces to authenticated;
