import { Locator, Page, expect } from '@playwright/test';

export class HeaderComponent {
  readonly root: Locator;
  readonly appLogo: Locator;
  readonly burgerMenuButton: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator('[data-test="primary-header"], .primary_header').first();
    this.appLogo = page.getByText('Swag Labs');
    this.burgerMenuButton = page.getByRole('button', { name: 'Open Menu' });
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
    this.resetAppStateLink = page.getByRole('link', { name: 'Reset App State' });
  }

  async cartCount(): Promise<number> {
    if ((await this.cartBadge.count()) === 0) return 0;
    return Number(await this.cartBadge.innerText());
  }

  async expectCartCount(expected: number): Promise<void> {
    if (expected === 0) {
      await expect(this.cartBadge).toBeHidden();
      return;
    }
    await expect(this.cartBadge).toHaveText(String(expected));
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async openMenu(): Promise<void> {
    await this.burgerMenuButton.click();
    await expect(this.logoutLink).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await this.logoutLink.click();
  }

  async resetAppState(): Promise<void> {
    await this.openMenu();
    await this.resetAppStateLink.click();
  }
}
