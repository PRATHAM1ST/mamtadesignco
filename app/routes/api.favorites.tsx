import {data} from 'react-router';
import type {Route} from './+types/api.favorites';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/product-fragments';
import {assertStorefrontResponse} from '~/lib/storefront-errors';

export async function loader({request, context}: Route.LoaderArgs) {
  const raw = new URL(request.url).searchParams.getAll('id');
  const ids = [...new Set(raw)].filter((id) => /^gid:\/\/shopify\/Product\/\d+$/.test(id)).slice(0, 40);
  if (!ids.length) return data({products: []}, {headers: {'Cache-Control': 'private, no-store'}});
  const {nodes, errors} = await context.storefront.query(FAVORITES_QUERY, {variables: {ids}, cache: context.storefront.CacheShort()});
  assertStorefrontResponse(errors,'Favorite products');
  const products = nodes.filter((node) => node?.__typename === 'Product');
  return data({products}, {headers: {'Cache-Control': 'private, no-store'}});
}
const FAVORITES_QUERY = `#graphql
 query FavoriteProducts($ids:[ID!]!,$country:CountryCode,$language:LanguageCode) @inContext(country:$country,language:$language) { nodes(ids:$ids) { __typename ... on Product { ...ProductCard } } }
 ${PRODUCT_CARD_FRAGMENT}
` as const;
