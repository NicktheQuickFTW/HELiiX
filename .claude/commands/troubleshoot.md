# Troubleshooting Command

Common issues and solutions for HELiiX-OS development.

## Command: /troubleshoot

### Common Issues:

#### 1. Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3002`

```bash
# Find process using port
lsof -i :3002

# Kill process
kill -9 <PID>

# Or use different port
PORT=3003 pnpm run dev
```

#### 2. Supabase Connection Failed

**Error**: `Failed to connect to database`

```bash
# Check Supabase status
pnpm dlx supabase status

# Verify environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Test connection
pnpm dlx supabase db test
```

#### 3. TypeScript Errors

**Error**: `Type 'X' is not assignable to type 'Y'`

```bash
# Full type check
pnpm run type-check

# Clear TypeScript cache
rm -rf node_modules/.cache
pnpm install

# Check tsconfig.json
cat tsconfig.json
```

#### 4. Module Not Found

**Error**: `Cannot find module '@/components/...'`

```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Check import paths
# Ensure using @/ alias correctly

# Verify tsconfig paths
grep -A5 "paths" tsconfig.json
```

#### 5. Tailwind Classes Not Working

**Issue**: Styles not applying

```bash
# Check Tailwind config
cat tailwind.config.ts

# Ensure content paths include all files
# Should include: './src/**/*.{js,ts,jsx,tsx}'

# Clear CSS cache
rm -rf .next
pnpm run dev
```

#### 6. Environment Variables Not Loading

**Issue**: undefined environment variables

```bash
# Check .env.local exists
ls -la .env*

# Verify variable names start with NEXT_PUBLIC_ for client
grep "NEXT_PUBLIC" .env.local

# Restart dev server after changes
pnpm run dev
```

#### 7. Build Failures

**Error**: Build errors in production

```bash
# Clean build
pnpm run clean
pnpm run build

# Check for console.log statements
grep -r "console.log" src/

# Ignore TypeScript errors (temporary)
# Add to next.config.js:
# typescript: { ignoreBuildErrors: true }
```

#### 8. Hydration Errors

**Error**: `Hydration failed because initial UI does not match`

```javascript
// Common causes:
// 1. Date/time rendering
// 2. Random values
// 3. Browser-only APIs

// Solution: Use useEffect or dynamic imports
import dynamic from 'next/dynamic';

const ClientOnlyComponent = dynamic(() => import('./ClientComponent'), {
  ssr: false,
});
```

#### 9. AI Provider Errors

**Error**: `API key not valid`

```bash
# Verify API keys
echo $OPENAI_API_KEY | cut -c1-10

# Test provider
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Check usage limits
# Visit provider dashboards
```

#### 10. Database Migration Errors

**Error**: `Migration failed`

```bash
# Reset database
pnpm run db:reset

# Run migrations manually
pnpm dlx supabase migration up

# Check migration files
ls -la supabase/migrations/
```

### Debug Commands:

```bash
# Check Node version
node --version  # Should be 18+

# Check pnpm version
pnpm --version  # Should be 9.0+

# List all dependencies
pnpm list

# Check for outdated packages
pnpm outdated

# Audit for vulnerabilities
pnpm audit

# Clear all caches
rm -rf .next node_modules/.cache
pnpm store prune
```

### Performance Issues:

1. **Slow Dev Server**

   ```bash
   # Use Turbopack
   pnpm run dev:turbo

   # Disable telemetry
   export NEXT_TELEMETRY_DISABLED=1
   ```

2. **Large Bundle Size**
   ```bash
   # Analyze bundle
   pnpm run build
   pnpm dlx @next/bundle-analyzer
   ```

### Getting Help:

1. Check error logs in console
2. Search error message in project
3. Check Next.js documentation
4. Review Supabase logs
5. Ask in team chat with error details

### Usage:

```
/troubleshoot
```
