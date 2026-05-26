# Test Plan — app.vwo.com Availability & Access Restoration

> Source ticket: VWO-101 — app.vwo.com is not working
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

The application hosted at app.vwo.com is currently not working — users are unable to access the site, resulting in service disruption. The objective of this test effort is to verify that, once the root cause is investigated and fixed, the VWO web application is reachable, loads correctly, and that its core user-facing flows (login, dashboard, primary navigation) function as expected across supported browsers and devices. Testing will confirm availability, validate that no regression was introduced by the fix, and ensure the outage cannot silently recur undetected. As this is a Medium-priority production outage bug, the focus is restoration verification plus a targeted regression pass rather than full new-feature certification.

**URL / System under test:** https://app.vwo.com

## Scope

1. **Functional Testing** — Verify the site loads and core flows (page load, login/authentication, dashboard render, primary navigation) work after the fix.
2. **Error Handling Testing** — Confirm graceful behavior on partial failures (proper error pages, no blank/5xx/white screens, meaningful messaging instead of raw stack traces).
3. **Performance Testing** — Validate page load and time-to-interactive are within acceptable thresholds once availability is restored; confirm the site responds rather than timing out.
4. **Integration Testing** — Verify dependencies the outage may have touched (DNS, TLS/SSL certificate, CDN, load balancer, backend API/auth services) resolve and respond correctly.
5. **Compatibility Testing** — Confirm the restored site renders and functions across the supported browser/OS/device matrix (the outage was user-facing access).
6. **Load Testing** — Confirm the application stays available under representative concurrent user load and does not regress into the outage state under stress.
7. **Regression Testing** — Ensure the fix for the outage did not break previously working functionality.
8. **Ad Hoc / Exploratory Testing** — Unscripted probing of recovery edge cases (cold start, cache flush, session resumption after downtime).
9. **Usability Testing** — Verify users can complete the core access journey without confusion, especially around any maintenance/error states encountered during recovery.
10. **Accessibility Testing** — Confirm the restored pages meet baseline accessibility (keyboard navigation, screen-reader labels, error-page accessibility) so the fix does not introduce a11y regressions. _(assumed — confirm)_
11. **Backup and Recovery Testing** — Validate recovery/monitoring behavior so a future outage is detected and the documented recovery path works. _(assumed — confirm)_

> Scope may evolve during testing based on feedback, changing requirements, or discoveries. Review and adjust throughout the phase.

<!-- Dropped vs the canonical checklist: Data Validation, Security, Concurrency, Documentation Review, CI/CD, Rate Limiting, Internationalization, Third-Party — the ticket gives no signal (no input forms, auth-vuln, i18n, or rate-limit detail) beyond "site is down". Security/auth is covered indirectly via the login flow under Functional/Inclusions. -->

## Inclusions

<!-- This is a UI/web application (app.vwo.com), so flows are grouped by page/journey rather than by HTTP verb. -->

**Availability & Reachability**
- Site resolves via DNS and is reachable over HTTPS (no DNS failure, no connection refused/timeout).
- Valid, non-expired TLS/SSL certificate is served; no certificate warnings.
- Root URL returns a successful response (no 5xx, no blank/white page, no infinite spinner).
- CDN/load-balancer/origin path serves content correctly (no 502/503/504).

**Landing / Login Page**
- Login page loads fully with all assets (CSS, JS, images, fonts) — no broken or 404 resources.
- A valid user can authenticate and reach the dashboard.
- Invalid/empty credentials produce a clear validation message, not a crash or blank screen.

**Dashboard & Primary Navigation**
- Post-login dashboard renders its main widgets/sections without errors.
- Primary navigation links route to their target pages and those pages load.
- Existing user session/state behaves correctly after the outage recovery (re-login if expired, no corrupted state).

**Error & Recovery States**
- During/after recovery, any maintenance or error page shown is intentional, branded, and informative (no raw server errors exposed).
- Browser back/forward and page refresh after recovery do not re-trigger the broken state.
- Monitoring/health-check endpoint (if any) reports healthy once the app is restored. _(assumed — confirm)_

**Cross-Browser / Cross-Device**
- The above flows pass on the supported browser/OS/device matrix (see Test Environments).

## Test Environments

| Name | Env URL |
|------|---------|
| Production | https://app.vwo.com |
| QA / Staging | _(assumed — confirm)_ |
| Pre-Prod | _(assumed — confirm)_ |

**Platform / browser matrix**
- Windows 10 — Chrome, Firefox, Edge
- macOS — Safari
- Android — Chrome
- iOS — Safari

> The ticket names only the production URL (app.vwo.com). Lower-environment URLs are not supplied and must be confirmed before execution so the fix can be validated pre-promotion.

## Defect Reporting Procedure

