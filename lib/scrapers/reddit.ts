import axios from "axios";
import { NewsArticle } from "@/types/news";

export async function scrapeReddit(
    subreddit: string = "technology",
    limit: number = 25
): Promise<NewsArticle[]> {
    const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`;

    try {
        const response = await axios.get(url, {
            headers: { "User-Agent": "NewsAggregator/1.0" }
        });

        const posts = response.data.data.children;
        const now = Date.now();
        const oneDayAgo = now - 24 * 60 * 60 * 1000;

        return posts
            .filter((post: any) => post.data.created_utc * 1000 > oneDayAgo)
            .map((post: any) => ({
                id: `reddit-${post.data.id}`,
                title: post.data.title,
                description: post.data.selftext?.substring(0, 200) || "",
                url: post.data.url,
                source: "reddit" as const,
                category: "tech" as const,
                author: post.data.author,
                publishedAt: new Date(post.data.created_utc * 1000),
                scrapedAt: new Date(now),
                upvotes: post.data.ups,
                comments: post.data.num_comments,
                thumbnail: post.data.thumbnail !== "self" && post.data.thumbnail !== "default" ? post.data.thumbnail : undefined,
            }));
    } catch (error) {
        console.error(`Error scraping Reddit r/${subreddit}:`, error);
        return [];
    }
}

export async function scrapeMultipleSubreddits(subreddits: string[] = ["technology", "programming", "tech"]): Promise<NewsArticle[]> {
    const results = await Promise.all(
        subreddits.map(sub => scrapeReddit(sub, 15))
    );
    return results.flat();
}
