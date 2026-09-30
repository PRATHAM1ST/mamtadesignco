import {useLoaderData} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {Analytics, getPaginationVariables, Image} from '@shopify/hydrogen';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/product-fragments';
import {CATALOG_FILTER_FRAGMENT, collectionSortOptions, getCollectionSort, parseProductFilters} from '~/lib/filters';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {CatalogGrid} from '~/components/collection/CatalogGrid';
import {CatalogToolbar} from '~/components/collection/CatalogToolbar';
import {assertStorefrontSuccess} from '~/lib/storefront-errors';
import {routeSeo} from '~/lib/seo';

export const meta: Route.MetaFunction = ({data}) => routeSeo({
  title: data?.collection.seo.title || data?.collection.title || 'Collection',
  description: data?.collection.seo.description || data?.collection.description || 'Explore the collection from Mamta Design Co.',
  url: data ? `${data.origin}/collections/${data.collection.handle}` : undefined,
  image: data?.collection.image?.url,
});

export async function loader({context, params, request}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const {collection, errors} = await context.storefront.query(COLLECTION_QUERY, {
    variables: {handle: params.handle, ...getPaginationVariables(request, {pageBy: 12}), ...getCollectionSort(url.searchParams.get('sort')), filters: parseProductFilters(url.searchParams)},
    cache: context.storefront.CacheShort(),
  });
  assertStorefrontSuccess(errors, 'MerchandisingCollection');
  if (!collection) throw new Response('This collection could not be found.', {status: 404});
  redirectIfHandleIsLocalized(request, {handle: params.handle, data: collection});
  return {collection, origin: url.origin};
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  return <div className="catalog-page page-width">
    <header className={`catalog-heading ${collection.image ? 'has-image' : ''}`}>
      <div><span className="eyebrow">The collection</span><h1>{collection.title}</h1>{collection.description && <p>{collection.description}</p>}</div>
      {collection.image && <Image className="catalog-cover" data={collection.image} alt={collection.image.altText || collection.title} sizes="(min-width: 768px) 35vw, 100vw" aspectRatio="4/3" loading="eager" />}
    </header>
    <CatalogToolbar filters={collection.products.filters} shownCount={collection.products.nodes.length} sortOptions={collectionSortOptions} />
    <CatalogGrid connection={collection.products} />
    <Analytics.CollectionView data={{collection: {id: collection.id, handle: collection.handle}}} />
  </div>;
}

const COLLECTION_QUERY = `#graphql
  query MerchandisingCollection($handle: String!, $country: CountryCode, $language: LanguageCode, $first: Int, $last: Int, $startCursor: String, $endCursor: String, $filters: [ProductFilter!], $sortKey: ProductCollectionSortKeys!, $reverse: Boolean!) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id handle title description seo { title description }
      image { url altText width height }
      products(first: $first, last: $last, before: $startCursor, after: $endCursor, filters: $filters, sortKey: $sortKey, reverse: $reverse) {
        filters { ...CatalogFilter }
        nodes { ...ProductCard }
        pageInfo { hasPreviousPage hasNextPage startCursor endCursor }
      }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
  ${CATALOG_FILTER_FRAGMENT}
` as const;

