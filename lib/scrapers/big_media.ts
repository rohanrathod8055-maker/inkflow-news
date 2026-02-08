import Parser from 'rss-parser';

interface ScrapedArticle {
    title: string;
    url: string;
    content: string;
    imageUrl?: string;
    publishedAt: Date;
    source: string;
    category: string;
}

const parser = new Parser({
    timeout: 15000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
    },
    customFields: {
        item: ['media:content', 'media:thumbnail', 'enclosure', 'category'],
    },
});

// Detect category from title/content
function detectCategory(title: string, content: string, feedCategory?: string): string {
    const text = `${title} ${content} ${feedCategory || ''}`.toLowerCase();

    if (text.match(/\b(ai|artificial intelligence|machine learning|gpt|llm|neural|chatbot)\b/i)) return 'AI';
    if (text.match(/\b(space|nasa|rocket|satellite|mars|moon|astronomy|spacex)\b/i)) return 'Space';
    if (text.match(/\b(gaming|game|ps5|xbox|nintendo|esports|gamer)\b/i)) return 'Gaming';
    if (text.match(/\b(cyber|security|hack|breach|malware|encryption|privacy)\b/i)) return 'Cybersecurity';
    if (text.match(/\b(startup|innovation|venture|funding|founder)\b/i)) return 'Innovation';
    if (text.match(/\b(crypto|bitcoin|blockchain|ethereum|web3|nft)\b/i)) return 'Crypto';

    return 'Tech'; // Default
}

// Google News Tech (India)
export async function scrapeGoogleNewsTech(limit: number = 20): Promise<ScrapedArticle[]> {
    try {
        console.log('🔍 Starting Google News Tech (RSS) scraping...');
        const articles: ScrapedArticle[] = [];
        const feed = await parser.parseURL('https://news.google.com/rss/search?q=Technology+India&hl=en-IN&gl=IN&ceid=IN:en');

        for (const item of feed.items.slice(0, limit)) {
            if (!item.title || !item.link) continue;

            articles.push({
                title: item.title,
                url: item.link,
                content: item.contentSnippet || item.content || '',
                publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
                source: 'googlenews',
                category: detectCategory(item.title, item.contentSnippet || '', item.categories?.[0]),
            });
        }

        console.log(`✅ Google News Tech: ${articles.length} articles`);
        return articles;
    } catch (error) {
        console.error('❌ Google News Tech scraping failed:', error);
        return [];
    }
}

// TechCrunch
export async function scrapeTechCrunch(limit: number = 20): Promise<ScrapedArticle[]> {
    try {
        console.log('🔍 Starting TechCrunch scraping...');
        const articles: ScrapedArticle[] = [];
        const feed = await parser.parseURL('https://techcrunch.com/feed/');

        for (const item of feed.items.slice(0, limit)) {
            if (!item.title || !item.link) continue;

            articles.push({
                title: item.title,
                url: item.link,
                content: item.contentSnippet || item.content || '',
                publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
                source: 'techcrunch.com',
                category: detectCategory(item.title, item.contentSnippet || '', item.categories?.[0]),
            });
        }

        console.log(`✅ TechCrunch: ${articles.length} articles`);
        return articles;
    } catch (error) {
        console.error('❌ TechCrunch scraping failed:', error);
        return [];
    }
}

// The Verge
export async function scrapeTheVerge(limit: number = 20): Promise<ScrapedArticle[]> {
    try {
        console.log('🔍 Starting The Verge scraping...');
        const articles: ScrapedArticle[] = [];
        const feed = await parser.parseURL('https://www.theverge.com/rss/index.xml');

        for (const item of feed.items.slice(0, limit)) {
            if (!item.title || !item.link) continue;

            articles.push({
                title: item.title,
                url: item.link,
                content: item.contentSnippet || item.content || '',
                publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
                source: 'theverge.com',
                category: detectCategory(item.title, item.contentSnippet || '', item.categories?.[0]),
            });
        }

        console.log(`✅ The Verge: ${articles.length} articles`);
        return articles;
    } catch (error) {
        console.error('❌ The Verge scraping failed:', error);
        return [];
    }
}

