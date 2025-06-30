import { Page, Locator, expect } from '@playwright/test';
import { Report } from './Report';
import { DateRange } from '../../utils/helpers/types/ReportTypes';

export class DateRangesTab extends Report {
  readonly defaultDatesToggle: Locator;
  readonly dateRangeDateField: Locator;
  readonly fromDateInput: Locator;
  readonly toDateInput: Locator;

  constructor(page: Page, tabName = 'date-range') {
    super(page, tabName);
    this.defaultDatesToggle = this.page.getByRole('checkbox');
    this.dateRangeDateField = this.page.getByTestId('date-ranges-date-range');
    this.fromDateInput = this.dateRangeDateField.getByRole('textbox').nth(0);
    this.toDateInput = this.dateRangeDateField.getByRole('textbox').nth(1);
  }

  async uncheckDefaultDateToggle() {
    await this.defaultDatesToggle.uncheck({ force: true });
  }

  async verifyToggleIsChecked() {
    await expect(this.defaultDatesToggle).toBeChecked();
  }

  async verifyToggleIsUnchecked() {
    await expect(this.defaultDatesToggle).not.toBeChecked();
  }

  async fillDateInputs(dates: DateRange) {
    await this.fromDateInput.fill(dates.fromDate);
    await this.toDateInput.fill(dates.toDate);
  }

  async getDateRange(): Promise<DateRange> {
    const fromDate = await this.fromDateInput.inputValue();
    const toDate = await this.toDateInput.inputValue();
    return { fromDate, toDate };
  }

  async verifyDateRangeIsSet(expectedDateRange: DateRange) {
    const actualDateRange = await this.getDateRange();
    expect(actualDateRange.fromDate).toEqual(expectedDateRange.fromDate);
    expect(actualDateRange.toDate).toEqual(expectedDateRange.toDate);
  }
}