import { NewsArticle } from "@/types/news";

// SQLite schema
export const createTableSQL = `
  CREATE TABLE IF NOT EXISTS news_articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT UNIQUE NOT NULL,
    source TEXT NOT NULL,
    category TEXT NOT NULL,
    author TEXT,
    published_at INTEGER NOT NULL,
    scraped_at INTEGER NOT NULL,
    upvotes INTEGER,
    comments INTEGER,
    thumbnail TEXT
  );
  
  CREATE INDEX IF NOT EXISTS idx_published_at ON news_articles(published_at DESC);
  CREATE INDEX IF NOT EXISTS idx_source ON news_articles(source);
  CREATE INDEX IF NOT EXISTS idx_category ON news_articles(category);
`;

export type { NewsArticle };
