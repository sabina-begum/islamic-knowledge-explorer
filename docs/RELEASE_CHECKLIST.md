# Release Checklist - Islamic Dataset Interface

Use this checklist before you mark a release as production.

## 0. Confirm scope

1. Verify what deployment target you are releasing to (Netlify).
2. Confirm required Firebase variables are available in that environment.

## 1. Code quality gates (local)

Run:

1. `npm run type-check`
2. `npm run lint`
3. `npm run test:run`
4. `npm run build:fast`

## 2. Security gates (recommended)

Run:

1. `npm run test:security`

And optionally:

1. `npm run security:audit`

## 3. Build for Netlify (optional but recommended parity)

Run:

1. `npm run build:netlify`

Note: Netlify also sets `VITE_DISABLE_WORKERS=true` during the build.

## 4. Manual smoke tests

1. Load each main tab: Home/Search/Charts/Quran/Hadith/Favorites.
2. Auth flow: sign up (if enabled) and log in/out.
3. Favorites:
   - Add a favorite
   - Refresh the page
   - Confirm it remains favorited
4. Export:
   - Export favorites as JSON
   - Export from the relevant data screens (CSV/JSON)
5. Search:
   - Run at least one query in English
   - Run at least one query in Arabic (if applicable)

## 5. Verify security headers in production

1. Confirm CSP/security headers are present on the live site.
2. Confirm there are no CSP errors in the browser console during smoke tests.

## 6. Record release info

Record the following for traceability:

- Release version (git tag or release name): `________`
- Deployed URL: `________`
- Environment used (Netlify site name): `________`
- Date/time: `________`

## CI note (what GitHub Actions currently covers)

The repo workflow `.github/workflows/ci.yml` runs:

- `npm run type-check`
- `npm run lint`
- `npm run test:run`
- `npm run build:fast`

Security tests (`npm run test:security`) are not part of the current CI workflow, so run them manually before release.

