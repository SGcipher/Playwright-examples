import { Page } from '@playwright/test';

export class BrowserTabs {
    readonly page: Page;

    constructor (page: Page) {
        this.page = page;
    }

    async findTab(url: string) {
        const lookerTab = await this.page.context().waitForEvent('page',(p) => p.url() == url);
        await lookerTab.bringToFront();
        return lookerTab;
    }
}