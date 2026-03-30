const { expect } = require('@playwright/test');

class ResultsPage {
  constructor(page) {
    this.page = page;
  }

  get resultsSection() {
    return this.page.getByTestId('results-section');
  }

  async isVisible() {
    return this.resultsSection.isVisible();
  }

  async assertVisible() {
    await expect(this.resultsSection).toBeVisible();
  }

  async getRouteText() {
    return this.page.locator('#result-route').innerText();
  }

  async getTripTypeText() {
    return this.page.locator('#result-trip-type').innerText();
  }

  async getDepartureText() {
    return this.page.locator('#result-departure').innerText();
  }

  async getReturnText() {
    return this.page.locator('#result-return').innerText();
  }

  async getPassengersText() {
    return this.page.locator('#result-passengers').innerText();
  }

  async getCabinText() {
    return this.page.locator('#result-cabin').innerText();
  }

  async assertRoute(from, to) {
    const routeText = await this.getRouteText();
    expect(routeText).toContain(from);
    expect(routeText).toContain(to);
  }

  async assertDepartureDate(dateText) {
    const text = await this.getDepartureText();
    expect(text).toContain(dateText);
  }

  async assertReturnDate(dateText) {
    const text = await this.getReturnText();
    expect(text).toContain(dateText);
  }
}

module.exports = { ResultsPage };
