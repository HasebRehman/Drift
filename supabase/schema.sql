-- Drift Retail / Supabase Database Schema
-- Run this in your Supabase SQL Editor when you are ready to configure the database.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. SCENTS
create table if not exists public.scents (
    id uuid primary key default uuid_generate_v4(),
    slug text unique not null,
    name text not null,
    tagline text,
    description text,
    color_accent text default '#183B2B',
    color_bg text default '#EAF2EC',
    top_notes text[] default '{}',
    heart_notes text[] default '{}',
    base_notes text[] default '{}',
    intensity integer default 4,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. CATEGORIES
create table if not exists public.categories (
    id uuid primary key default uuid_generate_v4(),
    slug text unique not null,
    title text not null,
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PRODUCTS
create table if not exists public.products (
    id uuid primary key default uuid_generate_v4(),
    slug text unique not null,
    title text not null,
    subtitle text,
    description text,
    price numeric(10, 2) not null,
    compare_at_price numeric(10, 2),
    category_id uuid references public.categories(id) on delete set null,
    scent_id uuid references public.scents(id) on delete set null,
    rating numeric(2, 1) default 4.9,
    review_count integer default 0,
    in_stock boolean default true,
    is_featured boolean default false,
    is_bestseller boolean default false,
    badge text,
    images text[] default '{}',
    volume text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. BUNDLES / SETS
create table if not exists public.bundles (
    id uuid primary key default uuid_generate_v4(),
    slug text unique not null,
    title text not null,
    subtitle text,
    description text,
    price numeric(10, 2) not null,
    compare_at_price numeric(10, 2),
    savings_badge text,
    included_products jsonb default '[]'::jsonb,
    images text[] default '{}',
    rating numeric(2, 1) default 5.0,
    review_count integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. REVIEWS
create table if not exists public.reviews (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid references public.products(id) on delete cascade,
    author_name text not null,
    rating integer check (rating between 1 and 5),
    title text,
    content text not null,
    scent_experienced text,
    verified_buyer boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. NEWSLETTER SUBSCRIBERS
create table if not exists public.subscribers (
    id uuid primary key default uuid_generate_v4(),
    email text unique not null,
    source text default 'homepage_footer',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) Configuration
alter table public.scents enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.bundles enable row level security;
alter table public.reviews enable row level security;
alter table public.subscribers enable row level security;

-- Public read access policies
create policy "Allow public read scents" on public.scents for select using (true);
create policy "Allow public read categories" on public.categories for select using (true);
create policy "Allow public read products" on public.products for select using (true);
create policy "Allow public read bundles" on public.bundles for select using (true);
create policy "Allow public read reviews" on public.reviews for select using (true);

-- Public insert policy for newsletter
create policy "Allow newsletter signup" on public.subscribers for insert with check (true);
