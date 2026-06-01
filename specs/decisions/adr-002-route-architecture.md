# ADR-002: Next.js App Router Multi-Page Architecture

## Status
Accepted

---

## Context
As Occasionly expands from a basic birthday alert utility into a **Relationship Memory Platform**, a client-filtered single page (`page.tsx`) suffers from critical limitations:
- **Visual Clutter**: Keeping Settings, Conflict logs, and full Analytics on a single scroll flow increases cognitive load.
- **Resource Footprint**: The entire calendar, timeline, grid, and log components must load simultaneously, increasing load times.
- **Lack of Deep Linking**: Users cannot bookmark specific views (like a detailed contact profile, calendar, or settings panel) directly in the browser.

---

## Decision
We decided to migrate Occasionly to a modular **Next.js App Router Multi-Page Architecture** by grouping hub pages inside an authenticated app group `(app)/`:
- Introduce a persistent shell layout `layout.tsx` that binds standard layouts (`AppShell`) across routing navigations.
- Extract sections into absolute sub-routes: `/dashboard`, `/calendar`, `/people`, `/analytics`, `/settings`, `/notifications`, and `/contact/[id]`.
- Keep the `Add Reminder` creation form global inside `AppShell` to allow universal event additions from any screen.
- Establish client-side HTML5 Event dispatchers to notify open pages when IndexedDB modifications occur.

---

## Alternatives Considered
*   **Alternative A (Zustand-filtered Views)**: Toggle sections programmatically based on store parameters. Replaced because it doesn't support browser history, back/forward buttons, or deep links.
*   **Alternative B (Full Server-side components)**: Render database events on Next.js server components. Replaced because it breaks offline-first, local IndexedDB persistence, which is a core constitution principle.

---

## Consequences

### Positive Benefits
*   **Deep Link Navigation**: Direct links to particular contacts (e.g. `/contact/123-abc`) or hubs.
*   **Navigational Caching**: Sub-pages are bundled independently, optimizing performance.
*   **Clutter Cleanup**: Dashboard scroll is now extremely focused and professional.

### Negative Trade-offs
*   **Event Coordination Overhead**: Requires event-saved hooks (`event-saved` listeners) to trigger client-side data refetches during layout updates.

---

## Related Specs
*   [Product Specification](file:///specs/product/spec.md)
*   [Engineering Constitution](file:///specs/constitution.md)
