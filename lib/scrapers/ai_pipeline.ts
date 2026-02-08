import { supabase, ArticleInsert } from '../supabase';
import { scrapeAllSources } from './big_media';

export async function runBigMediaPipeline(): Promise<number> {
    console.log('🚀 Starting Big Media Pipeline (NO AI REWRITING)...');

    try {
        // Step 1: Scrape from all RSS sources
        const scrapedArticles = await scrapeAllSources();
        console.log(`📰 RSS Scraping complete: ${scrapedArticles.length} articles found`);

        if (scrapedArticles.length === 0) {
            console.warn('⚠️ No articles scraped from RSS feeds!');
            return 0;
        }

        let inserted = 0;
        let duplicates = 0;

        for (const article of scrapedArticles) {
            try {
                const { error } = await supabase.from('articles').insert({
                    original_title: article.title,
                    rewritten_title: article.title,
                    original_url: article.url,
                    source_domain: article.source,
                    raw_content: article.content,
                    summary_content: article.content.substring(0, 500),
                    image_url: article.imageUrl,
                    published_at: article.publishedAt.toISOString(),
                    category: article.category, // NEW: Save category
                });

                if (error) {
                    if (error.code === '23505') duplicates++;
                    else console.error(`Insert error:`, error.message);
                } else {
                    inserted++;
                }
            } catch (error) {
                console.error(`Failed:`, error);
            }
        }

        console.log(`✅ Complete! Inserted: ${inserted}, Duplicates: ${duplicates}`);
        return inserted;
    } catch (error) {
        console.error('❌ Pipeline failed:', error);
        return 0;
    }
}
