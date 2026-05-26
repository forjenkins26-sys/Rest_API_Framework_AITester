import { test, expect } from '../../src/fixtures/test-fixtures';
import { users } from '../../src/data/users';

test.describe('Login @smoke', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user can log in @critical', async ({ loginPage, page }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory\.html$/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  test('locked-out user sees error', async ({ loginPage }) => {
    await loginPage.login(users.locked.username, users.locked.password);
    await loginPage.expectError(/locked out/i);
  });

  test('rejects invalid credentials', async ({ loginPage }) => {
    await loginPage.login('not_a_user', 'wrong_pass');
    await loginPage.expectError(/do not match/i);
  });

  test('rejects empty username', async ({ loginPage }) => {
    await loginPage.login('', '');
    await loginPage.expectError(/Username is required/i);
  });

  for (const role of ['standard', 'problem', 'performance'] as const) {
    test(`role: ${role} reaches inventory`, async ({ loginPage, page }) => {
      await loginPage.login(users[role].username, users[role].password);
      await expect(page).toHaveURL(/inventory\.html$/);
    });
  }
});
