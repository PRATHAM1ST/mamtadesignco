import {test, expect} from '@playwright/test';
import {AxeBuilder} from '@axe-core/playwright';

test('policies use real Shopify data and reject unsupported policy handles', async ({page, request}) => {
  await page.goto('/policies');
  await expect(page.getByRole('heading', {name: 'The finer details.'})).toBeVisible();
  const shipping = page.locator('.policy-links a').filter({hasText: /shipping/i});
  await expect(shipping).toBeVisible();
  await shipping.click();
  await expect(page.locator('.policy .prose')).not.toBeEmpty();
  const invalid = await request.get('/policies/unsupported-field', {maxRedirects: 0});
  expect(invalid.status()).toBe(404);
});

test('journal uses published stories or an honest empty state', async ({page}) => {
  await page.goto('/blogs');
  await expect(page.getByRole('heading', {name: 'The journal.'})).toBeVisible();
  if (await page.locator('.journal-card').count()) await expect(page.locator('.journal-card').first()).toHaveAttribute('href', /\/blogs\/[^/]+\/[^/]+/);
  else {
    await expect(page.getByRole('heading', {name: 'A new chapter is on its way.'})).toBeVisible();
    await expect(page.getByRole('link', {name: 'Visit the shop →'})).toHaveAttribute('href', '/shop');
  }
});

test('contact and FAQ provide usable care paths without a fake form backend', async ({page}) => {
  await page.goto('/contact');
  await expect(page.getByRole('heading', {name: 'We’re here for you.'})).toBeVisible();
  await expect(page.getByRole('link', {name: 'Shipping & returns →'})).toBeVisible();
  await expect(page.locator('.contact-email')).toHaveAttribute('href', 'mailto:mamtadesignco@gmail.com');
  const oldContact = await page.request.get('/pages/contact?utm_source=campaign', {maxRedirects: 0});
  expect(oldContact.status()).toBe(301);
  expect(oldContact.headers().location).toBe('/contact?utm_source=campaign');
  await page.goto('/faq');
  await expect(page.getByRole('heading', {name: 'A little clarity.'})).toBeVisible();
  if (await page.locator('.faq-list details').count()) {
    await page.locator('.faq-list summary').first().click();
    await expect(page.locator('.faq-list details[open] p')).toBeVisible();
  } else await expect(page.getByRole('link', {name: 'Read our policies →'})).toBeVisible();
});

test('private accounts require Shopify authentication with a safe HTTP preview fallback', async ({request}) => {
  const response = await request.get('/account', {maxRedirects: 0});
  if (response.status() === 400) {
    expect(new URL(response.url()).hostname).toBe('localhost');
    expect(await response.text()).toContain('Your account, securely.');
  } else {
    expect([302, 303]).toContain(response.status());
    expect(response.headers().location).toMatch(/account\/login|shopify\.com|myshopify\.com/);
  }
  expect(response.headers()['cache-control']).toMatch(/no-store|private/);
});

test('sitemap includes real root routes and no invented language paths', async ({request}) => {
  const index = await request.get('/sitemap.xml');
  expect(index.status()).toBe(200);
  expect(await index.text()).toContain('/sitemap/static.xml');
  const sitemap = await request.get('/sitemap/static.xml');
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).toContain('/catalogue</loc>');
  const productSitemap = await request.get('/sitemap/products/1.xml');
  expect(productSitemap.status()).toBe(200);
  expect(await productSitemap.text()).not.toMatch(/\/EN-US\/|\/FR-CA\//);
});

test('404 returns an HTTP 404 and an accessible recovery form', async ({page}) => {
  const response = await page.goto('/a-page-that-does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', {name: 'A different way to the celebration.'})).toBeVisible();
  await expect(page.getByLabel('Find something beautiful')).toBeVisible();
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'noindex, nofollow');
});

for (const width of [320, 390, 768, 1440]) {
  test(`customer care fits ${width}px and passes scoped WCAG checks`, async ({page}) => {
    await page.setViewportSize({width, height: 900});
    await page.goto('/contact');
    await expect(page.getByRole('heading', {name: 'We’re here for you.'})).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const results = await new AxeBuilder({page}).include('.content-shell').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations).toEqual([]);
  });
}
