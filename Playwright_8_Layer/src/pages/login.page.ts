import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { ROUTES } from '../utils/constants';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorCloseButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('.error-button');
  }

  async goto(): Promise<void> {
    await this.navigate(ROUTES.login);
    await expect(this.loginButton).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectError(message: string | RegExp): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    if (typeof message === 'string') {
      await expect(this.errorMessage).toContainText(message);
    } else {
      await expect(this.errorMessage).toHaveText(message);
    }
  }

  async dismissError(): Promise<void> {
    await this.errorCloseButton.click();
    await expect(this.errorMessage).toBeHidden();
  }
}
