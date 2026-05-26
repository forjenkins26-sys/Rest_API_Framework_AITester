import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { ROUTES } from '../utils/constants';
import { CheckoutInfo } from '../data/users';
import { parsePrice } from '../utils/helpers';

export class CheckoutPage extends BasePage {
  readonly title: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('[data-test="title"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async expectStepOne(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${ROUTES.checkoutStepOne}$`));
    await expect(this.title).toHaveText('Checkout: Your Information');
  }

  async expectStepTwo(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${ROUTES.checkoutStepTwo}$`));
    await expect(this.title).toHaveText('Checkout: Overview');
  }

  async expectComplete(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${ROUTES.checkoutComplete}$`));
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }

  async fillInfo(info: CheckoutInfo): Promise<void> {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.postalCodeInput.fill(info.postalCode);
    await this.continueButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async subtotal(): Promise<number> {
    return parsePrice(await this.subtotalLabel.innerText());
  }

  async tax(): Promise<number> {
    return parsePrice(await this.taxLabel.innerText());
  }

  async total(): Promise<number> {
    return parsePrice(await this.totalLabel.innerText());
  }
}
