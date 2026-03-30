const { Before, After, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

setDefaultTimeout(30 * 1000);

let browser;

Before(async function () {
  if (!browser) {
    browser = await chromium.launch({ headless: true });
  }
  this.context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    timezoneId: 'UTC',
  });
  this.page = await this.context.newPage();
});

After(async function (scenario) {
  if (scenario.result && scenario.result.status === Status.FAILED) {
    const screenshot = await this.page.screenshot({ fullPage: true });
    if (screenshot) {
      this.attach(screenshot, 'image/png');
    }
  }
  if (this.page) await this.page.close();
  if (this.context) await this.context.close();
});
