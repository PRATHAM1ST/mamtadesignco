import {assertStorefrontResponse} from '~/lib/storefront-errors';
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/faq';
import {routeSeo} from '~/lib/seo';

export const meta: Route.MetaFunction = ({data}) => routeSeo({title: 'Frequently asked questions', description: 'Answers and customer care from Mamta Design Co.', url: data?.url});
export async function loader({context, request}: Route.LoaderArgs) {
  const {metaobjects, errors} = await context.storefront.query(FAQ_QUERY, {cache: context.storefront.CacheLong()});
  assertStorefrontResponse(errors, 'Content');
  const entries = metaobjects.nodes.map(node => ({id: node.id, question: node.question?.value, answer: node.answer?.value})).filter(entry => entry.question && entry.answer);
  return {entries, url: request.url};
}
export default function Faq() {
  const {entries} = useLoaderData<typeof loader>();
  return <div className="content-shell faq-page"><header className="content-heading"><p className="eyebrow">Customer care</p><h1>A little clarity.</h1><p>The answers to your frequently asked questions.</p></header>{entries.length ? <div className="faq-list">{entries.map(entry => <details key={entry.id}><summary>{entry.question}<span aria-hidden="true">+</span></summary><p>{entry.answer}</p></details>)}</div> : <div className="content-empty"><h2>Let’s point you in the right direction.</h2><p>Our shipping and returns policies have the details for your order.</p><Link className="button" to="/policies">Read our policies →</Link></div>}<div className="policy-next"><Link to="/contact">Need something else? Contact us →</Link></div></div>;
}
const FAQ_QUERY = `#graphql
  query StoreFaq($country:CountryCode,$language:LanguageCode) @inContext(country:$country,language:$language) {
    metaobjects(type:"storefront_faq", first:50) {nodes {id question:field(key:"question") {value} answer:field(key:"answer") {value}}}
  }
` as const;

