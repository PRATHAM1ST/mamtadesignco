# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: content.spec.ts >> policies use real Shopify data and reject unsupported policy handles
- Location: tests\content.spec.ts:4:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'The finer details.' })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('heading', { name: 'The finer details.' }) with timeout 10000ms
  - waiting for getByRole('heading', { name: 'The finer details.' })

```

# Test source

```ts
  1  | import {test, expect} from '@playwright/test';
  2  | import AxeBuilder from '@axe-core/playwright';
  3  | 
  4  | test('policies use real Shopify data and reject unsupported policy handles', async ({page, request}) => {
  5  |   await page.goto('/policies');
> 6  |   await expect(page.getByRole('heading', {name: 'The finer details.'})).toBeVisible();
     |                                                                         ^ Error: expect(locator).toBeVisible() failed
  7  |   const shipping = page.locator('.policy-links a').filter({hasText: /shipping/i});
  8  |   await expect(shipping).toBeVisible();
  9  |   await shipping.click();
  10 |   await expect(page.locator('.policy .prose')).not.toBeEmpty();
  11 |   const invalid = await request.get('/policies/unsupported-field', {maxRedirects: 0});
  12 |   expect(invalid.status()).toBe(404);
  13 | });
  14 | 
  15 | test('journal uses published stories or an honest empty state', async ({page}) => {
  16 |   await page.goto('/blogs');
  17 |   await expect(page.getByRole('heading', {name: 'The journal.'})).toBeVisible();
  18 |   if (await page.locator('.journal-card').count()) await expect(page.locator('.journal-card').first()).toHaveAttribute('href', /\/blogs\/[^/]+\/[^/]+/);
  19 |   else {
  20 |     await expect(page.getByRole('heading', {name: 'A new chapter is on its way.'})).toBeVisible();
  21 |     await expect(page.getByRole('link', {name: 'Visit the shop →'})).toHaveAttribute('href', '/shop');
  22 |   }
  23 | });
  24 | 
  25 | test('contact and FAQ provide usable care paths without a fake form backend', async ({page}) => {
  26 |   await page.goto('/contact');
  27 |   await expect(page.getByRole('heading', {name: 'We’re here for you.'})).toBeVisible();
  28 |   await expect(page.getByRole('link', {name: 'Shipping & returns →'})).toBeVisible();
  29 |   await expect(page.locator('.contact-email')).toHaveAttribute('href', 'mailto:mamtadesignco@gmail.com');
  30 |   const oldContact = await page.request.get('/pages/contact?utm_source=campaign', {maxRedirects: 0});
  31 |   expect(oldContact.status()).toBe(301);
  32 |   expect(oldContact.headers().location).toBe('/contact?utm_source=campaign');
  33 |   await page.goto('/faq');
  34 |   await expect(page.getByRole('heading', {name: 'A little clarity.'})).toBeVisible();
  35 |   if (await page.locator('.faq-list details').count()) {
  36 |     await page.locator('.faq-list summary').first().click();
  37 |     await expect(page.locator('.faq-list details[open] p')).toBeVisible();
  38 |   } else await expect(page.getByRole('link', {name: 'Read our policies →'})).toBeVisible();
  39 | });
  40 | 
  41 | test('private accounts require Shopify authentication with a safe HTTP preview fallback', async ({request}) => {
  42 |   const response = await request.get('/account', {maxRedirects: 0});
  43 |   if (response.status() === 400) {
  44 |     expect(new URL(response.url()).hostname).toBe('localhost');
  45 |     expect(await response.text()).toContain('Your account, securely.');
  46 |   } else {
  47 |     expect([302, 303]).toContain(response.status());
  48 |     expect(response.headers().location).toMatch(/account\/login|shopify\.com|myshopify\.com/);
  49 |   }
  50 |   expect(response.headers()['cache-control']).toMatch(/no-store|private/);
  51 | });
  52 | 
  53 | test('sitemap includes real root routes and no invented language paths', async ({request}) => {
  54 |   const index = await request.get('/sitemap.xml');
  55 |   expect(index.status()).toBe(200);
  56 |   expect(await index.text()).toContain('/sitemap/static.xml');
  57 |   const sitemap = await request.get('/sitemap/static.xml');
  58 |   expect(sitemap.status()).toBe(200);
  59 |   expect(await sitemap.text()).toContain('/catalogue</loc>');
  60 |   const productSitemap = await request.get('/sitemap/products/1.xml');
  61 |   expect(productSitemap.status()).toBe(200);
  62 |   expect(await productSitemap.text()).not.toMatch(/\/EN-US\/|\/FR-CA\//);
  63 | });
  64 | 
  65 | test('404 returns an HTTP 404 and an accessible recovery form', async ({page}) => {
  66 |   const response = await page.goto('/a-page-that-does-not-exist');
  67 |   expect(response?.status()).toBe(404);
  68 |   await expect(page.getByRole('heading', {name: 'A different way to the celebration.'})).toBeVisible();
  69 |   await expect(page.getByLabel('Find something beautiful')).toBeVisible();
  70 |   await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'noindex, nofollow');
  71 | });
  72 | 
  73 | for (const width of [320, 390, 768, 1440]) {
  74 |   test(`customer care fits ${width}px and passes scoped WCAG checks`, async ({page}) => {
  75 |     await page.setViewportSize({width, height: 900});
  76 |     await page.goto('/contact');
  77 |     await expect(page.getByRole('heading', {name: 'We’re here for you.'})).toBeVisible();
  78 |     expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  79 |     const results = await new AxeBuilder({page}).include('.content-shell').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  80 |     expect(results.violations).toEqual([]);
  81 |   });
  82 | }
  83 | 
```