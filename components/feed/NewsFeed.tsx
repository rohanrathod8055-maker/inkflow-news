"use client";

import { useEffect, useState } from "react";
import NewsCard from "../ui/NewsCard";
import LoadingSkeleton from "../ui/LoadingSkeleton";
import { NewsArticle } from "@/types/news";
import { motion } from "framer-motion";

export default function NewsFeed() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchNews();
    }, []);

    async function fetchNews() {
        try {
            setLoading(true);
            const res = await fetch("/api/news?limit=50");

            if (!res.ok) {
                throw new Error("Failed to fetch news");
            }

            const data = await res.json();
            setArticles(data.articles);
            setError(null);
        } catch (error) {
            console.error("Error fetching news:", error);
            setError("Failed to load news. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (error) {
        return (
            <div className="text-center">
                <div className="glass-card inline-block p-8">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button
                        onClick={fetchNews}
                        className="px-6 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div className="text-center">
                <motion.div
                    className="glass-card inline-block p-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <p className="text-gray-400 mb-4">No news found. Try scraping some articles!</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
                <NewsCard key={article.id} article={article} index={index} />
            ))}
        </div>
    );
}
