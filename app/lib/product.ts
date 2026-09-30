/** Shared by the product page and quick view so options use the same Shopify model. */
export const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice { amount currencyCode }
    id
    image { id url altText width height }
    price { amount currencyCode }
    product { id title handle }
    selectedOptions { name value }
    sku
    title
    unitPrice { amount currencyCode }
  }
` as const;

export const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id title vendor handle description descriptionHtml
    encodedVariantExistence encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant { ...ProductVariant }
        swatch { color image { previewImage { url } } }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) { ...ProductVariant }
    adjacentVariants(selectedOptions: $selectedOptions) { ...ProductVariant }
    media(first: 40) {
      nodes {
        __typename id alt
        previewImage { id url altText width height }
        ... on MediaImage { image { id url altText width height } }
        ... on Video { sources { url mimeType format width height } }
        ... on ExternalVideo { embeddedUrl host }
      }
    }
    details: metafield(namespace: "storefront", key: "details") { type value }
    care: metafield(namespace: "storefront", key: "care") { type value }
    sizeGuide: metafield(namespace: "storefront", key: "size_guide") { type value }
    seo { description title }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

export const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
    $variantId: ID!
    $hasVariant: Boolean!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) { ...Product }
    selectedVariant: node(id: $variantId) @include(if: $hasVariant) {
      ... on ProductVariant { ...ProductVariant }
    }
    shop {
      shippingPolicy { title handle body }
      refundPolicy { title handle body }
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

export function variantGid(value: string | null): string | null {
  if (!value) return null;
  if (/^\d{1,30}$/.test(value)) return `gid://shopify/ProductVariant/${value}`;
  return /^gid:\/\/shopify\/ProductVariant\/\d+$/.test(value) ? value : null;
}
