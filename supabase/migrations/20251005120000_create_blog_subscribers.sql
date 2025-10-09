-- Enable required extensions
create extension if not exists "pgcrypto";

-- Blog subscribers table
create table if not exists public.blog_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_name text,
  last_name text,
  is_active boolean not null default true,
  unsubscribe_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_subscribers_email_unique unique (lower(email))
);

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_blog_subscribers
before update on public.blog_subscribers
for each row
execute procedure public.set_updated_at();

-- Helpful indexes
create index if not exists idx_blog_subscribers_is_active on public.blog_subscribers(is_active);
create index if not exists idx_blog_subscribers_created_at on public.blog_subscribers(created_at);

-- (Optional) RLS can be enabled later; service role is used by API routes
-- alter table public.blog_subscribers enable row level security;

-- Optional: campaign tracking table used by send-notifications route
create table if not exists public.blog_email_campaigns (
  id uuid primary key default gen_random_uuid(),
  blog_post_id uuid,
  campaign_type text not null,
  subject_line text,
  sent_to_count integer,
  brevo_campaign_id text,
  created_at timestamptz not null default now()
);

create index if not exists idx_blog_email_campaigns_created_at on public.blog_email_campaigns(created_at);

