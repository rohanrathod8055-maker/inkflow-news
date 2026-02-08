import axios from "axios";
import { NewsArticle } from "@/types/news";

export async function scrapeYouTubeTech(limit: number = 15): Promise<NewsArticle[]> {
    try {
        console.log("🎥 Starting YouTube scraping...");
        const articles: NewsArticle[] = [];
        const now = Date.now();

        // Use YouTube RSS feed for reliable data
        const channels = [
            { id: "UCBJycsmduvYEL83R_U4JriQ", name: "Marques Brownlee (MKBHD)" },
            { id: "UCXuqSBlHAE6Xw-yeJA0Tunw", name: "Linus Tech Tips" },
            { id: "UC6107grRI4m0o2-emgoDnAA", name: "SomeOrdinaryGamers" },
        ];

        for (const channel of channels) {
            if (articles.length >= limit) break;

            try {
                const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channel.id}`;
                const response = await axios.get(feedUrl, {
                    timeout: 10000,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    },
                });

                // Parse XML
                const videoIdMatches = response.data.matchAll(/<yt:videoId>(.+?)<\/yt:videoId>/g);
                const titleMatches = response.data.matchAll(/<title>(.+?)<\/title>/g);
                const publishedMatches = response.data.matchAll(/<published>(.+?)<\/published>/g);

                const videoIds = Array.from(videoIdMatches).map(m => m[1]);
                const titles = Array.from(titleMatches).map(m => m[1]).slice(1); // Skip channel title
                const publishedDates = Array.from(publishedMatches).map(m => m[1]);

                for (let i = 0; i < Math.min(3, videoIds.length); i++) {
                    if (articles.length >= limit) break;

                    const videoId = videoIds[i];
                    const title = titles[i]?.replace(/&amp;/g, "&").replace(/&quot;/g, '"') || "";
                    const publishedDate = publishedDates[i] ? new Date(publishedDates[i]) : new Date();

                    articles.push({
                        id: `youtube-${videoId}`,
                        title,
                        description: `Tech video from ${channel.name}`,
                        url: `https://www.youtube.com/watch?v=${videoId}`,
                        source: "youtube" as const,
                        category: "youtube",
                        author: channel.name,
                        publishedAt: publishedDate,
                        scrapedAt: new Date(now),
                        thumbnail: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
                    });
                }
            } catch (error) {
                console.error(`YouTube scraping failed for ${channel.name}:`, error);
            }
        }

        console.log(`✅ YouTube: Scraped ${articles.length} videos`);
        return articles;
    } catch (error) {
        console.error("❌ YouTube scraping failed:", error);
        return [];
    }
}
