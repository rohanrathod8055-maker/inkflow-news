import axios from "axios";
import * as cheerio from "cheerio";
import { NewsArticle } from "@/types/news";

export async function scrapeTheHindu(limit: number = 30): Promise<NewsArticle[]> {
    try {
        console.log("📰 Starting The Hindu scraping...");
        const articles: NewsArticle[] = [];
        const now = Date.now();

        const sections = [
            { url: "https://www.thehindu.com/sci-tech/technology/", category: "tech" as const },
            { url: "https://www.thehindu.com/news/international/", category: "international" as const },
            { url: "https://www.thehindu.com/news/national/", category: "national" as const },
            { url: "https://www.thehindu.com/business/", category: "business" as const },
            { url: "https://www.thehindu.com/sport/", category: "sports" as const },
            { url: "https://www.thehindu.com/entertainment/", category: "entertainment" as const },
        ];

        for (const section of sections) {
            if (articles.length >= limit) break;

            try {
                const response = await axios.get(section.url, {
                    timeout: 10000,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    },
                });

                const $ = cheerio.load(response.data);

                // The Hindu uses various article containers
                $("article, .story-card, .element").slice(0, 5).each((i, elem) => {
                    if (articles.length >= limit) return false;

                    const $elem = $(elem);

                    // Try multiple selectors for title
                    const titleElem = $elem.find("h2 a, h3 a, .title a, a[data-track]").first();
                    const title = titleElem.text().trim();
                    const relativeUrl = titleElem.attr("href");

                    if (!title || !relativeUrl || title.length < 20) return;

                    // Build absolute URL
                    const url = relativeUrl.startsWith("http")
                        ? relativeUrl
                        : `https://www.thehindu.com${relativeUrl}`;

                    // Extract description
                    const desc = $elem.find("p, .intro, .lead-para").first().text().trim();

                    // Extract thumbnail
                    let thumbnail: string | undefined;
                    const imgElem = $elem.find("img").first();
                    if (imgElem.length) {
                        const src = imgElem.attr("src") || imgElem.attr("data-src");
                        if (src && src.startsWith("http")) {
                            thumbnail = src;
                        }
                    }

                    // Extract date
                    const timeElem = $elem.find("time").first();
                    const dateStr = timeElem.attr("datetime") || timeElem.text();
                    let publishedDate = new Date();
                    if (dateStr) {
                        const parsed = new Date(dateStr);
                        if (!isNaN(parsed.getTime())) {
                            publishedDate = parsed;
                        }
                    }

                    articles.push({
                        id: `thehindu-${section.category}-${i}-${Date.now()}`,
                        title,
                        description: desc || \"\",
                        url,
                        source: "thehindu",
                        category: section.category,
                        thumbnail,
                        author: "The Hindu",
                        publishedAt: publishedDate,
                        scrapedAt: new Date(now),
                    });
                });
            } catch (error) {
                console.error(`Failed to scrape ${section.category}:`, error);
            }
        }

        console.log(`✅ The Hindu: Scraped ${articles.length} articles`);
        return articles;
    } catch (error) {
        console.error("❌ The Hindu scraping failed:", error);
        return [];
    }
}
