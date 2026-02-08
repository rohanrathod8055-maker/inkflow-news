import { runBigMediaPipeline } from '@/lib/scrapers/ai_pipeline';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        console.log('🚀 Starting Big Media AI Pipeline...');
        const inserted = await runBigMediaPipeline();

        return NextResponse.json({
            success: true,
            inserted,
            message: `Successfully scraped, rewrote, and stored ${inserted} articles`,
        });
    } catch (error) {
        console.error('Scraping failed:', error);
        return NextResponse.json(
            { success: false, error: 'Scraping failed' },
            { status: 500 }
        );
    }
}
