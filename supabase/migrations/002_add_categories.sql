-- Add category column to articles table
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS category text DEFAULT 'Tech';

-- Add view_count column for popular tracking
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;

-- Create index for category filtering
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);

-- Create index for popular sorting
CREATE INDEX IF NOT EXISTS idx_articles_views ON articles(view_count DESC);
