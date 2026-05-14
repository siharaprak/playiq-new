# Student Username Ownership & Community Discussion Safety
> Sprint: Side Task — Username Ownership + Moderation Safety Layer

---

## Username Ownership Policy

### Who owns the username?
- The **student** owns their public username.
- Parents provision child accounts but do NOT control the child's final public display identity.
- The parent apprentice-setup page creates a **login handle** (email-based), not a public username.

### What is the username used for?
- Public display identity in discussions and community spaces.
- **NOT used for login or authentication.**
- Login remains email/password-based via Supabase Auth.

### Username rules
| Rule | Value |
|---|---|
| Length | 3–24 characters |
| Allowed characters | Lowercase letters, numbers, underscores only |
| Case | Normalized to lowercase |
| Uniqueness | Case-insensitive unique index |
| Email-like blocked | Yes |
| Phone-like blocked | Yes (7+ consecutive digits) |
| Blocked terms | Checked against server-side list |
| Beta change limit | 3 changes per student |
| Admin reset | Future feature (not in this sprint) |

### Display fallback order
1. `username` (if set)
2. Safe first name from `full_name` (first word only, never email)
3. Role-based fallback: Student / Parent / Teacher / Admin
4. **Never** email

---

## Discussion Moderation Rules

### Pre-submit filtering
All discussion content (topics, replies, edits) is checked before DB insertion.

### Decision model
| Decision | Behavior |
|---|---|
| `allow` | Content saved normally |
| `block` | Content rejected with safe message — not saved to DB |
| `needs_review` | Treated as `block` for beta — no `pending_review` status in DB |

### What gets blocked
- **Profanity** — common offensive words
- **Slurs** — racial, homophobic, ableist terms
- **Bullying phrases** — "kill yourself", "kys", etc.
- **Sexual content** — explicit terms
- **Personal info** (students only) — email addresses, phone numbers
- **Self-harm risk terms** — handled with supportive message, not shaming

### Self-harm handling
Content matching self-harm keywords receives a safe, supportive response:
> "It looks like you may be going through a tough time. Please reach out to a trusted adult, school counselor, or contact the Crisis Text Line by texting HOME to 741741. You are not alone."

### What is NOT blocked
- General discussion content
- Learning-related questions
- Module-specific terminology
- Staff/admin/teacher content (personal info check is student-only)

### Blocked terms policy
- List is stored server-side only (`src/lib/server/blocked-terms.ts`)
- Never exposed to client
- Raw offensive content is never logged in audit metadata — only category and decision
- List is a minimal starter set, expandable

### What remains manual moderation
- Report button still works
- Admin/teacher can still remove/lock topics and replies
- All existing moderation flows are preserved

---

## Known Limitations
- No AI-based moderation yet (future enhancement)
- No pending_review queue (beta decision: block before insert)
- No admin UI for username reset (future feature)
- Blocked terms list is starter-sized — will grow based on beta feedback
- Leet-speak normalization is basic (0→o, 1→i, etc.) — not exhaustive

## Future AI Moderation Path
1. Add Gemini-based content classification for nuanced detection
2. Implement `pending_review` status with moderator queue
3. Add sentiment analysis for bullying detection
4. Configurable moderation strictness levels per category

---

## Files Created/Modified

### New files
- `supabase/migrations/20260515040800_student_username_and_discussion_safety.sql`
- `src/lib/server/blocked-terms.ts`
- `src/lib/server/content-moderation.ts`
- `src/lib/data/profile-identity.ts`
- `src/app/api/profile/username/check/route.ts`
- `src/app/api/profile/username/route.ts`
- `src/components/profile/StudentUsernameSetup.tsx`

### Modified files
- `src/lib/server/safe-display.ts` — updated fallback order
- `src/lib/data/discussions.ts` — added username to profile selects
- `src/app/api/discussions/topics/route.ts` — added moderation to POST
- `src/app/api/discussions/topics/[id]/route.ts` — added moderation to PATCH
- `src/app/api/discussions/topics/[id]/replies/route.ts` — added moderation to POST
- `src/app/api/discussions/replies/[id]/route.ts` — added moderation to PATCH
- `src/app/(dashboard)/student/home/page.tsx` — integrated username setup component
- `src/app/(dashboard)/parent/apprentice-setup/page.tsx` — updated labels

### Cross-references
- Sprint 3 docs: `docs/sprint/sprint-3-beta-config-policy.md`
- DB schema ref: `docs/playiq-db-schema-and-project-structure.md`
