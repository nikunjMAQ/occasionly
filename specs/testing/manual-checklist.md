# Master Manual Testing & Validation Checklist

This checklist outlines the exact manual validation sequences to verify the integrity and stability of Occasionly before any deployment releases.

---

## 🔐 1. Authentication Validation (Auth)
- **Login Procedures**:
  - [ ] **First-Time Login**: Sign in with new credentials. Verify that local Dexie store initializes cleanly with empty connection states.
  - [ ] **Returning Login**: Sign out and sign back in. Verify that connections are automatically fetched from Supabase and populated in local IndexedDB database.
  - [ ] **Session Persistence**: Refresh the active dashboard page or close/reopen browser tabs. Verify that login credentials and user profiles remain logged in.
- **Logout Procedures**:
  - [ ] **Logout Flow**: Click the "Logout" button. Verify active route automatically redirects to the landing login gate, session tokens clear, and IndexedDB cache handles securely without leakage.
  - [ ] **Route Protection**: Try accessing `/dashboard`, `/calendar`, or `/people` directly in the URL bar after logging out. Verify that server redirects automatically block access.
- **Multi-Tab Sessions**:
  - [ ] **Concurrent Logins**: Open two separate tabs. Verify both show correct active session states.
  - [ ] **Tab Cross-Clear**: Log out on Tab A. Verify that Tab B automatically triggers session expiration or redirects to the login screen on the next operation.

---

## 📡 2. Offline-First Validation (Offline)
- **Offline Writes**:
  - [ ] **Airplane Mode Write**: Disconnect your internet connection (or toggle Offline in Chrome DevTools).
  - [ ] **Connection Creation**: Click the global floating FAB and create a new reminder connection.
  - [ ] **Local Verification**: Verify the card displays instantly in the grid, marked with a pending local status indicator (Offline-First local database write success).
- **Offline Persistence**:
  - [ ] **Cache Reload**: Refresh your browser page while remaining offline.
  - [ ] **State Integrity**: Verify the newly created pending connection remains perfectly displayed in your directory.

---

## 🔄 3. Synchronization Queue Validation (Sync)
- **Auto-Sync Trigger**:
  - [ ] **Queue Flush**: Reconnect your internet connection.
  - [ ] **Synchronization Sync**: Verify the background processor automatically triggers, flushing the local sync queue.
  - [ ] **Supabase Verification**: Open the Supabase database console. Verify that the new connection is written into the events table with its correct flat columns.

---

## ⚡ 4. Realtime Channels Validation (Realtime)
- **Bidirectional Live Updates**:
  - [ ] **Cross-Device Simulation**: Open two browser screens side-by-side (e.g. desktop browser and mobile emulator) logged into the same account.
  - [ ] **Card Editing**: Edit a connection profile on Device A (e.g., change interest tags or preferred tone).
  - [ ] **Realtime Propagation**: Verify that Device B updates its connection card live in under 1 second without manual browser refreshes.

---

## ⚔️ 5. Conflict Resolution Validation (Conflict)
- **Last-Write-Wins Verification**:
  - [ ] **Parallel Edits**: Open the same connection profile on Device A and Device B while offline.
  - [ ] **Conflicting Saves**: Modify the relationship notes on Device A to "Notes version A", and on Device B to "Notes version B". Save both.
  - [ ] **Sync Execution**: Reconnect both devices.
  - [ ] **Resolution Review**: Verify that the latest version saved successfully merges without duplicate key collisions (Last Write Wins strategy).
  - [ ] **Audit Logs**: Open the Settings Hub. Verify that conflict logs are successfully created and can be audited in the conflict history drawer.

---

## 📱 6. Mobile Layout & Gesture Validation (Mobile)
- **Responsive Widths**:
  - [ ] **Mobile Breakpoints**: Use Chrome DevTools to test widths down to iPhone SE (`375px`), Android Galaxy (`412px`), and iPad (`768px`).
  - [ ] **Sidebar Drawer**: Verify the fixed sidebar collapses. Click the menu trigger and verify the sheet drawer slides out smoothly without overlaps.
  - [ ] **Grid Spacing**: Verify that Connection cards adjust margins automatically and text fields are perfectly readable without grid overlaps.
  - [ ] **Accessible FAB**: Verify the floating FAB sits comfortably in the bottom-right corner, accessible to touch thumbs, without covering underlying list buttons.

---

## 🗺️ 7. Deep-Link & Route Validation (Routes)
- **Route Navigation**:
  - [ ] **Direct Access**: Copy-paste deep URLs (e.g., `/settings` or `/contact/[id]`) directly into a blank tab. Verify correct rendering.
  - [ ] **Page Refresh**: Reload `/calendar` or `/people` pages. Ensure no hydration mismatches or 404 router crashes occur.
  - [ ] **Navigation History**: Click standard browser "Back" and "Forward" buttons. Verify view states transition gracefully.

---

## 🤖 8. AI Memory & prompt Validation (AI)
- **Wish Generation**:
  - [ ] **Dynamic Prompts**: Click the "Generate AI Wish" button on any connection card.
  - [ ] **Diagnostic Checks**: Confirm that generated wishes match selected tones (funny, warm, formal) and respect relationship tags accurately in under 30 words.
  - [ ] **Error Fallback**: Disconnect internet or clear Gemini keys and verify the local hardcoded fallback wish returns gracefully.

---

## 💬 9. WhatsApp Integration Validation (WhatsApp)
- **Share Actions**:
  - [ ] **WhatsApp Link Mapping**: Click the "WhatsApp" action button on a connection card or within the wish generator.
  - [ ] **Payload Verification**: Verify it opens a new browser window mapping to `https://wa.me/[number]?text=[encoded_text]`, containing the generated wish and phone number correctly.

---

## 💾 10. Database Backup & Restore Validation (Backup/Restore)
- **Data Portability**:
  - [ ] **Export Backup**: Go to Settings Hub, click "Export Backup", and save the generated `occasionly-backup.json` file.
  - [ ] **Cache Reset**: Clear your browser's IndexedDB state (or delete the app cache via DevTools). Verify the dashboard resets to a clean empty state.
  - [ ] **Import Backup**: Upload the `occasionly-backup.json` file via the "Import Backup" selector.
  - [ ] **Data Integrity**: Verify all connections, reminder logs, and notifications are instantly populated back into IndexedDB.

---

## 🛡️ 11. Row-Level Security Validation (RLS)
- **Multi-Tenant Protection**:
  - [ ] **User Isolation**: Log in to Account A. Copy an event's ID.
  - [ ] **Cross-User Block**: Log out and log in to Account B.
  - [ ] **Access Test**: Attempt to query the copied event ID of Account A using direct API queries.
  - [ ] **Policy Enforcement**: Verify that Supabase returns a `404 Not Found` or empty dataset, confirming that Account B cannot access or mutate Account A's relational data.
