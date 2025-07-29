name: "AI Chief Sales Officer - HELiiX AI Solutions"
description: |

## Purpose
Build a comprehensive AI agent that serves as Chief Sales Officer for HELiiX AI Solutions, handling the complete sales process from prospect identification through contract closure for sports conference management clients. This agent will be instrumental in achieving the $1B solo-operated company goal by automating high-value sales activities.

## Core Principles
1. **Context is King**: Include ALL conference industry knowledge, Big 12 success stories, and sports technology expertise
2. **Validation Loops**: Provide measurable sales outcomes and deal progression tracking
3. **Information Dense**: Use sports industry terminology and proven conference management value propositions
4. **Progressive Success**: Start with warm leads, validate approach, then scale to cold outreach

---

## Goal
Create an AI Chief Sales Officer that autonomously manages the entire sales process for HELiiX AI Solutions, targeting NCAA Division I conferences and professional sports organizations. The agent must close $100K+ in contracts within 90 days of deployment while maintaining the personal touch and domain expertise that differentiates HELiiX from competitors.

## Why
- **Business Value**: Enables solo-operated scaling by automating the highest-value business function
- **Competitive Advantage**: Leverages Nick's Big 12 expertise at scale across all prospects
- **Revenue Acceleration**: 24/7 sales capability with instant response to conference inquiries
- **Relationship Building**: Maintains personalized approach while handling multiple prospects simultaneously

## What
An AI agent that:
- Identifies and qualifies prospects in the sports conference market
- Conducts discovery calls and needs assessments
- Creates custom proposals based on conference-specific requirements
- Manages the sales pipeline and deal progression
- Closes contracts and transitions clients to onboarding

### Success Criteria
- [ ] Autonomously qualify 50+ prospects per month
- [ ] Conduct 20+ discovery calls per month via AI voice synthesis
- [ ] Generate 10+ custom proposals per month
- [ ] Close $100K+ in new contracts within 90 days
- [ ] Maintain 95%+ prospect satisfaction scores
- [ ] Achieve 15%+ qualified lead to closed deal conversion rate

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- file: /Users/nickw/Documents/XII-Ops/HELiiX AI Solutions Business Implementation Plan.md
  why: Complete business strategy, pricing models, and target market analysis
  
- file: /Users/nickw/Documents/XII-Ops/Flextime/README.md
  why: Platform capabilities and technical differentiators
  
- file: /Users/nickw/Documents/XII-Ops/HELiiX/README.md
  why: Administrative automation features and Big 12 case studies
  
- path: /Users/nickw/Documents/XII-Ops/HELiiX/
  why: Primary operations repository with all business assets and codebase
  
- url: https://ai.pydantic.dev/agents/
  why: Core agent creation patterns using Pydantic AI
  
- url: https://ai.pydantic.dev/tools/
  why: Tool integration for CRM, email, and scheduling systems
  
- doc: Big 12 Conference Sport Summaries and Scheduling Data
  section: Conference operation pain points and efficiency metrics
  critical: Proven ROI from Flextime and HELiiX implementations
  
- docfile: /Users/nickw/.claude/CLAUDE.md
  why: Big 12 Conference team data, sport specifications, and operational context
```

### Current Business Assets
```bash
# HELiiX AI Solutions Technical Assets
├── Flextime Platform/
│   ├── AI-powered scheduling optimization
│   ├── Travel optimization engines
│   ├── Real-time collaboration features
│   ├── Constraint management systems
│   └── Big 12 Conference production deployment
├── HELiiX Administrative Platform/
│   ├── Policy management automation
│   ├── Awards and compliance tracking
│   ├── Media day coordination
│   ├── Financial dashboard integration
│   └── Big 12 operational workflows
└── Market Position/
    ├── Nick Williams - Director of Competition, Big 12
    ├── Proven ROI with Power 5 conference
    ├── Domain expertise in collegiate athletics
    └── Established industry relationships
```

### Target Market Architecture
```bash
# Primary Sales Targets (Year 1)
├── Power 5 Conferences/
│   ├── SEC Conference (14 schools, $50M+ operations budget)
│   ├── Big Ten Conference (16 schools, complex scheduling needs)
│   ├── ACC Conference (15 schools, geographic optimization focus)
│   ├── Pac-12 Conference (12 schools, travel cost optimization)
│   └── Big 12 Conference (16 schools, existing client - reference)
├── Major Mid-Major Conferences/
│   ├── American Athletic Conference (14 schools)
│   ├── Mountain West Conference (12 schools)
│   ├── Conference USA (14 schools)
│   └── MAC Conference (12 schools)
└── Professional Sports Organizations/
    ├── Minor League Baseball circuits
    ├── G League basketball operations
    ├── Professional soccer leagues
    └── Olympic sport governing bodies
