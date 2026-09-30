# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: catalog-search.spec.ts >> price filters, authoritative sort and browser back preserve the selection
- Location: tests\catalog-search.spec.ts:3:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByRole('heading', { level: 1 })
Expected substring: "For the nights"
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" getByRole('heading', { level: 1 }) with timeout 10000ms
  - waiting for getByRole('heading', { level: 1 })

```

```yaml
- heading "MiniOxygen couldn't load your app's entry point." [level=2]
- paragraph
- text: "Error: Cannot find module '@shopify/hydrogen-react' imported from 'C:/Users/admin/Desktop/mamtadesignco/app/root.tsx' at fetchModule (file:///C:/Users/admin/Desktop/mamtadesignco/node_modules/vite/dist/node/chunks/dep-Dm0c1Wj2.js:46972:19) at FetchableDevEnvironment.fetchModule (file:///C:/Users/admin/Desktop/mamtadesignco/node_modules/vite/dist/node/chunks/dep-Dm0c1Wj2.js:48071:12) at fetchModule (file:///C:/Users/admin/Desktop/mamtadesignco/node_modules/vite/dist/node/chunks/dep-Dm0c1Wj2.js:48025:21) at Object.handleInvoke (file:///C:/Users/admin/Desktop/mamtadesignco/node_modules/vite/dist/node/chunks/dep-Dm0c1Wj2.js:39131:28) at processTicksAndRejections (node:internal/process/task_queues:104:5) at Miniflare2.#handleLoopbackCustomService (C:\\Users\\admin\\Desktop\\mamtadesignco\\node_modules\\miniflare\\src\\index.ts:853:46) at Server.#handleLoopback (C:\\Users\\admin\\Desktop\\mamtadesignco\\node_modules\\miniflare\\src\\index.ts:917:16)"
```

# Test source

```ts
  1  | import {test, expect} from '@playwright/test';
  2  | 
  3  | test('price filters, authoritative sort and browser back preserve the selection', async ({page}) => {
  4  |   await page.goto('/shop');
> 5  |   await expect(page.getByRole('heading', {level: 1})).toContainText('For the nights');
     |                                                       ^ Error: expect(locator).toContainText(expected) failed
  6  |   await expect(page.locator('.catalog-count')).toHaveText(/\d+ pieces/);
  7  |   const firstPrice = await page.locator('.catalog-grid .card-price > div').first().innerText();
  8  |   const maximum = String(Math.ceil(Number(firstPrice.replace(/[^\d.]/g, ''))));
  9  |   await page.locator('.catalog-filter-trigger').click();
  10 |   const dialog = page.getByRole('dialog', {name: 'Refine your selection'});
  11 |   await expect(dialog).toBeVisible();
  12 |   await dialog.getByLabel('Minimum', {exact: true}).fill('0');
  13 |   await dialog.getByLabel('Maximum', {exact: true}).fill(maximum);
  14 |   await dialog.getByRole('button', {name: 'Apply price'}).click();
  15 |   await expect(page).toHaveURL(/filter\.price\.min=0/);
  16 |   await expect.poll(() => new URL(page.url()).searchParams.get('filter.price.max')).toBe(maximum);
  17 |   await dialog.getByRole('button', {name: /^Show /}).click();
  18 |   await expect(dialog).not.toBeVisible();
  19 |   await page.getByLabel('Sort by', {exact: true}).selectOption('price-high');
  20 |   await expect(page).toHaveURL(/sort=price-high/);
  21 |   const filteredUrl = page.url();
  22 |   await page.locator('.catalog-grid .product-card-image').first().click();
  23 |   await expect(page).toHaveURL(/\/products\//);
  24 |   await page.goBack();
  25 |   await expect(page).toHaveURL(filteredUrl);
  26 |   await expect(page.getByLabel('Sort by', {exact: true})).toHaveValue('price-high');
  27 |   await expect(page.locator('.filter-chip').filter({hasText: 'Price range'})).toBeVisible();
  28 |   await page.locator('.filter-chip').filter({hasText: 'Price range'}).click();
  29 |   await expect.poll(() => new URL(page.url()).searchParams.has('filter.price.min')).toBe(false);
  30 |   await expect(page.getByLabel('Sort by', {exact: true})).toHaveValue('price-high');
  31 | });
  32 | 
  33 | test('predictive search supports keyboard selection and leads to a real product', async ({page}) => {
  34 |   await page.goto('/');
  35 |   await page.locator('.header').getByRole('link', {name: 'Search', exact: true}).click();
  36 |   const dialog = page.getByRole('dialog', {name: 'Find something beautiful'});
  37 |   const input = dialog.getByRole('combobox');
  38 |   await input.fill('chaniya');
  39 |   await expect(dialog.locator('.predictive-result-link').first()).toBeVisible();
  40 |   const firstProduct = dialog.getByRole('group', {name: 'Pieces', exact: true}).locator('.predictive-result-link').first();
  41 |   const target = await firstProduct.getAttribute('href');
  42 |   expect(target).toMatch(/^\/products\//);
  43 |   await input.press('ArrowDown');
  44 |   await expect(firstProduct).toHaveAttribute('aria-selected', 'true');
  45 |   await input.press('Enter');
  46 |   await expect(page).toHaveURL(new RegExp(target!.split('?')[0]));
  47 |   await expect(page.getByRole('heading', {level: 1})).toBeVisible();
  48 |   await expect(dialog).not.toBeVisible();
  49 | });
  50 | 
  51 | test('mobile filters are usable and each applied filter can be removed', async ({page}) => {
  52 |   await page.setViewportSize({width: 390, height: 844});
  53 |   await page.goto('/shop');
  54 |   await page.locator('.catalog-filter-trigger').click();
  55 |   const dialog = page.getByRole('dialog', {name: 'Refine your selection'});
  56 |   await dialog.getByRole('link', {name: /Apply Availability: In stock/}).click();
  57 |   await expect(page).toHaveURL(/filter\.available=true/);
  58 |   await dialog.getByRole('button', {name: /^Show /}).click();
  59 |   await page.locator('.filter-chip').filter({hasText: 'In stock'}).click();
  60 |   await expect.poll(() => new URL(page.url()).searchParams.has('filter.available')).toBe(false);
  61 |   await page.locator('.catalog-filter-trigger').click();
  62 |   await expect(dialog).toBeVisible();
  63 |   await page.keyboard.press('Escape');
  64 |   await expect(dialog).not.toBeVisible();
  65 |   await expect(page.locator('.catalog-filter-trigger')).toBeFocused();
  66 | });
  67 | 
  68 | test('catalog remains within the viewport across narrow mobile and desktop widths', async ({page}) => {
  69 |   await page.goto('/shop');
  70 |   for (const width of [320, 360, 390, 430, 768, 1024, 1440, 1728]) {
  71 |     await page.setViewportSize({width, height: 900});
  72 |     await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  73 |   }
  74 | });
  75 | 
  76 | test.describe('progressive enhancement', () => {
  77 |   test.use({javaScriptEnabled: false});
  78 |   test('catalog, native filtering and full search work without JavaScript', async ({page}) => {
  79 |     await page.goto('/shop');
  80 |     await expect(page.locator('.catalog-grid .product-item').first()).toBeVisible();
  81 |     const filters = page.locator('.catalog-nojs-filters');
  82 |     await filters.locator('summary').filter({hasText: 'Availability'}).click();
  83 |     await filters.getByRole('link', {name: /^In stock \(/}).first().click();
  84 |     await expect(page).toHaveURL(/filter\.available=true/);
  85 |     await page.goto('/search');
  86 |     await page.getByLabel('Search the collection and journal').fill('chaniya');
  87 |     await page.locator('.full-search-form').getByRole('button', {name: /Search/}).click();
  88 |     await expect(page).toHaveURL(/q=chaniya/);
  89 |     await expect(page.locator('.search-total')).toContainText('results');
  90 |     await expect(page.locator('.catalog-grid .product-item').first()).toBeVisible();
  91 |   });
  92 | });
  93 | 
```