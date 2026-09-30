# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: commerce.spec.ts >> mobile buying surfaces remain inside the viewport at 320, 390 and 430 pixels
- Location: tests\commerce.spec.ts:121:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.mobile-purchase-bar')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('.mobile-purchase-bar') with timeout 10000ms
  - waiting for locator('.mobile-purchase-bar')

```

```yaml
- link "Skip to content":
  - /url: "#main-content"
- banner:
  - button "Open navigation"
  - link "Mamta Design Co home":
    - /url: /
    - text: MAMTA DESIGN CO.
  - navigation "Your account and shopping bag":
    - link "Search":
      - /url: /search
    - link "Shopping bag":
      - /url: /cart
- main:
  - navigation "Breadcrumb":
    - link "Shop":
      - /url: /shop
    - text: Gulabi Zari Chaniya
  - region "Gulabi Zari Chaniya gallery":
    - button "Enlarge image 1 of Gulabi Zari Chaniya":
      - img "Gulabi Zari Chaniya"
    - button "Previous product image": ←
    - text: 1 of 4
    - button "Next product image": →
    - button "View image 1" [pressed]
    - button "View image 2"
    - button "View image 3"
    - button "View image 4"
  - paragraph: Mamtadesignco.
  - heading "Gulabi Zari Chaniya" [level=1]
  - text: ₹4,299.00 Original price ₹6,499.00
  - paragraph: Shipping and applicable taxes calculated at checkout.
  - status: Available to order
  - button "Add to bag"
  - paragraph: Continue securely with Shopify Checkout.
  - group:
    - text: The piece
    - heading "Gulabi Zari Chaniya" [level=2]
    - paragraph:
      - strong: What’s Included
      - text: • 1 Chaniya • 1 Matching Dupatta •
      - strong: Blouse is not included
    - paragraph:
      - text: A graceful expression of traditional Indian craftsmanship, the
      - strong: Gulabi Zari Chaniya
      - text: features a soft dusty-pink base complemented by delicate antique-gold zari detailing.
    - paragraph: The flowing silhouette and elegant pleats create beautiful movement, while the traditional zari border adds a refined festive finish. The soft pink tone keeps the look graceful and versatile, making it easy to style for both traditional and contemporary occasions.
    - paragraph:
      - text: The set is paired with a
      - strong: matching blush-pink dupatta
      - text: ", finished with golden edging and delicate tassel details for a beautifully coordinated look."
    - heading "Product Details" [level=3]
    - paragraph:
      - strong: "Colour:"
      - text: Dusty Pink / Blush Pink
      - strong: "Work:"
      - text: Antique-Gold Zari Detailing
      - strong: "Silhouette:"
      - text: Flowing, Pleated Chaniya
      - strong: "Dupatta:"
      - text: Matching Pink with Golden Edging & Tassel Details
      - strong: "Style:"
      - text: Traditional Indian Festive Wear
    - heading "Perfect For" [level=3]
    - paragraph:
      - text: Ideal for
      - strong: Navratri, Garba nights, festive celebrations, weddings, family functions and traditional occasions
      - text: .
    - heading "Styling" [level=3]
    - paragraph:
      - text: Pair the chaniya with a blouse in
      - strong: pink, ivory, champagne, gold or a contrasting festive shade
      - text: . Complete the look with jhumkas, bangles, a potli and traditional footwear for a classic festive appearance.
    - paragraph: For a more contemporary look, keep the jewellery minimal and let the zari detailing and flowing silhouette stand out.
    - heading "Please Note" [level=3]
    - paragraph:
      - text: This product includes
      - strong: one chaniya and one matching dupatta
      - text: .
    - paragraph:
      - strong: Blouse is not included.
    - paragraph: Colours may appear slightly different depending on your screen, lighting and photography conditions.
    - paragraph:
      - text: Please review the available
      - strong: size and product details carefully before placing your order
      - text: .
    - paragraph: For information regarding shipping, returns and exchanges, please refer to our store policies.
    - paragraph:
      - strong: Gulabi Zari Chaniya
      - emphasis: Soft pink. Timeless zari. Made for festive moments.
    - paragraph
  - group: Delivery
  - group: Returns & exchanges
- contentinfo:
  - paragraph: MAMTA DESIGN CO.
  - heading "For the nights you remember." [level=2]
  - link "Find your Chaniya ↗":
    - /url: /shop
  - navigation "Explore the store":
    - paragraph: EXPLORE
    - link "Shop all":
      - /url: /shop
    - link "The catalogue":
      - /url: /catalogue
    - link "Collections":
      - /url: /collections
    - link "Journal":
      - /url: /blogs
    - link "Your favorites":
      - /url: /favorites
  - navigation "Customer care":
    - paragraph: HERE FOR YOU
    - link "Your account":
      - /url: /account
    - link "Contact":
      - /url: /contact
    - link "Store policies":
      - /url: /policies
    - link "Search":
      - /url: /search
  - text: © 2026 Mamta Design Co India · English Secure checkout by Shopify
```

# Test source

```ts
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
  109 |   await expect(trigger).toBeFocused();
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
  131 |     await page.locator('footer').scrollIntoViewIfNeeded();
> 132 |     await expect(page.locator('.mobile-purchase-bar')).toBeVisible();
      |                                                        ^ Error: expect(locator).toBeVisible() failed
  133 |     await expect(page.locator('.mobile-purchase-bar').getByRole('button', {name: 'Add to bag', exact: true})).toBeEnabled();
  134 |     expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  135 |   }
  136 | });
  137 | 
  138 | test('native forms can buy without JavaScript and invalid quantities surface a server error', async ({browser}) => {
  139 |   const context = await browser.newContext({javaScriptEnabled: false, baseURL: 'http://localhost:3000'});
  140 |   const page = await context.newPage();
  141 |   const [product] = await availableProducts(page);
  142 |   const variant = product.variants.nodes.find((variant) => variant.availableForSale)!;
  143 |   await page.goto(`/products/${product.handle}`);
  144 |   await page.locator('.pdp-details').getByRole('button', {name: 'Add to bag', exact: true}).click();
  145 |   await expect(page).toHaveURL(/\/cart$/);
  146 |   await expect(page.locator('.cart-line-title')).toContainText(product.title);
  147 |   const invalid = await page.request.post('/cart', {form: {cartFormInput: JSON.stringify({action: 'LinesAdd', inputs: {lines: [{merchandiseId: variant.id, quantity: 0}]}})}});
  148 |   expect(invalid.status()).toBe(400);
  149 |   expect(await invalid.text()).toContain('Choose an available product and a quantity between 1 and 99.');
  150 |   expect((await readCart(page)).cart.totalQuantity).toBe(1);
  151 |   await context.close();
  152 | });
  153 | 
```