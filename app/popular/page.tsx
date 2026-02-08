"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LiquidMetalButton } from "@/components/ui/liquid-metal";
import { Zap } from "lucide-react";

interface Article {
    id: string;
    title: string;
    description: string;
    source: string;
    category: string;
    viewCount: number;
    publishedAt: string;
}

const categoryStyles: Record<string, string> = {
    AI: "bg-blue-500 text-white",
    Space: "bg-purple-500 text-white",
    Gaming: "bg-green-500 text-white",
    Cybersecurity: "bg-red-500 text-white",
    Innovation: "bg-orange-500 text-white",
    Crypto: "bg-yellow-500 text-black",
    Tech: "bg-gray-500 text-white",
};

export default function PopularPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    async function fetchArticles() {
        setLoading(true);
        try {
            const res = await fetch("/api/news/popular?limit=50");
            const data = await res.json();
            setArticles(data.articles || []);
        } catch (error) {
            console.error("Failed to fetch:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchArticles();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/latest" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">N</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900 tracking-tight">NewsHub</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/latest" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition">
                            Latest
                        </Link>
                        <Link href="/popular" className="text-sm font-semibold text-gray-900 border-b-2 border-black pb-1">
                            Popular
                        </Link>
                    </nav>

                    <LiquidMetalButton
                        onClick={fetchArticles}
                        icon={<Zap className="w-5 h-5" />}
                        size="md"
                        borderWidth={5}
                        metalConfig={{
                            colorBack: "#3b82f6",
                            colorTint: "#93c5fd",
                            distortion: 0.15,
                            speed: 0.4,
                        }}
                    >
                        Refresh
                    </LiquidMetalButton>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-10">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">🔥 Trending Now</h1>
                    <p className="text-gray-600 text-lg">Most viewed articles today</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {articles.map((article, index) => (
                            <article
                                key={article.id}
                                onClick={() => router.push(`/article/${article.id}`)}
                                className="border-2 border-gray-200 rounded-xl p-8 cursor-pointer hover:border-gray-400 hover:shadow-xl transition-all group bg-white"
                            >
                                <div className="flex gap-6">
                                    <div className="flex-shrink-0 text-5xl font-bold text-gray-200 group-hover:text-blue-300 transition">
                                        {String(index + 1).padStart(2, '0')}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${categoryStyles[article.category]}`}>
                                                {article.category}
                                            </span>
                                            <span className="text-sm text-gray-500 font-medium">
                                                {article.viewCount} views
                                            </span>
                                        </div>

                                        <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition">
                                            {article.title}
                                        </h2>

                                        <p className="text-gray-600 mb-4 leading-relaxed">
                                            {article.description}
                                        </p>

                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="font-semibold text-gray-700">{article.source}</span>
                                            <span className="text-gray-400">
                                                {new Date(article.publishedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {articles.length === 0 && !loading && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No popular articles yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
