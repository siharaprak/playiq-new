# Decision Log

| Date | Decision | Rationale | Status |
| --- | --- | --- | --- |
| 2026-04-11 | Selected Supabase over Firebase | Requires relational data strength for nested mastery tracking and parent/child associations. | Approved |
| 2026-04-11 | Adopt Next.js + App Router | Industry standard for SSR/SEO compatible dashboard shells. | Approved |
| 2026-04-11 | Restrict `profiles.role` to single string. | Keep Phase 1 simple. If a user needs dual roles, we will migrate to a `user_roles` join table subsequently. | Approved |
