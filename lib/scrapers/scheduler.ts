import db from "../db/client";
import { scrapeMultipleSubreddits } from "./reddit";
import { scrapeHackerNews } from "./hackernews";
import { scrapeTechCrunch, scrapeTheVerge } from "./techblogs";
import { scrapeYouTubeTech } from "./youtube";
import { scrapeTwitterTech } from "./twitter";
import { scrapeTheHindu } from "./thehindu";
import { scrapeGoogleNews } from "./googlenews";
import { NewsArticle } from "@/types/news";

export async function runAllScrapers(): Promise<number> {
    console.log("🚀 Starting scraping job...");

    const allArticles: NewsArticle[] = [];

    try {
        // Scrape all sources in parallel (including The Hindu and Google News)
        const [reddit, hn, tc, verge, youtube, twitter, thehindu, googlenews] = await Promise.all([
            scrapeMultipleSubreddits(["technology", "programming", "tech"]),
            scrapeHackerNews(30),
            scrapeTechCrunch(20),
            scrapeTheVerge(20),
            scrapeYouTubeTech(10),
            scrapeTwitterTech(10),
            scrapeTheHindu(30),
            scrapeGoogleNews(40),
        ]);

        allArticles.push(...reddit, ...hn, ...tc, ...verge, ...youtube, ...twitter, ...thehindu, ...googlenews);
        console.log(`📰 Scraped ${allArticles.length} total articles`);

        // Insert into database using async Turso client
        let inserted = 0;
        for (const article of allArticles) {
            try {
                await db.execute({
                    sql: `
            INSERT OR REPLACE INTO news_articles 
            (id, title, description, url, source, category, author, published_at, scraped_at, upvotes, comments, thumbnail)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
                    args: [
                        article.id,
                        article.title,
                        article.description,
                        article.url,
                        article.source,
                        article.category,
                        article.author || null,
                        article.publishedAt.getTime(),
                        article.scrapedAt.getTime(),
                        article.upvotes || null,
                        article.comments || null,
                        article.thumbnail || null,
                    ],
                });
                inserted++;
            } catch (error: any) {
                // Skip duplicates silently
                if (!error.message?.includes("UNIQUE constraint")) {
                    console.error("Error inserting article:", error);
                }
            }
        }

        console.log(`✅ Scraping complete. Inserted/Updated ${inserted} articles.`);
        return inserted;
    } catch (error) {
        console.error("❌ Scraping failed:", error);
        return 0;
    }
}
