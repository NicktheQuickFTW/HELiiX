name: "Disciplinary Action Tracking & Reporting Agent - HELiiX-OS"
description: |

## Purpose

Build a comprehensive AI-powered system for tracking, analyzing, and reporting all disciplinary actions (ejections, red cards, yellow cards, technical fouls) across all Big 12 Conference sports. This agent ensures compliance with conference and NCAA regulations, manages suspension protocols, and provides real-time reporting for athletic departments and conference administrators.

## Core Principles

1. **Context is King**: Include ALL sport-specific rules, conference policies, and NCAA regulations
2. **Validation Loops**: Provide real-time verification of disciplinary actions and suspension calculations
3. **Information Dense**: Use official terminology from each sport's rulebook and conference regulations
4. **Progressive Success**: Start with major sports (football/basketball), validate accuracy, then expand to all 23 sports

---

## Goal

Create a Disciplinary Action Tracking Agent that automatically captures, categorizes, and reports all player/coach ejections and card infractions across Big 12 sports. The system must maintain 100% accuracy for suspension calculations, provide instant notifications to affected schools, and generate compliance reports for conference and NCAA requirements.

## Why

- **Compliance Critical**: NCAA and conference rules require precise tracking and reporting
- **Player Safety**: Ensures proper enforcement of safety-related suspensions
- **Competitive Integrity**: Prevents ineligible player participation
- **Operational Efficiency**: Eliminates manual tracking across 16 schools and 23 sports
- **Legal Protection**: Provides audit trail for disciplinary decisions
- **Real-time Communication**: Instant notifications prevent compliance violations

## What

An AI agent that:

- Captures disciplinary actions from game reports and officials
- Categorizes infractions by sport, severity, and rule violated
- Calculates automatic suspensions based on sport-specific rules
- Notifies schools, conference office, and media relations
- Tracks cumulative infractions for season-long patterns
- Generates compliance reports and appeal documentation
- Integrates with FlexTime for future game eligibility

### Success Criteria

- [ ] 100% accuracy in suspension calculations across all sports
- [ ] <15 minute notification time from infraction to school alert
- [ ] Track 500+ disciplinary actions per season without errors
- [ ] Generate weekly compliance reports for all 16 schools
- [ ] Integrate with 23 different sport rulebooks and policies
- [ ] Provide real-time dashboard for conference administrators
- [ ] Support appeal process with complete documentation

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- file: /Users/nickw/Documents/XII-Ops/HELiiX/CLAUDE.md
  why: Platform architecture and Big 12 Conference structure

- file: /Users/nickw/.claude/CLAUDE.md
  why: Complete Big 12 school and sport listings with team counts

- path: /Users/nickw/Documents/XII-Ops/HELiiX/docs/big12-sport-policies/
  why: Sport-specific rules and disciplinary procedures

- file: /Users/nickw/Documents/XII-Ops/HELiiX/docs/big12-sport-policies/big12-football-policies.md
  section: Ejection and suspension rules
  critical: Football-specific targeting and fighting penalties

- file: /Users/nickw/Documents/XII-Ops/HELiiX/docs/big12-sport-policies/big12-basketball-policies.md
  section: Technical foul accumulation and ejection rules
  critical: Basketball flagrant foul classifications

- file: /Users/nickw/Documents/XII-Ops/HELiiX/docs/big12-sport-policies/big12-soccer-policies.md
  section: Red and yellow card accumulation rules
  critical: Soccer-specific suspension calculations

- url: https://www.ncaa.org/sports/2024/2/7/playing-rules.aspx
  why: NCAA playing rules for suspension requirements

- doc: Big 12 Conference Code of Conduct
  section: Disciplinary procedures and appeal processes
  critical: Conference-specific suspension additions
