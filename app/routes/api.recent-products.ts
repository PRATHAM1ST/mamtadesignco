import {data} from 'react-router';
import type {Route} from './+types/api.recent-products';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/product-fragments';

export async function action({request, context}: Route.ActionArgs) {
  if (request.method !== 'POST') return data({error: 'Method not allowed'}, {status: 405, headers: {Allow: 'POST'}});
  let input: unknown;
  try {input = await request.json();} catch {return data({error: 'Invalid request'}, {status: 400});}
  const ids = input && typeof input === 'object' && 'ids' in input ? input.ids : null;
  if (!Array.isArray(ids) || ids.length > 8 || !ids.every((id) => typeof id === 'string' && /^gid:\/\/shopify\/Product\/\d+$/.test(id))) return data({error: 'Invalid product identifiers'}, {status: 400});
  const productIds = ids.filter((id): id is string => typeof id === 'string');
  const result = await context.storefront.query(RECENT_PRODUCTS_QUERY, {variables: {ids: productIds}, cache: context.storefront.CacheShort()});
  if (result.errors?.length) return data({error: 'Recently viewed pieces could not be refreshed.'}, {status: 502});
  const {nodes} = result;
  return data({products: nodes.filter((node) => node?.__typename === 'Product')}, {headers: {'Cache-Control': 'private, no-store'}});
}

const RECENT_PRODUCTS_QUERY = `#graphql
  query RecentProducts($ids: [ID!]!, $country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    nodes(ids: $ids) { __typename ... on Product { ...ProductCard } }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;
