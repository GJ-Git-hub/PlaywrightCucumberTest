const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { format, addDays, subDays } = require('date-fns');
const { DatePickerComponent } = require('../components/DatePickerComponent');
const { getMonthName, isPastDate } = require('../utils/dateUtils');

function getDeparturePicker(world) {
  return new DatePickerComponent(world.page, 'departure');
}

function getReturnPicker(world) {
  return new DatePickerComponent(world.page, 'return');
}

// ===== Given steps =====

Given('the departure calendar is open', async function () {
  const picker = getDeparturePicker(this);
  await picker.open();
});

// ===== When steps =====

When('I click the departure date input', async function () {
  const picker = getDeparturePicker(this);
  await picker.input.click();
});

When('I click the return date input', async function () {
  const picker = getReturnPicker(this);
  await picker.input.click();
});

When('I press Escape on the departure date input', async function () {
  const picker = getDeparturePicker(this);
  await picker.input.press('Escape');
});

When('I click the next month button', async function () {
  const picker = getDeparturePicker(this);
  await picker.navigateNextMonth();
});

When('I click the previous month button', async function () {
  const picker = getDeparturePicker(this);
  await picker.navigatePrevMonth();
});

When('I select a date {int} days from today in the departure calendar', async function (days) {
  const picker = getDeparturePicker(this);
  const targetDate = addDays(new Date(), days);
  const dateStr = format(targetDate, 'yyyy-MM-dd');
  const targetYearMonth = format(targetDate, 'yyyy-MM');
  await picker.navigateToMonth(targetYearMonth);
  await picker.calendar.locator(`[data-date="${dateStr}"]`).click();
  this.selectedDepartureDate = format(targetDate, 'dd MMM yyyy');
});

When('I select the first available date in the departure calendar', async function () {
  const picker = getDeparturePicker(this);
  const dateStr = await picker.getFirstAvailableDate();
  if (!dateStr) throw new Error('No available date found in the departure calendar');
  await this.page.locator(`[data-date="${dateStr}"]`).click();
  this.selectedDepartureDate = dateStr;
});

When('I focus the departure date input and press Enter', async function () {
  const picker = getDeparturePicker(this);
  await picker.input.focus();
  await picker.input.press('Enter');
});

// ===== Then steps =====

Then('the departure calendar should be visible', async function () {
  const picker = getDeparturePicker(this);
  await expect(picker.calendar).toBeVisible();
});

Then('the departure calendar should not be visible', async function () {
  const picker = getDeparturePicker(this);
  await expect(picker.calendar).toBeHidden();
});

Then('the calendar should show the next month', async function () {
  const picker = getDeparturePicker(this);
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const expectedMonth = getMonthName(nextMonth.getMonth());
  const expectedYear = String(nextMonth.getFullYear());
  const headerText = await picker.getHeaderText();
  expect(headerText).toContain(expectedMonth);
  expect(headerText).toContain(expectedYear);
});

Then('the calendar should show the current month', async function () {
  const picker = getDeparturePicker(this);
  const today = new Date();
  const expectedMonth = getMonthName(today.getMonth());
  const expectedYear = String(today.getFullYear());
  const headerText = await picker.getHeaderText();
  expect(headerText).toContain(expectedMonth);
  expect(headerText).toContain(expectedYear);
});

Then('all past dates should be disabled in the departure calendar', async function () {
  const picker = getDeparturePicker(this);
  const disabledDates = await picker.getAllDisabledDates();
  for (const dateStr of disabledDates) {
    expect(isPastDate(dateStr)).toBe(true);
  }
  const yesterday = subDays(new Date(), 1);
  const yesterdayStr = format(yesterday, 'yyyy-MM-dd');
  const yesterdayCell = picker.calendar.locator(`[data-date="${yesterdayStr}"]`);
  const count = await yesterdayCell.count();
  if (count > 0) {
    const cls = await yesterdayCell.getAttribute('class');
    expect(cls).toContain('disabled');
  }
});

Then('dates before the departure date should be disabled in the return calendar', async function () {
  const returnPicker = getReturnPicker(this);
  await expect(returnPicker.calendar).toBeVisible();
  const disabledDates = await returnPicker.getAllDisabledDates();
  expect(disabledDates.length).toBeGreaterThan(0);
});

Then('the departure date input should show the selected date', async function () {
  const picker = getDeparturePicker(this);
  const value = await picker.getInputValue();
  expect(value.trim().length).toBeGreaterThan(0);
  if (this.selectedDepartureDate) {
    expect(value).toBe(this.selectedDepartureDate);
  }
});

Then('the departure date input should not be empty', async function () {
  const picker = getDeparturePicker(this);
  const value = await picker.getInputValue();
  expect(value.trim().length).toBeGreaterThan(0);
});
