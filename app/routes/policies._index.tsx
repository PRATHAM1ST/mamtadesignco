import {assertStorefrontResponse} from '~/lib/storefront-errors';
import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/policies._index';
import {useNonce} from '@shopify/hydrogen';
import {routeSeo, jsonLd, breadcrumbJsonLd} from '~/lib/seo';

export const meta: Route.MetaFunction = ({data}) =>
  routeSeo({
    title: 'Customer Care & Store Policies · Mamta Design Co.',
    description:
      'Review policies for worldwide shipping, express delivery, returns, exchanges, and privacy for Mamta Design Co orders.',
    url: data?.url,
    keywords: [
      'Mamta Design Co Policies',
      'Shipping Policy',
      'Returns & Exchanges',
      'Privacy Policy',
      'Terms of Service',
    ],
  });
export async function loader({context, request}: Route.LoaderArgs) {
  const {shop, errors} = await context.storefront.query(POLICIES_QUERY, {cache: context.storefront.CacheLong()});
  assertStorefrontResponse(errors, 'Content');
  return {policies: [shop.shippingPolicy, shop.refundPolicy, shop.privacyPolicy, shop.termsOfService, shop.subscriptionPolicy].filter(policy => policy != null), url: request.url};
}
export default function Policies() {
  const {policies, url} = useLoaderData<typeof loader>();
  const nonce = useNonce();
  const origin = new URL(url).origin;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Customer Care & Store Policies · Mamta Design Co.',
        description: 'Store policies covering shipping, returns, and terms for Mamta Design Co.',
        url,
      },
      breadcrumbJsonLd([
        {name: 'Home', url: origin},
        {name: 'Policies', url},
      ]),
    ],
  };
  return (
    <div className="content-shell policies">
      <header className="content-heading">
        <p className="eyebrow">Customer care</p>
        <h1>The finer details.</h1>
        <p>Everything you need to know before your next celebration.</p>
      </header>
      <div className="policy-links">
        {policies.map((policy, index) => (
          <Link key={policy.id} to={`/policies/${policy.handle}`}>
            <span className="eyebrow">{String(index + 1).padStart(2, '0')}</span>
            <h2>{policy.title}</h2>
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
      {!policies.length && (
        <div className="content-empty">
          <p>Store policies will be published here.</p>
          <Link to="/contact">Contact us →</Link>
        </div>
      )}
      <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{__html: jsonLd(structuredData)}} />
    </div>
  );
}
const POLICIES_QUERY = `#graphql
  fragment PolicyItem on ShopPolicy {id title handle}
  query Policies($country:CountryCode,$language:LanguageCode) @inContext(country:$country,language:$language) {
    shop {privacyPolicy {...PolicyItem} shippingPolicy {...PolicyItem} termsOfService {...PolicyItem} refundPolicy {...PolicyItem} subscriptionPolicy {id title handle}}
  }
` as const;


