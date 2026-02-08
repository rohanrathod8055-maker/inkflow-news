import axios from 'axios';
import * as cheerio from 'cheerio';

export async function fetchFullArticleContent(url: string): Promise<{ content: string; image?: string }> {
    try {
        // Handle Google News redirects
        let finalUrl = url;
        if (url.includes('news.google.com')) {
            console.log('🔗 Following Google News redirect...');
            try {
                const redirectResponse = await axios.get(url, {
                    maxRedirects: 5,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    },
                    timeout: 10000,
                });
                finalUrl = redirectResponse.request.res.responseUrl || url;
                console.log('✅ Redirected to:', finalUrl);
            } catch (e) {
                console.log('⚠️ Redirect failed, using original URL');
            }
        }

        const response = await axios.get(finalUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            },
            timeout: 15000,
            maxRedirects: 5,
        });

        const $ = cheerio.load(response.data);

        // Remove unwanted elements BEFORE extraction
        $('script, style, nav, header, footer, iframe, aside, .sidebar, .related-articles, .comments, .social-share, .advertisement, .ad, .promo, button, form, input, select, textarea').remove();

        // Try to find featured image
        let featuredImage = '';
        const imageSelectors = [
            'meta[property="og:image"]',
            'meta[name="twitter:image"]',
            'article img[src]',
            '.article-image img[src]',
            '.featured-image img[src]',
            '[itemprop="image"]',
        ];

        for (const selector of imageSelectors) {
            const img = $(selector).first();
            if (selector.includes('meta')) {
                featuredImage = img.attr('content') || '';
            } else {
                featuredImage = img.attr('src') || '';
            }

            // Make relative URLs absolute
            if (featuredImage && !featuredImage.startsWith('http')) {
                const urlObj = new URL(finalUrl);
                featuredImage = new URL(featuredImage, urlObj.origin).href;
            }

            if (featuredImage && featuredImage.startsWith('http') && !featuredImage.includes('data:image')) {
                break;
            }
        }

        // Try specific article content selectors
        const contentSelectors = [
            'article p',
            '.article-content p',
            '.post-content p',
            '.entry-content p',
            '[itemprop="articleBody"] p',
            '.article-body p',
            '.story-body p',
            '.post-body p',
            'main article p',
            'main p',
        ];

        let paragraphs: string[] = [];

        for (const selector of contentSelectors) {
            const elements = $(selector);
            if (elements.length > 3) { // Only use if we found multiple paragraphs
                paragraphs = elements
                    .map((_, el) => {
                        const text = $(el).text().trim();
                        // Filter out junk
                        if (text.length < 50) return null; // Too short
                        if (text.match(/^(Subscribe|Sign up|Follow|Share|Read more|Advertisement|Cookie|Privacy Policy|Terms)/i)) return null;
                        if (text.match(/©|\bCopyright\b|All rights reserved/i)) return null; // Copyright text
                        return text;
                    })
                    .get()
                    .filter(Boolean) as string[];

                if (paragraphs.length > 3) {
                    console.log(`✅ Found ${paragraphs.length} paragraphs using: ${selector}`);
                    break;
                }
            }
        }

        // Join paragraphs with double newlines for proper formatting
        const content = paragraphs.slice(0, 25).join('\n\n'); // Max 25 paragraphs

        console.log(`📝 Extracted ${content.length} characters, image: ${featuredImage ? 'Yes' : 'No'}`);

        return {
            content: content.substring(0, 10000), // Limit to 10k chars
            image: featuredImage || undefined,
        };
    } catch (error) {
        console.error('❌ Error fetching article content:', error instanceof Error ? error.message : error);
        return { content: '' };
    }
}
