# Security Best Practices Command

Security guidelines and best practices for HELiiX-OS development.

## Command: /security

### Security Principles:

1. **Defense in Depth** - Multiple layers of security
2. **Least Privilege** - Minimal access rights
3. **Zero Trust** - Verify everything
4. **Data Privacy** - FERPA compliance for student data

### Authentication & Authorization:

#### Supabase Auth Setup

```typescript
// lib/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr';

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
      },
    }
  );

  await supabase.auth.getUser();
  return response;
}
```

#### Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE awards_program ENABLE ROW LEVEL SECURITY;

-- School-based access
CREATE POLICY "Users see own school data" ON invoices
  FOR SELECT USING (
    school_id = (
      SELECT school_id FROM profiles
      WHERE id = auth.uid()
    )
  );

-- Role-based access
CREATE POLICY "Admins full access" ON awards_program
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );
```

### Environment Variables:

#### Secure Storage

```bash
# Never commit .env files
echo ".env*" >> .gitignore

# Use different keys for environments
# .env.local (development)
# .env.production (production - set in hosting platform)

# Validate required variables
const requiredEnvVars = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'ANTHROPIC_API_KEY',
  'PINECONE_API_KEY'
]

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`)
  }
})
```

#### Client-Side Variables

```typescript
// Only expose NEXT_PUBLIC_ variables to client
// ❌ Bad
const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ✅ Good
const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
```

### Input Validation:

#### API Validation

```typescript
// Use zod for schema validation
import { z } from 'zod';

const awardSchema = z.object({
  name: z.string().min(1).max(255),
  category: z.enum(['trophy', 'medal', 'plaque']),
  quantity: z.number().int().positive(),
  classCode: z.enum(['S-050', 'S-060']),
});

export async function POST(request: Request) {
  const body = await request.json();

  // Validate input
  const result = awardSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: result.error },
      { status: 400 }
    );
  }

  // Sanitize data before database insertion
  const sanitized = {
    ...result.data,
    name: sanitizeHtml(result.data.name),
  };
}
```

#### SQL Injection Prevention

```typescript
// ❌ Never use string concatenation
const query = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ Use parameterized queries
const { data } = await supabase.from('users').select('*').eq('email', email);

// ✅ Or prepared statements
const { data } = await supabase.rpc('get_user_by_email', {
  email_param: email,
});
```

### XSS Prevention:

```typescript
// Sanitize user content
import DOMPurify from 'isomorphic-dompurify'

const sanitizedContent = DOMPurify.sanitize(userInput, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
  ALLOWED_ATTR: ['href'],
})

// React automatically escapes content
<div>{userContent}</div> // Safe

// Dangerous - only if absolutely necessary
<div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
```

### CSRF Protection:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Verify origin for mutations
  if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    if (origin && !origin.includes(host)) {
      return new Response('CSRF detected', { status: 403 });
    }
  }
}
```

### File Upload Security:

```typescript
// Validate file uploads
const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
const maxSize = 5 * 1024 * 1024; // 5MB

export async function uploadFile(file: File) {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }

  // Check file size
  if (file.size > maxSize) {
    throw new Error('File too large');
  }

  // Scan for malware (if service available)
  // await scanFile(file)

  // Generate safe filename
  const safeFilename = `${uuidv4()}-${sanitizeFilename(file.name)}`;
}
```

### API Security:

#### Rate Limiting

```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
});

export async function rateLimitMiddleware(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return new Response('Too Many Requests', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': new Date(reset).toISOString(),
      },
    });
  }
}
```

#### API Key Management

```typescript
// Rotate API keys regularly
// Store in secure vault (not in code)
// Use different keys per environment
// Monitor usage for anomalies

// Validate API keys
const validApiKey = await bcrypt.compare(providedKey, hashedKeyFromDatabase);
```

### Security Headers:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval';"
  );
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  return response;
}
```

### Data Privacy:

```typescript
// FERPA Compliance for student data
// 1. Encrypt sensitive data at rest
// 2. Use HTTPS for all communications
// 3. Implement access logging
// 4. Regular security audits

// Anonymize data when possible
function anonymizeStudentData(student: Student) {
  return {
    id: hashId(student.id),
    school: student.school,
    sport: student.sport,
    // Omit PII
  };
}
```

### Security Checklist:

- [ ] Enable Supabase RLS on all tables
- [ ] Validate all user inputs
- [ ] Sanitize output data
- [ ] Use parameterized queries
- [ ] Implement rate limiting
- [ ] Set security headers
- [ ] Regular dependency updates
- [ ] Security scanning in CI/CD
- [ ] Audit logs for sensitive operations
- [ ] Regular penetration testing

### Monitoring:

```typescript
// Log security events
export function logSecurityEvent(event: SecurityEvent) {
  console.error('[SECURITY]', {
    timestamp: new Date().toISOString(),
    event: event.type,
    userId: event.userId,
    ip: event.ip,
    details: event.details,
  });

  // Send to monitoring service
  // await sendToSentry(event)
}
```

### Usage:

```
/security
```

Follow these security best practices to protect HELiiX-OS and user data.
