import {test, expect, type Page} from '@playwright/test';

type Product = {id: string; title: string; handle: string; variants: {nodes: {id: string; availableForSale: boolean; price: {amount: string; currencyCode: string}}[]}};
type Mutation = {cart: {checkoutUrl: string; totalQuantity: number; cost: {subtotalAmount: {amount: string; currencyCode: string}}; lines: {nodes: {id: string; quantity: number; cost: {totalAmount: {amount: string; currencyCode: string}}}[]}}; errors?: {message: string}[]; success: boolean};

async function availableProducts(page: Page, count = 1) {
  await page.goto('/shop');
  await expect(page.locator('.product-item').first()).toBeVisible();
  const handles = await page.locator('.product-item a[href^="/products/"]').evaluateAll((links) => [...new Set(links.map((link) => new URL((link as HTMLAnchorElement).href).pathname.split('/').pop()))]);
  const products: Product[] = [];
  for (const handle of handles) {
    if (!handle) continue;
    const response = await page.request.get(`/api/product?handle=${encodeURIComponent(handle)}`);
    expect(response.ok()).toBeTruthy();
    const result = await response.json() as {product: Product};
    if (result.product.variants.nodes.some((variant) => variant.availableForSale)) products.push(result.product);
    if (products.length === count) break;
  }
  expect(products.length, 'The connected catalogue must have enough available products to exercise checkout').toBe(count);
  return products;
}

async function cartMutation(page: Page, action: () => Promise<void>): Promise<Mutation> {
  const responsePromise = page.waitForResponse((response) => new URL(response.url()).pathname === '/cart.data' && response.request().method() === 'POST');
  await action();
  // React Router .data responses use single-fetch serialization. Verify the same
  // authoritative cart through its private snapshot instead of parsing that format.
  await responsePromise;
  await expect(page.getByRole('button', {name: 'Continue to checkout', exact: true}).last()).toBeEnabled();
  return readCart(page);
}

async function readCart(page: Page) {
  const response = await page.request.get('/api/cart');
  expect(response.status()).toBe(200);
  const result = await response.json() as Mutation;
  expect(result.success).toBe(true);
  expect(result.errors || []).toEqual([]);
  return result;
}

function money(amount: string, currency: string) {
  return new Intl.NumberFormat('en-IN', {style: 'currency', currency, maximumFractionDigits: 0}).format(Number(amount));
}

test('real product purchase reconciles quantities, Shopify totals, discounts and hosted checkout', async ({page}) => {
  const [product] = await availableProducts(page);
  const variant = product.variants.nodes.find((variant) => variant.availableForSale)!;
  await page.goto(`/products/${product.handle}?variant=${variant.id.split('/').pop()}`);
  await expect(page.getByRole('heading', {level: 1, name: product.title})).toBeVisible();
  const addResponse = page.waitForResponse((response) => new URL(response.url()).pathname === '/cart.data' && response.request().method() === 'POST');
  await page.locator('.pdp-details').getByRole('button', {name: 'Add to bag', exact: true}).click();
  await addResponse;
  await expect(page.getByRole('dialog').getByRole('heading', {name: /bag/i})).toBeVisible();
  await page.getByRole('dialog').getByRole('button', {name: 'Close dialog'}).click();
  await page.goto('/cart');
  const result = await cartMutation(page, () => page.getByRole('button', {name: `Increase quantity of ${product.title}`}).click());
  expect(result.cart.totalQuantity).toBe(2);
  await expect(page.locator('.cart-quantity output').first()).toHaveText('2');
  await expect(page.locator('.cart-subtotal dd').first()).toContainText(money(result.cart.cost.subtotalAmount.amount, result.cart.cost.subtotalAmount.currencyCode));
  await expect(page.locator('.cart-line-total').first()).toContainText(money(result.cart.lines.nodes[0].cost.totalAmount.amount, result.cart.lines.nodes[0].cost.totalAmount.currencyCode));
  await page.getByLabel('Discount code', {exact: true}).fill('CODEX-INVALID-STORE-CODE');
  await cartMutation(page, () => page.locator('.cart-code-form').first().getByRole('button', {name: 'Apply', exact: true}).click());
  await expect(page.getByText('“CODEX-INVALID-STORE-CODE” does not apply to this bag.')).toBeVisible();
  const handover = await page.request.post('/checkout', {maxRedirects: 0});
  expect(handover.status()).toBe(303);
  const authoritativeUrl = new URL(result.cart.checkoutUrl);
  const checkoutUrl = new URL(handover.headers().location);
  // Shopify refreshes the checkout key on reads; the authoritative cart path remains stable.
  expect(`${checkoutUrl.origin}${checkoutUrl.pathname}`).toBe(`${authoritativeUrl.origin}${authoritativeUrl.pathname}`);
  expect(checkoutUrl.searchParams.has('key')).toBe(true);
  expect(handover.headers()['cache-control']).toContain('private');
});

