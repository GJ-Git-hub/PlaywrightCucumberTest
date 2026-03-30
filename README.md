# ✈️ SkyBook - Playwright + Cucumber BDD Interview Project

![Playwright](https://img.shields.io/badge/Playwright-1.44+-45ba4b?logo=playwright&logoColor=white)
![Cucumber](https://img.shields.io/badge/Cucumber-10.3+-23d96c?logo=cucumber&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-3178c6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs&logoColor=white)

A **complete, interview-ready, full-stack sample project** demonstrating **Test Lead level** skills using **Playwright + Cucumber BDD** with a custom **date picker** component. Includes both a demo booking portal web app and a comprehensive automation test suite.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Demo App](#-running-the-demo-app)
- [Running Tests](#-running-tests)
- [Project Structure](#-project-structure)
- [Test Strategy](#-test-strategy)
- [Date Picker Test Strategy](#-date-picker-test-strategy)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Reporting](#-reporting)
- [Interview Talking Points](#-interview-talking-points)
- [Contributing](#-contributing)

---

## 🎯 Project Overview

**SkyBook** is a static flight booking portal built with vanilla HTML/CSS/JS. It features a custom JavaScript date picker (not a native `<input type="date">`) — a realistic component that presents real-world automation challenges.

The automation suite covers:
- **BDD feature files** (Gherkin) for business-readable scenarios
- **Page Object Model** with reusable components
- **Date picker component wrapper** handling navigation, selection, and disabled dates
- **Validation scenarios** for form error states
- **Accessibility/keyboard navigation** tests
- **Cross-browser** execution (Chromium, Firefox, WebKit)

---

## 🛠 Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| [Playwright](https://playwright.dev/) | ^1.44 | Browser automation |
| [Cucumber.js](https://cucumber.io/) | ^10.3 | BDD framework |
| [TypeScript](https://www.typescriptlang.org/) | ^5.4 | Type safety |
| [date-fns](https://date-fns.org/) | ^3.6 | Date manipulation |
| [ts-node](https://typestrong.org/ts-node/) | ^10.9 | TypeScript runtime |
| [serve](https://www.npmjs.com/package/serve) | ^14.2 | Static file server |

---

## 📦 Prerequisites

- **Node.js** 20 or later
- **npm** 9 or later
- Git

---

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/GJ-Git-hub/PlaywrightCucumberTest.git
cd PlaywrightCucumberTest

# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps
```

---

## 🌐 Running the Demo App

```bash
# Serve the booking portal on http://localhost:3000
npm run serve
```

Open your browser at [http://localhost:3000](http://localhost:3000) to see the SkyBook flight booking portal.

---

## 🧪 Running Tests

### Cucumber BDD Tests

```bash
# Run the full test suite
npm test

# Run smoke tests only (@smoke tag)
npm run test:smoke

# Run date picker tests only (@datepicker tag)
npm run test:datepicker

# Run with specific tags
TAGS="@validation" npm test
TAGS="@smoke and @round-trip" npm test
```

### Playwright Tests

```bash
# Run all Playwright tests
npm run test:playwright

# Run in headed mode (see the browser)
npm run test:playwright:headed

# Run on Chromium only
npm run test:playwright:chromium

# Run on a specific browser
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Tag Reference

| Tag | Description |
|---|---|
| `@smoke` | Critical happy-path tests |
| `@one-way` | One-way booking tests |
| `@round-trip` | Round-trip booking tests |
| `@validation` | Form validation tests |
| `@datepicker` | Date picker component tests |
| `@disabled-dates` | Disabled date logic tests |
| `@selection` | Date selection tests |
| `@keyboard` | Keyboard accessibility tests |
| `@cross-month` | Cross-month navigation tests |
| `@passenger` | Passenger count tests |
| `@cabin-class` | Cabin class selection tests |

---

## 📁 Project Structure

```
PlaywrightCucumberTest/
├── app/                          # Static demo web app
│   ├── index.html                # Booking portal HTML
│   ├── style.css                 # Modern CSS styling
│   └── app.js                   # DatePicker class + form logic
├── tests/
│   ├── features/                 # Gherkin feature files
│   │   ├── booking.feature       # Main booking scenarios
│   │   └── datepicker.feature    # Date picker scenarios
│   ├── step-definitions/         # Step implementation
│   │   ├── booking.steps.ts      # Booking form steps
│   │   └── datepicker.steps.ts   # Date picker steps
│   ├── pages/                    # Page Object Model
│   │   ├── BookingPage.ts        # Booking form PO
│   │   └── ResultsPage.ts        # Results section PO
│   ├── components/               # Reusable component wrappers
│   │   └── DatePickerComponent.ts # Custom calendar wrapper
│   ├── hooks/
│   │   └── hooks.ts              # Before/After hooks + screenshots
│   ├── support/
│   │   └── world.ts              # Custom World (shared state)
│   └── utils/
│       └── dateUtils.ts          # Date helper utilities
├── playwright.config.ts          # Playwright configuration
├── cucumber.js                   # Cucumber profiles
├── package.json
├── tsconfig.json
├── .github/
│   └── workflows/
│       └── e2e.yml               # CI pipeline
└── README.md
```

---

## 🧩 Test Strategy

### Risk-Based Coverage
Tests are prioritised by business risk:
1. **Critical**: Complete booking flow (smoke suite, always runs)
2. **High**: Validation, date constraints, passenger count limits
3. **Medium**: Cross-browser, mobile viewport
4. **Low**: Edge cases (max passengers, date boundary)

### Test Pyramid Approach
- **E2E (Cucumber BDD)**: Business-readable scenarios for stakeholder alignment
- **Component-level (DatePickerComponent)**: Isolated calendar widget behaviour
- **Integration**: Form submission + results rendering

### Suite Strategy
| Suite | Tags | Trigger | Purpose |
|---|---|---|---|
| Smoke | `@smoke` | Every PR push | Fastest feedback on critical paths |
| Regression | all | Nightly / post-merge | Full coverage |
| Datepicker | `@datepicker` | Targeted | Date picker deep-dive |

### Cross-Browser Strategy
All tests run on Chromium, Firefox, and WebKit via Playwright projects. Mobile viewport (Pixel 5) is included to catch responsive issues.

---

## 📅 Date Picker Test Strategy

Custom date picker components are a common source of **real-world test failures**. Key test challenges addressed:

### Why Custom Pickers Need Special Attention
- Native `<input type="date">` has built-in accessibility and consistent UX; custom pickers do not
- Month navigation requires **stateful interaction** — tests must manage calendar state
- Disabled date logic is business-critical (can't book in the past)
- Time zones can cause date boundary failures in CI (solution: fix `timezoneId: 'UTC'`)

### Test Scenarios
| Category | Scenario | Automation Approach |
|---|---|---|
| Open/Close | Click input opens calendar | `data-testid` + `toBeVisible()` |
| Open/Close | Escape key closes calendar | `press('Escape')` + `toBeHidden()` |
| Navigation | Month forward/back | Click nav buttons, assert header text |
| Disabled dates | Past dates not clickable | Collect `.disabled` cells, assert `isPastDate()` |
| Disabled dates | Return ≥ departure + 1 | Set minDate, assert disabled cells |
| Selection | Date appears in input | Click cell, assert `inputValue()` |
| Cross-month | Select next month date | Navigate first, then select |
| Keyboard | Enter opens picker | `focus()` + `press('Enter')` |

### DatePickerComponent Design
The `DatePickerComponent` class wraps both departure and return pickers using a `prefix` parameter (`'departure'` or `'return'`). This single reusable class keeps test code DRY and consistent.

---

## 🔄 CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/e2e.yml`) has three jobs:

```
push/PR → smoke-tests → regression-tests (chromium | firefox | webkit)
                      → cucumber-full
```

| Job | Trigger | Browsers | Purpose |
|---|---|---|---|
| `smoke-tests` | Every push/PR | Chromium only | Fast quality gate |
| `regression-tests` | After smoke passes | All 3 browsers | Full cross-browser coverage |
| `cucumber-full` | After smoke passes | Chromium | Full BDD suite |

**Retry strategy**: `retry: 1` in CI to handle transient flakiness, `retries: 2` in Playwright config.

---

## 📊 Reporting

After test runs, reports are generated in the `reports/` directory:

| Report | Path | Format |
|---|---|---|
| Cucumber HTML | `reports/cucumber-html/index.html` | Human-readable BDD report |
| Cucumber JSON | `reports/cucumber-json/results.json` | Machine-readable (CI integration) |
| Playwright HTML | `reports/playwright-html/index.html` | Trace viewer, screenshots, video |

**Screenshots on failure**: The `hooks.ts` `After` hook automatically captures a full-page screenshot on test failure and attaches it to the Cucumber report.

```bash
# Open Playwright HTML report
npm run report:open
```

---

## 💼 Interview Talking Points

As a **Test Lead**, here's what this project demonstrates:

### Framework Design Decisions
- **Why Cucumber + Playwright?** Cucumber provides business-readable specs; Playwright provides reliable, fast cross-browser automation. The combination enables collaboration between QA, Dev, and Business.
- **Why POM + Component wrapper?** Separates concerns: pages own navigation/form interaction, components own widget interaction. Changing a locator only requires one file change.
- **Why `data-testid`?** Decouples tests from CSS class/structure changes. Agreed upon with developers at project start.

### Test Lead Responsibilities Shown
- **Tagging strategy** (`@smoke`, `@regression`, `@datepicker`) enables selective execution
- **CI pipeline design** with fail-fast smoke gate before expensive cross-browser regression
- **Retry strategy** balancing flakiness tolerance vs. false confidence
- **Screenshot-on-failure** for immediate debugging without re-running
- **UTC timezone** enforcement prevents date test failures in CI

### Date Picker Challenges (High-Value Discussion)
- Identifying the right locator strategy (use `data-date` attribute, not visual position)
- Handling month navigation state (navigate to target month before selecting)
- Disabled date assertions (class-based + business rule validation)
- Keyboard accessibility as a test case (not just nice-to-have)

### Quality Metrics Discussion
- What is your definition of done for automation?
- How do you decide what NOT to automate?
- How do you handle flaky tests? (Retry policy, quarantine process, root cause analysis)
- How do you keep tests maintainable as the app evolves?

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-scenario`)
3. Write your scenario in the appropriate `.feature` file
4. Implement step definitions following existing patterns
5. Ensure all smoke tests pass: `npm run test:smoke`
6. Submit a pull request with a description of what you've added

### Coding Standards
- Use `async/await` for all asynchronous operations
- Use `data-testid` attributes exclusively for selectors
- Follow the Page Object pattern for page interactions
- Add descriptive Gherkin steps in plain English
- One `When` action per scenario step where possible

---

*Built as an interview-ready demonstration project for Test Lead positions.*
