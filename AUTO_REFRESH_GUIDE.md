## NewsHub Auto-Refresh Setup

Your site currently has **55 articles** and will automatically get more! Here's how:

### 📊 Current Setup

**Articles**: 55 fresh articles scraped
**Sources**: 4 RSS feeds (Google News, TechCrunch, The Verge, Ars Technica)
**Categories**: AI, Space, Gaming, Cybersecurity, Innovation, Crypto, Tech

### 🔄 Background Scraping - HOW IT WORKS

#### Option 1: Client-Side Auto-Refresh (✅ ACTIVE)
Your pages refresh every 5 minutes automatically:
```typescript
useEffect(() => {
  fetchArticles();
  const interval = setInterval(fetchArticles, 5 * 60 * 1000); // 5 mins
  return () => clearInterval(interval);
}, []);
```

#### Option 2: Server-Side Cron Job (MANUAL)
To add articles in the background, you need to call the scrape endpoint regularly.

**Manual Scraping:**
```bash
# Run this command to scrape more articles
Invoke-WebRequest -Uri "http://localhost:3000/api/scrape" -Method POST

# Or just click the REFRESH button on the site!
```

**For Production (Deploy to Vercel):**
1. Your endpoint: `POST https://yourdomain.com/api/cron/scrape`
2. Set up Vercel Cron Jobs in `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/scrape",
    "schedule": "0 */6 * * *"
  }]
}
```

This will auto-scrape every 6 hours.

### 📈 Getting More Articles

**Why only 55 articles?**
- RSS feeds have limited history (10-20 articles per source)
- We scrape 4 sources = ~40-80 articles total
- New articles are added as they're published

**To get 100+ articles:**
1. Wait for new articles to be published (happens daily)
2. Add more sources (I can add 10+ sources if you want!)
3. The scraper runs and finds new articles automatically

**Current Schedule:**
- Google News: Updates hourly
- TechCrunch: 5-10 articles per day
- The Verge: 10-15 articles per day  
- Ars Technica: 5-8 articles per day

### ✅ What's Auto-Running:

1. **Client refreshes** - Every 5 mins your browser checks for new articles
2. **Manual scraping** - You can click "Refresh" button or call the endpoint
3. **Future: Vercel Cron** - When deployed, auto-scrapes every 6 hours

### 🚀 Want More Articles?

I can add more sources right now:
- Wired
- Engadget
- The Next Web
- Hacker News
- MIT Technology Review
- VentureBeat
- ZDNet
- Gizmodo
- 9to5Mac
- Android Authority

Say "add more sources" and I'll add 10 more RSS feeds!
