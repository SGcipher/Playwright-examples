import { Page, test } from '@playwright/test';
import { UnderwritingReportPage } from '../../../support/page-objects/pricing-portal/UnderwritingReportPage';
import { DateRangesTab } from '../../../support/components-objects/pricing-portal/DateRangesTab';
import { UnderwritingService } from '../../../support/api-objects/pricing-portal/UnderwritingService';
import { Navigation } from '../../../support/browser/Navigation';
import { PricingReportOptions, ReportName, DateRange } from '../../../support/utils/helpers/types/ReportTypes';

test.describe('Underwriting Report - Date Ranges Tab', () => {
  let page: Page;
  let underwritingReportPage: UnderwritingReportPage;
  let underwritingService: UnderwritingService;
  let dateRangesTab: DateRangesTab;
  let navigation: Navigation;
  const reportName: ReportName = 'underwriting';

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    underwritingService = new UnderwritingService();
    underwritingReportPage = new UnderwritingReportPage(page);
    dateRangesTab = new DateRangesTab(page);
    navigation = new Navigation(page, reportName);
    await underwritingReportPage.visit();
  });

  // Independent tests - can run in parallel
  test.describe('Toggle Functionality Tests', () => {
    test.beforeEach(async () => {
      await test.step('Given the pricing analyst navigates to the Date Ranges tab', async () => {
        const outputReqBody = (await underwritingService.reportReqBody('motor', true)) as PricingReportOptions;
        await navigation.uwReportTabNavigation('date-ranges', outputReqBody);
      });
    });

    test('[TEST1]: Pricing Analyst should see "Use Default Dates" toggle enabled @functional @underwriting @date-Range', async () => {
      await test.step('Then the "Use default dates" toggle should be checked', async () => {
        await dateRangesTab.verifyToggleIsChecked();
      });
    });

    test('[TEST2]: Pricing Analyst can uncheck default dates toggle @functional @underwriting @date-Range', async () => {
      await test.step('When the pricing analyst unchecks "Use default dates" toggle', async () => {
        await dateRangesTab.uncheckDefaultDateToggle();
      });
      await test.step('Then the toggle should be unchecked', async () => {
        await dateRangesTab.verifyToggleIsUnchecked();
      });
    });

    test('[TEST3]: Pricing Analyst toggle state should persist after navigation @functional @underwriting @date-Range', async () => {
      await test.step('When the pricing analyst unchecks the default dates toggle', async () => {
        await dateRangesTab.uncheckDefaultDateToggle();
      });
      await test.step('And navigates to another tab and back', async () => {
        await navigation.clickNextBtn(); 
        await navigation.clickPreviousBtn(); 
      });
      await test.step('Then the toggle should remain unchecked', async () => {
        await dateRangesTab.verifyToggleIsUnchecked();
      });
    });
  });

  // Independent tests - can run in parallel
  test.describe('Date Input Tests', () => {
    test.beforeEach(async () => {
      await test.step('Given the pricing analyst navigates to the Date Ranges tab', async () => {
        const outputReqBody = (await underwritingService.reportReqBody('motor', true)) as PricingReportOptions;
        await navigation.uwReportTabNavigation('date-ranges', outputReqBody);
      });
    });

    test('[TEST4]: Pricing Analyst can input custom date fields when toggle is unchecked @functional @underwriting @date-Range', async () => {
      await test.step('When the pricing analyst unchecks "Use default dates" toggle', async () => {
        await dateRangesTab.uncheckDefaultDateToggle();
      });
      await test.step('And inputs custom date ranges', async () => {
        const dateRange: DateRange = { fromDate: '2023-10-10', toDate: '2023-12-08' };
        await dateRangesTab.fillDateInputs(dateRange);
      });
      await test.step('Then the date range should be set correctly', async () => {
        await dateRangesTab.verifyDateRangeIsSet({ fromDate: '2023-10-10', toDate: '2023-12-08' });
      });
    });
  });

  // Independent tests - can run in parallel
  test.describe('Validation Tests', () => {
    test.beforeEach(async () => {
      await test.step('Given the pricing analyst navigates to the Date Ranges tab', async () => {
        const outputReqBody = (await underwritingService.reportReqBody('motor', true)) as PricingReportOptions;
        await navigation.uwReportTabNavigation('date-ranges', outputReqBody);
      });
    });

    test('[TEST5]: Pricing Analyst should see validation error for invalid date range @functional @underwriting @date-Range', async () => {
      await test.step('When the pricing analyst enters an invalid date range (fromDate > toDate)', async () => {
        await dateRangesTab.uncheckDefaultDateToggle();
        const invalidDateRange: DateRange = { fromDate: '2023-12-31', toDate: '2023-01-01' };
        await dateRangesTab.fillDateInputs(invalidDateRange);
      });
      await test.step('Then a validation error should be displayed', async () => {
        await dateRangesTab.verifyErrorMessageIsDisplayed('Invalid date range: fromDate is greater than toDate');
      });
    });

    test('[TEST6]: Pricing Analyst should see validation for future dates @functional @underwriting @date-Range', async () => {
      await test.step('When the pricing analyst enters future dates', async () => {
        await dateRangesTab.uncheckDefaultDateToggle();
        const futureDateRange: DateRange = { 
          fromDate: '2026-01-01', 
          toDate: '2026-12-31' 
        };
        await dateRangesTab.fillDateInputs(futureDateRange);
      });
      await test.step('Then a warning about future dates should be displayed', async () => {
        await dateRangesTab.verifyErrorMessageIsDisplayed('Future dates detected');
      });
    });

    test('[TEST7]: Pricing Analyst should see validation for incorrect date format @functional @underwriting @date-Range', async () => {
      await test.step('When the pricing analyst enters dates in wrong format', async () => {
        await dateRangesTab.uncheckDefaultDateToggle();
        const invalidFormatDateRange: DateRange = { fromDate: '01/01/2023', toDate: '12/31/2023' };
        await dateRangesTab.fillDateInputs(invalidFormatDateRange);
      });
      await test.step('Then a format error should be displayed', async () => {
        await dateRangesTab.verifyErrorMessageIsDisplayed('Please use YYYY-MM-DD format');
      });
    });
  });
});