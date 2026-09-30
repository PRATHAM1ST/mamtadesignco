const domain = process.env.PUBLIC_STORE_DOMAIN;
if (!domain) throw new Error('PUBLIC_STORE_DOMAIN is missing');
const query = `{ shop { name description primaryDomain { url } shippingPolicy { title body } refundPolicy { title body } privacyPolicy { title } termsOfService { title } } products(first:3) { nodes { title handle description options { name optionValues { name } } variants(first:3) { nodes { id availableForSale price { amount currencyCode } } } images(first:3) { nodes { url width height } } } } pages(first:10) { nodes { handle title body } } blogs(first:10) { nodes { handle title } } }`;
const response = await fetch(`https://${domain}/api/2026-01/graphql.json`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': process.env.PUBLIC_STOREFRONT_API_TOKEN || ''},
  body: JSON.stringify({query}),
});
process.stdout.write(`Storefront status: ${response.status}\n`);
process.stdout.write(JSON.stringify(await response.json(), null, 2) + '\n');
