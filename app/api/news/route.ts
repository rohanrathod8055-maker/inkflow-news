import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const source = searchParams.get('source');

        let query = supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (source && source !== 'all') {
            query = query.eq('source_domain', source);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching articles from Supabase:', error);
            return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
        }

        // Transform to match frontend expectations
        const articles = data.map(article => ({
            id: article.id,
            title: article.rewritten_title || article.original_title,
            description: article.summary_content || '',
            url: article.original_url,
            source: article.source_domain,
            category: article.category || 'Tech', // Read from database
            thumbnail: article.image_url,
            publishedAt: article.published_at,
            scrapedAt: article.created_at,
        }));

        return NextResponse.json({
            articles,
            total: articles.length,
        });
    } catch (error) {
        console.error('Error in /api/news:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
