"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface Article {
    id: string;
    title: string;
    description: string;
    url: string;
    source: string;
    category: string;
    content?: string;
    imageUrl?: string;
    publishedAt: string;
}

const categoryStyles: Record<string, { bg: string; border: string; text: string }> = {
    AI: { bg: "bg-blue-50", border: "border-blue-500", text: "text-blue-700" },
    Space: { bg: "bg-purple-50", border: "border-purple-500", text: "text-purple-700" },
    Gaming: { bg: "bg-green-50", border: "border-green-500", text: "text-green-700" },
    Cybersecurity: { bg: "bg-red-50", border: "border-red-500", text: "text-red-700" },
    Innovation: { bg: "bg-orange-50", border: "border-orange-500", text: "text-orange-700" },
    Crypto: { bg: "bg-yellow-50", border: "border-yellow-600", text: "text-yellow-800" },
    Tech: { bg: "bg-gray-50", border: "border-gray-500", text: "text-gray-700" },
};

export default function ArticlePage() {
    const params = useParams();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchArticle() {
            try {
                const res = await fetch(`/api/article/${params.id}`);
                if (!res.ok) {
                    throw new Error('Article not found');
                }
                const data = await res.json();
                setArticle(data);
            } catch (error) {
                console.error("Failed to fetch article:", error);
                setError(error instanceof Error ? error.message : 'Failed to load article');
            } finally {
                setLoading(false);
            }
        }
        fetchArticle();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-bold uppercase">Loading Article...</p>
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-8xl mb-4">😕</div>
                    <p className="text-gray-600 mb-4 font-bold uppercase">{error || 'Article not found'}</p>
                    <Link href="/latest" className="px-6 py-3 bg-black text-white font-bold uppercase border-4 border-black hover:bg-orange-500 transition">
                        ← Back to Latest
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b-4 border-black bg-white sticky top-0 z-50 shadow-md">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/latest" className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center transform rotate-3">
                                <span className="text-white font-black text-xl italic">I</span>
                            </div>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></div>
                        </div>
                        <div>
                            <span className="text-2xl font-black text-black tracking-tighter">InkFlow</span>
                            <div className="text-xs font-bold text-orange-600 -mt-1">NEWS FEED</div>
                        </div>
                    </Link>

                    <Link
                        href="/latest"
                        className="px-4 py-2 bg-black text-white font-bold uppercase text-sm border-4 border-black hover:bg-orange-500 transition"
                    >
                        ← Back
                    </Link>
                </div>
            </header>

            {/* Article Content */}
            <article className="max-w-4xl mx-auto px-6 py-12">
                {/* Category & Date */}
                <div className="flex items-center gap-4 mb-6">
                    <span className={`px-4 py-2 rounded-none text-sm font-black uppercase border-l-4 ${categoryStyles[article.category].bg} ${categoryStyles[article.category].border} ${categoryStyles[article.category].text}`}>
                        {article.category}
                    </span>
                    <span className="text-sm text-gray-500 font-bold">
                        {new Date(article.publishedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-5xl font-black text-black mb-6 leading-tight tracking-tight">
                    {article.title}
                </h1>

                {/* Description */}
                <div className="border-l-4 border-orange-500 pl-6 mb-8">
                    <p className="text-xl text-gray-700 leading-relaxed font-medium italic">
                        {article.description}
                    </p>
                </div>

                {/* Featured Image */}
                {article.imageUrl && (
                    <div className="mb-8 border-4 border-black">
                        <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-auto"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                            }}
                        />
                    </div>
                )}

                {/* Source */}
                <div className="flex items-center justify-between pb-6 mb-8 border-b-4 border-black">
                    <span className="text-sm font-black uppercase">
                        Source: {article.source}
                    </span>
                    <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-orange-600 hover:text-orange-700 font-bold uppercase flex items-center gap-2"
                    >
                        View Original <span className="text-xl">→</span>
                    </a>
                </div>

                {/* Article Content - Clean Paragraphs */}
                <div className="prose prose-lg max-w-none">
                    <div className="text-gray-800 leading-[1.8] space-y-6">
                        {article.content && article.content.length > 500 ? (
                            article.content.split('\n\n').map((paragraph, index) => (
                                <p key={index} className="text-lg font-normal mb-6 text-justify">
                                    {paragraph}
                                </p>
                            ))
                        ) : (
                            <div>
                                <p className="text-lg font-normal text-gray-700 mb-6 text-justify">
                                    {article.description}
                                </p>
                                <div className="bg-orange-50 border-l-4 border-orange-500 p-6">
                                    <p className="font-bold text-orange-900 mb-2">📖 Full Article Available</p>
                                    <p className="text-gray-700">
                                        This is a preview. Click "Read Full Article" below to view the complete story on {article.source}.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="mt-12 pt-8 border-t-4 border-black flex items-center justify-between gap-4">
                    <Link
                        href="/latest"
                        className="px-6 py-3 bg-white text-black font-black uppercase border-4 border-black hover:bg-gray-100 transition"
                    >
                        ← Back to Feed
                    </Link>
                    <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-black text-white font-black uppercase border-4 border-black hover:bg-orange-500 transition flex items-center gap-2"
                    >
                        Read on {article.source} <span className="text-xl">→</span>
                    </a>
                </div>
            </article>
        </div>
    );
}
