import { Locator, Page, expect } from '@playwright/test';

export class FooterComponent {
  readonly root: Locator;
  readonly twitter: Locator;
  readonly facebook: Locator;
  readonly linkedin: Locator;
  readonly copyrightText: Locator;

  constructor(page: Page) {
    this.root = page.locator('footer');
    this.twitter = page.locator('[data-test="social-twitter"]');
    this.facebook = page.locator('[data-test="social-facebook"]');
    this.linkedin = page.locator('[data-test="social-linkedin"]');
    this.copyrightText = page.locator('.footer_copy');
  }

  async expectVisible(): Promise<void> {
    await expect(this.root).toBeVisible();
    await expect(this.copyrightText).toContainText('Sauce Labs');
  }
}
