-- ============================================================
-- ArtWall Studio — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────
-- PROFILES (extends auth.users)
-- ─────────────────────────────────────────
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  role text default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────
-- CATEGORIES
-- ─────────────────────────────────────────
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  parent_id uuid references public.categories(id),
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table public.categories enable row level security;
create policy "Anyone can view categories" on public.categories for select using (true);
create policy "Admins can manage categories" on public.categories for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Seed categories
insert into public.categories (name, slug, description, sort_order) values
  ('Tableaux', 'tableaux', 'Tableaux d''art pour votre intérieur', 1),
  ('Papier Peint', 'papier-peint', 'Papiers peints et revêtements muraux', 2),
  ('Abstraits', 'abstraits', 'Art abstrait moderne', 3),
  ('Nature & Botanique', 'nature-botanique', 'Motifs naturels et botaniques', 4),
  ('Géométrique', 'geometrique', 'Designs géométriques contemporains', 5),
  ('Portrait', 'portrait', 'Portraits artistiques', 6);

-- ─────────────────────────────────────────
-- PRODUCTS
-- ─────────────────────────────────────────
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  description text,
  short_description text,
  price decimal(10, 2) not null,
  compare_at_price decimal(10, 2),
  category_id uuid references public.categories(id),
  stock_quantity int default 0,
  sku text unique,
  weight decimal(8, 2),
  dimensions jsonb, -- { width, height, depth, unit }
  tags text[],
  is_active boolean default true,
  is_featured boolean default false,
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.products enable row level security;
create policy "Anyone can view active products" on public.products
  for select using (is_active = true);
create policy "Admins can manage products" on public.products for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ─────────────────────────────────────────
-- PRODUCT IMAGES
-- ─────────────────────────────────────────
create table public.product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete cascade,
  url text not null,
  alt text,
  sort_order int default 0,
  is_primary boolean default false,
  created_at timestamptz default now()
);

alter table public.product_images enable row level security;
create policy "Anyone can view product images" on public.product_images for select using (true);
create policy "Admins can manage images" on public.product_images for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ─────────────────────────────────────────
-- PRODUCT VARIANTS (sizes, colors, etc.)
-- ─────────────────────────────────────────
create table public.product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete cascade,
  name text not null,
  value text not null,
  price_modifier decimal(10, 2) default 0,
  stock_quantity int default 0,
  sku text,
  created_at timestamptz default now()
);

alter table public.product_variants enable row level security;
create policy "Anyone can view variants" on public.product_variants for select using (true);
create policy "Admins can manage variants" on public.product_variants for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ─────────────────────────────────────────
-- WISHLISTS
-- ─────────────────────────────────────────
create table public.wishlists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

alter table public.wishlists enable row level security;
create policy "Users manage their own wishlist" on public.wishlists
  for all using (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- ORDERS
-- ─────────────────────────────────────────
create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete set null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  total_amount decimal(10, 2) not null,
  subtotal decimal(10, 2) not null,
  shipping_amount decimal(10, 2) default 0,
  tax_amount decimal(10, 2) default 0,
  discount_amount decimal(10, 2) default 0,
  currency text default 'MAD',
  shipping_address jsonb,
  billing_address jsonb,
  notes text,
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.orders enable row level security;
create policy "Users can view their own orders" on public.orders
  for select using (auth.uid() = user_id);
create policy "Users can create orders" on public.orders for insert
  with check (auth.uid() = user_id);
create policy "Admins can manage all orders" on public.orders for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ─────────────────────────────────────────
-- ORDER ITEMS
-- ─────────────────────────────────────────
create table public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  product_image text,
  quantity int not null,
  unit_price decimal(10, 2) not null,
  total_price decimal(10, 2) not null,
  created_at timestamptz default now()
);

alter table public.order_items enable row level security;
create policy "Users can view their order items" on public.order_items
  for select using (
    exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
  );
create policy "Admins can manage order items" on public.order_items for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ─────────────────────────────────────────
-- REVIEWS
-- ─────────────────────────────────────────
create table public.reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete cascade,
  user_id uuid references auth.users on delete cascade,
  rating int check (rating between 1 and 5),
  title text,
  body text,
  is_approved boolean default false,
  created_at timestamptz default now()
);

alter table public.reviews enable row level security;
create policy "Anyone can view approved reviews" on public.reviews
  for select using (is_approved = true);
create policy "Users can create reviews" on public.reviews for insert
  with check (auth.uid() = user_id);
create policy "Admins manage reviews" on public.reviews for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ─────────────────────────────────────────
-- STORAGE BUCKETS
-- ─────────────────────────────────────────
insert into storage.buckets (id, name, public) values ('products', 'products', true);

create policy "Anyone can view product images"
  on storage.objects for select using (bucket_id = 'products');

create policy "Admins can upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'products' and
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ─────────────────────────────────────────
-- UPDATED_AT TRIGGER
-- ─────────────────────────────────────────
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_products_updated_at before update on public.products
  for each row execute procedure public.update_updated_at();

create trigger update_orders_updated_at before update on public.orders
  for each row execute procedure public.update_updated_at();
