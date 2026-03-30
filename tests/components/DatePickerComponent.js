const { expect } = require('@playwright/test');
const { format, addDays } = require('date-fns');

class DatePickerComponent {
  constructor(page, prefix) {
    this.page = page;
    this.prefix = prefix;
  }

  get input() {
    return this.page.getByTestId(`${this.prefix}-date-input`);
  }

  get calendar() {
    return this.page.getByTestId(`${this.prefix}-calendar`);
  }

  get nextMonthBtn() {
    return this.calendar.getByTestId('next-month');
  }

  get prevMonthBtn() {
    return this.calendar.getByTestId('prev-month');
  }

  get calendarHeader() {
    return this.calendar.getByTestId('calendar-header');
  }

  async open() {
    await this.input.click();
    await expect(this.calendar).toBeVisible();
  }

  async close() {
    await this.input.press('Escape');
    await expect(this.calendar).toBeHidden();
  }

  async selectDateByOffset(daysFromToday) {
    const targetDate = addDays(new Date(), daysFromToday);
    const dateStr = format(targetDate, 'yyyy-MM-dd');
    await this.open();
    const targetYearMonth = format(targetDate, 'yyyy-MM');
    await this.navigateToMonth(targetYearMonth);
    await this.calendar.locator(`[data-date="${dateStr}"]`).click();
    return format(targetDate, 'dd MMM yyyy');
  }

  async navigateToMonth(targetYearMonth) {
    const [targetYear, targetMonthStr] = targetYearMonth.split('-');
    const targetMonthNum = parseInt(targetMonthStr, 10);

    for (let i = 0; i < 24; i++) {
      const headerText = await this.calendarHeader.innerText();
      if (headerText.includes(targetYear) && this._monthMatches(headerText, targetMonthNum)) {
        break;
      }
      await this.nextMonthBtn.click();
    }
  }

  _monthMatches(headerText, monthNumber) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    return headerText.includes(months[monthNumber - 1]);
  }

  async navigateNextMonth() {
    await this.nextMonthBtn.click();
  }

  async navigatePrevMonth() {
    await this.prevMonthBtn.click();
  }

  async getHeaderText() {
    return this.calendarHeader.innerText();
  }

  async isDateDisabled(dateStr) {
    const cell = this.page.locator(`[data-date="${dateStr}"]`);
    const classes = await cell.getAttribute('class');
    return classes ? classes.includes('disabled') : true;
  }

  async getFirstAvailableDate() {
    const cells = this.calendar.locator('[data-date]');
    const count = await cells.count();
    for (let i = 0; i < count; i++) {
      const cell = cells.nth(i);
      const classes = (await cell.getAttribute('class')) || '';
      if (!classes.includes('disabled')) {
        return cell.getAttribute('data-date');
      }
    }
    return null;
  }

  async getAllDisabledDates() {
    const cells = this.calendar.locator('[data-date].disabled');
    const count = await cells.count();
    const dates = [];
    for (let i = 0; i < count; i++) {
      const d = await cells.nth(i).getAttribute('data-date');
      if (d) dates.push(d);
    }
    return dates;
  }

  async getInputValue() {
    return this.input.inputValue();
  }
}

module.exports = { DatePickerComponent };
