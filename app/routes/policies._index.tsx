import {assertStorefrontResponse} from '~/lib/storefront-errors';
import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/policies._index';
import {routeSeo} from '~/lib/seo';

export const meta: Route.MetaFunction = ({data}) => routeSeo({title: 'Customer care & policies', description: 'Shipping, returns, privacy and terms from Mamta Design Co.', url: data?.url});
export async function loader({context, request}: Route.LoaderArgs) {
  const {shop, errors} = await context.storefront.query(POLICIES_QUERY, {cache: context.storefront.CacheLong()});
  assertStorefrontResponse(errors, 'Content');
  return {policies: [shop.shippingPolicy, shop.refundPolicy, shop.privacyPolicy, shop.termsOfService, shop.subscriptionPolicy].filter(policy => policy != null), url: request.url};
}
export default function Policies() {
  const {policies} = useLoaderData<typeof loader>();
  return <div className="content-shell policies"><header className="content-heading"><p className="eyebrow">Customer care</p><h1>The finer details.</h1><p>Everything you need to know before your next celebration.</p></header><div className="policy-links">{policies.map((policy, index) => <Link key={policy.id} to={`/policies/${policy.handle}`}><span className="eyebrow">{String(index + 1).padStart(2, '0')}</span><h2>{policy.title}</h2><span aria-hidden="true">↗</span></Link>)}</div>{!policies.length && <div className="content-empty"><p>Store policies will be published here.</p><Link to="/contact">Contact us →</Link></div>}</div>;
}
const POLICIES_QUERY = `#graphql
  fragment PolicyItem on ShopPolicy {id title handle}
  query Policies($country:CountryCode,$language:LanguageCode) @inContext(country:$country,language:$language) {
    shop {privacyPolicy {...PolicyItem} shippingPolicy {...PolicyItem} termsOfService {...PolicyItem} refundPolicy {...PolicyItem} subscriptionPolicy {id title handle}}
  }
` as const;


