---
title: "Software Testing with Playwright: Everything I Learned, Class by Class"
slug: software-testing-with-playwright
description: A complete, class-by-class walkthrough of software testing
  fundamentals and hands-on Playwright automation — the testing pyramid,
  locators, assertions, E2E checkout flows, API testing, mocking, accessibility,
  and AI-powered testing — based on freeCodeCamp's Software Testing Course.
category: SQA
date: August 5, 2026
readTime: 16 min read
author: Shourav Misro
tags:
  - playwright
  - software-testing
  - qa
  - test-automation
  - e2e-testing
  - javascript
  - api-testing
  - accessibility
  - tdd
  - freecodecamp
---
I recently finished freeCodeCamp's [Software Testing Course – Playwright, E2E, and AI Agents](https://www.youtube.com/watch?v=jydYq7oAtD8) by Beau Carnes, and it completely changed how I think about quality assurance. In this post I'm sharing everything I learned, class by class — from why testing matters at all, to writing real Playwright tests against a demo e-commerce app called **TechMart**. All the code comes from the official course repo: [beaucarnes/software-testing-course](https://github.com/beaucarnes/software-testing-course).

If you're new to QA or want a practical entry point into test automation, this is the roadmap I wish I had on day one.

## Class 1 — Why Software Testing Matters

Before touching any code, the course opens with real-world disasters caused by untested (or badly tested) software:

- **Knight Capital (2012)** — a deployment bug activated dead code and the firm lost **$440 million in 45 minutes**.
- **Therac-25 (1980s)** — a radiation therapy machine whose race-condition bugs delivered lethal overdoses to patients.
- **Boeing 737 Max** — flawed sensor-driven software (MCAS) contributed to two fatal crashes.

The takeaway: testing is **insurance for your code**. Writing tests costs time up front, but it's dramatically cheaper than a production failure — in money, reputation, and sometimes lives. Even "everyday bugs" like a broken checkout button silently drain revenue every hour they go unnoticed.

## Class 2 — The Testing Pyramid

The classic mental model for structuring a test suite has three layers:

1. **Unit tests (base — most tests):** test one function or module in isolation. Blazing fast, cheap, run thousands per minute.
2. **Integration tests (middle):** test that modules work *together* — e.g., your API talking to the database.
3. **End-to-End / E2E tests (top — fewest tests):** simulate a real user in a real browser clicking through the whole app.

The higher up the pyramid, the more **realistic** but also the **slower and more brittle** tests become. That's why you want lots of unit tests, some integration tests, and a focused set of high-value E2E tests. Playwright lives mostly at the E2E layer (though it does API testing too, as you'll see).

The course also introduces **Test-Driven Development (TDD)**: write a failing test first (red), write just enough code to pass it (green), then refactor. It flips testing from an afterthought into a design tool.

## Class 3 — Setting Up the TechMart Sample App and Playwright

The hands-on portion uses **TechMart**, a small Express-based e-commerce store with products, a cart, login/registration, and checkout. Clone the repo and start it:

```bash
git clone https://github.com/beaucarnes/software-testing-course.git
cd software-testing-course/sample-app
npm install
npm start   # runs at http://localhost:3000
```

Then set up Playwright in a separate tests folder:

```bash
mkdir tests && cd tests
npm init -y
npm install -D @playwright/test
npx playwright install   # downloads Chromium, Firefox, and WebKit
```

The `playwright.config.js` from the course is worth studying — it configures a base URL, traces, screenshots, multi-browser projects, and even auto-starts the app before tests run:

