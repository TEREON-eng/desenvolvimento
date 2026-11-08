-- Relacionamento encerrado não pode ser reaberto nem reescrito.
create or replace function public.x_relations_lock_history()
returns trigger language plpgsql set search_path = '' as $$
begin
  if old.ended_at is not null then
    raise exception 'Relação encerrada é imutável.';
  end if;
  if new.ended_at is null then
    raise exception 'Encerramento deve informar data.';
  end if;
  if new.ended_at < old.created_at then
    raise exception 'Encerramento anterior à criação.';
  end if;
  return new;
end;
$$;
revoke all on function public.x_relations_lock_history() from public,anon,authenticated;
drop trigger if exists x_record_relations_lock_history on public.x_record_relations;
create trigger x_record_relations_lock_history before update on public.x_record_relations
for each row execute function public.x_relations_lock_history();