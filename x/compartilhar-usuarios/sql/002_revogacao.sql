drop policy x_shares_select_participants on public.x_list_shares;
create policy x_shares_select_participants on public.x_list_shares
for select to authenticated using (
  sender_user_id = (select auth.uid())
  or (recipient_user_id = (select auth.uid()) and status <> 'revoked')
);
