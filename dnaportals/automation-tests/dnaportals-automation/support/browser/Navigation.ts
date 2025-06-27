import { Page, Locator, expect } from '@playwright/test';
import { ProductsTab } from '../components-objects/pricing-portal/ProductsTab';
import { SubproductsTab } from '../components-objects/pricing-portal/SubproductsTab';
import { DateRangesTab } from '../components-objects/pricing-portal/DateRangesTab';
import { FactorsTab } from '../components-objects/pricing-portal/FactorsTab';
import { PricingReportOptions, ReportTabName, ReportName } from '../utils/helpers/types/ReportTypes';
import { ApiMocking } from '../api-objects/pricing-portal/ApiMocking';

export class Navigation {
  readonly page: Page;
  readonly reportName: ReportName;
  readonly previousBtn: Locator;
  readonly nextBtn: Locator;
  readonly productsTab: ProductsTab;
  readonly subproductsTab: SubproductsTab;
  readonly dateRangesTab: DateRangesTab;
  readonly factorsTab: FactorsTab;
  readonly apiMocking: ApiMocking;

  constructor(page: Page, reportName: ReportName) {
    this.page = page;
    this.reportName = reportName;
    this.previousBtn = this.page.getByTestId('tabs-btn-previous');
    this.nextBtn = this.page.getByTestId('tabs-btn-next');
    this.productsTab = new ProductsTab(this.page);
    this.subproductsTab = new SubproductsTab(this.page);
    this.dateRangesTab = new DateRangesTab(
      this.page,
      this.reportName === 'pricing-model' ? 'date-ranges' : 'date-range',
    );
    this.factorsTab = new FactorsTab(this.page);
    this.apiMocking = new ApiMocking(this.page);
  }

  async clickPreviousBtn() {
    await this.previousBtn.click();
  }

  async clickNextBtn() {
    await this.nextBtn.click();
  }

  async verifyNextButtonIsEnabled() {
    await expect(this.nextBtn).toBeEnabled();
  }

  async verifyNextButtonIsDisabled() {
    await expect(this.nextBtn).toBeDisabled();
  }

  async navigateToProductTab(navObj: PricingReportOptions) {
    await this.productsTab.clickProduct(navObj.product);
  }

  async navigateToSubproductsTab(navObj: PricingReportOptions) {
    await this.subproductsTab.clickTabBtn();
    await this.subproductsTab.clickSubproducts(navObj.subproducts);
  }

  async navigateToDateRangesTab() {
    await this.dateRangesTab.clickTabBtn();
  }

  async navigateToFactorsTab(navObj: PricingReportOptions) {
    await this.factorsTab.clickTabBtn();
    
  }

  async uwReportTabNavigation(reportTab: ReportTabName, navObj: PricingReportOptions) {
    // Product
    await this.navigateToProductTab(navObj);
    if (reportTab === 'product') {
      return;
    }

    // Subproduct
    await this.navigateToSubproductsTab(navObj);
    if (reportTab === 'subproducts') {
      return;
    }

    // Date Ranges
    await this.navigateToDateRangesTab();
    if (reportTab === 'date-ranges') {
      return;
    }

    // Factors
    await this.navigateToFactorsTab(navObj);
  }

  async waitForResponse(url: string) {
    return await this.page.waitForResponse((response) => response.url().includes(url), { timeout: 60000 });
  }
}