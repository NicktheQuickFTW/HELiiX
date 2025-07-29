# HELiiX Service Integration Guide

_How to Build and Integrate New Services into the HELiiX Platform_

## Table of Contents

1. [Quick Start](#quick-start)
2. [Service Requirements](#service-requirements)
3. [Step-by-Step Integration](#step-by-step-integration)
4. [Service Templates](#service-templates)
5. [Testing Your Integration](#testing-your-integration)
6. [Deployment Guide](#deployment-guide)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Quick Start

To integrate a new service with HELiiX:

```bash
# 1. Clone the service template
git clone https://github.com/heliixai/service-template my-service
cd my-service

# 2. Configure your service
npm run setup
# Answer the prompts:
# - Service ID: my-service
# - Service Name: My Awesome Service
# - Description: Service that does awesome things
# - Primary capability: data-processing

# 3. Install dependencies
npm install

# 4. Configure environment
cp .env.example .env.local
# Add your Supabase credentials

# 5. Run locally
npm run dev

# 6. Register with HELiiX
npm run register
```

## Service Requirements

### Mandatory Requirements

1. **Unique Service ID**: Lowercase, hyphenated (e.g., `award-tracker`)
2. **REST API**: Expose RESTful endpoints
3. **Health Check**: Implement `/health` endpoint
4. **Authentication**: Support Supabase Auth
5. **Event Publishing**: Emit events for state changes
6. **Documentation**: OpenAPI/Swagger spec

### Technical Stack Flexibility

While services can use any technology stack, they must:

- Expose HTTP/REST APIs
- Support JSON request/response
- Integrate with Supabase for data
- Implement standard health checks

### Recommended Stack

- **Backend**: Node.js/TypeScript, Python, or Go
- **API**: Express, FastAPI, or Gin
- **Database**: Supabase (required for shared data)
- **Caching**: Redis (optional)
- **Monitoring**: OpenTelemetry

## Step-by-Step Integration

### Step 1: Service Setup

Create your service structure:

```
my-service/
├── src/
│   ├── api/          # API endpoints
│   ├── events/       # Event handlers
│   ├── models/       # Data models
│   ├── services/     # Business logic
│   └── utils/        # Utilities
├── config/
│   ├── service.json  # Service configuration
│   └── openapi.yaml  # API documentation
├── migrations/       # Database migrations
├── tests/           # Test files
├── Dockerfile       # Container definition
└── package.json     # Dependencies
```

### Step 2: Service Configuration

Create `config/service.json`:

```json
{
  "serviceId": "award-tracker",
  "name": "Award Tracker Service",
  "version": "1.0.0",
  "description": "Manages awards and recognition programs",
  "capabilities": {
    "awards": true,
    "inventory": true,
    "reporting": true
  },
  "endpoints": {
    "base": "https://awards.heliixai.com",
    "health": "/health",
    "api": "/api/v1"
  },
  "events": {
    "publishes": ["AWARD_CREATED", "AWARD_UPDATED", "INVENTORY_LOW"],
    "subscribes": ["USER_CREATED", "ORGANIZATION_UPDATED"]
  },
  "dependencies": {
    "required": ["supabase"],
    "optional": ["redis", "smtp"]
  }
}
```

### Step 3: Implement Core Interfaces

#### Health Check Endpoint

```typescript
// src/api/health.ts
import { Router } from 'express';
import { checkDatabase, checkRedis, checkDependencies } from '../utils/health';

const router = Router();

router.get('/health', async (req, res) => {
  const checks = {
    service: {
      id: process.env.SERVICE_ID,
      version: process.env.SERVICE_VERSION,
      uptime: process.uptime(),
    },
    database: await checkDatabase(),
    cache: await checkRedis(),
    dependencies: await checkDependencies(),
  };

  const isHealthy = Object.values(checks)
    .filter((check) => typeof check === 'object' && 'healthy' in check)
    .every((check) => check.healthy);

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    ...checks,
  });
});

export default router;
```

#### Service Registration

```typescript
// src/services/registration.ts
import { createClient } from '@supabase/supabase-js';
import serviceConfig from '../config/service.json';

export class ServiceRegistration {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
  }

  async register() {
    const registration = {
      service_id: serviceConfig.serviceId,
      name: serviceConfig.name,
      version: serviceConfig.version,
      endpoint: serviceConfig.endpoints.base,
      health_endpoint: serviceConfig.endpoints.health,
      capabilities: serviceConfig.capabilities,
      status: 'active',
      metadata: {
        events: serviceConfig.events,
        dependencies: serviceConfig.dependencies,
      },
    };

    const { data, error } = await this.supabase
      .from('services')
      .upsert(registration, {
        onConflict: 'service_id',
      });

    if (error) throw error;

    console.log(`Service ${serviceConfig.serviceId} registered successfully`);
    return data;
  }

  async deregister() {
    const { error } = await this.supabase
      .from('services')
      .update({ status: 'inactive' })
      .eq('service_id', serviceConfig.serviceId);

    if (error) throw error;
  }
}
```

### Step 4: Database Integration

#### Schema Setup

```sql
-- migrations/001_create_service_schema.sql
CREATE SCHEMA IF NOT EXISTS award_tracker;

-- Set search path for this service
SET search_path TO award_tracker, public;

-- Service-specific tables
CREATE TABLE awards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    unit_cost DECIMAL(10,2),
    metadata JSONB,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "org_isolation" ON awards
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id
            FROM public.users
            WHERE id = auth.uid()
        )
    );

-- Indexes
CREATE INDEX idx_awards_org ON awards(organization_id);
CREATE INDEX idx_awards_category ON awards(category);
```

#### Data Access Layer

```typescript
// src/models/award.ts
import { supabase } from '../utils/supabase';

export interface Award {
  id?: string;
  organizationId: string;
  name: string;
  description?: string;
  category: string;
  quantity: number;
  unitCost?: number;
  metadata?: Record<string, any>;
}

export class AwardModel {
  private table = 'award_tracker.awards';

  async create(award: Award) {
    const { data, error } = await supabase
      .from(this.table)
      .insert({
        organization_id: award.organizationId,
        name: award.name,
        description: award.description,
        category: award.category,
        quantity: award.quantity,
        unit_cost: award.unitCost,
        metadata: award.metadata,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findByOrganization(organizationId: string) {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async update(id: string, updates: Partial<Award>) {
    const { data, error } = await supabase
      .from(this.table)
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
```

### Step 5: Event Integration

#### Event Publisher

```typescript
// src/events/publisher.ts
import { EventBus } from '@heliixai/event-bus';
import { supabase } from '../utils/supabase';

export class EventPublisher {
  private eventBus: EventBus;

  constructor() {
    this.eventBus = new EventBus(supabase);
  }

  async publishAwardCreated(award: Award) {
    await this.eventBus.publish({
      type: 'AWARD_CREATED',
      service: 'award-tracker',
      organizationId: award.organizationId,
      payload: {
        awardId: award.id,
        name: award.name,
        category: award.category,
        quantity: award.quantity,
      },
      metadata: {
        userId: getCurrentUserId(),
        timestamp: new Date().toISOString(),
      },
    });
  }

  async publishInventoryLow(award: Award) {
    if (award.quantity < 10) {
      await this.eventBus.publish({
        type: 'INVENTORY_LOW',
        service: 'award-tracker',
        organizationId: award.organizationId,
        payload: {
          awardId: award.id,
          name: award.name,
          currentQuantity: award.quantity,
          threshold: 10,
        },
      });
    }
  }
}
```

#### Event Subscriber

```typescript
// src/events/subscriber.ts
import { EventBus } from '@heliixai/event-bus';
import { supabase } from '../utils/supabase';

export class EventSubscriber {
  private eventBus: EventBus;

  constructor() {
    this.eventBus = new EventBus(supabase);
  }

  async initialize() {
    // Subscribe to user creation
    this.eventBus.subscribe('USER_CREATED', async (event) => {
      console.log('New user created:', event.payload);
      // Initialize default awards for new organization
      if (event.payload.role === 'admin') {
        await this.createDefaultAwards(event.payload.organizationId);
      }
    });

    // Subscribe to organization updates
    this.eventBus.subscribe('ORGANIZATION_UPDATED', async (event) => {
      console.log('Organization updated:', event.payload);
      // Update cached organization data
      await this.updateOrganizationCache(event.payload);
    });
  }

  private async createDefaultAwards(organizationId: string) {
    // Implementation
  }

  private async updateOrganizationCache(orgData: any) {
    // Implementation
  }
}
```

### Step 6: API Implementation

#### Express Server Setup

```typescript
// src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { authenticateRequest } from './middleware/auth';
import { errorHandler } from './middleware/error';
import healthRouter from './api/health';
import awardsRouter from './api/awards';
import { ServiceRegistration } from './services/registration';
import { EventSubscriber } from './events/subscriber';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(authenticateRequest);

// Routes
app.use(healthRouter);
app.use('/api/v1/awards', awardsRouter);

// Error handling
app.use(errorHandler);

// Initialize service
async function initialize() {
  // Register service
  const registration = new ServiceRegistration();
  await registration.register();

  // Initialize event subscribers
  const subscriber = new EventSubscriber();
  await subscriber.initialize();

  // Start server
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Award Tracker service running on port ${port}`);
  });
}

initialize().catch(console.error);
```

#### API Endpoints

```typescript
// src/api/awards.ts
import { Router } from 'express';
import { AwardModel } from '../models/award';
import { EventPublisher } from '../events/publisher';
import { validateRequest } from '../middleware/validation';
import { awardSchema } from '../schemas/award';

const router = Router();
const awardModel = new AwardModel();
const eventPublisher = new EventPublisher();

// Get all awards for organization
router.get('/', async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const awards = await awardModel.findByOrganization(organizationId);
    res.json({ data: awards });
  } catch (error) {
    next(error);
  }
});

