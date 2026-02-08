"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IconX, IconExternalLink, IconLoader } from "@tabler/icons-react";
import { NewsArticle } from "@/types/news";
import { useEffect, useState } from "react";

interface ArticleModalProps {
    article: NewsArticle | null;
    isOpen: boolean;
    onClose: () => void;
}

interface ReadabilityContent {
    title: string;
    content: string;
    textContent: string;
    excerpt: string;
    byline: string | null;
    siteName: string | null;
}

export function ArticleModal({ article, isOpen, onClose }: ArticleModalProps) {
    const [content, setContent] = useState<ReadabilityContent | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (article && isOpen) {
            if (article.source === "youtube") {
                setLoading(false);
                return;
            }
            fetchArticleContent();
        } else {
            setContent(null);
            setError(null);
        }
    }, [article, isOpen]);

    const fetchArticleContent = async () => {
        if (!article) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/read?url=${encodeURIComponent(article.url)}`);
            const data = await response.json();

            if (data.success) {
                setContent(data);
            } else {
                setError(data.error || "Failed to load article");
            }
        } catch (err: any) {
            setError(err.message || "Network error");
        } finally {
            setLoading(false);
        }
    };

    const getYouTubeVideoId = (url: string) => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
        return match ? match[1] : null;
    };

    const isYouTubeVideo = article?.source === "youtube";
    const youtubeVideoId = isYouTubeVideo ? getYouTubeVideoId(article.url) : null;

    if (!article) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="fixed inset-4 md:inset-10 bg-[#111111] rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col border border-white/10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/40">
                            <div className="flex-1 mr-4">
                                <h2 className="text-2xl font-bold text-white line-clamp-1">
                                    {content?.title || article.title}
                                </h2>
                                {content?.byline && (
                                    <p className="text-sm text-gray-400 mt-1">By {content.byline}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                    title="Visit Original"
                                >
                                    <IconExternalLink className="w-5 h-5 text-blue-400" />
                                </a>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <IconX className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            {loading && (
                                <div className="flex flex-col items-center justify-center h-full gap-4">
                                    <IconLoader className="w-12 h-12 text-blue-500 animate-spin" />
                                    <p className="text-gray-400">Loading article...</p>
                                </div>
                            )}

                            {error && (
                                <div className="flex flex-col items-center justify-center h-full gap-4">
                                    <div className="text-4xl">⚠️</div>
                                    <p className="text-red-400 text-center">{error}</p>
                                    <a
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <IconExternalLink className="w-4 h-4" />
                                        Open Original Article
                                    </a>
                                </div>
                            )}

                            {/* YouTube Video Embed */}
                            {isYouTubeVideo && youtubeVideoId && !loading && !error && (
                                <div className="w-full h-full flex flex-col gap-4">
                                    <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                                        <iframe
                                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                                            src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                                            title={article.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                    {article.description && (
                                        <div className="article-content-dark">
                                            <p>{article.description}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Article Content */}
                            {content && !loading && !error && !isYouTubeVideo && (
                                <article className="prose prose-invert max-w-none">
                                    <div
                                        className="article-content-dark"
                                        dangerouslySetInnerHTML={{ __html: content.content }}
                                    />
                                </article>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-white/10 bg-black/40">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>Source: {content?.siteName || article.source}</span>
                                <span>Reader Mode • NewsFlow</span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