```

### Sport-Specific Disciplinary Rules Matrix

```bash
# Big 12 Sports Disciplinary Structure
├── Contact Sports (Ejection-based)/
│   ├── Football (16 teams)
│   │   ├── Targeting: Automatic next-game suspension
│   │   ├── Fighting: 1-3 game suspension
│   │   └── Two unsportsmanlike: Ejection + review
│   ├── Wrestling (14 teams)
│   │   ├── Flagrant misconduct: Multi-match suspension
│   │   └── Unsportsmanlike accumulation
│   └── Lacrosse (6 teams)
│       ├── 5-minute major accumulation
│       └── Fighting majors
├── Court/Field Sports (Foul accumulation)/
│   ├── Basketball M/W (16 teams each)
│   │   ├── Flagrant 2: Ejection + 1 game
│   │   ├── Technical accumulation (5 = 1 game)
│   │   └── Fighting: Minimum 3 games
│   ├── Volleyball (15 teams)
│   │   ├── Red card: Match ejection
│   │   └── Accumulation rules
│   └── Baseball/Softball (14/11 teams)
│       ├── Ejection: Next game suspension
│       └── Contact with umpire: 3+ games
└── Card-based Sports/
    ├── Soccer (16 teams)
    │   ├── Red card: Automatic 1 game
    │   ├── Yellow accumulation (5 = 1 game)
    │   └── Violent conduct: 3+ games
    └── Other Olympic Sports
        └── Sport-specific card rules
```

### Conference Disciplinary Framework

```bash
# Disciplinary Action Processing Flow
├── Infraction Occurs/
│   ├── Official's report filed
│   ├── Video review (if applicable)
│   ├── Conference review within 24 hours
│   └── Suspension determination
├── Notification Requirements/
│   ├── School compliance officer
│   ├── Athletic director
│   ├── Head coach
│   ├── Conference administrator
│   └── Media relations (if public)
└── Appeal Process/
    ├── School submits within 48 hours
    ├── Conference review committee
    ├── Video evidence required
    └── Final decision within 72 hours
```

### Known Compliance Requirements & Edge Cases

```python
# CRITICAL: Each sport has unique suspension calculation rules
# CRITICAL: Multi-sport athletes may have cross-sport implications
# CRITICAL: Post-season suspensions carry to next season
# CRITICAL: Transfer students bring suspension history
# CRITICAL: International students need visa compliance for suspensions
# CRITICAL: Academic calendar affects suspension timing
# CRITICAL: TV/streaming replay affects ejection reviews
# CRITICAL: Officials' reports are legally binding documents
```

## Implementation Blueprint

### Data Models and Structure

```python
# disciplinary_models.py - Core tracking data structures
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Literal, Union
from datetime import datetime, date
from enum import Enum
from decimal import Decimal

class Sport(str, Enum):
    FOOTBALL = "football"
    BASKETBALL_M = "basketball_mens"
    BASKETBALL_W = "basketball_womens"
    SOCCER = "soccer"
    VOLLEYBALL = "volleyball"
    BASEBALL = "baseball"
    SOFTBALL = "softball"
    WRESTLING = "wrestling"
    LACROSSE_W = "lacrosse"
    # ... all 23 sports

class InfractionType(str, Enum):
    # Football specific
    TARGETING = "targeting"
    FIGHTING_FB = "fighting_football"
    UNSPORTSMANLIKE_CONDUCT = "unsportsmanlike_conduct"

    # Basketball specific
    FLAGRANT_1 = "flagrant_foul_1"
    FLAGRANT_2 = "flagrant_foul_2"
    TECHNICAL_FOUL = "technical_foul"
    FIGHTING_BB = "fighting_basketball"

    # Soccer specific
    YELLOW_CARD = "yellow_card"
    RED_CARD = "red_card"
    VIOLENT_CONDUCT = "violent_conduct"

    # General
    EJECTION = "ejection"
    VERBAL_ABUSE = "verbal_abuse_official"
    PHYSICAL_CONTACT_OFFICIAL = "physical_contact_official"

class SuspensionStatus(str, Enum):
    PENDING_REVIEW = "pending_review"
    AUTOMATIC = "automatic"
    CONFERENCE_IMPOSED = "conference_imposed"
    UNDER_APPEAL = "under_appeal"
    UPHELD = "upheld"
    REDUCED = "reduced"
    OVERTURNED = "overturned"
    SERVED = "served"

class DisciplinaryAction(BaseModel):
    id: str = Field(..., description="Unique action identifier")
    game_id: str = Field(..., description="FlexTime game identifier")
    date_time: datetime
    sport: Sport
    school: str = Field(..., description="Big 12 member school")
    opponent: str
    venue: str

    # Person involved
    person_type: Literal["player", "coach", "staff"]
    person_id: str
    person_name: str
    jersey_number: Optional[str] = None

    # Infraction details
    infraction_type: InfractionType
    period: str = Field(..., description="Game period/half/quarter")
    game_time: str = Field(..., description="Time in period")
    official_reporting: str = Field(..., description="Reporting official")

    # Description and evidence
    description: str
    video_timestamp: Optional[str] = None
    official_report_url: Optional[str] = None

    # Immediate consequences
    ejected: bool = Field(default=False)
    team_penalty: Optional[str] = None

