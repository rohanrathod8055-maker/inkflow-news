"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NewsArticle } from "@/types/news";
import { formatDistanceToNow } from "date-fns";
import { MovingBorderCard } from "./moving-border";
import { IconExternalLink, IconX } from "@tabler/icons-react";

interface BentoNewsCardProps {
    article: NewsArticle;
    index: number;
    gridSpan?: string;
    onClick?: () => void;
}

export function BentoNewsCard({ article, index, gridSpan = "md:col-span-1", onClick }: BentoNewsCardProps) {
    const [imageError, setImageError] = useState(false);

    const sourceColors: Record<string, string> = {
        reddit: "from-cyan-500/20 to-cyan-600/20 text-cyan-400",
        hackernews: "from-orange-500/20 to-orange-600/20 text-orange-400",
        techcrunch: "from-green-500/20 to-green-600/20 text-green-400",
        theverge: "from-purple-500/20 to-purple-600/20 text-purple-400",
        youtube: "from-red-500/20 to-red-600/20 text-red-400",
        twitter: "from-blue-500/20 to-blue-600/20 text-blue-400",
        instagram: "from-pink-500/20 to-purple-600/20 text-pink-400",
        other: "from-gray-500/20 to-gray-600/20 text-gray-400",
    };

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
            transition={{ delay: index * 0.03, duration: 0.4 }}
            className={gridSpan}
        >
            <MovingBorderCard
                duration={3000}
                containerClassName="h-full"
                className="h-full p-0 overflow-hidden cursor-pointer"
            >
                <div onClick={onClick} className="h-full flex flex-col">
                    {/* Thumbnail or Gradient Placeholder */}
                    {article.thumbnail && (
                        <div className="relative h-48 overflow-hidden">
                            {!imageError ? (
                                <>
                                    <img
                                        src={article.thumbnail}
                                        alt={article.title}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                        onError={() => setImageError(true)}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/50 to-transparent" />
                                </>
                            ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${getGradientColors()} flex items-center justify-center hover:scale-105 transition-transform duration-500`}>
                                    <div className="text-center p-4">
                                        <div className="text-4xl mb-2">📰</div>
                                        <div className="text-xs text-white/60">Image unavailable</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                        {/* Source badge and time */}
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${sourceColors[article.source]}`}>
                                {article.source.toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold mb-2 group-hover:gradient-text transition-all duration-300 line-clamp-3 flex-1">
                            {article.title}
                        </h3>

                        {/* Description */}
                        {article.description && (
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                {article.description}
                            </p>
                        )}

                        {/* Metadata */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-auto">
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
                    </div>
                </div>
            </MovingBorderCard>
        </motion.div>
    );
}
