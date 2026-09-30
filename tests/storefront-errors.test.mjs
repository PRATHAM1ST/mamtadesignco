import {test} from 'node:test';
import assert from 'node:assert/strict';
import {assertStorefrontSuccess, assertStorefrontResponse} from '../app/lib/storefront-errors.ts';

test('GraphQL partial errors become a recoverable failure instead of successful data', (context) => {
  const log = context.mock.method(console, 'error', () => {});
  assert.throws(() => assertStorefrontSuccess([{message: 'Unable to retrieve catalog'}], 'Catalog'), (error) => error instanceof Response && error.status === 502);
  assert.equal(log.mock.callCount(), 1);
  assert.deepEqual(log.mock.calls[0].arguments, ['Storefront operation failed: Catalog', ['Unable to retrieve catalog']]);
});

test('valid responses continue without logging errors', (context) => {
  const log = context.mock.method(console, 'error', () => {});
  assert.doesNotThrow(() => assertStorefrontSuccess(undefined, 'Catalog'));
  assert.doesNotThrow(() => assertStorefrontResponse([], 'Catalog'));
  assert.equal(log.mock.callCount(), 0);
});
