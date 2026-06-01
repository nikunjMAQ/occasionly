# Production Deploy Preparation Checklist

Use this checklist to systematically prepare and deploy clean, stable, and hardened releases of Occasionly.

---

## 🏗️ 1. Staging Environment Validation
- **Local Sandbox Checks**:
  - [x] Run `npx.cmd tsc --noEmit` and confirm zero TypeScript compiler warnings exist.
  - [x] Verify Next.js production bundler compiles successfully:
    ```bash
    npm.cmd run build
    ```
- **Environmental Integrity**:
  - [x] Confirm all environment keys in `.env.local` correspond to the staging environment.
  - [x] Verify that no production API keys or tokens are stored in standard files.

---

## 💾 2. Supabase Cloud Migration Check
- **Schema Validation**:
  - [x] Verify all database migrations inside `supabase/migrations/` match the production target.
  - [x] Check migration status:
    ```bash
    npx.cmd supabase db remote commit
    ```
  - [x] Push local database alterations successfully:
    ```bash
    npx.cmd supabase db push
    ```
- **RLS Policy Audit**:
  - [x] Verify that RLS is active on `events`, `notifications`, and `reminder_logs` tables.
  - [x] Confirm that SELECT, INSERT, UPDATE, and DELETE actions are locked down individually to `auth.uid() = user_id`.

---

## 🚀 3. Preview Deployments (Vercel)
- **Preview Release Flow**:
  - [x] Commit current code to GitHub to trigger a Vercel preview deployment.
  - [x] Add preview variables in the Vercel Settings Panel:
    * `NEXT_PUBLIC_SUPABASE_URL`
    * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    * `NEXT_PUBLIC_GEMINI_API_KEY`
- **Domain Verification**:
  - [x] Access the generated preview URL on a separate mobile device.
  - [x] Validate basic offline additions and sync queue flushes on production domains.
  - [x] **Active Vercel URL**: [https://occasionly-umber.vercel.app](https://occasionly-umber.vercel.app)

---

## 📦 4. Production Release Gates
- **Production URL Validation**:
  - [ ] Promote the verified preview build to Production on Vercel.
  - [ ] Perform a full smoke test (Auth → Event FAB Creation → AI Wish → WhatsApp share) on the live production URL.
  - [ ] Inspect the live browser console to ensure zero hydration issues or hydration mismatches are detected.
  - [ ] Verify PWA assets (manifest, sw.js) compile and register successfully under SSL certificates.
