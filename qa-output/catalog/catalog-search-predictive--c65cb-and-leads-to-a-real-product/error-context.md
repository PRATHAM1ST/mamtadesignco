# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: catalog-search.spec.ts >> predictive search supports keyboard selection and leads to a real product
- Location: tests\catalog-search.spec.ts:33:1

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.fill: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByRole('dialog', { name: 'Find something beautiful' }).getByRole('combobox')

```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]:
  - link "Skip to content" [ref=f1e2] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=f1e3]:
    - generic [ref=f1e4]:
      - button "Open navigation" [ref=f1e5] [cursor=pointer]
      - navigation "Main navigation" [ref=f1e8]:
        - link "Home" [ref=f1e10] [cursor=pointer]:
          - /url: /
        - link "Catalog" [ref=f1e12] [cursor=pointer]:
          - /url: /collections/all
        - link "Contact" [ref=f1e14] [cursor=pointer]:
          - /url: /pages/contact
    - link "Mamta Design Co home" [ref=f1e15] [cursor=pointer]:
      - /url: /
      - generic [ref=f1e16]: MAMTA
      - generic [ref=f1e17]: DESIGN CO.
    - navigation "Your account and shopping bag" [ref=f1e18]:
      - link "Search" [ref=f1e19] [cursor=pointer]:
        - /url: /search
      - link "Your account" [ref=f1e23] [cursor=pointer]:
        - /url: /account
      - link "Favorites" [ref=f1e27] [cursor=pointer]:
        - /url: /favorites
      - link "Shopping bag" [ref=f1e30] [cursor=pointer]:
        - /url: /cart
        - generic [aria-hidden] [ref=f1e34]: "0"
  - main [ref=f1e35]:
    - generic [ref=f1e36]:
      - generic [ref=f1e37]:
        - text: Find your piece
        - heading [level=1] [ref=f1e38]:
          - text: What are you
          - emphasis [ref=f1e39]: looking for?
      - search [ref=f1e40]:
        - generic [ref=f1e41]: Search the collection and journal
        - searchbox "Search the collection and journal" [ref=f1e42]
        - button "Search" [ref=f1e43] [cursor=pointer]:
          - text: Search
          - generic [aria-hidden] [ref=f1e44]: ↗
      - generic [ref=f1e45]:
        - paragraph [ref=f1e46]: Begin with a product name, a colour or a detail.
        - link "Explore all pieces ↗" [ref=f1e47] [cursor=pointer]:
          - /url: /shop
  - contentinfo [ref=f1e48]:
    - generic [ref=f1e49]:
      - generic [ref=f1e50]:
        - paragraph [ref=f1e51]: MAMTA DESIGN CO.
        - heading "For the nights you remember." [level=2] [ref=f1e52]: For the nightsyou remember.
        - link "Find your Chaniya ↗" [ref=f1e53] [cursor=pointer]:
          - /url: /shop
          - text: Find your Chaniya
          - generic [ref=f1e54]: ↗
      - generic [ref=f1e55]:
        - navigation "Explore the store" [ref=f1e56]:
          - paragraph [ref=f1e57]: EXPLORE
          - link "Shop all" [ref=f1e58] [cursor=pointer]:
            - /url: /shop
          - link "The catalogue" [ref=f1e59] [cursor=pointer]:
            - /url: /catalogue
          - link "Collections" [ref=f1e60] [cursor=pointer]:
            - /url: /collections
          - link "Journal" [ref=f1e61] [cursor=pointer]:
            - /url: /blogs
          - link "Your favorites" [ref=f1e62] [cursor=pointer]:
            - /url: /favorites
        - navigation "Customer care" [ref=f1e63]:
          - paragraph [ref=f1e64]: HERE FOR YOU
          - link "Your account" [ref=f1e65] [cursor=pointer]:
            - /url: /account
          - link "Contact" [ref=f1e66] [cursor=pointer]:
            - /url: /contact
          - link "Store policies" [ref=f1e67] [cursor=pointer]:
            - /url: /policies
          - link "Search" [ref=f1e68] [cursor=pointer]:
            - /url: /search
    - generic [aria-hidden] [ref=f1e69]: mamta.
    - generic [ref=f1e70]:
      - generic [ref=f1e71]: © 2026 Mamta Design Co
      - generic [ref=f1e72]: India · English
      - generic [ref=f1e73]: Secure checkout by Shopify
```

# Test source

```ts
  1  | import {test, expect} from '@playwright/test';
  2  | 
  3  | test('price filters, authoritative sort and browser back preserve the selection', async ({page}) => {
  4  |   await page.goto('/shop');
  5  |   await expect(page.getByRole('heading', {level: 1})).toContainText('For the nights');
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
> 38 |   await input.fill('chaniya');
     |               ^ Error: locator.fill: Test timeout of 60000ms exceeded.
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