# Deployment Command

Complete deployment guide for HELiiX-OS to production.

## Command: /deploy

### Pre-Deployment Checklist:

```bash
# 1. Run all tests
pnpm run type-check
pnpm run lint
pnpm run format:check

# 2. Build locally
pnpm run build

# 3. Test production build
pnpm run start

# 4. Check environment variables
grep "NEXT_PUBLIC" .env.local
```

### Deployment Options:

#### Option 1: Vercel (Recommended)

**One-Click Deploy:**

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Environment Variables (Vercel Dashboard):**

```
# Required for production
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
PERPLEXITY_API_KEY=

# Vector Search
PINECONE_API_KEY=
PINECONE_ENVIRONMENT=
PINECONE_INDEX=

# File Upload
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
```

**Vercel Configuration:**

```json
// vercel.json
{
  "buildCommand": "pnpm run build",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "src/app/api/ai/chat/route.ts": {
      "maxDuration": 30
    }
  }
}
```

#### Option 2: Docker Deployment

**Dockerfile:**

```dockerfile
FROM node:18-alpine AS base

# Install pnpm
RUN corepack enable
RUN corepack prepare pnpm@9.0.0 --activate

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

**Build & Run:**

```bash
# Build image
docker build -t heliix-os .

# Run container
docker run -p 3000:3000 --env-file .env.production heliix-os
```

#### Option 3: Traditional VPS

**Server Setup:**

```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2
pnpm add -g pm2

# Clone repository
git clone https://github.com/your-org/heliix-os.git
cd heliix-os

# Install dependencies
pnpm install

# Build application
pnpm run build

# Start with PM2
pm2 start npm --name "heliix-os" -- start
pm2 save
pm2 startup
```

### Database Migration:

```bash
# Run migrations on production
pnpm dlx supabase migration up --db-url $DATABASE_URL

# Verify migrations
pnpm dlx supabase migration list
```

### Post-Deployment:

1. **Verify Deployment**

   ```bash
   # Check site status
   curl -I https://your-domain.com

   # Test API endpoints
   curl https://your-domain.com/api/health
   ```

2. **Monitor Performance**
   - Check Vercel Analytics
   - Monitor Supabase metrics
   - Review AI provider usage

3. **Setup Monitoring**
   - Error tracking (Sentry)
   - Uptime monitoring
   - Performance metrics

### Environment-Specific Settings:

**Production Optimizations:**

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-cdn.com'],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};
```

**Security Headers:**

```javascript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')

  return response
}
```

### Rollback Plan:

```bash
# Vercel
vercel rollback

# Docker
docker run -p 3000:3000 heliix-os:previous-tag

# PM2
pm2 restart heliix-os --update-env
```

### DNS Configuration:

```
# A Records
@ -> Vercel IP
www -> Vercel IP

# CNAME (if using subdomain)
app -> cname.vercel-dns.com
```

### SSL/TLS:

- Vercel: Automatic SSL
- Docker/VPS: Use Certbot for Let's Encrypt

```bash
sudo certbot --nginx -d your-domain.com
```

### Usage:

```
/deploy
```

Follow the deployment checklist and choose the appropriate deployment method for your infrastructure.