```javascript
// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,   // demo app uses in-memory storage
  workers: 1,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html'], ['list']],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',        // record a trace when a retry happens
    screenshot: 'only-on-failure',  // capture proof when things break
    video: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],

  // Start the app automatically before tests
  webServer: {
    command: 'cd ../../sample-app && npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

One config file gives you **five browser/device targets** — desktop Chrome, Firefox, Safari, plus mobile viewports. That's cross-browser testing basically for free.

## Class 4 — Playwright Test Structure and Assertions

Every Playwright test follows the same anatomy: `test.describe` groups tests, `test.beforeEach` sets up clean state, and `expect` makes assertions that **auto-wait** for the condition to become true (no manual sleeps needed for most things).

Here are the first tests against the TechMart homepage:

```javascript
// tests/homepage.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {

  test.beforeEach(async ({ page }) => {
    // Clear cart before each test for consistent state
    await page.request.delete('http://localhost:3000/api/cart');
    await page.goto('/');
  });

  test('should display the page title', async ({ page }) => {
    await expect(page).toHaveTitle(/TechMart/);
  });

  test('should display the logo in the navbar', async ({ page }) => {
    const logo = page.locator('.logo');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveText(/TechMart/);
  });

  test('should display product cards', async ({ page }) => {
    const productCards = page.locator('.product-card');
    await expect(productCards).toHaveCount(6); // TechMart has 6 products
  });
});
```

Key assertions you'll use constantly:

| Assertion | What it checks |
|---|---|
| `toHaveTitle()` | page title matches |
| `toBeVisible()` | element is rendered and visible |
| `toHaveText()` / `toContainText()` | exact vs. partial text match |
| `toHaveCount()` | number of matching elements |
| `toHaveURL()` | current page URL |
| `toHaveValue()` | value of an input field |

## Class 5 — Writing a Search Test from Scratch

The course walks through building a search test step by step: locate the input, type, click, assert the filtered result.

```javascript
test('should have a working search bar', async ({ page }) => {
  const searchInput = page.locator('#searchInput');
  const searchBtn = page.locator('#searchBtn');

  await searchInput.fill('Keyboard');
  await searchBtn.click();

  // Should show only the keyboard product
  const productCards = page.locator('.product-card');
  await expect(productCards).toHaveCount(1);
});
```

Three methods do most of the work in UI automation: **`fill()`** (type into inputs), **`click()`**, and **`selectOption()`** (dropdowns):

```javascript
test('should filter products by category', async ({ page }) => {
  await page.locator('#categoryFilter').selectOption('electronics');

  const count = await page.locator('.product-card').count();
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThan(6); // filtered, not all products
});
```

## Class 6 — Strategic Locators: Finding Elements Effectively

Locators are the #1 source of flaky tests, so choosing them strategically matters. The rough priority order:

1. **IDs** — `page.locator('#searchInput')` — stable and fast.
2. **Semantic classes** — `page.locator('.product-card')` — fine when they describe *what* the element is.
3. **Text** — `page.locator('text=Sign Up')` — reads like the user sees it.
4. **Chained/scoped locators** — narrow down inside a parent:

```javascript
const firstProduct = page.locator('.product-card').first();
await expect(firstProduct.locator('.product-price')).toBeVisible();
await expect(firstProduct.locator('.add-to-cart-btn')).toBeVisible();
```

Avoid brittle selectors tied to layout (`div > div:nth-child(3) > span`) — one CSS refactor and the test dies. Utilities like `.first()`, `.nth(i)`, and `.count()` let you work with lists of elements cleanly.

## Class 7 — Testing Shopping Cart Logic

Cart tests introduce a powerful pattern: **use the API to set up state, then use the UI to verify behavior**. Seeding the cart through `page.request` is faster and more reliable than clicking through the UI in every test.

```javascript
// tests/cart.spec.js
test('should display cart items correctly', async ({ page }) => {
  // Arrange: add item via API for consistency
  await page.request.post('http://localhost:3000/api/cart', {
    data: { productId: 1, quantity: 2 }
  });

  // Act
  await page.goto('/cart.html');

  // Assert
  await expect(page.locator('.cart-item')).toHaveCount(1);
  await expect(page.locator('.qty-value')).toHaveText('2');
});

