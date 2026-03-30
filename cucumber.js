module.exports = {
  default: {
    paths: ['tests/features/**/*.feature'],
    require: [
      'tests/support/world.js',
      'tests/hooks/hooks.js',
      'tests/step-definitions/**/*.js',
    ],
    format: [
      'progress-bar',
      'html:reports/cucumber-html/index.html',
      'json:reports/cucumber-json/results.json',
    ],
    formatOptions: { snippetInterface: 'async-await' },
    worldParameters: {
      appUrl: process.env.APP_URL || 'http://localhost:3000',
    },
    tags: process.env.TAGS || '',
    retry: process.env.CI ? 1 : 0,
    exit: true,
  },
  smoke: {
    paths: ['tests/features/**/*.feature'],
    require: [
      'tests/support/world.js',
      'tests/hooks/hooks.js',
      'tests/step-definitions/**/*.js',
    ],
    tags: '@smoke',
    format: ['progress-bar', 'html:reports/cucumber-html/smoke-index.html'],
    formatOptions: { snippetInterface: 'async-await' },
    worldParameters: {
      appUrl: process.env.APP_URL || 'http://localhost:3000',
    },
    exit: true,
  },
};
