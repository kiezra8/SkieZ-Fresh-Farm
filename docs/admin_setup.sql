-- ─────────────────────────────────────────────────────────────────────────────
-- SkieZ Fresh Farm — Admin Setup SQL
-- Run this AFTER schema.sql in Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── 1. Make israelezrakisakye@gmail.com an admin ────────────────────────────
-- This sets role = 'admin' in profiles for that email.
-- Run this AFTER the user has signed up/logged in at least once.

update profiles
set role = 'admin'
where id = (
    select id from auth.users where email = 'israelezrakisakye@gmail.com'
);

-- ─── 2. Admin write policies on products ─────────────────────────────────────
create policy "Admins can insert products"
    on products for insert
    with check (
        exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );

create policy "Admins can update products"
    on products for update
    using (
        exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );

create policy "Admins can delete products"
    on products for delete
    using (
        exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );

-- ─── 3. Admin write policies on categories ───────────────────────────────────
create policy "Admins can insert categories"
    on categories for insert
    with check (
        exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );

create policy "Admins can update categories"
    on categories for update
    using (
        exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );

-- ─── 4. Admin write policies on hero_slides & ticker_items ───────────────────
create policy "Admins can manage hero slides"
    on hero_slides for all
    using (
        exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );

create policy "Admins can manage ticker items"
    on ticker_items for all
    using (
        exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );

-- ─── 5. Admin read orders (view all orders, not just own) ────────────────────
create policy "Admins can read all orders"
    on orders for select
    using (
        exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );

create policy "Admins can update all orders"
    on orders for update
    using (
        exists (select 1 from profiles where id = auth.uid() and role = 'admin')
    );

-- ─── 6. Supabase Storage — product-images bucket ─────────────────────────────
-- Run this in Storage > Policies or SQL editor
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'product-images',
    'product-images',
    true,
    5242880,   -- 5 MB max per image
    array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Storage RLS: public read, admin write
create policy "Public can view product images"
    on storage.objects for select
    using (bucket_id = 'product-images');

create policy "Admins can upload product images"
    on storage.objects for insert
    with check (
        bucket_id = 'product-images' and
        exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );

create policy "Admins can update product images"
    on storage.objects for update
    using (
        bucket_id = 'product-images' and
        exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );

create policy "Admins can delete product images"
    on storage.objects for delete
    using (
        bucket_id = 'product-images' and
        exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
    );
