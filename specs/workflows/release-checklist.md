# Release Workflow Checklist

Structured checklist to prepare and deploy a clean, secure production release of Occasionly.

---

## 🛠️ 1. Environment Configurations & Validation
- [ ] Confirm `.env.example` lists all necessary deployment environment keys.
- [ ] Verify `.env.local` is present in `.gitignore` so secrets are never pushed to GitHub.
- [ ] Confirm `src/lib/env.ts` is fully integrated and compiles type-safety checks successfully.

---

## 💾 2. Supabase Migrations & Row-Level Security (RLS)
- [ ] Verify all migrations inside `supabase/migrations/` are applied locally.
- [ ] Confirm RLS is enabled for all target database tables:
  ```sql
  alter table events enable row level security;
  ```
- [ ] Confirm active CRUD authorization policies (SELECT, INSERT, UPDATE, DELETE) are enabled restricting operations via `auth.uid() = user_id`.
- [ ] Make sure that database indexes are configured on `user_id` and JSONB queries for optimal sync lookup times:
  ```sql
  create index if not exists idx_events_user_id on events(user_id);
  create index if not exists idx_events_occasion_date on events ((data->>'recurringDate'));
  ```

---

## 📦 3. Optimization Bundles & Compilation Checks
- [ ] Verify complete project type safety with zero warnings:
  ```bash
  npx.cmd tsc --noEmit
  ```
- [ ] Run optimized production build compiles using standard bundles:
  ```bash
  npm.cmd run build
  ```
- [ ] Inspect build reports and verify route static generation is handled without build blockers.

---

## 🚀 4. Vercel Cloud Deployments
- [ ] Connect target GitHub repository to Vercel dashboard.
- [ ] Configure environment variables in Vercel settings panel:
  * `NEXT_PUBLIC_SUPABASE_URL`
  * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  * `NEXT_PUBLIC_GEMINI_API_KEY`
- [ ] Trigger deployment build.
- [ ] Verify PWA registrations compile cleanly on production domains.
