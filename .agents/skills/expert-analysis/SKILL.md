---
name: expert-analysis
description: Deep analysis of documentation/articles with practical application guidance. Use when user asks to "analyze and apply", "digest and implement", "read and integrate", or provides a document they want analyzed for implementation in the codebase.
---

# Expert Analysis

Read, digest, and provide actionable implementation guidance for applying external documentation, articles, or architectural patterns to the FlexTime codebase.

## Quick Start

When user provides a document to analyze:

1. **Create analysis workspace** - `doc_analysis.md` and `implementation_plan.md`
2. **Read and synthesize** - Extract key concepts, patterns, and principles
3. **Map to codebase** - Identify integration points and alignment opportunities
4. **Provide guidance** - Actionable steps with specific file references
5. **Deliver perspective** - Critical analysis: what fits, what doesn't, what to adapt

## The Analysis Pattern

For any document analysis task, create TWO files:

| File | Purpose | Contents |
|------|---------|----------|
| `doc_analysis.md` | Synthesized learnings | Key concepts, quotes, principles extracted |
| `implementation_plan.md` | Application roadmap | How to apply to FlexTime, where to integrate |

## Core Workflow

```
Loop 1: Read document → Create doc_analysis.md with synthesis
Loop 2: Map to FlexTime → Identify integration points → Write to doc_analysis.md
Loop 3: Create implementation_plan.md with actionable steps
Loop 4: Provide critical perspective and recommendations
```

### The Loop in Detail

**Phase 1: Deep Read**
- Read the entire document thoroughly
- Extract core principles, not just surface features
- Identify patterns, methodologies, and philosophies
- Capture key quotes verbatim

**Phase 2: Synthesize**
- Distill main concepts into digestible sections
- Group related ideas together
- Identify what's novel vs. what we already do
- Note any conflicts with current approach

**Phase 3: Map to Codebase**
- Identify specific files/modules where concepts apply
- Find existing patterns that align or conflict
- Spot opportunities for improvement
- Flag potential integration challenges

**Phase 4: Create Implementation Plan**
- Prioritize: what to implement now vs. later vs. never
- Provide specific file paths and integration points
- Suggest incremental steps (avoid big rewrites)
- Include verification steps for each change

**Phase 5: Critical Perspective**
- What fits our context (sports scheduling for athletic conferences)?
- What's over-engineered for our needs?
- What conflicts with our "Feature Excellence" phase?
- What should we adapt vs. adopt wholesale?

## doc_analysis.md Template

```markdown
# Document Analysis: [Title/Topic]

**Source:** [URL or reference]
**Date Analyzed:** [YYYY-MM-DD]
**Analyzed By:** Codex Agent

## Executive Summary
[2-3 sentences: What is this document about and why does it matter for FlexTime?]

## Core Principles

### Principle 1: [Name]
- **What it says:** [Direct explanation]
- **Key quote:** "[Verbatim quote from source]"
- **Why it matters:** [Relevance to FlexTime]

### Principle 2: [Name]
[Repeat structure]

## Key Concepts

### Concept 1: [Name]
**Definition:** [What it is]
**Application:** [How it's used in source]
**FlexTime Relevance:** [How it applies to us]

## Patterns and Methodologies

### Pattern 1: [Name]
- **Problem it solves:** [Description]
- **How it works:** [Explanation]
- **Example from source:** [If available]

## Current State in FlexTime

### What We Already Do
- [Existing practice that aligns] → [File reference]
- [Existing practice that aligns] → [File reference]

### What We Don't Do
- [Gap identified] → [Potential improvement area]
- [Gap identified] → [Potential improvement area]

### Conflicts and Tensions
- [Where source conflicts with our approach] → [Why it matters]

## Critical Analysis

### What Fits
[What from this document aligns with FlexTime's goals and context]

### What Doesn't Fit
[What is over-engineered, irrelevant, or conflicts with our direction]

### What to Adapt
[What needs modification to work in our context]

## Open Questions
1. [Question for clarification or deeper investigation]
2. [Question for user decision]
```

## implementation_plan.md Template

