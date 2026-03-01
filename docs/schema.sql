-- ─────────────────────────────────────────────────────────────────────────────
-- SkieZ Fresh Farm — Supabase Database Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── 1. Categories ───────────────────────────────────────────────────────────
create table if not exists categories (
    id         serial primary key,
    name       text        not null,
    slug       text        not null unique,
    count      int         default 0,
    badge      text,
    image      text,
    created_at timestamptz default now()
);

-- ─── 2. Products ─────────────────────────────────────────────────────────────
create table if not exists products (
    id             serial primary key,
    name           text           not null,
    category       text           not null references categories(slug) on update cascade,
    unit           text           not null,
    price          int            not null,     -- price in UGX
    original_price int,
    discount       int            default 0,    -- percentage
    rating         numeric(3,1)   default 5.0,
    reviews        int            default 0,
    image          text,
    description    text,
    stock          int            default 0,
    badge          text,
    is_active      boolean        default true,
    created_at     timestamptz    default now(),
    updated_at     timestamptz    default now()
);

-- Auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create or replace trigger products_updated_at
    before update on products
    for each row execute procedure update_updated_at_column();

-- ─── 3. Hero Slides ──────────────────────────────────────────────────────────
create table if not exists hero_slides (
    id         serial primary key,
    tag        text        not null,
    title      text        not null,
    subtitle   text,
    cta        text        default 'Shop Now',
    bg         text,
    created_at timestamptz default now()
);

-- ─── 4. Ticker Items ─────────────────────────────────────────────────────────
create table if not exists ticker_items (
    id         serial primary key,
    text       text        not null,
    price      text        not null,    -- display text e.g. "UGX 12,000"
    original   text,                   -- display text e.g. "UGX 15,000"
    created_at timestamptz default now()
);

-- ─── 5. Orders ───────────────────────────────────────────────────────────────
create table if not exists orders (
    id               uuid         primary key default uuid_generate_v4(),
    user_id          uuid         references auth.users(id) on delete set null,
    status           text         not null default 'pending'
                                  check (status in ('pending','confirmed','preparing','dispatched','delivered','cancelled')),
    total_amount     int          not null,        -- UGX
    delivery_name    text         not null,
    delivery_phone   text         not null,
    delivery_address text         not null,
    delivery_notes   text,
    created_at       timestamptz  default now(),
    updated_at       timestamptz  default now()
);

create or replace trigger orders_updated_at
    before update on orders
    for each row execute procedure update_updated_at_column();

-- ─── 6. Order Items ──────────────────────────────────────────────────────────
create table if not exists order_items (
    id         serial       primary key,
    order_id   uuid         not null references orders(id) on delete cascade,
    product_id int          references products(id) on delete set null,
    name       text         not null,
    unit       text         not null,
    price      int          not null,    -- price at time of order
    quantity   int          not null check (quantity > 0),
    image      text,
    created_at timestamptz  default now()
);

-- ─── 7. User Profiles (public mirror of auth.users) ──────────────────────────
create table if not exists profiles (
    id         uuid         primary key references auth.users(id) on delete cascade,
    full_name  text,
    phone      text,
    address    text,
    avatar_url text,
    role       text         default 'customer' check (role in ('customer', 'admin')),
    created_at timestamptz  default now(),
    updated_at timestamptz  default now()
);

create or replace trigger profiles_updated_at
    before update on profiles
    for each row execute procedure update_updated_at_column();

-- Auto-create a profile row when a user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, full_name, role)
    values (
        new.id,
        new.raw_user_meta_data ->> 'full_name',
        coalesce(new.raw_user_meta_data ->> 'role', 'customer')
    );
    return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security (RLS) Policies
-- ─────────────────────────────────────────────────────────────────────────────

-- Categories & Products: public read, admin write
alter table categories  enable row level security;
alter table products     enable row level security;
alter table hero_slides  enable row level security;
alter table ticker_items enable row level security;
alter table orders       enable row level security;
alter table order_items  enable row level security;
alter table profiles     enable row level security;

-- Public read on catalogue tables
create policy "Public can read categories"  on categories  for select using (true);
create policy "Public can read products"    on products    for select using (true);
create policy "Public can read hero slides" on hero_slides  for select using (true);
create policy "Public can read ticker"      on ticker_items for select using (true);

