import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .order('view_count', { ascending: false })
            .order('published_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error('Error fetching popular articles:', error);
            return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
        }

        const articles = data.map(article => ({
            id: article.id,
            title: article.rewritten_title || article.original_title,
            description: article.summary_content || '',
            url: article.original_url,
            source: article.source_domain,
            category: article.category || 'Tech',
            thumbnail: article.image_url,
            publishedAt: article.published_at,
            viewCount: article.view_count || 0,
        }));

        return NextResponse.json({ articles, total: articles.length });
    } catch (error) {
        console.error('Error in /api/news/popular:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
