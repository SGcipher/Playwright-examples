import { Page, Locator, expect } from '@playwright/test';

export class Report {
  readonly page: Page;
  readonly tabBtn: Locator;
  readonly spinner: Locator;

  constructor(page: Page, tabName?: string) {
    this.page = page;
    this.tabBtn = this.page.getByTestId(`tabs-${tabName}`);
    this.spinner = this.page.getByText('Loading');
  }

  private getTextLocator(text: string): Locator {
    return this.page.getByText(text);
  }

  async clickTabBtn() {
    await this.tabBtn.click();
  }

  async verifyErrorMessageIsDisplayed(message: string) {
    const errorLocator = this.getTextLocator(message);
    await expect(errorLocator).toBeVisible();
  }
}