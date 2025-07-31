# HELiiX Feedback Analysis System Guide

**Last Updated**: 2025-01-31

## Overview

The HELiiX Feedback Analysis System provides comprehensive analysis of user feedback across all platforms using AI-powered insights and trend detection.

## Quick Start

### Basic Usage

```bash
# Analyze all feedback from last week
/analyze-feedback

# Analyze specific source
/analyze-feedback platform day

# Full month analysis
/analyze-feedback all month
```

## Components

### 1. Feedback Analysis Agent (`feedback-analyst`)

- **Location**: `~/.claude/agents/feedback-analyst.md`
- **Purpose**: AI-powered feedback analysis and insight generation
- **Capabilities**:
  - Sentiment analysis with confidence scoring
  - Multi-category classification
  - Theme extraction and pattern recognition
  - Action item generation with priorities
  - Response template creation

### 2. Analysis Command (`/analyze-feedback`)

- **Location**: `~/.claude/commands/analyze-feedback.md`
- **Purpose**: Initiates feedback analysis workflow
- **Parameters**:
  - Source: all, platform, email, support, social, survey, direct
  - Timeframe: day, week, month, quarter

### 3. TypeScript Implementation

- **Location**: `/src/lib/agents/feedback/feedback-analysis-agent.ts`
- **Features**:
  - Pinecone vector storage for similarity search
  - Supabase integration for persistence
  - Multi-provider AI support (Claude, GPT-4)
  - Batch processing capabilities

## Workflow

### Step 1: Collect Feedback

```typescript
const feedback = {
  source: 'platform',
  content: 'User feedback text...',
  userId: 'user123',
  timestamp: new Date().toISOString(),
};
```

### Step 2: Analyze

```bash
/analyze-feedback platform day
```

### Step 3: Review Results

The system generates:

- Sentiment analysis (positive/negative/neutral/mixed)
- Category classification (Feature Request, Bug Report, etc.)
- Priority action items (Urgent, High, Medium, Low)
- Key themes and insights
- Suggested responses

### Step 4: Take Action

- Review generated action items
- Use response templates for user communication
- Track resolution progress
- Monitor sentiment trends

## Analysis Categories

### Primary Categories

1. **Feature Request** - New functionality requests
2. **Bug Report** - Technical issues and errors
3. **Performance Issue** - Speed and efficiency concerns
4. **User Experience** - UI/UX feedback
5. **Documentation** - Help and guide requests

### Secondary Categories

6. **Pricing** - Cost and billing feedback
7. **Integration** - Third-party connection requests
8. **Security** - Safety and privacy concerns
9. **Support** - Customer service feedback
10. **General Feedback** - Other comments

## Priority Levels

### Urgent (🔴)

- System-breaking bugs
- Security vulnerabilities
- Multiple users affected
- Conference deadline impacts

### High (🟠)

- Feature blockers
- Significant UX issues
- Performance degradation
- Compliance concerns

### Medium (🟡)

- Enhancement requests
- Minor bugs
- Documentation updates
- QoL improvements

### Low (🟢)

- Cosmetic issues
- Nice-to-have features
- Long-term suggestions
- General praise

## Output Format

### Executive Summary

```markdown
📊 Feedback Analysis Report - 2025-01-31
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Analyzed: 47 items
Overall Sentiment: Mixed (0.23)
Critical Issues: 3
Immediate Actions: 7
```

### Detailed Analysis

- Sentiment distribution with percentages
- Category breakdown with counts
- Emerging themes and patterns
- Priority action items
- Suggested response templates

## Best Practices

### 1. Regular Analysis

- Run weekly for trend detection
- Monthly deep dives for strategic planning
- Daily checks during critical periods

### 2. Cross-Platform Insights

- Compare feedback across HELiiX-OS, Dox, Flextime, IRIS
- Identify common pain points
- Leverage successful features

### 3. Action Tracking

- Assign owners to action items
- Set realistic timelines
- Follow up on resolutions
- Communicate updates to users

### 4. Response Time Goals

- **Urgent**: Within 2 hours
- **High**: Within 24 hours
- **Medium**: Within 1 week
- **Low**: Within 1 month

## Integration with HELiiX Ecosystem

### HELiiX-OS

- Awards feedback → Award-tracker-agent
- Financial operations → Performance optimization
- Dashboard UX → UI improvements

### Dox

- Policy clarity → Documentation updates
- Search accuracy → MCP server enhancements
- Compliance concerns → Legal review

### Flextime

- Scheduling conflicts → Constraint adjustments
- Performance issues → Algorithm optimization
- Feature requests → Roadmap planning

### IRIS

- Incident reporting → Process improvements
- Suspension accuracy → Rule engine updates
- Notification preferences → Alert customization

## Advanced Features

### Trend Analysis

```bash
# Compare week-over-week
/analyze-feedback all week --compare previous

# Quarterly trends
/analyze-feedback all quarter --trend-analysis
```

### Custom Filtering

```bash
# High-priority negative feedback
/analyze-feedback all week --priority urgent,high --sentiment negative

# Feature requests only
/analyze-feedback all month --category "Feature Request"
```

### Automated Reporting

```bash
# Schedule weekly reports
/analyze-feedback all week --schedule "weekly:monday:9am" --email team@heliix.ai

# Alert on sentiment drops
/analyze-feedback --monitor sentiment --threshold -0.3 --alert slack
```

## Troubleshooting

### Common Issues

1. **No feedback found**
   - Check timeframe parameters
   - Verify source connectivity
   - Ensure proper permissions

2. **Analysis timeout**
   - Reduce batch size
   - Check API keys
   - Verify network connectivity

3. **Incorrect categorization**
   - Review category definitions
   - Update training examples
   - Adjust confidence thresholds

## Security & Privacy

- All feedback is encrypted in transit and at rest
- PII is automatically redacted in reports
- FERPA compliance for student data
- Audit trail for all analyses
- Role-based access control

## Future Enhancements

- Real-time feedback monitoring
- Predictive trend analysis
- Automated response sending
- Integration with ticketing systems
- Multi-language support expansion

---

For questions or support, contact the HELiiX development team or refer to the main documentation.
