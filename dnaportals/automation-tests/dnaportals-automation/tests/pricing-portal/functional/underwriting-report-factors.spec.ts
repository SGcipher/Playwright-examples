import { Page, test, expect } from '@playwright/test';
import { UnderwritingReportPage } from '../../../support/page-objects/pricing-portal/UnderwritingReportPage';
import { FactorsTab } from '../../../support/components-objects/pricing-portal/FactorsTab';
import { UnderwritingService } from '../../../support/api-objects/pricing-portal/UnderwritingService';
import { Navigation } from '../../../support/browser/Navigation';
import { PricingReportOptions, ReportName } from '../../../support/utils/helpers/types/ReportTypes';

test.describe('Underwriting Report - Factors Tab', () => {
  let page: Page;
  let underwritingReportPage: UnderwritingReportPage;
  let factorsTab: FactorsTab;
  let underwritingService: UnderwritingService;
  let navigation: Navigation;
  const reportName: ReportName = 'underwriting';

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    underwritingService = new UnderwritingService();
    underwritingReportPage = new UnderwritingReportPage(page);
    factorsTab = new FactorsTab(page);
    navigation = new Navigation(page, reportName);
    await underwritingReportPage.visit();
  });

  // Independent tests - can run in parallel
  test.describe('Default State Tests', () => {
    test.beforeEach(async () => {
      await test.step('Given the pricing analyst navigates to the Factors tab', async () => {
        const outputReqBody = (await underwritingService.reportReqBody('motor', true)) as PricingReportOptions;
        await navigation.uwReportTabNavigation('factors', outputReqBody);
      });
    });

    test('[TEST1]: Pricing Analyst should see default factors state @functional @underwriting @factors', async () => {
      await test.step('Then the factors dropdown should show default placeholder', async () => {
        await factorsTab.verifyDefaultState();
      });
    });

    test('[TEST2]: Pricing Analyst should see Add button in default state @functional @underwriting @factors', async () => {
      await test.step('Then the Add button should be visible and enabled', async () => {
        await factorsTab.verifyAddButtonIsVisible();
        await factorsTab.verifyAddButtonIsEnabled();
      });
    });

    test('[TEST3]: Pricing Analyst should not see Clear button in default state @functional @underwriting @factors', async () => {
      await test.step('Then no Clear buttons should be visible', async () => {
        await factorsTab.verifyNoFactorsSelected();
      });
    });
  });

  // Independent tests - can run in parallel
  test.describe('Single Factor Selection Tests', () => {
    test.beforeEach(async () => {
      await test.step('Given the pricing analyst navigates to the Factors tab', async () => {
        const outputReqBody = (await underwritingService.reportReqBody('motor', true)) as PricingReportOptions;
        await navigation.uwReportTabNavigation('factors', outputReqBody);
      });
    });

    test('[TEST4]: Pricing Analyst can select a single factor @functional @underwriting @factors', async () => {
      await test.step('When the pricing analyst selects "Age Group" factor', async () => {
        await factorsTab.selectFactorFromDropdown('Age Group');
      });
      await test.step('Then the "Age Group" factor should be selected', async () => {
        await factorsTab.verifyFactorIsSelected('Age Group');
      });
    });

    test('[TEST5]: Pricing Analyst can select "Gender" factor @functional @underwriting @factors', async () => {
      await test.step('When the pricing analyst selects "Gender" factor', async () => {
        await factorsTab.selectFactorFromDropdown('Gender');
      });
      await test.step('Then the "Gender" factor should be selected', async () => {
        await factorsTab.verifyFactorIsSelected('Gender');
      });
    });

    test('[TEST6]: Pricing Analyst can select "Region" factor @functional @underwriting @factors', async () => {
      await test.step('When the pricing analyst selects "Region" factor', async () => {
        await factorsTab.selectFactorFromDropdown('Region');
      });
      await test.step('Then the "Region" factor should be selected', async () => {
        await factorsTab.verifyFactorIsSelected('Region');
      });
    });

    test('[TEST7]: Pricing Analyst can clear a selected factor @functional @underwriting @factors', async () => {
      await test.step('Given the pricing analyst selects "Age Group" factor', async () => {
        await factorsTab.selectFactorFromDropdown('Age Group');
      });
      await test.step('When the pricing analyst clicks the Clear button', async () => {
        await factorsTab.clickClearButton();
      });
      await test.step('Then the factor should be cleared', async () => {
        await factorsTab.verifyFactorIsNotSelected('Age Group');
        await factorsTab.verifyNoFactorsSelected();
      });
    });
  });

  // Independent tests - can run in parallel
  test.describe('Multiple Factors Tests', () => {
    test.beforeEach(async () => {
      await test.step('Given the pricing analyst navigates to the Factors tab', async () => {
        const outputReqBody = (await underwritingService.reportReqBody('motor', true)) as PricingReportOptions;
        await navigation.uwReportTabNavigation('factors', outputReqBody);
      });
    });

    test('[TEST8]: Pricing Analyst can add multiple factors @functional @underwriting @factors', async () => {
      await test.step('When the pricing analyst selects "Age Group" factor', async () => {
        await factorsTab.selectFactorFromDropdown('Age Group');
      });
      await test.step('And clicks the Add button', async () => {
        await factorsTab.clickAddButton();
      });
      await test.step('And selects "Gender" factor', async () => {
        await factorsTab.selectFactorFromDropdown('Gender');
      });
      await test.step('Then both factors should be selected', async () => {
        await factorsTab.verifyMultipleFactorsSelected(['Age Group', 'Gender']);
      });
    });

    test('[TEST9]: Pricing Analyst can add three factors @functional @underwriting @factors', async () => {
      await test.step('When the pricing analyst adds three factors', async () => {
        await factorsTab.selectFactorFromDropdown('Age Group');
        await factorsTab.clickAddButton();
        await factorsTab.selectFactorFromDropdown('Gender');
        await factorsTab.clickAddButton();
        await factorsTab.selectFactorFromDropdown('Region');
      });
      await test.step('Then all three factors should be selected', async () => {
        await factorsTab.verifyMultipleFactorsSelected(['Age Group', 'Gender', 'Region']);
      });
    });

    test('[TEST10]: Pricing Analyst can clear all factors @functional @underwriting @factors', async () => {
      await test.step('Given the pricing analyst has selected multiple factors', async () => {
        await factorsTab.selectFactorFromDropdown('Age Group');
        await factorsTab.clickAddButton();
        await factorsTab.selectFactorFromDropdown('Gender');
      });
      await test.step('When the pricing analyst clears all factors', async () => {
        await factorsTab.deleteAllFactors();
      });
      await test.step('Then no factors should be selected', async () => {
        await factorsTab.verifyNoFactorsSelected();
      });
    });
  });

  // Independent tests - can run in parallel
  test.describe('Navigation Tests', () => {
    test.beforeEach(async () => {
      await test.step('Given the pricing analyst navigates to the Factors tab', async () => {
        const outputReqBody = (await underwritingService.reportReqBody('motor', true)) as PricingReportOptions;
        await navigation.uwReportTabNavigation('factors', outputReqBody);
      });
    });

    test('[TEST11]: Factor selection enables Next button @functional @underwriting @factors', async () => {
      await test.step('Given the pricing analyst selects "Age Group" factor', async () => {
        await factorsTab.selectFactorFromDropdown('Age Group');
      });
      await test.step('Then the Next button should be enabled', async () => {
        await navigation.verifyNextButtonIsEnabled();
      });
    });

    test('[TEST12]: No factor selection keeps Next button disabled @functional @underwriting @factors', async () => {
      await test.step('Given no factors are selected', async () => {
        // Default state - no factors selected
      });
      await test.step('Then the Next button should be disabled', async () => {
        await navigation.verifyNextButtonIsDisabled();
      });
    });

    test('[TEST13]: Factor selection persists after navigation @functional @underwriting @factors', async () => {
      await test.step('Given the pricing analyst selects "Age Group" factor', async () => {
        await factorsTab.selectFactorFromDropdown('Age Group');
      });
      await test.step('When the pricing analyst navigates to another tab and back', async () => {
        await navigation.clickNextBtn();
        await navigation.clickPreviousBtn();
      });
      await test.step('Then the factor should still be selected', async () => {
        await factorsTab.verifyFactorIsSelected('Age Group');
      });
    });
  });

  // Independent tests - can run in parallel
  test.describe('Validation Tests', () => {
    test.beforeEach(async () => {
      await test.step('Given the pricing analyst navigates to the Factors tab', async () => {
        const outputReqBody = (await underwritingService.reportReqBody('motor', true)) as PricingReportOptions;
        await navigation.uwReportTabNavigation('factors', outputReqBody);
      });
    });

    test('[TEST14]: Pricing Analyst cannot select duplicate factors @functional @underwriting @factors', async () => {
      await test.step('Given the pricing analyst selects "Age Group" factor', async () => {
        await factorsTab.selectFactorFromDropdown('Age Group');
      });
      await test.step('When the pricing analyst tries to select "Age Group" again', async () => {
        await factorsTab.clickAddButton();
        await factorsTab.selectFactorFromDropdown('Age Group');
      });
      await test.step('Then only one "Age Group" factor should be selected', async () => {
        const selectedFactors = await factorsTab.getSelectedFactors();
        const ageGroupCount = selectedFactors.filter(factor => factor === 'Age Group').length;
        expect(ageGroupCount).toBe(1);
      });
    });

    test('[TEST15]: Pricing Analyst sees dropdown options when typing @functional @underwriting @factors', async () => {
      await test.step('When the pricing analyst types in the dropdown', async () => {
        await factorsTab.dropdownPlaceholder.fill('Age');
      });
      await test.step('Then dropdown options should be visible', async () => {
        await factorsTab.verifyDropdownOptionsAreVisible();
      });
    });
  });

  // Independent tests - can run in parallel
  test.describe('Error Handling Tests', () => {
    test.beforeEach(async () => {
      await test.step('Given the pricing analyst navigates to the Factors tab', async () => {
        const outputReqBody = (await underwritingService.reportReqBody('motor', true)) as PricingReportOptions;
        await navigation.uwReportTabNavigation('factors', outputReqBody);
      });
    });

    test('[TEST16]: Factors selection handles network errors gracefully @functional @underwriting @factors', async () => {
      await test.step('Given there is a network error', async () => {
        await navigation.apiMocking.mockedResponse(500, '**/api/factors');
      });
      await test.step('When the pricing analyst tries to select a factor', async () => {
        await factorsTab.dropdownPlaceholder.fill('Age Group');
      });
      await test.step('Then an error message should be displayed', async () => {
        await factorsTab.verifyErrorMessageIsDisplayed('Failed to load factors');
      });
    });
  });
}); 