- **Defect criteria:** deviation from requirements, UX issues, technical errors, or any recurrence of the unavailability.
- **Reporting:** designated template, detailed reproduction steps, screenshots/logs (HTTP status, browser console, network trace) attached.
- **Triage:** assign severity + priority; route to the right owner. An outage recurrence is treated as the highest severity.
- **Tooling:** JIRA (project VWO).
- **Roles / POCs:**

| Area | POC |
|------|-----|
| Frontend | _(assumed — confirm)_ |
| Backend | _(assumed — confirm)_ |
| DevOps / Infra | _(assumed — confirm)_ |

- **Communication:** end-of-day defect status to dev management; immediate escalation channel for any outage recurrence.
- **Metrics:** defects found, time-to-resolve, availability/uptime after fix, fix rate.

## Test Strategy

**Step 1 — Design.** Create test scenarios and cases for everything in Scope using: Use Case Testing (end-to-end access journey: reach site → log in → use dashboard), State Transition (outage → recovery → steady-state, session expiry/resume), Decision Table (browser × OS × auth-state combinations), plus Error Guessing and Exploratory Testing for recovery edge cases. Prioritize availability and core-flow cases first.

**Step 2 — Execution flow.** Smoke test first — confirm app.vwo.com is reachable and the login page loads; if smoke fails, reject the build/deploy and wait for a stable one. On a stable build, run in-depth testing across the supported environments in parallel: availability checks, core flows, cross-browser, then the targeted regression pass. Log bugs in JIRA and send an end-of-day defect status email to dev management. Repeat cycles until the availability and quality bar is met.

**Step 3 — Best practices.** Context-driven testing, shift-left monitoring/alerting validation, exploratory testing of recovery behavior, and end-to-end flow testing of the user access journey.

## Test Schedule

| Task | Dates |
|------|-------|
| Creating Test Plan | 2026-05-26 _(assumed — confirm)_ |
| Test Case Creation | _(assumed — confirm)_ |
| Test Case Execution | _(assumed — confirm)_ |
| Summary Reports Submission | _(assumed — confirm)_ |

> Estimated duration: 1 sprint. _(assumed — confirm; no fix version or due date on the ticket)_

## Test Deliverables

- Test Plan
- Test Scenarios / Test Cases
- Defect Reports
- Automation suite (Playwright / Selenium for the access + login + dashboard smoke flow) _(assumed — confirm)_
- Test Summary Report

## Entry and Exit Criteria

### Requirement Analysis
- **Entry:** Testing team receives the outage ticket (VWO-101) and fix details from dev.
- **Exit:** Root cause and fix scope understood; doubts cleared; affected flows identified.

### Test Execution
- **Entry:** Fix deployed to a testable environment; app.vwo.com (or staging equivalent) is reachable; scenarios/cases signed off.
- **Exit:** Test case reports and defect reports ready; availability and core flows verified.

### Test Closure
- **Entry:** Test case reports and defect reports ready.
- **Exit:** Test Summary Report delivered; site confirmed available and stable.

## Test Execution

- Run the smoke suite (reachability + login page load) on every deploy of the fix; block promotion if it fails.
- Execute full functional, integration, compatibility, and regression cases on a stable build across the browser/OS matrix in parallel.
- Re-run availability and load checks after any infra change tied to the fix.
- Record results per case; attach evidence (status codes, console/network logs, screenshots) to any failure.

## Test Closure

- Confirm all in-scope cases executed and outage no longer reproducible.
- Verify all critical/high defects are resolved and retested.
- Confirm monitoring/alerting is in place so a future outage is detected. _(assumed — confirm)_
- Deliver Test Summary Report with availability metrics and sign-off.

## Tools

- JIRA — bug tracking (project VWO)
- Playwright / Selenium — UI automation for the smoke + core-flow suite _(assumed — confirm)_
- Browser DevTools, curl/HTTP client, SSL/DNS checkers — availability and network diagnostics
- Cross-browser tooling (BrowserStack or equivalent) for the compatibility matrix _(assumed — confirm)_
- Mind map tool, screenshot tool, Word/Excel docs

## Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Non-availability of a resource | Backup resource planning |
| Build/URL not working (site still down) | Block testing, escalate to DevOps; resources work on other tasks until a stable build is available |
| Less time for testing | Ramp resources up dynamically per client need; prioritize availability + core-flow cases first |
| Outage recurs after the fix | Validate monitoring/alerting and load behavior; treat recurrence as highest severity with immediate escalation |
| Root cause is infra/dependency-side (DNS, TLS, CDN, LB) and not fully reproducible in lower envs | Coordinate with DevOps to validate in a prod-like env; verify each dependency in the integration pass |

## Approvals

Documents sent for client approval before proceeding to the next step:
- Test Plan
- Test Scenarios
- Test Cases
- Reports

> Testing continues to the next step only once approvals are done.
