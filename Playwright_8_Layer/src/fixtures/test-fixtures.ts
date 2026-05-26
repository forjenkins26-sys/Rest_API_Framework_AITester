import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { AuthService } from '../services/auth.service';
import { CheckoutService } from '../services/checkout.service';
import { ApiClient } from '../api/api-client';
import { ProductsApi } from '../api/products.api';
import { STORAGE_PATHS } from '../utils/constants';
import { env } from '../config/env';

type Fixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  authService: AuthService;
  checkoutService: CheckoutService;
  authedPage: Page;
  apiClient: ApiClient;
  productsApi: ProductsApi;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  authService: async ({ page }, use) => {
    await use(new AuthService(page));
  },
  checkoutService: async ({ page }, use) => {
    await use(new CheckoutService(page));
  },
  authedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: STORAGE_PATHS.standardUser,
      baseURL: env.baseUrl,
    });
    const page = await context.newPage();
    await page.goto('/inventory.html');
    await use(page);
    await context.close();
  },
  apiClient: async ({}, use) => {
    const client = await ApiClient.create();
    await use(client);
    await client.dispose();
  },
  productsApi: async ({ apiClient }, use) => {
    await use(new ProductsApi(apiClient));
  },
});

export { expect } from '@playwright/test';
