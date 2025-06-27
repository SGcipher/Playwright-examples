import { Page } from '@playwright/test';

export class ApiMocking {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async mockedResponse(statusCode: number, url: string, body = {}) {
    if (statusCode === 500) {
      await this.page.route(url, async (route) => {
        const json = [{ status: 'INTERNAL_SERVER_ERROR', message: 'Internal error.', errors: [] }];
        await route.fulfill({ status: 500, body: JSON.stringify(json) });
      });
    } else {
      await this.page.route(url, async (route) => {
        await route.fulfill({
          status: statusCode,
          contentType: 'application/json',
          body: JSON.stringify(body),
        });
      });
    }
  }

  async abortResponse(url: string) {
    await this.page.route(url, async (route) => {
      route.abort();
    });
  }
}