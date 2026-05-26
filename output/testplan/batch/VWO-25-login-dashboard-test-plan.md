# Test Plan — VWO Login Dashboard

> Source ticket: VWO-25 — Product Requirements Document: VWO Login Dashboard
> Author: Pramod (Reporter) · Date: 2026-05-26 · Status: Draft

## Table of Contents
1. Objective
2. Scope
3. Inclusions
4. Test Environments
5. Defect Reporting Procedure
6. Test Strategy
7. Test Schedule
8. Test Deliverables
9. Entry and Exit Criteria
10. Test Execution
11. Test Closure
12. Tools
13. Risks and Mitigations
14. Approvals

---

## Objective

Validate the VWO (Visual Website Optimizer) login dashboard — the secure entry point to VWO's experimentation, personalization, and analytics platform. Testing verifies email/password authentication, real-time input validation, password recovery, session management, theme support (Light/Dark Mode), and the new-user registration path, while confirming the page meets its security, performance, and accessibility commitments. The goal is to surface defects across functional, security, compatibility, accessibility, and performance dimensions before release, and to leave behind a repeatable manual test-case set plus an automated UI regression suite for the login flows.

**URL / System under test:** https://app.vwo.com

## Scope

1. **Functional Testing** — Verify login with valid/invalid credentials, Remember Me persistence, forgot-password/reset flow, registration (free-trial) link, and successful transition into the VWO dashboard.
2. **Data Validation Testing** — Validate email-format checks, password-field handling, on-blur real-time validation, password strength indicators, and field-level feedback.
3. **Error Handling Testing** — Confirm clear, actionable messages for invalid credentials, locked/unknown accounts, expired reset tokens, and network/timeout failures.
4. **Performance Testing** — Confirm login page loads within the 2-second target on a standard connection; verify asset optimization (compressed images, minified CSS/JS) and CDN delivery.
5. **Security Testing** — Verify HTTPS/TLS enforcement, encrypted credential transmission, secure session tokens, rate limiting / brute-force throttling, and OWASP authentication safeguards.
6. **Integration Testing** — Verify post-login handoff to the core VWO dashboard, login success/failure analytics tracking, optional 2FA, SSO (SAML/OAuth), and social login (Google/Microsoft) where enabled.
7. **Compatibility Testing** — Verify rendering and behavior across the supported desktop browser matrix and mobile (responsive, touch-friendly) layouts, in both Light and Dark Mode.
8. **Documentation Review** — Review this PRD and acceptance criteria for testability gaps and ambiguous requirements.
9. **Load Testing** — Validate behavior under thousands of concurrent login attempts against the 99.9% availability target.
10. **Regression Testing** — Re-run the login/auth suite after each build to confirm no regressions in existing flows (form, Remember Me, reset, theme toggle).
11. **Edge Case Testing** — Boundary and unusual inputs: max-length/empty fields, leading/trailing spaces, unicode emails, rapid repeated submits, expired sessions.
12. **Concurrency Testing** — Verify concurrent sessions, simultaneous reset requests, and parallel logins for the same account behave correctly.
13. **Ad Hoc / Exploratory Testing** — Unscripted probing of the login form, validation, theme switching, and recovery paths.
14. **Usability Testing** — Verify auto-focus on first field, clickable labels, loading-state feedback, mobile touch targets, and overall friction-free login experience.
16. **Rate Limiting Testing** — Confirm request throttling triggers correctly under repeated failed attempts and protects against brute force without locking out legitimate users.

> **Accessibility Testing** — Verify WCAG 2.1 AA conformance: screen-reader/ARIA labels, full keyboard navigation, high-contrast mode, and focus order across the login form.

> Scope may evolve during testing based on feedback, changing requirements, or discoveries. Review and adjust throughout the phase.

## Inclusions

**Login Page — Authentication**
- Successful login with a valid email and password lands the user on the VWO dashboard.
- Login rejected with a clear error for invalid password, unknown email, or empty fields.
- Remember Me checkbox persists the session across browser restarts when selected; does not when unselected.
- Optional 2FA challenge prompts and validates correctly when enabled for the account.
- Enterprise SSO (SAML/OAuth) and social login (Google/Microsoft) initiate and complete the external auth handoff where configured.

**Login Page — Input Validation & UX**
- Email field rejects malformed addresses with on-blur (real-time) feedback.
- Password strength/requirement indicators display appropriate visual feedback.
- Auto-focus lands on the first input field on page load; labels are clickable and focus their fields.
- Loading state is shown while authentication is in progress.

**Forgot Password / Recovery Flow**
- "Forgot Password" link initiates a reset; a secure, single-use token is generated and emailed.
- Reset link with a valid token allows setting a new password meeting complexity rules.
- Expired, reused, or tampered tokens are rejected with a clear message.

**Registration / New-User Flow**
- Free-trial / registration call-to-action navigates to the signup path with minimal friction.

**Theme & Responsive Behavior**
- Light Mode and Dark Mode render the login page correctly and persist the user's choice.
- Responsive layout adapts to mobile viewports with touch-friendly controls.

**Accessibility & Authorization**
- Full keyboard-only navigation and operation of all interactive elements.
- Screen-reader announces fields, errors, and controls via correct ARIA labels.
- High-contrast mode renders form elements legibly.

