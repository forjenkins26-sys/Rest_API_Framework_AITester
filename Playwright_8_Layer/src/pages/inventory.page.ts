import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';
import { FooterComponent } from '../components/footer.component';
import { ROUTES, SORT_OPTIONS } from '../utils/constants';
import { parsePrice } from '../utils/helpers';

type SortKey = keyof typeof SORT_OPTIONS;

export class InventoryPage extends BasePage {
  readonly header: HeaderComponent;
  readonly footer: FooterComponent;
  readonly title: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.footer = new FooterComponent(page);
    this.title = page.locator('[data-test="title"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${ROUTES.inventory}$`));
    await expect(this.title).toHaveText('Products');
  }

  async itemCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  addToCartButton(productName: string): Locator {
    const id = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return this.page.locator(`[data-test="add-to-cart-${id}"]`);
  }

  removeButton(productName: string): Locator {
    const id = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return this.page.locator(`[data-test="remove-${id}"]`);
  }

  async addProduct(productName: string): Promise<void> {
    await this.addToCartButton(productName).click();
    await expect(this.removeButton(productName)).toBeVisible();
  }

  async removeProduct(productName: string): Promise<void> {
    await this.removeButton(productName).click();
    await expect(this.addToCartButton(productName)).toBeVisible();
  }

  async sortBy(key: SortKey): Promise<void> {
    await this.sortDropdown.selectOption(SORT_OPTIONS[key]);
  }

  async listedPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allInnerTexts();
    return texts.map(parsePrice);
  }

  async listedNames(): Promise<string[]> {
    return this.itemNames.allInnerTexts();
  }
}