// Create new award
router.post('/', validateRequest(awardSchema), async (req, res, next) => {
  try {
    const award = await awardModel.create({
      ...req.body,
      organizationId: req.user.organizationId,
    });

    // Publish event
    await eventPublisher.publishAwardCreated(award);

    res.status(201).json({ data: award });
  } catch (error) {
    next(error);
  }
});

// Update award
router.put('/:id', validateRequest(awardSchema), async (req, res, next) => {
  try {
    const award = await awardModel.update(req.params.id, req.body);

    // Check inventory levels
    await eventPublisher.publishInventoryLow(award);

    res.json({ data: award });
  } catch (error) {
    next(error);
  }
});

export default router;
```

### Step 7: Authentication Middleware

```typescript
// src/middleware/auth.ts
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function authenticateRequest(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET!);

    // Get user from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.sub)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Attach user to request
    req.user = user;
    req.organizationId = user.organization_id;

    // Set service context for RLS
    await supabase.rpc('set_config', {
      parameter: 'app.organization_id',
      value: user.organization_id,
    });

    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
}
```

## Service Templates

### TypeScript/Node.js Template

```bash
git clone https://github.com/heliixai/service-template-node
```

### Python/FastAPI Template

```bash
git clone https://github.com/heliixai/service-template-python
```

### Go/Gin Template

```bash
git clone https://github.com/heliixai/service-template-go
```

### Template Features

- Pre-configured Docker setup
- CI/CD pipelines
- Testing framework
- Logging configuration
- Error handling
- API documentation

## Testing Your Integration

### Unit Tests

```typescript
// tests/awards.test.ts
import { describe, it, expect, beforeAll } from '@jest/globals';
import { AwardModel } from '../src/models/award';

