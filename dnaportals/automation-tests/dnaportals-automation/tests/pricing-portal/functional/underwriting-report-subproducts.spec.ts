import { Page, test } from '@playwright/test';
import { UnderwritingReportPage } from '../../../support/page-objects/pricing-portal/UnderwritingReportPage';
import { ProductsTab } from '../../../support/components-objects/pricing-portal/ProductsTab';
import { SubproductsTab } from '../../../support/components-objects/pricing-portal/SubproductsTab';
import { UnderwritingService } from '../../../support/api-objects/pricing-portal/UnderwritingService';
import { Navigation } from '../../../support/browser/Navigation';
import { PricingReportOptions, ReportName } from '../../../support/utils/helpers/types/ReportTypes';

test.describe('Underwriting Report - Subproducts Tab', () => {
  let page: Page;
  let underwritingReportPage: UnderwritingReportPage;
  let productsTab: ProductsTab;
  let subproductsTab: SubproductsTab;
  let underwritingService: UnderwritingService;
  let navigation: Navigation;
  const reportName: ReportName = 'underwriting';

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    underwritingService = new UnderwritingService();
    underwritingReportPage = new UnderwritingReportPage(page);
    productsTab = new ProductsTab(page);
    subproductsTab = new SubproductsTab(page);
    navigation = new Navigation(page, reportName);
    await underwritingReportPage.visit();
  });

  // Independent tests - can run in parallel
  test.describe('Subproduct Selection Tests', () => {
    test.beforeEach(async () => {
      await test.step('Given the pricing analyst navigates to the Subproducts tab', async () => {
        const report = await underwritingService.reportReqBody('motor', false);
        await navigation.uwReportTabNavigation('subproducts', report);
      });
    });

    test('[TEST1]: Pricing Analyst should see all motor subproducts @functional @underwriting @subproducts', async () => {
      await test.step('Then the pricing analyst should see car, comprehensive, third-party, and third-party-fire-theft subproducts', async () => {
        await subproductsTab.verifyAllMotorSubproductsAreVisible();
      });
    });

    test('[TEST2]: Pricing Analyst can select Car subproduct @functional @underwriting @subproducts', async () => {
      await test.step('When the pricing analyst clicks on Car subproduct', async () => {
        await subproductsTab.clickSubproducts('car');
      });
      await test.step('Then the Car subproduct should be selected', async () => {
        await subproductsTab.verifySubproductIsSelected('car');
      });
    });

    test('[TEST3]: Pricing Analyst can select Comprehensive subproduct @functional @underwriting @subproducts', async () => {
      await test.step('When the pricing analyst clicks on Comprehensive subproduct', async () => {
        await subproductsTab.clickSubproducts('comprehensive');
      });
      await test.step('Then the Comprehensive subproduct should be selected', async () => {
        await subproductsTab.verifySubproductIsSelected('comprehensive');
      });
    });

    test('[TEST4]: Pricing Analyst can select Third Party subproduct @functional @underwriting @subproducts', async () => {
      await test.step('When the pricing analyst clicks on Third Party subproduct', async () => {
        await subproductsTab.clickSubproducts('third-party');
      });
      await test.step('Then the Third Party subproduct should be selected', async () => {
        await subproductsTab.verifySubproductIsSelected('third-party');
      });
    });

    test('[TEST5]: Multiple subproducts can be selected @functional @underwriting @subproducts', async () => {
      await test.step('When the pricing analyst selects Car and Comprehensive subproducts', async () => {
        await subproductsTab.clickSubproducts('car');
        await subproductsTab.clickSubproducts('comprehensive');
      });
      await test.step('Then both Car and Comprehensive should be selected', async () => {
        await subproductsTab.verifyMultipleSubproductsSelected(['car', 'comprehensive']);
      });
    });

    test('[TEST6]: Subproduct selection can be deselected @functional @underwriting @subproducts', async () => {
      await test.step('And the pricing analyst selects Car subproduct', async () => {
        await subproductsTab.clickSubproducts('car');
      });
      await test.step('When the pricing analyst clicks Car subproduct again', async () => {
        await subproductsTab.clickSubproducts('car');
      });
      await test.step('Then the Car subproduct should be deselected', async () => {
        await subproductsTab.verifySubproductIsNotSelected('car');
      });
    });
  });

  // Independent tests - can run in parallel
  test.describe('Model Version Tests', () => {
    test.beforeEach(async () => {
      await test.step('Given the pricing analyst navigates to the Subproducts tab', async () => {
        const report = await underwritingService.reportReqBody('motor', false);
        await navigation.uwReportTabNavigation('subproducts', report);
      });
    });

    test('[TEST7]: Model Version dropdown is visible when subproduct is selected @functional @underwriting @subproducts', async () => {
      await test.step('Given the pricing analyst selects Comprehensive subproduct', async () => {
        await subproductsTab.clickSubproducts('comprehensive');
      });
      await test.step('Then the Model Version dropdown should be visible', async () => {
        await subproductsTab.verifyModelVersionDropdownIsVisible();
      });
    });

    test('[TEST8]: Pricing Analyst can select model version @functional @underwriting @subproducts', async () => {
      await test.step('Given the pricing analyst selects Comprehensive subproduct', async () => {
        await subproductsTab.clickSubproducts('comprehensive');
      });
      await test.step('When the pricing analyst selects a model version', async () => {
        await subproductsTab.selectModelVersion('v2.1');
      });
      await test.step('Then the selected model version should be displayed', async () => {
        await subproductsTab.verifyModelVersionIsSelected('v2.1');
      });
    });
  });

  // Independent tests - can run in parallel
  test.describe('Navigation Tests', () => {
    test.beforeEach(async () => {
      await test.step('Given the pricing analyst navigates to the Subproducts tab', async () => {
        const report = await underwritingService.reportReqBody('motor', false);
        await navigation.uwReportTabNavigation('subproducts', report);
      });
    });

    test('[TEST9]: Subproduct selection enables Next button @functional @underwriting @subproducts', async () => {
      await test.step('Given the pricing analyst selects Car subproduct', async () => {
        await subproductsTab.clickSubproducts('car');
      });
      await test.step('Then the Next button should be enabled', async () => {
        await navigation.verifyNextButtonIsEnabled();
      });
    });

    test('[TEST10]: No subproduct selection keeps Next button disabled @functional @underwriting @subproducts', async () => {
      await test.step('Given no subproduct is selected', async () => {
        // Refresh page to clear any previous selections
        await page.reload();
        await underwritingReportPage.waitForPageLoad();
        const report = await underwritingService.reportReqBody('motor', false);
        await navigation.uwReportTabNavigation('subproducts', report);
      });
      await test.step('Then the Next button should be disabled', async () => {
        await navigation.verifyNextButtonIsDisabled();
      });
    });

    test('[TEST11]: Subproduct selection persists after navigation @functional @underwriting @subproducts', async () => {
      await test.step('Given the pricing analyst selects Comprehensive subproduct', async () => {
        await subproductsTab.clickSubproducts('comprehensive');
      });
      await test.step('When the pricing analyst navigates to next tab and back', async () => {
        await navigation.clickNextBtn();
        await navigation.clickPreviousBtn();
      });
      await test.step('Then Comprehensive subproduct should still be selected', async () => {
        await subproductsTab.verifySubproductIsSelected('comprehensive');
      });
    });
  });

  // Independent test - can run in parallel
  test.describe('Error Handling Tests', () => {
    test.beforeEach(async () => {
      await test.step('Given the pricing analyst navigates to the Subproducts tab', async () => {
        const report = await underwritingService.reportReqBody('motor', false);
        await navigation.uwReportTabNavigation('subproducts', report);
      });
    });

    test('[TEST12]: Subproduct selection handles network errors gracefully @functional @underwriting @subproducts', async () => {
      await test.step('Given there is a network error', async () => {
        await navigation.apiMocking.mockedResponse(500, '**/api/subproducts');
      });
      await test.step('When the pricing analyst tries to select Car subproduct', async () => {
        await subproductsTab.clickSubproducts('car');
      });
      await test.step('Then an error message should be displayed', async () => {
        await subproductsTab.verifyErrorMessageIsDisplayed('Failed to load subproducts');
      });
    });
  });
}); 