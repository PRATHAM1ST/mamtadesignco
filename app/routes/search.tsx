import {Form, Link, useLoaderData, useLocation} from 'react-router';
import type {Route} from './+types/search';
import {Analytics, getPaginationVariables} from '@shopify/hydrogen';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/product-fragments';
import {CATALOG_FILTER_FRAGMENT, getSearchSort, parseProductFilters, searchSortOptions} from '~/lib/filters';
import {CatalogGrid} from '~/components/collection/CatalogGrid';
import {CatalogToolbar} from '~/components/collection/CatalogToolbar';
import {assertStorefrontSuccess} from '~/lib/storefront-errors';
import {routeSeo} from '~/lib/seo';
import {SearchContentResults} from '~/components/search/SearchContentResults';

export const meta: Route.MetaFunction = ({data}) =>
  routeSeo({
    title: data?.term ? `“${data.term}” · Search` : 'Search',
    description: 'Search the collection, stories and pages from Mamta Design Co.',
    noindex: true,
  });

export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const term = (url.searchParams.get('q') || '').trim().slice(0, 200);
  if (!term) return {term, result: null};
  const articlePage = {first: undefined, last: undefined, startCursor: undefined, endCursor: undefined, ...getPaginationVariables(request, {pageBy: 6, namespace: 'articles'})};
  const pagePage = {first: undefined, last: undefined, startCursor: undefined, endCursor: undefined, ...getPaginationVariables(request, {pageBy: 6, namespace: 'pages'})};
  const result = await context.storefront.query(SEARCH_QUERY, {
    variables: {term, ...getPaginationVariables(request, {pageBy: 12}), ...getSearchSort(url.searchParams.get('sort')), filters: parseProductFilters(url.searchParams), articleFirst: articlePage.first, articleLast: articlePage.last, articleStart: articlePage.startCursor, articleEnd: articlePage.endCursor, pageFirst: pagePage.first, pageLast: pagePage.last, pageStart: pagePage.startCursor, pageEnd: pagePage.endCursor},
    cache: context.storefront.CacheShort(),
  });
  assertStorefrontSuccess(result.errors, 'RegularSearch');
  return {term, result: {
    ...result,
    products: {...result.products, nodes: result.products.nodes.filter((node) => node.__typename === 'Product')},
    articles: {...result.articles, nodes: result.articles.nodes.filter((node) => node.__typename === 'Article')},
    pages: {...result.pages, nodes: result.pages.nodes.filter((node) => node.__typename === 'Page')},
  }};
}

export default function SearchPage() {
  const {term, result} = useLoaderData<typeof loader>();
  const location = useLocation();
  const hasFilters = Array.from(new URLSearchParams(location.search)).some(([key, value]) => key.startsWith('filter.') && value);
  const total = result ? result.products.totalCount + result.pages.totalCount + result.articles.totalCount : 0;
  return <div className="search-page page-width">
    <header className="catalog-heading"><span className="eyebrow">Find your piece</span><h1>{term ? <>Results for<br /><em>“{term}”</em></> : <>What are you<br /><em>looking for?</em></>}</h1></header>
    <Form method="get" role="search" className="full-search-form" key={term}>
      <label className="sr-only" htmlFor="full-search-query">Search the collection and journal</label>
      <input id="full-search-query" type="search" name="q" defaultValue={term} placeholder="Search the collection…" maxLength={200} />
      <button className="button button-primary" type="submit">Search <span aria-hidden="true">↗</span></button>
    </Form>
    {!term && <div className="search-empty"><p>Begin with a product name, a colour or a detail.</p><Link className="text-link" to="/shop">Explore all pieces ↗</Link></div>}
    {term && result && <>
      <p className="search-total" aria-live="polite">{total} {total === 1 ? 'result' : 'results'} for “{term}”</p>
      {(result.products.totalCount > 0 || hasFilters) && <>
        <CatalogToolbar filters={result.products.productFilters} totalCount={result.products.totalCount} shownCount={result.products.nodes.length} sortOptions={searchSortOptions.map((item) => item.value === 'featured' ? {...item, label: 'Relevance'} : item)} />
        <CatalogGrid connection={result.products} />
      </>}
      {!total && !hasFilters && <div className="search-empty"><h2>Nothing just yet.</h2><p>Try a different spelling, a product name or a broader search.</p><Link className="button button-outline" to="/shop">Explore the collection ↗</Link></div>}
      {result.articles.totalCount > 0 && <SearchContentResults connection={result.articles} term={term} namespace="articles" title="From the journal" />}
      {result.pages.totalCount > 0 && <SearchContentResults connection={result.pages} term={term} namespace="pages" title="Pages" />}
      <Analytics.SearchView data={{searchTerm: term, searchResults: result}} />
    </>}
  </div>;
}

export const SEARCH_QUERY = `#graphql
  query RegularSearch($country: CountryCode, $language: LanguageCode, $first: Int, $last: Int, $startCursor: String, $endCursor: String, $term: String!, $filters: [ProductFilter!], $sortKey: SearchSortKeys!, $reverse: Boolean!, $articleFirst: Int, $articleLast: Int, $articleStart: String, $articleEnd: String, $pageFirst: Int, $pageLast: Int, $pageStart: String, $pageEnd: String) @inContext(country: $country, language: $language) {
    products: search(query: $term, types: [PRODUCT], first: $first, last: $last, before: $startCursor, after: $endCursor, productFilters: $filters, sortKey: $sortKey, reverse: $reverse, unavailableProducts: SHOW) {
      totalCount productFilters { ...CatalogFilter }
      nodes { __typename ... on Product { ...ProductCard } }
      pageInfo { hasPreviousPage hasNextPage startCursor endCursor }
    }
    articles: search(query: $term, types: [ARTICLE], first: $articleFirst, last: $articleLast, before: $articleStart, after: $articleEnd) {
      totalCount
      nodes { __typename ... on Article { id title handle trackingParameters blog { handle } } }
      pageInfo { hasPreviousPage hasNextPage startCursor endCursor }
    }
    pages: search(query: $term, types: [PAGE], first: $pageFirst, last: $pageLast, before: $pageStart, after: $pageEnd) {
      totalCount
      nodes { __typename ... on Page { id title handle trackingParameters } }
      pageInfo { hasPreviousPage hasNextPage startCursor endCursor }
    }
  }
  ${PRODUCT_CARD_FRAGMENT}
  ${CATALOG_FILTER_FRAGMENT}
` as const;

