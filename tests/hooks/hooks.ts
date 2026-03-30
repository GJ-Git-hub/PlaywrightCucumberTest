import { Before, After, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser } from '@playwright/test';
import { ICustomWorld } from '../support/world';

setDefaultTimeout(30 * 1000);

let browser: Browser;

Before(async function (this: ICustomWorld) {
  if (!browser) {
    browser = await chromium.launch({ headless: true });
  }
  this.context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    timezoneId: 'UTC',
  });
  this.page = await this.context.newPage();
});

After(async function (this: ICustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    const screenshot = await this.page?.screenshot({ fullPage: true });
    if (screenshot) {
      this.attach(screenshot, 'image/png');
    }
  }
  await this.page?.close();
  await this.context?.close();
});
