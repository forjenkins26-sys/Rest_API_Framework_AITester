---
name: create-page-object
description: Scaffolds a new Playwright Page Object in this Playwright_8_Layer repo, matching the existing POM conventions (BasePage extension, role/label/data-test locators, web-first assertions). MUST be used whenever the user says "/create-page-object", "create a page object", "create page object for this with this locator", "scaffold a page object", "new POM page", or asks to add a page class that follows the login.page.ts pattern. Reads src/pages/login.page.ts and src/pages/base.page.ts as the canonical reference, asks the user for the page's name, route, and locators, then writes src/pages/<name>.page.ts and (optionally) a matching tests/ui/<name>.spec.ts.
---

# create-page-object

Scaffold a new Playwright Page Object in the **Playwright_8_Layer** repository so that it matches the existing 8-layer architecture exactly.

This skill exists because the repo enforces a strict layering convention (Config → Utils → Data → API → Components → **Pages** → Services → Tests). Every new page object MUST follow the same shape as `src/pages/login.page.ts` so that fixtures, services, and the rest of the framework can compose it without surprises.

## When to use

Use this skill whenever the user says any of:

- `/create-page-object`
- "create a page object"
- "create page object for this with this locator"
- "scaffold a page object"
- "new POM page"
- "add a Page Object similar to login"

Even if the user is terse ("make a page for the search results", "POM for cart"), use this skill — the repo conventions are non-obvious from outside the codebase.

## What the skill produces

For input "create page object for SettingsPage", the skill produces:

```
src/pages/settings.page.ts          ← Page Object class extending BasePage
tests/ui/settings.spec.ts           ← (optional) starter spec using the new page
```

The file matches the conventions enforced in `src/pages/login.page.ts`:

- `export class <Name>Page extends BasePage`
- `readonly` `Locator` fields declared up front
- Constructor that calls `super(page)` and binds locators using **role-first** selectors
- An async `goto()` method that uses a route from `src/utils/constants.ts` when applicable
- An `expectLoaded()` method asserting the page is on the right URL with a visible heading
- Action methods that wrap user intent (verbs, not setters)
- All assertions are web-first (`await expect(locator).toBeVisible()` etc.) — **never** `waitForTimeout`

## Required workflow

Follow these steps **in order**. Do not skip.

### Step 1 — Read the canonical references

Before asking anything, read the actual repo files so you mirror the real style (not a guess):

1. `src/pages/base.page.ts` — contracts every page extends
2. `src/pages/login.page.ts` — the canonical example shape
3. `tests/ui/login.spec.ts` — how a spec consumes a page (only if a spec will be generated)
4. `src/utils/constants.ts` — see if a route constant already exists for the new page
5. `src/fixtures/test-fixtures.ts` — to know whether the user might want this page wired as a fixture

If any of those files are missing, stop and tell the user — the repo isn't in the expected state.

### Step 2 — Gather inputs from the user

Ask for the following in a single, compact message. Suggest sensible defaults where you can infer them from context:

1. **Page class name** (e.g. `CartPage`, `SettingsPage`) — defaults to PascalCase of the noun the user mentioned.
2. **File name** (e.g. `cart.page.ts`) — default = kebab-case of the class without "Page", suffixed with `.page.ts`.
3. **Route / URL path** — e.g. `/cart.html`. If it matches an existing entry in `src/utils/constants.ts` `ROUTES`, reuse that constant; otherwise propose adding a new one.
4. **Locators** — ask for a list. For each, ideally collect:
   - **field name** in TypeScript (e.g. `searchInput`)
   - **selector strategy** in priority order: `getByRole`, `getByLabel`, `getByPlaceholder`, `getByText`, `getByTestId`, `[data-test="..."]`, CSS as last resort
   - the **selector argument** (role + name, label text, etc.)
5. **Actions** — short list of high-level user actions the page exposes (e.g. `search(term)`, `addToCart(productName)`). The skill will generate stub methods for each.
6. **Generate a spec too?** Yes/no. If yes, ask which existing user role from `src/data/users.ts` it should run as (default: `standard`).