-- Orders: authenticated users can insert their own, read their own
create policy "Users can create orders"
    on orders for insert
    with check (auth.uid() = user_id or auth.uid() is not null);

create policy "Users can read own orders"
    on orders for select
    using (auth.uid() = user_id);

create policy "Users can update own pending orders"
    on orders for update
    using (auth.uid() = user_id and status = 'pending');

-- Order items: cascade from orders RLS (same user)
create policy "Users can insert their order items"
    on order_items for insert
    with check (
        exists (
            select 1 from orders
            where orders.id = order_id and orders.user_id = auth.uid()
        )
    );

create policy "Users can read own order items"
    on order_items for select
    using (
        exists (
            select 1 from orders
            where orders.id = order_id and orders.user_id = auth.uid()
        )
    );

-- Profiles: users can read/update their own
create policy "Users can read own profile"
    on profiles for select
    using (auth.uid() = id);

create policy "Users can update own profile"
    on profiles for update
    using (auth.uid() = id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Seed Data — Categories
-- ─────────────────────────────────────────────────────────────────────────────
insert into categories (id, name, slug, count, badge, image) values
(1,  'Fresh Vegetables',   'vegetables', 48, 'Fresh',       'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop'),
(2,  'Fresh Fruits',       'fruits',     36, 'Seasonal',    'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=400&fit=crop'),
(3,  'Rice & Grains',      'grains',     24, 'Dry Food',    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop'),
(4,  'Cooking Oils',       'oils',       18, 'Premium',     'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop'),
(5,  'Legumes & Beans',    'legumes',    32, 'Protein-rich','https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400&h=400&fit=crop'),
(6,  'Flours & Cereals',   'flours',     20, 'Staple',      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop'),
(7,  'Spices & Herbs',     'spices',     55, 'Aromatic',    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop'),
(8,  'Dairy & Eggs',       'dairy',      22, 'Fresh',       'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop'),
(9,  'Pastas & Noodles',   'pasta',      15, 'Import',      'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=400&fit=crop'),
(10, 'Sugar & Sweeteners', 'sugar',      14, '-20%',        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop')
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────────────────────
-- Seed Data — Products
-- ─────────────────────────────────────────────────────────────────────────────
insert into products (id, name, category, unit, price, original_price, discount, rating, reviews, image, description, stock, badge) values
(1,  'Fresh Organic Tomatoes',    'vegetables', 'Per 1 kg',          2500,  3200,  22, 4.8, 324,  'https://images.unsplash.com/photo-1546094096-0df4bcafd6fd?w=400&h=400&fit=crop',  'Farm-fresh organic tomatoes hand-picked daily from local Ugandan farms. Plump, juicy and full of flavour. Rich in lycopene and Vitamin C. Perfect for stews, sauces, salads, and soups. No pesticides used — 100% natural.',  50,  'Organic'),
(2,  'Green Spinach Bundle',      'vegetables', '1 Bundle (~500g)',  1500,  2000,  25, 4.7, 198,  'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop',  'Crispy, dark-green spinach bundle freshly harvested from fertile Ugandan gardens. Packed with iron, calcium and folate.', 30,  'Fresh'),
(3,  'Purple Cabbage (Head)',     'vegetables', 'Per piece (~1.2kg)',3000,  3800,  21, 4.5, 87,   'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=400&fit=crop',  'Vibrant purple cabbage bursting with antioxidants and Vitamin C. Crisp texture and mild flavour.',  40,  'Antioxidant'),
(4,  'Red Onions',               'vegetables', 'Per 2 kg',          5000,  6500,  23, 4.9, 512,  'https://images.unsplash.com/photo-1589419424524-0424ccd98e43?w=400&h=400&fit=crop',  'Strong, full-flavoured Ugandan red onions sourced from Kasese and Kabale highlands.',  100, 'Best Seller'),
(5,  'Irish Potatoes (Bag)',     'vegetables', '5 kg bag',          12000, 15000, 20, 4.8, 410,  'https://images.unsplash.com/photo-1518977957600-1c2892fe4a08?w=400&h=400&fit=crop',  'Premium Irish potatoes from the fertile hills of Kabale — Uganda''s potato capital.',   60,  'Value Pack'),
(6,  'Garlic Bulbs',             'vegetables', '250g pack',         4000,  5500,  27, 4.9, 284,  'https://images.unsplash.com/photo-1540148124736-1b69f7940d95?w=400&h=400&fit=crop',  'Aromatic whole garlic bulbs with firm, papery skins.',  80,  'Immunity'),
(7,  'Sweet Mangoes (Kg)',       'fruits',     'Per 1 kg (3–4 pcs)',3000,  4000,  25, 4.9, 631,  'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop',  'Juicy, golden-flesh mangoes sourced from Soroti and Mbale.',  45,  'Seasonal'),
(8,  'Banana Bunch (Matooke)',   'fruits',     '1 bunch (~2kg)',    6000,  8000,  25, 4.7, 452,  'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop',  'Fresh green matooke — Uganda''s most beloved staple food.',  50,  'Staple'),
(9,  'Watermelon (Whole)',       'fruits',     'Per piece (~4–5kg)',15000, 20000, 25, 4.8, 317,  'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=400&h=400&fit=crop',  'Extra-large, super-sweet watermelons grown in Karamoja and Luwero.',  25,  'Summer Hit'),
(10, 'Avocados (Hass)',          'fruits',     'Pack of 3 pcs',    4000,  5500,  27, 4.9, 523,  'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop',  'Creamy, buttery Hass avocados from Mbarara and Masaka.',  35,  'Heart Healthy'),
(11, 'Pishori Long Grain Rice',  'grains',     '2 kg pack',         12000, 15000, 20, 4.9, 789,  'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop',  'Premium aromatic long-grain Pishori rice.',  200, 'Premium'),
(12, 'Broken Wheat (Uji)',       'grains',     '1 kg pack',         4000,  5500,  27, 4.6, 234,  'https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=400&h=400&fit=crop',  'Whole-grain broken wheat (sembe), rich in dietary fibre, iron and B vitamins.',  150, 'Wholegrain'),
(13, 'Millet (Wimbi) Grain',    'grains',     '500g pack',         3500,  4500,  22, 4.7, 167,  'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',  'Finger millet (wimbi) — an ancient East African superfood grain.',  120, 'Superfood'),
(14, 'Pure Sunflower Oil',       'oils',       '2-litre bottle',    18000, 22000, 18, 4.8, 643,  'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=400&h=400&fit=crop',  '100% pure refined sunflower oil — Uganda''s most widely used cooking oil.',  180, 'Popular'),
(15, 'Extra Virgin Olive Oil',   'oils',       '500ml bottle',      35000, 45000, 22, 4.9, 321,  'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop',  'Premium cold-pressed extra virgin olive oil made from first-press olives.',  60,  'Imported'),
(16, 'Green Grams (Ndengu)',     'legumes',    '500g pack',         4500,  6000,  25, 4.8, 298,  'https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400&h=400&fit=crop',  'Whole green grams — one of Uganda''s most nutritious and affordable legumes.',  250, 'High Protein'),
(17, 'Red Kidney Beans',         'legumes',    '1 kg pack',         7000,  9000,  22, 4.7, 213,  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop',  'Premium Ugandan-grown red kidney beans — sorted, cleaned and ready to cook.',  200, 'Protein Rich'),
(18, 'Yellow Lentils (Dhal)',    'legumes',    '500g pack',         5000,  6500,  23, 4.8, 187,  'https://images.unsplash.com/photo-1546548970-71785318a17b?w=400&h=400&fit=crop',  'Split yellow lentils — the fastest-cooking legume.',  220, 'Quick Cook'),
(19, 'Posho (Maize Flour)',      'flours',     '2 kg pack',         6000,  8000,  25, 4.9, 1023, 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop',  'Finely milled white maize flour — Uganda''s most essential food staple (posho).',  500, 'Staple'),
(20, 'Wheat Flour (All Purpose)','flours',     '1 kg pack',         4000,  5500,  27, 4.7, 432,  'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop',  'Finely sifted, enriched all-purpose wheat flour.',  300, 'Multi-Use'),
(21, 'Pilau Masala Spice Mix',   'spices',     '100g pack',         4500,  6000,  25, 4.9, 867,  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop',  'Authentic East African pilau masala blend.',  200, 'Authentic'),
(22, 'Whole Black Pepper',       'spices',     '50g pack',          5000,  7000,  29, 4.8, 312,  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',  'Premium whole black peppercorns with a bold, intense aroma.',  150, 'Bold Flavour'),
(23, 'Fresh Farm Eggs (Tray)',   'dairy',      'Tray of 30 eggs',   18000, 22000, 18, 4.9, 1243, 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop',  'Free-range farm eggs from grain-fed Ugandan hens.',  100, 'Free Range'),
(24, 'Fresh Full Cream Milk',    'dairy',      '1-litre packet',    4000,  5000,  20, 4.8, 534,  'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=400&fit=crop',  'Fresh full-cream milk pasteurised for safety.',  200, 'Farm Fresh'),
(25, 'Spaghetti Pasta (500g)',   'pasta',      '500g pack',         5500,  7000,  21, 4.7, 289,  'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=400&fit=crop',  'Premium durum wheat spaghetti.',  180, 'Imported'),
(26, 'White Granulated Sugar',   'sugar',      '1 kg pack',         4500,  5500,  18, 4.8, 902,  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',  'Refined white granulated sugar from Uganda''s Kakira Sugar Works.',  400, 'Kakira'),
(27, 'Brown Sugar (Raw Cane)',   'sugar',      '500g pack',         3500,  4500,  22, 4.7, 231,  'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=400&fit=crop',  'Unrefined raw cane brown sugar with natural molasses.',  300, 'Natural'),
(28, 'Green Pepper (Hoho)',      'vegetables', '3-piece pack',      2500,  3500,  29, 4.6, 175,  'https://images.unsplash.com/photo-1506802913710-9b7b8eb2e5d1?w=400&h=400&fit=crop',  'Crispy, vivid green bell peppers (hoho).',  60,  'Crispy Fresh'),
(29, 'Nia Sunflower Oil',        'oils',       '1-litre bottle',    10000, 13000, 23, 4.7, 412,  'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=400&h=400&fit=crop',  'Nia 100% pure sunflower oil in a convenient 1-litre bottle.',  250, 'Value'),
(30, 'Palm Oil (Omukwano)',      'oils',       '1-litre bottle',    9000,  12000, 25, 4.6, 289,  'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop',  'Traditional red palm oil (omukwano) — deep orange-red colour from beta-carotene.',  150, 'Traditional')
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────────────────────
-- Seed Data — Hero Slides
-- ─────────────────────────────────────────────────────────────────────────────
insert into hero_slides (id, tag, title, subtitle, cta, bg) values
(1, 'Daily Fresh Deals',           'Farm to Table, Every Single Day',         'Handpicked fresh produce delivered to your door within hours of harvest.',                    'Shop Fresh',    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&h=500&fit=crop'),
(2, 'Dry Foods Sale – Up to 30% Off','Stock Your Pantry Smart & Affordable',  'Premium rice, grains, flour, beans and more. Bulk deals that save you more.',               'Shop Dry Foods','https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1400&h=500&fit=crop'),
(3, 'Free Delivery Today',          'Quality You Can Taste, Prices You''ll Love','SkieZ Fresh Farm brings you the best from local farms — fresher, faster.',                 'Order Now',     'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1400&h=500&fit=crop')
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────────────────────
-- Seed Data — Ticker Items
-- ─────────────────────────────────────────────────────────────────────────────
insert into ticker_items (text, price, original) values
('Pishori Rice 2kg',    'UGX 12,000', 'UGX 15,000'),
('Fresh Tomatoes 1kg',  'UGX 2,500',  'UGX 3,200'),
('Sunflower Oil 2L',    'UGX 18,000', 'UGX 22,000'),
('Avocados (3pcs)',      'UGX 4,000',  'UGX 5,500'),
('Posho Flour 2kg',     'UGX 6,000',  'UGX 8,000'),
('Eggs Tray (30)',      'UGX 18,000', 'UGX 22,000'),
('Green Grams 500g',    'UGX 4,500',  'UGX 6,000'),
('Pilau Masala 100g',   'UGX 4,500',  'UGX 6,000');
