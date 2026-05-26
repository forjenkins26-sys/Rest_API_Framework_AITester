# Test Plan — VWO Login Error with Valid Credentials

> Source ticket: VWO-100 — Login error on app.vwo.com with valid credentials
> Author: Pramod _(reporter; QA owner assumed — confirm)_ · Date: 2026-05-26 · Status: Draft

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

Verify and confirm the fix for the reported login failure on app.vwo.com, where users entering a valid username and password receive an error after clicking the submit button instead of being authenticated and signed in. The goal is to reproduce the defect, validate that valid-credential logins succeed end to end (form submission → authentication → redirect to the authenticated dashboard), and run regression around the authentication flow to ensure no related sign-in paths are broken. Testing covers the login screen behavior, error messaging, and session establishment across supported browsers and platforms.

**URL / System under test:** https://app.vwo.com (login screen)

## Scope

1. **Functional Testing** — Confirm that valid username/password credentials authenticate successfully and land the user on the post-login dashboard without error.
2. **Data Validation Testing** — Verify the login form correctly accepts well-formed credentials and rejects malformed input (empty fields, whitespace, casing of email) with appropriate messaging.
3. **Error Handling Testing** — Confirm the previously reported post-submit error no longer occurs for valid credentials, and that genuine error states (wrong password, locked account) surface clear, correct messages.
4. **Security Testing** — Validate authentication handling: credentials transmitted over HTTPS, session/token issued correctly on success, no credential leakage in errors, and invalid credentials are rejected.
5. **Integration Testing** — Verify the front-end login form integrates correctly with the authentication/back-end service and session management on success and failure.
6. **Compatibility Testing** — Confirm login works across the supported browser/OS matrix, since the original report did not isolate a single environment.
7. **Regression Testing** — Re-test surrounding authentication paths (logout, re-login, "remember me", password reset entry point) to ensure the fix introduced no side effects.
8. **Edge Case Testing** — Cover boundary conditions: very long valid passwords, special characters in credentials, trailing spaces, rapid repeated submits.
9. **Usability Testing** — Confirm the login screen provides clear feedback (loading state on submit, readable error text, focus handling) so users are not left in an ambiguous state.
10. **Accessibility Testing** — Verify the login form is keyboard-navigable, fields/labels are screen-reader friendly, and error messages are announced (WCAG-aligned). _(assumed — confirm accessibility is in scope for this fix)_
11. **Ad Hoc / Exploratory Testing** — Unscripted probing of the login flow to surface defects beyond the scripted cases.

> Scope may evolve during testing based on feedback, changing requirements, or discoveries. Review and adjust throughout the phase.

## Inclusions

**Login Screen — Happy Path (valid credentials)**
- Enter a valid username and valid password, click submit → user is authenticated and redirected to the dashboard with no error (primary defect reproduction/verification).
- Confirm a valid session/token is established and persists on the authenticated landing page.
- Verify the submit button shows a loading/disabled state during the request and re-enables appropriately.

**Login Screen — Negative / Error Handling**
- Valid username + wrong password → correct "invalid credentials" message, no unhandled error.
- Empty username and/or empty password → field-level validation messages; submit blocked or handled gracefully.
- Malformed email/username format → appropriate validation feedback.
- Confirm the originally reported generic error after submit does NOT appear for valid credentials.

**Authentication & Session**
- Successful login issues a session and grants access to protected pages.
- Logout after login, then re-login with the same valid credentials succeeds (regression).
- Direct access to a protected page while logged out redirects to login.

**Boundary / Data Validation**
- Trailing/leading whitespace in username field handled per spec.
- Maximum-length and special-character passwords accepted when valid.
- Case sensitivity of the username/email handled correctly.

**Compatibility / Cross-Environment**
- Repeat the happy-path login on each supported browser/OS in the matrix below to confirm the fix is environment-agnostic.

## Test Environments

| Name | Env URL |
|------|---------|
| QA | _(assumed — confirm QA URL)_ |
| Pre-Prod | _(assumed — confirm pre-prod URL)_ |
| Production (reported) | https://app.vwo.com |

