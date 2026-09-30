import {data} from 'react-router';
import type {Route} from './+types/api.product';
import {PRODUCT_VARIANT_FRAGMENT} from '~/lib/product';

export async function loader({request, context}: Route.LoaderArgs) {
  const handle = new URL(request.url).searchParams.get('handle');
  if (!handle || handle.length > 255) return data({error: 'Choose a product to preview.'}, {status: 400});
  const result = await context.storefront.query(QUICK_VIEW_QUERY, {variables: {handle}, cache: context.storefront.CacheShort()});
  if (result.errors?.length) return data({error: 'This piece could not be refreshed. Please try again.'}, {status: 502});
  if (!result.product) return data({error: 'This piece is no longer available.'}, {status: 404});
  return data(result, {headers: {'Cache-Control': 'public, max-age=30'}});
}

const QUICK_VIEW_QUERY = `#graphql
  query QuickView($handle: String!, $country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id title handle description
      featuredImage { id url altText width height }
      options { name optionValues { name swatch { color image { previewImage { url } } } } }
      variants(first: 250) { nodes { ...ProductVariant } pageInfo { hasNextPage } }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;
