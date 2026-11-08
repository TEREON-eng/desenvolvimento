alter table public.x_works add column if not exists planned_start date;
alter table public.x_works add column if not exists planned_end date;
alter table public.x_works drop constraint if exists x_works_planned_date_order;
alter table public.x_works add constraint x_works_planned_date_order check (planned_start is null or planned_end is null or planned_end >= planned_start);
grant insert(planned_start,planned_end) on public.x_works to authenticated;
grant update(planned_start,planned_end) on public.x_works to authenticated;