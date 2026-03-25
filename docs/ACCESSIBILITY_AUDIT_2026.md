# Accessibility Audit 2026 (WCAG 2.1 AA)

## Scope

This checklist tracks WCAG 2.1 AA conformance for the Islamic Dataset Interface application.

- Audit date: 2026-03-25
- Standard: WCAG 2.1 Level AA
- Method: code review + implementation verification checklist

## Compliance status summary

- Automated tool validation: **Pending**
- Manual keyboard/screen reader validation: **Pending**
- Legal compliance claim readiness: **Not ready to claim full conformance until pending checks pass**

## WCAG 2.1 AA Pass/Fail checklist

Legend:

- `[PASS]` implemented in code and reviewed
- `[FAIL]` missing or insufficient
- `[PENDING]` requires manual or automated test evidence

### 1. Perceivable

- `[PENDING]` **1.1.1 Non-text Content**: images/icons have appropriate alt text or decorative treatment
- `[PENDING]` **1.3.1 Info and Relationships**: semantic structure/labels remain correct across all pages
- `[PENDING]` **1.3.2 Meaningful Sequence**: reading and focus order stays logical
- `[PENDING]` **1.4.3 Contrast (Minimum)**: text contrast >= 4.5:1 in light/dark themes
- `[PENDING]` **1.4.11 Non-text Contrast**: focus indicators and component boundaries meet contrast requirements

### 2. Operable

- `[PASS]` **2.4.1 Bypass Blocks**: skip link now wired in app shell (`Skip to main content`) and targets `#main-content`
- `[PASS]` **2.4.7 Focus Visible**: main search input focus style updated to visible ring; focus indicators present on key controls
- `[PASS]` **2.1.1 Keyboard**: icon-only auth actions now include proper button semantics and accessible labels
- `[PASS]` **2.1.2 No Keyboard Trap**: terms/privacy modal now traps focus correctly and supports Escape to close
- `[PENDING]` **2.4.3 Focus Order**: verify full tab sequence across routes and modal transitions

### 3. Understandable

- `[PASS]` **3.3.2 Labels or Instructions**: password visibility toggles now expose explicit accessible names
- `[PENDING]` **3.3.1 Error Identification**: verify all forms expose errors programmatically (`role="alert"` / associations) across app
- `[PENDING]` **3.3.3 Error Suggestion**: verify all validation failures provide actionable guidance

### 4. Robust

- `[PASS]` **4.1.2 Name, Role, Value**: close buttons and password toggles updated with explicit names/roles/states
- `[PASS]` **4.1.2 Name, Role, Value**: terms/privacy modal includes `role="dialog"`, `aria-modal`, and `aria-labelledby`
- `[PENDING]` **4.1.3 Status Messages**: verify dynamic status updates are announced where needed

## Changes implemented in this audit cycle

1. Added global skip link wiring and target:
   - `src/App.tsx`
2. Improved focus-visible behavior in search input:
   - `src/components/HomePage.tsx`
3. Added accessible names/states for password visibility controls:
   - `src/components/features/auth/LoginForm.tsx`
   - `src/components/features/auth/SignupForm.tsx`
4. Added missing accessible close button labels:
   - `src/components/features/auth/Login.tsx`
   - `src/components/features/auth/Signup.tsx`
5. Implemented modal accessibility semantics and keyboard support:
   - `src/components/features/auth/Signup.tsx`
   - Includes `role="dialog"`, `aria-modal`, title association, Escape handling, and focus trap.

## Required evidence before claiming full legal conformance

1. Run automated checks (axe/Lighthouse/WAVE) on key routes.
2. Run keyboard-only testing across:
   - homepage
   - search/filter
   - auth forms
   - modal dialogs
3. Screen reader smoke test (NVDA or VoiceOver) for critical flows.
4. Contrast verification for text and focus indicators in both themes.

Until the above evidence is captured, keep public wording as:

- "Accessibility improvements in progress"
- Avoid "fully WCAG 2.1 AA compliant" claims.
