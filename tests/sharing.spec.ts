import {test, expect} from '@playwright/test';

test('public pages expose complete sharing metadata in crawler HTML', async ({request}) => {
  for (const path of ['/', '/shop', '/catalogue', '/collections', '/blogs', '/contact', '/faq', '/policies']) {
    const response = await request.get(path, {headers: {'User-Agent': 'facebookexternalhit/1.1'}});
    expect(response.status(), path).toBe(200);
    const head = (await response.text()).split('</head>')[0];
    for (const property of ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:width', 'og:image:height']) {
      expect(head, `${path}: ${property}`).toMatch(new RegExp(`<meta property="${property}" content="[^"]+"`));
    }
    expect(head, path).toMatch(/<link rel="canonical" href="https?:\/\/[^"?]+"/);
    expect(head, path).toContain('name="twitter:card" content="summary_large_image"');
  }
});

test('home uses the brand card and products serve a compact real product image', async ({page, request}) => {
  await page.goto('/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/og-image\.jpg$/);
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '628');
  await expect(page.getByRole('heading', {name: 'In your words.'})).toBeAttached();
  await expect(page.locator('.announcement')).toBeVisible();
  const product = await page.locator('a[href^="/products/"]').first().getAttribute('href');
  expect(product).toBeTruthy();
  await page.goto(product!);
  const source = await page.locator('meta[property="og:image"]').getAttribute('content');
  expect(source).toContain('cdn.shopify.com');
  const sourceUrl = new URL(source!);
  expect(sourceUrl.searchParams.get('format')).toBe('jpg');
  expect(sourceUrl.searchParams.get('width')).toBe('1200');
  expect(sourceUrl.searchParams.get('height')).toBe('628');
  expect(sourceUrl.searchParams.get('crop')).toBe('center');
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '628');
  const image = await request.get(source!);
  expect(image.status()).toBe(200);
  expect(image.headers()['content-type']).toContain('image/jpeg');
  expect((await image.body()).length).toBeLessThan(1_000_000);
  await page.locator('.purchase-offers summary').click();
  await expect(page.locator('.purchase-offers input[name="discountCode"]')).toBeVisible();
  await page.setViewportSize({width: 390, height: 844});
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.goto('/');
  await page.locator('#reviews').scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('failed product pages cannot be indexed', async ({request}) => {
  const response = await request.get('/products/nonexistent-sharing-regression');
  expect(response.status()).toBe(404);
  expect(response.headers()['x-robots-tag']).toBe('noindex, nofollow');
});
