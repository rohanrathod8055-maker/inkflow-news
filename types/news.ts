export interface NewsArticle {
    id: string;
    title: string;
    description: string;
    url: string;
    source: "reddit" | "hackernews" | "techcrunch" | "theverge" | "youtube" | "twitter" | "instagram" | "thehindu" | "other";
    category: "tech" | "gaming" | "crypto" | "international" | "national" | "business" | "sports" | "entertainment" | "other";
    author?: string;
    publishedAt: Date;
    scrapedAt: Date;
    upvotes?: number;
    comments?: number;
    thumbnail?: string;
}

export interface NewsFilters {
    source?: string;
    category?: string;
    searchQuery?: string;
}

export interface NewsAPIResponse {
    articles: NewsArticle[];
    total: number;
}
