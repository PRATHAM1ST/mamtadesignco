import {test, expect} from '@playwright/test';

test('price filters, authoritative sort and browser back preserve the selection', async ({page}) => {
  await page.goto('/shop');
  await expect(page.getByRole('heading', {level: 1})).toContainText('For the nights');
  await expect(page.locator('.catalog-count')).toHaveText(/\d+ pieces/);
  const firstPrice = await page.locator('.catalog-grid .card-price > div').first().innerText();
  const maximum = String(Math.ceil(Number(firstPrice.replace(/[^\d.]/g, ''))));
  await page.locator('.catalog-filter-trigger').click();
  const dialog = page.getByRole('dialog', {name: 'Refine your selection'});
  await expect(dialog).toBeVisible();
  await dialog.getByLabel('Minimum', {exact: true}).fill('0');
  await dialog.getByLabel('Maximum', {exact: true}).fill(maximum);
  await dialog.getByRole('button', {name: 'Apply price'}).click();
  await expect(page).toHaveURL(/filter\.price\.min=0/);
  await expect.poll(() => new URL(page.url()).searchParams.get('filter.price.max')).toBe(maximum);
  await dialog.getByRole('button', {name: /^Show /}).click();
  await expect(dialog).not.toBeVisible();
  await page.getByLabel('Sort by', {exact: true}).selectOption('price-high');
  await expect(page).toHaveURL(/sort=price-high/);
  const filteredUrl = page.url();
  await page.locator('.catalog-grid .product-card-image').first().click();
  await expect(page).toHaveURL(/\/products\//);
  await page.goBack();
  await expect(page).toHaveURL(filteredUrl);
  await expect(page.getByLabel('Sort by', {exact: true})).toHaveValue('price-high');
  await expect(page.locator('.filter-chip').filter({hasText: 'Price range'})).toBeVisible();
  await page.locator('.filter-chip').filter({hasText: 'Price range'}).click();
  await expect.poll(() => new URL(page.url()).searchParams.has('filter.price.min')).toBe(false);
  await expect(page.getByLabel('Sort by', {exact: true})).toHaveValue('price-high');
});

test('predictive search supports keyboard selection and leads to a real product', async ({page}) => {
  await page.goto('/', {waitUntil: 'networkidle'});
  await page.locator('.header').getByRole('link', {name: 'Search', exact: true}).click();
  const dialog = page.getByRole('dialog', {name: 'Find something beautiful'});
  const input = dialog.getByRole('combobox');
  await input.fill('chaniya');
  await expect(dialog.locator('.predictive-result-link').first()).toBeVisible();
  const firstProduct = dialog.getByRole('group', {name: 'Pieces', exact: true}).locator('.predictive-result-link').first();
  const target = await firstProduct.getAttribute('href');
  expect(target).toMatch(/^\/products\//);
  await input.press('ArrowDown');
  await expect(firstProduct).toHaveAttribute('aria-selected', 'true');
  await input.press('Enter');
  await expect(page).toHaveURL(new RegExp(target!.split('?')[0]));
  await expect(page.getByRole('heading', {level: 1})).toBeVisible();
  await expect(dialog).not.toBeVisible();
});

test('mobile filters are usable and each applied filter can be removed', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('/shop');
  await page.locator('.catalog-filter-trigger').click();
  const dialog = page.getByRole('dialog', {name: 'Refine your selection'});
  await dialog.getByRole('link', {name: /Apply Availability: In stock/}).click();
  await expect(page).toHaveURL(/filter\.available=true/);
  await dialog.getByRole('button', {name: /^Show /}).click();
  await page.locator('.filter-chip').filter({hasText: 'In stock'}).click();
  await expect.poll(() => new URL(page.url()).searchParams.has('filter.available')).toBe(false);
  await page.locator('.catalog-filter-trigger').click();
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.locator('.catalog-filter-trigger')).toBeFocused();
});

test('catalog remains within the viewport across narrow mobile and desktop widths', async ({page}) => {
  await page.goto('/shop');
  for (const width of [320, 360, 390, 430, 768, 1024, 1440, 1728]) {
    await page.setViewportSize({width, height: 900});
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test.describe('progressive enhancement', () => {
  test.use({javaScriptEnabled: false});
  test('catalog, native filtering and full search work without JavaScript', async ({page}) => {
    await page.goto('/shop');
    await expect(page.locator('.catalog-grid .product-item').first()).toBeVisible();
    const filters = page.locator('.catalog-nojs-filters');
    await filters.locator('summary').filter({hasText: 'Availability'}).click();
    await filters.getByRole('link', {name: /^In stock \(/}).first().click();
    await expect(page).toHaveURL(/filter\.available=true/);
    await page.goto('/search');
    await page.getByLabel('Search the collection and journal').fill('chaniya');
    await page.locator('.full-search-form').getByRole('button', {name: /Search/}).click();
    await expect(page).toHaveURL(/q=chaniya/);
    await expect(page.locator('.search-total')).toContainText('results');
    await expect(page.locator('.catalog-grid .product-item').first()).toBeVisible();
  });
});
