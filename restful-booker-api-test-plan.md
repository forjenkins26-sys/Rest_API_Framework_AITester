# Test Plan — Restful Booker API

> Source ticket: RB-API — Restful Booker API (CRUD + Auth) verification
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

Verify the Restful Booker API end-to-end: create, retrieve, update, and delete bookings, including the authentication token flow that protects mutating endpoints. The API is known to contain seeded defects — the objective is to find and report all of them. Test cases will be executed via a Postman collection, and the same coverage will be automated with the REST Assured framework.

**URL / System under test:** https://restful-booker.herokuapp.com/apidoc/index.html

## Scope

1. **Functional Testing** — verify every booking endpoint (create/read/update/partial-update/delete) behaves per the API docs.
2. **Data Validation Testing** — reject invalid input, test boundary values for booking fields (dates, prices, names), validate response payloads.
3. **Error Handling Testing** — correct status codes/messages for bad, missing, or malformed requests; no sensitive data in error bodies.
4. **Security Testing** — token auth on protected verbs, injection/XSS probes on string fields, HTTPS enforcement, access control (unauth users cannot mutate).
5. **Integration Testing** — data consistency across endpoints (a booking created via POST is readable via GET and reflects PUT/PATCH/DELETE).
6. **Performance Testing** — response time of CRUD operations under normal and peak load.
7. **Load Testing** — stability under high concurrent users.
8. **Concurrency Testing** — simultaneous create/update/delete on the same booking; verify consistency.
9. **Regression Testing** — re-run suite after each bug fix to protect existing CRUD behavior.
10. **Edge Case Testing** — extreme/boundary date ranges, empty/oversized fields, non-existent IDs.
11. **Rate Limiting Testing** — adherence to any rate limits to prevent abuse.
12. **Documentation Review** — API docs match actual behavior; flag discrepancies (a known source of the seeded bugs).
13. **Ad Hoc / Exploratory Testing** — uncover hidden defects beyond scripted cases.

> Scope may evolve during testing based on feedback, changing requirements, or discoveries. Review and adjust throughout the phase.

## Inclusions

**Auth (POST /auth)**
- Obtain a token with valid credentials; assert `200` + token in body.
- Invalid/missing credentials → assert documented failure (and flag if it returns `200` with `Bad credentials` — a known quirk).

**Create (POST /booking)**
- Create a booking with a full valid payload; assert `200` + `bookingid` + echoed `booking`.
- Missing mandatory fields / wrong data types → expect rejection; record actual behavior.
- Verify the created booking is retrievable via GET.

**Read (GET /booking, GET /booking/{id})**
- List all booking IDs; filter by `firstname`, `lastname`, `checkin`, `checkout`.
- Get by valid ID → correct data; by non-existent/invalid ID → `404`.
- Content negotiation: JSON vs XML via `Accept` header.

**Update (PUT /booking/{id})**
- Full update with valid token → `200` + updated body.
- Without/with invalid token → `403`/`401` (verify which; document gap).
- Update non-existent ID → expected error.

**Partial Update (PATCH /booking/{id})**
- Update a subset of fields with valid token; assert only those fields change.

**Delete (DELETE /booking/{id})**
- Delete with valid token → `201` (documented); confirm subsequent GET → `404`.
- Delete without token / already-deleted ID → expected error.

**Boundary / Data Validation**
- `checkin` after `checkout`, past dates, equal dates; `totalprice` negative/zero/huge; empty `additionalneeds`.

## Test Environments

| Name | Env URL |
|------|---------|
| QA | https://restful-booker.herokuapp.com/apidoc/index.html |
| Pre-Prod | https://restful-booker.herokuapp.com/apidoc/index.html |

**Platform / browser matrix** _(client tooling; API itself is platform-agnostic)_
- Windows 10 — Chrome, Firefox, Edge
- macOS — Safari
- Android — Chrome
- iOS — Safari

> Auth to environment: bearer token obtained via `POST /auth`. Roles: QA testers (execute), devs (fix), test lead (sign-off). _(assumed — confirm)_

## Defect Reporting Procedure

- **Defect criteria:** deviation from API docs, wrong status code/payload, security exposure, technical errors.
- **Reporting:** JIRA ticket using the standard template — request/response, repro steps, expected vs actual, attachments (Postman screenshots/logs).
- **Triage:** assign severity + priority; route to the area owner.
- **Tooling:** JIRA.
- **Roles / POCs:**

| Area | POC |
|------|-----|
| Frontend | Devesh |
| Backend | Sonal |
| DevOps | Prajeeth |

- **Communication:** end-of-day defect status email to dev management; updates per stakeholder cadence.
- **Metrics:** defects found, time-to-resolve, fix rate.

## Test Strategy

**Step 1 — Design.** Create scenarios and cases for everything in Scope using Equivalence Class Partitioning and Boundary Value Analysis (date/price fields), Decision Table (token × verb × resource state), State Transition (booking lifecycle: created → updated → deleted), and Use Case testing (full CRUD journey). Add Error Guessing and Exploratory testing for the seeded bugs. Prioritize the cases.

**Step 2 — Execution flow.** Smoke test core endpoints (auth + create + read) first; reject the build and wait for a stable one if smoke fails. On a stable build, run in-depth testing across the supported environments in parallel. Log bugs in JIRA and send an end-of-day defect status email. Cover smoke/sanity, regression/retest, functionality, and usability (developer-experience of the API). Repeat cycles until the quality bar is met.

**Step 3 — Best practices.** Context-driven testing, shift-left (test against the docs early), exploratory testing, and end-to-end flow testing (auth → create → read → update → delete → confirm gone).

## Test Schedule

| Task | Dates |
|------|-------|
| Creating Test Plan | Sprint 1, days 1-2 _(assumed — confirm)_ |
| Test Case Creation | Sprint 1, days 3-5 _(assumed — confirm)_ |
| Test Case Execution | Sprint 2, days 1-7 _(assumed — confirm)_ |
| Summary Reports Submission | Sprint 2, day 8 _(assumed — confirm)_ |

> Estimated duration: 2 sprints to test the application.

## Test Deliverables

- Test Plan (this document)
- Test Scenarios / Test Cases — Postman collection
- Defect Reports (JIRA)
- Automation suite — REST Assured framework
- Test Summary Report

## Entry and Exit Criteria

### Requirement Analysis
- **Entry:** Testing team receives the API docs / ticket details.
- **Exit:** Endpoints and auth flow explored and understood; doubts cleared.

### Test Execution
- **Entry:** Scenarios/cases signed off by client; API reachable and ready for testing.
- **Exit:** Test case reports and defect reports ready.

### Test Closure
- **Entry:** Test case reports and defect reports ready.
- **Exit:** Test Summary Report delivered.

## Tools

- JIRA — bug tracking
- Postman — manual/API test case execution
- REST Assured (Java) — automation
- Mind map tool, screenshot tool, Word/Excel docs

## Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Non-availability of a resource | Backup resource planning |
| Build/URL not working (Heroku app sleeps/down) | Resources work on other tasks; warm up the instance before runs |
| Less time for testing | Ramp resources up dynamically per client need |
| Token expiry mid-run flakes tests | Refresh token in test setup; isolate auth from CRUD assertions |

## Approvals

Documents sent for client approval before proceeding to the next step:
- Test Plan
- Test Scenarios
- Test Cases
- Reports

> Testing continues to the next step only once approvals are done.
