"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LiquidMetalButton } from "@/components/ui/liquid-metal";
import { GlassDock } from "@/components/ui/glass-dock";
import { Sparkles, Rocket, Gamepad2, Shield, Lightbulb, Bitcoin, Zap } from "lucide-react";

interface Article {
    id: string;
    title: string;
    description: string;
    url: string;
    source: string;
    category: string;
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

export default function LatestPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const router = useRouter();

    async function fetchArticles() {
        setLoading(true);
        try {
            const res = await fetch("/api/news?limit=100");
            const data = await res.json();
            setArticles(data.articles || []);
        } catch (error) {
            console.error("Failed to fetch articles:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchArticles();
        const interval = setInterval(fetchArticles, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const filteredArticles = articles.filter((article) => {
        return selectedCategory === "all" || article.category === selectedCategory;
    });

    const categoryItems = [
        { title: "AI", icon: Sparkles, onClick: () => setSelectedCategory("AI") },
        { title: "Space", icon: Rocket, onClick: () => setSelectedCategory("Space") },
        { title: "Gaming", icon: Gamepad2, onClick: () => setSelectedCategory("Gaming") },
        { title: "Security", icon: Shield, onClick: () => setSelectedCategory("Cybersecurity") },
        { title: "Innovation", icon: Lightbulb, onClick: () => setSelectedCategory("Innovation") },
        { title: "Crypto", icon: Bitcoin, onClick: () => setSelectedCategory("Crypto") },
        { title: "Tech", icon: Zap, onClick: () => setSelectedCategory("Tech") },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 relative">
            {/* Manga-style Halftone Pattern Background */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, black 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }}></div>

            {/* Speed Lines Accent */}
            <div className="fixed top-0 right-0 w-1/3 h-screen opacity-[0.02] pointer-events-none" style={{ background: 'repeating-linear-gradient(45deg, black 0px, black 2px, transparent 2px, transparent 10px)' }}></div>

            {/* Manga-style Header with Ink Brush Effect */}
            <header className="border-b-4 border-black bg-white sticky top-0 z-50 shadow-md">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/latest" className="flex items-center gap-3 group">
                        {/* Manga-style Logo */}
                        <div className="relative">
                            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center transform rotate-3 group-hover:rotate-6 transition-transform">
                                <span className="text-white font-black text-2xl italic">I</span>
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
                        </div>
                        <div>
                            <span className="text-3xl font-black text-black tracking-tighter" style={{ fontFamily: 'Arial Black, sans-serif' }}>
                                InkFlow
                            </span>
                            <div className="text-xs font-bold text-orange-600 -mt-1">NEWS FEED</div>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/latest" className="text-sm font-black text-black uppercase tracking-wider border-b-4 border-black pb-1">
                            Latest
                        </Link>
                        <Link href="/popular" className="text-sm font-bold text-gray-500 uppercase tracking-wider hover:text-black transition">
                            Popular
                        </Link>
                    </nav>

                    <LiquidMetalButton
                        onClick={fetchArticles}
                        icon={<Zap className="w-5 h-5" />}
                        size="md"
                        borderWidth={5}
                        metalConfig={{
                            colorBack: "#ff6b35",
                            colorTint: "#ffd700",
                            distortion: 0.2,
                            speed: 0.5,
                        }}
                    >
                        Refresh
                    </LiquidMetalButton>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Glass Dock for Categories */}
                <div className="flex justify-center mb-12 mt-12">
                    <GlassDock items={categoryItems} />
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {/* Manga-style Title */}
                        <div className="mb-10 text-center">
                            <h2 className="text-5xl font-black text-black mb-2 tracking-tighter uppercase" style={{ textShadow: '3px 3px 0px rgba(255,107,53,0.3)' }}>
                                {selectedCategory === "all" ? "Latest News" : selectedCategory}
                            </h2>
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-16 h-1 bg-black"></div>
                                <p className="text-gray-600 font-bold uppercase text-sm tracking-wider">
                                    {filteredArticles.length} Articles
                                </p>
                                <div className="w-16 h-1 bg-black"></div>
                            </div>
                        </div>

                        {/* Featured Large Panel (Manga Panel Style) */}
                        {filteredArticles[0] && (
                            <article
                                onClick={() => router.push(`/article/${filteredArticles[0].id}`)}
                                className="mb-12 border-4 border-black rounded-none overflow-hidden cursor-pointer hover:shadow-2xl transition-all group bg-white relative"
                            >
                                {/* Speed Lines Effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-black to-transparent transform -skew-x-12"></div>
                                </div>

                                <div className="bg-gradient-to-br from-gray-100 to-white h-80 flex items-center justify-center border-b-4 border-black relative">
                                    <div className="text-8xl">📰</div>
                                    {/* Manga Halftone dots */}
                                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, black 1px, transparent 1px)', backgroundSize: '8px 8px' }}></div>
                                </div>
                                <div className="p-8">
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className={`px-4 py-2 rounded-none text-sm font-black uppercase border-l-4 ${categoryStyles[filteredArticles[0].category].bg} ${categoryStyles[filteredArticles[0].category].border} ${categoryStyles[filteredArticles[0].category].text}`}>
                                            {filteredArticles[0].category}
                                        </span>
                                        <span className="text-sm text-gray-500 font-bold">
                                            {new Date(filteredArticles[0].publishedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h2 className="text-4xl font-black text-black mb-4 leading-tight uppercase tracking-tight">
                                        {filteredArticles[0].title}
                                    </h2>
                                    <p className="text-lg text-gray-700 leading-relaxed mb-4 font-medium">
                                        {filteredArticles[0].description}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="font-black text-black uppercase text-sm">{filteredArticles[0].source}</span>
                                        <div className="flex items-center gap-2 text-orange-600">
                                            <span className="font-bold">READ MORE</span>
                                            <span className="text-2xl">→</span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        )}

                        {/* Grid of Manga Panels */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredArticles.slice(1).map((article) => (
                                <article
                                    key={article.id}
                                    onClick={() => router.push(`/article/${article.id}`)}
                                    className="border-4 border-black rounded-none p-6 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all group bg-white relative overflow-hidden"
                                >
                                    {/* Manga panel corner fold */}
                                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[30px] border-t-gray-200 border-l-[30px] border-l-transparent group-hover:border-t-orange-200 transition-colors"></div>

                                    <div className="mb-4">
                                        <span className={`inline-block px-3 py-1 rounded-none text-xs font-black uppercase border-l-4 ${categoryStyles[article.category].bg} ${categoryStyles[article.category].border} ${categoryStyles[article.category].text}`}>
                                            {article.category}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-black text-black mb-3 leading-tight uppercase group-hover:text-orange-600 transition line-clamp-3">
                                        {article.title}
                                    </h3>

                                    <p className="text-gray-700 mb-4 line-clamp-2 font-medium">
                                        {article.description}
                                    </p>

                                    <div className="flex items-center justify-between text-sm border-t-2 border-black pt-3">
                                        <span className="font-black text-black uppercase">{article.source}</span>
                                        <span className="text-gray-500 font-bold">
                                            {new Date(article.publishedAt).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {filteredArticles.length === 0 && (
                            <div className="text-center py-20">
                                <div className="text-8xl mb-4">📭</div>
                                <p className="text-gray-500 text-xl font-bold uppercase tracking-wider">No Articles Found</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
