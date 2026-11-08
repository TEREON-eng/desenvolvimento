-- TEREON X · Listas na nuvem, laboratório independente
create table if not exists public.x_cloud_lists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id),
  name text not null check (length(btrim(name)) between 1 and 160),
  items jsonb not null default '[]'::jsonb,
  stages jsonb not null default '[]'::jsonb,
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint x_cloud_lists_items_array check (jsonb_typeof(items)='array'),
  constraint x_cloud_lists_stages_array check (jsonb_typeof(stages)='array'),
  constraint x_cloud_lists_size_limit check (octet_length(items::text)+octet_length(stages::text) <= 131072),
  constraint x_cloud_lists_item_count check (jsonb_array_length(items)<=300)
);
create index if not exists x_cloud_lists_owner_updated on public.x_cloud_lists(owner_id,updated_at desc);
create or replace function public.x_cloud_lists_track_update()
returns trigger language plpgsql set search_path = '' as $$
begin
 new.version=old.version+1;
 new.updated_at=now();
 return new;
end;
$$;
revoke all on function public.x_cloud_lists_track_update() from public,anon,authenticated;
drop trigger if exists x_cloud_lists_track_update on public.x_cloud_lists;
create trigger x_cloud_lists_track_update before update on public.x_cloud_lists
for each row execute function public.x_cloud_lists_track_update();
alter table public.x_cloud_lists enable row level security;
create policy x_cloud_lists_select_owner on public.x_cloud_lists for select to authenticated
 using(owner_id=(select auth.uid()));
create policy x_cloud_lists_insert_owner on public.x_cloud_lists for insert to authenticated
 with check(owner_id=(select auth.uid()));
create policy x_cloud_lists_update_owner on public.x_cloud_lists for update to authenticated
 using(owner_id=(select auth.uid())) with check(owner_id=(select auth.uid()));
revoke all on public.x_cloud_lists from anon,authenticated;
grant select on public.x_cloud_lists to authenticated;
grant insert(owner_id,name,items,stages) on public.x_cloud_lists to authenticated;
grant update(name,items,stages) on public.x_cloud_lists to authenticated;
