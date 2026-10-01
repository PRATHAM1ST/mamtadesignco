import {test} from 'node:test';
import assert from 'node:assert/strict';
import {reviewContent, promotionContent} from '../app/lib/storefront-content.ts';
import {routeSeo} from '../app/lib/seo.ts';

const fields = (values) => Object.entries(values).map(([key, value]) => ({key, value}));

test('published review content requires a real author and text; ratings are bounded', () => {
  assert.equal(reviewContent(fields({customer_name: '   ', review: 'Lovely'})), null);
  assert.equal(reviewContent(fields({customer_name: 'Customer'})), null);
  assert.deepEqual(reviewContent(fields({customer_name: ' Customer ', review: ' Lovely ', rating: '5'})), {name: 'Customer', body: 'Lovely', rating: 5});
  for (const rating of ['0', '6', '-1', '4.5', 'invalid', '']) {
    assert.equal(reviewContent(fields({customer_name: 'Customer', review: 'Lovely', rating})).rating, null);
  }
});

test('promotions are shown only inside valid merchant-supplied dates', () => {
  const now = Date.parse('2026-10-01T12:00:00Z');
  const offer = {offer_title: 'Festive offer', offer_code: 'EXAMPLE', offer_terms: 'Selected pieces only'};
  assert.equal(promotionContent([], now), null);
  assert.deepEqual(promotionContent(fields(offer), now), {title: 'Festive offer', code: 'EXAMPLE', terms: 'Selected pieces only'});
  for (const dates of [{offer_starts_at: '2026-10-02'}, {offer_ends_at: '2026-10-01T12:00:00Z'}, {offer_starts_at: 'invalid'}, {offer_ends_at: 'invalid'}]) {
    assert.equal(promotionContent(fields({...offer, ...dates}), now), null);
  }
});

test('sharing images use absolute URLs, compact Shopify JPEGs, and truthful dimensions', () => {
  const find = (meta, key) => meta.find((item) => item.property === key)?.content;
  const home = routeSeo({title: 'Mamta Design Co.', url: 'https://store.example/'});
  assert.equal(find(home, 'og:image'), 'https://store.example/og-image.jpg');
  assert.equal(find(home, 'og:image:width'), '1200');
  const product = routeSeo({title: 'Piece', url: 'https://store.example/products/piece', image: {url: 'https://cdn.shopify.com/s/files/photo.png?v=2', width: 1792, height: 2400}});
  const image = new URL(find(product, 'og:image'));
  assert.equal(image.searchParams.get('width'), '1000');
  assert.equal(image.searchParams.get('format'), 'jpg');
  assert.equal(image.searchParams.get('v'), '2');
  assert.equal(find(product, 'og:image:type'), 'image/jpeg');
  assert.equal(find(product, 'og:image:width'), undefined);
  assert.equal(find(routeSeo({title: 'Piece', url: 'https://store.example/', image: '//images.example/photo.jpg'}), 'og:image'), 'https://images.example/photo.jpg');
  assert.equal(find(routeSeo({title: 'Piece', image: '/relative.png'}), 'og:image'), undefined);
  assert.equal(find(routeSeo({title: 'Piece', url: 'https://store.example/', image: 'javascript:alert(1)'}), 'og:image'), undefined);
});
