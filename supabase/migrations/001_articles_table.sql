-- Articles table for AI-rewritten news content
create table if not exists articles (
  id uuid default gen_random_uuid() primary key,
  original_title text not null,
  rewritten_title text,
  original_url text unique not null,
  source_domain text not null,
  raw_content text,
  summary_content text,
  image_url text,
  published_at timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

-- Index for faster queries
create index if not exists idx_articles_source on articles(source_domain);
create index if not exists idx_articles_published on articles(published_at desc);
create index if not exists idx_articles_created on articles(created_at desc);

-- Enable row level security
alter table articles enable row level security;

-- Allow public read access
drop policy if exists "Allow public read access" on articles;
create policy "Allow public read access"
  on articles for select
  using (true);

-- **FIX: Allow public insert access (for scraper)**
drop policy if exists "Allow public insert access" on articles;
create policy "Allow public insert access"
  on articles for insert
  with check (true);
