-- Allow stable UUID chosen by unified Listas client. RLS still binds owner_id to auth.uid().
grant insert(id) on public.x_cloud_lists to authenticated;