# UI & Design Governance Principles

This document establishes the UI Design governance rules and design token rules for **Occasionly** to maintain a visually stunning, premium, and unified interface.

---

## 1. Governance Rules

### 1.1 No Duplicate Primary Actions
There must only ever be one primary action anchor visible per viewport. All duplicate creators (such as topbar or header buttons) are prohibited. All creation goes through the universal Floating Action Button (FAB).

### 1.2 Dashboard Prioritizes Emotional Context
The dashboard stats and widgets must highlight human-centered milestones (e.g. *Total Connections*, *Life Milestones*, *Deep Memories*) rather than cold developer-centric logs or tables. Emojis, customized badges, and personal nicknames should take center stage.

### 1.3 Secondary Actions in Menus (Progressive Disclosure)
Do not clutter card footers with a array of edit/delete/share buttons. The primary CTA on a contact card is the most useful action (e.g. *Generate AI Wish*). All auxiliary actions (Edit, Delete, Open WhatsApp link) must be tucked inside a clean secondary `...` dropdown menu.

### 1.4 Warm Empty States
Empty states must feel supportive and human, not technical. Provide actionable, supportive copy (e.g. *"No moments this week. A calm week ahead. Maybe it's time to reconnect with someone unexpectedly."*) rather than raw "No data found".

### 1.5 Consistent Glassmorphism
All dashboards widgets, forms, and cards must share a unified glassmorphism theme using the `GlassCard` layout overlay (`bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]`).

---

## 2. Spacing & Layout Rhythm
- **Rhythm Wrapper**: Standard dashboard sections use `SectionBlock` wrappers with a `py-10 border-t border-white/5` separator to establish pacing.
- **Grids**: Use grid compositions based on columns of 12 (desktop grid: 8-column main content, 4-column sidebar context).
- **Gaps**: Standard gap between dashboard items is `gap-6` (24px) or `gap-8` (32px).

---

## 3. Typography Scale & Hierarchy

| Class | Tag | Usage |
|---|---|---|
| **Tracking tracked** | `p className="text-[10px] tracking-[0.25em] uppercase font-bold text-gray-500"` | Section uppercase labels (e.g. OVERVIEW) |
| **Section Heading** | `h2 className="text-2xl font-bold text-white tracking-tight"` | Primary widget titles |
| **Card Header** | `h3 className="text-lg sm:text-xl font-bold text-white"` | Avatar / Name cards |
| **Muted Desc** | `p className="text-xs text-gray-500 mt-1"` | Inline detail descriptions |

---

## 4. Visual Color Palette (Dark first)
- **Base Background**: Sleek dark space `#0b0d12` augmented with large radial blur gradients (`violet-600/10` and `blue-500/8`).
- **Surface**: Glass overlays (`bg-white/[0.03]`) and dark panels (`bg-[#12141c]`).
- **Primary Accent**: Brand Violet (`#7c3aed`).
- **Borders**: Highly subtle border structures (`border-white/5` or `border-white/10`).

---

## 5. Motion & Interaction Principles
- **Mounts**: Dashboard cards fade and slide into view with spring properties (`duration: 0.3`, `y: 12`).
- **Hover States**: Cards lift smoothly on hover (`whileHover={{ y: -5 }}`) and trigger a premium top linear glow lines (`opacity-100 transition-opacity`).
- **Micro-interactions**: Buttons scale slightly on tap (`whileTap={{ scale: 0.97 }}`).
