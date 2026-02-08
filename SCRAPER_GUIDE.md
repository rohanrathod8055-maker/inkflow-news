# InkFlow News Aggregator - Scraper Guide

## 🔄 How Background Scraping Works

### Client-Side Auto-Refresh (Active Now)
Your browser automatically checks for new articles every 5 minutes:
- ✅ **Runs**: Every 5 minutes while page is open
- ✅ **Method**: Client-side interval in React
- ✅ **Triggered**: Automatically

### Manual Scraping
You can trigger a scrape anytime:

**PowerShell:**
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/scrape" -Method POST
```

**Or click the "Refresh" button** on the website!

### Production Auto-Scraping (When Deployed)
When you deploy to Vercel, it will auto-scrape every 6 hours:
- ✅ **Schedule**: Every 6 hours (0 */6 * * *)
- ✅ **Endpoint**: `/api/auto-scrape`
- ✅ **Config**: `vercel.json`

## 📊 Check Scraper Status

**See total articles:**
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/news?limit=1" | ConvertFrom-Json | Select-Object total
```

**See latest scrape time:**
```powershell
(Invoke-WebRequest -Uri "http://localhost:3000/api/news?limit=1" | ConvertFrom-Json).articles[0].scrapedAt
```

**Trigger manual scrape:**
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/scrape" -Method POST
```

## 🎯 Full Article Content

Articles now automatically fetch full content from source URLs:
1. ✅ User clicks article
2. ✅ If content is short (< 500 chars), fetch from source
3. ✅ Save full content to database
4. ✅ Next time = instant load!

## 🚀 Current Setup

**RSS Sources (4):**
- Google News (Tech - India)
- TechCrunch
- The Verge
- Ars Technica

**Categories (7):**
- AI, Space, Gaming, Cybersecurity, Innovation, Crypto, Tech

**Update Frequency:**
- Client: Every 5 mins
- Production: Every 6 hours (auto)
- Manual: Anytime via button/API

## 📈 Monitoring

Your scraper is working if:
1. Article count increases over time
2. `scrapedAt` timestamp is recent
3. Categories are diverse (not all "Tech")

**Fun fact**: The scraper runs automatically in the background. You don't need to do anything! 🎉
