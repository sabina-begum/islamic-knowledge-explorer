# Runbook (Production Triage) - Islamic Dataset Interface

Use this when the production app has issues. Start with the symptom, then follow the checks.

## Quick triage checklist

1. Confirm the problem is reproducible in a private/incognito window.
2. Capture the browser Console errors and the failing Network request (request URL + status code).
3. Verify your deployment is serving the expected build (no stale cache if possible).

## 1. CSP / security header failures

Symptoms:

- Console shows CSP violations
- Some resources (scripts/styles/images) fail to load

What to check:

1. Confirm the response headers exist in production (CSP + security headers).
2. Compare the host-applied headers to `public/_headers`.
3. If CSP blocks a required domain, update `public/_headers` and redeploy.

Repo commands to run locally to isolate:

- `npm run test:headers:quick`
- `npm run test:csp`
- `npm run test:security`

Files to review:

- `public/_headers`
- `security-config.ts`
- `scripts/test-csp-compliance.js` (how CSP is evaluated)

## 2. Firebase Auth failures

Symptoms:

- Login/signup fails
- Auth appears to be “not configured”

What to check:

1. Confirm Netlify environment variables are set:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
2. In Firebase console, ensure your production domain is added to:
   - Authentication authorized domains
3. If the issue is permission-related, verify Firestore rules as well.

Files to review:

- `src/firebase/config.ts` (Firebase initialization gating)
- `firestore.rules`

## 3. Firestore “permission denied” errors

Symptoms:

- Read/write fails for search results or favorites

What to check:

1. Confirm the user is authenticated (if the operation requires it).
2. Validate collection/document paths match the security rules.
3. Update `firestore.rules` carefully and redeploy.

Files to review:

- `firestore.rules`
- `src/firebase/firestore.ts` (where the operations are defined)

## 4. Search returns empty or inconsistent results

Symptoms:

- Search yields zero results
- Quran/Hadith pages don’t populate

What to check:

1. Confirm dataset loading works:
   - Ensure local JSON datasets referenced by hooks exist and are bundled.
2. Worker-related behavior:
   - Netlify builds set `VITE_DISABLE_WORKERS=true` via `netlify.toml`.
3. Check for errors from data processing:
   - Browser Console + any thrown errors.

Files to review:

- `src/hooks/useQuranData.ts`
- `src/workers/dataProcessor.ts`
- `src/hooks/useOptimizedDataWithWorkers.ts`

## 5. “Clear all data” or reset functionality doesn’t work

Symptoms:

- A reset button says it succeeded but no data was cleared

What to check:

1. `src/firebase/migration.ts` `clearAllData()` is a stub and does not implement deletes.

Action:

- Don’t rely on this for production resets; implement Firestore delete operations if you need this feature.
