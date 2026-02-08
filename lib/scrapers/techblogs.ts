import axios from "axios";
import * as cheerio from "cheerio";
import { chromium } from "playwright";
import { NewsArticle } from "@/types/news";

// Try RSS feed first, fall back to Playwright if needed
export async function scrapeTechCrunch(limit: number = 20): Promise<NewsArticle[]> {
    try {
        // TechCrunch RSS feed (works well, no need for Playwright usually)
        const response = await axios.get("https://techcrunch.com/feed/", {
            timeout: 10000,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
        });
        const $ = cheerio.load(response.data, { xmlMode: true });

        const articles: NewsArticle[] = [];
        const now = Date.now();
        const oneDayAgo = now - 24 * 60 * 60 * 1000;

        $("item").each((i, item) => {
            if (i >= limit) return false;

            const $item = $(item);
            const pubDate = new Date($item.find("pubDate").text());

            if (pubDate.getTime() < oneDayAgo) return;

            articles.push({
                id: `tc-${i}-${Date.now()}`,
                title: $item.find("title").text(),
                description: $item.find("description").text().replace(/<[^>]*>/g, "").substring(0, 200),
                url: $item.find("link").text(),
                source: "techcrunch" as const,
                category: "tech" as const,
                author: $item.find("dc\\:creator, creator").text() || "TechCrunch",
                publishedAt: pubDate,
                scrapedAt: new Date(now),
            });
        });

        return articles;
    } catch (error) {
        console.error("Error scraping TechCrunch (RSS):", error);
        // Could fallback to Playwright here if RSS fails
        return [];
    }
}

export async function scrapeTheVerge(limit: number = 20): Promise<NewsArticle[]> {
    try {
        // The Verge RSS feed
        const response = await axios.get("https://www.theverge.com/rss/index.xml", {
            timeout: 10000,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
        });
        const $ = cheerio.load(response.data, { xmlMode: true });

        const articles: NewsArticle[] = [];
        const now = Date.now();
        const oneDayAgo = now - 24 * 60 * 60 * 1000;

        $("item").each((i, item) => {
            if (i >= limit) return false;

            const $item = $(item);
            const pubDate = new Date($item.find("pubDate").text());

            if (pubDate.getTime() < oneDayAgo) return;

            articles.push({
                id: `verge-${i}-${Date.now()}`,
                title: $item.find("title").text(),
                description: $item.find("description").text().replace(/<[^>]*>/g, "").substring(0, 200),
                url: $item.find("link").text(),
                source: "theverge" as const,
                category: "tech" as const,
                author: $item.find("dc\\:creator, creator").text() || "The Verge",
                publishedAt: pubDate,
                scrapedAt: new Date(now),
            });
        });

        return articles;
    } catch (error) {
        console.error("Error scraping The Verge (RSS):", error);
        return [];
    }
}

// Playwright scraper for dynamic React sites (example for future use)
export async function scrapeWithPlaywright(url: string, selector: string): Promise<NewsArticle[]> {
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext({
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        });
        const page = await context.newPage();

        await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

        // Wait for dynamic content to load
        await page.waitForSelector(selector, { timeout: 10000 });

        // Extract articles (customize based on site structure)
        const articles = await page.evaluate(() => {
            // This would need to be customized per site
            return [];
        });

        return articles as NewsArticle[];
    } catch (error) {
        console.error("Playwright scraping failed:", error);
        return [];
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}
