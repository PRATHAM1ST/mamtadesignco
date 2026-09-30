# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: commerce.spec.ts >> quick view traps focus, restores it, and rejects an invalid variant deep link
- Location: tests\commerce.spec.ts:99:1

# Error details

```
Error: expect(locator).toBeFocused() failed

Locator:  getByRole('button', { name: 'Quick view Gulabi Zari Chaniya', exact: true })
Expected: focused
Received: inactive
Timeout:  10000ms

Call log:
  - Expect "toBeFocused" getByRole('button', { name: 'Quick view Gulabi Zari Chaniya', exact: true }) with timeout 10000ms
  - waiting for getByRole('button', { name: 'Quick view Gulabi Zari Chaniya', exact: true })
    23 × locator resolved to <button type="button" class="card-quick-view" aria-label="Quick view Gulabi Zari Chaniya">…</button>
       - unexpected value "inactive"

```

```yaml
- button "Quick view Gulabi Zari Chaniya": Quick view
```

# Test source

```ts
  9   |   const handles = await page.locator('.product-item a[href^="/products/"]').evaluateAll((links) => [...new Set(links.map((link) => new URL((link as HTMLAnchorElement).href).pathname.split('/').pop()))]);
  10  |   const products: Product[] = [];
  11  |   for (const handle of handles) {
  12  |     if (!handle) continue;
  13  |     const response = await page.request.get(`/api/product?handle=${encodeURIComponent(handle)}`);
  14  |     expect(response.ok()).toBeTruthy();
  15  |     const result = await response.json() as {product: Product};
  16  |     if (result.product.variants.nodes.some((variant) => variant.availableForSale)) products.push(result.product);
  17  |     if (products.length === count) break;
  18  |   }
  19  |   expect(products.length, 'The connected catalogue must have enough available products to exercise checkout').toBe(count);
  20  |   return products;
  21  | }
  22  | 
  23  | async function cartMutation(page: Page, action: () => Promise<void>): Promise<Mutation> {
  24  |   const responsePromise = page.waitForResponse((response) => new URL(response.url()).pathname === '/cart.data' && response.request().method() === 'POST');
  25  |   await action();
  26  |   // React Router .data responses use single-fetch serialization. Verify the same
  27  |   // authoritative cart through its private snapshot instead of parsing that format.
  28  |   await responsePromise;
  29  |   await expect(page.getByRole('button', {name: 'Continue to checkout', exact: true}).last()).toBeEnabled();
  30  |   return readCart(page);
  31  | }
  32  | 
  33  | async function readCart(page: Page) {
  34  |   const response = await page.request.get('/api/cart');
  35  |   expect(response.status()).toBe(200);
  36  |   const result = await response.json() as Mutation;
  37  |   expect(result.success).toBe(true);
  38  |   expect(result.errors || []).toEqual([]);
  39  |   return result;
  40  | }
  41  | 
  42  | function money(amount: string, currency: string) {
  43  |   return new Intl.NumberFormat('en-IN', {style: 'currency', currency, maximumFractionDigits: 0}).format(Number(amount));
  44  | }
  45  | 
  46  | test('real product purchase reconciles quantities, Shopify totals, discounts and hosted checkout', async ({page}) => {
  47  |   const [product] = await availableProducts(page);
  48  |   const variant = product.variants.nodes.find((variant) => variant.availableForSale)!;
  49  |   await page.goto(`/products/${product.handle}?variant=${variant.id.split('/').pop()}`);
  50  |   await expect(page.getByRole('heading', {level: 1, name: product.title})).toBeVisible();
  51  |   const addResponse = page.waitForResponse((response) => new URL(response.url()).pathname === '/cart.data' && response.request().method() === 'POST');
  52  |   await page.locator('.pdp-details').getByRole('button', {name: 'Add to bag', exact: true}).click();
  53  |   await addResponse;
  54  |   await expect(page.getByRole('dialog').getByRole('heading', {name: /bag/i})).toBeVisible();
  55  |   await page.getByRole('dialog').getByRole('button', {name: 'Close dialog'}).click();
  56  |   await page.goto('/cart');
  57  |   const result = await cartMutation(page, () => page.getByRole('button', {name: `Increase quantity of ${product.title}`}).click());
  58  |   expect(result.cart.totalQuantity).toBe(2);
  59  |   await expect(page.locator('.cart-quantity output').first()).toHaveText('2');
  60  |   await expect(page.locator('.cart-subtotal dd').first()).toContainText(money(result.cart.cost.subtotalAmount.amount, result.cart.cost.subtotalAmount.currencyCode));
  61  |   await expect(page.locator('.cart-line-total').first()).toContainText(money(result.cart.lines.nodes[0].cost.totalAmount.amount, result.cart.lines.nodes[0].cost.totalAmount.currencyCode));
  62  |   await page.getByLabel('Discount code', {exact: true}).fill('CODEX-INVALID-STORE-CODE');
  63  |   await cartMutation(page, () => page.locator('.cart-code-form').first().getByRole('button', {name: 'Apply', exact: true}).click());
  64  |   await expect(page.getByText('“CODEX-INVALID-STORE-CODE” does not apply to this bag.')).toBeVisible();
  65  |   const handover = await page.request.post('/checkout', {maxRedirects: 0});
  66  |   expect(handover.status()).toBe(303);
  67  |   const authoritativeUrl = new URL(result.cart.checkoutUrl);
  68  |   const checkoutUrl = new URL(handover.headers().location);
  69  |   // Shopify refreshes the checkout key on reads; the authoritative cart path remains stable.
  70  |   expect(`${checkoutUrl.origin}${checkoutUrl.pathname}`).toBe(`${authoritativeUrl.origin}${authoritativeUrl.pathname}`);
  71  |   expect(checkoutUrl.searchParams.has('key')).toBe(true);
  72  |   expect(handover.headers()['cache-control']).toContain('private');
  73  | });
  74  | 
  75  | test('multiple products can be removed without inventing totals; empty checkout is guarded', async ({page}) => {
  76  |   const products = await availableProducts(page, 2);
  77  |   for (const product of products) {
  78  |     const variant = product.variants.nodes.find((variant) => variant.availableForSale)!;
  79  |     const response = await page.request.post('/cart', {form: {cartFormInput: JSON.stringify({action: 'LinesAdd', inputs: {lines: [{merchandiseId: variant.id, quantity: 1}]}})}});
  80  |     expect(response.status()).toBe(200);
  81  |     expect((await readCart(page)).success).toBe(true);
  82  |   }
  83  |   await page.goto('/cart');
  84  |   await expect(page.locator('.cart-line-title')).toHaveCount(2);
  85  |   const result = await cartMutation(page, () => page.getByRole('button', {name: `Remove ${products[0].title}`, exact: true}).click());
  86  |   expect(result.cart.totalQuantity).toBe(1);
  87  |   await expect(page.locator('.cart-line-title')).toHaveCount(1);
  88  |   const removeResponse = page.waitForResponse((response) => new URL(response.url()).pathname === '/cart.data' && response.request().method() === 'POST');
  89  |   await page.getByRole('button', {name: `Remove ${products[1].title}`, exact: true}).click();
  90  |   await removeResponse;
  91  |   await expect(page.getByRole('heading', {name: 'Your bag awaits.'})).toBeVisible();
  92  |   expect((await readCart(page)).cart.totalQuantity).toBe(0);
  93  |   const emptyCheckout = await page.request.post('/checkout', {maxRedirects: 0});
  94  |   expect(emptyCheckout.status()).toBe(422);
  95  |   expect(emptyCheckout.headers().location).toBeUndefined();
  96  |   expect(await emptyCheckout.text()).toContain('Your bag is empty');
  97  | });
  98  | 
  99  | test('quick view traps focus, restores it, and rejects an invalid variant deep link', async ({page}) => {
  100 |   const [product] = await availableProducts(page);
  101 |   const trigger = page.getByRole('button', {name: `Quick view ${product.title}`, exact: true});
  102 |   await trigger.click();
  103 |   const dialog = page.getByRole('dialog');
  104 |   await expect(dialog.getByRole('heading', {name: product.title})).toBeVisible();
  105 |   await page.keyboard.press('Tab');
  106 |   expect(await page.evaluate(() => document.activeElement?.closest('dialog') !== null)).toBe(true);
  107 |   await page.keyboard.press('Escape');
  108 |   await expect(dialog).not.toBeVisible();
> 109 |   await expect(trigger).toBeFocused();
      |                         ^ Error: expect(locator).toBeFocused() failed
  110 |   await page.goto(`/products/${product.handle}?variant=999999999999999999`);
  111 |   await expect(page.getByRole('alert')).toContainText('That selection is no longer available');
  112 |   await expect(page.locator('.pdp-details').getByRole('button', {name: 'Unavailable', exact: true})).toBeDisabled();
  113 |   await page.getByRole('link', {name: 'View available selections'}).click();
  114 |   await expect(page.locator('.pdp-details').getByRole('button', {name: 'Add to bag', exact: true})).toBeEnabled();
  115 |   await page.locator('.product-image-zoom').click();
  116 |   await expect(page.getByRole('dialog').getByRole('heading', {name: 'A closer look'})).toBeVisible();
  117 |   await page.keyboard.press('Escape');
  118 |   await expect(page.locator('.product-image-zoom')).toBeFocused();
  119 | });
  120 | 
  121 | test('mobile buying surfaces remain inside the viewport at 320, 390 and 430 pixels', async ({page}) => {
  122 |   const [product] = await availableProducts(page);
  123 |   for (const width of [320, 390, 430]) {
  124 |     await page.setViewportSize({width, height: 844});
  125 |     await page.goto(`/products/${product.handle}`);
  126 |     await expect(page.locator('.pdp-details h1')).toBeVisible();
  127 |     expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  128 |     await page.locator('.product-accordions').scrollIntoViewIfNeeded();
  129 |     const button = page.locator('.pdp-details').getByRole('button', {name: 'Add to bag', exact: true});
  130 |     await expect(button).toBeEnabled();
  131 |   }
  132 | });
  133 | 
```