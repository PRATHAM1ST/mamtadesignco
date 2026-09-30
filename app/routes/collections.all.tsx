import {useLoaderData} from 'react-router';
import type {Route} from './+types/collections.all';
import {getPaginationVariables, useNonce} from '@shopify/hydrogen';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/product-fragments';
import {CATALOG_FILTER_FRAGMENT, getSearchSort, parseProductFilters, searchSortOptions} from '~/lib/filters';
import {CatalogGrid} from '~/components/collection/CatalogGrid';
import {CatalogToolbar} from '~/components/collection/CatalogToolbar';
import {assertStorefrontSuccess} from '~/lib/storefront-errors';
import {routeSeo, jsonLd, breadcrumbJsonLd} from '~/lib/seo';

export const meta: Route.MetaFunction = ({data, location}) =>
  routeSeo({
    title: 'Shop the Collection · Designer Chaniya Choli',
    description:
      'Explore the complete wardrobe of handcrafted Chaniya Cholis, bespoke bridal lehengas, and festive couture from Mamta Design Co.',
    url: data ? `${data.origin}${location.pathname}` : undefined,
    image: data?.catalog.nodes[0]?.featuredImage?.url,
    keywords: [
      'Shop Chaniya Choli',
      'Navratri Collection',
      'Designer Chaniya',
      'Handcrafted Ethnic Wear',
      'Mamta Design Co',
      'Ahmedabad Choli',
    ],
  });

export async function loader({context, request}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const {catalog, errors} = await context.storefront.query(CATALOG_QUERY, {
    variables: {...getPaginationVariables(request, {pageBy: 12}), ...getSearchSort(url.searchParams.get('sort')), filters: parseProductFilters(url.searchParams)},
    cache: context.storefront.CacheShort(),
  });
  assertStorefrontSuccess(errors, 'AllProductsCatalog');
  return {catalog: {...catalog, nodes: catalog.nodes.filter((node) => node.__typename === 'Product')}, origin: url.origin};
}

export default function AllProducts() {
  const {catalog, origin} = useLoaderData<typeof loader>();
  const nonce = useNonce();
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'The Chaniya Collection',
        description: 'Explore the complete wardrobe of handcrafted Chaniya Cholis from Mamta Design Co.',
        url: `${origin}/shop`,
      },
      breadcrumbJsonLd([
        {name: 'Home', url: origin},
        {name: 'Shop', url: `${origin}/shop`},
      ]),
    ],
  };
  return <div className="catalog-page page-width">
    <header className="catalog-heading"><span className="eyebrow">The collection</span><h1>For the nights<br /><em>you live for.</em></h1><p>Find your rhythm. Find your piece.</p></header>
    <CatalogToolbar filters={catalog.productFilters} totalCount={catalog.totalCount} shownCount={catalog.nodes.length} sortOptions={searchSortOptions} />
    <CatalogGrid connection={catalog} />
    <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{__html: jsonLd(structuredData)}} />
  </div>;
}

export const CATALOG_QUERY = `#graphql
  query AllProductsCatalog($country: CountryCode, $language: LanguageCode, $first: Int, $last: Int, $startCursor: String, $endCursor: String, $filters: [ProductFilter!], $sortKey: SearchSortKeys!, $reverse: Boolean!) @inContext(country: $country, language: $language) {
    catalog: search(query: "", types: [PRODUCT], first: $first, last: $last, before: $startCursor, after: $endCursor, productFilters: $filters, sortKey: $sortKey, reverse: $reverse, unavailableProducts: SHOW) {
      totalCount
      productFilters { ...CatalogFilter }
      nodes { __typename ... on Product { ...ProductCard } }
      pageInfo { hasPreviousPage hasNextPage startCursor endCursor }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
  ${CATALOG_FILTER_FRAGMENT}
` as const;