test('should calculate correct totals', async ({ page }) => {
  await page.request.post('http://localhost:3000/api/cart', {
    data: { productId: 1, quantity: 2 }
  });

  await page.goto('/cart.html');

  // 2 × $79.99 = $159.98
  await expect(page.locator('#total')).toContainText('159.98');
});
```

That second test is the kind that catches real money-losing bugs — a rounding error in a total is invisible to the eye but obvious to an assertion.

## Class 8 — Login Forms, Validation, and Error Handling

Auth tests cover the happy path, the sad path, and browser-level validation:

```javascript
// tests/auth.spec.js
test('should show error for invalid credentials', async ({ page }) => {
  await page.locator('#email').fill('wrong@email.com');
  await page.locator('#password').fill('wrongpassword');
  await page.locator('button[type="submit"]').click();

  const errorMessage = page.locator('#errorMessage');
  await expect(errorMessage).toBeVisible();
  await expect(errorMessage).toContainText('Invalid credentials');
});

test('should login successfully with valid credentials', async ({ page }) => {
  await page.locator('#email').fill('demo@techmart.com');
  await page.locator('#password').fill('demo123');
  await page.locator('button[type="submit"]').click();

  await expect(page.locator('#toast')).toContainText('Login successful');
  await page.waitForURL('/'); // verify redirect to homepage
});

test('should show validation for empty fields', async ({ page }) => {
  await page.locator('button[type="submit"]').click();

  // Check the browser's built-in HTML5 validation
  const isInvalid = await page.locator('#email')
    .evaluate((el) => !el.checkValidity());
  expect(isInvalid).toBe(true);
});
```

Two tricks worth stealing:

- **`page.evaluate()`** runs JavaScript inside the browser — perfect for checking HTML5 form validity that has no visible DOM error message.
- **Unique test data** avoids collisions between runs: `` const uniqueEmail = `test${Date.now()}@example.com`; ``

## Class 9 — The Full End-to-End Checkout Flow

This is the crown jewel: one test that walks the entire purchase journey, exactly like a real customer.

```javascript
// tests/checkout.spec.js
test('should complete checkout successfully', async ({ page }) => {
  await page.goto('/checkout.html');

  // Shipping information
  await page.locator('#firstName').fill('John');
  await page.locator('#lastName').fill('Doe');
  await page.locator('#address').fill('123 Main Street');
  await page.locator('#city').fill('Grand Rapids');
  await page.locator('#state').selectOption('MI');
  await page.locator('#zip').fill('49501');
  await page.locator('#phone').fill('555-123-4567');

  // Payment information
  await page.locator('#cardName').fill('John Doe');
  await page.locator('#cardNumber').fill('4111111111111111');
  await page.locator('#expiry').fill('12/25');
  await page.locator('#cvv').fill('123');

  // Place the order
  await page.locator('#placeOrderBtn').click();

  // Verify confirmation
  const confirmationModal = page.locator('#orderConfirmation');
  await expect(confirmationModal).toBeVisible();
  await expect(confirmationModal).toContainText('Order Confirmed');
  await expect(page.locator('#orderId')).not.toBeEmpty();
});
```

The checkout suite also verifies business logic (8% tax on $79.99 should show `6.40`), input formatting (card number auto-spaces to `1234 5678 9012 3456`), redirects (empty cart → back to cart page), and required-field validation. One spec file, and the entire revenue path of the app is under guard.

## Class 10 — Direct API Testing with Playwright

Playwright isn't just a browser tool. The `request` fixture makes HTTP calls with no browser at all — great for fast integration tests against your backend:

```javascript
// tests/api.spec.js
test('GET /api/products should return all products', async ({ request }) => {
  const response = await request.get('http://localhost:3000/api/products');

  expect(response.ok()).toBeTruthy();
  expect(response.status()).toBe(200);

  const products = await response.json();
  expect(Array.isArray(products)).toBeTruthy();
  expect(products.length).toBe(6);
});

test('GET /api/products/:id should return 404 for non-existent product',
  async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/products/999');

    expect(response.status()).toBe(404);
    const data = await response.json();
    expect(data.error).toBe('Product not found');
});

