import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/collections._index';
import {getPaginationVariables, Image, Pagination} from '@shopify/hydrogen';
import {assertStorefrontSuccess} from '~/lib/storefront-errors';
import {routeSeo} from '~/lib/seo';

export const meta: Route.MetaFunction = ({data}) => routeSeo({title: 'Collections', description: 'Discover the collections from Mamta Design Co.', url: data ? `${data.origin}/collections` : undefined, image: data?.collections.nodes[0]?.image?.url});

export async function loader({context, request}: Route.LoaderArgs) {
  const {collections, errors} = await context.storefront.query(COLLECTIONS_QUERY, {variables: getPaginationVariables(request, {pageBy: 12}), cache: context.storefront.CacheShort()});
  assertStorefrontSuccess(errors, 'MerchandisingCollections');
  return {collections, origin: new URL(request.url).origin};
}

export default function CollectionsIndex() {
  const {collections} = useLoaderData<typeof loader>();
  return <div className="collections-page page-width"><header className="catalog-heading"><span className="eyebrow">The wardrobe</span><h1>A world of<br /><em>possibilities.</em></h1></header>
    {collections.nodes.length ? <Pagination connection={collections}>{({nodes, PreviousLink, NextLink, isLoading}) => <><PreviousLink className="text-link">Previous collections</PreviousLink><div className="collection-editorial-grid">{nodes.map((collection, index) => <Link className="collection-editorial-tile" key={collection.id} to={`/collections/${collection.handle}`} prefetch="intent">{collection.image ? <Image data={collection.image} alt={collection.image.altText || collection.title} aspectRatio={index % 3 === 0 ? '4/5' : '3/4'} sizes="(min-width: 768px) 45vw, 90vw" loading={index < 2 ? 'eager' : 'lazy'} /> : <div className="collection-image-placeholder" aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>}<div><h2>{collection.title}</h2><span aria-hidden="true">↗</span></div>{collection.description && <p>{collection.description}</p>}</Link>)}</div><div className="catalog-pagination"><NextLink className="button button-outline">{isLoading ? 'Loading…' : 'More collections'}</NextLink></div></>}</Pagination> : <div className="collection-catalogue-invite"><span className="eyebrow">Every piece, in one place</span><h2>The collection awaits.</h2><p>Explore the complete wardrobe and choose what moves you.</p><Link className="button button-primary" to="/shop">Shop all pieces <span aria-hidden="true">↗</span></Link></div>}
  </div>;
}

const COLLECTIONS_QUERY = `#graphql
  query MerchandisingCollections($country: CountryCode, $language: LanguageCode, $first: Int, $last: Int, $startCursor: String, $endCursor: String) @inContext(country: $country, language: $language) {
    collections(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes { id handle title description image { url altText width height } }
      pageInfo { hasPreviousPage hasNextPage startCursor endCursor }
    }
  }
` as const;

