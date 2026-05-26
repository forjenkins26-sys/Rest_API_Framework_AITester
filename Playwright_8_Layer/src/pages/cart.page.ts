import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';
import { ROUTES } from '../utils/constants';

export class CartPage extends BasePage {
  readonly header: HeaderComponent;
  readonly title: Locator;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.title = page.locator('[data-test="title"]');
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.cartItemNames = page.locator('[data-test="inventory-item-name"]');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${ROUTES.cart}$`));
    await expect(this.title).toHaveText('Your Cart');
  }

  async expectItemNames(expected: string[]): Promise<void> {
    await expect(this.cartItemNames).toHaveText(expected);
  }

  async removeItem(productName: string): Promise<void> {
    const id = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    await this.page.locator(`[data-test="remove-${id}"]`).click();
  }

  async startCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