class Suspension(BaseModel):
    id: str = Field(..., description="Unique suspension identifier")
    disciplinary_action_id: str
    person_id: str
    school: str
    sport: Sport

    # Suspension details
    games_suspended: int = Field(..., ge=0)
    suspension_type: Literal["automatic", "conference", "ncaa", "cumulative"]
    status: SuspensionStatus

    # Affected games
    games_to_miss: List[str] = Field(..., description="Game IDs from FlexTime")
    start_date: date
    end_date: Optional[date] = None

    # Rule basis
    rule_citation: str
    policy_reference: str

    # Appeal information
    appeal_filed: bool = Field(default=False)
    appeal_date: Optional[datetime] = None
    appeal_outcome: Optional[str] = None

    # Compliance tracking
    compliance_notified: datetime
    school_acknowledged: Optional[datetime] = None
    public_announcement: Optional[datetime] = None

class SeasonAccumulation(BaseModel):
    person_id: str
    sport: Sport
    season_year: int

    # Accumulation tracking
    yellow_cards: int = Field(default=0)
    technical_fouls: int = Field(default=0)
    unsportsmanlike_penalties: int = Field(default=0)

    # Suspension triggers
    next_yellow_suspension: Optional[int] = None
    next_technical_suspension: Optional[int] = None

    # History
    total_games_suspended: int = Field(default=0)
    disciplinary_actions: List[str] = Field(default_factory=list)

class ComplianceReport(BaseModel):
    report_id: str
    generated_date: datetime
    reporting_period: str

    # School summary
    school: str
    sports_included: List[Sport]

    # Metrics
    total_infractions: int
    total_ejections: int
    total_suspensions: int
    pending_appeals: int

    # Details by sport
    sport_breakdown: Dict[Sport, Dict[str, int]]

    # Compliance status
    all_notifications_sent: bool
    all_acknowledgments_received: bool
    outstanding_items: List[str]
```

### List of Tasks to Complete

```yaml
Task 1: Real-time Game Report Integration
CREATE agents/game_report_monitor.py:
  - PATTERN: Event-driven monitoring like weather center
  - Connect to official's reporting system APIs
  - Monitor live game feeds for ejection events
  - Parse referee reports for disciplinary actions
  - Capture video timestamps for review
  - Queue infractions for immediate processing

Task 2: Sport-Specific Rule Engine
CREATE tools/suspension_calculator.py:
  - PATTERN: Complex rule evaluation like FlexTime constraints
  - Implement sport-specific suspension rules
  - Handle cumulative infraction calculations
  - Process post-season carryover rules
  - Calculate multi-sport athlete implications
  - Consider academic calendar constraints

Task 3: Automated Notification System
CREATE agents/compliance_notifier.py:
  - PATTERN: Multi-channel alerts like operations center
  - Send immediate notifications to required parties
  - Generate compliant notification documents
  - Track acknowledgment receipts
  - Escalate unacknowledged notices
  - Handle media relations protocols

Task 4: Video Evidence Management
CREATE tools/video_evidence_processor.py:
  - PATTERN: Media handling like media day profiles
  - Extract clips from game broadcasts
  - Timestamp and catalog evidence
  - Secure storage with audit trail
  - Support appeal process requirements
  - Integrate with replay official systems

Task 5: Appeal Process Workflow
CREATE agents/appeal_coordinator.py:
  - PATTERN: Document workflow like policy management
  - Manage appeal submission deadlines
  - Coordinate review committee scheduling
  - Track evidence and arguments
  - Document decision rationale
  - Update suspension status

Task 6: Compliance Reporting Generator
CREATE tools/compliance_reporter.py:
  - PATTERN: Automated reporting like financial dashboards
  - Generate weekly school reports
  - Create conference-wide summaries
  - Track repeat offender patterns
  - Provide NCAA required documentation
  - Support end-of-season analysis

Task 7: FlexTime Integration Module
CREATE agents/eligibility_synchronizer.py:
  - PATTERN: System integration like awards tracking
  - Update player eligibility in FlexTime
  - Block suspended players from lineups
  - Notify scheduling system of impacts
  - Handle roster limit adjustments
  - Manage travel party eligibility

