# Platform Decision Checklist: Stay on Firebase vs Migrate to Supabase

Use this checklist every 2-3 months (or before major architecture work) to make an objective decision.

## Decision outcome

- If most answers are in **Stay on Firebase**, continue on Firebase.
- If most answers are in **Consider Supabase**, plan a staged migration.
- If mixed, run a limited proof-of-concept first (one non-critical feature).

## 1) Delivery speed and team productivity

### Stay on Firebase if:

- Your team is shipping features quickly with current Firebase setup.
- Firestore data modeling is not slowing down feature delivery.
- Debugging and maintenance effort are manageable.

### Consider Supabase if:

- You spend significant time working around NoSQL data shape limitations.
- Feature work is delayed by query complexity or duplicated data structures.
- Admin/support tasks require too many custom scripts instead of simple queries.

## 2) Query and analytics complexity

### Stay on Firebase if:

- Most queries are simple reads/filters and single-collection workflows.
- You do not need heavy relational joins for core product features.

### Consider Supabase if:

- You now need frequent multi-table joins for product features.
- You need BI-style analytics, aggregations, and ad-hoc reporting.
- Product decisions depend on SQL-friendly metrics dashboards.

## 3) Real-time and product behavior

### Stay on Firebase if:

- Existing real-time listeners already meet your UX needs.
- Auth + Firestore integration is stable and predictable.

### Consider Supabase if:

- You need relational real-time features tightly tied to SQL joins.
- You want to centralize more backend logic in SQL/functions/policies.

## 4) Cost and scaling signals

### Stay on Firebase if:

- Monthly cost is predictable and acceptable for current growth.
- Query/read/write volume is not causing budget or performance pressure.

### Consider Supabase if:

- You need better cost control around SQL workloads and reporting.
- Firestore read/write patterns are becoming expensive due to denormalization.

## 5) Security, governance, and operations

### Stay on Firebase if:

- Current auth + rules + deployment model is understood by the team.
- Incident response and monitoring workflows are working in production.

### Consider Supabase if:

- You need SQL-level policy management that matches your governance model.
- Your team prefers database-first access control and audit patterns.

## 6) Migration effort and risk (critical gate)

### Stay on Firebase if:

- You have no bandwidth for a migration in the next quarter.
- Core roadmap goals would slip if migration starts now.

### Consider Supabase if:

- You can fund migration without blocking critical roadmap work.
- You can run dual-write or staged migration safely for key data.
- You can complete auth and data migration with rollback plans.

## Quantitative thresholds (simple scorecard)

Score each line from 1 (low) to 5 (high):

- SQL join/reporting need:
- Firebase modeling pain:
- Migration bandwidth available:
- Migration risk tolerance:
- Need for open SQL portability:

Interpretation:

- **Total <= 12**: stay on Firebase.
- **Total 13-18**: run a small Supabase proof-of-concept.
- **Total >= 19**: prepare phased migration plan.

## Proof-of-concept scope (if needed)

Run a 1-2 week POC on a non-critical feature only:

1. Choose one domain (example: search analytics/history).
2. Implement Supabase schema + RLS for that domain.
3. Compare:
   - development speed,
   - query clarity,
   - runtime performance,
   - operational complexity.
4. Decide using evidence, not preference.

## Recommendation for current project state

Based on current repository state (existing Firebase integration, active production hardening docs, and remaining unfinished app tasks), the default path is:

- **Ship on Firebase now**
- Reassess using this checklist after:
  - first stable production cycle, or
  - clear SQL/reporting pain emerges.
