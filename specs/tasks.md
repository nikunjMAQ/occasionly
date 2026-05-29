# Backlog Task Board — Occasionly Relationship OS

This roadmap represents the backlog tasks generated directly from our specifications (`constitution.md`, `spec.md`, `plan.md`) to guide future design and implementation phases.

---

## 1. Missing Product Gaps

### 1.1 Push Notification Engine
- [ ] Specify and configure Service Worker Web Push notifications to trigger pre-alerts directly on desktop/mobile native viewports.
- [ ] Add notification settings to let users choose pre-alert days for categories individually.

### 1.2 Comprehensive Relationship Profile
- [ ] Create a detailed Contact Profile Page drawer (`/profile/:id`) progressively disclosing gift ideas, event histories, past sent logs, and personalized interests.
- [ ] Implement interest tag recommendations using standard prompts to match gift ideas.

---

## 2. Operational Hardening & Sync Resilience

### 2.1 Sync Queue Diagnostics
- [ ] Create a "Sync Activity Monitor" inside the settings dialog to let users inspect pending actions, offline queues, and resolved conflicts.
- [ ] Add explicit retry mechanisms to manual sync actions.

### 2.2 Schema CLI Migrations
- [ ] Generate versioned migration scripts via Supabase CLI for the PostgreSQL database.
- [ ] Set up local DB schema seed scripts for easy onboarding.

---

## 3. UI Polish & Accessibility (A11y)

### 3.1 Keyboard Shortcuts Navigation
- [ ] Wire Command Palette shortcuts (e.g., `⌘N` to trigger Add Event modal, `⌘,` to open Settings modal).
- [ ] Ensure full keyboard navigation (`Tab` index focus traps) across all Radix dropdowns, buttons, and custom forms.

### 3.2 Premium Card Animations
- [ ] Add subtle stagger mount animations (`staggerChildren` via Framer Motion) to the `ReminderGrid` cards.
- [ ] Configure smooth spring transitions when elements slide inside the `UpcomingTimeline` list.

---

## 4. Mobile Responsiveness & PWA Support

### 4.1 PWA Manifest & Offline Caching
- [ ] Optimize the `next-pwa` compilation to ensure assets are fully precached for complete offline launches.
- [ ] Create a custom "Add to Home Screen" prompt chip.

### 4.2 Touch Gestures
- [ ] Add touch swipe gestures to mobile reminder grid items (e.g., swipe right to copy wish, swipe left to trigger action dropdown).