**Security & Error Handling**
- All login traffic served over HTTPS/TLS; credentials are not exposed in URLs, logs, or client storage.
- Repeated failed attempts trigger rate limiting / throttling without leaking which factor failed.
- Session timeout and secure session-token behavior on expiry/logout.

## Test Environments

| Name | Env URL |
|------|---------|
| QA | _(assumed — confirm)_ |
| Pre-Prod | _(assumed — confirm)_ |
| Production reference | https://app.vwo.com |

**Platform / browser matrix**
- Windows 10 — Chrome, Firefox, Edge
- macOS — Safari
- Android — Chrome
- iOS — Safari

Both Light Mode and Dark Mode to be exercised across the matrix. Mobile responsive layouts verified on at least one Android and one iOS device/emulator. Test accounts (standard user, SSO-enabled org, account with 2FA) required from the dev team _(assumed — confirm)_.

## Defect Reporting Procedure

- **Defect criteria:** deviation from requirements, UX issues, technical errors.
- **Reporting:** designated template, detailed reproduction steps, screenshots/logs attached.
- **Triage:** assign severity + priority; route to the right owner.
- **Tooling:** JIRA.
- **Roles / POCs:**

| Area | POC |
|------|-----|
| Frontend | _(assumed — confirm)_ |
| Backend | _(assumed — confirm)_ |
| DevOps | _(assumed — confirm)_ |

- **Communication:** channels + cadence for status updates to stakeholders; end-of-day defect status email to dev management.
- **Metrics:** defects found, time-to-resolve, fix rate.

## Test Strategy

**Step 1 — Design.** Create test scenarios and cases for everything in Scope using:
Equivalence Class Partitioning and Boundary Value Analysis (email/password field inputs and lengths), Decision Table (credential validity × Remember Me × 2FA/SSO state), State Transition (logged-out → authenticating → logged-in → session-expired; password-reset token lifecycle), and Use Case Testing (end-to-end login, recovery, and registration journeys); plus Error Guessing and Exploratory testing. Prioritize the cases.

**Step 2 — Execution flow.** Smoke test first (page loads, form renders, a known-good login succeeds); reject the build and wait for a stable one if smoke fails. On a stable build, run in-depth testing with the designed cases across the supported browser/OS matrix and both themes in parallel. Log bugs in JIRA and send an end-of-day defect status email to dev management. Cover smoke/sanity, regression/retest, usability, accessibility, security, and functionality & UI. Repeat cycles until the quality bar is met.

**Step 3 — Best practices.** Context-driven testing, shift-left testing, exploratory testing, end-to-end flow testing, and accessibility-first verification (keyboard + screen reader).

## Test Schedule

| Task | Dates |
|------|-------|
| Creating Test Plan | _(assumed — confirm)_ |
| Test Case Creation | _(assumed — confirm)_ |
| Test Case Execution | _(assumed — confirm)_ |
| Summary Reports Submission | _(assumed — confirm)_ |

> Estimated duration: 1–2 sprint(s). _(assumed — confirm; no sprint/fix version on ticket)_

## Test Deliverables

- Test Plan
- Test Scenarios / Test Cases (manual case set in test management tool)
- Defect Reports
- Automation suite (UI regression for login flows, e.g. Playwright/Selenium) _(assumed — confirm framework)_
- Test Summary Report

## Entry and Exit Criteria

### Requirement Analysis
- **Entry:** Testing team receives requirements/ticket details.
- **Exit:** Requirements explored and understood; doubts cleared.

### Test Execution
- **Entry:** Scenarios/cases signed off by client; application ready for testing.
- **Exit:** Test case reports and defect reports ready.

### Test Closure
- **Entry:** Test case reports and defect reports ready.
- **Exit:** Test Summary Report delivered.

## Test Execution

- Run smoke/sanity on each new build before deeper passes; block on smoke failure.
- Execute prioritized functional, validation, error-handling, security, accessibility, compatibility, and usability cases across the browser/OS matrix and both themes.
- Track success metrics from the PRD: login success rate (target 95%+), page load time (sub-2-second target), and defect counts.
- Log defects in JIRA with severity/priority; retest fixes and run regression on affected flows.

## Test Closure

- Confirm all planned cases executed and exit criteria met; no open critical/high defects.
- Compile the Test Summary Report (coverage, pass/fail, defect metrics, residual risk) and circulate for approval.

## Tools

- JIRA — bug tracking
- UI automation framework (Playwright/Selenium) _(assumed — confirm)_
- Browser dev tools / Lighthouse — performance and accessibility checks
- Screen reader (NVDA/VoiceOver) and axe/WAVE — accessibility verification
- Mind map tool, screenshot tool, Word/Excel docs

## Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Non-availability of a resource | Backup resource planning |
| Build/URL not working | Resources work on other tasks |
| Less time for testing | Ramp resources up dynamically per client need |
| SSO/2FA/social-login providers not configured in test envs | Stub/mock providers or obtain pre-provisioned test accounts; mark those cases blocked until available |
| No QA/Pre-Prod env URLs or test accounts supplied on the ticket | Confirm environments and seed test accounts (standard, SSO org, 2FA) before execution starts |
| Production system under test (app.vwo.com) — risk of polluting live data / triggering rate limits | Use dedicated non-prod env and throwaway test accounts; coordinate rate-limit/brute-force tests with the team |

## Approvals

Documents sent for client approval before proceeding to the next step:
- Test Plan
- Test Scenarios
- Test Cases
- Reports

> Testing continues to the next step only once approvals are done.
