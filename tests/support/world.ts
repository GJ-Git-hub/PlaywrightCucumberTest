import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { BrowserContext, Page } from '@playwright/test';

export interface ICustomWorld extends World {
  page: Page;
  context: BrowserContext;
  selectedDepartureDate?: string;
  selectedReturnDate?: string;
}

export class CustomWorld extends World implements ICustomWorld {
  page!: Page;
  context!: BrowserContext;
  selectedDepartureDate?: string;
  selectedReturnDate?: string;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
