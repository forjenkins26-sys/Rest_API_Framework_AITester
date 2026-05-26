# Test Plan — TTACart (Demo E-Commerce App)

> Source ticket: VWO-105 — Product Requirements Document (PRD): TTACart (Story, Medium, To Do)
> Reporter: Pramod (The Testing Academy) · Author: TheTestingAcademy · Date: 2026-05-26 · Status: Draft
> Ticket: https://bugzz.atlassian.net/browse/VWO-105

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

Verify TTACart — a demo e-commerce web app from The Testing Academy used as a practice ground for automation testers (Playwright, Selenium, Cypress). Validate the full shopper journey: login, product browse/sort, cart management, and the two-step checkout through to order confirmation. The app ships six predefined personas (shared password `tta_secret`) that deliberately exercise edge cases — locked-out, problem-UI, performance-glitch, error, and visual-regression users — so the plan must confirm each persona behaves as specified. Confirms non-functional targets (sub-2s load for the standard user, repeatable delay for the glitch user, responsive down to 360px, stable selectors) and the stated acceptance criteria.

**URL / System under test:** https://app.thetestingacademy.com/playwright/ttacart/

## Scope

1. **Functional Testing** — login, inventory grid + sort, product detail, add/remove cart, cart badge count, two-step checkout, order confirmation, sidebar (All Items, About, Logout, Reset App State), footer links.
2. **Data Validation Testing** — checkout step-one required fields (First Name, Last Name, Zip); price/tax/total math on the overview step.
3. **Error Handling Testing** — locked_out_user blocked at login with inline error; error_user functional errors; invalid credentials messaging; missing-field validation errors.
4. **Visual / Snapshot Testing** — visual_user regression scenarios; problem_user intentional UI defects.
5. **Performance Testing** — standard_user page loads < 2s; performance_glitch_user introduces a noticeable, repeatable delay.
6. **Compatibility Testing** — responsive layout down to 360px mobile viewport; cross-browser (Chrome, Firefox, Edge, Safari).
7. **Accessibility / Selector Stability** — interactive elements expose stable IDs/data-attributes/accessible names so scripts aren't brittle.
8. **Usability Testing** — flow clarity, cart badge feedback, Reset App State, Continue Shopping vs Checkout.
9. **Regression Testing** — re-run the suite after fixes; deterministic state reset via Reset App State / browser-storage clear.
10. **Edge Case Testing** — empty cart checkout, max items, persona-specific behaviors, session/state reset.
11. **End-to-End Flow Testing** — discovery → login → browse/sort → add to cart → cart → checkout step one → step two → finish → confirmation.

**Out of scope** (per PRD §8): real payment processing, real shipping, account registration, password reset, product reviews, wishlists, search, inventory management, admin back office. No load/security depth — demo app, no real payments.

> Scope may evolve during testing based on feedback, changing requirements, or discoveries. Review and adjust throughout the phase.

## Inclusions

**Login Page (`/`)**
- Each of the 6 personas with password `tta_secret`: standard_user → routed to inventory; locked_out_user → blocked + inline error; problem_user / performance_glitch_user / error_user / visual_user → login then exhibit their documented behavior.
- Invalid username/password → clear inline error. Empty fields → validation.

**Inventory / Products Page (`/inventory`)**
- Grid lists all products with image, name, description, price, Add to Cart / Remove toggle.
- Verify catalog: Test.allTheThings() T-Shirt (Red) $15.99, TTA Bike Light, TTA Bolt T-Shirt, TTA Fleece Jacket $49.99, TTA Junior Tester Onesie, TTA Practice Backpack.
- Sort dropdown — all four orderings: Name A→Z, Name Z→A, Price low→high, Price high→low.
- Add/Remove toggles correctly; cart icon badge reflects current item count.
- Header hamburger menu + cart icon present.

**Product Detail Page (`/inventory-item.html?id=<id>`)**
- Single product image, full description, price, Add/Remove toggle; Back to Products returns to grid.

**Cart Page (`/cart`)**
- Line items show quantity, name, description, price + Remove.
- Continue Shopping → inventory; Checkout → step one.

**Checkout: Your Information (`/checkout-step-one`)**
- First Name, Last Name, Zip/Postal Code all required; each missing field → validation error.
- Cancel → cart; Continue → overview.

