# X API + Grok Integration Documentation

## Overview

HELiiX now features real-time social media monitoring and AI-powered analysis through integration with X (Twitter) API and xAI's Grok model. This integration provides:

- Real-time social media feeds for Big 12 sports
- AI-powered game analysis and predictions
- Social sentiment tracking for teams and games
- Live game updates with social context
- Conference news aggregation

## Architecture

### 1. X API Client (`src/lib/x-api.ts`)

- Handles authentication with X API v2
- Provides methods for searching tweets, getting live updates, and analyzing sentiment
- Includes demo mode with mock data for development
- Supports team-specific and sport-specific filtering

### 2. Grok AI Provider (`src/lib/ai-providers.ts`)

- Integrates xAI's Grok model using OpenAI-compatible SDK
- Specialized for sports analysis and social insights
- Provides streaming responses for real-time analysis

### 3. Real-time Service (`src/lib/realtime-service.ts`)

- Manages polling for updates
- Handles subscriptions for different update types
- Caches updates and manages notification distribution
- Supports game-specific, team-specific, and conference-wide monitoring

## API Routes

### X API Routes

- `GET /api/x/timeline` - Fetch Big 12 related tweets
- `GET /api/x/live-updates` - Get real-time game updates
- `GET /api/sports/social-sentiment` - Analyze team sentiment

### AI Routes

- `POST /api/ai/grok-analysis` - Generate AI-powered analysis using Grok

## UI Components

### 1. SocialFeed (`src/components/big12/SocialFeed.tsx`)

- Displays real-time X posts
- Supports filtering by sport and team
- Shows engagement metrics and media
- Infinite scroll with pagination

### 2. LiveGameUpdates (`src/components/big12/LiveGameUpdates.tsx`)

- Real-time updates during live games
- Social sentiment visualization
- Priority-based update highlighting
- Integration with game scores

### 3. GrokInsights (`src/components/big12/GrokInsights.tsx`)

- AI-powered analysis interface
- Multiple analysis types:
  - Game previews
  - Post-game analysis
  - Team sentiment analysis
  - Conference trends
- Streaming responses with formatted output

### 4. SocialSentiment (`src/components/big12/SocialSentiment.tsx`)

- Visual sentiment analysis for teams
- Comparison views across multiple teams
- Trending topics and hashtags
- Engagement metrics

## Configuration

### Environment Variables

```bash
# xAI (Grok) Configuration
GROK_API_KEY=your-grok-api-key
GROK_API_URL=https://api.x.ai/v1
GROK_MODEL=grok-beta

# X (Twitter) API Configuration
X_API_KEY=your-x-api-key
X_API_SECRET=your-x-api-secret
X_ACCESS_TOKEN=your-x-access-token
X_ACCESS_TOKEN_SECRET=your-x-access-token-secret
X_BEARER_TOKEN=your-x-bearer-token
```

## Usage

### Demo Mode

The system runs in demo mode when X API credentials are not configured. This allows testing with mock data that simulates real Big 12 social media activity.

### Production Setup

1. Obtain X Developer credentials
2. Get xAI/Grok API access
3. Configure environment variables
4. Deploy and monitor rate limits

### Access the Social Dashboard

Navigate to `/social` to access the integrated dashboard featuring:

- Real-time social feeds
- AI insights
- Sentiment analysis
- Live game updates

## Features

### Real-time Updates

- Polling intervals: 30s (games), 2m (news), 5m (sentiment)
- Automatic cache cleanup
- Priority-based notifications

### AI Analysis Types

1. **Game Preview**: Pre-game analysis with social sentiment
2. **Post-Game**: Comprehensive game recap with fan reactions
3. **Team Sentiment**: Ongoing mood tracking for specific teams
4. **Conference Trends**: Big picture analysis of conference narratives

### Social Sentiment Analysis

- Positive/Negative/Neutral breakdown
- Engagement metrics
- Trending hashtags
- Historical comparisons

## Best Practices

1. **Rate Limiting**: Monitor X API rate limits
2. **Caching**: Use built-in caching to reduce API calls
3. **Error Handling**: System gracefully falls back to cached/mock data
4. **Privacy**: No personal data is stored; only public tweets are analyzed

## Future Enhancements

1. WebSocket integration for true real-time updates
2. Advanced NLP for better sentiment analysis
3. Predictive analytics for game outcomes
4. Integration with more social platforms
5. Custom alerts and notifications
6. Historical data analysis and trends
