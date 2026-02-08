# Turso Database Setup Guide

This guide will help you set up Turso (LibSQL) for your NewsFlow application.

## What is Turso?

Turso is a cloud-hosted SQLite database built on libSQL. It's perfect for Next.js/Vercel deployments because:
- ✅ SQLite-compatible (same queries work)
- ✅ Cloud-hosted (data persists across deployments)
- ✅ Fast edge replication
- ✅ Free tier available
- ✅ No cold starts

## Setup Steps

### 1. Install Turso CLI

**macOS/Linux:**
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

**Windows (PowerShell):**
```powershell
iwr -useb https://get.tur.so/install.ps1 | iex
```

### 2. Sign Up and Login

```bash
turso auth signup
turso auth login
```

### 3. Create a Database

```bash
turso db create newsflow
```

This creates a new database called `newsflow`.

### 4. Get Connection Details

```bash
# Get database URL
turso db show newsflow --url

# Create auth token
turso db tokens create newsflow
```

### 5. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
TURSO_DATABASE_URL=libsql://newsflow-[your-username].turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```

Replace the values with your actual database URL and token from step 4.

### 6. Test Locally

```bash
npm run dev
```

The database will automatically initialize with the schema on first run.

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Add Turso database integration"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your repository
3. Add environment variables:
   - `TURSO_DATABASE_URL` = your database URL
   - `TURSO_AUTH_TOKEN` = your auth token

### 3. Deploy

Click "Deploy" and Vercel will build and deploy your app!

## Local Development

For local development, you can:

**Option 1: Use Turso Cloud (Recommended)**
- Same database as production
- No setup needed
- Just use the env variables

**Option 2: Use Local File Database**
- Remove or don't set the env variables
- The app will automatically use `file:local.db`
- Good for offline development

## Troubleshooting

### "Database not found"
Make sure your `TURSO_DATABASE_URL` is correct. Check with:
```bash
turso db show newsflow
```

### "Authentication failed"
Your token might have expired. Generate a new one:
```bash
turso db tokens create newsflow
```

### "Table already exists"
This is normal on redeploys. The code handles this gracefully.

## Managing Your Database

### View data
```bash
turso db shell newsflow
```

Then run SQL queries:
```sql
SELECT COUNT(*) FROM news_articles;
SELECT * FROM news_articles ORDER BY published_at DESC LIMIT 10;
```

### Delete all data
```sql
DELETE FROM news_articles;
```

### Drop and recreate
```bash
turso db destroy newsflow
turso db create newsflow
```

## Free Tier Limits

Turso's free tier includes:
- 9 GB total storage
- 500 databases
- 1 billion row reads/month
- 25 million row writes/month

This is more than enough for NewsFlow!

## Additional Resources

- [Turso Documentation](https://docs.turso.tech/)
- [Turso Dashboard](https://turso.tech/app)
- [libSQL GitHub](https://github.com/tursodatabase/libsql)
