import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login.page';
import { users } from '../src/data/users';
import { STORAGE_PATHS } from '../src/utils/constants';

setup('authenticate as standard user', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(users.standard.username, users.standard.password);
  await expect(page).toHaveURL(/inventory\.html$/);
  await page.context().storageState({ path: STORAGE_PATHS.standardUser });
});
