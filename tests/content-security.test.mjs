import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sanitizeShopifyHtml} from '../app/lib/html.ts';
import {jsonLd, routeSeo} from '../app/lib/seo.ts';
import {integrationEnabled, validEmail, sameOriginRequest, submitIntegration} from '../app/lib/integrations.server.ts';
import {privateAccountRequest} from '../app/lib/account-private.server.ts';

test('merchant HTML keeps semantic content while removing executable markup', () => {
  const cleaned = sanitizeShopifyHtml('<h2>Garment care</h2><p><strong>Cold wash</strong></p><script>alert(1)</script><img src="https://cdn.shopify.com/a.jpg" onerror="alert(2)"><a href="javascript:alert(3)">Details</a><iframe src="https://bad.example"></iframe>');
  assert.match(cleaned, /<h2>Garment care<\/h2>/);
  assert.match(cleaned, /<strong>Cold wash<\/strong>/);
  assert.doesNotMatch(cleaned, /script|onerror|javascript|iframe|alert\(/);
});

test('structured data cannot close a script element through merchant content', () => {
  const serialized = jsonLd({name: '</script><script>alert(1)</script>'});
  assert.doesNotMatch(serialized, /</);
  assert.deepEqual(JSON.parse(serialized), {name: '</script><script>alert(1)</script>'});
});

test('route SEO canonical removes visitor and UI state parameters', () => {
  const meta = routeSeo({title: 'Our journal', url: 'https://example.com/blogs/news?utm_source=mail#story', noindex: true});
  assert.deepEqual(meta.find(item => 'tagName' in item), {tagName: 'link', rel: 'canonical', href: 'https://example.com/blogs/news'});
  assert.ok(meta.some(item => 'name' in item && item.name === 'robots' && item.content === 'noindex, nofollow'));
});

test('forms require configured HTTPS integrations and valid bounded emails', () => {
  assert.equal(integrationEnabled(undefined), false);
  assert.equal(integrationEnabled('http://example.com'), false);
  assert.equal(integrationEnabled('https://example.com/contact'), true);
  assert.equal(validEmail('hello@example.com'), true);
  assert.equal(validEmail('invalid address'), false);
  assert.equal(validEmail(`${'a'.repeat(255)}@example.com`), false);
});

test('cross-origin form submissions are rejected', () => {
  assert.equal(sameOriginRequest(new Request('https://shop.example/contact', {headers: {Origin: 'https://evil.example'}})), false);
  assert.equal(sameOriginRequest(new Request('https://shop.example/contact', {headers: {Origin: 'https://shop.example'}})), true);
});

test('a form success requires explicit backend acknowledgement', async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response(JSON.stringify({success: false}), {status: 200});
    assert.equal(await submitIntegration({endpoint: 'https://provider.example/form'}, {email: 'hello@example.com'}), false);
    globalThis.fetch = async () => new Response(JSON.stringify({success: true}), {status: 200});
    assert.equal(await submitIntegration({endpoint: 'https://provider.example/form'}, {email: 'hello@example.com'}), true);
    globalThis.fetch = async () => new Response(JSON.stringify({success: true}), {status: 500});
    assert.equal(await submitIntegration({endpoint: 'https://provider.example/form'}, {email: 'hello@example.com'}), false);
    assert.equal(await submitIntegration({}, {email: 'hello@example.com'}), false);
  } finally { globalThis.fetch = originalFetch; }
});

test('returned and thrown OAuth redirects always prohibit public caching', async () => {
  const returned = await privateAccountRequest(Promise.resolve(new Response(null, {status: 302, headers: {Location: '/account/login'}})));
  assert.equal(returned.headers.get('Cache-Control'), 'private, no-store');
  const thrown = new Response(null, {status: 302, headers: {Location: '/account/login'}});
  await assert.rejects(privateAccountRequest(Promise.reject(thrown)), error => error instanceof Response && error.headers.get('Cache-Control') === 'private, no-store');
});
