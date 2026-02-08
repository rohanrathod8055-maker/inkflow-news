import { NextRequest, NextResponse } from "next/server";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const url = searchParams.get("url");

        if (!url) {
            return NextResponse.json(
                { error: "URL parameter is required" },
                { status: 400 }
            );
        }

        // Fetch the page
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
            signal: AbortSignal.timeout(15000), // 15 second timeout
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: `Failed to fetch: ${response.statusText}` },
                { status: response.status }
            );
        }

        const html = await response.text();

        // Parse with JSDOM
        const dom = new JSDOM(html, { url });
        const document = dom.window.document;

        // Extract clean content with Readability
        const reader = new Readability(document);
        const article = reader.parse();

        if (!article) {
            return NextResponse.json(
                { error: "Could not parse article content" },
                { status: 422 }
            );
        }

        return NextResponse.json({
            success: true,
            title: article.title,
            content: article.content,
            textContent: article.textContent,
            excerpt: article.excerpt,
            byline: article.byline,
            siteName: article.siteName,
            publishedTime: article.publishedTime,
        });
    } catch (error: any) {
        console.error("Reader API error:", error);
        return NextResponse.json(
            {
                error: "Failed to process article",
                details: error.message
            },
            { status: 500 }
        );
    }
}
