# Core Engineering & Architecture Rules

This document outlines the strict guidelines and coding standards that must be adhered to by all developers and subagents working on the **Occasionly** codebase.

---

## 1. Separation of Concerns & Clean UI Architecture

### 1.1 No Business Logic in UI Components
UI components (`/src/components/*`) must act as pure presentation layers. All core mathematical logic, dates offsets calculations, priority definitions, and formatting rules must be encapsulated inside specialized service modules (`/src/services`) or custom React hooks.

### 1.2 No Direct Database/Supabase Calls from UI
Interactive buttons and fields must never issue direct queries or fetch payload requests directly using the Supabase client or raw Dexie transactions. All updates and reads must pass through designated abstraction services:
- **Incorrect**: `await supabase.from("events").insert(...)` inside a card component.
- **Correct**: `await addEvent(...)` from `/src/services/event-service.ts`.

---

## 2. Synchronization & Persistence Rules

### 2.1 Sync Operations must be Queue-Safe
Client updates must be written to the local database immediately and push a tracking transaction into the sync queue. Operations must never await remote networks inside local state updates, ensuring high offline reliability.

### 2.2 Schema Management is CLI Migration-Driven
Ad-hoc alterations to table structures on the cloud console are strictly prohibited. All PostgreSQL edits must be generated locally and applied as versioned migrations under `/supabase/migrations` via the Supabase CLI.

### 2.3 Realtime Isolation
Updates triggered via Supabase Postgres Changes listeners must update local Dexie schemas safely after a version check, and must never trigger a recursive callback write to the sync queue.

---

## 3. Specifications & Governance

### 3.1 Spec-First Engineering is Mandatory
Every major feature, route change, or service restructuring requires a dedicated markdown specification file inside `specs/` (following `/specs/templates/feature-spec-template.md`) BEFORE implementation may start.

### 3.2 Consistent Null-Guards
External integrations (such as AI generation, desktop push notifications, or synchronization) must include robust client null-guards to ensure that the core app works offline without crashing if environment variables or network routes are unconfigured.