// Ars Technica
export async function scrapeArsTechnica(limit: number = 20): Promise<ScrapedArticle[]> {
    try {
        console.log('🔍 Starting Ars Technica scraping...');
        const articles: ScrapedArticle[] = [];
        const feed = await parser.parseURL('http://feeds.arstechnica.com/arstechnica/index');

        for (const item of feed.items.slice(0, limit)) {
            if (!item.title || !item.link) continue;

            articles.push({
                title: item.title,
                url: item.link,
                content: item.contentSnippet || item.content || '',
                publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
                source: 'arstechnica.com',
                category: detectCategory(item.title, item.contentSnippet || '', item.categories?.[0]),
            });
        }

        console.log(`✅ Ars Technica: ${articles.length} articles`);
        return articles;
    } catch (error) {
        console.error('❌ Ars Technica scraping failed:', error);
        return [];
    }
}

// BBC Technology
export async function scrapeBBCTech(limit: number = 15): Promise<ScrapedArticle[]> {
    try {
        console.log('🔍 Starting BBC Technology scraping...');
        const articles: ScrapedArticle[] = [];
        const feed = await parser.parseURL('http://feeds.bbci.co.uk/news/technology/rss.xml');

        for (const item of feed.items.slice(0, limit)) {
            if (!item.title || !item.link) continue;

            articles.push({
                title: item.title,
                url: item.link,
                content: item.contentSnippet || item.content || '',
                publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
                source: 'bbc.co.uk',
                category: detectCategory(item.title, item.contentSnippet || '', item.categories?.[0]),
            });
        }

        console.log(`✅ BBC Technology: ${articles.length} articles`);
        return articles;
    } catch (error) {
        console.error('❌ BBC Technology scraping failed:', error);
        return [];
    }
}

// Wired
export async function scrapeWired(limit: number = 15): Promise<ScrapedArticle[]> {
    try {
        console.log('🔍 Starting Wired scraping...');
        const articles: ScrapedArticle[] = [];
        const feed = await parser.parseURL('https://www.wired.com/feed/rss');

        for (const item of feed.items.slice(0, limit)) {
            if (!item.title || !item.link) continue;

            articles.push({
                title: item.title,
                url: item.link,
                content: item.contentSnippet || item.content || '',
                publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
                source: 'wired.com',
                category: detectCategory(item.title, item.contentSnippet || '', item.categories?.[0]),
            });
        }

        console.log(`✅ Wired: ${articles.length} articles`);
        return articles;
    } catch (error) {
        console.error('❌ Wired scraping failed:', error);
        return [];
    }
}

// Engadget
export async function scrapeEngadget(limit: number = 15): Promise<ScrapedArticle[]> {
    try {
        console.log('🔍 Starting Engadget scraping...');
        const articles: ScrapedArticle[] = [];
        const feed = await parser.parseURL('https://www.engadget.com/rss.xml');

        for (const item of feed.items.slice(0, limit)) {
            if (!item.title || !item.link) continue;

            articles.push({
                title: item.title,
                url: item.link,
                content: item.contentSnippet || item.content || '',
                publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
                source: 'engadget.com',
                category: detectCategory(item.title, item.contentSnippet || '', item.categories?.[0]),
            });
        }

        console.log(`✅ Engadget: ${articles.length} articles`);
        return articles;
    } catch (error) {
        console.error('❌ Engadget scraping failed:', error);
        return [];
    }
}

export async function scrapeAllSources(): Promise<ScrapedArticle[]> {
    console.log('🚀 Starting scrape from ALL sources...');

    const sources = [
        scrapeGoogleNewsTech(20),
        scrapeTechCrunch(15),
        scrapeTheVerge(15),
        scrapeArsTechnica(15),
        scrapeBBCTech(15),
        scrapeWired(15),
        scrapeEngadget(15),
    ];

    const results = await Promise.allSettled(sources);
    const allArticles = results
        .filter((result) => result.status === 'fulfilled')
        .flatMap((result) => (result as PromiseFulfilledResult<ScrapedArticle[]>).value);

    console.log(`✅ Total scraped: ${allArticles.length} articles from ${sources.length} sources`);
    return allArticles;
}
