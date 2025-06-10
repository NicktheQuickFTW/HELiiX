# HELiiX Operations Platform

HELiiX is a comprehensive operations platform for the Big 12 Conference, providing logistics management, AI-powered assistance, and operational intelligence.

## Features

- **AI Assistant**: Multi-provider AI chat with Claude, GPT-4, and other models
- **Document Management**: Intelligent categorization and search of operational documents
- **Awards Tracking**: Complete awards inventory and recipient management system
- **Invoice Processing**: AI-powered invoice extraction and processing
- **Big 12 Operations**: Conference-specific tools for sports scheduling, governance, and compliance
- **Weather Dashboard**: Real-time weather data for all Big 12 school locations
- **Inventory Predictions**: AI-driven inventory management and forecasting

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Database**: Supabase with PostgreSQL
- **AI**: Multi-provider support (Anthropic Claude, OpenAI GPT-4, Google Gemini, Perplexity)
- **UI**: shadcn/ui components with Tailwind CSS
- **File Storage**: Supabase Storage with UploadThing integration
- **Vector Search**: Pinecone for document similarity search

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see `.env.example`)

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:4000](http://localhost:4000) to access the platform

## Key Components

### AI Features
- Natural language search across documents
- Automated document categorization
- Invoice data extraction
- Inventory demand forecasting
- Report generation

### Big 12 Operations
- Sport scheduling and coordination
- Governance and compliance tracking
- Conference weather monitoring
- Member school management

### Awards Management
- Complete inventory tracking
- Recipient database
- Team connections and relationships

## Scripts

- `npm run dev` - Start development server on port 4000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Database Setup

The platform uses Supabase with automatic migrations. Key schemas include:
- Awards tracking and inventory
- Document management
- User authentication
- File storage buckets

## Deployment

Optimized for Vercel deployment with automatic CI/CD integration.
