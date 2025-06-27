import { Page, Locator, expect } from '@playwright/test';
import { Report } from './Report';
import { Products } from '../../utils/helpers/types/ReportTypes';

export class ProductsTab extends Report {
  readonly motorProduct: Locator;
  readonly homeProduct: Locator;
  readonly petProduct: Locator;

  constructor(page: Page, tabName = 'product') {
    super(page, tabName);
    this.motorProduct = this.page.getByTestId('products-motor');
    this.homeProduct = this.page.getByTestId('products-home');
    this.petProduct = this.page.getByTestId('products-pet');
  }

  async clickProduct(product: Products) {
    await this.page.getByTestId(`products-${product.toLowerCase()}`).click();
  }

  async verifyAllProductsAreVisible() {
    await expect(this.motorProduct).toBeVisible();
    await expect(this.homeProduct).toBeVisible();
    await expect(this.petProduct).toBeVisible();
  }

  async verifyProductIsSelected(product: Products) {
    const productElement = this.page.getByTestId(`products-${product.toLowerCase()}`);
    await expect(productElement).toHaveAttribute('aria-selected', 'true');
  }

  async verifyProductIsNotSelected(product: Products) {
    const productElement = this.page.getByTestId(`products-${product.toLowerCase()}`);
    await expect(productElement).toHaveAttribute('aria-selected', 'false');
  }

  async verifyOnlyOneProductSelected(selectedProduct: Products) {
    const allProducts: Products[] = ['motor', 'home', 'pet'];
    
    for (const product of allProducts) {
      if (product === selectedProduct) {
        await this.verifyProductIsSelected(product);
      } else {
        await this.verifyProductIsNotSelected(product);
      }
    }
  }

  async verifySubproductsContainerIsVisible() {
    await expect(this.page.getByTestId('subproducts-container')).toBeVisible();
  }
}