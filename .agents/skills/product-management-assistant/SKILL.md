---
name: product-management-assistant
description: Assist with product management workflows including PRDs, feature analysis, roadmap planning, and user research synthesis. Use when writing product requirements, evaluating features, synthesizing research, planning roadmaps, or communicating product decisions.
---

<objective>
Assist with core product management activities including writing product requirements documents (PRDs), analyzing feature requests, synthesizing user research, planning roadmaps, and communicating product decisions to stakeholders and engineering teams.
</objective>

<when_to_use>
Use this skill when you need to:
- Write or update **PRDs** with clear requirements, success metrics, and technical considerations
- Evaluate **feature requests** with structured analysis of impact, effort, and priority
- Synthesize **user research** findings into actionable insights
- Plan **roadmaps** and organize, prioritize, and communicate plans
- Communicate **product decisions** clearly to engineering, design, and business stakeholders
- Perform **competitive analysis** or market research synthesis
- Track and analyze **product metrics** to inform decisions
</when_to_use>

<key_capabilities>
Unlike point-solution PM tools:
- **Integrated with codebase**: Can reference actual code, APIs, and technical constraints
- **Context-aware**: Understands your specific product, architecture, and technical debt
- **Flexible templates**: Adapt documentation to your organization's needs
- **Version controlled**: All artifacts live in git alongside code
- **Collaborative**: Works within existing dev workflows (PRs, issues, docs)
</key_capabilities>

<required_inputs>
- **Product context**: Current state, key stakeholders, strategic goals
- **Feature requests**: User feedback, business needs, or strategic initiatives
- **Technical constraints**: Known limitations, dependencies, or technical debt
- **User research**: Interview notes, survey results, analytics data
- **Business goals**: Metrics, OKRs, or success criteria to optimize for
</required_inputs>

<out_of_scope>
- Making final product decisions (this is the PM's job; the skill assists)
- Managing stakeholder relationships and politics
- Detailed UI/UX design work (use design tools and collaborate with designers)
- Project management and sprint planning (use project management tools)
</out_of_scope>

<conventions>
## PRD Structure
A good PRD should include:
1. **Problem statement**: What user pain point or business need are we addressing?
2. **Goals and success metrics**: What does success look like quantitatively?
3. **User stories and use cases**: Who will use this and how?
4. **Requirements**: Functional and non-functional requirements, prioritized
5. **Technical considerations**: Architecture implications, dependencies, constraints
6. **Design and UX notes**: Key interaction patterns or design requirements
7. **Risks and mitigations**: What could go wrong and how to address it
8. **Launch plan**: Rollout strategy, feature flags, monitoring
9. **Open questions**: What still needs to be decided or researched

## Feature Prioritization Frameworks
- **RICE**: Reach × Impact × Confidence / Effort
- **ICE**: Impact × Confidence × Ease
- **Value vs. Effort**: 2×2 matrix plotting value against implementation cost
- **Kano Model**: Categorize features into basic, performance, and delighters

## User Research Synthesis
1. **Identify patterns**: What themes emerge across participants?
2. **Quote verbatim**: Include actual user quotes to illustrate points
3. **Quantify when possible**: "7 out of 10 participants said..."
4. **Segment findings**: Different user types may have different needs
5. **Connect to metrics**: How do qualitative findings explain quantitative data?

## Roadmap Planning
Effective roadmaps should:
- **Theme-based**: Group work into strategic themes, not just feature lists
- **Time-horizoned**: Now / Next / Later or Quarterly structure
- **Outcome-focused**: Emphasize goals and outcomes, not just outputs
- **Flexible**: Leave room for learning and adjustment
- **Communicated clearly**: Different views for different audiences
</conventions>

<process>
## Core Workflow

1. **Understand context deeply**: Review existing docs, code, and prior discussions before proposing changes
2. **Ask clarifying questions**: Don't assume; clarify ambiguous requirements or goals
3. **Be specific and actionable**: Avoid vague language; provide concrete, testable requirements
4. **Consider tradeoffs**: Explicitly discuss pros/cons of different approaches
5. **Connect to strategy**: Tie features and decisions back to higher-level goals
6. **Involve stakeholders**: Identify who needs to review or approve
7. **Think through edge cases**: Don't just focus on happy paths
8. **Make it measurable**: Propose concrete metrics to track success
</process>

<required_artifacts>
Depending on the task, generate:
- **PRD document**: Comprehensive product requirements in markdown format
- **Feature analysis**: Structured evaluation of a feature request
- **Research synthesis**: Summary of user research findings with insights
- **Roadmap document**: Organized view of planned work with themes and timelines
- **Decision document**: Record of key product decisions and rationale
- **Competitive analysis**: Comparison of competitor features and approaches
- **Metric definitions**: Clear definitions of success metrics and how to measure them
</required_artifacts>

<success_criteria>
The skill is complete when:
- Documentation is clear, comprehensive, and actionable
- Stakeholders understand the proposal and can make informed decisions
- Engineering teams have sufficient detail to estimate and implement
- Success metrics are defined and measurable
- Risks and tradeoffs are explicitly documented
</success_criteria>

<safety_and_escalation>
- **Strategic decisions**: AI should inform, not make, key product decisions. Involve human PMs and stakeholders
- **User data**: Don't feed PII or sensitive user data to AI without proper data handling procedures
- **Technical feasibility**: Always validate technical assumptions and effort estimates with engineering
- **Competitive intelligence**: Be cautious about including confidential competitive info in prompts
- **Tone and voice**: Review and adjust tone for your audience; AI may be too formal or informal
</safety_and_escalation>

<integration>
This skill can be combined with:
- **Internal data querying**: To analyze product metrics and user behavior data
- **AI data analyst**: To perform deeper quantitative analysis for feature decisions
- **Frontend UI integration**: To implement features designed in PRDs
- **Internal tools**: To build PM tools like feature flag dashboards or metrics viewers
</integration>
