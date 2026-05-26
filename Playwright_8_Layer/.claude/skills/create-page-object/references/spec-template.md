# Spec Template

Template for `tests/ui/<name>.spec.ts` generated alongside a new page object. The spec must import from the project's custom fixtures, not from `@playwright/test` directly.

## Anatomy

```ts
import { test, expect } from '../../src/fixtures/test-fixtures';
import { <Name>Page } from '../../src/pages/<name>.page';
// If a service composes this page, import it here:
// import { <Name>Service } from '../../src/services/<name>.service';

test.describe('<Feature> @regression', () => {
  test('page loads @smoke', async ({ authedPage }) => {
    const page = new <Name>Page(authedPage);
    await page.goto();
    await page.expectLoaded();
  });

  test('<primary user action> @critical', async ({ authedPage }) => {
    const page = new <Name>Page(authedPage);
    await page.goto();
    await page.<actionName>(/* args */);
    // assert outcome
  });
});
```

## Rules

- Tag every test with `@smoke`, `@regression`, or `@critical` so the team can run targeted suites.
- Use `authedPage` when the route requires login; use `loginPage` + `authService` chain when explicitly testing pre-auth flows.
- Keep `beforeEach` minimal — prefer fixtures for setup.
- For data-driven cases, use a `for (const x of cases) { test('...', ...) }` loop, not nested `describe` boilerplate.
- Never call `page.waitForTimeout`. Wait via web-first assertions.
- Don't introduce hidden state shared between tests — each `test()` must be runnable in isolation under `--workers > 1`.

## Concrete example (Settings page)

```ts
import { test, expect } from '../../src/fixtures/test-fixtures';
import { SettingsPage } from '../../src/pages/settings.page';

test.describe('Settings @regression', () => {
  test('page loads @smoke', async ({ authedPage }) => {
    const settings = new SettingsPage(authedPage);
    await settings.goto();
    await settings.expectLoaded();
  });

  test('update display name shows confirmation @critical', async ({ authedPage }) => {
    const settings = new SettingsPage(authedPage);
    await settings.goto();
    await settings.updateDisplayName('Pramod QA');
    await expect(settings.successToast).toContainText(/saved|updated/i);
  });
});
```
