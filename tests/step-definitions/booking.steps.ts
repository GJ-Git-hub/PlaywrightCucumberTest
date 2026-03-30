import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ICustomWorld } from '../support/world';
import { BookingPage } from '../pages/BookingPage';
import { ResultsPage } from '../pages/ResultsPage';

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

function getBookingPage(world: ICustomWorld): BookingPage {
  return new BookingPage(world.page);
}

function getResultsPage(world: ICustomWorld): ResultsPage {
  return new ResultsPage(world.page);
}

Given('I am on the booking portal', async function (this: ICustomWorld) {
  const bookingPage = getBookingPage(this);
  await bookingPage.navigate(APP_URL);
});

Given('I select {string} trip type', async function (this: ICustomWorld, tripType: string) {
  const bookingPage = getBookingPage(this);
  await bookingPage.selectTripType(tripType as 'One Way' | 'Round Trip');
});

Given('I enter {string} in the from city field', async function (this: ICustomWorld, city: string) {
  const bookingPage = getBookingPage(this);
  await bookingPage.enterFromCity(city);
});

Given('I enter {string} in the to city field', async function (this: ICustomWorld, city: string) {
  const bookingPage = getBookingPage(this);
  await bookingPage.enterToCity(city);
});

Given('I select a departure date {int} days from today', async function (this: ICustomWorld, days: number) {
  const bookingPage = getBookingPage(this);
  const formattedDate = await bookingPage.selectDepartureDateOffset(days);
  this.selectedDepartureDate = formattedDate;
});

Given('I select a return date {int} days from today', async function (this: ICustomWorld, days: number) {
  const bookingPage = getBookingPage(this);
  const formattedDate = await bookingPage.selectReturnDateOffset(days);
  this.selectedReturnDate = formattedDate;
});

Given('I select {string} passenger', async function (this: ICustomWorld, count: string) {
  const bookingPage = getBookingPage(this);
  await bookingPage.setPassengerCount(parseInt(count, 10));
});

Given('I select {string} passengers', async function (this: ICustomWorld, count: string) {
  const bookingPage = getBookingPage(this);
  await bookingPage.setPassengerCount(parseInt(count, 10));
});

Given('I select {string} cabin class', async function (this: ICustomWorld, cabinClass: string) {
  const bookingPage = getBookingPage(this);
  await bookingPage.selectCabinClass(cabinClass);
});

Given('the passenger count is {string}', async function (this: ICustomWorld, count: string) {
  const bookingPage = getBookingPage(this);
  await bookingPage.setPassengerCount(parseInt(count, 10));
  const actual = await bookingPage.getPassengerCount();
  expect(actual.trim()).toBe(count);
});

When('I click the Search button', async function (this: ICustomWorld) {
  const bookingPage = getBookingPage(this);
  await bookingPage.clickSearch();
});

When('I increment the passenger count', async function (this: ICustomWorld) {
  const bookingPage = getBookingPage(this);
  await bookingPage.incrementPassenger();
});

When('I decrement the passenger count', async function (this: ICustomWorld) {
  const bookingPage = getBookingPage(this);
  await bookingPage.decrementPassenger();
});

Then('I should see the search results', async function (this: ICustomWorld) {
  const resultsPage = getResultsPage(this);
  await resultsPage.assertVisible();
});

Then('the results should show {string} to {string}', async function (
  this: ICustomWorld,
  from: string,
  to: string
) {
  const resultsPage = getResultsPage(this);
  await resultsPage.assertRoute(from, to);
});

Then('I should see a validation error for the from city field', async function (this: ICustomWorld) {
  const bookingPage = getBookingPage(this);
  const error = await bookingPage.getValidationError('from');
  expect(error.trim().length).toBeGreaterThan(0);
});

Then('I should see a validation error for the to city field', async function (this: ICustomWorld) {
  const bookingPage = getBookingPage(this);
  const error = await bookingPage.getValidationError('to');
  expect(error.trim().length).toBeGreaterThan(0);
});

Then('I should see a validation error for the departure date field', async function (this: ICustomWorld) {
  const bookingPage = getBookingPage(this);
  const error = await bookingPage.getValidationError('departure');
  expect(error.trim().length).toBeGreaterThan(0);
});

Then('I should see a validation error for the return date field', async function (this: ICustomWorld) {
  const bookingPage = getBookingPage(this);
  const error = await bookingPage.getValidationError('return');
  expect(error.trim().length).toBeGreaterThan(0);
});

Then('the passenger count should be {string}', async function (this: ICustomWorld, count: string) {
  const bookingPage = getBookingPage(this);
  const actual = await bookingPage.getPassengerCount();
  expect(actual.trim()).toBe(count);
});

Then('the cabin class dropdown should show {string}', async function (this: ICustomWorld, cabinClass: string) {
  const bookingPage = getBookingPage(this);
  const actual = await bookingPage.getCabinClass();
  expect(actual).toBe(cabinClass);
});
