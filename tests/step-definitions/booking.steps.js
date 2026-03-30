const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { BookingPage } = require('../pages/BookingPage');
const { ResultsPage } = require('../pages/ResultsPage');

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

function getBookingPage(world) {
  return new BookingPage(world.page);
}

function getResultsPage(world) {
  return new ResultsPage(world.page);
}

Given('I am on the booking portal', async function () {
  const bookingPage = getBookingPage(this);
  await bookingPage.navigate(APP_URL);
});

Given('I select {string} trip type', async function (tripType) {
  const bookingPage = getBookingPage(this);
  await bookingPage.selectTripType(tripType);
});

Given('I enter {string} in the from city field', async function (city) {
  const bookingPage = getBookingPage(this);
  await bookingPage.enterFromCity(city);
});

Given('I enter {string} in the to city field', async function (city) {
  const bookingPage = getBookingPage(this);
  await bookingPage.enterToCity(city);
});

Given('I select a departure date {int} days from today', async function (days) {
  const bookingPage = getBookingPage(this);
  const formattedDate = await bookingPage.selectDepartureDateOffset(days);
  this.selectedDepartureDate = formattedDate;
});

Given('I select a return date {int} days from today', async function (days) {
  const bookingPage = getBookingPage(this);
  const formattedDate = await bookingPage.selectReturnDateOffset(days);
  this.selectedReturnDate = formattedDate;
});

Given('I select {string} passenger', async function (count) {
  const bookingPage = getBookingPage(this);
  await bookingPage.setPassengerCount(parseInt(count, 10));
});

Given('I select {string} passengers', async function (count) {
  const bookingPage = getBookingPage(this);
  await bookingPage.setPassengerCount(parseInt(count, 10));
});

Given('I select {string} cabin class', async function (cabinClass) {
  const bookingPage = getBookingPage(this);
  await bookingPage.selectCabinClass(cabinClass);
});

Given('the passenger count is {string}', async function (count) {
  const bookingPage = getBookingPage(this);
  await bookingPage.setPassengerCount(parseInt(count, 10));
  const actual = await bookingPage.getPassengerCount();
  expect(actual.trim()).toBe(count);
});

When('I click the Search button', async function () {
  const bookingPage = getBookingPage(this);
  await bookingPage.clickSearch();
});

When('I increment the passenger count', async function () {
  const bookingPage = getBookingPage(this);
  await bookingPage.incrementPassenger();
});

When('I decrement the passenger count', async function () {
  const bookingPage = getBookingPage(this);
  await bookingPage.decrementPassenger();
});

Then('I should see the search results', async function () {
  const resultsPage = getResultsPage(this);
  await resultsPage.assertVisible();
});

Then('the results should show {string} to {string}', async function (from, to) {
  const resultsPage = getResultsPage(this);
  await resultsPage.assertRoute(from, to);
});

Then('I should see a validation error for the from city field', async function () {
  const bookingPage = getBookingPage(this);
  const error = await bookingPage.getValidationError('from');
  expect(error.trim().length).toBeGreaterThan(0);
});

Then('I should see a validation error for the to city field', async function () {
  const bookingPage = getBookingPage(this);
  const error = await bookingPage.getValidationError('to');
  expect(error.trim().length).toBeGreaterThan(0);
});

Then('I should see a validation error for the departure date field', async function () {
  const bookingPage = getBookingPage(this);
  const error = await bookingPage.getValidationError('departure');
  expect(error.trim().length).toBeGreaterThan(0);
});

Then('I should see a validation error for the return date field', async function () {
  const bookingPage = getBookingPage(this);
  const error = await bookingPage.getValidationError('return');
  expect(error.trim().length).toBeGreaterThan(0);
});

Then('the passenger count should be {string}', async function (count) {
  const bookingPage = getBookingPage(this);
  const actual = await bookingPage.getPassengerCount();
  expect(actual.trim()).toBe(count);
});

Then('the cabin class dropdown should show {string}', async function (cabinClass) {
  const bookingPage = getBookingPage(this);
  const actual = await bookingPage.getCabinClass();
  expect(actual).toBe(cabinClass);
});
