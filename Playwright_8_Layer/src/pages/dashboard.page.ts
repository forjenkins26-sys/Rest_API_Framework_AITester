import { FrameLocator, Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';
import { FooterComponent } from '../components/footer.component';
import { ROUTES } from '../utils/constants';

export class DashboardPage extends BasePage {
  readonly header: HeaderComponent;
  readonly footer: FooterComponent;

  // Requested locators
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly dashboardContainer: Locator;
  readonly h1: Locator;
  readonly h2: Locator;
  readonly form: Locator;
  readonly submitButton: Locator;
  readonly iframe: FrameLocator;

  // Sensible defaults a dashboard page typically exposes
  readonly title: Locator;
  readonly mainContent: Locator;
  readonly searchInput: Locator;
  readonly profileMenu: Locator;
  readonly logoutLink: Locator;
  readonly errorMessage: Locator;
  readonly successToast: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.footer = new FooterComponent(page);

    // Requested locators — role-first, with stable fallbacks
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.dashboardContainer = page.getByTestId('dashboard');
    this.h1 = page.getByRole('heading', { level: 1 });
    this.h2 = page.getByRole('heading', { level: 2 });
    this.form = page.locator('form'); // <form> has no implicit ARIA role; CSS is the right tool here
    this.submitButton = page.getByRole('button', { name: /submit|save|continue/i });
    this.iframe = page.frameLocator('iframe').first();

    // Defaults
    this.title = page.locator('[data-test="title"]');
    this.mainContent = page.getByRole('main');
    this.searchInput = page.getByPlaceholder('Search');
    this.profileMenu = page.getByRole('button', { name: /profile|account/i });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
    this.errorMessage = page.locator('[data-test="error"]');
    this.successToast = page.getByRole('status');
    this.loadingSpinner = page.getByRole('progressbar');
  }

  async goto(): Promise<void> {
    await this.navigate(ROUTES.dashboard);
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${ROUTES.dashboard}$`));
    await expect(this.dashboardContainer.or(this.h1)).toBeVisible();
  }

  async expectHeading(text: string | RegExp): Promise<void> {
    if (typeof text === 'string') {
      await expect(this.h1).toHaveText(text);
    } else {
      await expect(this.h1).toHaveText(text);
    }
  }

  async fillCredentials(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async submitForm(username: string, password: string): Promise<void> {
    await this.fillCredentials(username, password);
    await this.submit();
  }

  async expectError(message: string | RegExp): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    if (typeof message === 'string') {
      await expect(this.errorMessage).toContainText(message);
    } else {
      await expect(this.errorMessage).toHaveText(message);
    }
  }

  async expectNoLoadingSpinner(): Promise<void> {
    await expect(this.loadingSpinner).toBeHidden();
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
  }

  async typeInIframe(selector: string, text: string): Promise<void> {
    await this.iframe.locator(selector).fill(text);
  }

  async clickInIframe(selector: string): Promise<void> {
    await this.iframe.locator(selector).click();
  }

  async logout(): Promise<void> {
    await this.profileMenu.click();
    await this.logoutLink.click();
  }
}
