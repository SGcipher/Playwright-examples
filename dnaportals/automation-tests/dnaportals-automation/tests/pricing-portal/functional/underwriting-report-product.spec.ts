import { Page, test } from '@playwright/test';
import { UnderwritingReportPage } from '../../../support/page-objects/pricing-portal/UnderwritingReportPage';
import { ProductsTab } from '../../../support/components-objects/pricing-portal/ProductsTab';
import { UnderwritingService } from '../../../support/api-objects/pricing-portal/UnderwritingService';
import { Navigation } from '../../../support/browser/Navigation';
import { PricingReportOptions, ReportName } from '../../../support/utils/helpers/types/ReportTypes';
import { SubproductsTab } from '../../../support/components-objects/pricing-portal/SubproductsTab';

test.describe('Underwriting Report - Product Tab', () => {
  let page: Page;
  let underwritingReportPage: UnderwritingReportPage;
  let productsTab: ProductsTab;
  let underwritingService: UnderwritingService;
  let navigation: Navigation;
  let subproductsTab: SubproductsTab;
  const reportName: ReportName = 'underwriting';

  test.beforeAll(async ({ browser }) => {
    await test.step('Given the pricing analyst navigates to the Products tab', async () => {
      page = await browser.newPage();
      underwritingService = new UnderwritingService();
      underwritingReportPage = new UnderwritingReportPage(page);
      productsTab = new ProductsTab(page);
      subproductsTab = new SubproductsTab(page);
      navigation = new Navigation(page, reportName);
      await underwritingReportPage.visit();
    });
  });

  // Independent tests - can run in parallel
  test.describe('Product Selection Tests', () => {
    test('[TEST1]: Pricing Analyst should see all available products @functional @underwriting @product', async () => {
      await test.step('Then the pricing analyst should see motor, home, and pet products', async () => {
        await productsTab.verifyAllProductsAreVisible();
      });
    });

    test('[TEST2]: Pricing Analyst can select Motor product @functional @underwriting @product', async () => {
      await test.step('When the pricing analyst clicks on Motor product', async () => {
        await productsTab.clickProduct('motor');
      });
      await test.step('Then the Motor product should be selected', async () => {
        await productsTab.verifyOnlyOneProductSelected('motor');
      });
    });

    test('[TEST3]: Pricing Analyst can select Home product @functional @underwriting @product', async () => {
      await test.step('When the pricing analyst clicks on Home product', async () => {
        await productsTab.clickProduct('home');
      });
      await test.step('Then the Home product should be selected', async () => {
        await productsTab.verifyOnlyOneProductSelected('home');
      });
    });

    test('[TEST4]: Pricing Analyst can select Pet product @functional @underwriting @product', async () => {
      await test.step('When the pricing analyst clicks on Pet product', async () => {
        await productsTab.clickProduct('pet');
      });
      await test.step('Then the Pet product should be selected', async () => {
        await productsTab.verifyOnlyOneProductSelected('pet');
      });
    });

    test('[TEST5]: Only one product can be selected at a time @functional @underwriting @product', async () => {
      await test.step('When the pricing analyst selects Motor product', async () => {
        await productsTab.clickProduct('motor');
      });
      await test.step('And then selects Home product', async () => {
        await productsTab.clickProduct('home');
      });
      await test.step('Then only Home should be selected and Motor should be deselected', async () => {
        await productsTab.verifyOnlyOneProductSelected('home');
      });
    });
  });

  // Independent tests - can run in parallel
  test.describe('Product Navigation Tests', () => {
    test('[TEST6]: Product selection enables Next button @functional @underwriting @product', async () => {
      await test.step('Given the pricing analyst selects Motor product', async () => {
        await productsTab.clickProduct('motor');
      });
      await test.step('Then the Next button should be enabled', async () => {
        await navigation.verifyNextButtonIsEnabled();
      });
    });

    test('[TEST7]: No product selection keeps Next button disabled @functional @underwriting @product', async () => {
      await test.step('Given no product is selected', async () => {
        await page.reload();
        await underwritingReportPage.waitForPageLoad();
      });
      await test.step('Then the Next button should be disabled', async () => {
        await navigation.verifyNextButtonIsDisabled();
      });
    });

    test('[TEST8]: Product selection persists after navigation @functional @underwriting @product', async () => {
      await test.step('Given the pricing analyst selects Motor product', async () => {
        await productsTab.clickProduct('motor');
      });
      await test.step('When the pricing analyst navigates to next tab and back', async () => {
        await navigation.clickNextBtn();
        await navigation.clickPreviousBtn();
      });
      await test.step('Then Motor product should still be selected', async () => {
        await productsTab.verifyProductIsSelected('motor');
      });
    });
  });

  // Independent tests - can run in parallel
  test.describe('Product Validation Tests', () => {
    test('[TEST9]: Product selection shows appropriate subproducts @functional @underwriting @product', async () => {
      await test.step('Given the pricing analyst selects Motor product', async () => {
        await productsTab.clickProduct('motor');
      });
      await test.step('When the pricing analyst navigates to subproducts tab', async () => {
        await navigation.clickNextBtn();
      });
      await test.step('Then motor-specific subproducts should be visible', async () => {
        await subproductsTab.verifyAllMotorSubproductsAreVisible();
      });
    });

    test('[TEST10]: Different products show different subproduct options @functional @underwriting @product', async () => {
      await test.step('Given the pricing analyst selects Home product', async () => {
        await productsTab.clickProduct('home');
      });
      await test.step('When the pricing analyst navigates to subproducts tab', async () => {
        await navigation.clickNextBtn();
      });
      await test.step('Then home-specific subproducts should be visible', async () => {
        await productsTab.verifySubproductsContainerIsVisible();
      });
    });
  });

  // Independent test - can run in parallel
  test.describe('Error Handling Tests', () => {
    test('[TEST11]: Product selection handles network errors gracefully @functional @underwriting @product', async () => {
      await test.step('Given there is a network error', async () => {
        await navigation.apiMocking.mockedResponse(500, '**/api/products');
      });
      await test.step('When the pricing analyst tries to select Motor product', async () => {
        await productsTab.clickProduct('motor');
      });
      await test.step('Then an error message should be displayed', async () => {
        await productsTab.verifyErrorMessageIsDisplayed('Failed to load products');
      });
    });
  });
}); 