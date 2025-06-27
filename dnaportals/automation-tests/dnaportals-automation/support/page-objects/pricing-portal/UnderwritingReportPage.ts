import { Page } from '@playwright/test';

export class UnderwritingReportPage {
  readonly page: Page;

  constructor (page: Page) {
    this.page = page;
  }

  async visit() {
    await this.page.goto('./portals/pricing/underwriting');
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }
}