Task 8: Analytics and Pattern Detection
CREATE tools/disciplinary_analytics.py:
  - PATTERN: Trend analysis like social sentiment
  - Identify team/player patterns
  - Detect officiating consistency
  - Analyze sport-specific trends
  - Generate predictive insights
  - Support coaching education initiatives
```

### Per Task Pseudocode

```python
# Task 1: Real-time Game Report Monitor
class GameReportMonitor:
    async def monitor_live_games(self) -> List[DisciplinaryAction]:
        # PATTERN: Real-time monitoring like Big 12 operations
        active_games = await self.get_active_games_from_flextime()

        disciplinary_actions = []
        for game in active_games:
            # CRITICAL: Different sports use different reporting systems
            if game.sport in [Sport.FOOTBALL, Sport.BASKETBALL_M, Sport.BASKETBALL_W]:
                actions = await self.monitor_stats_llc_feed(game)
            elif game.sport == Sport.SOCCER:
                actions = await self.monitor_ncaa_soccer_system(game)
            else:
                actions = await self.monitor_conference_reporting(game)

            # GOTCHA: Ejections can be overturned by replay
            for action in actions:
                if action.requires_video_review:
                    action = await self.await_replay_decision(action)

                disciplinary_actions.append(action)

        return disciplinary_actions

# Task 2: Sport-Specific Suspension Calculator
@suspension_calculator.tool
async def calculate_suspension(
    ctx: RunContext[DisciplinaryDependencies],
    action: DisciplinaryAction,
    season_history: SeasonAccumulation
) -> Suspension:
    """Calculate suspension based on sport-specific rules."""

    # PATTERN: Rule-based logic like FlexTime constraints
    suspension_rules = load_sport_rules(action.sport)

    # CRITICAL: Each sport has unique accumulation rules
    if action.sport == Sport.FOOTBALL:
        if action.infraction_type == InfractionType.TARGETING:
            # Automatic 1 game for targeting
            games_suspended = 1
            if season_history.targeting_ejections >= 2:
                # Multiple targeting = additional games
                games_suspended = 2
        elif action.infraction_type == InfractionType.FIGHTING_FB:
            games_suspended = calculate_fighting_suspension(action.description)

    elif action.sport == Sport.SOCCER:
        if action.infraction_type == InfractionType.RED_CARD:
            games_suspended = 1
            # GOTCHA: Violent conduct gets additional games
            if "violent conduct" in action.description.lower():
                games_suspended = 3
        elif action.infraction_type == InfractionType.YELLOW_CARD:
            season_history.yellow_cards += 1
            # Accumulation rule: 5 yellows = 1 game suspension
            if season_history.yellow_cards in [5, 10, 15]:
                games_suspended = 1
            else:
                games_suspended = 0

    elif action.sport in [Sport.BASKETBALL_M, Sport.BASKETBALL_W]:
        if action.infraction_type == InfractionType.FLAGRANT_2:
            games_suspended = 1
        elif action.infraction_type == InfractionType.TECHNICAL_FOUL:
            season_history.technical_fouls += 1
            # Different threshold for players vs coaches
            threshold = 5 if action.person_type == "player" else 3
            if season_history.technical_fouls >= threshold:
                games_suspended = 1
                season_history.technical_fouls = 0  # Reset counter

    # CRITICAL: Post-season suspensions carry over
    affected_games = await get_next_games(
        action.person_id,
        action.sport,
        games_suspended,
        consider_postseason=True
    )

    return Suspension(
        id=generate_suspension_id(),
        disciplinary_action_id=action.id,
        person_id=action.person_id,
        school=action.school,
        sport=action.sport,
        games_suspended=games_suspended,
        suspension_type="automatic" if games_suspended > 0 else "none",
        status=SuspensionStatus.PENDING_REVIEW,
        games_to_miss=[g.id for g in affected_games],
        start_date=affected_games[0].date if affected_games else None,
        rule_citation=suspension_rules.get_citation(action.infraction_type),
        policy_reference=f"Big 12 {action.sport.value} Policy Section {get_policy_section(action)}"
    )