describe('Award Model', () => {
  let awardModel: AwardModel;

  beforeAll(() => {
    awardModel = new AwardModel();
  });

  it('should create an award', async () => {
    const award = await awardModel.create({
      organizationId: 'test-org',
      name: 'Test Award',
      category: 'achievement',
      quantity: 100,
    });

    expect(award).toBeDefined();
    expect(award.name).toBe('Test Award');
  });
});
```

### Integration Tests

```typescript
// tests/integration/api.test.ts
import request from 'supertest';
import app from '../src/server';

describe('Awards API', () => {
  it('GET /health should return healthy status', async () => {
    const response = await request(app).get('/health').expect(200);

    expect(response.body.status).toBe('healthy');
  });

  it('GET /api/v1/awards should require authentication', async () => {
    await request(app).get('/api/v1/awards').expect(401);
  });
});
```

### End-to-End Tests

```typescript
// tests/e2e/awards.e2e.ts
import { test, expect } from '@playwright/test';

test('Award creation flow', async ({ page }) => {
  // Login
  await page.goto('https://heliix.local/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password');
  await page.click('button[type="submit"]');

  // Navigate to awards
  await page.goto('https://heliix.local/awards');

  // Create award
  await page.click('button:has-text("Create Award")');
  await page.fill('[name="name"]', 'Excellence Award');
  await page.fill('[name="quantity"]', '50');
  await page.click('button:has-text("Save")');

  // Verify creation
  await expect(page.locator('text=Excellence Award')).toBeVisible();
});
```

## Deployment Guide

### Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

### Kubernetes Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: award-tracker
  namespace: heliix-services
spec:
  replicas: 3
  selector:
    matchLabels:
      app: award-tracker
  template:
    metadata:
      labels:
        app: award-tracker
    spec:
      containers:
        - name: award-tracker
          image: heliixai/award-tracker:latest
          ports:
            - containerPort: 3000
          env:
            - name: SERVICE_ID
              value: 'award-tracker'
            - name: SUPABASE_URL
              valueFrom:
                secretKeyRef:
                  name: supabase-config
                  key: url
            - name: SUPABASE_ANON_KEY
              valueFrom:
                secretKeyRef:
                  name: supabase-config
                  key: anon-key
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy Service

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:integration

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/setup-buildx-action@v2
      - uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      - uses: docker/build-push-action@v4
        with:
          push: true
          tags: heliixai/award-tracker:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: azure/setup-kubectl@v3
      - run: |
          kubectl apply -f k8s/
          kubectl rollout status deployment/award-tracker -n heliix-services
```

