# Claude Code Masterclass

A hands-on workspace from **The Testing Academy** showing how to drive Claude Code as a QA automation copilot — building reusable **Skills** and **slash commands**, wiring up the **Atlassian (Jira) MCP**, generating formal **test plans** from Jira tickets, and filing **bug reports** straight into Jira.

This README doubles as a **session log**: every prompt used to build this repo is documented below so the workflow is reproducible.

---

## What's inside

| Path | What it is |
|------|-----------|
| `test-plan-create-skill/` | Skill + `/test-plan` command — turns a Jira ticket (file, pasted text, or live issue key via MCP) into a formal Test Plan (markdown or `.docx`). |
| `bug-report-create-skill/` | Skill + `/create-bug` command — turns a screenshot + notes into a Jira **Bug**, formatted like the team's house template (modeled on VWO-24). |
| `output/testplan/` | Example generated test plans (`.md` + `.docx`). |
| `Playwright_8_Layer/` | A separate 8-layer Playwright TypeScript E2E framework (POM, fixtures, API). See its own README. |
| `vwo-25.md`, `restful-booker-api-test-plan.md` | Sample inputs / outputs. |
| `myTest.java` | Original Hello-World Java sandbox. |
| `CLAUDE.md` | Project guidance for Claude Code (router across the sub-projects). |

> The Selenium framework (`SeleniumRepo/`) is a **separate git repository** with its own remote and is intentionally excluded from this repo (see `.gitignore`).

---

## The two skills

Both are standard [Agent Skills](https://agentskills.io) (a folder with `SKILL.md` + `assets/`/`references/`/`scripts/`), installable globally at `~/.claude/skills/` with a matching slash command in `~/.claude/commands/`. They also work uploaded to Claude in the cloud.

### `/test-plan` — Test Plan generator
```bash
/test-plan ./ticket.md                  # from a markdown/text file
/test-plan VWO-105                       # fetch the ticket live via the Atlassian MCP
/test-plan VWO-105 create a docx in ./output/testplan/mcp
```
Fills a fixed 14-section template (Objective, Scope, Inclusions, Test Environments, Defect Reporting, Test Strategy, Schedule, Deliverables, Entry/Exit Criteria, Tools, Risks & Mitigations, Approvals). Detects UI vs API tickets and shapes Scope/Inclusions accordingly. A bundled `scripts/md_to_docx.py` (python-docx) converts the markdown to a Word `.docx`.

### `/create-bug` — Jira Bug filer
```bash
/create-bug                              # then paste a screenshot + a short note
/create-bug REST                         # file on a different project (default VWO)
```
Reads the screenshot (extracts the page/URL + verbatim error text), fills the five-section bug template (Bug Details → Steps to Reproduce → Expected → Actual → Attachments), and creates the issue via the Atlassian MCP `createJiraIssue`.

> **MCP limitation:** the connected Atlassian MCP can create/edit/comment on issues but has **no file-upload and no delete tool**. So screenshots must be attached manually, and the skill confirms a draft before creating (a created ticket can't be removed via MCP).

---

## Jira / Atlassian MCP

The Atlassian MCP connects via **OAuth** (Claude connectors) — no API token is pasted anywhere. Connect it once via `/mcp` (Claude Code) or Settings → Connectors (claude.ai), then reference tickets by key or JQL and Claude fetches them live.

Tickets created during this masterclass on the public demo Jira: **VWO-105** (TTACart PRD test plan source), **VWO-106** and **VWO-107** (login bugs filed via `/create-bug`).

---

## Prompt log — how this repo was built

The exact prompts used, in order. Each produced the artifact noted.

1. **`/init`** — *Analyze the codebase and create a `CLAUDE.md`.*
   → Rewrote `CLAUDE.md` as a router across the multi-project workspace.

2. **`claude plugin install skill-creator@claude-plugins-official`**
   → Installed the skill-creator plugin (used to author the skills below).

3. **"I'm planning to create a simple skill where I give you a Jira ticket as an md file. Read it and generate a test plan into a template I'll give you. Then create a reusable **skill + command** (agentskills.io format) so next time, given a Jira ID or content, you create a test plan automatically. Folder = test-plan-create-skill, usable in the cloud, install it."**
   → Researched the agentskills.io format + local skill/command conventions; asked clarifying questions (install scope, Jira input mode, template handling).

4. **(shared the Test Plan template) + "now please create the skill so that I can use that skill"**
   → Built `test-plan-create-skill/` (SKILL.md + bundled template + Jira-mapping reference), installed globally with the `/test-plan` command, and verified end-to-end on the RESTful Booker example.

5. **`/test-plan @vwo-25.md create the output as a docx file in /output/testplan/docx`**
   → Added a bundled `md_to_docx.py` converter; produced the VWO login-dashboard test plan as `.docx`.

6. **`/test-plan VWO-105 create the test plan for this JIRA, fetch via the MCP if required, docx in /output/testplan/mcp`**
   → Live-fetched VWO-105 (TTACart PRD) via the Atlassian MCP → test plan `.docx`.

7. **`/test-plan VWO-25, VWO-101, VWO-26, VWO-100 — spawn multiple agents to do it`**
   → Spawned 4 parallel agents, each fetching its ticket via MCP and generating an `.md` + `.docx` plan into `output/testplan/batch/`.

8. **"How do I use the Atlassian MCP / how do I give you my Jira config so you can access all my tickets?"**
   → Explained the OAuth model (no token paste), listed the visible projects live, showed how to fetch tickets.

9. **"Create a skill for bug reporting — `bug-report-create-skill` + a `create a bug` command. I'll share a screenshot; create a Jira bug on the VWO project formatted like https://bugzz.atlassian.net/browse/VWO-24."**
   → Built `bug-report-create-skill/` (SKILL.md + VWO-24-style template) and the `/create-bug` command, installed globally.

10. **`/create-bug` (VWO login screenshot, "500 error on valid credentials")**
    → Flagged that the screenshot actually showed a "did not match" auth error (not a 500) and an empty password field; filed **VWO-106** after confirmation.

11. **`/create-bug` (second login screenshot, "fails for valid + invalid login", "use Claude Chrome")**
    → Flagged it as a near-duplicate of VWO-106; filed **VWO-107**; explained that the available Playwright browser can't drive the user's existing logged-in Chrome (that needs the Claude for Chrome extension).

12. **"Commit the code and push to the GitHub repo, and add a README with all the prompts I've used."**
    → This commit + this README.

---

## Setup notes

- **Java sandbox:** `javac myTest.java && java myTest` → prints `Hello`.
- **Playwright framework:** see `Playwright_8_Layer/README.md` (`npm install && npm test`).
- **Skills:** copy `test-plan-create-skill/` and `bug-report-create-skill/` into `~/.claude/skills/`, and the command files into `~/.claude/commands/`, or upload the skill folders to Claude in the cloud.

---

*Built with Claude Code — The Testing Academy.*
