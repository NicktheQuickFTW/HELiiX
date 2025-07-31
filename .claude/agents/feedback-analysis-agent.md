name: "Global Feedback Analysis Agent - HELiiX-OS"
description: |

## Purpose

Build a comprehensive AI agent that analyzes feedback across all HELiiX-OS touchpoints - from platform users, support tickets, social media, surveys, and direct communications. This agent will provide real-time insights, sentiment analysis, and actionable recommendations to continuously improve the platform and Big 12 Conference operations.

## Core Principles

1. **Context is King**: Include ALL platform features, Big 12 operations, and user interaction patterns
2. **Validation Loops**: Provide measurable feedback metrics and improvement tracking
3. **Information Dense**: Use conference operations terminology and platform-specific contexts
4. **Progressive Success**: Start with platform feedback, validate insights, then expand to social listening

---

## Goal

Create a Global Feedback Analysis Agent that autonomously collects, analyzes, and synthesizes feedback from all HELiiX-OS users (Big 12 staff, athletic departments, administrators) to identify improvement opportunities, detect issues early, and drive platform enhancements. The agent must process 1,000+ feedback items monthly while maintaining 95%+ accuracy in sentiment and categorization.

## Why

- **User Satisfaction**: Proactively address user concerns before they escalate
- **Platform Evolution**: Data-driven feature development based on actual user needs
- **Operational Excellence**: Identify process improvements from user experiences
- **Competitive Advantage**: Rapid response to conference needs maintains market leadership
- **Risk Mitigation**: Early detection of issues prevents user churn and reputation damage

## What

An AI agent that:

- Collects feedback from multiple sources (platform, email, support, surveys)
- Analyzes sentiment, themes, and priority levels
- Categorizes feedback by platform module and operational area
- Generates actionable insights and recommendations
- Tracks resolution and improvement metrics
- Creates executive summaries and trend reports

### Success Criteria

- [ ] Process 1,000+ feedback items monthly with 95%+ accuracy
- [ ] Achieve <2 hour response time for urgent feedback
- [ ] Generate weekly insight reports with actionable recommendations
- [ ] Maintain 90%+ user satisfaction through proactive improvements
- [ ] Reduce support ticket volume by 30% through preemptive fixes
- [ ] Identify 10+ platform enhancement opportunities monthly

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- file: /Users/nickw/Documents/XII-Ops/HELiiX/CLAUDE.md
  why: Platform architecture, features, and operational context

- file: /Users/nickw/Documents/XII-Ops/HELiiX/README.md
  why: Complete platform overview and Big 12 integration details

- file: /Users/nickw/.claude/CLAUDE.md
  why: Big 12 Conference structure, teams, and operational requirements

- path: /Users/nickw/Documents/XII-Ops/HELiiX/src/
  why: Platform codebase for understanding feature implementations

- file: /Users/nickw/Documents/XII-Ops/HELiiX/docs/big12-sport-policies/
  why: Conference policies that generate user feedback

- url: https://ai.pydantic.dev/agents/
  why: Agent development patterns and best practices

- doc: Big 12 Conference Operational Workflows
  section: User touchpoints and feedback channels
  critical: Understanding where feedback originates
```

### Platform Architecture & Feedback Sources

```bash
# HELiiX-OS Feedback Sources
├── Platform Modules/
│   ├── Awards Management (1,250+ items tracked)
│   ├── Financial Operations ($126.2M+ distributions)
│   ├── FlexTime Scheduling (2,437+ games)
│   ├── Policy Management (147 documents)
│   ├── Weather Command Center (16 campuses)
│   └── AI Assistant Interface
├── User Types/
│   ├── Conference Administrators
│   ├── Athletic Directors
│   ├── Operations Staff
│   ├── Financial Teams
│   ├── Compliance Officers
│   └── Sport Administrators
└── Feedback Channels/
    ├── In-platform feedback widgets
    ├── Support ticket system
    ├── Email communications
    ├── User surveys
    ├── Social media mentions
    └── Direct stakeholder meetings
