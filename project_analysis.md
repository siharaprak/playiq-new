# PlayIQ Project Analysis

## 1. Latest DB Schema
### Table: profiles
```sql
id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
email VARCHAR(255) NOT NULL,
full_name VARCHAR(255),
role user_role NOT NULL DEFAULT 'student',
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
```

### Table: parent_child_links
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
created_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE(parent_id, student_id)
```

### Table: courses
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
title VARCHAR(255) NOT NULL,
description TEXT,
is_active BOOLEAN DEFAULT false,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
```

### Table: modules
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
title VARCHAR(255) NOT NULL,
order_num INTEGER NOT NULL,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
```

### Table: skill_nodes
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
title VARCHAR(255) NOT NULL,
mastery_threshold_placeholder INTEGER,
created_at TIMESTAMPTZ DEFAULT NOW()
```

### Table: attempts
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
node_id UUID REFERENCES skill_nodes(id) ON DELETE CASCADE,
pdi_score_placeholder NUMERIC,
passed BOOLEAN DEFAULT false,
created_at TIMESTAMPTZ DEFAULT NOW()
```

### Table: mastery_checkpoints
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
node_id UUID REFERENCES skill_nodes(id) ON DELETE CASCADE,
status checkpoint_status DEFAULT 'locked',
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE(student_id, node_id)
```

### Table: proof_artifacts
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
node_id UUID REFERENCES skill_nodes(id) ON DELETE CASCADE,
media_path VARCHAR(500) NOT NULL,
verification_status artifact_status DEFAULT 'submitted',
created_at TIMESTAMPTZ DEFAULT NOW()
```

### Table: reports
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
generated_summary_placeholder JSONB,
created_at TIMESTAMPTZ DEFAULT NOW()
```

### Table: shipments
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
status shipment_status DEFAULT 'preparing',
tracking_number_placeholder VARCHAR(255),
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
```

### Table: support_issues
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
issue_text TEXT NOT NULL,
status issue_status DEFAULT 'open',
created_at TIMESTAMPTZ DEFAULT NOW()
```

### Table: events_log
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
event_type event_type_enum NOT NULL,
target_type VARCHAR(255) NOT NULL,
target_id UUID,
metadata JSONB,
created_at TIMESTAMPTZ DEFAULT NOW()
```

### Table: student_node_progress
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
node_id UUID REFERENCES skill_nodes(id) ON DELETE CASCADE,
lesson_completed BOOLEAN DEFAULT false,
activity_completed BOOLEAN DEFAULT false,
mini_check_passed BOOLEAN DEFAULT false,
teach_back_status pass_status_enum DEFAULT 'revise',
node_mastered BOOLEAN DEFAULT false,
unlocked_at TIMESTAMPTZ DEFAULT NOW(),
completed_at TIMESTAMPTZ,
UNIQUE(student_id, node_id)
```

### Table: assessment_submissions
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
node_id UUID REFERENCES skill_nodes(id) ON DELETE CASCADE,
assessment_type assessment_type_enum NOT NULL,
submission_payload JSONB NOT NULL,
score_numeric NUMERIC,
pass_status pass_status_enum DEFAULT 'fail',
created_at TIMESTAMPTZ DEFAULT NOW()
```

### Table: fingerprint_signals
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
signal_type VARCHAR(255) NOT NULL,
signal_value VARCHAR(255) NOT NULL,
source_event_id UUID REFERENCES events_log(id) ON DELETE SET NULL,
created_at TIMESTAMPTZ DEFAULT NOW()
```