If the user already provided locators in their message ("…with this locator: …"), parse them directly and skip re-asking — confirm the parse instead.

### Step 3 — Generate the Page Object

Write `src/pages/<file-name>.page.ts` using the template in `references/page-template.md`. Conform to these rules:

- Import `BasePage` from `./base.page` and `Locator, Page, expect` from `@playwright/test`.
- If you include reusable header/footer behavior, instantiate `HeaderComponent` from `../components/header.component` like `inventory.page.ts` does.
- If a route constant exists/should exist in `src/utils/constants.ts`, **add it there** and import it as `import { ROUTES } from '../utils/constants'`. Do not hardcode URL strings inside the page class.
- Locator priority — always use the highest-priority strategy that works:
  1. `page.getByRole('button', { name: 'Save' })`
  2. `page.getByLabel('Email')`
  3. `page.getByPlaceholder('Search')`
  4. `page.getByText(...)`
  5. `page.getByTestId(...)` or `page.locator('[data-test="..."]')`
  6. CSS / XPath — only if the user explicitly insists, and add a one-line `//` comment explaining why other strategies failed.
- Every action method must be async and return `Promise<void>` (or a domain value where applicable).
- Always include `expectLoaded()` that asserts URL via `toHaveURL` and a heading/title locator via `toHaveText` or `toBeVisible`.
- Never call `page.waitForTimeout`. Use web-first assertions or `expect(locator).toBeVisible()` to gate flow.

### Step 4 — Optionally generate the spec

If the user said yes in Step 2, write `tests/ui/<file-name-without-page>.spec.ts` using the template in `references/spec-template.md`. The spec must:

- Import from `'../../src/fixtures/test-fixtures'` (the project's custom `test` re-export), not from `@playwright/test` directly.
- Use the `authedPage` fixture if the page is reachable only after login. Otherwise use `page` from a normal fixture chain (e.g. via `loginPage` then login).
- Include at least one `@smoke` tagged test that calls the new page's `expectLoaded()`.
- Have one additional test exercising the most prominent action the user described.

### Step 5 — Offer to wire into fixtures

After writing files, tell the user whether you also want to add the new page to `src/fixtures/test-fixtures.ts` as a fixture. Default: yes for pages that will be reused across multiple specs; no for one-off pages.

If yes, edit `src/fixtures/test-fixtures.ts`:

- Add `<name>Page: <Name>Page;` to the `Fixtures` type.
- Add the corresponding `<name>Page: async ({ page }, use) => { await use(new <Name>Page(page)); },` entry to `base.extend<Fixtures>({...})`.

Don't add to fixtures silently — confirm with the user first because every fixture has a per-test cost.

### Step 6 — Summarize what changed

End by listing every file you created or modified, in this exact format (so the user can grep diff):

```
created: src/pages/cart.page.ts
created: tests/ui/cart.spec.ts
modified: src/utils/constants.ts        (added ROUTES.cart)
modified: src/fixtures/test-fixtures.ts (added cartPage fixture)
```

Also remind the user how to verify:

```
npm run typecheck
npx playwright test --grep "@smoke" --project=chromium
```

## Anti-patterns to refuse

If the user requests any of these, push back politely and recommend the right pattern:

- Hardcoded CSS like `div.container > ul > li:nth-child(3) > span` — propose `getByRole`/`getByTestId` instead.
- Sleeps (`page.waitForTimeout(2000)`) — propose web-first assertions.
- Shared mutable state between tests — propose fixtures with teardown.
- Putting business workflows inside the page object — that belongs in `src/services/`. Pages own selectors + page-scoped actions only.
- Importing Playwright `test` directly in specs — they must import from `src/fixtures/test-fixtures.ts`.

## Reference files

- `references/page-template.md` — full annotated template for `<name>.page.ts`
- `references/spec-template.md` — full annotated template for `<name>.spec.ts`
- `references/locator-priority.md` — quick reference for selector strategy choice
