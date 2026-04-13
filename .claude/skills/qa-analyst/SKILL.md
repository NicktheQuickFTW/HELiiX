---
name: qa-analyst
description: Analyze plans and code quality for any file or change set. Use when asked to review a plan, assess implementation quality, score completeness against a checklist, or provide actionable QA feedback (correctness, tests, reliability, maintainability).
---

# QA Analyst

## Overview

Deliver a structured QA-style audit that maps stated intent (plan/requirements) to evidence in code or artifacts, and grades overall quality with a repeatable scorecard.

## Workflow

1. Collect inputs: plan/requirements (or user intent), code changes (diff/PR) or target file(s), test/lint results, runtime logs, and any stated constraints.
2. Extract checklist items: convert the plan/intent into a checklist of discrete deliverables.
3. Map evidence: for each item, cite file paths, line ranges, tests, logs, or artifacts that demonstrate completion.
4. Score completion: mark each item as Complete, Partial, or Missing; compute completion %.
5. Score quality: evaluate the implementation (or target file) with the rubric below; compute quality score.
6. Produce a report using the template; include blocking issues and next actions.

## Completion Scoring

Use this formula unless the user specifies otherwise:

```
completion_score = (complete + 0.5 * partial) / total * 100
```

If evidence is missing, ask for the plan or diff instead of guessing.

## Code Quality Rubric

Score each 0-5 with brief rationale; multiply by weights to get the quality score:

| Dimension | Weight | What to Check |
| --- | --- | --- |
| Correctness | 0.25 | Logic matches requirements, edge cases handled |
| Tests | 0.20 | Meaningful coverage, critical paths tested, failures addressed |
| Maintainability | 0.20 | Clear structure, low complexity, good naming, minimal duplication |
| Reliability | 0.15 | Error handling, validation, observability, safe defaults |
| Performance | 0.10 | No obvious regressions, sensible algorithms |
| Style/Consistency | 0.10 | Lint, formatting, conventions, clear docs/comments |

```
quality_score = sum(dimension_score * weight) * 20
```

## Report Template

Use this structure for the final output:

```
# QA Analyst Review

## Summary
- Completion Score: X%
- Quality Score: Y/100
- Overall Grade: [A-F or Pass/Revise/Block]

## Completion Matrix
| Plan Item | Status | Evidence |
| --- | --- | --- |
| ... | Complete/Partial/Missing | file/path#Lx |

## Quality Scorecard
| Dimension | Score (0-5) | Notes |
| --- | --- | --- |
| Correctness | | |
| Tests | | |
| Maintainability | | |
| Reliability | | |
| Performance | | |
| Style/Consistency | | |

## Findings
- [Issue or risk with file reference]

## Recommendations
1. ...

## Verification
- Tests: [run/skip + reason]
- Lint: [run/skip + reason]
```