**Platform / browser matrix**
- Windows 10 — Chrome, Firefox, Edge
- macOS — Safari
- Android — Chrome
- iOS — Safari

> Valid test account credentials with login access are required to execute the happy-path cases. _(assumed — confirm test account provisioning)_

## Defect Reporting Procedure

- **Defect criteria:** deviation from requirements, UX issues, technical errors.
- **Reporting:** designated template, detailed reproduction steps, screenshots/logs (including browser console + network response on submit) attached.
- **Triage:** assign severity + priority; route to the right owner.
- **Tooling:** JIRA (project VWO).
- **Roles / POCs:**

| Area | POC |
|------|-----|
| Frontend | _(assumed — confirm)_ |
| Backend / Auth service | _(assumed — confirm)_ |
| DevOps | _(assumed — confirm)_ |

- **Communication:** channels + cadence for status updates to stakeholders. _(assumed — confirm)_
- **Metrics:** defects found, time-to-resolve, fix rate.

## Test Strategy

**Step 1 — Design.** Create test scenarios and cases for everything in Scope using: Equivalence Class Partitioning and Boundary Value Analysis (credential input fields), Decision Table (valid/invalid username × valid/invalid password × empty), State Transition (logged-out → submitting → logged-in / error), and Use Case testing (end-to-end sign-in). Always include Error Guessing and Exploratory testing around the submit action and error states. Prioritize the valid-credential happy path as the primary verification.

**Step 2 — Execution flow.** Smoke test the login screen first; reject the build and wait for a stable one if smoke fails. On a stable build, run in-depth testing with the designed cases across supported environments in parallel. Capture console and network evidence on the submit request. Log bugs in JIRA and send an end-of-day defect status email to dev management. Cover smoke/sanity, regression/retest, usability, functionality & UI. Repeat cycles until the quality bar is met.

**Step 3 — Best practices.** Context-driven testing, shift-left testing, exploratory testing, and end-to-end flow testing of the authentication journey.

## Test Schedule

| Task | Dates |
|------|-------|
| Creating Test Plan | 2026-05-26 |
| Test Case Creation | _(assumed — confirm)_ |
| Test Case Execution | _(assumed — confirm; pending fix delivery)_ |
| Summary Reports Submission | _(assumed — confirm)_ |

> Estimated duration: 1 sprint. _(assumed — confirm; no sprint/fix version on ticket)_

## Test Deliverables

- Test Plan
- Test Scenarios / Test Cases (manual case sheet)
- Defect Reports
- Automation suite (UI regression for login — framework _(assumed — confirm, e.g. Playwright/Selenium)_)
- Test Summary Report

## Entry and Exit Criteria

### Requirement Analysis
- **Entry:** Testing team receives requirements/ticket details (VWO-100).
- **Exit:** Requirements explored and understood; doubts cleared (expected behavior on valid login confirmed).

### Test Execution
- **Entry:** Scenarios/cases signed off; the login fix is deployed and the application is ready for testing.
- **Exit:** Test case reports and defect reports ready.

### Test Closure
- **Entry:** Test case reports and defect reports ready.
- **Exit:** Test Summary Report delivered; valid-credential login confirmed working across the matrix.

## Tools

- JIRA — bug tracking
- UI automation framework _(assumed — confirm, e.g. Playwright or Selenium)_
- Browser DevTools — console/network inspection of the submit request
- Mind map tool, screenshot tool, Word/Excel docs

## Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Non-availability of a resource | Backup resource planning |
| Build/URL not working | Resources work on other tasks |
| Less time for testing | Ramp resources up dynamically per client need |
| Defect not reproducible (intermittent / environment-specific) | Capture console + network logs, test across the full browser/OS matrix, gather original reporter's environment details |
| No valid test account / login access | Provision dedicated QA credentials before execution |
| Fix not yet delivered (ticket in "To Do") | Sequence execution after dev delivery; verify on a stable build only |

## Approvals

Documents sent for client approval before proceeding to the next step:
- Test Plan
- Test Scenarios
- Test Cases
- Reports

> Testing continues to the next step only once approvals are done.
