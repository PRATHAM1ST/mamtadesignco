import {assertStorefrontResponse} from '~/lib/storefront-errors';
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/policies.$handle';
import {useNonce} from '@shopify/hydrogen';
import {routeSeo, jsonLd, breadcrumbJsonLd} from '~/lib/seo';
import {sanitizeHtml, plainText} from '~/lib/html';

const policyNames = {
  'privacy-policy': 'privacyPolicy',
  'shipping-policy': 'shippingPolicy',
  'terms-of-service': 'termsOfService',
  'refund-policy': 'refundPolicy',
  'subscription-policy': 'subscriptionPolicy',
} as const;
export const meta: Route.MetaFunction = ({data}) =>
  routeSeo({
    title: `${data?.policy.title || 'Policies'} · Customer Care`,
    description:
      plainText(data?.policy.body).slice(0, 160) ||
      `${data?.policy.title} for orders, shipping and returns at Mamta Design Co.`,
    url: data?.url,
    keywords: [
      data?.policy.title || 'Store Policy',
      'Mamta Design Co Policies',
      'Customer Care',
      'Delivery & Returns',
    ],
  });
export async function loader({params, context, request}: Route.LoaderArgs) {
  const handle = params.handle || '';
  if (!(handle in policyNames)) throw new Response('Policy not found.', {status: 404});
  const result = await context.storefront.query(POLICY_CONTENT_QUERY, {cache: context.storefront.CacheLong()});
  assertStorefrontResponse(result.errors, 'Policy');
  const policy = result.shop[policyNames[handle as keyof typeof policyNames]];
  if (!policy) throw new Response('Policy not found.', {status: 404});
  return {policy: {...policy, body: sanitizeHtml(policy.body)}, url: request.url};
}
export default function Policy() {
  const {policy, url} = useLoaderData<typeof loader>();
  const nonce = useNonce();
  const origin = new URL(url).origin;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: `${policy.title} · Mamta Design Co.`,
        description: plainText(policy.body).slice(0, 160),
        url,
      },
      breadcrumbJsonLd([
        {name: 'Home', url: origin},
        {name: 'Policies', url: `${origin}/policies`},
        {name: policy.title, url},
      ]),
    ],
  };
  return (
    <div className="content-shell policy">
      <header className="content-heading">
        <Link className="eyebrow" to="/policies">
          ← Customer care
        </Link>
        <h1>{policy.title}</h1>
      </header>
      <div className="prose" dangerouslySetInnerHTML={{__html: policy.body}} />
      <div className="policy-next">
        <Link to="/contact">Need a hand? Contact us →</Link>
      </div>
      <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{__html: jsonLd(structuredData)}} />
    </div>
  );
}
const POLICY_CONTENT_QUERY = `#graphql
  fragment Policy on ShopPolicy {body handle id title url}
  query Policy($country: CountryCode, $language: LanguageCode) @inContext(language:$language,country:$country) {
    shop {privacyPolicy {...Policy} shippingPolicy {...Policy} termsOfService {...Policy} refundPolicy {...Policy} subscriptionPolicy {body handle id title url}}
  }
` as const;


