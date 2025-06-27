import { Page, Locator, expect } from '@playwright/test';
import { Report } from './Report';

export class FactorsTab extends Report {
  readonly dropdownPlaceholder: Locator;
  readonly factorsButtonAdd: Locator;
  readonly factorsButtonClear: Locator;
  
  constructor (page: Page, tabName = 'factors') {
      super (page, tabName);
      this.dropdownPlaceholder = this.page.getByRole('textbox', { name: 'Choose a grouping field' });
      this.factorsButtonAdd = this.page.getByTestId('factors-btn-add');
      this.factorsButtonClear = this.page.getByTestId('factors-btn-clear');
  }

  async deleteAllFactors() {
    const initialCount = await this.factorsButtonClear.count();
    for (let i = 0; i < initialCount; i++) {
      await this.factorsButtonClear.nth(0).click();
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

  async verifyAddButtonIsDisabled() {
    await expect(this.factorsButtonAdd).toBeDisabled();
  }

  async verifyClearButtonIsVisible() {
    await expect(this.factorsButtonClear).toBeVisible();
  }

  async verifyClearButtonIsEnabled() {
    await expect(this.factorsButtonClear).toBeEnabled();
  }

  async verifyClearButtonIsDisabled() {
    await expect(this.factorsButtonClear).toBeDisabled();
  }

  async verifyFactorIsSelected(factorName: string) {
    await expect(this.page.getByText(factorName, { exact: true })).toBeVisible();
  }

  async verifyFactorIsNotSelected(factorName: string) {
    await expect(this.page.getByText(factorName, { exact: true })).not.toBeVisible();
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
    await expect(this.page.getByTestId('typeahead-dropdown-list-item')).toBeVisible();
  }

  async getSelectedFactors(): Promise<string[]> {
    const selectedFactors: string[] = [];
    const factorElements = this.page.locator('[data-testid="selected-factor"]');
    const count = await factorElements.count();
    
    for (let i = 0; i < count; i++) {
      const factorText = await factorElements.nth(i).textContent();
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
    await this.page
      .getByTestId('typeahead-dropdown-list-item')
      .getByText(factorName, { exact: true })
      .click();
  }
}