test('POST /api/login should fail with invalid credentials', async ({ request }) => {
  const response = await request.post('http://localhost:3000/api/login', {
    data: { email: 'wrong@email.com', password: 'wrongpassword' }
  });

  expect(response.status()).toBe(401);
});
```

Notice the pattern: test the **success case**, the **error case**, and the **validation case** (missing fields → 400) for every endpoint. API tests run in milliseconds, so you can afford lots of them — remember the pyramid.

## Class 11 — Debugging: Headed Mode and UI Mode

When a test fails, Playwright's tooling is genuinely best-in-class:

```bash
npx playwright test                 # headless (default, fast)
npx playwright test --headed       # watch the browser do its thing
npx playwright test --ui           # interactive UI mode with time travel
npx playwright test --debug        # step through with the inspector
npx playwright show-report          # rich HTML report after a run
```

**UI mode** is the standout — it shows every test step with DOM snapshots you can scrub back and forth through, so you can see exactly what the page looked like at the moment of failure. Combined with the config options `trace: 'on-first-retry'` and `screenshot: 'only-on-failure'`, you almost never have to guess why a test broke.

## Class 12 — Edge Cases and Security (XSS) Testing

Happy-path tests aren't enough. The course dedicates a whole spec to hostile and weird inputs:

```javascript
// tests/edge-cases.spec.js
test('should handle special characters in search', async ({ page }) => {
  // Attempted XSS injection
  await page.locator('#searchInput').fill('<script>alert("xss")</script>');
  await page.locator('#searchBtn').click();

  // App should not break — just show no results
  await expect(page.locator('.product-card')).toHaveCount(0);
  await expect(page.locator('.logo')).toBeVisible(); // page still functional
});

test('should handle adding same product multiple times', async ({ page }) => {
  const addButton = page.locator('.add-to-cart-btn').first();
  await addButton.click();
  await addButton.click();
  await addButton.click();

  await expect(page.locator('#cartCount').first()).toHaveText('3');
});

test('should reject duplicate email registration', async ({ page }) => {
  await page.goto('/register.html');
  await page.locator('#name').fill('Another User');
  await page.locator('#email').fill('demo@techmart.com'); // already exists
  await page.locator('#password').fill('password123');
  await page.locator('button[type="submit"]').click();

  await expect(page.locator('#errorMessage'))
    .toContainText(/already registered|exists/i);
});
```

Categories of edge cases to always consider: **empty input, whitespace-only input, special characters/injection attempts, duplicates, boundary values, and direct URL access** to pages that assume prior state.

## Class 13 — Mocking API Responses and Simulating Slow Networks

`page.route()` intercepts network requests, letting you simulate conditions that are nearly impossible to reproduce on demand — server errors, timeouts, out-of-stock states:

```javascript
// tests/mocking.spec.js
test('should display error state when API fails', async ({ page }) => {
  await page.route('**/api/products*', route => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal server error' })
    });
  });

  await page.goto('/');
  await expect(page.locator('.product-card')).toHaveCount(0);
});

test('should handle slow API responses gracefully', async ({ page }) => {
  await page.route('**/api/products*', async route => {
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3s delay
    route.continue();
  });

  await page.goto('/');

  // Page should still be usable while loading
  await expect(page.locator('#searchInput')).toBeVisible();
  // Products eventually appear
  await expect(page.locator('.product-card')).toHaveCount(6, { timeout: 10000 });
});

test('should handle network timeout', async ({ page }) => {
  await page.route('**/api/products*', route => route.abort('timedout'));

  await page.goto('/');
  await expect(page.locator('.logo')).toBeVisible(); // graceful degradation
});
```

Your three mocking tools: **`route.fulfill()`** (fake a response), **`route.continue()`** (pass through, optionally after a delay), and **`route.abort()`** (simulate network failure).

## Class 14 — Accessibility Testing

Accessibility is quality. The course shows two approaches — hand-rolled checks and automated scanning with axe-core.

Hand-rolled checks assert the basics: every image has alt text, every input has a label, headings don't skip levels:

```javascript
// tests/accessibility.spec.js
test('all images should have alt text', async ({ page }) => {
  const images = page.locator('img');
  const count = await images.count();

  for (let i = 0; i < count; i++) {
    const alt = await images.nth(i).getAttribute('alt');
    const src = await images.nth(i).getAttribute('src');
    expect(alt, `Image ${src} is missing alt text`).toBeTruthy();
  }
});