test('multiple products can be removed without inventing totals; empty checkout is guarded', async ({page}) => {
  const products = await availableProducts(page, 2);
  for (const product of products) {
    const variant = product.variants.nodes.find((variant) => variant.availableForSale)!;
    const response = await page.request.post('/cart', {form: {cartFormInput: JSON.stringify({action: 'LinesAdd', inputs: {lines: [{merchandiseId: variant.id, quantity: 1}]}})}});
    expect(response.status()).toBe(200);
    expect((await readCart(page)).success).toBe(true);
  }
  await page.goto('/cart');
  await expect(page.locator('.cart-line-title')).toHaveCount(2);
  const result = await cartMutation(page, () => page.getByRole('button', {name: `Remove ${products[0].title}`, exact: true}).click());
  expect(result.cart.totalQuantity).toBe(1);
  await expect(page.locator('.cart-line-title')).toHaveCount(1);
  const removeResponse = page.waitForResponse((response) => new URL(response.url()).pathname === '/cart.data' && response.request().method() === 'POST');
  await page.getByRole('button', {name: `Remove ${products[1].title}`, exact: true}).click();
  await removeResponse;
  await expect(page.getByRole('heading', {name: 'Your bag awaits.'})).toBeVisible();
  expect((await readCart(page)).cart.totalQuantity).toBe(0);
  const emptyCheckout = await page.request.post('/checkout', {maxRedirects: 0});
  expect(emptyCheckout.status()).toBe(422);
  expect(emptyCheckout.headers().location).toBeUndefined();
  expect(await emptyCheckout.text()).toContain('Your bag is empty');
});

test('quick view traps focus, restores it, and rejects an invalid variant deep link', async ({page}) => {
  const [product] = await availableProducts(page);
  const trigger = page.getByRole('button', {name: `Quick view ${product.title}`, exact: true});
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', {name: product.title})).toBeVisible();
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => document.activeElement?.closest('dialog') !== null)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await page.goto(`/products/${product.handle}?variant=999999999999999999`);
  await expect(page.getByRole('alert')).toContainText('That selection is no longer available');
  await expect(page.locator('.pdp-details').getByRole('button', {name: 'Unavailable', exact: true})).toBeDisabled();
  await page.getByRole('link', {name: 'View available selections'}).click();
  await expect(page.locator('.pdp-details').getByRole('button', {name: 'Add to bag', exact: true})).toBeEnabled();
  await page.locator('.product-image-zoom').click();
  await expect(page.getByRole('dialog').getByRole('heading', {name: 'A closer look'})).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.product-image-zoom')).toBeFocused();
});

test('mobile buying surfaces remain inside the viewport at 320, 390 and 430 pixels', async ({page}) => {
  const [product] = await availableProducts(page);
  for (const width of [320, 390, 430]) {
    await page.setViewportSize({width, height: 844});
    await page.goto(`/products/${product.handle}`);
    await expect(page.locator('.pdp-details h1')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.locator('.product-accordions').scrollIntoViewIfNeeded();
    const button = page.locator('.pdp-details').getByRole('button', {name: 'Add to bag', exact: true});
    await expect(button).toBeEnabled();
    await page.locator('footer').scrollIntoViewIfNeeded();
    await expect(page.locator('.mobile-purchase-bar')).toBeVisible();
    await expect(page.locator('.mobile-purchase-bar').getByRole('button', {name: 'Add to bag', exact: true})).toBeEnabled();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test('native forms can buy without JavaScript and invalid quantities surface a server error', async ({browser}) => {
  const context = await browser.newContext({javaScriptEnabled: false, baseURL: 'http://localhost:3000'});
  const page = await context.newPage();
  const [product] = await availableProducts(page);
  const variant = product.variants.nodes.find((variant) => variant.availableForSale)!;
  await page.goto(`/products/${product.handle}`);
  await page.locator('.pdp-details').getByRole('button', {name: 'Add to bag', exact: true}).click();
  await expect(page).toHaveURL(/\/cart$/);
  await expect(page.locator('.cart-line-title')).toContainText(product.title);
  const invalid = await page.request.post('/cart', {form: {cartFormInput: JSON.stringify({action: 'LinesAdd', inputs: {lines: [{merchandiseId: variant.id, quantity: 0}]}})}});
  expect(invalid.status()).toBe(400);
  expect(await invalid.text()).toContain('Choose an available product and a quantity between 1 and 99.');
  expect((await readCart(page)).cart.totalQuantity).toBe(1);
  await context.close();
});
