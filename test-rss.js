// Test script to verify RSS feeds work
import Parser from 'rss-parser';

const parser = new Parser();

async function testRSS() {
    try {
        console.log('Testing Gadgets 360 (NDTV Tech) RSS feed...');
        const ndtvFeed = await parser.parseURL('https://gadgets360.com/rss/feeds');
        console.log(`✅ Gadgets 360: Found ${ndtvFeed.items.length} items`);
        console.log('First item:', ndtvFeed.items[0]?.title);

        console.log('\nTesting Indian Express RSS feed...');
        const indianExpressFeed = await parser.parseURL('https://indianexpress.com/section/technology/feed/');
        console.log(`✅ Indian Express: Found ${indianExpressFeed.items.length} items`);
        console.log('First item:', indianExpressFeed.items[0]?.title);

        console.log('\nTesting Google News RSS...');
        const googleFeed = await parser.parseURL('https://news.google.com/rss/search?q=Technology+India&hl=en-IN&gl=IN&ceid=IN:en');
        console.log(`✅ Google News: Found ${googleFeed.items.length} items`);
        console.log('First item:', googleFeed.items[0]?.title);

        console.log('\nTesting The Verge RSS...');
        const vergeFeed = await parser.parseURL('https://www.theverge.com/rss/index.xml');
        console.log(`✅ The Verge: Found ${vergeFeed.items.length} items`);
        console.log('First item:', vergeFeed.items[0]?.title);

    } catch (error) {
        console.error('Error:', error);
    }
}

testRSS();
