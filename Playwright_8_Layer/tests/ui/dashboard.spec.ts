import { test, expect } from '../../src/fixtures/test-fixtures';
import { DashboardPage } from '../../src/pages/dashboard.page';
import { users } from '../../src/data/users';

test.describe('Dashboard @regression', () => {
  test('page loads @smoke', async ({ authedPage }) => {
    const dashboard = new DashboardPage(authedPage);
    await dashboard.goto();
    await dashboard.expectLoaded();
    await expect(dashboard.h1).toBeVisible();
  });

  test('shows H1 and H2 headings', async ({ authedPage }) => {
    const dashboard = new DashboardPage(authedPage);
    await dashboard.goto();
    await expect(dashboard.h1).toBeVisible();
    await expect(dashboard.h2.first()).toBeVisible();
  });

  test('form accepts credentials and submits @critical', async ({ authedPage }) => {
    const dashboard = new DashboardPage(authedPage);
    await dashboard.goto();
    await dashboard.submitForm(users.standard.username, users.standard.password);
    await expect(dashboard.errorMessage).toBeHidden();
  });

  test('search field is reachable', async ({ authedPage }) => {
    const dashboard = new DashboardPage(authedPage);
    await dashboard.goto();
    await expect(dashboard.searchInput).toBeVisible();
  });

  test('iframe is present and addressable', async ({ authedPage }) => {
    const dashboard = new DashboardPage(authedPage);
    await dashboard.goto();
    await expect(authedPage.locator('iframe').first()).toBeAttached();
  });
});
