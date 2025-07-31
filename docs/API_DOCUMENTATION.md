# HELiiX-OS API Documentation

**Last Updated**: 2025-01-31

## Overview

The HELiiX-OS platform provides a comprehensive REST API for managing Big 12 Conference operations, including awards management, financial operations, AI services, and more.

## Base URL

```
Development: http://localhost:3002/api
Production: https://heliix-os.vercel.app/api
```

## Authentication

All API endpoints require authentication via Supabase Auth. Include the authentication token in the `Authorization` header:

```
Authorization: Bearer YOUR_AUTH_TOKEN
```

## API Endpoints

### AI Services (`/api/ai/*`)

#### POST `/api/ai/chat`

Multi-provider AI chat interface supporting OpenAI, Anthropic, Google, and Perplexity.

**Request Body:**

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Your message here"
    }
  ],
  "provider": "openai" // optional: openai, anthropic, google, perplexity
}
```

**Response:**

```json
{
  "message": {
    "role": "assistant",
    "content": "AI response"
  }
}
```

#### POST `/api/ai/search`

Semantic search across operational data using Pinecone vector search.

**Request Body:**

```json
{
  "query": "search query",
  "limit": 10,
  "filter": {
    "category": "awards"
  }
}
```

#### POST `/api/ai/categorize`

AI-powered document categorization for policies and manuals.

**Request Body:**

```json
{
  "content": "document content",
  "type": "policy"
}
```

### Awards Management (`/api/awards/*`)

#### GET `/api/awards/inventory`

Retrieve current award inventory with stock levels.

**Query Parameters:**

- `category`: Filter by award category
- `status`: Filter by stock status (in_stock, low_stock, out_of_stock)

**Response:**

```json
{
  "awards": [
    {
      "id": "uuid",
      "name": "Championship Trophy",
      "category": "championship",
      "stock": 12,
      "unit_cost": 450.0,
      "class_code": "S-060"
    }
  ],
  "total": 125,
  "availability_rate": 0.89
}
```

#### POST `/api/awards/recipients`

Add a new award recipient.

**Request Body:**

```json
{
  "award_id": "uuid",
  "recipient_name": "John Doe",
  "school_id": "uuid",
  "sport": "basketball",
  "season": "2024-25"
}
```

#### GET `/api/awards/budget`

Get award budget tracking and variance analysis.

**Response:**

```json
{
  "total_budget": 150000,
  "spent": 87500,
  "remaining": 62500,
  "variance": 0.42,
  "by_category": {
    "championship": 45000,
    "all_conference": 32500,
    "academic": 10000
  }
}
```

### Basketball Analytics (`/api/basketball/*`)

#### GET `/api/basketball/teams`

Retrieve team statistics and rankings.

**Query Parameters:**

- `season`: Season year (e.g., "2024-25")
- `gender`: "mens" or "womens"

#### GET `/api/basketball/efficiency`

Get advanced efficiency metrics and analytics.

**Response:**

```json
{
  "teams": [
    {
      "school": "Kansas",
      "offensive_efficiency": 112.3,
      "defensive_efficiency": 95.4,
      "net_rating": 16.9,
      "pace": 72.1
    }
  ]
}
```

### Financial Operations (`/api/invoices/*`)

#### POST `/api/invoices/process`

AI-powered invoice processing and categorization.

**Request Body:**

```json
{
  "file_url": "https://storage.url/invoice.pdf",
  "vendor": "Trophy Supplier Inc"
}
```

**Response:**

```json
{
  "invoice_id": "uuid",
  "extracted_data": {
    "invoice_number": "INV-2025-001",
    "amount": 5250.0,
    "date": "2025-01-15",
    "line_items": []
  },
  "category": "awards",
  "account_code": "4105"
}
```

### Policy Management (`/api/policies/*`)

#### GET `/api/policies/search`

Search across all Big 12 policy documents.

**Query Parameters:**

- `q`: Search query
- `sport`: Filter by sport
- `type`: Policy type (playing_rules, governance, compliance)

#### POST `/api/policies/validate`

Validate actions against current policies.

**Request Body:**

```json
{
  "action": "schedule_change",
  "sport": "football",
  "details": {
    "original_date": "2025-09-15",
    "new_date": "2025-09-16"
  }
}
```

### Sports Data (`/api/sports/*`)

#### GET `/api/sports/schedule`

Get comprehensive sports scheduling data.

**Query Parameters:**

- `sport`: Sport code
- `start_date`: ISO date string
- `end_date`: ISO date string
- `school_id`: Filter by school

#### POST `/api/sports/social-sentiment`

Analyze social media sentiment for sports events.

**Request Body:**

```json
{
  "event_id": "uuid",
  "platform": "twitter",
  "date_range": {
    "start": "2025-01-01",
    "end": "2025-01-31"
  }
}
```

### Authentication (`/api/auth/*`)

#### POST `/api/auth/login`

Authenticate user and receive access token.

**Request Body:**

```json
{
  "email": "user@big12sports.com",
  "password": "secure_password"
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@big12sports.com",
    "role": "admin"
  },
  "access_token": "jwt_token",
  "refresh_token": "refresh_token"
}
```

#### POST `/api/auth/logout`

Invalidate current session.

### External Integrations

#### Notion Integration (`/api/notion/*`)

- `GET /api/notion/sync` - Sync data with Notion workspace
- `POST /api/notion/export` - Export data to Notion

#### X (Twitter) Integration (`/api/x/*`)

- `GET /api/x/analytics` - Get social media analytics
- `POST /api/x/schedule` - Schedule social media posts

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested resource was not found",
    "details": {
      "resource": "award",
      "id": "uuid"
    }
  }
}
```

### Common Error Codes

- `UNAUTHORIZED` - Missing or invalid authentication
- `FORBIDDEN` - Insufficient permissions
- `VALIDATION_ERROR` - Invalid request data
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Server error

## Rate Limiting

- **Standard endpoints**: 100 requests per minute
- **AI endpoints**: 20 requests per minute
- **File upload endpoints**: 10 requests per minute

## Pagination

List endpoints support pagination via query parameters:

```
?page=1&limit=20&sort=created_at&order=desc
```

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "pages": 8
  }
}
```

## Webhooks

Subscribe to real-time events via webhooks:

- `award.created` - New award added to inventory
- `budget.threshold` - Budget threshold reached
- `game.scheduled` - New game scheduled
- `policy.updated` - Policy document updated

## Performance Standards

- Average response time: < 200ms
- AI processing: < 3ms
- API uptime: > 99.9%
- Concurrent requests: 1000+

## SDK Support

Official SDKs available for:

- JavaScript/TypeScript
- Python
- Go

Example usage:

```typescript
import { HelixClient } from '@heliix/sdk';

const client = new HelixClient({
  apiKey: process.env.HELIIX_API_KEY,
});

const awards = await client.awards.list({
  category: 'championship',
});
```
