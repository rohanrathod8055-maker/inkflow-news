import axios from "axios";
import * as cheerio from "cheerio";
import { NewsArticle } from "@/types/news";

export async function scrapeTwitterTech(limit: number = 15): Promise<NewsArticle[]> {
    try {
        console.log("🐦 Starting Twitter/X scraping...");
        const articles: NewsArticle[] = [];
        const now = Date.now();

        // Strategy: Use Nitter instance (privacy-focused Twitter frontend)
        const nitterInstance = "nitter.poast.org"; // More reliable instance
        const accounts = ["verge", "techcrunch", "MKBHD", "tim_cook", "elonmusk"];

        for (const account of accounts) {
            if (articles.length >= limit) break;

            try {
                const url = `https://${nitterInstance}/${account}`;
                const response = await axios.get(url, {
                    timeout: 10000,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    },
                });

                const $ = cheerio.load(response.data);

                $(".timeline-item").slice(0, 2).each((i, item) => {
                    if (articles.length >= limit) return false;

                    const $item = $(item);
                    const text = $item.find(".tweet-content").text().trim();
                    const tweetLink = $item.find(".tweet-link").attr("href");
                    const timeStr = $item.find(".tweet-date a").attr("title");

                    if (text && text.length > 20 && tweetLink) {
                        const title = text.substring(0, 120) + (text.length > 120 ? "..." : "");

                        articles.push({
                            id: `twitter-${account}-${i}-${Date.now()}`,
                            title,
                            description: text.substring(0, 300),
                            url: `https://twitter.com${tweetLink}`,
                            source: "twitter" as const,
                            category: "tech" as const,
                            author: `@${account}`,
                            publishedAt: timeStr ? new Date(timeStr) : new Date(now - i * 3600000),
                            scrapedAt: new Date(now),
                        });
                    }
                });
            } catch (error) {
                console.error(`Twitter scraping failed for @${account}:`, error);
            }
        }

        console.log(`✅ Twitter: Scraped ${articles.length} tweets`);
        return articles;
    } catch (error) {
        console.error("❌ Twitter scraping failed:", error);
        return [];
    }
}
