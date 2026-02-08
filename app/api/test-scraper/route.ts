import { scrapeAllSources } from '@/lib/scrapers/big_media';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        console.log('📡 TEST: Calling scrapeAllSources()...');
        const articles = await scrapeAllSources();
        console.log(`📊 TEST: Got ${articles.length} articles`);

        return NextResponse.json({
            success: true,
            count: articles.length,
            sample: articles.slice(0, 3).map(a => ({ title: a.title, source: a.source })),
        });
    } catch (error) {
        console.error('❌ TEST ERROR:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
