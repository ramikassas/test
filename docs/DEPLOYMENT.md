# Deployment Guide

## Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn

## Local Development

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/opendotdb.git
cd opendotdb
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
createdb opendotdb
```

Create a `.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/opendotdb"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 3. Initialize Database

```bash
npm run db:push
npm run db:generate
npm run db:seed  # Optional: Add sample data
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Production Deployment

### Option 1: Vercel (Recommended for Next.js)

1. Push your code to GitHub

2. Import project to Vercel:
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository

3. Set environment variables:
   ```
   DATABASE_URL=your_production_database_url
   NEXT_PUBLIC_API_URL=your_production_url
   ```

4. Deploy!

### Option 2: Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: opendotdb
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: yourpassword
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:yourpassword@db:5432/opendotdb
      NEXT_PUBLIC_API_URL: http://localhost:3000
    depends_on:
      - db

volumes:
  postgres_data:
```

Deploy:

```bash
docker-compose up -d
```

### Option 3: VPS (DigitalOcean, AWS EC2, etc.)

1. SSH into your server

2. Install Node.js and PostgreSQL:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs postgresql
```

3. Clone and setup:
```bash
git clone https://github.com/yourusername/opendotdb.git
cd opendotdb
npm install
npm run build
```

4. Setup PostgreSQL:
```bash
sudo -u postgres createdb opendotdb
sudo -u postgres createuser yourusername
```

5. Configure environment variables in `.env`

6. Run with PM2:
```bash
npm install -g pm2
pm2 start npm --name "opendotdb" -- start
pm2 save
pm2 startup
```

7. Setup Nginx as reverse proxy:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Performance Optimization

### 1. Database Indexing

The schema already includes essential indexes. For large datasets, consider:

```sql
-- Additional indexes for better performance
CREATE INDEX CONCURRENTLY idx_domain_name_trgm ON "Domain" USING gin (name gin_trgm_ops);
CREATE INDEX CONCURRENTLY idx_keyword_word_trgm ON "Keyword" USING gin (word gin_trgm_ops);
```

### 2. Caching

Consider adding Redis for caching:

```bash
npm install redis
```

### 3. CDN

Use a CDN for static assets:
- Vercel automatically provides CDN
- Or use Cloudflare, AWS CloudFront, etc.

### 4. Database Connection Pooling

For high traffic, use PgBouncer or adjust Prisma connection pool:

```javascript
// In prisma.ts
new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['error'],
  errorFormat: 'minimal',
})
```

## Monitoring

### Application Monitoring

Use services like:
- Sentry for error tracking
- DataDog for performance monitoring
- Vercel Analytics (if deployed on Vercel)

### Database Monitoring

- Use PostgreSQL's `pg_stat_statements`
- Monitor slow queries
- Set up alerts for high CPU/memory usage

## Backup

### Database Backup

```bash
# Daily backup
pg_dump opendotdb > backup_$(date +%Y%m%d).sql

# Restore
psql opendotdb < backup_20260108.sql
```

### Automated Backups

Set up cron job:

```bash
0 2 * * * pg_dump opendotdb > /backups/opendotdb_$(date +\%Y\%m\%d).sql
```

## Security

1. **Environment Variables**: Never commit `.env` to Git
2. **Database**: Use strong passwords, enable SSL
3. **HTTPS**: Always use HTTPS in production
4. **Rate Limiting**: Implement rate limiting for APIs
5. **Input Validation**: All API endpoints validate input
6. **CORS**: Configure CORS appropriately

## Scaling

For large-scale deployments:

1. **Database**: Use read replicas for read-heavy workloads
2. **Application**: Deploy multiple instances behind a load balancer
3. **Search**: Consider Elasticsearch for advanced search
4. **Caching**: Implement Redis for frequently accessed data
5. **Queue**: Use Bull or similar for background jobs

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -h localhost -U postgres -d opendotdb
```

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Port Already in Use
```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>
```
