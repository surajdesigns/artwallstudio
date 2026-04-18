-- ============================================================
-- ArtWall Studio — Additional SQL (run after main schema)
-- ============================================================

-- ─────────────────────────────────────────
-- NEWSLETTER SUBSCRIBERS
-- ─────────────────────────────────────────
create table if not exists public.newsletter_subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  subscribed_at timestamptz default now(),
  is_active boolean default true
);

alter table public.newsletter_subscribers enable row level security;
create policy "Anyone can subscribe" on public.newsletter_subscribers
  for insert with check (true);
create policy "Admins can view subscribers" on public.newsletter_subscribers
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ─────────────────────────────────────────
-- PRODUCT ANALYTICS (views tracking)
-- ─────────────────────────────────────────
create table if not exists public.product_views (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete cascade,
  user_id uuid references auth.users on delete set null,
  session_id text,
  created_at timestamptz default now()
);

alter table public.product_views enable row level security;
create policy "Anyone can log views" on public.product_views for insert with check (true);
create policy "Admins can view analytics" on public.product_views for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ─────────────────────────────────────────
-- PROMO CODES
-- ─────────────────────────────────────────
create table if not exists public.promo_codes (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  description text,
  discount_type text check (discount_type in ('percentage', 'fixed')),
  discount_value decimal(10,2) not null,
  min_order_amount decimal(10,2) default 0,
  max_uses int,
  current_uses int default 0,
  expires_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.promo_codes enable row level security;
create policy "Anyone can check promo codes" on public.promo_codes
  for select using (is_active = true);
create policy "Admins manage promo codes" on public.promo_codes for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Insert some demo promo codes
insert into public.promo_codes (code, description, discount_type, discount_value, min_order_amount) values
  ('BIENVENUE10', 'Remise 10% premiere commande', 'percentage', 10, 500),
  ('ART50', 'Remise 50 MAD', 'fixed', 50, 300),
  ('NOEL2024', 'Offre speciale Noel 15%', 'percentage', 15, 1000);

-- ─────────────────────────────────────────
-- DECREMENT STOCK FUNCTION
-- ─────────────────────────────────────────
create or replace function public.decrement_stock(
  product_id uuid,
  quantity int
) returns void as $$
begin
  update public.products
  set stock_quantity = greatest(0, stock_quantity - quantity)
  where id = product_id;
end;
$$ language plpgsql security definer;

-- ─────────────────────────────────────────
-- GET PRODUCT RECOMMENDATIONS
-- (scored by category + tag overlap)
-- ─────────────────────────────────────────
create or replace function public.get_recommendations(
  p_product_id uuid,
  p_limit int default 6
) returns setof public.products as $$
declare
  v_category_id uuid;
  v_tags text[];
begin
  select category_id, tags into v_category_id, v_tags
  from public.products where id = p_product_id;

  return query
  select p.*,
    (
      case when p.category_id = v_category_id then 3 else 0 end +
      case when p.tags && v_tags then array_length(array(
        select unnest(p.tags) intersect select unnest(v_tags)
      ), 1) else 0 end +
      case when p.is_featured then 1 else 0 end
    ) as score
  from public.products p
  where p.id != p_product_id
    and p.is_active = true
  order by score desc, p.created_at desc
  limit p_limit;
end;
$$ language plpgsql security definer;

-- ─────────────────────────────────────────
-- ORDER STATUS HISTORY
-- ─────────────────────────────────────────
create table if not exists public.order_status_history (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  status text not null,
  note text,
  created_by uuid references auth.users,
  created_at timestamptz default now()
);

alter table public.order_status_history enable row level security;
create policy "Users can view their order history" on public.order_status_history
  for select using (
    exists (select 1 from public.orders where id = order_id and user_id = auth.uid())
  );
create policy "Admins manage status history" on public.order_status_history for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Auto log status changes
create or replace function public.log_order_status_change()
returns trigger as $$
begin
  if new.status != old.status then
    insert into public.order_status_history (order_id, status, created_by)
    values (new.id, new.status, auth.uid());
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger order_status_changed
  after update on public.orders
  for each row execute procedure public.log_order_status_change();

-- ─────────────────────────────────────────
-- PRODUCT RATINGS VIEW (materialized)
-- ─────────────────────────────────────────
create or replace view public.product_ratings as
select
  product_id,
  count(*) as review_count,
  round(avg(rating)::numeric, 1) as avg_rating,
  count(case when rating = 5 then 1 end) as five_star,
  count(case when rating = 4 then 1 end) as four_star,
  count(case when rating = 3 then 1 end) as three_star,
  count(case when rating = 2 then 1 end) as two_star,
  count(case when rating = 1 then 1 end) as one_star
from public.reviews
where is_approved = true
group by product_id;

-- ─────────────────────────────────────────
-- INDEXES for performance
-- ─────────────────────────────────────────
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_active on public.products(is_active);
create index if not exists idx_products_featured on public.products(is_featured);
create index if not exists idx_products_price on public.products(price);
create index if not exists idx_products_created on public.products(created_at desc);
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_reviews_product on public.reviews(product_id);
create index if not exists idx_wishlists_user on public.wishlists(user_id);
create index if not exists idx_product_images_product on public.product_images(product_id);
create index if not exists idx_product_images_primary on public.product_images(is_primary);
