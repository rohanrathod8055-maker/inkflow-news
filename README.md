# InkFlow - Manga-Inspired News Aggregator

![InkFlow Logo](https://img.shields.io/badge/InkFlow-News%20Feed-orange?style=for-the-badge)

A premium news aggregator with manga-inspired design, featuring automatic article scraping from 7 major tech news sources, full-content extraction, and auto-categorization.

## ✨ Features

- 🎨 **Manga-Inspired Design** - Bold black borders, halftone patterns, speed lines
- 📰 **7 News Sources** - Google News, TechCrunch, The Verge, Ars Technica, BBC, Wired, Engadget
- 🤖 **Auto-Categorization** - AI, Space, Gaming, Cybersecurity, Innovation, Crypto, Tech
- 🔍 **Full Article Scraping** - Extracts complete article content with images
- 🔄 **Auto-Refresh** - Client-side updates every 5 minutes
- 📊 **Popular Tracking** - View count based trending
- 🎯 **Smart Redirect Handling** - Follows Google News redirects automatically

## 🚀 Live Demo

[View Live Site]() (Add your Vercel URL here after deployment)

## 📸 Screenshots

Featured manga-style article cards with bold typography and category badges.

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Scraping**: RSS Parser, Cheerio, Axios
- **UI Components**: Framer Motion, Lucide Icons
- **Effects**: @paper-design/shaders-react (Liquid Metal)

## 📦 Installation

### Prerequisites
- Node.js 18+
- Supabase account
- npm or yarn

### Local Setup

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/inkflow-news.git
cd inkflow-news
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_url
```

4. **Set up Supabase database**
Run the migrations in `/supabase/migrations/`:
- `001_articles_table.sql`
- `002_add_categories.sql`
- `003_add_image_url.sql`

5. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000`

## 🌐 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/inkflow-news)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit - InkFlow News"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/inkflow-news.git
git push -u origin main
```

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables (same as `.env.local`)
- Deploy!

3. **Enable Cron (Auto-scraping)**
Vercel will automatically use the `vercel.json` cron configuration:
- Scrapes every 6 hours
- Endpoint: `/api/auto-scrape`

### Manual Scraping

Trigger manual scrape:
```bash
curl -X POST https://your-domain.vercel.app/api/scrape
```

## 📊 Database Schema

**Articles Table:**
- `id` - UUID primary key
- `original_title` - Article title
- `rewritten_title` - Same as original
- `original_url` - Source URL (unique)
- `source_domain` - Source website
- `raw_content` - Full article text
- `summary_content` - Preview text
- `image_url` - Featured image
- `category` - Auto-detected category
- `view_count` - Popularity metric
- `published_at` - Publication date
- `created_at` - Scrape timestamp

## 🎯 RSS Sources

| Source | Articles | Categories |
|--------|----------|------------|
| Google News | 20 | All |
| TechCrunch | 15 | Startups, AI |
| The Verge | 15 | Tech, Gaming |
| Ars Technica | 15 | Science, Space |
| BBC Technology | 15 | Global Tech |
| Wired | 15 | Innovation |
| Engadget | 15 | Gadgets |

## 🔧 Configuration

### Add More RSS Sources

Edit `lib/scrapers/big_media.ts`:
```typescript
export async function scrapeYourSource(limit: number = 15): Promise<ScrapedArticle[]> {
    const feed = await parser.parseURL('your-rss-feed-url');
    // ... implementation
}

// Add to scrapeAllSources()
const sources = [
    // ... existing sources
    scrapeYourSource(15),
];
```

### Customize Categories

Edit category detection in `lib/scrapers/big_media.ts`:
```typescript
function detectCategory(title: string, content: string): string {
    const text = `${title} ${content}`.toLowerCase();
    if (text.match(/your-pattern/i)) return 'YourCategory';
    return 'Tech';
}
```

## 📝 API Endpoints

- `GET /api/news` - Fetch latest articles
- `GET /api/news/popular` - Fetch trending articles
- `GET /api/article/[id]` - Get article with full content
- `POST /api/scrape` - Manual scrape trigger
- `GET /api/auto-scrape` - Cron endpoint (automated)

## 🎨 Design System

### Colors
- **Primary**: Black (#000000)
- **Accent**: Orange (#ff6b35)
- **Highlight**: Gold (#ffd700)

### Typography
- **Headings**: Font-black, uppercase, tracking-tight
- **Body**: Font-medium, text-justify

### Components
- Manga panel cards with 4px borders
- Halftone dot backgrounds
- Speed line effects
- Glass dock navigation
- Liquid metal buttons

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - Feel free to use for personal or commercial projects

## 🙏 Credits

- Design inspired by Japanese manga aesthetics
- RSS feeds from major tech publications
- Built with Next.js and Supabase

## 📧 Contact

- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- Email: your.email@example.com

---

**Made with ❤️ and 🖋️ by [Your Name]**
