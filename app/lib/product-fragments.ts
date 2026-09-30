export const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCard on Product {
    __typename id handle title description availableForSale trackingParameters
    featuredImage { id url altText width height }
    images(first: 2) { nodes { id url altText width height } }
    priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
    options { name optionValues { name swatch { color image { previewImage { url } } } } }
    variants(first: 2) { nodes { id availableForSale } }
    selectedOrFirstAvailableVariant { id title availableForSale selectedOptions { name value } image { id url altText width height } price { amount currencyCode } compareAtPrice { amount currencyCode } product { id title handle vendor } }
  }
` as const;
