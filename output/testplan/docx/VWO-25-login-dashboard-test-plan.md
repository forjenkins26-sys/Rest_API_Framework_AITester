# Test Plan — VWO Login Dashboard (app.vwo.com)

> Source ticket: VWO-25 — VWO Login Dashboard PRD
> Author: TheTestingAcademy · Date: 2026-05-26 · Status: Draft

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

Verify the VWO login dashboard at app.vwo.com — the critical entry point into VWO's experimentation platform. Validate secure email/password authentication plus optional 2FA and enterprise SSO, real-time input validation, the forgot-password/recovery flow, responsive and accessible UI (Light/Dark themes, WCAG 2.1 AA), and the transition into the main dashboard on success. The plan also confirms non-functional targets: sub-2-second page load, 99.9% availability, rate-limiting against brute force, and GDPR/CCPA compliance. Defects found are reported in JIRA; critical flows are automated for regression.

**URL / System under test:** https://app.vwo.com

## Scope

1. **Functional Testing** — email/password login, Remember Me, registration link, forgot-password flow, 2FA, SSO, post-login dashboard transition.
2. **Data Validation Testing** — real-time on-blur validation, email format checks, password strength indicators, mandatory-field handling.
3. **Error Handling Testing** — clear, actionable messages for wrong credentials, locked accounts, expired reset tokens; no sensitive info leaked in errors.
4. **Security Testing** — HTTPS/TLS enforcement, secure session tokens, password hashing, brute-force/rate-limiting, 2FA, SSO (SAML/OAuth), OWASP auth guidelines, injection/XSS on inputs.
5. **Performance Testing** — login page loads < 2s on standard connections; auth response time under normal and peak load.
6. **Load Testing** — thousands of simultaneous login attempts; auto-scaling behavior under traffic spikes.
7. **Compatibility Testing** — responsive layout across browsers (Chrome, Firefox, Edge, Safari) and devices (desktop, tablet, mobile), touch-friendly controls, mobile keyboards.
8. **Accessibility Testing** — WCAG 2.1 AA: screen-reader/ARIA labels, keyboard navigation, clickable labels, high-contrast mode, auto-focus on first field.
9. **Usability Testing** — login friction, loading states, theme switching (Light/Dark), error recovery clarity.
10. **Integration Testing** — SSO providers, social login (Google/Microsoft), analytics login success/failure tracking, support-system handoff, transition to core platform.
11. **Compliance Testing** — GDPR + CCPA data handling, enterprise audit trails, security-policy support.
12. **Regression Testing** — re-run critical suite after each fix to protect existing login behavior across the three delivery phases.
13. **Edge Case Testing** — boundary/invalid emails, max-length passwords, expired/replayed reset tokens, session timeout, concurrent sessions.
14. **Ad Hoc / Exploratory Testing** — uncover hidden defects beyond scripted cases.

> Scope may evolve during testing based on feedback, changing requirements, or discoveries. Review and adjust throughout the phase.

## Inclusions

**Login (email + password)**
- Valid credentials → authenticated, redirected to personalized dashboard.
- Invalid email / wrong password / empty fields → clear inline error, no login.
- Auto-focus on first field; clickable labels; loading state during auth.

**Remember Me / Session**
- Remember Me checked → persistent session across browser restarts.
- Configurable session timeout; secure token; no session hijacking; logout invalidates token.

**Input Validation**
- On-blur real-time validation; email-format verification (incl. mobile keyboards); password strength indicator reflects complexity rules.

**Forgot Password / Recovery**
- Request reset → secure token emailed; reset within validity; expired/used token rejected; email-based recovery path works.

**Multi-Factor Authentication (2FA)**
- Enabled account prompts for 2FA; valid code passes, invalid/expired fails; bypass attempts blocked.

**Single Sign-On (SSO) & Social Login**
- SAML/OAuth enterprise SSO redirects and returns authenticated; Google/Microsoft social login; failed federation handled gracefully.

**Theme & Accessibility**
- Light/Dark mode toggle persists; keyboard-only full traversal; screen-reader announces fields/errors; high-contrast mode renders correctly.

**Post-login & Integrations**
- Successful login transitions to core platform with context preserved; analytics events fire for success/failure.

**Security / Negative**
- Rate limiting throttles repeated failures (brute force); HTTPS enforced (HTTP redirects); injection/XSS payloads in email/password rejected and sanitized.

## Test Environments

