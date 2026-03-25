# Production-Ready Docs Plan (Islamic Dataset Interface)

## Purpose

Make the app deployable and supportable in production by ensuring the documentation matches what the code actually does, and by covering operational readiness (configuration, security headers/CSP, monitoring, runbooks, and release checks).

## Related Production Docs

- `docs/ENVIRONMENT_VARIABLES.md`
- `docs/SECRETS_AND_SAFE_DEFAULTS.md`
- `docs/DEPLOYMENT_GUIDE.md`
- `docs/POST_DEPLOY_VERIFICATION.md`
- `docs/RUNBOOK.md`
- `docs/RELEASE_CHECKLIST.md`
- `docs/PLATFORM_DECISION_CHECKLIST.md`

## What I found (potentially unfinished / production-risk items)

### Code-level gaps / placeholders to document or finalize

1. Password reset is not implemented.
   - In `src/components/features/auth/LoginForm.tsx`, the “Forgot password” button is a `TODO`.
   - Production decision needed: implement Firebase `sendPasswordResetEmail`, or change UI/labels to reflect current behavior.
2. “Clear all data” / migration reset is not implemented.
   - In `src/firebase/migration.ts`, `clearAllData()` returns a placeholder success (and only warns in `import.meta.env.DEV`).
   - Production decision needed: implement the Firestore delete methods used by the migration service, or explicitly mark it as development-only.
3. Copyright “integrity verification” is a stub.
   - In `src/utils/copyrightProtection.ts`, `verifyIntegrity()` always returns `true`.
   - Production decision needed: document what is actually enforced (UI protection only vs integrity checks), and what `VITE_ENABLE_COPYRIGHT` does in production.
4. Semantic search is intentionally simplified.
   - In `src/utils/semanticSearch.ts`, conceptual matching is a “for now” simplified keyword/concept mapping.
   - Production decision needed: document limitations and expected relevance behavior, or define the next step for improved matching.
5. Favorites page rendering does not match “favorites across all data types”.
   - In `src/pages/Favorites.tsx`, items without `title` and `type` are skipped (example: Quran/Hadith items).
   - Production decision needed: either finish support for Quran/Hadith favorites or update the feature docs/marketing claims.
6. Error reporting is not wired to a real external service.
   - In `src/components/layout/ErrorBoundary.tsx`, “Report Error” shows an alert (“For now, just show an alert”).
   - Production decision needed: connect to an error reporting tool (or document that alerts are the current behavior).
7. Monitoring metrics are not fully implemented/exported.
   - In `src/utils/performanceMonitor.ts`, render monitoring is a placeholder (dev console logs).
   - Production decision needed: document where metrics go today (if anywhere) and whether production collection exists.

### Production-risk configuration/documentation placeholders

1. CSP allows a placeholder Firebase frame source.
   - In `security-config.ts` and `public/_headers`, `frame-src` includes `https://my-new-app-b6cfd.firebaseapp.com`.
   - Even if `https://*.firebaseapp.com` already covers most cases, replace/remove the placeholder to avoid confusion and avoid accidental CSP mismatch.
2. CSP environment consistency needs verification.
   - `security-config.ts` production CSP and `public/_headers` must match expectations for workers (`worker-src`) and external resources.

### Documentation items explicitly marked incomplete

1. Monitoring setup and license-violation monitoring have unchecked tasks.
   - `docs/MONITORING_SETUP.md` contains many `- [ ]` checklist items.
   - `docs/VIOLATIONS_LOG.md` contains unchecked “response procedure” checklist items.
2. User management guide lists future enhancements still unchecked.
   - `docs/USER_MANAGEMENT_GUIDE.md` lists features (social auth, 2FA, roles, offline-first, CI/CD, security audit tools) as `- [ ]` planned.
   - Production decision needed: clarify what is shipped vs future work.
3. Docs include placeholder values.
   - Examples: `docs/SECURITY.md` uses `CSP_REPORT_URI=https://your-domain.com/csp-report`, and Firebase docs use `G-XXXXXXXXXX`.
   - Production doc set should define what values to use and where to paste them.

## Production docs deliverables

### A. Configuration & environment docs (must be accurate)

1. Create `docs/ENVIRONMENT_VARIABLES.md`
   - Single source of truth for required `VITE_*` variables.
   - Include dev vs production flags (for example: `VITE_DISABLE_WORKERS`, `VITE_ENABLE_COPYRIGHT`).
   - Include “where it’s used” pointers (e.g., Firebase config uses `VITE_FIREBASE_*`).
