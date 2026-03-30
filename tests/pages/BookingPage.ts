import { Page, expect } from '@playwright/test';
import { DatePickerComponent } from '../components/DatePickerComponent';

export class BookingPage {
  private page: Page;
  readonly departurePicker: DatePickerComponent;
  readonly returnPicker: DatePickerComponent;

  constructor(page: Page) {
    this.page = page;
    this.departurePicker = new DatePickerComponent(page, 'departure');
    this.returnPicker = new DatePickerComponent(page, 'return');
  }

  async navigate(appUrl: string): Promise<void> {
    await this.page.goto(appUrl);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async selectTripType(tripType: 'One Way' | 'Round Trip'): Promise<void> {
    if (tripType === 'One Way') {
      await this.page.getByTestId('label-one-way').click();
    } else {
      await this.page.getByTestId('label-round-trip').click();
    }
  }

  async enterFromCity(city: string): Promise<void> {
    await this.page.getByTestId('from-city').fill(city);
  }

  async enterToCity(city: string): Promise<void> {
    await this.page.getByTestId('to-city').fill(city);
  }

  async selectDepartureDateOffset(daysFromToday: number): Promise<string> {
    return this.departurePicker.selectDateByOffset(daysFromToday);
  }

  async selectReturnDateOffset(daysFromToday: number): Promise<string> {
    return this.returnPicker.selectDateByOffset(daysFromToday);
  }

  async setPassengerCount(count: number): Promise<void> {
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

  async incrementPassenger(): Promise<void> {
    await this.page.getByTestId('passenger-plus').click();
  }

  async decrementPassenger(): Promise<void> {
    await this.page.getByTestId('passenger-minus').click();
  }

  async getPassengerCount(): Promise<string> {
    return this.page.getByTestId('passenger-count').innerText();
  }

  async selectCabinClass(cabinClass: string): Promise<void> {
    await this.page.getByTestId('cabin-class').selectOption(cabinClass);
  }

  async getCabinClass(): Promise<string> {
    return this.page.getByTestId('cabin-class').inputValue();
  }

  async clickSearch(): Promise<void> {
    await this.page.getByTestId('search-btn').click();
  }

  async getValidationError(field: 'from' | 'to' | 'departure' | 'return'): Promise<string> {
    return this.page.getByTestId(`error-${field}`).innerText();
  }

  async isResultsVisible(): Promise<boolean> {
    return this.page.getByTestId('results-section').isVisible();
  }
}