# Task 3: Compliance Notification System
class ComplianceNotifier:
    async def send_disciplinary_notifications(
        self,
        action: DisciplinaryAction,
        suspension: Suspension
    ) -> NotificationResult:
        # PATTERN: Multi-stakeholder communication like championships

        # CRITICAL: Time-sensitive notifications for game prep
        notification_priority = "URGENT" if suspension.games_suspended > 0 else "HIGH"

        recipients = self.get_required_recipients(action, suspension)

        # School notifications
        school_contacts = await self.get_school_contacts(action.school)

        notifications_sent = []

        # Compliance Officer - Primary notification
        compliance_notification = await self.send_notification(
            to=school_contacts.compliance_officer,
            subject=f"DISCIPLINARY ACTION: {action.person_name} - {action.sport.value}",
            template="compliance_notification",
            data={
                "action": action,
                "suspension": suspension,
                "acknowledgment_required": True,
                "deadline": "24 hours"
            },
            priority=notification_priority
        )
        notifications_sent.append(compliance_notification)

        # Athletic Director - Summary notification
        ad_notification = await self.send_notification(
            to=school_contacts.athletic_director,
            subject=f"Disciplinary Action Notification - {action.sport.value}",
            template="ad_summary",
            data={
                "player_name": action.person_name,
                "infraction": action.infraction_type.value,
                "games_affected": len(suspension.games_to_miss),
                "appeal_deadline": calculate_appeal_deadline(action.date_time)
            }
        )
        notifications_sent.append(ad_notification)

        # GOTCHA: Media notifications only for high-profile cases
        if self.requires_media_notification(action, suspension):
            media_notification = await self.prepare_media_statement(action, suspension)
            notifications_sent.append(media_notification)

        # Conference office notification
        conference_notification = await self.notify_conference_office(
            action=action,
            suspension=suspension,
            school_notifications=notifications_sent
        )

        return NotificationResult(
            all_sent=all(n.sent for n in notifications_sent),
            acknowledgments_pending=True,
            follow_up_required=suspension.games_suspended > 0
        )

# Task 6: Compliance Report Generation
async def generate_compliance_report(
    school: str,
    sport: Optional[Sport] = None,
    period: str = "weekly"
) -> ComplianceReport:
    # PATTERN: Comprehensive reporting like financial dashboards

    date_range = calculate_report_period(period)

    # Gather all disciplinary data
    actions = await db.get_disciplinary_actions(
        school=school,
        sport=sport,
        start_date=date_range.start,
        end_date=date_range.end
    )

    suspensions = await db.get_suspensions(
        school=school,
        sport=sport,
        date_range=date_range
    )

    # CRITICAL: Include pending and served suspensions
    report_data = {
        "total_infractions": len(actions),
        "total_ejections": len([a for a in actions if a.ejected]),
        "total_suspensions": len([s for s in suspensions if s.games_suspended > 0]),
        "pending_appeals": len([s for s in suspensions if s.status == SuspensionStatus.UNDER_APPEAL]),
        "sport_breakdown": {}
    }

    # Sport-specific analysis
    for sport in Sport:
        sport_actions = [a for a in actions if a.sport == sport]
        if sport_actions:
            report_data["sport_breakdown"][sport] = {
                "infractions": len(sport_actions),
                "ejections": len([a for a in sport_actions if a.ejected]),
                "suspensions": len([s for s in suspensions if s.sport == sport]),
                "repeat_offenders": count_repeat_offenders(sport_actions)
            }

    # GOTCHA: Compliance requires 100% notification verification
    notification_status = await verify_all_notifications(actions, suspensions)

    report = ComplianceReport(
        report_id=generate_report_id(),
        generated_date=datetime.utcnow(),
        reporting_period=f"{period} ending {date_range.end}",
        school=school,
        sports_included=list(report_data["sport_breakdown"].keys()),
        **report_data,
        all_notifications_sent=notification_status.all_sent,
        all_acknowledgments_received=notification_status.all_acknowledged,
        outstanding_items=notification_status.outstanding
    )

    # Generate PDF with conference branding
    pdf_report = await generate_pdf_report(report, include_details=True)

    return report
```

### Integration Points

```yaml
GAME_DATA_SOURCES:
  - flextime_api: 'Real-time game schedules and results'
  - stats_llc: 'Official statistics provider for major sports'
  - ncaa_reporting: 'NCAA central reporting system'
  - referee_systems: 'Direct official report submission'
  - video_replay: 'TV/streaming replay decision feed'

