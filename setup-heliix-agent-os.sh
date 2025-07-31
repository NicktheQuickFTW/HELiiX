#!/bin/bash

# HELiiX Agent OS Global Setup Script
# This script sets up the global Agent OS infrastructure for all HELiiX projects

set -e  # Exit on error

echo "🚀 HELiiX Agent OS Global Setup"
echo "================================"
echo ""

# Create global HELiiX Agent OS directory structure
echo "📁 Creating global directory structure..."
mkdir -p "$HOME/.heliix-agent-os/product"
mkdir -p "$HOME/.heliix-agent-os/standards/code-style"
mkdir -p "$HOME/.heliix-agent-os/agents/shared"
mkdir -p "$HOME/.heliix-agent-os/specs"
mkdir -p "$HOME/.heliix-agent-os/templates"
mkdir -p "$HOME/.heliix-agent-os/commands"

# Create mission-lite.md
echo ""
echo "📝 Creating HELiiX mission documentation..."
cat > "$HOME/.heliix-agent-os/product/mission-lite.md" << 'EOF'
# HELiiX AI Solutions Mission (Lite)

HELiiX AI Solutions provides cutting-edge AI-powered operations platforms for collegiate athletics, specializing in the Big 12 Conference. Our mission is to revolutionize conference operations through intelligent automation, real-time analytics, and seamless integration across all aspects of athletic administration.

## Core Values
- **Innovation**: Pioneering AI solutions for sports management
- **Efficiency**: 94% scheduling efficiency, <3ms AI response times
- **Reliability**: 99.9% uptime, enterprise-grade systems
- **Partnership**: Deep integration with Big 12 Conference operations

## Product Suite
1. **HELiiX-OS**: Comprehensive operations platform
2. **Dox**: Policy management and compliance system
3. **Flextime**: AI-powered sports scheduling
4. **IRIS**: Incident reporting and suspension management
EOF

# Create roadmap.md
cat > "$HOME/.heliix-agent-os/product/roadmap.md" << 'EOF'
# HELiiX Product Roadmap

## Current Phase: Q1 2025 - Foundation Enhancement

### Completed ✅
- [x] HELiiX-OS corporate landing page
- [x] Agent OS integration assessment
- [x] Multi-project Claude agent development

### In Progress 🚧
- [ ] Global Agent OS implementation
- [ ] Cross-project agent standardization
- [ ] Enhanced PRP methodology integration

### Upcoming 📋
- [ ] Unified authentication system
- [ ] Cross-platform data synchronization
- [ ] Advanced analytics dashboard
- [ ] Mobile application development

## Q2 2025: Scale & Optimization
- [ ] Performance optimization (<1ms AI response)
- [ ] Cost reduction through model compression
- [ ] Expanded Big 12 integrations
- [ ] Real-time collaboration features

## Q3 2025: Intelligence & Automation
- [ ] Predictive analytics for all platforms
- [ ] Autonomous decision-making agents
- [ ] Natural language interfaces
- [ ] API marketplace launch
EOF

# Create tech-stack.md
cat > "$HOME/.heliix-agent-os/standards/tech-stack.md" << 'EOF'
# HELiiX Technology Stack

## Core Technologies

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (custom components only)
- **State**: React Context + Zustand
- **Package Manager**: pnpm (required)

### Backend
- **Database**: Supabase PostgreSQL
  - Competition schema for sports data
  - Public schema for application data
  - Real-time subscriptions enabled
- **AI Providers**: 
  - Claude (complex reasoning)
  - GPT-4 (general purpose)
  - Gemini (multimodal)
  - Perplexity (web search)
- **Vector Search**: Pinecone
- **File Storage**: Supabase Storage + AWS S3

### Infrastructure
- **Hosting**: Vercel Edge Network
- **Monitoring**: Custom analytics
- **CI/CD**: GitHub Actions
- **Container**: Docker (development)

### Development Tools
- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier
- **Testing**: Jest + React Testing Library
- **Type Checking**: TypeScript strict mode
- **Git Hooks**: Husky + lint-staged

## Performance Standards
- AI Response: < 3ms average
- API Uptime: > 99.9%
- Build Time: < 5 minutes
- Page Load: < 1.5s (LCP)

## Security Requirements
- Row-level security on all tables
- FERPA compliance for student data
- API rate limiting
- Encrypted file storage
EOF

# Create HELiiX-specific standards
cat > "$HOME/.heliix-agent-os/standards/heliix-style.md" << 'EOF'
# HELiiX Code Style Guide