2. Create `docs/SECRETS_AND_SAFE_DEFAULTS.md`
   - What should never be committed (`.env*`, tokens).
   - Safe local defaults / “no Firebase configured” behavior.

### B. Deployment docs (repeatable and verifiable)

1. Create `docs/DEPLOYMENT_GUIDE.md`
   - How to build and deploy (Firebase Hosting, Netlify, Vercel).
   - How security headers are applied:
     - Netlify: `public/_headers` + `netlify.toml` build settings.
     - Vercel: if using `vercel.json` headers, document it (or confirm not needed).
   - Confirm required build flags, including whether `VITE_DISABLE_WORKERS` is set by the platform (Netlify currently does).
2. Create `docs/POST_DEPLOY_VERIFICATION.md`
   - Concrete steps to verify:
     - App loads on production URL.
     - CSP reports show no violations.
     - Firebase auth and Firestore access work as expected.
     - Search and favorites behave consistently with docs.

### C. Operational docs (monitoring + runbooks)

1. Update `docs/MONITORING_SETUP.md`
   - Assign an owner and record who/where (Google Alerts, GitHub monitoring, manual social checks).
   - Convert `- [ ]` items into either:
     - “Completed: date + link”, or
     - “Deferred: reason + target date”.
2. Create `docs/RUNBOOK.md`
   - Incident response flow:
     - CSP violation spikes (what to check, how to mitigate).
     - Login/auth errors (common causes: wrong Firebase config, Auth rules).
     - Firestore permission denied errors (rules mismatch).
     - Performance regressions (worker settings, query size).
   - Include links to existing scripts:
     - `npm run test:security`
     - `npm run test:headers:quick`
     - `npm run test:csp`
3. Update `docs/VIOLATIONS_LOG.md`
   - Finish unchecked response procedures or explicitly mark them as “to be filled”.

### D. Release quality & security docs (gates)

1. Create `docs/RELEASE_CHECKLIST.md`
   - Checklist that must pass before “Production” tag/release:
     - `npm run type-check`
     - `npm run lint`
     - `npm run build` (or `build:netlify` depending on target)
     - `npm run test:security`
     - Manual smoke tests (auth, search, favorites, exports)
   - Record the URLs/environment used for the checks.
2. Update `docs/SECURITY.md` and `docs/SECURITY_HEADERS_GUIDE.md`
   - Replace placeholder domains/URIs with project-specific ones.
   - Ensure CSP values match:
     - `security-config.ts`
     - `public/_headers`
   - Add “CSP verification command” and “CSP report interpretation” steps.

### E. Feature behavior documentation (align marketing with code)

1. Update `docs/FIREBASE_INTEGRATION_README.md` / `docs/DATA_INTEGRATION_README.md`
   - Document what is live vs stubbed:
     - Migration reset/clear data limitations.
     - Worker behavior and platform flags.
2. Update `docs/COPYRIGHT.md`
   - Clarify what `VITE_ENABLE_COPYRIGHT` does in practice (UI protections vs integrity verification).
3. Update `docs/USER_MANAGEMENT_GUIDE.md`
   - Clearly label “implemented in current build” vs “planned”.
   - Specifically address favorites support if it affects user expectations.

## Execution plan (docs work order)

1. Decide shipping scope for unfinished code paths
   - For each “Code-level gap” item above: implement now vs document limitation vs defer.
2. Create `ENVIRONMENT_VARIABLES.md` and `SECRETS_AND_SAFE_DEFAULTS.md`
   - This unblocks every other doc because deployment and security depend on accurate env naming.
3. Create `DEPLOYMENT_GUIDE.md` and `POST_DEPLOY_VERIFICATION.md`
   - Focus on making deployments repeatable and verifiable.
4. Update monitoring/license-violation docs (`MONITORING_SETUP.md`, `VIOLATIONS_LOG.md`)
   - Replace unchecked placeholders with either completion details or deferred rationale.
5. Create `RUNBOOK.md` and `RELEASE_CHECKLIST.md`
   - Add commands and decision trees so support can respond without guessing.
6. Patch security docs to remove placeholder values and sync CSP
   - Ensure CSP is consistent across `security-config.ts` and `public/_headers`.
7. Align feature docs with current behavior
   - Favorites, auth flows (password reset), error reporting, and migration reset.

## Definition of done (docs)

1. A new deployer can follow the docs to deploy to the chosen platform without asking questions.
2. A responder can follow the runbook to triage CSP/auth/Firestore issues with minimal context.
3. All remaining `- [ ]` items in monitoring/user-management docs are either completed or explicitly deferred with a date/reason.
4. All placeholder URIs/domains in security/config docs are replaced with project-specific values or explicitly marked “example”.