NOTIFICATION_SYSTEMS:
  - email: 'Primary notification channel via SendGrid'
  - sms: 'Urgent notifications via Twilio'
  - flextime: 'Eligibility updates to scheduling system'
  - arbiter: 'Official assignment system updates'
  - team_apps: 'Direct integration with team management apps'

COMPLIANCE_INFRASTRUCTURE:
  - database: 'Supabase for disciplinary record storage'
  - document_storage: 'Secure S3 for official reports'
  - video_storage: 'Evidence clips with encryption'
  - audit_log: 'Complete trail for legal compliance'

REPORTING_OUTPUTS:
  - dashboard: 'Real-time disciplinary status board'
  - pdf_reports: 'Official compliance documentation'
  - ncaa_export: 'Required NCAA reporting formats'
  - analytics: 'Pattern detection and insights'
```

## Validation Loop

### Level 1: Rule Engine Validation

```bash
# Test sport-specific suspension calculations
python -m tools.suspension_calculator --validate-all-sports

# Test accumulation rules
python -m tests.test_accumulation_rules --sport=soccer --scenario=yellow_cards

# Expected: 100% accuracy on known test cases
```

### Level 2: Notification and Compliance Testing

```python
# Test notification delivery and timing
async def test_urgent_notification_flow():
    """Test critical path for game ejection notifications"""

    test_ejection = DisciplinaryAction(
        sport=Sport.FOOTBALL,
        infraction_type=InfractionType.TARGETING,
        person_name="Test Player",
        school="Oklahoma State",
        ejected=True,
        date_time=datetime.utcnow()
    )

    suspension = await calculate_suspension(test_ejection)
    notifications = await send_notifications(test_ejection, suspension)

    assert notifications.all_sent is True
    assert notifications.delivery_time < timedelta(minutes=15)
    assert "URGENT" in notifications.compliance_email.subject
    assert notifications.acknowledgment_requested is True

# Test compliance report accuracy
def test_compliance_report_generation():
    """Verify compliance reports include all required elements"""

    report = generate_compliance_report(
        school="Texas Tech",
        period="weekly"
    )

    assert report.all_notifications_sent is True
    assert len(report.outstanding_items) == 0
    assert report.sport_breakdown is not None
    assert report.includes_appeal_status is True
```

### Level 3: End-to-End Season Simulation

```bash
# Simulate full season disciplinary tracking
python -m disciplinary_agent_test --simulate-season --sport=basketball

# Expected flow:
# 1. Process 200+ technical fouls across season
# 2. Track accumulation for 300+ players
# 3. Calculate 20+ automatic suspensions
# 4. Send 500+ compliance notifications
# 5. Process 5-10 appeals
# 6. Generate weekly reports for all schools
# 7. Maintain 100% accuracy on suspensions

# Validate against manual tracking
python -m validation.disciplinary_audit --compare-to-manual-records
```

## Final Validation Checklist

- [ ] All sport rules correctly implemented: `pytest tests/test_sport_rules.py -v`
- [ ] Suspension calculations 100% accurate across all scenarios
- [ ] Notifications sent within 15 minutes of infractions
- [ ] All required parties receive appropriate notifications
- [ ] Appeal process workflow handles all edge cases
- [ ] FlexTime integration blocks suspended players
- [ ] Compliance reports meet NCAA requirements
- [ ] Video evidence properly stored and retrievable
- [ ] Season accumulation tracking accurate for all players

---

## Anti-Patterns to Avoid

- ❌ Don't delay notifications - compliance windows are strict
- ❌ Don't mix sport rules - each has unique suspension criteria
- ❌ Don't skip video review - overturnned ejections must be tracked
- ❌ Don't ignore accumulation - yellow cards and technicals build up
- ❌ Don't forget carryover - post-season suspensions extend to next year
- ❌ Don't bypass appeals - due process is legally required
- ❌ Don't lose documentation - audit trails are legal requirements

## Confidence Score: 9.8/10

Extremely high confidence due to:

- Clear regulatory requirements from NCAA and Big 12 policies
- Well-defined sport-specific rules for all infractions
- Established notification and compliance procedures
- Direct integration with existing FlexTime scheduling system
- Strong legal and competitive integrity requirements ensuring adoption

Minor uncertainty only on video evidence automation for all venues, but manual upload provides reliable fallback.
