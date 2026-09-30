import {assertStorefrontResponse} from '~/lib/storefront-errors';
import {Link, redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/pages.$handle';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {routeSeo} from '~/lib/seo';
import {sanitizeHtml, plainText} from '~/lib/html';

export const meta: Route.MetaFunction = ({data}) => routeSeo({title: data?.page.seo?.title || data?.page.title || 'Our story', description: data?.page.seo?.description || plainText(data?.page.body).slice(0, 160), url: data?.url});
export async function loader({context, request, params}: Route.LoaderArgs) {
  if (params.handle === 'contact') throw redirect(`/contact${new URL(request.url).search}`, 301);
  if (!params.handle) throw new Response('Page not found.', {status: 404});
  const {page, errors} = await context.storefront.query(PAGE_QUERY, {variables: {handle: params.handle}, cache: context.storefront.CacheLong()});
  assertStorefrontResponse(errors, 'Content');
  if (!page) throw new Response('Page not found.', {status: 404});
  redirectIfHandleIsLocalized(request, {handle: params.handle, data: page});
  return {page: {...page, body: sanitizeHtml(page.body)}, url: request.url};
}
export default function Page() {
  const {page} = useLoaderData<typeof loader>();
  return <div className="content-shell page"><header className="content-heading"><p className="eyebrow">Mamta Design Co</p><h1>{page.title}</h1></header>{page.body ? <div className="prose" dangerouslySetInnerHTML={{__html: page.body}} /> : <div className="content-empty"><p>There’s more to come.</p><Link className="button" to="/shop">Explore the collection →</Link></div>}</div>;
}
const PAGE_QUERY = `#graphql
  query Page($language: LanguageCode, $country: CountryCode, $handle: String!)
  @inContext(language: $language, country: $country) {
    page(handle: $handle) { handle id title body seo {description title} }
  }
` as const;