```

### Known Gotchas & Sports Industry Quirks
```python
# CRITICAL: Conference decision-making is committee-based and slow (3-6 month cycles)
# CRITICAL: Budget approvals require AD, business office, and operations alignment
# CRITICAL: Implementation timing must align with academic calendars
# CRITICAL: Each conference has unique policy and operational requirements
# CRITICAL: Travel optimization ROI is highest value proposition (10-30% cost savings)
# CRITICAL: Compliance and documentation are non-negotiable requirements
# CRITICAL: Integration with existing conference systems is essential
# CRITICAL: References from peer conferences are mandatory for credibility
```

## Implementation Blueprint

### Data Models and Structure

```python
# sales_models.py - Core sales data structures
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Enum
from datetime import datetime
from decimal import Decimal

class ConferenceType(str, Enum):
    POWER_5 = "power_5"
    MID_MAJOR = "mid_major"
    PROFESSIONAL = "professional"
    OLYMPIC = "olympic"

class DealStage(str, Enum):
    PROSPECT = "prospect"
    QUALIFIED = "qualified"
    DISCOVERY = "discovery"
    PROPOSAL = "proposal"
    NEGOTIATION = "negotiation"
    CLOSED_WON = "closed_won"
    CLOSED_LOST = "closed_lost"

class Prospect(BaseModel):
    id: str = Field(..., description="Unique prospect identifier")
    conference_name: str = Field(..., description="Official conference name")
    conference_type: ConferenceType
    member_schools: int = Field(..., ge=4, le=20)
    annual_operations_budget: Optional[Decimal] = Field(None, description="Annual ops budget in USD")
    primary_pain_points: List[str] = Field(default_factory=list)
    decision_makers: List[Dict[str, str]] = Field(default_factory=list)
    current_technology_stack: List[str] = Field(default_factory=list)
    geographic_footprint: str = Field(..., description="Primary geographic region")
    
class SalesOpportunity(BaseModel):
    id: str = Field(..., description="Unique opportunity identifier")
    prospect: Prospect
    deal_stage: DealStage
    estimated_value: Decimal = Field(..., ge=25000, le=500000)
    probability: float = Field(..., ge=0.0, le=1.0)
    expected_close_date: datetime
    services_interested: List[str] = Field(..., description="Flextime, HELiiX, Custom AI")
    discovery_notes: str = Field("", description="Key insights from discovery calls")
    competitive_landscape: List[str] = Field(default_factory=list)
    proposal_sent_date: Optional[datetime] = None
    last_activity_date: datetime = Field(default_factory=datetime.utcnow)

class ProposalTemplate(BaseModel):
    conference_type: ConferenceType
    service_tier: str = Field(..., description="Basic, Standard, Premium")
    annual_pricing: Decimal
    implementation_timeline: str
    key_features: List[str]
    roi_projections: Dict[str, str]
    case_studies: List[str]
    
class SalesCall(BaseModel):
    opportunity_id: str
    call_date: datetime
    attendees: List[str]
    call_type: str = Field(..., description="Discovery, Demo, Proposal, Negotiation")
    duration_minutes: int
    key_discussion_points: List[str]
    next_steps: List[str]
    decision_maker_engagement: str = Field(..., description="High, Medium, Low")
    follow_up_date: datetime
```

### List of Tasks to Complete

```yaml
Task 1: Sales Intelligence and Prospect Research System
CREATE agents/sales_intelligence_agent.py:
  - PATTERN: Multi-source data aggregation like HELiiX analytics
  - Build conference database with operational and financial data
  - Monitor industry news and conference announcements
  - Identify expansion opportunities and personnel changes
  - Track competitive intelligence and market dynamics

Task 2: Lead Qualification and Scoring Engine
CREATE tools/lead_qualification.py:
  - PATTERN: Follow constraint evaluation patterns from Flextime
  - Implement BANT (Budget, Authority, Need, Timeline) qualification
  - Score prospects based on conference size, budget, and pain points
  - Prioritize leads based on likelihood to close and deal size
  - Integrate with existing conference management expertise

Task 3: AI-Powered Discovery Call System
CREATE agents/discovery_call_agent.py:
  - PATTERN: Use conversational AI patterns from customer service
  - Conduct voice-based discovery calls via AI synthesis
  - Ask structured questions about current challenges and needs
  - Identify technical requirements and integration points
  - Generate detailed discovery summaries and next step recommendations

