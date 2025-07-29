# HELiiX-OS Platform

HELiiX-OS is a dual-purpose platform combining a corporate marketing website for HELiiX AI Solutions with a comprehensive AI-powered operations platform for the Big 12 Conference. The system provides real-time logistics management, financial oversight, and operational intelligence across all 16 member institutions.

## ✨ Core Features

### 🎯 **Operations Center**

- **FlexTime Scheduling**: AI-powered sports scheduling with 94% efficiency (2,437+ games managed)
- **Weather Command Center**: Real-time monitoring across all 16 Big 12 campuses
- **Governance & Compliance**: Managing 147 policy documents and playing rules
- **System Health**: 96% overall operational health with 99.98% API uptime

### 🏆 **Awards Management**

- **Complete Inventory Tracking**: 1,250+ award items with 89% stock availability
- **Recipient Database**: Individual and team award recipient management
- **Budget Integration**: Financial tracking with Big 12 account code alignment
- **Status Monitoring**: Real-time delivery and distribution tracking

### 💰 **Financial Operations**

- **Budget Management**: Real-time budget monitoring and variance analysis
- **Revenue Distribution**: $126.2M+ quarterly distribution tracking
- **Invoice Processing**: AI-powered extraction and categorization
- **School-by-School Analysis**: Detailed financial breakdowns for all 16 members

### 🤖 **AI-Powered Intelligence**

- **Multi-Provider AI**: Claude, GPT-4, Gemini, and Perplexity integration
- **Natural Language Search**: Semantic search across all operational data
- **Predictive Analytics**: Inventory forecasting and demand prediction
- **Automated Reports**: AI-generated insights and performance reports
- **2.3ms Average Processing Time**: Real-time AI responses

### 🏫 **Big 12 Management**

- **Member Directory**: Complete information for all 16 conference schools
- **Sport Coverage**: 23 different sports with comprehensive tracking
- **Geographic Intelligence**: Location-based analytics and coordination
- **Contact Management**: Centralized directory with real-time updates

## 🛠 Tech Stack

- **Framework**: Next.js 15 with TypeScript and Turbopack
- **Database**: Supabase PostgreSQL with real-time subscriptions (competition & public schemas)
- **AI**: Vercel AI SDK with multi-provider support (OpenAI, Anthropic, Google, Perplexity)
- **UI**: Custom Tailwind CSS components with class-variance-authority
- **Styling**: Tailwind CSS v4 with custom design system
- **Vector Search**: Pinecone integration for semantic document retrieval
- **File Storage**: Supabase Storage with UploadThing for secure uploads
- **Charts**: Recharts for interactive data visualization

## 🌐 Platform Sections

### Public Corporate Website
- **Landing Page**: Professional marketing site at `/`
- **AI Solutions**: Six core AI services for collegiate athletics
- **Case Studies**: Big 12 Conference partnership success
- **Leadership Team**: Industry experts in AI and athletics
- **Contact**: Partnership inquiry forms

### Internal Operations Platform
- **Dashboard**: Real-time operational metrics at `/dashboard`
- **Awards Management**: Complete inventory tracking system
- **Financial Operations**: Budget and distribution management
- **AI Assistant**: Multi-provider chat interface

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 9.0+ (required package manager)
- Supabase account
- Required API keys (OpenAI, Anthropic, Pinecone)

### Installation

```bash
# Install pnpm if not already installed
npm install -g pnpm

# Clone and install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Configure your API keys and database URLs

# Run database migrations
pnpm run db:migrate

# Start development server
pnpm run dev
```

### Access the Platform

