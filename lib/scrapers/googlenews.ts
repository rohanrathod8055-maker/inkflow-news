import axios from "axios";
import * as cheerio from "cheerio";
import { NewsArticle } from "@/types/news";

export async function scrapeGoogleNews(limit: number = 40): Promise<NewsArticle[]> {
    try {
        console.log("🔍 Starting Google News scraping...");
        const articles: NewsArticle[] = [];
        const now = Date.now();

        // Google News sections for India
        const sections = [
            {
                url: "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtVnVHZ0pKVGlnQVAB?hl=en-IN&gl=IN&ceid=IN%3Aen",
                category: "tech" as const,
                name: "Technology"
            },
            {
                url: "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pKVGlnQVAB?hl=en-IN&gl=IN&ceid=IN%3Aen",
                category: "business" as const,
                name: "Business"
            },
            {
                url: "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtVnVHZ0pKVGlnQVAB?hl=en-IN&gl=IN&ceid=IN%3Aen",
                category: "sports" as const,
                name: "Sports"
            },
            {
                url: "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtVnVHZ0pKVGlnQVAB?hl=en-IN&gl=IN&ceid=IN%3Aen",
                category: "entertainment" as const,
                name: "Entertainment"
            },
            {
                url: "https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRFZxYUdjU0FtVnVHZ0pKVGlnQVAB?hl=en-IN&gl=IN&ceid=IN%3Aen",
                category: "national" as const,
                name: "India"
            },
            {
                url: "https://news.google.com/topics/CAAqKggKIiRDQkFTRlFvSUwyMHZNRGx2TVdRU0FtVnVHZ0pKVGlnQVAB?hl=en-IN&gl=IN&ceid=IN%3Aen",
                category: "international" as const,
                name: "World"
            },
        ];

        for (const section of sections) {
            if (articles.length >= limit) break;

            try {
                const response = await axios.get(section.url, {
                    timeout: 15000,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                        "Accept-Language": "en-US,en;q=0.5",
                    },
                });

                const $ = cheerio.load(response.data);

                // Google News uses specific article structure
                $("article").slice(0, 8).each((i, elem) => {
                    if (articles.length >= limit) return false;

                    const $elem = $(elem);

                    // Title and URL
                    const titleLink = $elem.find("a[href^='./articles']").first();
                    const title = titleLink.text().trim();
                    const relativeUrl = titleLink.attr("href");

                    if (!title || !relativeUrl || title.length < 20) return;

                    // Convert relative URL to Google News article URL
                    const url = `https://news.google.com${relativeUrl.substring(1)}`;

                    // Extract source
                    const sourceElem = $elem.find("div[data-n-tid]").first();
                    const source = sourceElem.text().trim() || "Google News";

                    // Extract time
                    const timeElem = $elem.find("time").first();
                    const dateStr = timeElem.attr("datetime");
                    let publishedDate = new Date();
                    if (dateStr) {
                        const parsed = new Date(dateStr);
                        if (!isNaN(parsed.getTime())) {
                            publishedDate = parsed;
                        }
                    }

                    articles.push({
                        id: `googlenews-${section.category}-${i}-${Date.now()}`,
                        title,
                        description: `${section.name} news from ${source}`,
                        url,
                        source: "other",
                        category: section.category,
                        author: source,
                        publishedAt: publishedDate,
                        scrapedAt: new Date(now),
                    });
                });

                // Small delay between requests
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`Failed to scrape ${section.name}:`, error);
            }
        }

        console.log(`✅ Google News: Scraped ${articles.length} articles`);
        return articles;
    } catch (error) {
        console.error("❌ Google News scraping failed:", error);
        return [];
    }
}
