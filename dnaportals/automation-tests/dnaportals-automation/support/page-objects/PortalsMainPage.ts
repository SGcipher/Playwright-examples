import { Page, Locator } from '@playwright/test';

export class PortalsMainPage {
  readonly page: Page;
  readonly returnToPortal: Locator;
  readonly pricingPortalDashboard: Locator;
  readonly dataUploadPortal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.returnToPortal = this.page.locator('text=Return to Portals');
    this.pricingPortalDashboard = this.page.getByTestId('dashboard-pricing-portal');
    this.dataUploadPortal = this.page.getByTestId('dashboard-data-upload');
  }

  async visit() {
    await this.page.goto('./portals');
  }
}