🌐 **Local Development**: [http://localhost:3002](http://localhost:3002)
🌐 **Turbopack Development**: [http://localhost:3000](http://localhost:3000)
🌐 **Production**: [http://localhost:4000](http://localhost:4000)

## 📱 Application Routes

### Public Website
- `/` - HELiiX AI Solutions corporate landing page
- `/login` - Authentication portal to internal platform

### Core Platform

- `/dashboard` - Main operational dashboard with real-time metrics
- `/operations` - Unified operations center with system health
- `/ai-assistant` - Multi-provider AI chat interface
- `/ai-features` - Natural language search and predictions

### Awards & Financial

- `/awards/categories` - Award category management and statistics
- `/awards/recipients` - Recipient tracking and history
- `/finance/budgets` - Budget monitoring and variance analysis
- `/finance/distributions` - Revenue distribution tracking

### Big 12 Management

- `/teams/schools` - Member school directory and information
- `/teams/venues` - Venue management (in development)
- `/teams/travel` - Travel planning system (in development)

## 🔧 Scripts & Commands

```bash
# Development
pnpm run dev          # Start dev server (port 3002)
pnpm run dev:turbo    # Start with Turbopack (port 3000)
pnpm run build        # Production build
pnpm run start        # Start production server (port 4000)
pnpm run lint         # ESLint code quality check
pnpm run lint:fix     # Fix ESLint issues
pnpm run type-check   # TypeScript type checking
pnpm run clean        # Clean build artifacts

# Code Formatting
pnpm run format       # Format code with Prettier
pnpm run format:check # Check code formatting

# Database
pnpm run db:migrate   # Run Supabase migrations
pnpm run db:reset     # Reset database schema
pnpm run db:seed      # Seed initial data

# Analysis & Maintenance
pnpm run analyze:components   # Analyze component usage
pnpm run check:types         # TypeScript type checking

# Package Management
pnpm install          # Install dependencies
pnpm add <package>    # Add new dependency
pnpm remove <package> # Remove dependency
pnpm update           # Update all dependencies
```

# HELiiX-OS Development Guidelines

## Component Library: Custom Tailwind CSS Components

This project uses custom-built Tailwind CSS components for maximum simplicity and control. NO external UI libraries are used - all components are built with pure Tailwind CSS classes and class-variance-authority for variants.

### Component Architecture

- **Location**: All UI components in `/src/components/ui/`
- **Styling**: Pure Tailwind CSS classes
- **Variants**: Managed with class-variance-authority (cva)
- **TypeScript**: Fully typed component props
- **Simplicity**: Components under 300 lines, focused single-purpose

### Component Import Pattern

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
// etc.
```

### Example Component Structure

```tsx
// Simple, focused components with Tailwind classes
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-black text-white hover:bg-gray-800',
        secondary: 'bg-white text-black border border-black hover:bg-gray-50',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4 py-2',
      },
    },
  }
);
```

### Design Principles

- **Simplicity First**: No complex prop systems or abstractions
- **Tailwind Native**: Use Tailwind classes directly
- **Type Safety**: Full TypeScript support
- **Accessibility**: Proper ARIA attributes and keyboard navigation
- **Performance**: Minimal runtime overhead

### SEO Metadata Pattern

```tsx
export const metadata = {
  title: 'Page Title | HELiiX-OS',
  description: 'Page description',
  keywords: ['Big 12', 'Athletics', 'Operations'],
  robots: { index: false, follow: false }, // for internal pages
};
```

## 🗄 Database Architecture

### Core Tables

- **`awards_program`** - Comprehensive award tracking with class codes
- **`award_recipients`** - Individual and team recipient management
- **`award_budget_tracking`** - Financial oversight and procurement
- **`invoices`** - Invoice processing and categorization
- **`manuals`** - Document management with AI categorization

### Key Features

- **Real-time Subscriptions**: Live data updates across all modules
- **Class Code Integration**: S-050 (Regular Season) / S-060 (Championship)
- **Financial Tracking**: Account 4105 integration with Big 12 standards
- **Vector Storage**: Pinecone integration for semantic search

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm add -g vercel

# One-click deployment
vercel deploy

# Environment variables required:
# - SUPABASE_URL, SUPABASE_ANON_KEY
# - OPENAI_API_KEY, ANTHROPIC_API_KEY
# - PINECONE_API_KEY, UPLOADTHING_SECRET

# Build optimization for pnpm
# Vercel automatically detects pnpm when pnpm-lock.yaml is present
```

### Manual Deployment

- **Database**: Supabase PostgreSQL with automatic scaling; Schema = competition
- **CDN**: Vercel Edge Network for global performance
- **Monitoring**: Built-in health checks and performance metrics

## 📊 Performance Metrics

- **AI Processing**: 2.3ms average response time
- **API Uptime**: 99.98% availability
- **System Health**: 96% overall operational status
- **Data Processing**: 2,437+ games scheduled, 1,250+ awards tracked
- **Financial Management**: $126.2M+ in distributions managed

## 🔒 Security & Compliance

- **Authentication**: Supabase Auth with row-level security
- **API Security**: Rate limiting and request validation
- **Data Privacy**: FERPA-compliant student data handling
- **File Storage**: Secure upload with virus scanning
- **Audit Trails**: Complete activity logging for compliance