test('page should have proper heading hierarchy', async ({ page }) => {
  const h1Count = await page.locator('h1').count();
  expect(h1Count, 'Page should have exactly one h1').toBe(1);
});
```

Then one dependency (`npm install -D @axe-core/playwright`) gives you a full WCAG scan in a few lines:

```javascript
// tests/axe.spec.js
const AxeBuilder = require('@axe-core/playwright').default;

test('homepage should have no critical accessibility violations',
  async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])   // test against WCAG 2.0 AA
      .analyze();

    expect(results.violations.filter(v => v.impact === 'critical'))
      .toHaveLength(0);
});
```

Keyboard navigation matters too — `page.keyboard.press('Tab')` lets you verify that a user who can't use a mouse can still reach everything.

## Class 15 — Challenges, AI-Powered Testing, and KaneAI

The course is honest about automation's costs: there's a **learning curve**, and test suites carry a **maintenance burden** — every UI change can break selectors, and flaky tests erode trust fast.

That's the pitch for AI-powered testing tools. The final hands-on section uses **KaneAI** (by LambdaTest/TestMu) to author tests in **plain English** — "search for keyboard and verify one result appears" — which the AI converts into executable steps. Highlights:

- **Natural-language test authoring** — write scenarios like user stories.
- **Auto-healing** — when a selector changes, the AI finds the element by context instead of failing.
- **AI-driven API test execution** — describe the endpoint behavior you expect; the agent generates and runs the calls.

The course's verdict is balanced: AI tools lower the barrier to entry and reduce maintenance pain, but understanding fundamentals (the pyramid, locators, assertions, state management) is what lets you judge whether AI-generated tests are actually *good*. Manual coding still wins for complex logic and precise control.

## Class 16 — Professional Best Practices

The course closes with habits that separate hobby test suites from professional ones:

- **Run tests in CI/CD** — every push triggers the suite; the config's `retries: process.env.CI ? 2 : 0` and `forbidOnly` are built for this.
- **Page Object Model (POM)** — wrap each page's locators and actions in a class so UI changes only require edits in one place.
- **Keep tests independent** — every test sets up its own state (that's why every spec clears the cart in `beforeEach`).
- **Test behavior, not implementation** — assert what the user sees, not internal details.
- **Use API shortcuts for setup**, UI for the actual behavior under test.

## Final Takeaways

1. Testing is insurance — the cost of writing tests is trivial compared to the cost of production failures (ask Knight Capital).
2. Follow the pyramid: many unit tests, some integration tests, few but high-value E2E tests.
3. Playwright covers a huge surface with one tool: multi-browser E2E, mobile viewports, API testing, network mocking, and accessibility.
4. Auto-waiting assertions (`expect(...).toBeVisible()`) kill most flakiness — avoid manual timeouts wherever possible.
5. Test the sad paths: errors, edge cases, injections, and slow networks are where real bugs live.
6. AI testing tools are a genuine accelerator, but fundamentals make you the person who can verify the AI's work.

This post covered the full arc of the course with Playwright at the center. In upcoming posts I'll go deeper into individual topics — the Page Object Model, CI/CD pipelines for test suites, and a hands-on KaneAI walkthrough. If you want to follow along yourself, the course is free on [freeCodeCamp's YouTube channel](https://www.youtube.com/watch?v=jydYq7oAtD8) and all the code is on [GitHub](https://github.com/beaucarnes/software-testing-course).

---

**Sources**
- Course video: Software Testing Course – Playwright, E2E, and AI Agents — https://www.youtube.com/watch?v=jydYq7oAtD8
- Course code repository: https://github.com/beaucarnes/software-testing-course
- Playwright documentation: https://playwright.dev/docs/intro
- axe-core for Playwright: https://www.npmjs.com/package/@axe-core/playwright
