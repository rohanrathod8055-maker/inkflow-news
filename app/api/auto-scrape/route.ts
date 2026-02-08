import { NextResponse } from 'next/server';

// This endpoint runs automatically via Vercel Cron or can be triggered manually
export async function GET() {
    try {
        console.log('⏰ Auto-scrape triggered at:', new Date().toISOString());

        // Trigger the scrape endpoint
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/scrape`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        console.log('✅ Auto-scrape completed:', data);

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            ...data
        });
    } catch (error) {
        console.error('❌ Auto-scrape failed:', error);
        return NextResponse.json(
            { success: false, error: 'Auto-scrape failed' },
            { status: 500 }
        );
    }
}

// Allow manual POST trigger
export async function POST() {
    return GET();
}
