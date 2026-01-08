# Deployment Guide for Netlify

## Important: Database Setup Required

OpenDotDB requires a PostgreSQL database to function. **Netlify hosts only the frontend**, so you need to set up a database separately.

## Option 1: Use Vercel Instead (Recommended)

Vercel is better suited for Next.js applications with API routes and database connections.

### Deploy to Vercel:

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables:
   ```
   DATABASE_URL=your_postgresql_connection_string
   ```
4. Deploy!

## Option 2: Netlify with External Database

### Step 1: Set Up Database

Use one of these database providers:

- **Supabase** (Free tier): [supabase.com](https://supabase.com)
- **Neon** (Free tier): [neon.tech](https://neon.tech)
- **Railway** (Free tier): [railway.app](https://railway.app)
- **Heroku Postgres**: [heroku.com](https://heroku.com)

### Step 2: Configure Netlify

1. Go to your Netlify dashboard
2. Site settings → Environment variables
3. Add:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   NEXT_PUBLIC_API_URL=https://your-site.netlify.app
   ```

### Step 3: Build Settings

In Netlify dashboard:
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Functions directory**: `.netlify/functions`

### Step 4: Install Netlify Plugin

The `netlify.toml` file includes the Next.js plugin. Netlify will automatically install it.

### Step 5: Initialize Database

After deployment, you need to run migrations:

```bash
# Clone your repo locally
git clone your-repo-url
cd opendotdb

# Set DATABASE_URL
export DATABASE_URL="your_production_database_url"

# Run migrations
npm run db:push
npm run db:generate

# Optional: Add sample data
npm run db:seed
```

## Current Limitations on Netlify

⚠️ **Important**: Netlify is designed for static sites. For OpenDotDB to work fully, you need:

1. **External Database**: Must be accessible via DATABASE_URL
2. **API Routes**: Work via Netlify Functions (slower than Vercel)
3. **Cold Starts**: Functions may have delays on first request

## Recommended Architecture

For production use:

```
┌─────────────────┐
│   Netlify       │  ← Frontend (Next.js pages)
│   (Static)      │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Vercel        │  ← API Routes (better for serverless)
│   (Serverless)  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Supabase/     │  ← Database (PostgreSQL)
│   Neon/Railway  │
└─────────────────┘
```

## Quick Fix: Switch to Vercel

If you're having issues with Netlify:

1. Delete the Netlify site
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import from GitHub
5. Add DATABASE_URL in environment variables
6. Deploy (takes 2 minutes)

Vercel is built specifically for Next.js and handles everything automatically!

## Need Help?

See the main DEPLOYMENT.md for detailed instructions on various hosting options.
