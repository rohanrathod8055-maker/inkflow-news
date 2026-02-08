import { scrapeAllSources } from '@/lib/scrapers/big_media';
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        console.log('🚀 Direct scraper (no pipeline)...');

        // Step 1: Scrape
        const articles = await scrapeAllSources();
        console.log(`✅ Scraped: ${articles.length} articles`);

        if (articles.length === 0) {
            return NextResponse.json({ success: false, message: 'No articles scraped' });
        }

        // Step 2: Insert directly
        let inserted = 0;
        for (const article of articles) {
            const { error } = await supabase.from('articles').insert({
                original_title: article.title,
                rewritten_title: article.title,
                original_url: article.url,
                source_domain: article.source,
                raw_content: article.content,
                summary_content: article.content.substring(0, 500),
                image_url: article.imageUrl,
                published_at: article.publishedAt.toISOString(),
            });

            if (!error) inserted++;
            else if (error.code !== '23505') console.error('Insert error:', error.message);
        }

        console.log(`✅ Inserted: ${inserted} articles`);

        return NextResponse.json({
            success: true,
            scraped: articles.length,
            inserted,
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
