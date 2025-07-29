# Create API Endpoint Command

Create a new API endpoint following HELiiX-OS patterns and Next.js App Router conventions.

## Command: /api-endpoint <route-path>

### API Route Template:

```typescript
// src/app/api/[feature]/[endpoint]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// GET handler
export async function GET(request: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Check authentication (if required)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Your logic here
    const { data, error } = await supabase.from('table_name').select('*');

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch data' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    if (!body.requiredField) {
      return NextResponse.json(
        { error: 'Missing required field' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Your logic here
    const { data, error } = await supabase
      .from('table_name')
      .insert([body])
      .select();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create record' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH handler
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Update logic
}

// DELETE handler
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Delete logic
}
```

### API Route Organization:

```
src/app/api/
├── ai/
│   ├── chat/route.ts
│   ├── search/route.ts
│   └── categorize/route.ts
├── auth/
│   ├── login/route.ts
│   └── logout/route.ts
├── awards/
│   ├── categories/route.ts
│   └── recipients/route.ts
├── basketball/
│   ├── games/route.ts
│   └── teams/route.ts
└── policies/
    ├── search/route.ts
    └── categories/route.ts
```

### Common Patterns:

1. **Authentication Check**

   ```typescript
   const {
     data: { user },
   } = await supabase.auth.getUser();
   if (!user) {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }
   ```

2. **Request Validation**

   ```typescript
   const schema = z.object({
     name: z.string().min(1),
     email: z.string().email(),
   });

   const result = schema.safeParse(body);
   if (!result.success) {
     return NextResponse.json({ error: result.error }, { status: 400 });
   }
   ```

3. **Error Handling**

   ```typescript
   try {
     // Your logic
   } catch (error) {
     console.error('API error:', error);
     return NextResponse.json(
       { error: 'Internal server error' },
       { status: 500 }
     );
   }
   ```

4. **Response Headers**
   ```typescript
   return NextResponse.json(
     { data },
     {
       status: 200,
       headers: {
         'Cache-Control': 'no-store, max-age=0',
       },
     }
   );
   ```

### Best Practices:

1. **RESTful conventions** - Use proper HTTP methods
2. **Consistent error format** - `{ error: string, details?: any }`
3. **Status codes** - 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 500 Server Error
4. **Logging** - Use console.error for errors
5. **Type safety** - Define interfaces for request/response
6. **Performance** - < 3ms target for AI operations

### Usage:

```
/api-endpoint awards/budget
/api-endpoint sports/social-sentiment
/api-endpoint basketball/analytics
```
