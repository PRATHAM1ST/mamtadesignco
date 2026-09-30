import type {ProductFilter, ProductCollectionSortKeys, SearchSortKeys} from '@shopify/hydrogen/storefront-api-types';

export const FILTER_PREFIX = 'filter.';
const MAX_FILTERS = 24;
const paginationKeys = ['cursor', 'direction', 'startCursor', 'endCursor'];

export function resetPagination(params: URLSearchParams) {
  paginationKeys.forEach((key) => params.delete(key));
  Array.from(params.keys()).filter((key) => /_(cursor|direction)$/.test(key)).forEach((key) => params.delete(key));
  return params;
}

export function parseProductFilters(params: URLSearchParams): ProductFilter[] {
  const filters: ProductFilter[] = [];
  const price: {min?: number; max?: number} = {};
  for (const [key, value] of params) {
    if (!key.startsWith(FILTER_PREFIX)) continue;
    if (filters.length >= MAX_FILTERS || value.length > 500) throw new Response('Too many or invalid filters.', {status: 400});
    const field = key.slice(FILTER_PREFIX.length);
    if (field === 'price.min' || field === 'price.max') {
      if (!value) continue;
      const amount = Number(value);
      if (!Number.isFinite(amount) || amount < 0) throw new Response('Enter a valid price range.', {status: 400});
      price[field === 'price.min' ? 'min' : 'max'] = amount;
    } else if (field === 'available' && (value === 'true' || value === 'false')) {
      filters.push({available: value === 'true'});
    } else if (field === 'productType') filters.push({productType: value});
    else if (field === 'vendor') filters.push({productVendor: value});
    else if (field === 'tag') filters.push({tag: value});
    else if (field === 'category') filters.push({category: {id: value}});
    else if (field.startsWith('option.')) filters.push({variantOption: {name: field.slice(7), value}});
    else if (/^(meta|variantMeta|taxonomy)\.[^.]+\.[^.]+$/.test(field)) {
      const [kind, namespace, metafieldKey] = field.split('.');
      const metafield = {namespace, key: metafieldKey, value};
      if (kind === 'meta') filters.push({productMetafield: metafield});
      if (kind === 'variantMeta') filters.push({variantMetafield: metafield});
      if (kind === 'taxonomy') filters.push({taxonomyMetafield: metafield});
    }
  }
  if (Object.keys(price).length) {
    if (price.min !== undefined && price.max !== undefined && price.min > price.max) throw new Response('Minimum price must be below maximum price.', {status: 400});
    filters.push({price});
  }
  return filters;
}

/** Map Shopify's filter input to readable, shareable URL parameters. */
export function filterParam(input: unknown): [string, string] | null {
  let filter: ProductFilter;
  try {
    const decoded: unknown = typeof input === 'string' ? JSON.parse(input) : input;
    if (!decoded || typeof decoded !== 'object' || Array.isArray(decoded)) return null;
    filter = decoded as ProductFilter;
  } catch { return null; }
  if (typeof filter.available === 'boolean') return ['filter.available', String(filter.available)];
  if (typeof filter.productType === 'string') return ['filter.productType', filter.productType];
  if (typeof filter.productVendor === 'string') return ['filter.vendor', filter.productVendor];
  if (typeof filter.tag === 'string') return ['filter.tag', filter.tag];
  if (filter.category?.id) return ['filter.category', filter.category.id];
  if (filter.variantOption?.name && typeof filter.variantOption.value === 'string') return [`filter.option.${filter.variantOption.name}`, filter.variantOption.value];
  for (const [kind, field] of [['meta', filter.productMetafield], ['variantMeta', filter.variantMetafield], ['taxonomy', filter.taxonomyMetafield]] as const) {
    if (field?.namespace && field.key && typeof field.value === 'string') return [`filter.${kind}.${field.namespace}.${field.key}`, field.value];
  }
  return null;
}

export function toggleFilterUrl(pathname: string, current: URLSearchParams, key: string, value: string) {
  const params = resetPagination(new URLSearchParams(current));
  const values = params.getAll(key);
  params.delete(key);
  const next = values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
  next.forEach((item) => params.append(key, item));
  return `${pathname}${params.size ? `?${params}` : ''}`;
}

export function clearFiltersUrl(pathname: string, current: URLSearchParams) {
  const params = resetPagination(new URLSearchParams(current));
  Array.from(params.keys()).filter((key) => key.startsWith(FILTER_PREFIX)).forEach((key) => params.delete(key));
  return `${pathname}${params.size ? `?${params}` : ''}`;
}

export const searchSortOptions = [
  {value: 'featured', label: 'Featured'},
  {value: 'price-low', label: 'Price: low to high'},
  {value: 'price-high', label: 'Price: high to low'},
];
export const collectionSortOptions = [
  ...searchSortOptions,
  {value: 'best-selling', label: 'Best selling'},
  {value: 'newest', label: 'Newest first'},
];

export function getSearchSort(value: string | null): {sortKey: SearchSortKeys; reverse: boolean} {
  return {sortKey: value === 'price-low' || value === 'price-high' ? 'PRICE' : 'RELEVANCE', reverse: value === 'price-high'};
}
export function getCollectionSort(value: string | null): {sortKey: ProductCollectionSortKeys; reverse: boolean} {
  if (value === 'best-selling') return {sortKey: 'BEST_SELLING', reverse: false};
  if (value === 'newest') return {sortKey: 'CREATED', reverse: true};
  if (value === 'price-low' || value === 'price-high') return {sortKey: 'PRICE', reverse: value === 'price-high'};
  return {sortKey: 'COLLECTION_DEFAULT', reverse: false};
}

export const CATALOG_FILTER_FRAGMENT = `#graphql
  fragment CatalogFilter on Filter {
    id label type presentation
    values {
      id label count input
      swatch { color image { previewImage { url altText width height } } }
      image { previewImage { url altText width height } }
    }
  }
` as const;
