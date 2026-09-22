create table public.slc_wishlist_items (
 user_id uuid not null references auth.users(id) on delete cascade,
 product_id text not null check (length(product_id) between 1 and 100),
 created_at timestamptz not null default now(),
 primary key (user_id,product_id)
);
alter table public.slc_wishlist_items enable row level security;
revoke all on public.slc_wishlist_items from anon, authenticated;
grant select, insert, delete on public.slc_wishlist_items to authenticated;
create policy "Read own wishlist" on public.slc_wishlist_items for select to authenticated using ((select auth.uid()) = user_id);
create policy "Save own wishlist" on public.slc_wishlist_items for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Remove own wishlist" on public.slc_wishlist_items for delete to authenticated using ((select auth.uid()) = user_id);
