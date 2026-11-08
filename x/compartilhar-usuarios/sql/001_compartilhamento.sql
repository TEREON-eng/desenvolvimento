-- TEREON X: compartilhamento de cópias de listas entre usuários; sem e-mails, sem alterar Listas.
create table public.x_list_shares (
  id uuid primary key default gen_random_uuid(),
  sender_user_id uuid not null references auth.users(id) on delete cascade,
  recipient_user_id uuid not null references auth.users(id) on delete cascade,
  list_snapshot jsonb not null,
  status text not null default 'pending' check (status in ('pending','accepted','declined','revoked')),
  created_at timestamptz not null default now(),
  changed_at timestamptz not null default now(),
  constraint x_list_shares_different_users check (sender_user_id <> recipient_user_id),
  constraint x_list_shares_snapshot_valid check (
    jsonb_typeof(list_snapshot) = 'object'
    and list_snapshot ->> 'schema_version' = '1'
    and jsonb_typeof(list_snapshot -> 'name') = 'string'
    and length(trim(list_snapshot ->> 'name')) between 1 and 160
    and jsonb_typeof(list_snapshot -> 'items') = 'array'
    and jsonb_array_length(list_snapshot -> 'items') between 1 and 300
    and octet_length(list_snapshot::text) <= 131072
  )
);
create index x_list_shares_sender_idx on public.x_list_shares(sender_user_id,created_at desc);
create index x_list_shares_recipient_idx on public.x_list_shares(recipient_user_id,created_at desc);
create function public.x_list_shares_touch_status() returns trigger
language plpgsql security invoker set search_path = ''
as $$
begin
  if new.status is distinct from old.status then new.changed_at := now(); end if;
  return new;
end;
$$;
create trigger x_list_shares_status_changed before update of status
on public.x_list_shares for each row execute function public.x_list_shares_touch_status();
revoke all on public.x_list_shares from anon,authenticated;
grant select on public.x_list_shares to authenticated;
grant insert(sender_user_id,recipient_user_id,list_snapshot) on public.x_list_shares to authenticated;
grant update(status) on public.x_list_shares to authenticated;
revoke all on function public.x_list_shares_touch_status() from public,anon,authenticated;
alter table public.x_list_shares enable row level security;
create policy x_shares_select_participants on public.x_list_shares
  for select to authenticated using
  (sender_user_id=(select auth.uid()) or recipient_user_id=(select auth.uid()));
create policy x_shares_insert_sender on public.x_list_shares
  for insert to authenticated with check
  (sender_user_id=(select auth.uid()) and recipient_user_id<>(select auth.uid()) and status='pending');
create policy x_shares_recipient_respond on public.x_list_shares
  for update to authenticated using
  (recipient_user_id=(select auth.uid()) and status='pending')
  with check (recipient_user_id=(select auth.uid()) and status in ('accepted','declined'));
create policy x_shares_sender_revoke on public.x_list_shares
  for update to authenticated using
  (sender_user_id=(select auth.uid()) and status in ('pending','accepted'))
  with check (sender_user_id=(select auth.uid()) and status='revoked');
