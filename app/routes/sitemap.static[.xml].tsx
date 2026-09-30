import type {Route} from './+types/sitemap.static[.xml]';
import {assertStorefrontResponse} from '~/lib/storefront-errors';

export async function loader({request, context}: Route.LoaderArgs) {
  const origin = new URL(request.url).origin.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const {shop, errors} = await context.storefront.query(SITEMAP_POLICIES_QUERY, {cache: context.storefront.CacheLong()});
  assertStorefrontResponse(errors, 'Policy sitemap');
  const paths = ['/', '/shop', '/catalogue', '/collections', '/collections/all', '/blogs', '/contact', '/faq', '/policies'];
  for (const policy of [shop.shippingPolicy, shop.refundPolicy, shop.privacyPolicy, shop.termsOfService, shop.subscriptionPolicy]) {
    if (policy?.handle) paths.push(`/policies/${policy.handle}`);
  }
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path => `<url><loc>${origin}${path}</loc></url>`).join('')}</urlset>`, {headers: {'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600'}});
}

const SITEMAP_POLICIES_QUERY = `#graphql
  query SitemapPolicies($country:CountryCode,$language:LanguageCode) @inContext(country:$country,language:$language) {
    shop {shippingPolicy {handle} refundPolicy {handle} privacyPolicy {handle} termsOfService {handle} subscriptionPolicy {handle}}
  }
` as const;