## Best Practices

### 1. Error Handling

```typescript
// Consistent error responses
class ServiceError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
  }
}

// Usage
throw new ServiceError(404, 'AWARD_NOT_FOUND', 'Award not found');
```

### 2. Logging

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'award-tracker' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

// Usage
logger.info('Award created', { awardId: award.id, userId: req.user.id });
```

### 3. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
});

app.use('/api/', limiter);
```

### 4. Caching

```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Cache frequently accessed data
async function getAwardWithCache(id: string) {
  const cached = await redis.get(`award:${id}`);
  if (cached) return JSON.parse(cached);

  const award = await awardModel.findById(id);
  await redis.setex(`award:${id}`, 3600, JSON.stringify(award));

  return award;
}
```

### 5. Monitoring

```typescript
import { register } from 'prom-client';

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

## Troubleshooting

### Common Issues

#### 1. Service Registration Fails

```bash
# Check service registry
curl https://api.heliixai.com/api/v1/services

# Verify credentials
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_KEY

# Check network connectivity
curl -I https://api.heliixai.com/health
```

#### 2. Authentication Issues

```bash
# Verify JWT secret
jwt decode $TOKEN

# Check user exists
psql $DATABASE_URL -c "SELECT * FROM users WHERE id='$USER_ID'"

# Test auth endpoint
curl -H "Authorization: Bearer $TOKEN" \
  https://localhost:3000/api/v1/awards
```

#### 3. Event Publishing Fails

```sql
-- Check event store
SELECT * FROM events
WHERE service_id = 'award-tracker'
ORDER BY created_at DESC
LIMIT 10;

-- Verify event subscriptions
SELECT * FROM event_subscriptions
WHERE service_id = 'award-tracker';
```

#### 4. Performance Issues

```bash
# Check resource usage
docker stats award-tracker

# Analyze slow queries
EXPLAIN ANALYZE
SELECT * FROM award_tracker.awards
WHERE organization_id = 'xxx';

# Check connection pool
SELECT count(*) FROM pg_stat_activity
WHERE application_name = 'award-tracker';
```

### Debug Mode

```typescript
// Enable debug logging
if (process.env.DEBUG) {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
      headers: req.headers,
      body: req.body,
      user: req.user,
    });
    next();
  });
}
```

### Health Check Details

```bash
# Detailed health check
curl https://localhost:3000/health?detailed=true

# Response includes:
# - Database connection status
# - Redis connection status
# - External service availability
# - Memory usage
# - CPU usage
# - Request metrics
```

## Support

For help with service integration:

1. **Documentation**: https://docs.heliixai.com/integration
2. **Examples**: https://github.com/heliixai/service-examples
3. **Community**: https://discord.gg/heliixai
4. **Support**: support@heliixai.com

---

_Last Updated: January 2025_  
_Guide Version: 1.0_
