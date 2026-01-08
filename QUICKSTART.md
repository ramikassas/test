# OpenDotDB - Quick Start Guide

Get OpenDotDB up and running in 5 minutes!

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/opendotdb.git
cd opendotdb
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, React, Prisma, and more.

### 3. Setup Database

Create a PostgreSQL database:

```bash
# Using psql
createdb opendotdb

# Or using SQL
psql -U postgres
CREATE DATABASE opendotdb;
\q
```

### 4. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/opendotdb"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 5. Initialize Database

Run Prisma migrations:

```bash
npm run db:push
npm run db:generate
```

### 6. Seed Sample Data (Optional)

Add sample domains and keywords:

```bash
npm run db:seed
```

This adds 15 sample domains with keywords and trends.

### 7. Start Development Server

```bash
npm run dev
```

### 8. Open Your Browser

Visit: **http://localhost:3000**

You should see the OpenDotDB homepage!

## What's Next?

### Try These Features:

1. **Search Domains**
   - Go to Search page
   - Enter keywords like "tech" or "cloud"
   - Filter by TLD

2. **View Trends**
   - Visit Trends page
   - See trending keywords
   - Check sample domains

3. **Monitor Domains**
   - Go to Monitor page
   - Add a domain to watch
   - Track changes

### Add Your Own Data

Use the API to add domains:

```bash
curl -X POST http://localhost:3000/api/domains/search \
  -H "Content-Type: application/json" \
  -d '{"domains": ["example.com", "test.net", "demo.io"]}'
```

### Explore the API

Check out the API documentation at:
- `docs/API.md` - Full API reference
- `http://localhost:3000/api/stats` - Platform statistics

## Common Issues

### Database Connection Error

**Problem:** Can't connect to PostgreSQL

**Solution:**
1. Check PostgreSQL is running: `sudo systemctl status postgresql`
2. Verify DATABASE_URL in `.env`
3. Test connection: `psql -U postgres -d opendotdb`

### Port 3000 Already in Use

**Problem:** Port is occupied

**Solution:**
```bash
# Find and kill the process
lsof -i :3000
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
```

### Module Not Found

**Problem:** Missing dependencies

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Prisma Client Errors

**Problem:** Prisma client out of sync

**Solution:**
```bash
npm run db:generate
```

## Production Deployment

For production deployment, see:
- `docs/DEPLOYMENT.md` - Complete deployment guide
- Supports Vercel, Docker, VPS, and more

## Learning Resources

- **Features**: `docs/FEATURES.md` - All features explained
- **API**: `docs/API.md` - Complete API documentation
- **Contributing**: `docs/CONTRIBUTING.md` - How to contribute

## Project Structure

```
opendotdb/
├── src/
│   ├── app/           # Next.js pages and API routes
│   ├── components/    # React components
│   ├── lib/           # Utilities
│   └── types/         # TypeScript types
├── prisma/
│   ├── schema.prisma  # Database schema
│   └── seed.ts        # Sample data
├── docs/              # Documentation
└── scripts/           # Utility scripts
```

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/yourusername/opendotdb/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/opendotdb/discussions)
- **Documentation**: Check the `docs/` folder

## Next Steps

1. **Customize**: Modify the UI and features to your needs
2. **Import Data**: Add your domain data via API
3. **Deploy**: Host it on Vercel, Docker, or your server
4. **Contribute**: Help make OpenDotDB better!

---

**Congratulations! 🎉** You now have a working domain research platform!

Ready to dive deeper? Check out the [full documentation](README.md).
