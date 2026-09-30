import {assertStorefrontResponse} from '~/lib/storefront-errors';
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/faq';
import {useNonce} from '@shopify/hydrogen';
import {routeSeo, jsonLd, faqJsonLd, breadcrumbJsonLd} from '~/lib/seo';

export const meta: Route.MetaFunction = ({data}) =>
  routeSeo({
    title: 'Frequently Asked Questions · Customer Care',
    description:
      'Find answers to questions about orders, international shipping, bespoke sizing, fabric care, and returns at Mamta Design Co.',
    url: data?.url,
    keywords: [
      'Mamta Design Co FAQ',
      'Chaniya Choli sizing',
      'International shipping',
      'Garment care',
      'Order assistance',
    ],
  });

export async function loader({context, request}: Route.LoaderArgs) {
  const {metaobjects, errors} = await context.storefront.query(FAQ_QUERY, {cache: context.storefront.CacheLong()});
  assertStorefrontResponse(errors, 'Content');
  const entries: {id: string; question: string; answer: string}[] = metaobjects.nodes.flatMap((node) =>
    node.question?.value && node.answer?.value
      ? [{id: node.id, question: node.question.value, answer: node.answer.value}]
      : [],
  );
  return {entries, url: request.url};
}
export default function Faq() {
  const {entries, url} = useLoaderData<typeof loader>();
  const nonce = useNonce();
  const origin = new URL(url).origin;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      ...(entries.length ? [faqJsonLd(entries)] : []),
      breadcrumbJsonLd([
        {name: 'Home', url: origin},
        {name: 'FAQ', url},
      ]),
    ],
  };
  return <div className="content-shell faq-page"><header className="content-heading"><p className="eyebrow">Customer care</p><h1>A little clarity.</h1><p>The answers to your frequently asked questions.</p></header>{entries.length ? <div className="faq-list">{entries.map(entry => <details key={entry.id}><summary>{entry.question}<span aria-hidden="true">+</span></summary><p>{entry.answer}</p></details>)}</div> : <div className="content-empty"><h2>Let’s point you in the right direction.</h2><p>Our shipping and returns policies have the details for your order.</p><Link className="button" to="/policies">Read our policies →</Link></div>}<div className="policy-next"><Link to="/contact">Need something else? Contact us →</Link></div><script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{__html: jsonLd(structuredData)}} /></div>;
}
const FAQ_QUERY = `#graphql
  query StoreFaq($country:CountryCode,$language:LanguageCode) @inContext(country:$country,language:$language) {
    metaobjects(type:"storefront_faq", first:50) {nodes {id question:field(key:"question") {value} answer:field(key:"answer") {value}}}
  }
` as const;

