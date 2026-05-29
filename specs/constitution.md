# Occasionly — Engineering & Design Constitution

This constitution serves as the foundational source of truth and governance model for all design, architectural, and implementation decisions made on **Occasionly**. Every developer, subagent, and system component must strictly adhere to these principles.

---

## Core Principles

### 1. Spec-First Development
All major features, services, and structural refactors must begin with a formal specification (`specs/`) before any code is written. Development must follow a strict lifecycle: **Constitution → Specify → Plan → Tasks → Implement**.

### 2. Local-First Architecture
The application must remain fully functional offline. The local client database (**Dexie.js IndexedDB**) acts as the primary, authoritative storage mechanism. All reads, writes, and interface updates must be completed locally first without waiting for network responses.

### 3. Sync Resilience over Sync Speed
Synchronization with the cloud must prioritize reliability and durability over real-time delivery speed. Sync actions must be idempotent, retry-safe, queue-driven, and conflict-aware, tolerating network loss gracefully.

### 4. Progressive Disclosure UX
The user interface must prioritize visual clarity and minimize cognitive duplication. Show only what is necessary at any given moment. De-clutter layouts by hiding advanced inputs, actions, and settings behind contextually appropriate disclosure mechanisms (like drawers, dialogs, and clean secondary dropdowns).

### 5. Optional Enrichment Philosophy
Occasionly respects user privacy and minimal input friction. Only a person's name and event date are required. Relationship enrichment data—such as nicknames, tones, interests, gift ideas, and notes—must always remain optional and progressively available.

### 6. Strong Separation of Concerns
UI components must remain clean, focused, and free of direct database access, network fetch operations, or raw business logic. Business rules, data sync queues, and database reads/writes must live in dedicated service layers (`/src/services`) and custom hooks.

### 7. Migration-Driven Database Management
All cloud database schema changes must be versioned, documented, and applied via Supabase CLI migrations. Ad-hoc schema updates on live production databases are strictly prohibited.

### 8. Security-First Cloud Architecture
Row Level Security (RLS) is mandatory on all cloud tables in Supabase. Under no circumstances may data be readable or writeable without strict owner verification.

### 9. Realtime Augments Sync, Not Replaces It
Supabase Realtime subscriptions should be used to enrich user experience and instantly reflect changes across tabs or active devices. However, the durable local sync queue remains the source of sync reliability.

### 10. Consistent Premium UI Language
Maintain a cohesive, high-end, and immersive visual design system. Occasionly utilizes sleek glassmorphism-inspired overlays (`GlassCard`), clean typography, tailwind color harmonies, custom color-coded event badges, and subtle micro-animations (Framer Motion) to stand out as a premium product.

### 11. Accessibility and Responsiveness are Mandatory
Every interface component and product flow must degrade gracefully and work beautifully on both phone-sized screens and ultra-wide desktop grids. All interactive elements must have unique, descriptive IDs for browser automation testing.

### 12. Graceful Degradation
External operations (such as AI wish generation, desktop push notifications, or synchronization) must degrade gracefully when offline or when external endpoints fail, without blocking core reminder and list access functionality.

### 13. Observability and Traceability
Major synchronization states, conflicts, offline actions, and automated check schedules must be traceable through logs and system diagnostics visible to the user and developer.

### 14. Incremental Delivery
Avoid monolithic, sweeping rewrites. All changes must be delivered in small, incrementally testable steps and verified through automated compilation, build, and manual visual testing.

### 15. Human-Centered Product Philosophy
Occasionly exists to strengthen meaningful human relationships, not to capture user attention, maximize engagement metrics, or display invasive popups. All product features must serve to deepen genuine human bonds.
