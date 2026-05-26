import { Page, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { TestUser, users } from '../data/users';
import { logger } from '../utils/logger';

export class AuthService {
  constructor(private readonly page: Page) {}

  async loginAs(role: TestUser['role']): Promise<InventoryPage> {
    const user = users[role];
    logger.info(`Logging in as ${user.username}`);
    const login = new LoginPage(this.page);
    await login.goto();
    await login.login(user.username, user.password);
    if (role === 'locked') {
      await login.expectError(/locked out/i);
      throw new Error(`User ${user.username} is locked out`);
    }
    const inventory = new InventoryPage(this.page);
    await inventory.expectLoaded();
    return inventory;
  }

  async logout(): Promise<void> {
    const inventory = new InventoryPage(this.page);
    await inventory.header.logout();
    await expect(this.page).toHaveURL(/\/$/);
  }
}
