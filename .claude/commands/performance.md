# Performance Optimization Command

Performance optimization tips and best practices for HELiiX-OS.

## Command: /performance

### Performance Targets:

- **AI Response**: < 3ms average
- **API Response**: < 100ms for queries
- **Page Load**: < 1s initial load
- **Build Time**: < 2 minutes
- **Lighthouse Score**: > 90 all categories

### Frontend Optimization:

#### 1. Code Splitting

```typescript
// Dynamic imports for heavy components
const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  {
    loading: () => <Skeleton />,
    ssr: false
  }
)

// Route-based splitting (automatic in App Router)
// Each page is automatically code-split
```

#### 2. Image Optimization

```tsx
import Image from 'next/image'

// Use Next.js Image component
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority // For above-fold images
  placeholder="blur"
  blurDataURL={blurDataUrl}
/>

// Configure domains in next.config.js
images: {
  domains: ['your-cdn.com'],
  formats: ['image/avif', 'image/webp'],
}
```

#### 3. Font Optimization

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
```

#### 4. Bundle Size Reduction

```bash
# Analyze bundle
pnpm run build
pnpm dlx @next/bundle-analyzer

# Remove unused dependencies
pnpm dlx depcheck

# Use tree-shakeable imports
import { debounce } from 'lodash-es' // ✅
import _ from 'lodash' // ❌
```

### Backend Optimization:

#### 1. Database Queries

```typescript
// Use indexes effectively
CREATE INDEX idx_games_date ON games(game_date);
CREATE INDEX idx_awards_category ON awards_program(category);

// Batch operations
const { data } = await supabase
  .from('awards_program')
  .select('*, recipients:award_recipients(*)') // Join in one query
  .in('category', categories) // Batch filter
  .limit(50) // Pagination

// Use database views for complex queries
CREATE VIEW game_schedule AS
SELECT g.*, h.name as home_team, a.name as away_team
FROM games g
JOIN teams h ON g.home_team_id = h.id
JOIN teams a ON g.away_team_id = a.id;
```

#### 2. API Response Caching

```typescript
// app/api/sports/games/route.ts
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { data },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    }
  );
}

// Use unstable_cache for data fetching
import { unstable_cache } from 'next/cache';

const getCachedGames = unstable_cache(
  async (sport: string) => {
    return supabase.from('games').select('*').eq('sport', sport);
  },
  ['games'],
  { revalidate: 3600 } // 1 hour
);
```

#### 3. Edge Functions

```typescript
// middleware.ts
export const config = {
  runtime: 'edge', // Run on edge for lower latency
};

export function middleware(request: NextRequest) {
  // Quick checks at edge
  const country = request.geo?.country || 'US';

  if (country !== 'US') {
    return NextResponse.redirect('/not-available');
  }
}
```

### AI Performance:

#### 1. Stream Responses

```typescript
// Always stream AI responses
import { streamText } from 'ai';

const result = await streamText({
  model: provider.model,
  messages,
  // Stream for immediate feedback
});

return result.toDataStreamResponse();
```

#### 2. Optimize Prompts

```typescript
// Shorter, focused prompts
const optimizedPrompt = {
  system: 'You are a concise assistant. Respond in under 100 words.',
  temperature: 0.3, // Lower for consistency
  maxTokens: 500, // Limit response length
};
```

#### 3. Provider Selection

```typescript
// Use appropriate models
const taskProviderMap = {
  simple: 'gpt-3.5-turbo', // 10x faster
  complex: 'claude-3-5-sonnet', // When needed
  search: 'perplexity-sonar', // For web data
};
```

### React Optimization:

#### 1. Memoization

```tsx
// Memoize expensive components
const ExpensiveComponent = memo(
  ({ data }) => {
    return <ComplexVisualization data={data} />;
  },
  (prevProps, nextProps) => {
    return prevProps.data.id === nextProps.data.id;
  }
);

// Use useMemo for expensive calculations
const processedData = useMemo(() => processComplexData(rawData), [rawData]);
```

#### 2. Virtual Lists

```tsx
// For long lists
import { FixedSizeList } from 'react-window';

<FixedSizeList height={600} itemCount={items.length} itemSize={50} width="100%">
  {Row}
</FixedSizeList>;
```

#### 3. Suspense Boundaries

```tsx
// Granular loading states
<Suspense fallback={<GamesSkeleton />}>
  <GamesList />
</Suspense>

<Suspense fallback={<StatsSkeleton />}>
  <StatsPanel />
</Suspense>
```

### Monitoring Tools:

```typescript
// Performance monitoring
export function measurePerformance(name: string, fn: Function) {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;

  if (duration > 100) {
    console.warn(`Slow operation: ${name} took ${duration}ms`);
  }

  return result;
}

// Web Vitals tracking
import { onCLS, onFID, onLCP, onTTFB } from 'web-vitals';

export function reportWebVitals(metric) {
  console.log(metric);
  // Send to analytics
}
```

### Build Optimization:

```javascript
// next.config.js
module.exports = {
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
  },
};
```

### Checklist:

- [ ] Enable Turbopack in development
- [ ] Use React Server Components
- [ ] Implement proper caching strategies
- [ ] Optimize images and fonts
- [ ] Minimize client-side JavaScript
- [ ] Use database indexes
- [ ] Stream AI responses
- [ ] Monitor Core Web Vitals
- [ ] Regular bundle analysis

### Usage:

```
/performance
```

Follow these optimization strategies to maintain peak performance.
