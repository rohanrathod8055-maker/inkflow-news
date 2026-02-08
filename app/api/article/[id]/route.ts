import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { fetchFullArticleContent } from '@/lib/scrapers/full_article';

export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('id', params.id)
            .single();

        if (error || !data) {
            console.error('Article not found:', params.id, error);
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        // Increment view count
        await supabase
            .from('articles')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', params.id);

        // Fetch full content if we only have a short summary
        let fullContent = data.raw_content || data.summary_content || '';
        let imageUrl = data.image_url || '';

        if (fullContent.length < 500 && data.original_url) {
            console.log('🔍 Fetching full article content for:', data.original_url);
            const scraped = await fetchFullArticleContent(data.original_url);
            if (scraped.content.length > fullContent.length) {
                fullContent = scraped.content;
                imageUrl = scraped.image || imageUrl;

                // Save the full content and image to database for next time
                await supabase
                    .from('articles')
                    .update({
                        raw_content: scraped.content,
                        image_url: scraped.image
                    })
                    .eq('id', params.id);

                console.log('✅ Saved full content + image to DB');
            }
        }

        const article = {
            id: data.id,
            title: data.rewritten_title || data.original_title,
            description: data.summary_content || '',
            content: fullContent,
            imageUrl: imageUrl,
            url: data.original_url,
            source: data.source_domain,
            category: data.category || 'Tech',
            publishedAt: data.published_at,
        };

        return NextResponse.json(article);
    } catch (error) {
        console.error('Error fetching article:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
