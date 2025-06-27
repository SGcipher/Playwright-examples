import { Page } from '@Playwright/test';

export class BrowserTabs {
    readonly page: Page;

    constructor (page: Page) {
        this.page = Page;
    }

    async findTab(url: string) {
        const lookerTab = await this.page.context().waitForEvent('page',(p) => p.url() == url);
        await lookerTab.bringToFront();
        return lookerTab;
    }
}