import { Page, test } from '@playwright/test';

export class PricingPortalMainPage {
  readonly page: Page;

  constructor (page: Page) {
    this.page = page;
  }

  async visit() {
    await test.step('Given a pricing analyst has browsed to the Pricing Portal Main Page', async () => {
      await this.page.goto('./portals/pricing');
    });
 }
}