import type {Route} from './+types/api.predictive-search';
import {getEmptyPredictiveSearchResult, type PredictiveSearchReturn} from '~/lib/search';
import {assertStorefrontSuccess} from '~/lib/storefront-errors';

export async function loader({request, context}: Route.LoaderArgs) {
  const term = (new URL(request.url).searchParams.get('q') || '').trim().slice(0, 200);
  if (!term) return Response.json({type: 'predictive', term, result: getEmptyPredictiveSearchResult()} satisfies PredictiveSearchReturn);
  const {predictiveSearch, errors} = await context.storefront.query(PREDICTIVE_SEARCH_QUERY, {
    variables: {term}, cache: context.storefront.CacheShort(),
  });
  assertStorefrontSuccess(errors, 'PredictiveSearch');
  if (!predictiveSearch) throw new Response('Search is temporarily unavailable. Please try again.', {status: 502});
  const total = Object.values(predictiveSearch).reduce((count, items) => count + items.length, 0);
  return Response.json({type: 'predictive', term, result: {items: predictiveSearch, total}} satisfies PredictiveSearchReturn);
}

export const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch($country: CountryCode, $language: LanguageCode, $term: String!) @inContext(country: $country, language: $language) {
    predictiveSearch(query: $term, limit: 5, limitScope: EACH, types: [PRODUCT, COLLECTION, PAGE, ARTICLE, QUERY], unavailableProducts: SHOW) {
      products {
        __typename id title handle trackingParameters
        selectedOrFirstAvailableVariant { id image { url altText width height } price { amount currencyCode } }
      }
      collections { __typename id title handle trackingParameters image { url altText width height } }
      pages { __typename id title handle trackingParameters }
      articles { __typename id title handle trackingParameters blog { handle } image { url altText width height } }
      queries { __typename text styledText trackingParameters }
    }
  }
` as const;
