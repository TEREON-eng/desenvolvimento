-- Lab Universo: exclusão recuperável, preservando relações e dados.
alter table public.x_works add column if not exists deleted_at timestamptz;
alter table public.x_workspaces add column if not exists deleted_at timestamptz;
grant update(deleted_at) on public.x_works to authenticated;
grant update(deleted_at) on public.x_workspaces to authenticated;
-- Apenas proprietários podem modificar, por meio das políticas de UPDATE existentes.
-- Não conceder DELETE: exclusão de interface será reversível e explícita.