**Checkout: Overview (`/checkout-step-two`)**
- Line items, payment info (TTACard #31337), shipping (Free TTA Express Delivery).
- Price summary: item subtotal + tax = total (e.g. $65.98 + $5.28 = $71.26) — verify computed tax + total.
- Cancel → inventory; Finish → complete.

**Checkout: Complete (`/checkout-complete`)**
- Thank-you confirmation; Back Home → inventory.

**Sidebar / Hamburger**
- All Items, About, Logout, Reset App State (clears cart + resets toggled add/remove state).

**Footer**
- Twitter, Facebook, LinkedIn, Terms of Service, Privacy Policy links present and valid.

## Test Environments

| Name | Env URL |
|------|---------|
| QA | https://app.thetestingacademy.com/playwright/ttacart/ |
| Pre-Prod | https://app.thetestingacademy.com/playwright/ttacart/ _(single shared demo env — confirm)_ |

**Platform / browser matrix**
- Windows 10 — Chrome, Firefox, Edge
- macOS — Safari
- Android — Chrome
- iOS — Safari

> Mobile viewport: verify down to 360px width. Accounts: 6 personas, shared password `tta_secret`. Cart state in browser storage — reset via Reset App State for deterministic runs.

## Defect Reporting Procedure

- **Defect criteria:** deviation from the PRD, broken flow, validation/math errors, visual regression, performance miss, technical errors.
- **Reporting:** JIRA ticket (project VWO) using the standard template — repro steps, expected vs actual, persona used, browser/viewport, screenshots/logs.
- **Triage:** assign severity + priority; route to the area owner.
- **Tooling:** JIRA (bugzz.atlassian.net).
- **Roles / POCs:**

| Area | POC |
|------|-----|
| Frontend | _(assign — confirm)_ |
| Backend | _(assign — confirm)_ |
| DevOps | _(assign — confirm)_ |

- **Communication:** end-of-day defect status email to dev management; updates per stakeholder cadence.
- **Metrics:** defects found, time-to-resolve, fix rate.

## Test Strategy

**Step 1 — Design.** Create scenarios and cases for everything in Scope using Equivalence Class Partitioning and Boundary Value Analysis (checkout fields, prices), Decision Table (persona × action × state), State Transition (cart toggle, checkout step one → two → complete, Reset App State), and Use Case testing (full shopper journey per persona). Add Error Guessing and Exploratory testing for problem_user/error_user. Prioritize the happy-path standard_user flow first, then persona edge cases.

**Step 2 — Execution flow.** Smoke test core path (standard_user login + add to cart + checkout finish) first; reject build and wait for a stable one if smoke fails. On a stable build, run in-depth testing across the browser/viewport matrix in parallel. Use Reset App State between cases for deterministic state. Log bugs in JIRA and send an end-of-day defect status email. Cover smoke/sanity, regression/retest, functionality & UI, visual, and usability. Repeat cycles until the quality bar is met.

**Step 3 — Best practices.** Context-driven testing, shift-left (test against the PRD early), exploratory testing (persona-driven), and end-to-end flow testing. Rely on stable selectors per the NFR to keep automation non-brittle.

## Test Schedule

| Task | Dates |
|------|-------|
| Creating Test Plan | Sprint 1, days 1-2 _(assumed — confirm)_ |
| Test Case Creation | Sprint 1, days 3-5 _(assumed — confirm)_ |
| Test Case Execution | Sprint 2, days 1-7 _(assumed — confirm)_ |
| Summary Reports Submission | Sprint 2, day 8 _(assumed — confirm)_ |

> Estimated duration: 2 sprints to test the application. _(no fixVersion/due date on the ticket — confirm)_

## Test Deliverables

- Test Plan (this document)
- Test Scenarios / Test Cases (per persona + per page)
- Defect Reports (JIRA project VWO)
- Automation suite (Playwright / Selenium / Cypress — critical E2E + visual regression)
- Test Summary Report

## Entry and Exit Criteria

### Requirement Analysis
- **Entry:** Testing team receives the PRD (VWO-105).
- **Exit:** Pages, personas, and acceptance criteria explored and understood; doubts cleared.

### Test Execution
- **Entry:** Scenarios/cases signed off; demo app reachable; all 6 personas usable.
- **Exit:** Test case reports and defect reports ready.

### Test Closure
- **Entry:** Test case reports and defect reports ready.
- **Exit:** Test Summary Report delivered.

## Tools

- JIRA — bug tracking (bugzz.atlassian.net)
- Playwright / Selenium / Cypress — UI + E2E automation
- Visual snapshot tooling (e.g. Playwright screenshots / Percy) — visual_user regression
- Browser devtools (network throttling for performance_glitch_user), responsive device mode (360px)
- Screenshot tool, Word/Excel docs

## Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Non-availability of a resource | Backup resource planning |
| Demo URL down / shared env unstable | Resources work on other tasks; cache a known-good build for reference |
| Less time for testing | Ramp resources up dynamically per client need |
| Shared cart/browser-storage state bleeds between tests | Use Reset App State + isolated browser contexts per test |
| Persona behaviors (glitch/visual) flake automation | Pin waits to stable selectors; tolerance thresholds for visual diffs |

## Approvals

Documents sent for client approval before proceeding to the next step:
- Test Plan
- Test Scenarios
- Test Cases
- Reports

> Testing continues to the next step only once approvals are done.
