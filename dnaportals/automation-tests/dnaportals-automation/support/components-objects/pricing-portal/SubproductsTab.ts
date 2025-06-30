import { Page, Locator, expect } from '@playwright/test';
import { Report } from './Report';
import { UISubproducts } from '../../utils/helpers/types/ReportTypes';

export class SubproductsTab extends Report {
  readonly subproducts: Locator;
  readonly modelVersionDropdown: Locator;
  readonly carSubproduct: Locator;
  readonly comprehensiveSubproduct: Locator;
  readonly thirdPartySubproduct: Locator;
  readonly thirdPartyFireTheftSubproduct: Locator;
  readonly typeaheadDropdownListItem: Locator;
  readonly modelVersionText: Locator;

  constructor(page: Page, tabName = 'subproducts') {
    super(page, tabName);
    this.subproducts = this.page.getByTestId('option-subproducts');
    this.modelVersionDropdown = this.subproducts.getByTestId('sub-products-modelversion-dropdown');
    this.carSubproduct = this.page.getByTestId('products-car');
    this.comprehensiveSubproduct = this.page.getByTestId('products-comprehensive');
    this.thirdPartySubproduct = this.page.getByTestId('products-third-party');
    this.thirdPartyFireTheftSubproduct = this.page.getByTestId('products-third-party-fire-theft');
    this.typeaheadDropdownListItem = this.page.getByTestId('typeahead-dropdown-list-item');
    this.modelVersionText = this.page.getByText('Model Version');
  }

  private getSubproductLocator(subproduct: UISubproducts): Locator {
    switch (subproduct.toLowerCase()) {
      case 'car':
        return this.carSubproduct;
      case 'comprehensive':
        return this.comprehensiveSubproduct;
      case 'third-party':
        return this.thirdPartySubproduct;
      case 'third-party-fire-theft':
        return this.thirdPartyFireTheftSubproduct;
      default:
        throw new Error(`Unknown subproduct: ${subproduct}`);
    }
  }

  async selectModelVersion(version: string) {
    await this.modelVersionDropdown.selectOption(version);
  }

  async clickSubproducts(subproducts?: UISubproducts[] | UISubproducts) {
    if (!subproducts) {
      await this.subproducts.first().click();
    } else {
      const subproductsArray = Array.isArray(subproducts) ? subproducts : [subproducts];
      for (let i = 0; i < subproductsArray.length; i++) {
        await this.getSubproductLocator(subproductsArray[i]).click();
        if (this.page.url().includes('/pricing/model')) {
          await expect(this.modelVersionText).toBeVisible({ timeout: 35000 });
        }
      }
    }
  }

  async verifyAllMotorSubproductsAreVisible() {
    await expect(this.carSubproduct).toBeVisible();
    await expect(this.comprehensiveSubproduct).toBeVisible();
    await expect(this.thirdPartySubproduct).toBeVisible();
    await expect(this.thirdPartyFireTheftSubproduct).toBeVisible();
  }

  async verifySubproductIsSelected(subproduct: UISubproducts) {
    const subproductElement = this.getSubproductLocator(subproduct);
    await expect(subproductElement).toHaveAttribute('aria-selected', 'true');
  }

  async verifySubproductIsNotSelected(subproduct: UISubproducts) {
    const subproductElement = this.getSubproductLocator(subproduct);
    await expect(subproductElement).toHaveAttribute('aria-selected', 'false');
  }

  async verifyMultipleSubproductsSelected(selectedSubproducts: UISubproducts[]) {
    const allSubproducts: UISubproducts[] = ['car', 'comprehensive', 'third-party', 'third-party-fire-theft'];
    
    for (const subproduct of allSubproducts) {
      if (selectedSubproducts.includes(subproduct)) {
        await this.verifySubproductIsSelected(subproduct);
      } else {
        await this.verifySubproductIsNotSelected(subproduct);
      }
    }
  }

  async verifyModelVersionDropdownIsVisible() {
    await expect(this.modelVersionDropdown).toBeVisible();
  }

  async verifyModelVersionIsSelected(version: string) {
    await expect(this.modelVersionDropdown).toHaveValue(version);
  }
}