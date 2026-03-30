const { setWorldConstructor, World } = require('@cucumber/cucumber');

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.page = undefined;
    this.context = undefined;
    this.selectedDepartureDate = undefined;
    this.selectedReturnDate = undefined;
  }
}

setWorldConstructor(CustomWorld);

module.exports = { CustomWorld };
