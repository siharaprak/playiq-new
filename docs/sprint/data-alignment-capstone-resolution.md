# Data Alignment Sprint 1: Capstone Resolution

## Identification
The DB Audit identified two capstone rows in the `modules` table:
1. **Canonical Capstone (Order 11)**
   - ID: `c1f94091-62d9-4ac9-8f0a-86c2e3650238`
   - Title: "Capstone: Master Trial"
   - Course ID: `null`
   - Seeded by: `0011_capstone_seed.sql`
   - Used in: `src/lib/constants.ts` (as `CAPSTONE_ID`)

2. **Duplicate Capstone (Order 99)**
   - ID: `c9210282-ee30-46f6-a74c-d8e4109b3da9`
   - Title: "Capstone Master Trial"
   - Course ID: `402b0dc5-10f7-4b10-afad-fd88a516fa40`
   - Seeded by: Unknown (No explicit migration)
   - Used in: Nothing

## Reference Check
A reference audit confirmed **0 references** for both capstones across:
- `student_node_progress`
- `proof_artifact_submissions`
- `events_log`
- `mastery_checkpoints`

## Action Plan
Since `c1f94091-62d9-4ac9-8f0a-86c2e3650238` is part of the established database migration history (`0011_capstone_seed.sql`) and is mapped in code (`constants.ts`), it will serve as the canonical Capstone.

We will use a reversible SQL migration to:
1. **Update Canonical Capstone**: Set its `course_id` to `402b0dc5-10f7-4b10-afad-fd88a516fa40` (the official Course 1 ID).
2. **Archive Duplicate Capstone**: Set `metadata.archived = true` on `c9210282-ee30-46f6-a74c-d8e4109b3da9` rather than hard deleting it.

## Rollback Plan
To reverse this, simply clear the `archived` flag from the metadata of `c921...` and revert `course_id` to `null` on `c1f9...`.
