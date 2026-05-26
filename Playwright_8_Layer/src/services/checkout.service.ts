import { Page, expect } from '@playwright/test';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { CheckoutInfo, defaultCheckoutInfo } from '../data/users';
import { Product } from '../data/products';
import { round2, sum } from '../utils/helpers';
import { logger } from '../utils/logger';

export interface CheckoutSummary {
  subtotal: number;
  tax: number;
  total: number;
}

export class CheckoutService {
  constructor(private readonly page: Page) {}

  async purchase(items: Product[], info: CheckoutInfo = defaultCheckoutInfo): Promise<CheckoutSummary> {
    logger.info(`Purchasing ${items.length} item(s)`);
    const inventory = new InventoryPage(this.page);
    await inventory.expectLoaded();

    for (const item of items) {
      await inventory.addProduct(item.name);
    }
    await inventory.header.expectCartCount(items.length);
    await inventory.header.openCart();

    const cart = new CartPage(this.page);
    await cart.expectLoaded();
    await cart.expectItemNames(items.map((i) => i.name));
    await cart.startCheckout();

    const checkout = new CheckoutPage(this.page);
    await checkout.expectStepOne();
    await checkout.fillInfo(info);
    await checkout.expectStepTwo();

    const subtotal = await checkout.subtotal();
    const tax = await checkout.tax();
    const total = await checkout.total();
    const expectedSubtotal = round2(sum(items.map((i) => i.price)));
    expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
    expect(round2(subtotal + tax)).toBeCloseTo(total, 2);

    await checkout.finish();
    await checkout.expectComplete();

    return { subtotal, tax, total };
  }
}
