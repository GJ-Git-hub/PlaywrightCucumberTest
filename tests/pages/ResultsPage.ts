import { Page, expect } from '@playwright/test';

export class ResultsPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get resultsSection() {
    return this.page.getByTestId('results-section');
  }

  async isVisible(): Promise<boolean> {
    return this.resultsSection.isVisible();
  }

  async assertVisible(): Promise<void> {
    await expect(this.resultsSection).toBeVisible();
  }

  async getRouteText(): Promise<string> {
    return this.page.locator('#result-route').innerText();
  }

  async getTripTypeText(): Promise<string> {
    return this.page.locator('#result-trip-type').innerText();
  }

  async getDepartureText(): Promise<string> {
    return this.page.locator('#result-departure').innerText();
  }

  async getReturnText(): Promise<string> {
    return this.page.locator('#result-return').innerText();
  }

  async getPassengersText(): Promise<string> {
    return this.page.locator('#result-passengers').innerText();
  }

  async getCabinText(): Promise<string> {
    return this.page.locator('#result-cabin').innerText();
  }

  async assertRoute(from: string, to: string): Promise<void> {
    const routeText = await this.getRouteText();
    expect(routeText).toContain(from);
    expect(routeText).toContain(to);
  }

  async assertDepartureDate(dateText: string): Promise<void> {
    const text = await this.getDepartureText();
    expect(text).toContain(dateText);
  }

  async assertReturnDate(dateText: string): Promise<void> {
    const text = await this.getReturnText();
    expect(text).toContain(dateText);
  }
}