Task 4: Custom Proposal Generation Engine
CREATE tools/proposal_generator.py:
  - PATTERN: Template system similar to HELiiX policy management
  - Generate conference-specific proposals with custom pricing
  - Include relevant case studies and ROI projections
  - Integrate Flextime and HELiiX capability demonstrations
  - Automate proposal delivery and follow-up sequences

Task 5: Deal Management and Pipeline Tracking
CREATE agents/deal_management_agent.py:
  - PATTERN: Workflow automation like HELiiX administrative processes
  - Track deal progression through sales stages
  - Automate follow-up communications and reminders
  - Manage competitive threats and objection handling
  - Coordinate with technical teams for demo and proof-of-concept requests

Task 6: Contract Negotiation and Closing Automation
CREATE tools/contract_negotiation.py:
  - PATTERN: Policy and compliance automation from HELiiX
  - Handle standard contract terms and pricing negotiations
  - Escalate complex negotiations to human oversight
  - Generate master service agreements and SOWs
  - Coordinate legal review and signature processes

Task 7: CRM Integration and Sales Analytics
CREATE tools/crm_integration.py:
  - PATTERN: Data synchronization patterns from Flextime
  - Integrate with Salesforce or similar CRM platform
  - Generate sales reports and pipeline analytics
  - Track conversion metrics and performance KPIs
  - Provide predictive analytics for deal closure
```

### Per Task Pseudocode

```python
# Task 1: Sales Intelligence Agent
class SalesIntelligenceAgent:
    async def research_conference_market(self, focus_area: str) -> MarketIntelligence:
        # PATTERN: Use research methodologies from Big 12 analysis
        market_data = await self.gather_market_intelligence()
        
        # CRITICAL: Sports industry moves in annual cycles - time prospecting appropriately
        seasonal_timing = self.analyze_budget_cycles()
        
        # GOTCHA: Conference realignment creates opportunities and threats
        realignment_impact = await self.monitor_realignment_news()
        
        return MarketIntelligence(
            target_prospects=market_data.high_value_targets,
            timing_recommendations=seasonal_timing,
            competitive_threats=market_data.competitor_activity
        )

# Task 3: Discovery Call Agent with Voice Synthesis
@discovery_agent.tool
async def conduct_discovery_call(
    ctx: RunContext[SalesDependencies],
    prospect: Prospect,
    conference_contact: ConferenceContact
) -> DiscoveryResult:
    """Conduct AI-powered discovery call with conference leadership."""
    
    # PATTERN: Use conference expertise from Nick's Big 12 experience
    call_framework = build_conference_discovery_framework(prospect.conference_type)
    
    # CRITICAL: Conference leaders expect domain expertise - reference industry knowledge
    conversation_context = f"""
    I'm calling on behalf of HELiiX AI Solutions. We've helped the Big 12 Conference 
    optimize their scheduling and operations with significant ROI. Based on your 
    conference's {prospect.member_schools} member schools and {prospect.geographic_footprint} 
    footprint, I'd like to understand your current operational challenges.
    """
    
    # GOTCHA: Athletic administrators are time-constrained - keep discovery focused
    discovery_questions = [
        "What are your biggest scheduling and operational pain points?",
        "How much time does your staff spend on manual scheduling tasks?",
        "What's your current travel budget and how important is optimization?",
        "When do you typically evaluate new technology partnerships?"
    ]
    
    call_result = await voice_ai_service.conduct_call(
        contact=conference_contact,
        context=conversation_context,
        questions=discovery_questions,
        max_duration_minutes=30
    )
    
    return process_discovery_insights(call_result, prospect)

# Task 4: Proposal Generation with Conference Expertise
async def generate_custom_proposal(
    opportunity: SalesOpportunity,
    discovery_insights: DiscoveryResult
) -> ProposalDocument:
    # PATTERN: Use template customization like HELiiX policy management
    base_template = get_conference_proposal_template(opportunity.prospect.conference_type)
    
    # CRITICAL: ROI projections must be conference-specific and conservative
    roi_calculator = ConferenceROICalculator(
        member_schools=opportunity.prospect.member_schools,
        current_travel_budget=discovery_insights.travel_budget,
        manual_hours_per_week=discovery_insights.admin_time
    )
    
    # Big 12 case study integration - proven results with similar conference
    case_study_data = {
        "reference_conference": "Big 12 Conference",
        "member_schools": 16,
        "implementation_timeline": "4 months",
        "achieved_roi": "23% travel cost reduction, 40% admin time savings",
        "satisfied_stakeholders": ["Athletic Directors", "Operations Staff", "Financial Teams"]
    }
    
    custom_proposal = base_template.customize(
        prospect=opportunity.prospect,
        roi_projections=roi_calculator.calculate_savings(),
        case_study=case_study_data,
        pricing_tier=determine_pricing_tier(opportunity),
        implementation_plan=create_implementation_roadmap(discovery_insights)
    )
    
    return custom_proposal
