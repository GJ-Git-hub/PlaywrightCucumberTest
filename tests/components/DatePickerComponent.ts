import { Page, Locator, expect } from '@playwright/test';
import { format, addDays } from 'date-fns';

export class DatePickerComponent {
  private page: Page;
  private prefix: 'departure' | 'return';

  constructor(page: Page, prefix: 'departure' | 'return') {
    this.page = page;
    this.prefix = prefix;
  }

  get input(): Locator {
    return this.page.getByTestId(`${this.prefix}-date-input`);
  }

  get calendar(): Locator {
    return this.page.getByTestId(`${this.prefix}-calendar`);
  }

  get nextMonthBtn(): Locator {
    return this.calendar.getByTestId('next-month');
  }

  get prevMonthBtn(): Locator {
    return this.calendar.getByTestId('prev-month');
  }

  get calendarHeader(): Locator {
    return this.calendar.getByTestId('calendar-header');
  }

  async open(): Promise<void> {
    await this.input.click();
    await expect(this.calendar).toBeVisible();
  }

  async close(): Promise<void> {
    await this.input.press('Escape');
    await expect(this.calendar).toBeHidden();
  }

  async selectDateByOffset(daysFromToday: number): Promise<string> {
    const targetDate = addDays(new Date(), daysFromToday);
    const dateStr = format(targetDate, 'yyyy-MM-dd');
    await this.open();
    const targetYearMonth = format(targetDate, 'yyyy-MM');
    await this.navigateToMonth(targetYearMonth);
    await this.calendar.locator(`[data-date="${dateStr}"]`).click();
    return format(targetDate, 'dd MMM yyyy');
  }

  async navigateToMonth(targetYearMonth: string): Promise<void> {
    const [targetYear, targetMonthStr] = targetYearMonth.split('-');
    const targetMonthNum = parseInt(targetMonthStr, 10);

    for (let i = 0; i < 24; i++) {
      const headerText = await this.calendarHeader.innerText();
      if (
        headerText.includes(targetYear) &&
        this.monthMatches(headerText, targetMonthNum)
      ) {
        break;
      }
      await this.nextMonthBtn.click();
    }
  }

  private monthMatches(headerText: string, monthNumber: number): boolean {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return headerText.includes(months[monthNumber - 1]);
  }

  async navigateNextMonth(): Promise<void> {
    await this.nextMonthBtn.click();
  }

  async navigatePrevMonth(): Promise<void> {
    await this.prevMonthBtn.click();
  }

  async getHeaderText(): Promise<string> {
    return this.calendarHeader.innerText();
  }

  async isDateDisabled(dateStr: string): Promise<boolean> {
    const cell = this.page.locator(`[data-date="${dateStr}"]`);
    const classes = await cell.getAttribute('class');
    return classes?.includes('disabled') ?? true;
  }

  async getFirstAvailableDate(): Promise<string | null> {
    const cells = this.calendar.locator('[data-date]');
    const count = await cells.count();
    for (let i = 0; i < count; i++) {
      const cell = cells.nth(i);
      const classes = (await cell.getAttribute('class')) ?? '';
      if (!classes.includes('disabled')) {
        return cell.getAttribute('data-date');
      }
    }
    return null;
  }

  async getAllDisabledDates(): Promise<string[]> {
    const cells = this.calendar.locator('[data-date].disabled');
    const count = await cells.count();
    const dates: string[] = [];
    for (let i = 0; i < count; i++) {
      const d = await cells.nth(i).getAttribute('data-date');
      if (d) dates.push(d);
    }
    return dates;
  }

  async getInputValue(): Promise<string> {
    return this.input.inputValue();
  }
}