```markdown
# Implementation Plan: [Document/Concept Name]

**Goal:** [One sentence: what we're implementing and why]
**Status:** Planning

## Phases

- [ ] Phase 1: Quick wins - low-effort, high-value changes
- [ ] Phase 2: Medium changes - require some refactoring
- [ ] Phase 3: Long-term improvements - architectural shifts

## Phase 1: Quick Wins

### Change 1: [Description]
**What:** [What to change]
**Where:** `[file/path/here.js:line_number]`
**Why:** [Benefit]
**How:** [Specific implementation steps]
**Verification:** [How to test it works]

### Change 2: [Description]
[Repeat structure]

## Phase 2: Medium Changes

### Change 1: [Description]
**Current State:** [How it works now] in `[file.js]`
**Desired State:** [How it should work]
**Implementation Steps:**
1. [Step with file reference]
2. [Step with file reference]
**Risks:** [Potential issues]
**Verification:** [Test approach]

## Phase 3: Long-term Improvements

### Improvement 1: [Description]
**Vision:** [What this achieves long-term]
**Rationale:** [Why it's worth the effort]
**Blockers:** [What needs to happen first]
**Rough Scope:** [High-level breakdown]

## Integration Points

### Existing Code to Modify
- `[file/path.js]` - [What needs changing]
- `[file/path.js]` - [What needs changing]

### New Code to Create
- `[proposed/file/path.js]` - [Purpose]
- `[proposed/file/path.js]` - [Purpose]

### Documentation to Update
- `[docs/path.md]` - [What to add/change]

## Decisions Required

1. **[Decision topic]**
   - Option A: [Description] - [Pros/Cons]
   - Option B: [Description] - [Pros/Cons]
   - Recommendation: [Which and why]

## Success Criteria

- [ ] [Measurable outcome 1]
- [ ] [Measurable outcome 2]
- [ ] [Measurable outcome 3]

## References
- Source document: [Link]
- Related FlexTime docs: [Links]
```

## Critical Rules

### 1. Read the ENTIRE Document
Don't skim. Read thoroughly to understand context, nuance, and intent.

### 2. Synthesize, Don't Summarize
Extract principles and patterns, not just bullet points. Understand the "why" behind the "what."

### 3. Map to Specific Files
Always reference actual file paths. Never give generic advice like "update your services."

### 4. Respect Current Context
We're in "Feature Excellence & Documentation" phase. Recommendations must align with quality-over-velocity focus.

### 5. Critical Perspective Required
Not everything in a document applies. Be discerning. What fits our sports scheduling domain for athletic administrators?

### 6. Incremental Over Revolutionary
Prefer evolutionary changes over big rewrites. Suggest small, verifiable steps.

## When to Use This Skill

**Use this skill when:**
- User shares a blog post, article, or documentation to implement
- User asks to "analyze and apply" or "digest and implement"
- User wants guidance on integrating external patterns/principles
- User provides architectural documentation to evaluate

**Skip this skill for:**
- Quick "what does this mean?" questions (just answer directly)
- Library documentation lookups (use Context7 MCP instead)
- Code reviews (use review skills)

## Output Format

After analysis, provide user with:

1. **Brief Summary** (in conversation)
   - 2-3 key takeaways
   - Top 3 recommended actions
   - Any critical concerns

2. **Files Created**
   - `doc_analysis.md` - Full synthesis
   - `implementation_plan.md` - Actionable roadmap

3. **Next Steps**
   - What to do first
   - What decisions need user input
   - Estimated effort (small/medium/large, no time estimates)

## Example Usage

```
User: "Analyze this article about event-driven architecture and tell me how we should apply it to FlexTime's orchestration layer"

Agent:
1. Creates doc_analysis.md and implementation_plan.md
2. Reads article thoroughly
3. Extracts principles: event sourcing, pub/sub patterns, state machines
4. Maps to: CadenceOrchestrator.js, FSMEnforcer.js, audit tables
5. Identifies: We already use FSM, could add event sourcing for audit
6. Creates phased plan: Quick wins (emit events), Medium (event store), Long-term (full event sourcing)
7. Provides critical take: "Event sourcing fits our audit needs, but pub/sub is overkill for our single-tenant model"
8. Delivers summary with file references
```

## Best Practices

- **Be skeptical**: Not every "best practice" fits every context
- **Think domain-specific**: Sports scheduling has unique constraints
- **Consider our users**: Athletic administrators, not developers
- **Respect the phase**: We're refining, not rebuilding
- **Link everything**: Every suggestion needs a file path
- **Test incrementally**: Each change should be independently verifiable

## Anti-Patterns to Avoid

| Don't | Do Instead |
|-------|------------|
| Skim the document | Read thoroughly, multiple times if needed |
| Accept everything uncritically | Evaluate fit for our domain and phase |
| Give generic advice | Provide specific file paths and line references |
| Suggest big rewrites | Recommend incremental changes |
| Ignore current patterns | Build on what exists, adapt gradually |
| Skip verification steps | Include testing approach for each change |

## Success Indicators

You've done this well when:
- ✅ User understands core concepts from the document
- ✅ User has clear, actionable next steps
- ✅ Implementation plan references specific existing files
- ✅ Recommendations respect "Feature Excellence" phase
- ✅ Critical analysis shows discernment (not everything applies)
- ✅ User can verify each change independently
