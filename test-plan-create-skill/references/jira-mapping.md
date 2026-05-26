# Jira → Test Plan mapping

How to turn a ticket into each template section. Read the ticket once, then fill top-down.

## Field extraction

| From the ticket | Feeds template section(s) |
|-----------------|---------------------------|
| Issue key + summary/title | Header (`JIRA_ID`, `JIRA_TITLE`), Objective |
| Description / goal | Objective |
| URL, API doc link, base path | Objective (Target URL), Test Environments |
| Acceptance criteria | Inclusions, Scope, Entry/Exit |
| Endpoints / HTTP verbs | Inclusions (group by POST/GET/PUT/DELETE) |
| Auth requirements (token, login) | Inclusions → Auth & Authorization, Security |
| Non-functional notes (load, perf, rate limit) | Scope items 4/9/16 |
| Components / linked services | Integration Testing, Defect POCs |
| Fix versions / sprint / due date | Test Schedule |
| Mentioned tools (Postman, REST Assured, etc.) | Tools, Test Deliverables |
| Labels like `security`, `regression` | Scope selection |

## Scope selection rule

Don't dump all 20 scope types. Start from the canonical checklist in the template and **keep only the types the ticket justifies**, then write one feature-specific line each. Examples:
- Ticket mentions a token/login → keep Security + Auth.
- Ticket mentions "handle 1000 concurrent" → keep Performance, Load, Concurrency.
- Pure backend API → drop Compatibility (browser matrix) or mark minimal.
- No i18n/third-party signal → omit those rows entirely.

## Inclusions grouping

- **API tickets:** group by verb (Create/Read/Update/Delete) + Auth + Validation + Error handling. Each bullet = one concrete behavior to verify (happy path, invalid input, missing field, non-existent ID, unauthorized).
- **UI tickets:** group by screen/flow. Each bullet = a user action + expected result.

## Test design techniques (Strategy section)

Name the techniques you'd actually apply for this feature, don't just list all:
- **Equivalence Class Partitioning / Boundary Value Analysis** — input fields with ranges.
- **Decision Table** — multiple conditions (auth × role × state).
- **State Transition** — booking lifecycle, order status, etc.
- **Use Case Testing** — end-to-end flows.
- **Error Guessing / Exploratory** — always include.

## Filling rules

- Replace every `{{PLACEHOLDER}}`. If the ticket has no data for one, write a sensible default and mark it `_(assumed — confirm)_` so the reader knows it wasn't in the ticket.
- Keep the section order and headings of the template exactly — it's a standard deliverable.
- Prefer concrete, feature-specific lines over the generic boilerplate the template carries as hints.
- Preserve any URL, environment, POC name, schedule, or tool explicitly named in the ticket.