```

### Big 12 Operational Context

```bash
# Conference Structure Impacting Feedback
├── 16 Member Institutions/
│   ├── Diverse geographic footprint
│   ├── Varying technical sophistication
│   ├── Different operational priorities
│   └── Unique policy requirements
├── 23 Different Sports/
│   ├── Sport-specific scheduling needs
│   ├── Unique compliance requirements
│   ├── Varying championship formats
│   └── Different stakeholder groups
└── Key Operational Areas/
    ├── Championship Management
    ├── Travel Optimization
    ├── Budget Distribution
    ├── Award Ceremonies
    └── Media Day Coordination
```

### Known Feedback Patterns & User Behaviors

```python
# CRITICAL: Conference users have specific feedback patterns
# CRITICAL: Athletic departments prioritize scheduling and travel feedback
# CRITICAL: Financial teams focus on budget and distribution accuracy
# CRITICAL: Compliance officers emphasize policy and documentation
# CRITICAL: Peak feedback periods align with sports seasons
# CRITICAL: Urgent feedback often relates to game scheduling conflicts
# CRITICAL: User satisfaction directly impacts conference operations
# CRITICAL: Feedback quality varies by user technical proficiency
```

## Implementation Blueprint

### Data Models and Structure

```python
# feedback_models.py - Core feedback data structures
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Literal
from datetime import datetime
from enum import Enum

class FeedbackSource(str, Enum):
    PLATFORM = "platform"
    EMAIL = "email"
    SUPPORT = "support"
    SOCIAL = "social"
    SURVEY = "survey"
    DIRECT = "direct"

class PlatformModule(str, Enum):
    AWARDS = "awards_management"
    FINANCIAL = "financial_operations"
    FLEXTIME = "flextime_scheduling"
    POLICY = "policy_management"
    WEATHER = "weather_center"
    AI_ASSISTANT = "ai_assistant"
    ANALYTICS = "analytics_dashboard"
    GENERAL = "general_platform"

class UserRole(str, Enum):
    CONFERENCE_ADMIN = "conference_admin"
    ATHLETIC_DIRECTOR = "athletic_director"
    OPERATIONS_STAFF = "operations_staff"
    FINANCIAL_TEAM = "financial_team"
    COMPLIANCE_OFFICER = "compliance_officer"
    SPORT_ADMIN = "sport_admin"

