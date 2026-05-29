# Product Specification — Occasionly Relationship OS

## 1. Executive Summary
Occasionly is a premium, local-first relationship intelligence platform designed to help people build and maintain deep, meaningful human connections. Unlike simple calendar alerts or invasive social networks, Occasionly focuses on progressive disclosure, local data ownership, offline-first reliability, and AI-assisted empathy to act as a complete Relationship OS.

---

## 2. Core Functional Features

### 2.1 Occasion Management
- **9 Support Types**: Birthdays, Anniversaries, Graduations, Work Anniversaries, First Meetings, Memorials, Festivals, Promotions, and Custom Occasions.
- **Categorization**: Grouped into Personal (❤️), Career (💼), Memories (🕯️), and Celebrations (🎉) for clean filtering.
- **Visual Identity**: Unique custom icons, HSL-tailored gradients, and badges per event type.

### 2.2 Reminder Engine
- **Timing & Offsets**: Configure same-day alerts or pre-alert options (1 day, 2 days, 3 days, 1 week, 2 weeks, 1 month before).
- **Timezone Awareness**: Localized reminder delivery time (e.g., exactly at 09:00 local time).
- **Recurrence**: Standard yearly recurring schedule.

### 2.3 Relationship Enrichment
- **Progressive Data Cards**: All optional fields:
  * *Nickname* (e.g., "Dad", "Chief")
  * *Interests & Hobbies* (comma-separated lists)
  * *Gift Ideas*
  * *Notes, inside jokes, and memory histories*
  * *Relationship Connection Types* (Friend, Family, Partner, Colleague, Mentor, Acquaintance, Other)

### 2.4 AI-Powered Empathy Engine
- **Contextual Wish Generator**: Fully integrated with the Gemini API to craft bespoke greetings using connection type, years/age milestone, nickname, interests, and notes.
- **Tone Profiles**: Warm/Heartfelt, Funny/Playful, Emotional/Deep, Formal/Polished, Professional, and Inspirational.
- **WhatsApp Ready**: Outputs under 30 words, with no automated hashtags or quotation marks, formatted for direct copy-paste.

### 2.5 WhatsApp Deep Integration
- **Click-to-Send Links**: Deep links via `https://wa.me/{number}?text={encodedWish}` to launch native WhatsApp or WhatsApp Web instantly.
- **No API Dependencies**: Completely free and independent of corporate WhatsApp Business API restrictions.

### 2.6 Local-First Architecture
- **Dexie.js Persistence**: Fast, structured IndexedDB storage on the client side.
- **Sync Queue**: Actions taken while offline are queued and processed automatically when a connection is established.

### 2.7 Cloud Sync System
- **Supabase Authentication**: Standard email and Google OAuth logins.
- **Realtime Coordination**: Subscribes to Postgres Changes to reflect edits across multiple devices instantly.
- **Conflict Strategy**: Simple, robust *Last-Write-Wins* strategy guided by versioning counters.

### 2.8 Analytics Dashboard
- ** center stage Stats**: Total Connections, Life Milestones, Deep Memories, and Upcoming.
- **Occasion Distribution**: Clean category metrics.
- **Completion rate**: Logs showing successfully sent reminders vs missed/ignored ones.

---

## 3. Product User Stories

- **As a busy professional**, I want to receive a notification 2 days before my manager's work anniversary so that I have time to organize a team gift card.
- **As a friend**, I want to generate a personalized wish for my best friend using their interests (e.g., Football and Tacos) so that I can send a warm message that doesn't feel generic.
- **As a user**, I want to add a reminder while on a flight (offline) and have it save instantly, knowing it will sync to the cloud once my device reconnects.
- **As a private person**, I want my connection data stored on my browser locally and only sync if I choose to login, maintaining full control.

---

## 4. Technical and Non-Functional Requirements

| Metric | Target |
|---|---|
| **Local Response Time** | Latency < 16ms (Instant IndexedDB read/writes) |
| **Production Build** | Static page prerendering (App router bundle sizes optimized) |
| **Offline Capability** | 100% features available offline (except Gemini generation & OAuth login) |
| **Operational Costs** | $0/mo (Runs entirely on Supabase free tier & browser storage) |
| **Accessibility** | Semantic HTML5 markup, responsive layouts from 360px mobile to 1440px+ |

---

## 5. Edge Cases & Resilience Strategy

- **Unreachable Supabase Endpoint**: If Supabase is paused, offline, or blocked by a proxy, services must swallow network errors gracefully, allowing local Dexie flows to proceed uninterrupted.
- **Sync Conflict**: If two edits occur on the same contact across devices, version counters match the higher version first and fall back to last-update timestamp.
- **Age Milestone Overflow**: Year counters must automatically calculate correctly (startingYear > currentYear triggers logical safe fallbacks).

---

## 6. Product Acceptance Criteria
- [ ] No duplicated actions (FAB is the sole entry point, top Command Palette is the sole search).
- [ ] Changing categories in the dashboard filter immediately updates the list grid.
- [ ] Clicking "Generate Wish" opens the wish drawer and lets you copy or launch WhatsApp directly.
- [ ] Sidebar and navigation elements remain fixed and responsive across viewport scrolling.
