import {test} from 'node:test';
import assert from 'node:assert/strict';
import {
  clearFiltersUrl,
  filterParam,
  getCollectionSort,
  getSearchSort,
  parseProductFilters,
  toggleFilterUrl,
} from '../app/lib/filters.ts';

test('filter changes preserve search, attribution and sort while resetting pagination', () => {
  const current = new URLSearchParams('q=mirror+work&sort=price-low&cursor=stale&direction=next&articles_cursor=stale-content&utm_source=campaign');
  const result = new URL(toggleFilterUrl('/shop', current, 'filter.option.Color', 'Peacock'), 'https://example.com');
  assert.equal(result.searchParams.get('q'), 'mirror work');
  assert.equal(result.searchParams.get('sort'), 'price-low');
  assert.equal(result.searchParams.get('utm_source'), 'campaign');
  assert.equal(result.searchParams.get('filter.option.Color'), 'Peacock');
  assert.equal(result.searchParams.has('cursor'), false);
  assert.equal(result.searchParams.has('direction'), false);
  assert.equal(result.searchParams.has('articles_cursor'), false);
  assert.equal(current.get('cursor'), 'stale');
});

test('individual filter removal preserves other selections', () => {
  const current = new URLSearchParams('filter.option.Color=Red&filter.option.Color=Blue&filter.available=true');
  const result = new URL(toggleFilterUrl('/shop', current, 'filter.option.Color', 'Red'), 'https://example.com');
  assert.deepEqual(result.searchParams.getAll('filter.option.Color'), ['Blue']);
  assert.equal(result.searchParams.get('filter.available'), 'true');
});

test('clear all removes filters and stale cursors without dropping meaningful parameters', () => {
  const current = new URLSearchParams('q=chaniya&sort=price-high&filter.available=true&filter.price.min=1500&cursor=stale');
  const result = new URL(clearFiltersUrl('/search', current), 'https://example.com');
  assert.equal(result.searchParams.get('q'), 'chaniya');
  assert.equal(result.searchParams.get('sort'), 'price-high');
  assert.equal(Array.from(result.searchParams.keys()).some((key) => key.startsWith('filter.')), false);
  assert.equal(result.searchParams.has('cursor'), false);
});

test('server filter parsing validates price bounds and limits request complexity', () => {
  assert.deepEqual(parseProductFilters(new URLSearchParams('filter.price.min=1000.50&filter.price.max=4000&filter.available=true')), [{available: true}, {price: {min: 1000.5, max: 4000}}]);
  for (const invalid of ['filter.price.min=-1', 'filter.price.max=Infinity', 'filter.price.min=5000&filter.price.max=1000']) {
    assert.throws(() => parseProductFilters(new URLSearchParams(invalid)), (error) => error instanceof Response && error.status === 400);
  }
  const excessive = new URLSearchParams();
  for (let index = 0; index < 25; index++) excessive.append('filter.tag', `tag-${index}`);
  assert.throws(() => parseProductFilters(excessive), (error) => error instanceof Response && error.status === 400);
});

test('Shopify option and metafield filters round-trip through readable URLs', () => {
  for (const input of [{variantOption: {name: 'Color', value: 'Peacock'}}, {productMetafield: {namespace: 'custom', key: 'fabric', value: 'Cotton'}}, {available: false}, {category: {id: 'gid://shopify/TaxonomyCategory/aa'}}]) {
    const parameter = filterParam(JSON.stringify(input));
    assert.ok(parameter);
    assert.deepEqual(parseProductFilters(new URLSearchParams([parameter])), [input]);
  }
  assert.equal(filterParam('invalid JSON'), null);
});

test('catalog and collection sort use supported authoritative Shopify keys', () => {
  assert.deepEqual(getSearchSort('price-high'), {sortKey: 'PRICE', reverse: true});
  assert.deepEqual(getSearchSort('unsupported'), {sortKey: 'RELEVANCE', reverse: false});
  assert.deepEqual(getSearchSort('price-unsupported'), {sortKey: 'RELEVANCE', reverse: false});
  assert.deepEqual(getCollectionSort('newest'), {sortKey: 'CREATED', reverse: true});
  assert.deepEqual(getCollectionSort('best-selling'), {sortKey: 'BEST_SELLING', reverse: false});
});
