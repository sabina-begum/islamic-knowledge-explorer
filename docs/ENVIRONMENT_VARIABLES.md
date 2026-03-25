# Environment Variables (Islamic Dataset Interface)

This document lists the environment variables your app expects at build-time/runtime (Vite `import.meta.env.*`).

## Required (Firebase-enabled mode)

Firebase is initialized only when these variables are present:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`

For full Firebase functionality, also provide:

- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Optional (used in Firebase config shape; analytics is currently commented out in code):

- `VITE_FIREBASE_MEASUREMENT_ID`

## Optional feature flags (codebase-supported)

- `VITE_DISABLE_WORKERS`
  - When truthy, workers are disabled in `src/hooks/useOptimizedDataWithWorkers.ts` (Netlify config sets this).
- `VITE_ENABLE_COPYRIGHT`
  - When set to `"true"`, the copyright protection module initializes (see `src/utils/copyrightProtection.ts`).

## Variables referenced in docs/examples (not currently used by runtime code)

These appear in docs examples but are not referenced by the application code as runtime flags:

- `VITE_ENABLE_ANALYTICS`
- `VITE_ENABLE_REAL_TIME_UPDATES`
- `VITE_ENABLE_SEARCH_SUGGESTIONS`
- `VITE_ENABLE_DEBUG_LOGGING`

## Example `.env` (use your own values)

```env
# Firebase (required for Firebase features)
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID

# Optional
VITE_FIREBASE_MEASUREMENT_ID=G-YOUR_MEASUREMENT_ID
VITE_DISABLE_WORKERS=true

# Optional module toggle
VITE_ENABLE_COPYRIGHT=false
```

## Where each variable is used

- `VITE_FIREBASE_*`: `src/firebase/config.ts` (Firebase initialization + service handles)
- `VITE_DISABLE_WORKERS`: `src/hooks/useOptimizedDataWithWorkers.ts`
- `VITE_ENABLE_COPYRIGHT`: `src/utils/copyrightProtection.ts`

