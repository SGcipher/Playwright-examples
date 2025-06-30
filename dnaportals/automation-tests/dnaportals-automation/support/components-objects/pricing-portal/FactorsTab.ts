import { Page, Locator, expect } from '@playwright/test';
import { Report } from './Report';

export class FactorsTab extends Report {
  readonly dropdownPlaceholder: Locator;
  readonly factorsButtonAdd: Locator;
  readonly factorsButtonClear: Locator;
  readonly typeaheadDropdownListItem: Locator;
  readonly selectedFactor: Locator;
  
  constructor (page: Page, tabName = 'factors') {
      super (page, tabName);
      this.dropdownPlaceholder = this.page.getByRole('textbox', { name: 'Choose a grouping field' });
      this.factorsButtonAdd = this.page.getByTestId('factors-btn-add');
      this.factorsButtonClear = this.page.getByTestId('factors-btn-clear');
      this.typeaheadDropdownListItem = this.page.getByTestId('typeahead-dropdown-list-item');
      this.selectedFactor = this.page.locator('[data-testid="selected-factor"]');
  }

  private getFactorTextLocator(factorName: string): Locator {
    return this.page.getByText(factorName, { exact: true });
  }

  async deleteAllFactors() {
    const initialCount = await this.factorsButtonClear.count();
    while (await this.factorsButtonClear.count() > 0) {
      await this.factorsButtonClear.first().click();
    }
  }

  async verifyDefaultState() {
    await expect(this.dropdownPlaceholder).toBeVisible();
    await expect(this.dropdownPlaceholder).toHaveValue('');
    await expect(this.dropdownPlaceholder).toHaveAttribute('placeholder', 'Choose a grouping field');
  }

  async verifyAddButtonIsVisible() {
    await expect(this.factorsButtonAdd).toBeVisible();
  }

  async verifyAddButtonIsEnabled() {
    await expect(this.factorsButtonAdd).toBeEnabled();
  }

  async verifyFactorIsSelected(factorName: string) {
    const factorLocator = this.getFactorTextLocator(factorName);
    await expect(factorLocator).toBeVisible();
  }

  async verifyFactorIsNotSelected(factorName: string) {
    const factorLocator = this.getFactorTextLocator(factorName);
    await expect(factorLocator).not.toBeVisible();
  }

  async verifyMultipleFactorsSelected(factorNames: string[]) {
    for (const factorName of factorNames) {
      await this.verifyFactorIsSelected(factorName);
    }
  }

  async verifyNoFactorsSelected() {
    await expect(this.factorsButtonClear).toHaveCount(0);
  }

  async verifyDropdownOptionsAreVisible() {
    await expect(this.typeaheadDropdownListItem).toBeVisible();
  }

  async getSelectedFactors(): Promise<string[]> {
    const selectedFactors: string[] = [];
    const count = await this.selectedFactor.count();
    
    for (let i = 0; i < count; i++) {
      const factorText = await this.selectedFactor.nth(i).textContent();
      if (factorText) {
        selectedFactors.push(factorText.trim());
      }
    }
    
    return selectedFactors;
  }

  async clickAddButton() {
    await this.factorsButtonAdd.click();
  }

  async clickClearButton() {
    await this.factorsButtonClear.first().click();
  }

  async selectFactorFromDropdown(factorName: string) {
    await this.dropdownPlaceholder.fill(factorName);
    await this.typeaheadDropdownListItem
      .getByText(factorName, { exact: true })
      .click();
  }
}