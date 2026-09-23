create extension if not exists "pgcrypto";

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  category text,
  price_amount integer,
  currency text not null default 'gbp',
  stripe_price_id text,
  sizes text[] not null default '{}',
  stock integer not null default 0,
  sizing_guide text,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,
  customer_email text,
  amount_total integer,
  currency text,
  payment_status text,
  cart jsonb,
  created_at timestamptz not null default now()
);

alter table products enable row level security;
alter table orders enable row level security;

drop policy if exists "public_read_active_products" on products;

create policy "public_read_active_products"
on products
for select
using (is_active = true);
