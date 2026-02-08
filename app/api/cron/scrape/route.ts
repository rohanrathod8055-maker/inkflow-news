import { runBigMediaPipeline } from '@/lib/scrapers/ai_pipeline';
import { NextResponse } from 'next/server';

// This endpoint runs every 5 minutes to scrape new articles
export const runtime = 'edge';
export const maxDuration = 300; // 5 minutes

export async function GET(request: Request) {
    try {
        // Verify cron secret (optional security)
        const authHeader = request.headers.get('authorization');
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log('🔄 Auto-refresh scraper started...');
        const inserted = await runBigMediaPipeline();

        return NextResponse.json({
            success: true,
            inserted,
            timestamp: new Date().toISOString(),
            message: `Auto-refresh complete: ${inserted} new articles`,
        });
    } catch (error) {
        console.error('❌ Auto-refresh failed:', error);
        return NextResponse.json(
            { success: false, error: 'Auto-refresh failed' },
            { status: 500 }
        );
    }
}
