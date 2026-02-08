"use client";

import { motion } from "framer-motion";
import { NewsArticle } from "@/types/news";
import { formatDistanceToNow } from "date-fns";
import GlassCard from "./GlassCard";
import { useState } from "react";

interface NewsCardProps {
    article: NewsArticle;
    index: number;
}

export default function NewsCard({ article, index }: NewsCardProps) {
    const [imageError, setImageError] = useState(false);

    const sourceColors: Record<string, string> = {
        reddit: "bg-cyan-500/20 text-cyan-400",
        hackernews: "bg-orange-500/20 text-orange-400",
        techcrunch: "bg-green-500/20 text-green-400",
        theverge: "bg-purple-500/20 text-purple-400",
        other: "bg-pink-500/20 text-pink-400",
    };

    // Generate gradient based on article ID for consistency
    const getGradientColors = () => {
        const hash = article.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const gradients = [
            "from-cyan-500/40 via-purple-500/40 to-pink-500/40",
            "from-purple-500/40 via-pink-500/40 to-orange-500/40",
            "from-blue-500/40 via-cyan-500/40 to-purple-500/40",
            "from-pink-500/40 via-orange-500/40 to-yellow-500/40",
            "from-green-500/40 via-cyan-500/40 to-blue-500/40",
        ];
        return gradients[hash % gradients.length];
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
        >
            <GlassCard>
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="block group">
                    {/* Thumbnail or Gradient Placeholder */}
                    {article.thumbnail && (
                        <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                            {!imageError ? (
                                <>
                                    <img
                                        src={article.thumbnail}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={() => setImageError(true)}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 to-transparent opacity-60" />
                                </>
                            ) : (
                                // Gradient placeholder for failed images
                                <div className={`w-full h-full bg-gradient-to-br ${getGradientColors()} flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}>
                                    <div className="text-center p-4">
                                        <div className="text-4xl mb-2">📰</div>
                                        <div className="text-xs text-white/60">Image unavailable</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Source badge and time */}
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${sourceColors[article.source]}`}>
                            {article.source}
                        </span>
                        <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                        </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2 group-hover:gradient-text transition-all duration-300 line-clamp-2">
                        {article.title}
                    </h3>

                    {/* Description */}
                    {article.description && (
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                            {article.description}
                        </p>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        {article.author && (
                            <span className="flex items-center gap-1">
                                <span className="text-cyan-400">@</span>{article.author}
                            </span>
                        )}
                        {article.upvotes !== undefined && article.upvotes > 0 && (
                            <span className="flex items-center gap-1">
                                ⬆️ {article.upvotes}
                            </span>
                        )}
                        {article.comments !== undefined && article.comments > 0 && (
                            <span className="flex items-center gap-1">
                                💬 {article.comments}
                            </span>
                        )}
                    </div>
                </a>
            </GlassCard>
        </motion.div>
    );
}
