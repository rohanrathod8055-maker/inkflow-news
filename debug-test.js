// Minimal test to check each step
import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';

const parser = new Parser({
    timeout: 15000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
    },
});

async function testEverything() {
    console.log('=== STEP 1: Testing RSS Feeds ===\n');

    try {
        const googleFeed = await parser.parseURL('https://news.google.com/rss/search?q=Technology+India&hl=en-IN&gl=IN&ceid=IN:en');
        console.log(`✅ Google News: ${googleFeed.items.length} items`);
        console.log(`   First: ${googleFeed.items[0]?.title}`);
        console.log(`   URL: ${googleFeed.items[0]?.link}\n`);
    } catch (e) {
        console.error('❌ Google News failed:', e.message);
    }

    try {
        const tcFeed = await parser.parseURL('https://techcrunch.com/feed/');
        console.log(`✅ TechCrunch: ${tcFeed.items.length} items`);
        console.log(`   First: ${tcFeed.items[0]?.title}\n`);
    } catch (e) {
        console.error('❌ TechCrunch failed:', e.message);
    }

    console.log('\n=== STEP 2: Testing Supabase ===\n');

    const supabaseUrl = 'https://yorhucegufbeootmcupn.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvcmh1Y2VndWZiZW9vdG1jdXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MzAxMTAsImV4cCI6MjA4NjEwNjExMH0.AGZfQP592Kmlq4jqBnVHP_ZKTAc3ClmnjZ7mJmdubgQ';

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test insert
    const testArticle = {
        original_title: 'Test Article ' + Date.now(),
        rewritten_title: 'Rewritten Test Article',
        original_url: 'https://test.com/' + Date.now(),
        source_domain: 'test.com',
        raw_content: 'This is test content',
        summary_content: 'This is a summary',
        published_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('articles').insert(testArticle).select();

    if (error) {
        console.error('❌ Supabase insert failed:', error);
    } else {
        console.log('✅ Supabase insert successful!');
        console.log('   Inserted ID:', data[0]?.id);
    }

    console.log('\n=== STEP 3: Testing OpenRouter ===\n');

    // Test OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer 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',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'google/gemini-3-flash-preview',
            messages: [{
                role: 'user',
                content: 'Say "Hello from OpenRouter!" and nothing else.',
            }],
        }),
    });

    if (response.ok) {
        const result = await response.json();
        console.log('✅ OpenRouter works!');
        console.log('   Response:', result.choices[0]?.message?.content);
    } else {
        console.error('❌ OpenRouter failed:', response.status, await response.text());
    }
}

testEverything().catch(console.error);
