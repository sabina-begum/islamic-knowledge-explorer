# Secrets and Safe Defaults (Islamic Dataset Interface)

## Treat these as secrets

Even though Firebase keys are not the same as long-lived database passwords, you should still treat these as sensitive and do not commit them:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- (Optional) `VITE_FIREBASE_MEASUREMENT_ID`

The repo’s `.gitignore` already excludes `.env*` files.

## Safe defaults / behavior without Firebase

If `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, and `VITE_FIREBASE_PROJECT_ID` are missing, Firebase is not initialized (`src/firebase/config.ts`) and the app falls back to local data behavior.

Production implication: make sure your production environment variables are set, otherwise user auth and Firestore features will not work.

## Platform flags

- `VITE_DISABLE_WORKERS`
  - When truthy, the app disables worker-based optimization paths in `src/hooks/useOptimizedDataWithWorkers.ts`.
  - Your `netlify.toml` sets this to `"true"` during Netlify builds.

## Copyright protection toggle

- `VITE_ENABLE_COPYRIGHT`
  - When set to `"true"`, `src/utils/copyrightProtection.ts` initializes UI-level protections.
  - `verifyIntegrity()` is currently a stub that returns `true`, so treat this as UI protection rather than a cryptographic integrity guarantee.

## Don’t document secrets in plain text

In production docs, always list variable names (and expected types/values format), not actual API key values.