## TypeScript/JavaScript

### General Principles
- Prefer functional components and hooks
- Use TypeScript strict mode
- Explicit return types for all functions
- No `any` types without justification

### Naming Conventions
- Components: PascalCase (e.g., `AwardTracker`)
- Functions: camelCase (e.g., `calculateSuspension`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
- Files: kebab-case (e.g., `award-tracker.tsx`)

### Component Structure
```typescript
// 1. Imports (grouped and ordered)
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { Award } from '@/types';

// 2. Types/Interfaces
interface AwardTrackerProps {
  awards: Award[];
  onUpdate: (id: string) => void;
}

// 3. Component (single responsibility)
export function AwardTracker({ awards, onUpdate }: AwardTrackerProps) {
  // 4. State and hooks
  const [selected, setSelected] = useState<string | null>(null);
  
  // 5. Event handlers
  const handleSelect = (id: string) => {
    setSelected(id);
    onUpdate(id);
  };
  
  // 6. Render
  return (
    <div className="space-y-4">
      {/* Component JSX */}
    </div>
  );
}
```

### Tailwind CSS Usage
- Use custom components from `/components/ui/`
- No external UI libraries
- Components must be under 300 lines
- Mobile-first responsive design

### Database Queries
- Always use parameterized queries
- Handle errors with proper logging
- Use transactions for multi-step operations
- Access competition schema through views

## Big 12 Conference Standards

### Data Handling
- All 16 member schools must be supported
- BYU Sunday restrictions must be enforced
- FERPA compliance for student data
- Sport-specific rules must be validated

### Performance Requirements
- AI operations < 3ms response time
- Database queries < 100ms
- API endpoints < 500ms total
- Real-time updates < 1s latency
EOF

# Create Big 12 domain standards
cat > "$HOME/.heliix-agent-os/standards/big12-domain.md" << 'EOF'
# Big 12 Conference Domain Knowledge

## Member Institutions (16)
1. Arizona
2. Arizona State  
3. Baylor
4. BYU
5. UCF
6. Cincinnati
7. Colorado
8. Houston
9. Iowa State
10. Kansas
11. Kansas State
12. Oklahoma State
13. TCU
14. Texas Tech
15. Utah
16. West Virginia

## Sports Coverage (23 Total)

### Team Sports with Conference Schedules
- Baseball (14 teams)
- Basketball - Men's (16 teams)
- Basketball - Women's (16 teams)
- Beach Volleyball (3 teams)
- Football (16 teams)
- Gymnastics (7 teams)
- Lacrosse (6 teams)
- Soccer (16 teams)
- Softball (11 teams)
- Tennis - Men's (9 teams)
- Tennis - Women's (16 teams)
- Volleyball (15 teams)
- Wrestling (14 teams)

### Championship-Only Sports
- Cross Country (M/W)
- Equestrian
- Golf (M/W)
- Rowing
- Swimming & Diving (M/W)
- Track & Field - Indoor (M/W)
- Track & Field - Outdoor (M/W)

## Key Business Rules

### Scheduling Constraints
- BYU: No competitions on Sundays
- Travel partners vary by sport
- Mountain schools altitude considerations
- Network TV preferences (ESPN/Fox)

### Financial Codes
- Revenue Distribution: $126.2M+ quarterly
- Awards Budget: Account 4105
- Class Codes: S-050 (Regular Season), S-060 (Championship)

### Compliance Requirements
- NCAA regulations
- FERPA for student data
- Title IX considerations
- Conference-specific rules
EOF

# Create templates directory files
cat > "$HOME/.heliix-agent-os/templates/heliix-prp-template.md" << 'EOF'
# HELiiX PRP Template with Agent OS Integration

name: "[Feature Name] - HELiiX Implementation"
description: |
  Comprehensive implementation guide combining HELiiX PRP methodology with Agent OS structured workflows

## Metadata (Agent OS Enhancement)
```yaml
created: YYYY-MM-DD
spec_id: HELIIX-XXX
status: [planning|executing|completed]
confidence_target: 0.9
project: [heliix-os|dox|flextime|iris]
```

## Goal
[Specific end state for the HELiiX platform feature]

## Why
- Business value for Big 12 Conference operations
- Integration with existing HELiiX systems
- Performance improvements or cost reductions

## What
[User-visible behavior with Big 12 context]

### Success Criteria
- [ ] Meets <3ms AI response time requirement
- [ ] Integrates with Supabase competition schema
- [ ] Handles all 16 member institutions
- [ ] Complies with conference regulations

## Context (Conditional Loading)

```yaml
conditional_context:
  - if_needed: "@standards/big12-domain.md"
    when: "handling conference data"
  - if_needed: "@standards/heliix-style.md"
    when: "implementing UI components"
  - if_needed: "supabase/migrations/"
    when: "modifying database schema"
```

## Implementation Blueprint

### Phase 1: Multi-Agent Research (9/10 Confidence)
Deploy specialized agents for comprehensive analysis:
1. **Domain Expert**: Big 12 rules and regulations
2. **Technical Architecture**: Supabase, Next.js, AI integration
3. **User Experience**: Dashboard design, mobile optimization
4. **Performance**: <3ms targets, 99.9% uptime

### Phase 2: Technical Implementation
[Detailed technical steps with HELiiX-specific patterns]

### Phase 3: Validation & Testing
- Unit tests with Jest
- Integration tests with Supabase
- Performance benchmarks
- Big 12 compliance verification

## Validation Checklist
- [ ] TypeScript strict mode compliance
- [ ] Tailwind components under 300 lines
- [ ] AI response < 3ms benchmark
- [ ] All 16 schools tested
- [ ] FERPA compliance verified
- [ ] Cross-project integration tested
EOF

# Create shared agents
echo ""
echo "🤖 Creating shared HELiiX agents..."

# Context fetcher for HELiiX
cat > "$HOME/.heliix-agent-os/agents/shared/heliix-context-fetcher.md" << 'EOF'
---
name: heliix-context-fetcher
description: Intelligently fetches and extracts HELiiX-specific context across all projects
tools: Read, Grep, Glob
color: blue
---

You are a specialized context retrieval agent for HELiiX projects. Your role is to efficiently fetch relevant information while understanding the unique aspects of each HELiiX platform.

## Core Responsibilities

1. **Smart Context Detection**: Identify which HELiiX project context is needed
2. **Conditional Loading**: Only fetch what's not already in context
3. **Cross-Project Awareness**: Understand shared components across projects
4. **Big 12 Context**: Always include conference-specific information when relevant

## HELiiX Project Knowledge

### HELiiX-OS
- Dual-purpose platform (public site + internal operations)
- Awards, finance, and operations management
- 16 member institutions, 23 sports

### Dox
- Policy management system (191 policies)
- MCP server integration
- PDF manual generation

### Flextime
- Sports scheduling system
- GenAI integration with autonomous agents
- Complex constraint satisfaction

### IRIS
- Incident reporting and suspension management
- Rule engine for 23 sports
- Real-time compliance tracking

## Extraction Patterns

For configuration requests:
```
📄 Retrieved from ~/.heliix-agent-os/standards/[file]

[Relevant section only]
```

For project-specific requests:
```
📄 Retrieved from [project]/CLAUDE.md

[Specific guidelines extracted]
```

## Smart Filters
- Skip sections already discussed in conversation
- Extract only relevant subsections
- Prioritize most recent documentation
- Include performance metrics when discussing optimization
EOF

# Big 12 data validator
cat > "$HOME/.heliix-agent-os/agents/shared/big12-validator.md" << 'EOF'
---
name: big12-validator
description: Validates Big 12 Conference data integrity across all HELiiX systems
tools: Read, Task
color: red
---

You are the Big 12 Conference data validation specialist for HELiiX systems. You ensure all conference data is accurate, complete, and compliant with regulations.

## Validation Responsibilities

### Institution Validation
- Verify all 16 member schools are properly represented
- Check correct abbreviations and branding
- Validate geographic data (time zones, locations)
- Ensure BYU Sunday restrictions are enforced

### Sports Data Validation
- Confirm sport participation by school
- Validate scheduling constraints
- Check travel partner assignments
- Verify championship eligibility

### Compliance Checks
- FERPA compliance for student data
- NCAA regulation adherence
- Conference-specific rule validation
- Financial code accuracy (Account 4105, etc.)

## Validation Patterns

```typescript
// Example validation for school data
interface SchoolValidation {
  hasAllSchools: boolean;        // Must be 16
  brandingCorrect: boolean;       // Official names/logos
  byuRestrictions: boolean;       // No Sunday games
  travelPartnersValid: boolean;   // Sport-specific
}
```

## Common Issues to Check
1. Missing schools in dropdown menus
2. Incorrect sport sponsorship data
3. Invalid financial account codes
4. BYU Sunday scheduling violations
5. Incomplete travel partner configurations
EOF

# Create project-specific agent OS directories
echo ""
echo "📁 Creating project-specific directories..."

# HELiiX-OS
mkdir -p "$HOME/Documents/XII-Ops/HELiiX/.heliix/agent-os/specs"
mkdir -p "$HOME/Documents/XII-Ops/HELiiX/.heliix/agent-os/agents"

# Dox
mkdir -p "$HOME/Documents/XII-Ops/Dox/.heliix/agent-os/specs"
mkdir -p "$HOME/Documents/XII-Ops/Dox/.heliix/agent-os/agents"

# Flextime
mkdir -p "$HOME/Documents/XII-Ops/Flextime/.heliix/agent-os/specs"
mkdir -p "$HOME/Documents/XII-Ops/Flextime/.heliix/agent-os/agents"

# IRIS
mkdir -p "$HOME/Documents/XII-Ops/IRIS/.heliix/agent-os/specs"
mkdir -p "$HOME/Documents/XII-Ops/IRIS/.heliix/agent-os/agents"

# Create symlinks from each project to global Agent OS
echo ""
echo "🔗 Creating symlinks to global configuration..."

# Function to create safe symlinks
create_project_symlinks() {
    local project_dir=$1
    local project_name=$2
    
    # Link to global standards
    if [ ! -e "$project_dir/.heliix/agent-os/standards" ]; then
        ln -s "$HOME/.heliix-agent-os/standards" "$project_dir/.heliix/agent-os/standards"
        echo "  ✓ Linked standards for $project_name"
    fi
    
    # Link to global product docs
    if [ ! -e "$project_dir/.heliix/agent-os/product" ]; then
        ln -s "$HOME/.heliix-agent-os/product" "$project_dir/.heliix/agent-os/product"
        echo "  ✓ Linked product docs for $project_name"
    fi
    
    # Link to shared agents
    if [ ! -e "$project_dir/.heliix/agent-os/agents/shared" ]; then
        ln -s "$HOME/.heliix-agent-os/agents/shared" "$project_dir/.heliix/agent-os/agents/shared"
        echo "  ✓ Linked shared agents for $project_name"
    fi
}

# Create symlinks for each project
create_project_symlinks "/Users/nickw/Documents/XII-Ops/HELiiX" "HELiiX-OS"
create_project_symlinks "/Users/nickw/Documents/XII-Ops/Dox" "Dox"
create_project_symlinks "/Users/nickw/Documents/XII-Ops/Flextime" "Flextime"
create_project_symlinks "/Users/nickw/Documents/XII-Ops/IRIS" "IRIS"

# Create integration script
cat > "$HOME/.heliix-agent-os/integrate-project.sh" << 'EOF'
#!/bin/bash
# Script to integrate Agent OS into a HELiiX project

PROJECT_DIR=$1
if [ -z "$PROJECT_DIR" ]; then
    echo "Usage: ./integrate-project.sh /path/to/project"
    exit 1
fi

echo "Integrating Agent OS into $PROJECT_DIR..."

# Create .heliix directory structure
mkdir -p "$PROJECT_DIR/.heliix/agent-os/specs"
mkdir -p "$PROJECT_DIR/.heliix/agent-os/agents"

# Create symlinks to global config
ln -sf "$HOME/.heliix-agent-os/standards" "$PROJECT_DIR/.heliix/agent-os/standards"
ln -sf "$HOME/.heliix-agent-os/product" "$PROJECT_DIR/.heliix/agent-os/product"
ln -sf "$HOME/.heliix-agent-os/agents/shared" "$PROJECT_DIR/.heliix/agent-os/agents/shared"

echo "✅ Integration complete!"
EOF

chmod +x "$HOME/.heliix-agent-os/integrate-project.sh"

echo ""
echo "✅ HELiiX Agent OS global setup complete!"
echo ""
echo "📍 Global configuration: ~/.heliix-agent-os/"
echo "📍 Project directories: [project]/.heliix/agent-os/"
echo ""
echo "🔗 Symlinks created for:"
echo "   - HELiiX-OS"
echo "   - Dox"
echo "   - Flextime"
echo "   - IRIS"
echo ""
echo "📝 Next steps:"
echo "1. Update each project's CLAUDE.md with Agent OS integration"
echo "2. Enhance PRPs with conditional context loading"
echo "3. Create project-specific agents"
echo "4. Test the integrated workflow"
echo ""
echo "Run specific project setup:"
echo "  bash setup-heliix-project.sh [heliix-os|dox|flextime|iris]"