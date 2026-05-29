# High-Priority Product Backlog

These are the immediate, high-impact backlog items on the Occasionly relationship roadmap, targeted for the next development sprints.

---

## 1. Web Push Notification Engine
- **Spec**: `specs/features/push-notifications.md` (To be created spec-first)
- **Goal**: Trigger pre-alerts directly on desktop/mobile native OS views without requiring the app to be active.
- **Acceptance Criteria**:
  - Request browser notifications permission elegantly.
  - Deliver pre-alerts exactly at the configured timing offsets.
  - Degrade gracefully to in-app banners when push permission is denied.

## 2. Dynamic Contact Profiles
- **Spec**: `specs/features/contact-profiles.md`
- **Goal**: A slide-over profile drawer details page progressively disclosing personal relationship details: gift histories, notes, and interactive interests recommendations.
- **Acceptance Criteria**:
  - Toggles dynamically when clicking a reminder card card.
  - Contains tag-based interests arrays.

## 3. Schema Versioning & CLI Migrations
- **Spec**: `specs/decisions/supabase-migrations.md`
- **Goal**: Set up versioned CLI migrations under `/supabase/migrations` representing the cloud PostgreSQL table layouts.
- **Acceptance Criteria**:
  - Zero manual DB changes on the live production tables.
  - Local database schemas bootstrap cleanly using migration scripts.
