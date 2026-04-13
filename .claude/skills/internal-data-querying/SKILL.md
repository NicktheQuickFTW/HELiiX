---
name: internal-data-querying
description: Safely query internal analytics and data services to produce shareable, reproducible artifacts. Use when answering questions from internal data sources like warehouses, reporting databases, or data APIs with audit trails.
---

<objective>
Query internal data services to answer well-scoped questions, producing results and artifacts that are safe to share and easy to re-run.
</objective>

<when_to_use>
Use this skill when:
- A stakeholder asks for **metrics, trends, or slices** that rely on internal data
- The answers can be derived from existing **warehouses, marts, or reporting APIs**
- The request needs a **reproducible query** and not an ad-hoc manual export
</when_to_use>

<required_inputs>
- **Business question**: One or two sentences describing what we want to know
- **Time range and filters**: Date boundaries, customer segments, environments, etc.
- **Source systems**: Names of warehouses, schemas, or APIs to use
- **Data sensitivity notes**: Whether PII, financial data, or regulated data is involved
</required_inputs>

<out_of_scope>
- Direct queries against production OLTP databases unless explicitly allowed
- Creating new pipelines or ingestion jobs
- Sharing raw PII or secrets outside approved destinations
</out_of_scope>

<conventions>
## Data Access
- Use the **preferred query layer** (e.g., dbt models, semantic layer, analytics API) instead of raw tables when available
- Follow established **naming and folder conventions** for saved queries or analysis notebooks
- Respect internal **data classification and access control** policies
</conventions>

<process>
## Query Workflow

1. **Clarify** the business question, time range, and filters
2. **Identify** the best data source(s) based on freshness, completeness, and governance
3. **Draft the query**, validate it on a limited time window or sample
4. **Check** for joins, filters, and aggregations that could distort the answer; fix as needed
5. **Save the query** in the approved location with a descriptive name
6. **Capture results** and summarize key findings and limitations
</process>

<required_behavior>
- Translate the business question into a precise query spec (metrics, dimensions, filters)
- Choose appropriate sources and explain tradeoffs if multiple options exist
- Write queries that are performant and cost-conscious for the target system
- Produce both **results** and a **re-runnable query artifact** (SQL, API call, notebook, or dashboard link)
</required_behavior>

<required_artifacts>
- Query text (SQL, DSL, or API request) checked into the appropriate repo or folder
- A short **analysis summary** capturing methodology, assumptions, and caveats
- Links to any **dashboards, notebooks, or reports** created
</required_artifacts>

<verification>
Use whatever validation mechanisms exist for your data stack, for example:
- `dbt test` in the relevant project
- Unit or regression tests for custom metrics or transformations
- Manual spot checks against known benchmarks or historical reports
</verification>

<success_criteria>
The skill is complete when:
- The query runs successfully within acceptable time and cost bounds
- Results match expectations or known reference points (within reasonable tolerance)
- The query and results are documented enough for another engineer or analyst to reuse
</success_criteria>

<safety_and_escalation>
- If the query touches **sensitive or regulated data**, confirm that the destination (PR, doc, ticket) is an approved location before including any sample rows
- If you identify data quality issues, file or update a data-quality ticket and call them out prominently in the analysis summary
</safety_and_escalation>
