# Development Server Command

Start and manage the HELiiX-OS development server with Docker or local options.

## Command: /dev-server

### Quick Start (Local):

```bash
# Standard development server
pnpm run dev              # Port 3002

# With Turbopack (faster HMR)
pnpm run dev:turbo        # Port 3000
```

### Docker Development Setup (Recommended):

#### Docker Compose Configuration:

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  # Next.js Development Server
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - '3002:3002'
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    environment:
      - NODE_ENV=development
      - NEXT_TELEMETRY_DISABLED=1
    env_file:
      - .env.local
    command: pnpm run dev
    restart: unless-stopped

  # Supabase Local Development
  supabase-db:
    image: supabase/postgres:15.1.0.117
    ports:
      - '54322:5432'
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_USER: postgres
      POSTGRES_DB: postgres
    volumes:
      - supabase-db-data:/var/lib/postgresql/data

  supabase-auth:
    image: supabase/gotrue:v2.149.0
    ports:
      - '54321:9999'
    depends_on:
      - supabase-db
    environment:
      GOTRUE_API_HOST: 0.0.0.0
      GOTRUE_API_PORT: 9999
      API_EXTERNAL_URL: http://localhost:54321
      GOTRUE_DB_DRIVER: postgres
      GOTRUE_DB_DATABASE_URL: postgres://postgres:postgres@supabase-db:5432/postgres?search_path=auth
      GOTRUE_SITE_URL: http://localhost:3002
      GOTRUE_JWT_SECRET: super-secret-jwt-token-with-at-least-32-characters
      GOTRUE_JWT_EXP: 3600

  supabase-rest:
    image: postgrest/postgrest:v12.0.1
    ports:
      - '54323:3000'
    depends_on:
      - supabase-db
    environment:
      PGRST_DB_URI: postgres://postgres:postgres@supabase-db:5432/postgres
      PGRST_DB_ANON_ROLE: anon
      PGRST_JWT_SECRET: super-secret-jwt-token-with-at-least-32-characters
      PGRST_DB_SCHEMAS: public,competition

  supabase-realtime:
    image: supabase/realtime:v2.28.32
    ports:
      - '54324:4000'
    depends_on:
      - supabase-db
    environment:
      DB_HOST: supabase-db
      DB_PORT: 5432
      DB_NAME: postgres
      DB_USER: postgres
      DB_PASSWORD: postgres
      JWT_SECRET: super-secret-jwt-token-with-at-least-32-characters

volumes:
  supabase-db-data:
```

#### Development Dockerfile:

```dockerfile
# Dockerfile.dev
FROM node:18-alpine

# Install pnpm
RUN corepack enable
RUN corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy app files
COPY . .

# Expose port
EXPOSE 3002

# Start dev server
CMD ["pnpm", "run", "dev"]
```

### Docker Commands:

```bash
# Start all services
docker-compose -f docker-compose.dev.yml up

# Start in background
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f app

# Stop services
docker-compose -f docker-compose.dev.yml down

# Rebuild after dependency changes
docker-compose -f docker-compose.dev.yml up --build

# Clean volumes (database reset)
docker-compose -f docker-compose.dev.yml down -v
```

### Environment Setup:

```bash
# .env.local for Docker
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54323
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Use host.docker.internal for local services from container
DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:54322/postgres
```

### Development Server Options:

#### 1. Standard Dev Mode

```bash
pnpm run dev
# - Port: 3002
# - Hot Module Replacement
# - Error overlay
# - Fast refresh
```

#### 2. Turbopack Mode (Faster)

```bash
pnpm run dev:turbo
# - Port: 3000
# - Rust-based bundler
# - 10x faster HMR
# - Better for large projects
```

#### 3. Debug Mode

```bash
NODE_OPTIONS='--inspect' pnpm run dev
# - Enables Node.js debugging
# - Chrome DevTools integration
# - Breakpoint debugging
```

#### 4. Custom Port

```bash
PORT=3003 pnpm run dev
# Or modify package.json script
```

### Browser Tools:

```bash
# Open automatically
pnpm run dev & sleep 5 && open http://localhost:3002

# With specific browser
pnpm run dev & sleep 5 && open -a "Google Chrome" http://localhost:3002
```

### Performance Monitoring:

```bash
# Enable build analysis
ANALYZE=true pnpm run dev

# Disable telemetry for faster startup
NEXT_TELEMETRY_DISABLED=1 pnpm run dev

# Verbose logging
DEBUG=* pnpm run dev
```

### Multi-Service Development:

```bash
# Run everything with one command
#!/bin/bash
# dev.sh

echo "Starting HELiiX-OS Development Environment..."

# Start Supabase
docker-compose -f docker-compose.dev.yml up -d supabase-db supabase-auth supabase-rest supabase-realtime

# Wait for services
echo "Waiting for services to start..."
sleep 10

# Run migrations
pnpm run db:migrate

# Start Next.js
pnpm run dev
```

### VS Code Integration:

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug full stack",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["run", "dev"],
      "skipFiles": ["<node_internals>/**"],
      "serverReadyAction": {
        "pattern": "ready on",
        "uriFormat": "http://localhost:3002",
        "action": "openExternally"
      }
    }
  ]
}
```

### Health Checks:

```bash
# Check if dev server is running
curl -I http://localhost:3002

# Check Supabase services
curl http://localhost:54323/rest/v1/
curl http://localhost:54321/auth/v1/health

# Check all services
docker-compose -f docker-compose.dev.yml ps
```

### Troubleshooting:

```bash
# Port already in use
lsof -i :3002 && kill -9 $(lsof -t -i :3002)

# Clear caches
rm -rf .next node_modules/.cache

# Reset everything
docker-compose -f docker-compose.dev.yml down -v
pnpm install --force
pnpm run dev
```

### Usage:

```
/dev-server
```

Choose between Docker (recommended for consistency) or local development based on your needs.
