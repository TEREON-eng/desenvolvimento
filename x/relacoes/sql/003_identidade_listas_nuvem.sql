-- Permitir identidade de lista somente se a lista existir no armazenamento online
-- e pertencer ao próprio usuário autenticado.
alter table public.x_record_identities drop constraint x_record_identities_record_type_check;
alter table public.x_record_identities add constraint x_record_identities_record_type_check
 check(record_type in ('work','list'));
drop policy if exists x_record_identities_insert_owned_work on public.x_record_identities;
create policy x_record_identities_insert_owned_origin on public.x_record_identities
 for insert to authenticated
 with check(
  owner_id=(select auth.uid()) and (
   (record_type='work' and exists (
    select 1 from public.x_works w join public.x_workspaces s on s.id=w.workspace_id
    where w.id=origin_id and w.deleted_at is null and s.deleted_at is null and s.owner_id=(select auth.uid())
   ))
   or
   (record_type='list' and exists (
    select 1 from public.x_cloud_lists l where l.id=origin_id and l.owner_id=(select auth.uid())
   ))
  )
 );