```

### Integration Points
```yaml
CRM_SYSTEM:
  - platform: "Salesforce or HubSpot"
  - integration: "REST API with OAuth2 authentication"
  - sync: "Bidirectional prospect and opportunity data"
  
EMAIL_AUTOMATION:
  - service: "SendGrid or Mailchimp"
  - templates: "Conference-specific outreach sequences"
  - tracking: "Open rates, click-through, and response analytics"
  
VOICE_AI:
  - provider: "ElevenLabs or Synthesia"
  - capability: "Natural conversation with conference executives"
  - integration: "Calendar scheduling and call recording"
  
PROPOSAL_SYSTEM:
  - generator: "Custom PDF generation with conference branding"
  - templates: "Service tier templates with ROI calculators"
  - delivery: "Automated email delivery with tracking"
  
ANALYTICS_DASHBOARD:
  - platform: "Integration with existing HELiiX dashboard"
  - metrics: "Pipeline velocity, conversion rates, revenue forecasting"
  - reporting: "Weekly sales summaries and performance alerts"
```

## Validation Loop

### Level 1: Sales Process Validation
```bash
# Validate prospect identification and qualification
python -m agents.sales_intelligence_agent --validate-prospect-database
python -m tools.lead_qualification --test-scoring-algorithm

# Expected: Accurate conference data with proper qualification scores
```

### Level 2: Communication and Proposal Testing
```python
# Test discovery call automation
async def test_discovery_call_simulation():
    """Test AI discovery call with mock conference contact"""
    mock_prospect = create_test_prospect("Mountain West Conference")
    mock_contact = ConferenceContact(
        name="Test Athletic Director",
        email="test@mountainwest.org",
        phone="+1-555-0123"
    )
    
    result = await discovery_agent.conduct_call(mock_prospect, mock_contact)
    
    assert result.pain_points_identified >= 3
    assert result.budget_range_qualified is True
    assert result.next_step_scheduled is True
    assert result.call_quality_score >= 8.0

# Test proposal generation accuracy
def test_proposal_customization():
    """Test proposal customization for different conference types"""
    power5_opportunity = create_test_opportunity("SEC Conference", ConferenceType.POWER_5)
    proposal = generate_custom_proposal(power5_opportunity)
    
    assert proposal.pricing_tier == "Premium"
    assert "Big 12 Conference" in proposal.case_studies
    assert proposal.roi_projection >= 0.15  # 15% minimum ROI
    assert proposal.implementation_timeline <= 180  # days
```

### Level 3: End-to-End Sales Process Integration
```bash
# Test complete sales cycle with real prospect data
python -m sales_agent_test --conference="Mountain West" --simulate-full-cycle

# Expected interaction flow:
# 1. Prospect qualification (automated research)
# 2. Outreach email sent with Big 12 case study
# 3. Discovery call scheduled and conducted
# 4. Custom proposal generated and delivered
# 5. Follow-up sequence initiated
# 6. Deal progression tracked in CRM

# Validate against Big 12 success metrics
python -m validation.sales_metrics --compare-to-reference
```

## Final Validation Checklist
- [ ] All prospect qualification tests pass: `pytest tests/test_sales_intelligence.py -v`
- [ ] Discovery call AI achieves >8.0 quality scores
- [ ] Proposal generation includes accurate ROI projections
- [ ] CRM integration maintains data consistency
- [ ] End-to-end sales cycle completes in <30 days for qualified prospects
- [ ] Conference industry terminology and expertise validated by Nick Williams
- [ ] Big 12 case study integration verified for accuracy
- [ ] Compliance with sports industry communication standards

---

## Anti-Patterns to Avoid
- ❌ Don't use generic business sales tactics - conferences need industry expertise
- ❌ Don't skip the committee-based decision process - multiple stakeholders required
- ❌ Don't underestimate implementation timelines - academic calendar constraints are real
- ❌ Don't oversell capabilities - conservative ROI projections build trust
- ❌ Don't ignore compliance requirements - documentation and audit trails are critical
- ❌ Don't rush the sales cycle - conferences make decisions deliberately
- ❌ Don't neglect the technical proof-of-concept - platform demonstrations are essential

## Confidence Score: 9/10

High confidence due to:
- Clear understanding of sports conference market dynamics
- Proven success with Big 12 Conference as reference client
- Established technical platforms (Flextime/HELiiX) with demonstrated ROI
- Nick's domain expertise providing competitive differentiation
- Well-defined target market with specific operational pain points

Minor uncertainty on AI voice synthesis adoption by conference executives, but email-first approach provides fallback strategy.