-- TEREON X - Motor de Identidade e Relações v1 (laboratório)
-- Identidade técnica própria, vínculo por referência e RLS sem acesso cruzado.
create table if not exists public.x_record_identities (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id),
  record_type text not null check (record_type in ('work')),
  origin_id uuid not null,
  created_at timestamptz not null default now(),
  unique(record_type, origin_id)
);
create table if not exists public.x_record_relations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id),
  from_record_id uuid not null references public.x_record_identities(id),
  to_record_id uuid not null references public.x_record_identities(id),
  relation_type text not null check (relation_type in ('related_to','derived_from')),
  created_at timestamptz not null default now(),
  ended_at timestamptz,
  check(from_record_id <> to_record_id),
  unique(from_record_id,to_record_id,relation_type),
  check(ended_at is null or ended_at >= created_at)
);
create index if not exists x_record_identities_owner_idx on public.x_record_identities(owner_id,record_type);
create index if not exists x_record_relations_owner_idx on public.x_record_relations(owner_id,from_record_id);
alter table public.x_record_identities enable row level security;
alter table public.x_record_relations enable row level security;
create policy x_record_identities_select_self on public.x_record_identities for select to authenticated
 using(owner_id=(select auth.uid()));
create policy x_record_identities_insert_owned_work on public.x_record_identities for insert to authenticated
 with check(owner_id=(select auth.uid()) and record_type='work' and
 exists(select 1 from public.x_works o join public.x_workspaces s on s.id=o.workspace_id
 where o.id=origin_id and o.deleted_at is null and s.deleted_at is null and s.owner_id=(select auth.uid())));
create policy x_record_relations_select_self on public.x_record_relations for select to authenticated
 using(owner_id=(select auth.uid()));
create policy x_record_relations_insert_owned on public.x_record_relations for insert to authenticated
 with check(owner_id=(select auth.uid()) and
 exists(select 1 from public.x_record_identities a where a.id=from_record_id and a.owner_id=(select auth.uid())) and
 exists(select 1 from public.x_record_identities b where b.id=to_record_id and b.owner_id=(select auth.uid())));
create policy x_record_relations_end_owned on public.x_record_relations for update to authenticated
 using(owner_id=(select auth.uid()))
 with check(owner_id=(select auth.uid()) and
 exists(select 1 from public.x_record_identities a where a.id=from_record_id and a.owner_id=(select auth.uid())) and
 exists(select 1 from public.x_record_identities b where b.id=to_record_id and b.owner_id=(select auth.uid())));
revoke all on public.x_record_identities,public.x_record_relations from anon,authenticated;
grant select on public.x_record_identities to authenticated;
grant insert(owner_id,record_type,origin_id) on public.x_record_identities to authenticated;
grant select on public.x_record_relations to authenticated;
grant insert(owner_id,from_record_id,to_record_id,relation_type) on public.x_record_relations to authenticated;
grant update(ended_at) on public.x_record_relations to authenticated;
