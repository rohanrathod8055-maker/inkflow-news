import axios from "axios";
import { NewsArticle } from "@/types/news";

export async function scrapeHackerNews(limit: number = 30): Promise<NewsArticle[]> {
    try {
        // Get top story IDs
        const topStories = await axios.get("https://hacker-news.firebaseio.com/v0/topstories.json");
        const storyIds = topStories.data.slice(0, limit);

        // Fetch each story
        const stories = await Promise.all(
            storyIds.map((id: number) =>
                axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
            )
        );

        const now = Date.now();
        const oneDayAgo = now - 24 * 60 * 60 * 1000;

        return stories
            .map((res) => res.data)
            .filter((story) => story && story.time * 1000 > oneDayAgo)
            .map((story) => ({
                id: `hn-${story.id}`,
                title: story.title,
                description: story.text?.replace(/<[^>]*>/g, "").substring(0, 200) || "",
                url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
                source: "hackernews" as const,
                category: "tech" as const,
                author: story.by,
                publishedAt: new Date(story.time * 1000),
                scrapedAt: new Date(now),
                upvotes: story.score,
                comments: story.descendants || 0,
            }));
    } catch (error) {
        console.error("Error scraping HackerNews:", error);
        return [];
    }
}