### Table: proof_artifact_submissions
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
artifact_type artifact_type_enum NOT NULL,
content_payload JSONB NOT NULL,
status artifact_status_enum DEFAULT 'submitted',
created_at TIMESTAMPTZ DEFAULT NOW()
```

### Table: feedback_requests
```sql
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
message TEXT NOT NULL,
status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved'
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```



## 2. Current Framework Analysis

- Next.js Version: 16.2.3
- React Version: 19.2.4
- Tailwind CSS: ^4
- Supabase SDK: ^2.103.0


## 3. Project Directory Structure
```text
playiq-new/
├── .env
├── .gitignore
├── AGENTS.md
├── apphosting.yaml
├── apply_gating.js
├── build.log
├── build_log.txt
├── build_utf8.log
├── CLAUDE.md
├── docs
│   ├── architecture
│   │   └── decision-log.md
│   ├── playiq-db-schema-and-project-structure.md
│   ├── runbooks
│   │   ├── deployment.md
│   │   ├── env-vars.md
│   │   ├── proof-artifact-cleanup-schedule.md
│   │   └── proof-artifact-malware-scanning-plan.md
│   └── sprint
│       ├── data-alignment-capstone-resolution.md
│       ├── data-alignment-rule-engine-readiness.md
│       ├── data-alignment-sprint-1-curriculum-module-node-alignment.md
│       ├── phase-1-acceptance.md
│       ├── pre-sprint-5-continuation-readiness.md
│       ├── sprint-3-beta-config-policy.md
│       ├── sprint-3-events-rollups-threshold-framework.md
│       ├── sprint-3-mastery-engine-progression-rules.md
│       ├── sprint-4-guided-ai-layer-integrity-controls.md
│       ├── sprint-4b-lesson-rescue.md
│       ├── sprint-4c-guided-ai-integrity-hardening.md
│       ├── sprint-4d-ai-support-events-safety-routing.md
│       ├── sprint-4e-guided-ai-ux-answer-policy-integrity-trends.md
│       ├── sprint-4f-guided-ai-security-cost-abuse-hardening.md
│       ├── sprint-5-proof-artifact-system-storage-review-flow.md
│       ├── sprint-5b-proof-artifact-security-storage-review-hardening.md
│       ├── sprint-5c-proof-artifact-path-validation-review-tools.md
│       ├── sprint-5d-proof-lifecycle-preview-parent-summary.md
│       ├── sprint-5e-proof-submission-revision-review-flow.md
│       ├── student-username-and-community-safety.md
│       └── threshold-escalation-policy.md
├── eslint.config.mjs
├── fix_admin.mjs
├── fix_corruption.js
├── fix_imports.js
├── fix_params.js
├── fix_syntax.js
├── make-icon.js
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── pdf_extract.txt
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── images
│   │   ├── playiq-amz-product.jpg
│   │   ├── playiq-branding
│   │   │   ├── Attachments
│   │   │   │   ├── 829144064-1.png
│   │   │   │   ├── 829144069-2.png
│   │   │   │   ├── 829144072-3.png
│   │   │   │   ├── 829144077-4.png
│   │   │   │   ├── 829144081-5.png
│   │   │   │   ├── 830073813-reel-1-tutorial-educational-1-minute-magnetic-builds.mp4
│   │   │   │   ├── 830074376-reel-2-fun-proof-first-the-20-second-glow-test.mp4
│   │   │   │   ├── 830074565-reel-3-promotional-product-clarity-reel.mp4
│   │   │   │   ├── 830074824-reel-4-inspirational-parent-moment.mp4
│   │   │   │   ├── 830075181-1.png
│   │   │   │   ├── 830075188-2.png
│   │   │   │   ├── 830075192-3.png
│   │   │   │   ├── 830075197-4.png
│   │   │   │   ├── 830075201-5.png
│   │   │   │   ├── 830075205-6.png
│   │   │   │   ├── 830075209-7.png
│   │   │   │   ├── 830075530-1.png
│   │   │   │   ├── 830075536-2.png
│   │   │   │   ├── 830075540-3.png
│   │   │   │   ├── 830075545-4.png
│   │   │   │   ├── 830075548-5.png
│   │   │   │   ├── 830075550-6.png
│   │   │   │   ├── 830075552-7.png
│   │   │   │   ├── 830075743-1.png
│   │   │   │   ├── 830075746-2.png
│   │   │   │   ├── 830075751-3.png
│   │   │   │   ├── 830075755-4.png
│   │   │   │   ├── 830075761-5.png
│   │   │   │   ├── 830075765-6.png
│   │   │   │   ├── 830075768-7.png
│   │   │   │   ├── 833833094-black-skin-white-eyes.png
│   │   │   │   ├── 833833096-blue-skin-green-eye-s-1.jpg
│   │   │   │   ├── 833833098-blue-skin-green-eye-s-2.jpg
│   │   │   │   ├── 833833100-blue-skin-green-eye-s-3.jpg
│   │   │   │   ├── 833833102-blue-skin-green-eye-s-4.jpg
│   │   │   │   ├── 833833104-blue-skin-green-eyes-5.jpeg
│   │   │   │   ├── 833833105-blue-skin-green-eyes-6.jpeg
│   │   │   │   ├── 833833109-blue-skin-green-eyes.png
│   │   │   │   ├── 833833111-blue-skin-green-eyes2.png
│   │   │   │   ├── 833833113-blue-skin-green-eyes3.png
│   │   │   │   ├── 833833115-green-skin-samurai.jpg
│   │   │   │   ├── 833833118-green-skin-samurai2.jpg
│   │   │   │   ├── 833833122-green-skin-samurai3.jpg
│   │   │   │   ├── 833833123-green-skin-samurai4.jpg
│   │   │   │   ├── 833833125-green-skin-white-eyes-samurai.png
│   │   │   │   ├── 833833126-green-skin-white-eyes-samurai2.png
│   │   │   │   ├── 833833129-green-skin-white-eyes-samurai3.png
│   │   │   │   ├── 833833134-purple-skin-green-eyes.png
│   │   │   │   ├── 833833136-purple-skin-white-eyes.jpg
│   │   │   │   ├── 833833139-purple-skin-white-eyes2.jpg
│   │   │   │   ├── 833833142-yellow-skin-white-eyes.jpg
│   │   │   │   ├── 833833144-yellow-skin-white-eyes2.jpg
│   │   │   │   ├── 833833149-yellow-skin-white-eyes3.jpg
│   │   │   │   └── 836229246-playiq-os-avata.jpeg
│   │   │   └── CONTENT, BRAND ASSETS & GUIDELINES
│   │   │       ├── LINK TO BRAND ASSETS.html
│   │   │       ├── LOGO - Background & animation
│   │   │       │   ├── Glow sign1.jpeg
│   │   │       │   ├── Glow sign2.jpeg
│   │   │       │   ├── Neon GLowing Electric Smoke sign animation.mp4
│   │   │       │   ├── Neon GLowing Electric Smoke sign animation2.mp4
│   │   │       │   ├── PlayIQ sign1.png
│   │   │       │   ├── PlayIQ sign2.png
│   │   │       │   ├── PlayIQ sign3.png
│   │   │       │   ├── PlayIQ sign4.png
│   │   │       │   ├── PlayIQ sign4bw.PNG
│   │   │       │   ├── PlayIQ sign5.png
│   │   │       │   ├── PlayIQ sign6.png
│   │   │       │   ├── PlayIQ sign7bw.PNG
│   │   │       │   └── Screenshot 2026-01-13 135014.png
│   │   │       ├── Orion Assets
│   │   │       │   ├── Approved Monk Design.html
│   │   │       │   ├── Monk Character.html
│   │   │       │   └── ORION - pickfu FINAL.mp4
│   │   │       ├── PlayIQ Magnetic Block Images.html
│   │   │       ├── REFERENCE - MAGNETIC BLOCK PRODUCT IMAGES
│   │   │       │   ├── Blocks in Space 1.jpg
│   │   │       │   ├── Blocks in Space 2.jpg
│   │   │       │   ├── Family playIQ time.jpg
│   │   │       │   ├── Family playIQ time2.jpg
│   │   │       │   ├── Main Image #2 No Logo.png
│   │   │       │   ├── Main image #2 with Logo.png
│   │   │       │   ├── Play IQ Mag Blocks Just blockss.jpg
│   │   │       │   ├── Play IQ Mag Blocks Manufacturing pictures.jpg
│   │   │       │   ├── Play IQ Mag Blocks toy in living room.jpg
│   │   │       │   ├── Play IQ Mag Blocks toy.jpg
│   │   │       │   ├── PlayIQ Magnetic Blocks.jpg
│   │   │       │   ├── PlayIQ singlespace guy.jpg
│   │   │       │   ├── PlayIQ singlespace guy2.jpg
│   │   │       │   ├── PlayIQ Space guys.jpg
│   │   │       │   ├── UGC1.mp4
│   │   │       │   └── UGC2.mp4
│   │   │       └── SIENVI CREATED CONTENT
│   │   │           ├── 1ST DRAFT CONTENT
│   │   │           │   ├── 1.png
│   │   │           │   ├── 2.png
│   │   │           │   ├── 3.png
│   │   │           │   ├── play IQ 1.png
│   │   │           │   ├── PLAY IQ 2.png
│   │   │           │   ├── PLAY IQ 3.png
│   │   │           │   └── PLAY IQ 4.png
│   │   │           ├── 2ND DRAFT CONTENT
│   │   │           │   ├── 1.png
│   │   │           │   ├── 10.png
│   │   │           │   ├── 2.png
│   │   │           │   ├── 3.png
│   │   │           │   ├── 4.png
│   │   │           │   ├── 5.png
│   │   │           │   ├── 6.png
│   │   │           │   ├── 7.png
│   │   │           │   ├── 8.png
│   │   │           │   ├── 9.png
│   │   │           │   └── Sample Video.mp4
│   │   │           └── 3RD DRAFT CONTENT
│   │   │               └── FOR APPROVAL
│   │   │                   ├── CAROUSEL 1 — Educational + Tutorial (Save-worthy).html
│   │   │                   ├── CAROUSEL 2 — Promotional (No competitor naming).html
│   │   │                   ├── CAROUSEL 3 — Fun facts + Educator Tips (Credibility).html
│   │   │                   ├── REEL 1 — Tutorial (Educational).html
│   │   │                   ├── REEL 2 — Fun + Proof-First (Entertaining).html
│   │   │                   ├── REEL 3 — Promotional (Product Clarity).html
│   │   │                   ├── REEL 4 — Inspirational (Parent Moment).html
│   │   │                   └── “4 Hidden STEM Skills (No Lecture)” (Fun Facts + Educational + Inspirational).html
│   │   ├── playiq-logo-cropped.png
│   │   ├── tier1-hardware-hero.png
│   │   ├── tier2-effort-gating-app.png
│   │   ├── tier2-parent-proof-dash.png
│   │   ├── tier2-parent-proof-packet.png
│   │   ├── tier3-apprentice-teen.png
│   │   └── tier3-teen-creative-build.png
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── push_error.txt
├── README.md
├── scratch
│   ├── fix_module_1.js
│   └── qa-sprint-4b.ps1
├── scripts
│   ├── apply-capstone-resolution.ts
│   ├── apply-skill-nodes-seed.ts
│   ├── audit-curriculum-db-alignment.ts
│   ├── audit-db-schema-and-curriculum.ts
│   ├── cleanup-proof-artifact-drafts.ts
│   ├── generate-skill-nodes-seed.ts
│   ├── get-schema.ts
│   ├── project-analysis.ts
│   ├── qa-guided-ai-adversarial.ts
│   ├── qa-proof-flow-policy.ts
│   ├── qa-proof-state-machine.ts
│   ├── qa-proof-storage-paths.ts
│   ├── simulate-proof-event-sanitizer.ts
│   ├── verify-capstone-resolution.ts
│   ├── verify-guided-ai-event-metadata.ts
│   ├── verify-module-constants.ts
│   ├── verify-parent-integrity-trends.ts
│   ├── verify-parent-proof-summary.ts
│   ├── verify-pre-sprint5-readiness.ts
│   ├── verify-proof-artifact-event-metadata.ts
│   ├── verify-proof-artifact-parent-access.ts
│   ├── verify-resubmission-db-behavior.ts
│   ├── verify-runtime-source-unchanged.ts
│   └── verify-static-db-curriculum-parity.ts
├── src
│   ├── app
│   │   ├── (auth)
│   │   │   ├── actions.ts
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   └── signup
│   │   │       └── page.tsx
│   │   ├── (dashboard)
│   │   │   ├── admin
│   │   │   │   ├── home
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── modules
│   │   │   │   │   ├── 1
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── 2
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── proof-artifacts
│   │   │   │   │   └── page.tsx
│   │   │   │   └── users
│   │   │   │       ├── actions.ts
│   │   │   │       └── page.tsx
│   │   │   ├── discussions
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── topic
│   │   │   │   │   └── [id]
│   │   │   │   │       └── page.tsx
│   │   │   │   └── [categorySlug]
│   │   │   │       └── page.tsx
│   │   │   ├── parent
│   │   │   │   ├── actions.ts
│   │   │   │   ├── apprentice-setup
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── home
│   │   │   │   │   └── page.tsx
│   │   │   │   └── modules
│   │   │   │       ├── 1
│   │   │   │       │   └── page.tsx
│   │   │   │       └── 2
│   │   │   │           └── page.tsx
│   │   │   └── student
│   │   │       ├── home
│   │   │       │   ├── feedback-actions.ts
│   │   │       │   ├── page.tsx
│   │   │       │   └── RequestFeedbackButton.tsx
│   │   │       └── modules
│   │   │           ├── 1
│   │   │           │   ├── actions.ts
│   │   │           │   ├── boss-battle
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── completion
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── nodes
│   │   │           │   │   └── [nodeId]
│   │   │           │   │       ├── activity
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── completion
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── lesson
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── mini-check
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       └── teach-back
│   │   │           │   │           └── page.tsx
│   │   │           │   ├── overview
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── page.tsx
│   │   │           │   ├── proof-artifacts
│   │   │           │   │   └── page.tsx
│   │   │           │   └── quiz
│   │   │           │       └── page.tsx
│   │   │           ├── 10
│   │   │           │   ├── actions.ts
│   │   │           │   ├── boss-battle
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── completion
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── nodes
│   │   │           │   │   └── [nodeId]
│   │   │           │   │       ├── activity
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── completion
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── lesson
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── mini-check
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       └── teach-back
│   │   │           │   │           └── page.tsx
│   │   │           │   ├── overview
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── page.tsx
│   │   │           │   ├── proof-artifacts
│   │   │           │   │   └── page.tsx
│   │   │           │   └── quiz
│   │   │           │       └── page.tsx
│   │   │           ├── 2
│   │   │           │   ├── actions.ts
│   │   │           │   ├── boss-battle
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── completion
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── nodes
│   │   │           │   │   └── [nodeId]
│   │   │           │   │       ├── activity
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── completion
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── lesson
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── mini-check
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       └── teach-back
│   │   │           │   │           └── page.tsx
│   │   │           │   ├── overview
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── page.tsx
│   │   │           │   ├── proof-artifacts
│   │   │           │   │   └── page.tsx
│   │   │           │   └── quiz
│   │   │           │       └── page.tsx
│   │   │           ├── 3
│   │   │           │   ├── actions.ts
│   │   │           │   ├── boss-battle
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── completion
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── nodes
│   │   │           │   │   └── [nodeId]
│   │   │           │   │       ├── activity
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── completion
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── lesson
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── mini-check
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       └── teach-back
│   │   │           │   │           └── page.tsx
│   │   │           │   ├── overview
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── page.tsx
│   │   │           │   ├── proof-artifacts
│   │   │           │   │   └── page.tsx
│   │   │           │   └── quiz
│   │   │           │       └── page.tsx
│   │   │           ├── 4
│   │   │           │   ├── actions.ts
│   │   │           │   ├── boss-battle
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── completion
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── nodes
│   │   │           │   │   └── [nodeId]
│   │   │           │   │       ├── activity
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── completion
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── lesson
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── mini-check
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       └── teach-back
│   │   │           │   │           └── page.tsx
│   │   │           │   ├── overview
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── page.tsx
│   │   │           │   ├── proof-artifacts
│   │   │           │   │   └── page.tsx
│   │   │           │   └── quiz
│   │   │           │       └── page.tsx
│   │   │           ├── 5
│   │   │           │   ├── actions.ts
│   │   │           │   ├── boss-battle
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── completion
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── nodes
│   │   │           │   │   └── [nodeId]
│   │   │           │   │       ├── activity
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── completion
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── lesson
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── mini-check
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       └── teach-back
│   │   │           │   │           └── page.tsx
│   │   │           │   ├── overview
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── page.tsx
│   │   │           │   ├── proof-artifacts
│   │   │           │   │   └── page.tsx
│   │   │           │   └── quiz
│   │   │           │       └── page.tsx
│   │   │           ├── 6
│   │   │           │   ├── actions.ts
│   │   │           │   ├── boss-battle
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── completion
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── nodes
│   │   │           │   │   └── [nodeId]
│   │   │           │   │       ├── activity
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── completion
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── lesson
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── mini-check
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       └── teach-back
│   │   │           │   │           └── page.tsx
│   │   │           │   ├── overview
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── page.tsx
│   │   │           │   ├── proof-artifacts
│   │   │           │   │   └── page.tsx
│   │   │           │   └── quiz
│   │   │           │       └── page.tsx
│   │   │           ├── 7
│   │   │           │   ├── actions.ts
│   │   │           │   ├── boss-battle
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── completion
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── nodes
│   │   │           │   │   └── [nodeId]
│   │   │           │   │       ├── activity
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── completion
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── lesson
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── mini-check
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       └── teach-back
│   │   │           │   │           └── page.tsx
│   │   │           │   ├── overview
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── page.tsx
│   │   │           │   ├── proof-artifacts
│   │   │           │   │   └── page.tsx
│   │   │           │   └── quiz
│   │   │           │       └── page.tsx
│   │   │           ├── 8
│   │   │           │   ├── actions.ts
│   │   │           │   ├── boss-battle
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── completion
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── nodes
│   │   │           │   │   └── [nodeId]
│   │   │           │   │       ├── activity
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── completion
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── lesson
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       ├── mini-check
│   │   │           │   │       │   └── page.tsx
│   │   │           │   │       └── teach-back
│   │   │           │   │           └── page.tsx
│   │   │           │   ├── overview
│   │   │           │   │   └── page.tsx
│   │   │           │   ├── page.tsx
│   │   │           │   ├── proof-artifacts
│   │   │           │   │   └── page.tsx
│   │   │           │   └── quiz
│   │   │           │       └── page.tsx
│   │   │           └── 9
│   │   │               ├── actions.ts
│   │   │               ├── boss-battle
│   │   │               │   └── page.tsx
│   │   │               ├── completion
│   │   │               │   └── page.tsx
│   │   │               ├── nodes
│   │   │               │   └── [nodeId]
│   │   │               │       ├── activity
│   │   │               │       │   └── page.tsx
│   │   │               │       ├── completion
│   │   │               │       │   └── page.tsx
│   │   │               │       ├── lesson
│   │   │               │       │   └── page.tsx
│   │   │               │       ├── mini-check
│   │   │               │       │   └── page.tsx
│   │   │               │       └── teach-back
│   │   │               │           └── page.tsx
│   │   │               ├── overview
│   │   │               │   └── page.tsx
│   │   │               ├── page.tsx
│   │   │               ├── proof-artifacts
│   │   │               │   └── page.tsx
│   │   │               └── quiz
│   │   │                   └── page.tsx
│   │   ├── (public)
│   │   │   ├── apprentice
│   │   │   │   └── page.tsx
│   │   │   ├── approach
│   │   │   │   └── page.tsx
│   │   │   ├── beta
│   │   │   │   ├── actions.ts
│   │   │   │   ├── page.tsx
│   │   │   │   └── schema.ts
│   │   │   ├── contact
│   │   │   │   └── page.tsx
│   │   │   ├── data-protection
│   │   │   │   └── page.tsx
│   │   │   ├── how-it-works
│   │   │   │   └── page.tsx
│   │   │   ├── page.tsx
│   │   │   ├── parents
│   │   │   │   └── page.tsx
│   │   │   ├── privacy
│   │   │   │   └── page.tsx
│   │   │   ├── proof
│   │   │   │   └── page.tsx
│   │   │   └── terms
│   │   │       └── page.tsx
│   │   ├── api
│   │   │   ├── chat
│   │   │   │   └── route.ts
│   │   │   ├── dev-seed
│   │   │   │   └── route.ts
│   │   │   ├── discussions
│   │   │   │   ├── categories
│   │   │   │   │   └── route.ts
│   │   │   │   ├── replies
│   │   │   │   │   └── [id]
│   │   │   │   │       ├── moderate
│   │   │   │   │       │   └── route.ts
│   │   │   │   │       ├── report
│   │   │   │   │       │   └── route.ts
│   │   │   │   │       └── route.ts
│   │   │   │   └── topics
│   │   │   │       ├── route.ts
│   │   │   │       └── [id]
│   │   │   │           ├── moderate
│   │   │   │           │   └── route.ts
│   │   │   │           ├── pin
│   │   │   │           │   └── route.ts
│   │   │   │           ├── replies
│   │   │   │           │   └── route.ts
│   │   │   │           ├── report
│   │   │   │           │   └── route.ts
│   │   │   │           └── route.ts
│   │   │   ├── guided-ai
│   │   │   │   └── route.ts
│   │   │   ├── internal
│   │   │   │   └── proof-artifacts
│   │   │   │       └── cleanup
│   │   │   │           └── route.ts
│   │   │   ├── profile
│   │   │   │   └── username
│   │   │   │       ├── check
│   │   │   │       │   └── route.ts
│   │   │   │       └── route.ts
│   │   │   ├── proof-artifacts
│   │   │   │   ├── review-queue
│   │   │   │   │   └── route.ts
│   │   │   │   ├── student
│   │   │   │   │   └── route.ts
│   │   │   │   ├── upload-slot
│   │   │   │   │   └── route.ts
│   │   │   │   └── [id]
│   │   │   │       ├── download-url
│   │   │   │       │   └── route.ts
│   │   │   │       ├── finalize
│   │   │   │       │   └── route.ts
│   │   │   │       └── review
│   │   │   │           └── route.ts
│   │   │   └── stripe
│   │   │       └── webhook
│   │   │           └── route.ts
│   │   ├── auth
│   │   │   └── signout
│   │   │       └── route.ts
│   │   ├── globals.css
│   │   ├── icon.png
│   │   ├── icon.svg
│   │   └── layout.tsx
│   ├── components
│   │   ├── analytics
│   │   │   └── GA4RouteTracker.tsx
│   │   ├── chat
│   │   │   └── ChatBot.tsx
│   │   ├── discussions
│   │   │   ├── ReplyComposer.tsx
│   │   │   ├── ThreadActions.tsx
│   │   │   ├── TimeAgo.tsx
│   │   │   ├── TopicComposer.tsx
│   │   │   └── UserAvatar.tsx
│   │   ├── forms
│   │   │   ├── BetaForm.tsx
│   │   │   ├── BossBattleForm.tsx
│   │   │   └── TeachBackForm.tsx
│   │   ├── guided-ai
│   │   │   ├── GuidedAIPanel.tsx
│   │   │   ├── GuidedAiResponse.tsx
│   │   │   └── ModeSelector.tsx
│   │   ├── layout
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── PlayIQLogo.tsx
│   │   │   ├── SocialSidebar.tsx
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── profile
│   │   │   └── StudentUsernameSetup.tsx
│   │   └── proof-artifacts
│   │       ├── ParentProofSummaryCard.tsx
│   │       ├── ProofArtifactList.tsx
│   │       ├── ProofArtifactPreviewLink.tsx
│   │       ├── ProofArtifactPreviewViewer.tsx
│   │       ├── ProofArtifactReviewPanel.tsx
│   │       ├── ProofArtifactReviewQueue.tsx
│   │       ├── ProofArtifactSection.tsx
│   │       ├── ProofArtifactStatusBadge.tsx
│   │       └── ProofArtifactUploader.tsx
│   ├── data
│   │   ├── module10Content.ts
│   │   ├── module1Content.ts
│   │   ├── module2Content.ts
│   │   ├── module3Content.ts
│   │   ├── module4Content.ts
│   │   ├── module5Content.ts
│   │   ├── module6Content.ts
│   │   ├── module7Content.ts
│   │   ├── module8Content.ts
│   │   └── module9Content.ts
│   ├── lib
│   │   ├── auth
│   │   │   └── permissions.ts
│   │   ├── constants.ts
│   │   ├── curriculum
│   │   │   └── canonical-course-map.ts
│   │   ├── data
│   │   │   ├── discussions.ts
│   │   │   ├── integrity-trends.ts
│   │   │   ├── mastery-config.ts
│   │   │   ├── profile-identity.ts
│   │   │   ├── progress-rollups.ts
│   │   │   └── proof-artifacts.ts
│   │   ├── events
│   │   │   ├── guided-ai-event-policy.ts
│   │   │   ├── learning-events.ts
│   │   │   ├── metadata-safety.ts
│   │   │   └── types.ts
│   │   ├── gating.ts
│   │   ├── gemini.ts
│   │   ├── guided-ai
│   │   │   ├── answer-release-policy.ts
│   │   │   ├── context.ts
│   │   │   ├── hint-ladder.ts
│   │   │   ├── integrity.ts
│   │   │   ├── modes.ts
│   │   │   ├── prompts.ts
│   │   │   ├── rate-limit.ts
│   │   │   ├── run-guided-mode.ts
│   │   │   ├── safety-routing.ts
│   │   │   ├── types.ts
│   │   │   └── ux-policy.ts
│   │   ├── mastery
│   │   │   ├── beta-policy.ts
│   │   │   ├── placeholders.ts
│   │   │   ├── seed-defaults.ts
│   │   │   ├── thresholds.ts
│   │   │   └── types.ts
│   │   ├── proof-artifacts
│   │   │   ├── cleanup.ts
│   │   │   ├── file-validation.ts
│   │   │   ├── flow-policy.ts
│   │   │   ├── malware-scanning-policy.ts
│   │   │   ├── rate-limit.ts
│   │   │   ├── state-machine.ts
│   │   │   ├── storage-paths.ts
│   │   │   └── types.ts
│   │   ├── server
│   │   │   ├── blocked-terms.ts
│   │   │   ├── content-moderation.ts
│   │   │   ├── discussion-rules.ts
│   │   │   ├── pagination.ts
│   │   │   ├── responses.ts
│   │   │   └── safe-display.ts
│   │   └── supabase
│   │       └── admin.ts
│   ├── proxy.ts
│   └── utils
│       └── supabase
│           ├── client.ts
│           ├── middleware.ts
│           └── server.ts
├── supabase
│   ├── .temp
│   │   ├── cli-latest
│   │   ├── gotrue-version
│   │   ├── linked-project.json
│   │   ├── pooler-url
│   │   ├── postgres-version
│   │   ├── project-ref
│   │   ├── rest-version
│   │   ├── storage-migration
│   │   └── storage-version
│   └── migrations
│       ├── 0001_initial_schema.sql
│       ├── 0002_rls_policies.sql
│       ├── 0003_beta_applications.sql
│       ├── 0004_auth_profile_trigger.sql
│       ├── 0005_module_1_schema.sql
│       ├── 0006_dev_auto_confirm.sql
│       ├── 0007_rls_module1_policies.sql
│       ├── 0008_module_2_seed.sql
│       ├── 0009_modules_3_to_10_seed.sql
│       ├── 0010_feedback_requests.sql
│       ├── 0011_capstone_seed.sql
│       ├── 20260514113936_sprint3_events_rollups_threshold_defaults.sql
│       ├── 20260515040800_student_username_and_discussion_safety.sql
│       ├── 20260522000000_sprint4_guided_ai_support_events.sql
│       ├── 20260522132240_sprint5_proof_artifact_storage_review_flow.sql
│       ├── 20260522215900_data_alignment_capstone_resolution.sql
│       ├── 20260523055840_data_alignment_capstone_resolution.sql
│       └── 20260523061000_data_alignment_seed_skill_nodes_course1.sql
├── test_signup.js
├── tsc.log
├── tsconfig.json
└── tsconfig.tsbuildinfo

```
