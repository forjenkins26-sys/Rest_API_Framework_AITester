# Test Plan — VWO App Login Failure (Valid Credentials)

> Source ticket: VWO-26 — Login failure on VWO app (https://app.vwo.com/#/login) with valid credentials
> Author: Pramod (Reporter) _(assumed — confirm QA lead/owner)_ · Date: 2026-05-26 · Status: Draft

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

Verify and confirm the fix for the reported login failure on the VWO web application, where users entering valid credentials at the login screen receive an error message and are not logged in or redirected to the dashboard. The goal is to reproduce the defect, validate that authentication with valid credentials succeeds end-to-end (login → session established → dashboard redirect), and guard against regression across supported browsers and devices. Coverage targets manual confirmation of the happy-path login plus negative, error-handling, and session behaviors; an automated UI regression check for the login flow should be added so this critical-path defect cannot recur.

**URL / System under test:** https://app.vwo.com/#/login

## Scope

1. **Functional Testing** — Confirm a user with valid credentials can submit the login form and is authenticated and redirected to the dashboard; verify the previously failing flow now succeeds.
2. **Error Handling Testing** — Verify the application no longer surfaces an erroneous failure message for valid credentials, and that genuine error states (invalid credentials, locked/disabled accounts) still produce correct, clear messages.
3. **Data Validation Testing** — Validate handling of the username/email and password fields (format, trimming, case sensitivity, special characters, max length) so valid inputs are accepted.
4. **Security Testing** — Confirm authentication, session/token issuance, and redirect behave correctly; check that error messages do not leak whether the failure is username vs. password, and that credentials are transmitted over HTTPS.
5. **Integration Testing** — Verify the login UI correctly integrates with the authentication/identity backend and session service so a successful auth results in a valid session and dashboard load.
6. **Compatibility Testing** — Reproduce/confirm the login flow across the supported browser and OS matrix (the ticket does not state the user's environment, so cross-browser coverage is required to scope the defect).
7. **Usability Testing** — Confirm form labels, focus order, "remember me" / "forgot password" links, loading/spinner states, and error placement behave correctly during login.
8. **Accessibility Testing** — Verify the login form is keyboard-navigable, fields have proper labels/ARIA, and error messages are announced to assistive technology. _(assumed — confirm a11y is in scope)_
9. **Regression Testing** — Re-run the broader authentication and post-login navigation suite to ensure the fix does not break adjacent flows (logout, session timeout, SSO if applicable).
10. **Edge Case Testing** — Cover boundary and unusual inputs: leading/trailing whitespace in credentials, very long passwords, special characters, rapid repeated submits, and slow/intermittent network.
11. **Ad Hoc / Exploratory Testing** — Time-boxed exploration around the login screen and immediate post-login state to surface related defects.

> Scope may evolve during testing based on feedback, changing requirements, or discoveries. Review and adjust throughout the phase.

> _Performance, Load, Concurrency, Rate-Limiting, CI/CD, Internationalization, and Backup/Recovery testing are out of scope for this bug-fix verification — the ticket gives no signal for them. Re-introduce if the root cause turns out to be load/throttling related._

## Inclusions

**Login Screen — Happy Path (valid credentials)**
- Navigate to https://app.vwo.com/#/login, enter valid username/email and password, click Submit → user is authenticated, no error message appears, and the user is redirected to the dashboard.
- Confirm a valid session/auth token is established and persists on dashboard load.
- Verify "remember me" (if present) keeps the session on browser reopen. _(assumed — confirm control exists)_

**Login Screen — Negative & Error Handling**
- Invalid password with valid username → correct, clear error message; no redirect.
- Unknown / non-existent username → correct error message; no redirect.
- Empty username and/or empty password → field-level validation prevents submit.
- Locked / disabled / unverified account → appropriate, distinct messaging. _(assumed — confirm these states exist)_
- Confirm the originally reported false-failure (error shown despite valid credentials) is no longer reproducible.

**Login Screen — Data Validation / Boundary**
- Leading/trailing whitespace in username/email is handled (trimmed or rejected consistently).
- Email/username case-insensitivity behaves per spec; password case-sensitivity enforced.
- Special characters and maximum-length values in password are accepted for valid accounts.

**Session, Redirect & Navigation**
- After successful login the dashboard fully loads; deep-link/redirect-back-to-intended-page works if a protected URL was requested pre-login.
- Logout returns to the login screen and invalidates the session.
- Session timeout / expiry redirects back to login cleanly. _(assumed — confirm timeout behavior)_

**Cross-Browser / Device**
- Reproduce and verify the login flow on each browser/OS in the matrix below.

**Accessibility & Usability**
- Tab order, field labels, visible focus, and screen-reader announcement of the error/success states on the login form.

## Test Environments

| Name | Env URL |
|------|---------|
| Production (reported) | https://app.vwo.com/#/login |
| QA | _(assumed — confirm QA URL)_ |
| Pre-Prod / Staging | _(assumed — confirm pre-prod URL)_ |

**Platform / browser matrix**
- Windows 10/11 — Chrome, Firefox, Edge
- macOS — Safari, Chrome
- Android — Chrome
- iOS — Safari

> The ticket reports the defect only against the production login URL and does not specify the reporter's OS/browser/network. Cross-browser/device coverage is therefore required to confirm whether the failure is environment-specific. _(assumed — confirm where the fix will be verified)_

## Defect Reporting Procedure

- **Defect criteria:** deviation from requirements, UX issues, technical errors.
- **Reporting:** designated template, detailed reproduction steps, screenshots/logs, browser+OS, and network conditions attached. Capture HTTP requests/responses and console errors for any auth failure.
- **Triage:** assign severity + priority; route to the right owner. (This login-blocking defect is treated as high impact — users cannot access the platform.)
- **Tooling:** JIRA.
- **Roles / POCs:**

| Area | POC |
|------|-----|
| Frontend | _(assumed — confirm)_ |
| Backend / Auth | _(assumed — confirm)_ |
| DevOps | _(assumed — confirm)_ |

- **Communication:** channels + cadence for status updates to stakeholders; end-of-day defect status to dev management during the verification window.
- **Metrics:** defects found, time-to-resolve, fix rate, login success rate post-fix.

## Test Strategy

**Step 1 — Design.** Create test scenarios and cases for everything in Scope using:
Equivalence Class Partitioning and Boundary Value Analysis (username/password input fields), Decision Table (credential validity × account state × "remember me"), State Transition (logged-out → authenticating → logged-in → session expired → logged-out), and Use Case Testing (end-to-end login → dashboard). Always include Error Guessing and Exploratory testing around the failing flow. Prioritize the happy-path-with-valid-credentials case (the reported defect) first.

**Step 2 — Execution flow.** Smoke test first — confirm the login page loads and a valid-credential login now succeeds; if smoke fails, reject the build and wait for a stable one. On a stable build, run in-depth testing with the designed cases across the supported browser/device matrix in parallel. Log bugs in JIRA and send an end-of-day defect status email to dev management. Cover smoke/sanity, regression/retest of authentication and post-login navigation, usability, and functionality & UI. Repeat cycles until the quality bar is met.

**Step 3 — Best practices.** Context-driven testing, shift-left testing, exploratory testing, and end-to-end flow testing (login through dashboard). Add an automated UI regression test for the valid-credential login path so this critical defect is continuously guarded.

## Test Schedule

| Task | Dates |
|------|-------|
| Creating Test Plan | 2026-05-26 _(assumed — confirm)_ |
| Test Case Creation | _(assumed — confirm)_ |
| Test Case Execution | _(assumed — gated on fix availability)_ |
| Summary Reports Submission | _(assumed — confirm)_ |

> Estimated duration: 1 sprint. _(assumed — no fix version or due date on the ticket)_

## Test Deliverables

- Test Plan
- Test Scenarios / Test Cases (manual checklist for the login flow)
- Defect Reports (with reproduction evidence: screenshots, network/console logs)
- Automation suite (UI regression test for the login happy path — framework _(assumed — confirm, e.g. Playwright/Selenium)_)
- Test Summary Report

## Entry and Exit Criteria

### Requirement Analysis
- **Entry:** Testing team receives the ticket details (VWO-26) and reproduction steps.
- **Exit:** Reproduction steps understood and the failing flow reproduced/characterized; doubts cleared.

### Test Execution
- **Entry:** Fix is deployed to a testable environment; scenarios/cases signed off; application ready for testing.
- **Exit:** Test case reports and defect reports ready; valid-credential login confirmed working across the matrix.

### Test Closure
- **Entry:** Test case reports and defect reports ready.
- **Exit:** Test Summary Report delivered; defect VWO-26 verified fixed (or reopened with evidence).

## Tools

- JIRA — bug tracking
- UI automation framework — _(assumed — confirm, e.g. Playwright or Selenium)_
- Browser DevTools / network capture — request/response and console inspection for auth failures
- Mind map tool, screenshot tool, Word/Excel docs

## Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Non-availability of a resource | Backup resource planning |
| Build/URL not working | Resources work on other tasks |
| Less time for testing | Ramp resources up dynamically per client need |
| Defect is environment/browser-specific and not reproducible in QA | Test across the full browser/OS matrix; capture reporter's exact environment and network conditions |
| No QA/staging env with valid test accounts | Confirm test credentials and non-prod env before execution; avoid validating only against production |
| Root cause is backend/auth (not UI) | Coordinate with backend/auth owner; capture full request/response and server logs during repro |
| Login is a critical, high-blast-radius path | Add automated regression test and run full auth regression suite before sign-off |

## Approvals

Documents sent for client approval before proceeding to the next step:
- Test Plan
- Test Scenarios
- Test Cases
- Reports

> Testing continues to the next step only once approvals are done.
