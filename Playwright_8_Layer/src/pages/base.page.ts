import { Page } from '@playwright/test';
import { logger } from '../utils/logger';

export abstract class BasePage {
  constructor(public readonly page: Page) {}

  async navigate(path: string = '/'): Promise<void> {
    logger.debug(`navigate -> ${path}`);
    await this.page.goto(path);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async title(): Promise<string> {
    return this.page.title();
  }

  async url(): Promise<string> {
    return this.page.url();
  }

  async takeScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
  }
}