| Name | Env URL |
|------|---------|
| QA | https://app.vwo.com _(QA instance — confirm)_ |
| Pre-Prod | https://app.vwo.com _(staging instance — confirm)_ |

**Platform / browser matrix**
- Windows 10 — Chrome, Firefox, Edge
- macOS — Safari
- Android — Chrome
- iOS — Safari

> Devices: desktop, laptop, tablet, smartphone. Networks: Wi-Fi, cellular, wired. Access to env via test accounts (standard + enterprise SSO + 2FA-enabled). Roles: QA testers (execute), devs (fix), test lead (sign-off). _(assumed — confirm)_

## Defect Reporting Procedure

- **Defect criteria:** deviation from the PRD, UX issues, security exposure, accessibility violations, technical errors.
- **Reporting:** JIRA ticket using the standard template — repro steps, expected vs actual, environment/browser, screenshots/logs.
- **Triage:** assign severity + priority; route to the area owner.
- **Tooling:** JIRA.
- **Roles / POCs:**

| Area | POC |
|------|-----|
| Frontend | _(assign — confirm)_ |
| Backend | _(assign — confirm)_ |
| DevOps | _(assign — confirm)_ |

- **Communication:** end-of-day defect status email to dev management; updates per stakeholder cadence.
- **Metrics:** defects found, time-to-resolve, fix rate.

## Test Strategy

**Step 1 — Design.** Create scenarios and cases for everything in Scope using Equivalence Class Partitioning and Boundary Value Analysis (email/password fields), Decision Table (credentials × 2FA × SSO × Remember Me), State Transition (login → 2FA → dashboard; reset-token lifecycle), and Use Case testing (new-user signup, returning-user quick access, error-recovery). Add Error Guessing and Exploratory testing. Prioritize by risk — auth and security first.

**Step 2 — Execution flow.** Smoke test core path (page load + valid login + logout) first; reject build and wait for a stable one if smoke fails. On a stable build, run in-depth testing across the browser/device matrix in parallel. Log bugs in JIRA and send an end-of-day defect status email. Cover smoke/sanity, regression/retest, functionality & UI, accessibility, and usability. Repeat cycles until the quality bar is met.

**Step 3 — Best practices.** Context-driven testing, shift-left (test against the PRD early, per delivery phase), exploratory testing, and end-to-end flow testing (discovery → login/2FA/SSO → dashboard → recovery).

## Test Schedule

| Task | Dates |
|------|-------|
| Creating Test Plan | Sprint 1, days 1-2 _(assumed — confirm)_ |
| Test Case Creation | Sprint 1, days 3-5 _(assumed — confirm)_ |
| Test Case Execution | Sprint 2, days 1-7 _(assumed — confirm)_ |
| Summary Reports Submission | Sprint 2, day 8 _(assumed — confirm)_ |

> Estimated duration: 2 sprints, aligned to the PRD's three delivery phases (Core Auth → Enhanced UX → Enterprise Features).

## Test Deliverables

- Test Plan (this document)
- Test Scenarios / Test Cases
- Defect Reports (JIRA)
- Automation suite (critical login regression)
- Accessibility audit report (WCAG 2.1 AA)
- Test Summary Report

## Entry and Exit Criteria

### Requirement Analysis
- **Entry:** Testing team receives the PRD / ticket details.
- **Exit:** Login flows, security, and accessibility requirements explored and understood; doubts cleared.

### Test Execution
- **Entry:** Scenarios/cases signed off; build deployed to QA and reachable; test accounts (standard, SSO, 2FA) provisioned.
- **Exit:** Test case reports and defect reports ready.

### Test Closure
- **Entry:** Test case reports and defect reports ready.
- **Exit:** Test Summary Report delivered.

## Tools

- JIRA — bug tracking
- Selenium / Playwright — UI automation
- axe / Lighthouse — accessibility + performance audit
- JMeter / k6 — load and concurrency testing
- Browser devtools, screenshot tool, Word/Excel docs

## Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Non-availability of a resource | Backup resource planning |
| Build/URL not working | Resources work on other tasks |
| Less time for testing | Ramp resources up dynamically per client need |
| SSO/2FA test accounts unavailable | Provision sandbox IdP + dedicated 2FA test accounts before execution |
| Cannot reach prod auth for security tests | Use isolated QA env; coordinate rate-limit/brute-force tests to avoid lockouts |

## Approvals

Documents sent for client approval before proceeding to the next step:
- Test Plan
- Test Scenarios
- Test Cases
- Reports

> Testing continues to the next step only once approvals are done.
