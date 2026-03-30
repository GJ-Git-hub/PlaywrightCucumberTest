const { DatePickerComponent } = require('../components/DatePickerComponent');

class BookingPage {
  constructor(page) {
    this.page = page;
    this.departurePicker = new DatePickerComponent(page, 'departure');
    this.returnPicker = new DatePickerComponent(page, 'return');
  }

  async navigate(appUrl) {
    await this.page.goto(appUrl);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async selectTripType(tripType) {
    if (tripType === 'One Way') {
      await this.page.getByTestId('label-one-way').click();
    } else {
      await this.page.getByTestId('label-round-trip').click();
    }
  }

  async enterFromCity(city) {
    await this.page.getByTestId('from-city').fill(city);
  }

  async enterToCity(city) {
    await this.page.getByTestId('to-city').fill(city);
  }

  async selectDepartureDateOffset(daysFromToday) {
    return this.departurePicker.selectDateByOffset(daysFromToday);
  }

  async selectReturnDateOffset(daysFromToday) {
    return this.returnPicker.selectDateByOffset(daysFromToday);
  }

  async setPassengerCount(count) {
    const currentCount = parseInt(
      await this.page.getByTestId('passenger-count').innerText(),
      10
    );
    const diff = count - currentCount;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        await this.page.getByTestId('passenger-plus').click();
      }
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) {
        await this.page.getByTestId('passenger-minus').click();
      }
    }
  }

  async incrementPassenger() {
    await this.page.getByTestId('passenger-plus').click();
  }

  async decrementPassenger() {
    await this.page.getByTestId('passenger-minus').click();
  }

  async getPassengerCount() {
    return this.page.getByTestId('passenger-count').innerText();
  }

  async selectCabinClass(cabinClass) {
    await this.page.getByTestId('cabin-class').selectOption(cabinClass);
  }

  async getCabinClass() {
    return this.page.getByTestId('cabin-class').inputValue();
  }

  async clickSearch() {
    await this.page.getByTestId('search-btn').click();
  }

  async getValidationError(field) {
    return this.page.getByTestId(`error-${field}`).innerText();
  }

  async isResultsVisible() {
    return this.page.getByTestId('results-section').isVisible();
  }
}

module.exports = { BookingPage };
