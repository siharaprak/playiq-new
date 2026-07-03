# Module 0 — The Assessment: Task List

## Database
- [x] Create migration `20260703_module0_assessment.sql` with `student_assessment_profiles` table + RLS policies
- [x] Apply migration on Supabase remote database using Supabase CLI query command

## Server-Side Logic
- [x] Create `src/lib/assessment/assessment-scoring.ts` — baseline task scoring rubrics
- [x] Create `src/lib/assessment/assessment-reveal.ts` — reveal personalization logic
- [x] Create `src/app/(dashboard)/student/assessment/actions.ts` — server actions

## Frontend Components
- [x] Create `src/components/assessment/OrionTypingEffect.tsx` — typewriter animation
- [x] Create `src/components/assessment/ScenarioCard.tsx` — diagnostic question cards
- [x] Create `src/components/assessment/BaselineChallenge.tsx` — Phase 3 challenge tasks
- [x] Create `src/components/assessment/LearningBlueprint.tsx` — blueprint display card
- [x] Create `src/components/assessment/OrionAssessment.tsx` — main 5-phase flow

## Pages & Routing
- [x] Create `src/app/(dashboard)/student/assessment/page.tsx` — assessment page
- [x] Modify student layout to remove broken layout-level redirect
- [x] Add assessment status to student home sidebar
- [x] Set up Next.js 16 `src/proxy.ts` gating middleware (removed conflicting `src/middleware.ts`)

## Parent Dashboard
- [x] Add Assessment Summary card to parent dashboard

## Styles
- [x] Add assessment-specific CSS to globals.css

## Verification
- [x] Run `npx tsc --noEmit` — 0 new errors (all errors are pre-existing boss-battle type issues)
- [x] Verify redirect gating works automatically (redirect from `/student/home` to `/student/assessment`)
- [x] Verify immersive view (navbar/footer/sidebar fully hidden during assessment)
- [x] Verify reveal step generates personalized calibration summary and blueprint
- [x] Verify Learning Blueprint card renders on student home sidebar after completion
