<!-- Bug report template — modeled exactly on VWO-24 (https://bugzz.atlassian.net/browse/VWO-24).
     The "Summary" + field lines below configure the Jira issue. Everything from
     "### Bug Details" downward is the issue DESCRIPTION (sent with contentFormat=markdown). -->

**Summary:** Bug: {{TC-ID if any, e.g. TC-005}} {{short, specific defect title}}

- **Issue Type:** Bug
- **Project:** {{PROJECT_KEY — default VWO}}
- **Priority:** {{Highest | High | Medium | Low | Lowest — default Medium}}
- **Labels:** {{optional, e.g. login, validation}}

---

### Bug Details

{{One or two sentences: what was being tested / the scenario, and a crisp statement of the defect.}}

### Steps to Reproduce

1. {{Go to the … page.}}
2. {{action}}
3. {{action}}
4. {{Click the **…** button.}}

### Expected Result

{{What should happen. Be specific — bold the UI element / the rule that should fire.}}

### Actual Result

{{What actually happened. Quote the exact error text verbatim from the screenshot, e.g. _"Your email, password, IP address or location did not match"_!}}

### Attachments

Please look at the attached screenshot showing {{what it demonstrates — e.g. the incorrect backend error instead of inline validation}}.
