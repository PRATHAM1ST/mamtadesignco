import {test, expect} from '@playwright/test';

test('live Kite offers rotate in the header and appear on cards and product pages', async ({page}) => {
  await page.goto('/');
  const banner = page.locator('.kite-announcement');
  await expect(banner).toContainText('Free shipping on orders ₹4,999+');
  await banner.getByRole('button', {name: 'Show next offer'}).click();
  await expect(banner).toContainText('25% off orders ₹6,999+');
  await expect(banner.getByRole('button', {name: 'Resume offer rotation'})).toBeVisible();
  await expect(page.locator('.product-item').first().locator('.kite-offers')).toContainText('25% off orders ₹6,999+');
  await page.goto('/products/gulabi-zari-chaniya');
  await expect(page.locator('.pdp-details > .kite-offers')).toContainText('No code needed');
  await page.setViewportSize({width: 320, height: 844});
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('real Kite savings and progress reconcile with Shopify through checkout handover', async ({page}) => {
  const {product} = await (await page.request.get('/api/product?handle=gulabi-zari-chaniya')).json();
  const variant = product.variants.nodes.find((item: {availableForSale: boolean}) => item.availableForSale);
  const response = await page.request.post('/cart', {form: {cartFormInput: JSON.stringify({action: 'LinesAdd', inputs: {lines: [{merchandiseId: variant.id, quantity: 1}]}})}});
  expect(response.status()).toBe(200);
  await page.goto('/cart');
  await expect(page.locator('.cart-summary .kite-offers')).toContainText('more to reach this offer');
  const {cart: first} = await (await page.request.get('/api/cart')).json();
  await page.request.post('/cart', {form: {cartFormInput: JSON.stringify({action: 'LinesUpdate', inputs: {lines: [{id: first.lines.nodes[0].id, quantity: 2}]}})}});
  await page.reload();
  const {cart} = await (await page.request.get('/api/cart')).json();
  expect(Number(cart.cost.subtotalAmount.amount)).toBe(8598);
  expect(Number(cart.cost.totalAmount.amount)).toBe(6448.5);
  expect(cart.discountAllocations.some((discount: {title?: string}) => discount.title === '25% Off')).toBe(true);
  await expect(page.locator('.cart-estimated-total')).toContainText('6,448.50');
  await expect(page.locator('.cart-summary .kite-offers')).toContainText('Spend requirement met');
  await expect(page.locator('.cart-summary .cart-applied-amounts')).toContainText('25% Off');
  await page.setViewportSize({width: 390, height: 844});
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  const checkout = await page.request.post('/checkout', {maxRedirects: 0});
  expect(checkout.status()).toBe(303);
  const checkoutUrl = new URL(checkout.headers().location);
  expect(checkoutUrl.origin + checkoutUrl.pathname).toBe(new URL(cart.checkoutUrl).origin + new URL(cart.checkoutUrl).pathname);
});
