import axios from 'axios';

export interface RewrittenContent {
    new_title: string;
    new_body: string;
}

export async function rewriteNews(originalTitle: string, rawContent: string): Promise<RewrittenContent | null> {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            console.error('OPENROUTER_API_KEY not found in environment');
            return null;
        }

        const prompt = `You are a senior tech editor. I will give you a raw news article. Your job is to:

1. Rewrite the title to be punchier and click-worthy (but not clickbait)
2. Write a 3-paragraph summary in a professional, sleek tone
3. Explain why this news matters

Original Title: ${originalTitle}

Article Content:
${rawContent.substring(0, 3000)} 

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{"new_title": "your rewritten title here", "new_body": "your 3-paragraph summary here"}`;

        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'google/gemini-3-flash-preview',
                messages: [
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:3000',
                    'X-Title': 'NewsFlow AI Rewriter',
                },
                timeout: 30000,
            }
        );

        const text = response.data.choices[0]?.message?.content?.trim();

        if (!text) {
            console.error('No content in OpenRouter response');
            return null;
        }

        // Clean up the response - remove markdown code blocks if present
        let cleanText = text;
        if (cleanText.startsWith('```json')) {
            cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (cleanText.startsWith('```')) {
            cleanText = cleanText.replace(/```\n?/g, '');
        }

        const parsed = JSON.parse(cleanText);

        if (!parsed.new_title || !parsed.new_body) {
            console.error('Invalid response format from OpenRouter');
            return null;
        }

        return {
            new_title: parsed.new_title,
            new_body: parsed.new_body,
        };
    } catch (error) {
        console.error('Error rewriting news with OpenRouter:', error);
        return null;
    }
}
