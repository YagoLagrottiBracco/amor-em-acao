-- ============================================================================
-- ASSOCIAÇÃO HUMANITÁRIA AMOR EM AÇÃO — SUPABASE SCHEMA
-- Execute este script no SQL Editor do painel do Supabase
-- ============================================================================

create extension if not exists "pgcrypto";

-- 1. Tabela de Publicações do Blog (com suporte a Pill da foto, texto do botão CTA e SEO)
create table if not exists public.blog_posts (
  id text primary key default ('post-' || encode(gen_random_bytes(6), 'hex')),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  pill_text text not null default 'Amor em Ação',
  button_text text not null default 'Ler artigo completo',
  custom_link text,
  cover_image text not null default '/images/casa-amarela-equipe-criancas.jpg',
  cover_image_alt text not null default '',
  category text not null default 'Institucional',
  tags text[] not null default '{}',
  author_name text not null default 'Equipe Editorial Amor em Ação',
  author_role text not null default 'Comunicação Institucional',
  reading_time_minutes integer not null default 4,
  featured boolean not null default false,
  draft boolean not null default false,
  seo_title text not null,
  seo_description text not null,
  focus_keyword text not null default '',
  content text not null,
  faq jsonb not null default '[]'::jsonb,
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_blog_posts_slug on public.blog_posts (slug);
create index if not exists idx_blog_posts_published_at on public.blog_posts (published_at desc);
create index if not exists idx_blog_posts_featured on public.blog_posts (featured);

-- 2. Tabela de Doações (Stripe Checkout + registros diretos de Pix/Transferência)
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique,
  stripe_customer_id text,
  stripe_subscription_id text,
  donor_name text,
  donor_email text,
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'BRL',
  frequency text not null default 'once' check (frequency in ('once', 'monthly')),
  project text not null default 'casa-amarela',
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'canceled')),
  payment_method text not null default 'stripe',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_donations_created_at on public.donations (created_at desc);
create index if not exists idx_donations_status on public.donations (status);
create index if not exists idx_donations_stripe_session on public.donations (stripe_session_id);
create index if not exists idx_donations_stripe_customer on public.donations (stripe_customer_id);
create index if not exists idx_donations_stripe_subscription on public.donations (stripe_subscription_id);

-- 3. Tabela de Voluntários (inscrições do formulário de voluntariado)
create table if not exists public.volunteers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  area text not null,
  availability text not null default 'A combinar',
  message text,
  status text not null default 'new' check (status in ('new', 'contacted', 'active', 'archived')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_volunteers_created_at on public.volunteers (created_at desc);
create index if not exists idx_volunteers_status on public.volunteers (status);

-- Políticas RLS (Row Level Security)
alter table public.blog_posts enable row level security;
alter table public.donations enable row level security;
alter table public.volunteers enable row level security;

-- Leitura pública apenas para posts publicados do blog
drop policy if exists "Public can read published blog posts" on public.blog_posts;
create policy "Public can read published blog posts"
  on public.blog_posts
  for select
  using (draft = false);

-- 4. Tabela de Missões / Ações Comunitárias (CMS de Páginas Modulares)
create table if not exists public.action_missions (
  id text primary key default ('action-' || encode(gen_random_bytes(6), 'hex')),
  slug text not null unique,
  title text not null,
  nav_subtitle text not null default '',
  kicker text not null default 'Ação Comunitária',
  description text not null default '',
  cover_image text not null default '/images/casa-amarela-equipe-criancas.jpg',
  cover_image_alt text not null default '',
  status text not null default 'published' check (status in ('published', 'draft')),
  featured_in_nav boolean not null default true,
  blocks jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  seo_title text,
  seo_description text
);

create index if not exists idx_action_missions_slug on public.action_missions (slug);
create index if not exists idx_action_missions_created_at on public.action_missions (created_at desc);
create index if not exists idx_action_missions_status on public.action_missions (status);

-- 5. Tabela de Documentos e Prestações de Contas da Transparência
create table if not exists public.transparency_documents (
  id text primary key default ('doc-' || encode(gen_random_bytes(6), 'hex')),
  title text not null,
  category text not null default 'institucional' check (category in ('institucional', 'financeiro', 'atividades', 'fontes')),
  year text,
  file_url text not null,
  file_size text,
  description text,
  published_at timestamptz not null default now(),
  active boolean not null default true,
  order_index integer not null default 0
);

create index if not exists idx_transparency_documents_category on public.transparency_documents (category);
create index if not exists idx_transparency_documents_published_at on public.transparency_documents (published_at desc);

-- Políticas RLS adicionais
alter table public.action_missions enable row level security;
alter table public.transparency_documents enable row level security;

drop policy if exists "Public can read published action missions" on public.action_missions;
create policy "Public can read published action missions"
  on public.action_missions
  for select
  using (status = 'published');

drop policy if exists "Public can read active transparency documents" on public.transparency_documents;
create policy "Public can read active transparency documents"
  on public.transparency_documents
  for select
  using (active = true);

-- Bucket público para upload de imagens do blog (Storage)
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;
