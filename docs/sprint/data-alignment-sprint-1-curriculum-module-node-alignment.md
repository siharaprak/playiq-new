# Data Alignment Sprint 1: Curriculum, Module, and Node Alignment

## Summary
The goal of Sprint 1 was to safely align the static curriculum files (`src/data/module*Content.ts`) with the database `modules` and `skill_nodes` tables, without enabling rule-engine enforcement or altering runtime application behavior.

## Actions Taken
1. **Canonical Module Mapping**:
   - Audited the `modules` table and mapped `Order 0 - 10` and `Capstone (Order 11)` to standard expected slugs.
   - Identified and mapped mismatching DB UUIDs to `src/lib/constants.ts` to ensure API routing directly matches seeded database migrations.

2. **Capstone Resolution**:
   - Discovered a duplicate capstone row (Order 99).
   - Ensured Canonical Capstone (Order 11) is retained and linked to the correct `course_id`.
   - Safely archived the duplicate by adding `{"archived": true}` to its JSONB metadata, preventing data loss.

3. **Skill Nodes Seeding**:
   - `skill_nodes` table was entirely empty.
   - Created a script to iterate over static curriculum content and generate stable UUIDv5 keys based on `module_id` and `node_key`.
   - Seeded 48 unique nodes for Modules 1-10 directly into the database.
   - The operation is idempotent. Running it multiple times simply updates the node title on conflict.

## Validation Checklist
- `audit:curriculum-db` script passes 100%.
- `verify:module-constants` passes 100%.
- Duplicate capstone is explicitly archived.
- No changes made to legacy or core artifact behaviors.
- `enforcement_mode` remains strictly `not_enforced`.
- Local dev builds pass.

## Next Steps
Data Alignment Sprint 2 or 3 will involve transitioning the actual Next.js server components to query `skill_nodes` directly for rendering, rather than reading `module*Content.ts`.

See [Pre-Sprint 5 Continuation Readiness](file:///c:/Users/Auviore/Documents/Sienvi/Projects/playiq-new/docs/sprint/pre-sprint-5-continuation-readiness.md) for full validation of this sprint.
