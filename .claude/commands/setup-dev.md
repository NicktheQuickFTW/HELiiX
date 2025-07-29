# Setup Development Environment Command

Set up the HELiiX-OS development environment from scratch.

## Command: /setup-dev

### Setup Steps:

1. **Prerequisites Check**

   ```bash
   node --version    # Should be 18+
   pnpm --version    # Should be 9.0+
   ```

2. **Install Dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Required variables:

     ```
     # Supabase
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

4. **Database Setup**

   ```bash
   # Start Supabase locally (optional)
   pnpm dlx supabase start

   # Run migrations
   pnpm run db:migrate

   # Seed initial data
   pnpm run db:seed
   ```

5. **Verify Setup**

   ```bash
   # Type checking
   pnpm run type-check

   # Linting
   pnpm run lint

   # Start dev server
   pnpm run dev
   ```

6. **Access Points**
   - Development: http://localhost:3002
   - Turbopack: http://localhost:3000 (with `pnpm run dev:turbo`)
   - Production: http://localhost:4000 (after `pnpm run build && pnpm run start`)

### Common Issues:

1. **Port conflicts**: Change ports in package.json scripts
2. **Database connection**: Verify Supabase URL and keys
3. **Type errors**: Run `pnpm run type-check` and fix issues
4. **Missing dependencies**: Run `pnpm install` again

### Usage:

```
/setup-dev
```
