# Deployment Guide (Netlify) - Islamic Dataset Interface

This guide is written for the current repo configuration (Netlify).

## 1. What this repo supports out of the box

Netlify is set up via `netlify.toml`:

- Build output: `dist/`
- Build command: `npm install --legacy-peer-deps && npm run build:netlify`
- Build environment:
  - `NODE_VERSION = "20"`
  - `VITE_DISABLE_WORKERS = "true"`

Security headers are expected to come from `public/_headers` (Netlify automatically applies this file).

## 2. Prerequisites

- A Firebase project with Authentication + Firestore enabled
- A Firebase Web app (to obtain `VITE_FIREBASE_*` values)
- A Netlify site

## 3. Configure environment variables (Netlify UI)

Add these Netlify environment variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- (Optional) `VITE_FIREBASE_MEASUREMENT_ID`

Optional:

- `VITE_ENABLE_COPYRIGHT` (set to `"true"` to enable UI-level copyright protections)

Notes:

- The app only initializes Firebase when `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, and `VITE_FIREBASE_PROJECT_ID` are present.
- Do not commit secrets to Git.

## 4. Configure Firebase settings

You must update Firebase Authentication authorized domains for your Netlify site domain.

In the Firebase console:

- Authentication -> Sign-in method: enable Email/Password (and Email verification if desired)
- Authentication -> Authorized domains:
  - add your Netlify domain(s)

## 5. Deploy

Typical Netlify flow:

1. Connect the repository to Netlify
2. Ensure Netlify uses `netlify.toml` for build settings
3. Trigger a build
4. Confirm the site is live

## 6. Security headers / CSP expectations

This repo contains:

- `public/_headers` (Netlify header directives)
- `security-config.ts` (CSP values for development header injection)

Production expectation:

- Netlify should serve security headers defined in `public/_headers`.
- If CSP blocks resources, update `public/_headers` (and validate via the scripts in `package.json`).

