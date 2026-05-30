# Data Alignment Sprint 1: Rule Engine Readiness

This document outlines the readiness of the PlayIQ platform to transition to a database-enforced rule engine and curriculum flow.

## 1. Curriculum & Modules
- **Canonical Map Created**: A canonical course map correctly matching database `order_num` and IDs for Modules 1-10 and Capstone is now in `src/lib/curriculum/canonical-course-map.ts`.
- **Constants Alignment**: `src/lib/constants.ts` is fully updated to match the live DB IDs for Modules 1-10 and Capstone.
- **Capstone Fixed**: The duplicate capstone has been archived in metadata, and the Canonical Capstone (Order 11) now holds the correct `course_id`.

## 2. Skill Nodes
- **Seeded**: `skill_nodes` for Modules 1-10 have been successfully seeded from static curriculum (`src/data/module*Content.ts`) via idempotent SQL migrations.
- **Stable IDs**: Nodes now have predictable UUIDs using a v5 hash based on `module_id` and `node_key`, ensuring seamless idempotent upserts in the future.
- **Empty States**: Module 0 and Capstone currently have no `skill_nodes` because static content for them does not exist yet.

## 3. Enforcement State
- **Currently**: `enforcement_mode = not_enforced`.
- **Readiness**: The data layer is now aligned. Future sprints can safely transition `enforcement_mode` to `soft_enforced` or `hard_enforced` because the DB `modules` and `skill_nodes` match the application runtime state.

## 4. Pending Prerequisites for Hard Enforcement
1. **Module 0**: Content must be finalized and its nodes seeded before enforcing progression.
2. **Runtime Switch**: The application currently sources curriculum content directly from `src/data/module*Content.ts`. This logic needs to be rewritten to fetch strictly from the DB `modules` and `skill_nodes` before `hard_enforced` is turned on.
3. **Mastery Thresholds**: The DB nodes currently have a placeholder `mastery_threshold_placeholder = 80`. Actual mastery gates need to be verified.
