# Post-Deploy Verification (Production) - Islamic Dataset Interface

After deploying to your production host, verify the following:

## 1. Basic availability

1. Load the homepage.
2. Confirm routing works (Search, Charts, Quran, Hadith, Favorites, Auth screens).
3. Confirm light/dark mode toggle works and persists.

## 2. Security headers and CSP

1. Open DevTools -> Network, click the main document, and confirm security headers are present.
2. Open DevTools -> Console and check for CSP violations.
3. If CSP errors occur:
   - run the repo scripts locally to isolate the blocking directive:
     - `npm run test:headers:quick`
     - `npm run test:csp`
     - `npm run test:security`

Repo files to cross-check:

- `public/_headers` (production headers applied by host)
- `security-config.ts` (CSP values used by dev header injection)

## 3. Firebase integration

1. Authentication:
   - sign up (if enabled)
   - log in
   - log out
2. Firestore reads:
   - verify search results load
   - verify Quran/Hadith pages populate
3. Firestore writes:
   - add/remove a favorite
   - verify favorites persist after refresh

If auth fails, confirm the production environment variables are present and Firebase Auth authorized domains match your production domain.

## 4. Data migration behavior (if you use it)

If you run migration/reset flows, note:

- `src/firebase/migration.ts` contains a `clearAllData()` stub that is not fully implemented.

## 5. Core user flows

Verify these “smoke tests”:

- Search returns relevant items for at least 2 queries (including Arabic where applicable).
- Favorites exports works (export favorites as JSON from Favorites page).
- Export functionality (CSV/JSON) works from the relevant screens.