class Sentiment(str, Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"
    MIXED = "mixed"

class Priority(str, Enum):
    URGENT = "urgent"  # Blocking operations
    HIGH = "high"      # Impacting efficiency
    MEDIUM = "medium"  # Enhancement request
    LOW = "low"        # Nice to have

class Feedback(BaseModel):
    id: str = Field(..., description="Unique feedback identifier")
    source: FeedbackSource
    content: str = Field(..., description="Raw feedback content")
    user_id: Optional[str] = None
    user_email: Optional[str] = None
    user_name: Optional[str] = None
    user_role: Optional[UserRole] = None
    school_affiliation: Optional[str] = None
    platform_module: Optional[PlatformModule] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Dict[str, any] = Field(default_factory=dict)

class FeedbackAnalysis(BaseModel):
    feedback_id: str
    sentiment: Sentiment
    sentiment_score: float = Field(..., ge=-1.0, le=1.0)
    sentiment_confidence: float = Field(..., ge=0.0, le=1.0)
    priority: Priority
    categories: List[str] = Field(..., description="Feature areas affected")
    themes: List[str] = Field(..., description="Key themes identified")
    platform_modules: List[PlatformModule]
    action_items: List[Dict[str, str]]
    summary: str = Field(..., max_length=500)
    key_insights: List[str]
    related_feedback_ids: List[str] = Field(default_factory=list)
    suggested_responses: Optional[List[str]] = None
    resolution_estimate: Optional[str] = None

class FeedbackTrend(BaseModel):
    period: str = Field(..., description="day, week, month, season")
    total_feedback: int
    sentiment_distribution: Dict[Sentiment, int]
    top_categories: List[Dict[str, int]]
    emerging_themes: List[str]
    priority_breakdown: Dict[Priority, int]
    module_distribution: Dict[PlatformModule, int]
    user_role_distribution: Dict[UserRole, int]
    actionable_insights: List[str]
```

### List of Tasks to Complete

```yaml
Task 1: Multi-Source Feedback Collection System
CREATE agents/feedback_collector.py:
  - PATTERN: Event-driven collection like HELiiX real-time updates
  - Monitor in-platform feedback widgets and forms
  - Process support ticket submissions via API
  - Parse email feedback from conference users
  - Aggregate survey responses from TypeForm/Google Forms
  - Track social media mentions of HELiiX/Big 12 operations

Task 2: Intelligent Sentiment Analysis Engine
CREATE tools/sentiment_analyzer.py:
  - PATTERN: Use Claude's nuanced understanding for sports context
  - Analyze sentiment with conference-specific terminology
  - Detect urgency based on operational impact
  - Identify emotional tone and frustration levels
  - Consider Big 12 cultural and regional contexts

Task 3: Feedback Categorization and Tagging
CREATE agents/feedback_categorizer.py:
  - PATTERN: Multi-label classification like policy management
  - Map feedback to specific platform modules
  - Identify affected user workflows
  - Tag with relevant sports and operations
  - Link to specific conference schools when applicable

Task 4: Theme Extraction and Pattern Recognition
CREATE tools/theme_extractor.py:
  - PATTERN: Aggregate analysis like championship analytics
  - Identify recurring themes across feedback
  - Detect emerging issues before they escalate
  - Recognize seasonal patterns (pre-season, championships)
  - Track feature request trends

Task 5: Priority and Impact Assessment
CREATE agents/priority_assessor.py:
  - PATTERN: Constraint evaluation from FlexTime
  - Assess operational impact on conference activities
  - Calculate affected user count and roles
  - Determine urgency based on event timelines
  - Consider compliance and policy implications

Task 6: Actionable Insights Generator
CREATE tools/insights_generator.py:
  - PATTERN: Report generation like financial dashboards
  - Create specific, actionable recommendations
  - Generate implementation roadmaps
  - Estimate resource requirements
  - Provide success metrics and KPIs

Task 7: Feedback Loop and Resolution Tracking
CREATE agents/resolution_tracker.py:
  - PATTERN: Workflow automation like awards tracking
  - Monitor feedback resolution status
  - Track improvement implementation
  - Measure user satisfaction post-resolution
  - Generate follow-up communications

Task 8: Executive Reporting and Dashboards
CREATE tools/executive_reporter.py:
  - PATTERN: Dashboard creation like operations center
  - Generate weekly insight summaries
  - Create trend visualizations
  - Highlight critical issues for leadership
  - Provide competitive intelligence from feedback
```

### Per Task Pseudocode

```python
# Task 1: Multi-Source Feedback Collector
class FeedbackCollector:
    async def collect_platform_feedback(self) -> List[Feedback]:
        # PATTERN: Real-time collection like weather monitoring
        feedback_sources = {
            'platform_widgets': await self.get_widget_submissions(),
            'support_tickets': await self.fetch_zendesk_tickets(),
            'email_feedback': await self.parse_feedback_emails(),
            'survey_responses': await self.aggregate_surveys()
        }

        # CRITICAL: Conference users often provide feedback during events
        if self.is_championship_season():
            feedback_sources['event_feedback'] = await self.collect_event_feedback()

        # GOTCHA: Different schools have different communication preferences
        normalized_feedback = self.normalize_feedback_formats(feedback_sources)

        return self.enrich_with_user_context(normalized_feedback)

# Task 2: Sentiment Analysis with Conference Context
@sentiment_analyzer.tool
async def analyze_feedback_sentiment(
    ctx: RunContext[FeedbackDependencies],
    feedback: Feedback
) -> SentimentAnalysis:
    """Analyze sentiment with Big 12 operational context."""

    # PATTERN: Use conference-specific terminology understanding
    context_prompt = f"""
    Analyze this feedback from a {feedback.user_role} at {feedback.school_affiliation}.
    Consider Big 12 Conference operational context where:
    - "Travel costs" often indicates budget pressure
    - "Scheduling conflicts" suggests FlexTime optimization needs
    - "Policy confusion" requires documentation clarity
    - "System slow" during championships is critical

    Feedback: {feedback.content}
    """

    # CRITICAL: Athletic department feedback often uses sport-specific jargon
    sentiment_result = await ctx.deps.claude.analyze_sentiment(
        text=feedback.content,
        context=context_prompt,
        domain="collegiate_athletics"
    )

    # GOTCHA: Neutral sentiment might indicate confusion, not satisfaction
    if sentiment_result.sentiment == "neutral" and "unclear" in feedback.content.lower():
        sentiment_result.requires_clarification = True

    return sentiment_result

# Task 5: Priority Assessment for Conference Operations
async def assess_feedback_priority(
    feedback: Feedback,
    analysis: FeedbackAnalysis
) -> Priority:
    # PATTERN: Operational impact assessment like FlexTime constraints

    impact_factors = {
        'affects_live_event': 10,  # Ongoing games/championships
        'blocks_financial_process': 9,  # Distribution deadlines
        'compliance_risk': 8,  # NCAA/Conference policy violations
        'multi_school_impact': 7,  # Affects multiple institutions
        'scheduling_conflict': 6,  # FlexTime optimization issues
        'user_efficiency': 5,  # Time-consuming workarounds
        'feature_request': 3,  # Enhancement opportunities
        'documentation': 2  # Clarity improvements
    }

    # CRITICAL: Championship season feedback gets priority boost
    if is_championship_season() and feedback.platform_module == PlatformModule.FLEXTIME:
        impact_factors['scheduling_conflict'] = 9

    # Calculate priority score
    priority_score = calculate_impact_score(feedback, analysis, impact_factors)

    if priority_score >= 8:
        return Priority.URGENT
    elif priority_score >= 6:
        return Priority.HIGH
    elif priority_score >= 4:
        return Priority.MEDIUM
    else:
        return Priority.LOW

# Task 6: Generate Conference-Specific Insights
class InsightsGenerator:
    async def generate_actionable_insights(
        self,
        feedback_batch: List[FeedbackAnalysis],
        timeframe: str
    ) -> List[ActionableInsight]:
        # PATTERN: Aggregate analysis like Big 12 analytics dashboards

        # Group by platform module and theme
        module_themes = self.group_by_module_and_theme(feedback_batch)

        insights = []
        for module, themes in module_themes.items():
            # CRITICAL: FlexTime insights during scheduling windows
            if module == PlatformModule.FLEXTIME and self.is_scheduling_window():
                insight = ActionableInsight(
                    module=module,
                    title=f"FlexTime Optimization Opportunities - {len(themes)} themes",
                    description=self.summarize_scheduling_feedback(themes),
                    action_items=[
                        "Review constraint relaxation for non-conference games",
                        "Optimize travel groupings for Western schools",
                        "Add bulk rescheduling for weather delays"
                    ],
                    priority=Priority.HIGH,
                    estimated_impact="30% reduction in manual schedule adjustments",
                    implementation_effort="2-3 sprint cycles"
                )
                insights.append(insight)

            # GOTCHA: Financial feedback spikes during distribution periods
            elif module == PlatformModule.FINANCIAL and self.is_distribution_period():
                insight = self.generate_financial_insights(themes)
                insights.append(insight)

        return self.prioritize_insights(insights)
```

### Integration Points

```yaml
FEEDBACK_SOURCES:
  - platform_api: 'HELiiX-OS feedback widgets and forms'
  - support_system: 'Zendesk or Freshdesk API integration'
  - email_parser: 'Gmail API for feedback@heliix.com'
  - survey_tools: 'TypeForm, Google Forms, SurveyMonkey APIs'
  - social_monitoring: 'X (Twitter) API for @Big12Conference mentions'

ANALYSIS_INFRASTRUCTURE:
  - vector_store: 'Pinecone for semantic feedback search'
  - llm_providers: 'Claude for nuanced analysis, GPT-4 for categorization'
  - database: 'Supabase for feedback storage and analytics'
  - cache: 'Redis for real-time aggregation'

REPORTING_SYSTEMS:
  - dashboards: 'Integration with HELiiX-OS operations dashboard'
  - alerts: 'Slack/Teams for urgent feedback notifications'
  - email_reports: 'Weekly summaries to conference leadership'
  - api_endpoints: 'REST API for external integrations'

RESOLUTION_TRACKING:
  - jira_integration: 'Create and track improvement tickets'
  - github_issues: 'Link feedback to platform enhancements'
  - communication: 'Automated follow-up emails to users'
```

## Validation Loop

### Level 1: Feedback Processing Validation

```bash
# Test feedback collection from all sources
python -m agents.feedback_collector --test-all-sources

# Validate sentiment analysis accuracy
python -m tools.sentiment_analyzer --validate-conference-context

# Expected: 95%+ accuracy on labeled conference feedback dataset
```

### Level 2: Analysis and Categorization Testing

```python
# Test with real Big 12 feedback scenarios
async def test_conference_feedback_analysis():
    """Test analysis with actual conference use cases"""

    test_feedback = [
        Feedback(
            content="FlexTime won't let us schedule baseball doubleheaders on Sundays",
            user_role=UserRole.SPORT_ADMIN,
            platform_module=PlatformModule.FLEXTIME,
            school_affiliation="Baylor"
        ),
        Feedback(
            content="Financial distribution report missing line items for bowl revenue",
            user_role=UserRole.FINANCIAL_TEAM,
            platform_module=PlatformModule.FINANCIAL,
            school_affiliation="Oklahoma State"
        )
    ]

    for feedback in test_feedback:
        analysis = await feedback_analyzer.analyze(feedback)

        assert analysis.sentiment in [Sentiment.NEGATIVE, Sentiment.MIXED]
        assert analysis.priority in [Priority.HIGH, Priority.URGENT]
        assert len(analysis.action_items) >= 1
        assert analysis.platform_modules[0] == feedback.platform_module

# Test theme extraction across feedback batch
def test_theme_extraction():
    """Test pattern recognition in feedback batches"""
    feedback_batch = load_test_feedback_batch("championship_season")
    themes = theme_extractor.extract_themes(feedback_batch)

    assert "scheduling_conflicts" in themes
    assert "travel_optimization" in themes
    assert len(themes) >= 5
```

### Level 3: End-to-End Insight Generation

```bash
# Test complete feedback analysis pipeline
python -m feedback_agent_test --simulate-weekly-batch

# Expected flow:
# 1. Collect 200+ feedback items from all sources
# 2. Analyze sentiment and categorize by module
# 3. Extract themes and identify patterns
# 4. Generate 10+ actionable insights
# 5. Create executive summary with visualizations
# 6. Track resolution and user satisfaction

# Validate against Big 12 operational metrics
python -m validation.feedback_metrics --compare-to-baseline
```

## Final Validation Checklist

- [ ] All feedback sources successfully integrated: `pytest tests/test_feedback_sources.py -v`
- [ ] Sentiment analysis achieves 95%+ accuracy on conference feedback
- [ ] Categorization correctly maps to platform modules
- [ ] Theme extraction identifies known operational patterns
- [ ] Priority assessment aligns with conference urgency levels
- [ ] Insights include specific, actionable recommendations
- [ ] Executive reports highlight critical issues effectively
- [ ] Resolution tracking closes feedback loop successfully

---

## Anti-Patterns to Avoid

- ❌ Don't treat all feedback equally - conference operations have clear priorities
- ❌ Don't ignore seasonal patterns - championships create unique feedback spikes
- ❌ Don't oversimplify sentiment - athletic departments express frustration differently
- ❌ Don't delay urgent feedback - game-day issues need immediate attention
- ❌ Don't aggregate without context - school-specific feedback matters
- ❌ Don't generate generic insights - recommendations must be Big 12 specific
- ❌ Don't skip follow-up - conference users expect resolution communication

## Confidence Score: 9.5/10

High confidence due to:

- Clear understanding of HELiiX-OS platform architecture and modules
- Deep knowledge of Big 12 Conference operations and user types
- Established feedback patterns from athletic department workflows
- Proven integration points with existing platform infrastructure
- Well-defined success metrics aligned with conference goals

Slight uncertainty only on social media sentiment accuracy for sports-specific terminology, but platform feedback provides primary signal.
