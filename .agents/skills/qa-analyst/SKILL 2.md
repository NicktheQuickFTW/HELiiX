---
name: implementation-quality-review
description: Analyze implementation plans and grade completion and code quality. Use when asked to audit how well an implementation plan was executed, score completion against plan items, or assess the quality of the resulting code changes.
---

# Implementation Quality Review

## Overview

Deliver a structured audit that maps an implementation plan to evidence in code changes and grades the resulting code quality with a repeatable scorecard.

## Workflow

1. Collect inputs: implementation plan file(s), code changes (diff/PR), test/lint results, runtime logs, and any stated constraints.
2. Extract plan items: convert the plan into a checklist of discrete deliverables.
3. Map evidence: for each item, cite files/paths/tests that demonstrate completion.
4. Score completion: mark each item as Complete, Partial, or Missing; compute completion %.
5. Score quality: evaluate code with the rubric below; compute quality score.
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
# Implementation Quality Review

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
