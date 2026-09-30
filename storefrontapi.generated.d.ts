/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

export type CatalogFilterFragment = Pick<
  StorefrontAPI.Filter,
  'id' | 'label' | 'type' | 'presentation'
> & {
  values: Array<
    Pick<StorefrontAPI.FilterValue, 'id' | 'label' | 'count' | 'input'> & {
      swatch?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Swatch, 'color'> & {
          image?: StorefrontAPI.Maybe<{
            previewImage?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
            >;
          }>;
        }
      >;
      image?: StorefrontAPI.Maybe<{
        previewImage?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
        >;
      }>;
    }
  >;
};

export type MoneyFragment = Pick<
  StorefrontAPI.MoneyV2,
  'currencyCode' | 'amount'
>;

export type CartLineFragment = Pick<
  StorefrontAPI.CartLine,
  'id' | 'quantity'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'id' | 'availableForSale' | 'requiresShipping' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
  };
  parentRelationship?: StorefrontAPI.Maybe<{
    parent: Pick<StorefrontAPI.CartLine, 'id'>;
  }>;
};

export type CartLineComponentFragment = Pick<
  StorefrontAPI.ComponentizableCartLine,
  'id' | 'quantity'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'id' | 'availableForSale' | 'requiresShipping' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
  };
  lineComponents: Array<
    Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
      attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
      cost: {
        totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
        amountPerQuantity: Pick<
          StorefrontAPI.MoneyV2,
          'currencyCode' | 'amount'
        >;
        compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
        >;
      };
      merchandise: Pick<
        StorefrontAPI.ProductVariant,
        'id' | 'availableForSale' | 'requiresShipping' | 'title'
      > & {
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        product: Pick<
          StorefrontAPI.Product,
          'handle' | 'title' | 'id' | 'vendor'
        >;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
      };
      parentRelationship?: StorefrontAPI.Maybe<{
        parent: Pick<StorefrontAPI.CartLine, 'id'>;
      }>;
    }
  >;
};

export type CartApiQueryFragment = Pick<
  StorefrontAPI.Cart,
  'updatedAt' | 'id' | 'checkoutUrl' | 'totalQuantity' | 'note'
> & {
  appliedGiftCards: Array<
    Pick<StorefrontAPI.AppliedGiftCard, 'id' | 'lastCharacters'> & {
      amountUsed: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    }
  >;
  buyerIdentity: Pick<
    StorefrontAPI.CartBuyerIdentity,
    'countryCode' | 'email' | 'phone'
  > & {
    customer?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.Customer,
        'id' | 'email' | 'firstName' | 'lastName' | 'displayName'
      >
    >;
  };
  lines: {
    nodes: Array<
      | (Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
          attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
          cost: {
            totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            amountPerQuantity: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
            compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
          };
          merchandise: Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'availableForSale' | 'requiresShipping' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            product: Pick<
              StorefrontAPI.Product,
              'handle' | 'title' | 'id' | 'vendor'
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
          };
          parentRelationship?: StorefrontAPI.Maybe<{
            parent: Pick<StorefrontAPI.CartLine, 'id'>;
          }>;
        })
      | (Pick<StorefrontAPI.ComponentizableCartLine, 'id' | 'quantity'> & {
          attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
          cost: {
            totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            amountPerQuantity: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
            compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
          };
          merchandise: Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'availableForSale' | 'requiresShipping' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            product: Pick<
              StorefrontAPI.Product,
              'handle' | 'title' | 'id' | 'vendor'
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
          };
          lineComponents: Array<
            Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
              attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
              cost: {
                totalAmount: Pick<
                  StorefrontAPI.MoneyV2,
                  'currencyCode' | 'amount'
                >;
                amountPerQuantity: Pick<
                  StorefrontAPI.MoneyV2,
                  'currencyCode' | 'amount'
                >;
                compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
                >;
              };
              merchandise: Pick<
                StorefrontAPI.ProductVariant,
                'id' | 'availableForSale' | 'requiresShipping' | 'title'
              > & {
                compareAtPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
                product: Pick<
                  StorefrontAPI.Product,
                  'handle' | 'title' | 'id' | 'vendor'
                >;
                selectedOptions: Array<
                  Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                >;
              };
              parentRelationship?: StorefrontAPI.Maybe<{
                parent: Pick<StorefrontAPI.CartLine, 'id'>;
              }>;
            }
          >;
        })
    >;
  };
  cost: {
    subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalDutyAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    totalTaxAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  discountCodes: Array<
    Pick<StorefrontAPI.CartDiscountCode, 'code' | 'applicable'>
  >;
  discountAllocations: Array<
    | (Pick<StorefrontAPI.CartAutomaticDiscountAllocation, 'title'> & {
        discountedAmount: Pick<
          StorefrontAPI.MoneyV2,
          'currencyCode' | 'amount'
        >;
      })
    | (Pick<StorefrontAPI.CartCodeDiscountAllocation, 'code'> & {
        discountedAmount: Pick<
          StorefrontAPI.MoneyV2,
          'currencyCode' | 'amount'
        >;
      })
    | {discountedAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>}
  >;
};

export type MenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type ChildMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type ParentMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    >
  >;
};

export type MenuFragment = Pick<StorefrontAPI.Menu, 'id'> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    > & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        >
      >;
    }
  >;
};

export type ShopFragment = Pick<
  StorefrontAPI.Shop,
  'id' | 'name' | 'description'
> & {
  primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
  brand?: StorefrontAPI.Maybe<{
    logo?: StorefrontAPI.Maybe<{
      image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
    }>;
  }>;
};

export type HeaderQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  headerMenuHandle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type HeaderQuery = {
  shop: Pick<StorefrontAPI.Shop, 'id' | 'name' | 'description'> & {
    primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
    brand?: StorefrontAPI.Maybe<{
      logo?: StorefrontAPI.Maybe<{
        image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
      }>;
    }>;
  };
  menu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            >
          >;
        }
      >;
    }
  >;
};

export type FooterQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  footerMenuHandle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type FooterQuery = {
  menu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            >
          >;
        }
      >;
    }
  >;
};

export type ProductCardFragment = {__typename: 'Product'} & Pick<
  StorefrontAPI.Product,
  | 'id'
  | 'handle'
  | 'title'
  | 'description'
  | 'availableForSale'
  | 'trackingParameters'
> & {
    featuredImage?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    images: {
      nodes: Array<
        Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
      >;
    };
    priceRange: {
      minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    };
    options: Array<
      Pick<StorefrontAPI.ProductOption, 'name'> & {
        optionValues: Array<
          Pick<StorefrontAPI.ProductOptionValue, 'name'> & {
            swatch?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                image?: StorefrontAPI.Maybe<{
                  previewImage?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.Image, 'url'>
                  >;
                }>;
              }
            >;
          }
        >;
      }
    >;
    variants: {
      nodes: Array<
        Pick<StorefrontAPI.ProductVariant, 'id' | 'availableForSale'>
      >;
    };
    selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.ProductVariant,
        'id' | 'title' | 'availableForSale'
      > & {
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        product: Pick<
          StorefrontAPI.Product,
          'id' | 'title' | 'handle' | 'vendor'
        >;
      }
    >;
  };

export type ProductVariantFragment = Pick<
  StorefrontAPI.ProductVariant,
  'availableForSale' | 'id' | 'sku' | 'title'
> & {
  compareAtPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  product: Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle'>;
  selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
  unitPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
};

export type ProductFragment = Pick<
  StorefrontAPI.Product,
  | 'id'
  | 'title'
  | 'vendor'
  | 'handle'
  | 'description'
  | 'descriptionHtml'
  | 'encodedVariantExistence'
  | 'encodedVariantAvailability'
> & {
  options: Array<
    Pick<StorefrontAPI.ProductOption, 'name'> & {
      optionValues: Array<
        Pick<StorefrontAPI.ProductOptionValue, 'name'> & {
          firstSelectableVariant?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.ProductVariant,
              'availableForSale' | 'id' | 'sku' | 'title'
            > & {
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              product: Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle'>;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              unitPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
            }
          >;
          swatch?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
              image?: StorefrontAPI.Maybe<{
                previewImage?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Image, 'url'>
                >;
              }>;
            }
          >;
        }
      >;
    }
  >;
  selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.ProductVariant,
      'availableForSale' | 'id' | 'sku' | 'title'
    > & {
      compareAtPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
      >;
      price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      product: Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle'>;
      selectedOptions: Array<
        Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
      >;
      unitPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
    }
  >;
  adjacentVariants: Array<
    Pick<
      StorefrontAPI.ProductVariant,
      'availableForSale' | 'id' | 'sku' | 'title'
    > & {
      compareAtPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
      >;
      price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      product: Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle'>;
      selectedOptions: Array<
        Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
      >;
      unitPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
    }
  >;
  media: {
    nodes: Array<
      | ({__typename: 'ExternalVideo'} & Pick<
          StorefrontAPI.ExternalVideo,
          'embeddedUrl' | 'host' | 'id' | 'alt'
        > & {
            previewImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
          })
      | ({__typename: 'MediaImage'} & Pick<
          StorefrontAPI.MediaImage,
          'id' | 'alt'
        > & {
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            previewImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
          })
      | ({__typename: 'Model3d'} & Pick<StorefrontAPI.Model3d, 'id' | 'alt'> & {
            previewImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
          })
      | ({__typename: 'Video'} & Pick<StorefrontAPI.Video, 'id' | 'alt'> & {
            sources: Array<
              Pick<
                StorefrontAPI.VideoSource,
                'url' | 'mimeType' | 'format' | 'width' | 'height'
              >
            >;
            previewImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
          })
    >;
  };
  details?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metafield, 'type' | 'value'>
  >;
  care?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Metafield, 'type' | 'value'>>;
  sizeGuide?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Metafield, 'type' | 'value'>
  >;
  seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
};

export type ProductQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  selectedOptions:
    | Array<StorefrontAPI.SelectedOptionInput>
    | StorefrontAPI.SelectedOptionInput;
  variantId: StorefrontAPI.Scalars['ID']['input'];
  hasVariant: StorefrontAPI.Scalars['Boolean']['input'];
}>;

export type ProductQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      | 'id'
      | 'title'
      | 'vendor'
      | 'handle'
      | 'description'
      | 'descriptionHtml'
      | 'encodedVariantExistence'
      | 'encodedVariantAvailability'
    > & {
      options: Array<
        Pick<StorefrontAPI.ProductOption, 'name'> & {
          optionValues: Array<
            Pick<StorefrontAPI.ProductOptionValue, 'name'> & {
              firstSelectableVariant?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'availableForSale' | 'id' | 'sku' | 'title'
                > & {
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  product: Pick<
                    StorefrontAPI.Product,
                    'id' | 'title' | 'handle'
                  >;
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  unitPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                }
              >;
              swatch?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                  image?: StorefrontAPI.Maybe<{
                    previewImage?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Image, 'url'>
                    >;
                  }>;
                }
              >;
            }
          >;
        }
      >;
      selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.ProductVariant,
          'availableForSale' | 'id' | 'sku' | 'title'
        > & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          product: Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle'>;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          unitPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
        }
      >;
      adjacentVariants: Array<
        Pick<
          StorefrontAPI.ProductVariant,
          'availableForSale' | 'id' | 'sku' | 'title'
        > & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          product: Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle'>;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          unitPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
        }
      >;
      media: {
        nodes: Array<
          | ({__typename: 'ExternalVideo'} & Pick<
              StorefrontAPI.ExternalVideo,
              'embeddedUrl' | 'host' | 'id' | 'alt'
            > & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
              })
          | ({__typename: 'MediaImage'} & Pick<
              StorefrontAPI.MediaImage,
              'id' | 'alt'
            > & {
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
              })
          | ({__typename: 'Model3d'} & Pick<
              StorefrontAPI.Model3d,
              'id' | 'alt'
            > & {
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
              })
          | ({__typename: 'Video'} & Pick<StorefrontAPI.Video, 'id' | 'alt'> & {
                sources: Array<
                  Pick<
                    StorefrontAPI.VideoSource,
                    'url' | 'mimeType' | 'format' | 'width' | 'height'
                  >
                >;
                previewImage?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
              })
        >;
      };
      details?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'type' | 'value'>
      >;
      care?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'type' | 'value'>
      >;
      sizeGuide?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Metafield, 'type' | 'value'>
      >;
      seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
    }
  >;
  selectedVariant?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.ProductVariant,
      'availableForSale' | 'id' | 'sku' | 'title'
    > & {
      compareAtPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
      >;
      price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      product: Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle'>;
      selectedOptions: Array<
        Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
      >;
      unitPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
    }
  >;
  shop: {
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'title' | 'handle' | 'body'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'title' | 'handle' | 'body'>
    >;
  };
};

export type StoreRobotsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type StoreRobotsQuery = {shop: Pick<StorefrontAPI.Shop, 'id'>};

export type HomeWardrobeQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type HomeWardrobeQuery = {
  products: {
    nodes: Array<
      {__typename: 'Product'} & Pick<
        StorefrontAPI.Product,
        | 'id'
        | 'handle'
        | 'title'
        | 'description'
        | 'availableForSale'
        | 'trackingParameters'
      > & {
          featuredImage?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          images: {
            nodes: Array<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
          };
          priceRange: {
            minVariantPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
            maxVariantPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
          };
          options: Array<
            Pick<StorefrontAPI.ProductOption, 'name'> & {
              optionValues: Array<
                Pick<StorefrontAPI.ProductOptionValue, 'name'> & {
                  swatch?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                      image?: StorefrontAPI.Maybe<{
                        previewImage?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.Image, 'url'>
                        >;
                      }>;
                    }
                  >;
                }
              >;
            }
          >;
          variants: {
            nodes: Array<
              Pick<StorefrontAPI.ProductVariant, 'id' | 'availableForSale'>
            >;
          };
          selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'title' | 'availableForSale'
            > & {
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              product: Pick<
                StorefrontAPI.Product,
                'id' | 'title' | 'handle' | 'vendor'
              >;
            }
          >;
        }
    >;
  };
  collections: {
    nodes: Array<
      Pick<StorefrontAPI.Collection, 'id' | 'handle' | 'title'> & {
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
      }
    >;
  };
  homepage?: StorefrontAPI.Maybe<{
    fields: Array<Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>>;
  }>;
};

export type HomeEditorialQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type HomeEditorialQuery = {
  campaigns: {
    nodes: Array<
      Pick<StorefrontAPI.Metaobject, 'id'> & {
        fields: Array<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
            reference?: StorefrontAPI.Maybe<
              | {
                  __typename:
                    | 'Article'
                    | 'GenericFile'
                    | 'Metaobject'
                    | 'Model3d'
                    | 'Page'
                    | 'ProductVariant'
                    | 'Video';
                }
              | ({__typename: 'Collection'} & Pick<
                  StorefrontAPI.Collection,
                  'handle'
                >)
              | ({__typename: 'MediaImage'} & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                })
              | ({__typename: 'Product'} & Pick<
                  StorefrontAPI.Product,
                  'handle'
                >)
            >;
          }
        >;
      }
    >;
  };
  faqs: {
    nodes: Array<
      Pick<StorefrontAPI.Metaobject, 'id'> & {
        fields: Array<Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'>>;
      }
    >;
  };
};

export type FavoriteProductsQueryVariables = StorefrontAPI.Exact<{
  ids:
    | Array<StorefrontAPI.Scalars['ID']['input']>
    | StorefrontAPI.Scalars['ID']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type FavoriteProductsQuery = {
  nodes: Array<
    StorefrontAPI.Maybe<
      | {
          __typename:
            | 'AppliedGiftCard'
            | 'Article'
            | 'Blog'
            | 'Cart'
            | 'CartLine'
            | 'Collection'
            | 'Comment'
            | 'Company'
            | 'CompanyContact'
            | 'CompanyLocation'
            | 'ComponentizableCartLine'
            | 'ExternalVideo'
            | 'GenericFile'
            | 'Location'
            | 'MailingAddress'
            | 'Market'
            | 'MediaImage'
            | 'MediaPresentation'
            | 'Menu'
            | 'MenuItem';
        }
      | {
          __typename:
            | 'Metafield'
            | 'Metaobject'
            | 'Model3d'
            | 'Order'
            | 'Page'
            | 'ProductOption'
            | 'ProductOptionValue'
            | 'ProductVariant'
            | 'Shop'
            | 'ShopPayInstallmentsFinancingPlan'
            | 'ShopPayInstallmentsFinancingPlanTerm'
            | 'ShopPayInstallmentsProductVariantPricing'
            | 'ShopPolicy'
            | 'TaxonomyCategory'
            | 'UrlRedirect'
            | 'Video';
        }
      | ({__typename: 'Product'} & Pick<
          StorefrontAPI.Product,
          | 'id'
          | 'handle'
          | 'title'
          | 'description'
          | 'availableForSale'
          | 'trackingParameters'
        > & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            images: {
              nodes: Array<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            };
            priceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              maxVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            options: Array<
              Pick<StorefrontAPI.ProductOption, 'name'> & {
                optionValues: Array<
                  Pick<StorefrontAPI.ProductOptionValue, 'name'> & {
                    swatch?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                        image?: StorefrontAPI.Maybe<{
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.Image, 'url'>
                          >;
                        }>;
                      }
                    >;
                  }
                >;
              }
            >;
            variants: {
              nodes: Array<
                Pick<StorefrontAPI.ProductVariant, 'id' | 'availableForSale'>
              >;
            };
            selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.ProductVariant,
                'id' | 'title' | 'availableForSale'
              > & {
                selectedOptions: Array<
                  Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                >;
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                compareAtPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                >;
                product: Pick<
                  StorefrontAPI.Product,
                  'id' | 'title' | 'handle' | 'vendor'
                >;
              }
            >;
          })
    >
  >;
};

export type PredictiveSearchQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  term: StorefrontAPI.Scalars['String']['input'];
}>;

export type PredictiveSearchQuery = {
  predictiveSearch?: StorefrontAPI.Maybe<{
    products: Array<
      {__typename: 'Product'} & Pick<
        StorefrontAPI.Product,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ProductVariant, 'id'> & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            }
          >;
        }
    >;
    collections: Array<
      {__typename: 'Collection'} & Pick<
        StorefrontAPI.Collection,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
        }
    >;
    pages: Array<
      {__typename: 'Page'} & Pick<
        StorefrontAPI.Page,
        'id' | 'title' | 'handle' | 'trackingParameters'
      >
    >;
    articles: Array<
      {__typename: 'Article'} & Pick<
        StorefrontAPI.Article,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          blog: Pick<StorefrontAPI.Blog, 'handle'>;
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
        }
    >;
    queries: Array<
      {__typename: 'SearchQuerySuggestion'} & Pick<
        StorefrontAPI.SearchQuerySuggestion,
        'text' | 'styledText' | 'trackingParameters'
      >
    >;
  }>;
};

export type QuickViewQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type QuickViewQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle' | 'description'> & {
      featuredImage?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
      >;
      options: Array<
        Pick<StorefrontAPI.ProductOption, 'name'> & {
          optionValues: Array<
            Pick<StorefrontAPI.ProductOptionValue, 'name'> & {
              swatch?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                  image?: StorefrontAPI.Maybe<{
                    previewImage?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Image, 'url'>
                    >;
                  }>;
                }
              >;
            }
          >;
        }
      >;
      variants: {
        nodes: Array<
          Pick<
            StorefrontAPI.ProductVariant,
            'availableForSale' | 'id' | 'sku' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            product: Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle'>;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
            unitPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
          }
        >;
        pageInfo: Pick<StorefrontAPI.PageInfo, 'hasNextPage'>;
      };
    }
  >;
};

export type RecentProductsQueryVariables = StorefrontAPI.Exact<{
  ids:
    | Array<StorefrontAPI.Scalars['ID']['input']>
    | StorefrontAPI.Scalars['ID']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type RecentProductsQuery = {
  nodes: Array<
    StorefrontAPI.Maybe<
      | {
          __typename:
            | 'AppliedGiftCard'
            | 'Article'
            | 'Blog'
            | 'Cart'
            | 'CartLine'
            | 'Collection'
            | 'Comment'
            | 'Company'
            | 'CompanyContact'
            | 'CompanyLocation'
            | 'ComponentizableCartLine'
            | 'ExternalVideo'
            | 'GenericFile'
            | 'Location'
            | 'MailingAddress'
            | 'Market'
            | 'MediaImage'
            | 'MediaPresentation'
            | 'Menu'
            | 'MenuItem';
        }
      | {
          __typename:
            | 'Metafield'
            | 'Metaobject'
            | 'Model3d'
            | 'Order'
            | 'Page'
            | 'ProductOption'
            | 'ProductOptionValue'
            | 'ProductVariant'
            | 'Shop'
            | 'ShopPayInstallmentsFinancingPlan'
            | 'ShopPayInstallmentsFinancingPlanTerm'
            | 'ShopPayInstallmentsProductVariantPricing'
            | 'ShopPolicy'
            | 'TaxonomyCategory'
            | 'UrlRedirect'
            | 'Video';
        }
      | ({__typename: 'Product'} & Pick<
          StorefrontAPI.Product,
          | 'id'
          | 'handle'
          | 'title'
          | 'description'
          | 'availableForSale'
          | 'trackingParameters'
        > & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            images: {
              nodes: Array<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            };
            priceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              maxVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            options: Array<
              Pick<StorefrontAPI.ProductOption, 'name'> & {
                optionValues: Array<
                  Pick<StorefrontAPI.ProductOptionValue, 'name'> & {
                    swatch?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                        image?: StorefrontAPI.Maybe<{
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.Image, 'url'>
                          >;
                        }>;
                      }
                    >;
                  }
                >;
              }
            >;
            variants: {
              nodes: Array<
                Pick<StorefrontAPI.ProductVariant, 'id' | 'availableForSale'>
              >;
            };
            selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.ProductVariant,
                'id' | 'title' | 'availableForSale'
              > & {
                selectedOptions: Array<
                  Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                >;
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                compareAtPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                >;
                product: Pick<
                  StorefrontAPI.Product,
                  'id' | 'title' | 'handle' | 'vendor'
                >;
              }
            >;
          })
    >
  >;
};

export type ArticleQueryVariables = StorefrontAPI.Exact<{
  articleHandle: StorefrontAPI.Scalars['String']['input'];
  blogHandle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ArticleQuery = {
  blog?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Blog, 'handle' | 'title'> & {
      articleByHandle?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.Article,
          'handle' | 'title' | 'contentHtml' | 'publishedAt' | 'tags'
        > & {
          author?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ArticleAuthor, 'name'>
          >;
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'altText' | 'url' | 'width' | 'height'
            >
          >;
          seo?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Seo, 'description' | 'title'>
          >;
        }
      >;
    }
  >;
};

export type BlogQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  blogHandle: StorefrontAPI.Scalars['String']['input'];
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type BlogQuery = {
  blog?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Blog, 'title' | 'handle'> & {
      seo?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Seo, 'title' | 'description'>
      >;
      articles: {
        nodes: Array<
          Pick<
            StorefrontAPI.Article,
            'excerpt' | 'handle' | 'id' | 'publishedAt' | 'title'
          > & {
            author?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.ArticleAuthor, 'name'>
            >;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
            blog: Pick<StorefrontAPI.Blog, 'handle'>;
          }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
        >;
      };
    }
  >;
};

export type ArticleItemFragment = Pick<
  StorefrontAPI.Article,
  'excerpt' | 'handle' | 'id' | 'publishedAt' | 'title'
> & {
  author?: StorefrontAPI.Maybe<Pick<StorefrontAPI.ArticleAuthor, 'name'>>;
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  blog: Pick<StorefrontAPI.Blog, 'handle'>;
};

export type BlogsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type BlogsQuery = {
  blogs: {
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
    >;
    nodes: Array<
      Pick<StorefrontAPI.Blog, 'title' | 'handle'> & {
        seo?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Seo, 'title' | 'description'>
        >;
        articles: {
          nodes: Array<
            Pick<StorefrontAPI.Article, 'handle' | 'title' | 'excerpt'> & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'altText' | 'url' | 'width' | 'height'
                >
              >;
            }
          >;
        };
      }
    >;
  };
};

export type EditorialCatalogueQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type EditorialCatalogueQuery = {
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'title' | 'handle'> & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
      }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
    >;
  };
  lookbook: {
    nodes: Array<
      Pick<StorefrontAPI.Metaobject, 'id'> & {
        fields: Array<
          Pick<StorefrontAPI.MetaobjectField, 'key' | 'value'> & {
            reference?: StorefrontAPI.Maybe<
              | {
                  __typename:
                    | 'Article'
                    | 'Collection'
                    | 'GenericFile'
                    | 'Metaobject'
                    | 'Model3d'
                    | 'Page'
                    | 'ProductVariant'
                    | 'Video';
                }
              | ({__typename: 'MediaImage'} & {
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                })
              | ({__typename: 'Product'} & Pick<
                  StorefrontAPI.Product,
                  'handle' | 'title'
                > & {
                    featuredImage?: StorefrontAPI.Maybe<
                      Pick<
                        StorefrontAPI.Image,
                        'id' | 'url' | 'altText' | 'width' | 'height'
                      >
                    >;
                  })
            >;
          }
        >;
      }
    >;
  };
};

export type MerchandisingCollectionQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  filters?: StorefrontAPI.InputMaybe<
    Array<StorefrontAPI.ProductFilter> | StorefrontAPI.ProductFilter
  >;
  sortKey: StorefrontAPI.ProductCollectionSortKeys;
  reverse: StorefrontAPI.Scalars['Boolean']['input'];
}>;

export type MerchandisingCollectionQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Collection,
      'id' | 'handle' | 'title' | 'description'
    > & {
      seo: Pick<StorefrontAPI.Seo, 'title' | 'description'>;
      image?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
      >;
      products: {
        filters: Array<
          Pick<
            StorefrontAPI.Filter,
            'id' | 'label' | 'type' | 'presentation'
          > & {
            values: Array<
              Pick<
                StorefrontAPI.FilterValue,
                'id' | 'label' | 'count' | 'input'
              > & {
                swatch?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Swatch, 'color'> & {
                    image?: StorefrontAPI.Maybe<{
                      previewImage?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.Image,
                          'url' | 'altText' | 'width' | 'height'
                        >
                      >;
                    }>;
                  }
                >;
                image?: StorefrontAPI.Maybe<{
                  previewImage?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                }>;
              }
            >;
          }
        >;
        nodes: Array<
          {__typename: 'Product'} & Pick<
            StorefrontAPI.Product,
            | 'id'
            | 'handle'
            | 'title'
            | 'description'
            | 'availableForSale'
            | 'trackingParameters'
          > & {
              featuredImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
              images: {
                nodes: Array<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
              };
              priceRange: {
                minVariantPrice: Pick<
                  StorefrontAPI.MoneyV2,
                  'amount' | 'currencyCode'
                >;
                maxVariantPrice: Pick<
                  StorefrontAPI.MoneyV2,
                  'amount' | 'currencyCode'
                >;
              };
              options: Array<
                Pick<StorefrontAPI.ProductOption, 'name'> & {
                  optionValues: Array<
                    Pick<StorefrontAPI.ProductOptionValue, 'name'> & {
                      swatch?: StorefrontAPI.Maybe<
                        Pick<
                          StorefrontAPI.ProductOptionValueSwatch,
                          'color'
                        > & {
                          image?: StorefrontAPI.Maybe<{
                            previewImage?: StorefrontAPI.Maybe<
                              Pick<StorefrontAPI.Image, 'url'>
                            >;
                          }>;
                        }
                      >;
                    }
                  >;
                }
              >;
              variants: {
                nodes: Array<
                  Pick<StorefrontAPI.ProductVariant, 'id' | 'availableForSale'>
                >;
              };
              selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'id' | 'title' | 'availableForSale'
                > & {
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  image?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  product: Pick<
                    StorefrontAPI.Product,
                    'id' | 'title' | 'handle' | 'vendor'
                  >;
                }
              >;
            }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'startCursor' | 'endCursor'
        >;
      };
    }
  >;
};

export type MerchandisingCollectionsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type MerchandisingCollectionsQuery = {
  collections: {
    nodes: Array<
      Pick<
        StorefrontAPI.Collection,
        'id' | 'handle' | 'title' | 'description'
      > & {
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
        >;
      }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasPreviousPage' | 'hasNextPage' | 'startCursor' | 'endCursor'
    >;
  };
};

export type AllProductsCatalogQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  filters?: StorefrontAPI.InputMaybe<
    Array<StorefrontAPI.ProductFilter> | StorefrontAPI.ProductFilter
  >;
  sortKey: StorefrontAPI.SearchSortKeys;
  reverse: StorefrontAPI.Scalars['Boolean']['input'];
}>;

export type AllProductsCatalogQuery = {
  catalog: Pick<StorefrontAPI.SearchResultItemConnection, 'totalCount'> & {
    productFilters: Array<
      Pick<StorefrontAPI.Filter, 'id' | 'label' | 'type' | 'presentation'> & {
        values: Array<
          Pick<
            StorefrontAPI.FilterValue,
            'id' | 'label' | 'count' | 'input'
          > & {
            swatch?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Swatch, 'color'> & {
                image?: StorefrontAPI.Maybe<{
                  previewImage?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                }>;
              }
            >;
            image?: StorefrontAPI.Maybe<{
              previewImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
            }>;
          }
        >;
      }
    >;
    nodes: Array<
      | {__typename: 'Article' | 'Page'}
      | ({__typename: 'Product'} & Pick<
          StorefrontAPI.Product,
          | 'id'
          | 'handle'
          | 'title'
          | 'description'
          | 'availableForSale'
          | 'trackingParameters'
        > & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            images: {
              nodes: Array<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            };
            priceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              maxVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            options: Array<
              Pick<StorefrontAPI.ProductOption, 'name'> & {
                optionValues: Array<
                  Pick<StorefrontAPI.ProductOptionValue, 'name'> & {
                    swatch?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                        image?: StorefrontAPI.Maybe<{
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.Image, 'url'>
                          >;
                        }>;
                      }
                    >;
                  }
                >;
              }
            >;
            variants: {
              nodes: Array<
                Pick<StorefrontAPI.ProductVariant, 'id' | 'availableForSale'>
              >;
            };
            selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.ProductVariant,
                'id' | 'title' | 'availableForSale'
              > & {
                selectedOptions: Array<
                  Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                >;
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                compareAtPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                >;
                product: Pick<
                  StorefrontAPI.Product,
                  'id' | 'title' | 'handle' | 'vendor'
                >;
              }
            >;
          })
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasPreviousPage' | 'hasNextPage' | 'startCursor' | 'endCursor'
    >;
  };
};

export type ContactPageQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ContactPageQuery = {
  page?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Page, 'body'>>;
  shop: {
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body'>
    >;
  };
};

export type StoreFaqQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type StoreFaqQuery = {
  metaobjects: {
    nodes: Array<
      Pick<StorefrontAPI.Metaobject, 'id'> & {
        question?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
        answer?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MetaobjectField, 'value'>
        >;
      }
    >;
  };
};

export type PageQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type PageQuery = {
  page?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Page, 'handle' | 'id' | 'title' | 'body'> & {
      seo?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Seo, 'description' | 'title'>
      >;
    }
  >;
};

export type PolicyFragment = Pick<
  StorefrontAPI.ShopPolicy,
  'body' | 'handle' | 'id' | 'title' | 'url'
>;

export type PolicyQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type PolicyQuery = {
  shop: {
    privacyPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    termsOfService?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    subscriptionPolicy?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.ShopPolicyWithDefault,
        'body' | 'handle' | 'id' | 'title' | 'url'
      >
    >;
  };
};

export type PolicyItemFragment = Pick<
  StorefrontAPI.ShopPolicy,
  'id' | 'title' | 'handle'
>;

export type PoliciesQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type PoliciesQuery = {
  shop: {
    privacyPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    termsOfService?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    subscriptionPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicyWithDefault, 'id' | 'title' | 'handle'>
    >;
  };
};

export type ProductRecommendationsQueryVariables = StorefrontAPI.Exact<{
  productId: StorefrontAPI.Scalars['ID']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ProductRecommendationsQuery = {
  productRecommendations?: StorefrontAPI.Maybe<
    Array<
      {__typename: 'Product'} & Pick<
        StorefrontAPI.Product,
        | 'id'
        | 'handle'
        | 'title'
        | 'description'
        | 'availableForSale'
        | 'trackingParameters'
      > & {
          featuredImage?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          images: {
            nodes: Array<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
          };
          priceRange: {
            minVariantPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
            maxVariantPrice: Pick<
              StorefrontAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
          };
          options: Array<
            Pick<StorefrontAPI.ProductOption, 'name'> & {
              optionValues: Array<
                Pick<StorefrontAPI.ProductOptionValue, 'name'> & {
                  swatch?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                      image?: StorefrontAPI.Maybe<{
                        previewImage?: StorefrontAPI.Maybe<
                          Pick<StorefrontAPI.Image, 'url'>
                        >;
                      }>;
                    }
                  >;
                }
              >;
            }
          >;
          variants: {
            nodes: Array<
              Pick<StorefrontAPI.ProductVariant, 'id' | 'availableForSale'>
            >;
          };
          selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.ProductVariant,
              'id' | 'title' | 'availableForSale'
            > & {
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              product: Pick<
                StorefrontAPI.Product,
                'id' | 'title' | 'handle' | 'vendor'
              >;
            }
          >;
        }
    >
  >;
};

export type RegularSearchQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  term: StorefrontAPI.Scalars['String']['input'];
  filters?: StorefrontAPI.InputMaybe<
    Array<StorefrontAPI.ProductFilter> | StorefrontAPI.ProductFilter
  >;
  sortKey: StorefrontAPI.SearchSortKeys;
  reverse: StorefrontAPI.Scalars['Boolean']['input'];
  articleFirst?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['Int']['input']
  >;
  articleLast?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  articleStart?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  articleEnd?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  pageFirst?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  pageLast?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  pageStart?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  pageEnd?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['String']['input']>;
}>;

export type RegularSearchQuery = {
  products: Pick<StorefrontAPI.SearchResultItemConnection, 'totalCount'> & {
    productFilters: Array<
      Pick<StorefrontAPI.Filter, 'id' | 'label' | 'type' | 'presentation'> & {
        values: Array<
          Pick<
            StorefrontAPI.FilterValue,
            'id' | 'label' | 'count' | 'input'
          > & {
            swatch?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Swatch, 'color'> & {
                image?: StorefrontAPI.Maybe<{
                  previewImage?: StorefrontAPI.Maybe<
                    Pick<
                      StorefrontAPI.Image,
                      'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                }>;
              }
            >;
            image?: StorefrontAPI.Maybe<{
              previewImage?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
            }>;
          }
        >;
      }
    >;
    nodes: Array<
      | {__typename: 'Article' | 'Page'}
      | ({__typename: 'Product'} & Pick<
          StorefrontAPI.Product,
          | 'id'
          | 'handle'
          | 'title'
          | 'description'
          | 'availableForSale'
          | 'trackingParameters'
        > & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            images: {
              nodes: Array<
                Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
            };
            priceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              maxVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
            options: Array<
              Pick<StorefrontAPI.ProductOption, 'name'> & {
                optionValues: Array<
                  Pick<StorefrontAPI.ProductOptionValue, 'name'> & {
                    swatch?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                        image?: StorefrontAPI.Maybe<{
                          previewImage?: StorefrontAPI.Maybe<
                            Pick<StorefrontAPI.Image, 'url'>
                          >;
                        }>;
                      }
                    >;
                  }
                >;
              }
            >;
            variants: {
              nodes: Array<
                Pick<StorefrontAPI.ProductVariant, 'id' | 'availableForSale'>
              >;
            };
            selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.ProductVariant,
                'id' | 'title' | 'availableForSale'
              > & {
                selectedOptions: Array<
                  Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                >;
                image?: StorefrontAPI.Maybe<
                  Pick<
                    StorefrontAPI.Image,
                    'id' | 'url' | 'altText' | 'width' | 'height'
                  >
                >;
                price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                compareAtPrice?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                >;
                product: Pick<
                  StorefrontAPI.Product,
                  'id' | 'title' | 'handle' | 'vendor'
                >;
              }
            >;
          })
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasPreviousPage' | 'hasNextPage' | 'startCursor' | 'endCursor'
    >;
  };
  articles: Pick<StorefrontAPI.SearchResultItemConnection, 'totalCount'> & {
    nodes: Array<
      | ({__typename: 'Article'} & Pick<
          StorefrontAPI.Article,
          'id' | 'title' | 'handle' | 'trackingParameters'
        > & {blog: Pick<StorefrontAPI.Blog, 'handle'>})
      | {__typename: 'Page' | 'Product'}
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasPreviousPage' | 'hasNextPage' | 'startCursor' | 'endCursor'
    >;
  };
  pages: Pick<StorefrontAPI.SearchResultItemConnection, 'totalCount'> & {
    nodes: Array<
      | {__typename: 'Article' | 'Product'}
      | ({__typename: 'Page'} & Pick<
          StorefrontAPI.Page,
          'id' | 'title' | 'handle' | 'trackingParameters'
        >)
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasPreviousPage' | 'hasNextPage' | 'startCursor' | 'endCursor'
    >;
  };
};

export type SitemapPoliciesQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type SitemapPoliciesQuery = {
  shop: {
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'handle'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'handle'>
    >;
    privacyPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'handle'>
    >;
    termsOfService?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'handle'>
    >;
    subscriptionPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicyWithDefault, 'handle'>
    >;
  };
};

interface GeneratedQueryTypes {
  '#graphql\n  fragment Shop on Shop {\n    id\n    name\n    description\n    primaryDomain {\n      url\n    }\n    brand {\n      logo {\n        image {\n          url\n        }\n      }\n    }\n  }\n  query Header(\n    $country: CountryCode\n    $headerMenuHandle: String!\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    shop {\n      ...Shop\n    }\n    menu(handle: $headerMenuHandle) {\n      ...Menu\n    }\n  }\n  #graphql\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n  }\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n\n': {
    return: HeaderQuery;
    variables: HeaderQueryVariables;
  };
  '#graphql\n  query Footer(\n    $country: CountryCode\n    $footerMenuHandle: String!\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    menu(handle: $footerMenuHandle) {\n      ...Menu\n    }\n  }\n  #graphql\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n  }\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n\n': {
    return: FooterQuery;
    variables: FooterQueryVariables;
  };
  '#graphql\n  query Product(\n    $country: CountryCode\n    $handle: String!\n    $language: LanguageCode\n    $selectedOptions: [SelectedOptionInput!]!\n    $variantId: ID!\n    $hasVariant: Boolean!\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $handle) { ...Product }\n    selectedVariant: node(id: $variantId) @include(if: $hasVariant) {\n      ... on ProductVariant { ...ProductVariant }\n    }\n    shop {\n      shippingPolicy { title handle body }\n      refundPolicy { title handle body }\n    }\n  }\n  #graphql\n  fragment Product on Product {\n    id title vendor handle description descriptionHtml\n    encodedVariantExistence encodedVariantAvailability\n    options {\n      name\n      optionValues {\n        name\n        firstSelectableVariant { ...ProductVariant }\n        swatch { color image { previewImage { url } } }\n      }\n    }\n    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) { ...ProductVariant }\n    adjacentVariants(selectedOptions: $selectedOptions) { ...ProductVariant }\n    media(first: 40) {\n      nodes {\n        __typename id alt\n        previewImage { id url altText width height }\n        ... on MediaImage { image { id url altText width height } }\n        ... on Video { sources { url mimeType format width height } }\n        ... on ExternalVideo { embeddedUrl host }\n      }\n    }\n    details: metafield(namespace: "storefront", key: "details") { type value }\n    care: metafield(namespace: "storefront", key: "care") { type value }\n    sizeGuide: metafield(namespace: "storefront", key: "size_guide") { type value }\n    seo { description title }\n  }\n  #graphql\n  fragment ProductVariant on ProductVariant {\n    availableForSale\n    compareAtPrice { amount currencyCode }\n    id\n    image { id url altText width height }\n    price { amount currencyCode }\n    product { id title handle }\n    selectedOptions { name value }\n    sku\n    title\n    unitPrice { amount currencyCode }\n  }\n\n\n': {
    return: ProductQuery;
    variables: ProductQueryVariables;
  };
  '#graphql\n  query StoreRobots($country: CountryCode, $language: LanguageCode)\n   @inContext(country: $country, language: $language) {\n    shop {\n      id\n    }\n  }\n': {
    return: StoreRobotsQuery;
    variables: StoreRobotsQueryVariables;
  };
  '#graphql\n query HomeWardrobe($country: CountryCode, $language: LanguageCode) @inContext(country:$country, language:$language) {\n   products(first:8, sortKey:CREATED_AT, reverse:true) { nodes { ...ProductCard } }\n   collections(first:3) { nodes { id handle title image { id url altText width height } } }\n   homepage: metaobject(handle:{type:"storefront_homepage",handle:"homepage"}) { fields { key value } }\n }\n #graphql\n  fragment ProductCard on Product {\n    __typename id handle title description availableForSale trackingParameters\n    featuredImage { id url altText width height }\n    images(first: 2) { nodes { id url altText width height } }\n    priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }\n    options { name optionValues { name swatch { color image { previewImage { url } } } } }\n    variants(first: 2) { nodes { id availableForSale } }\n    selectedOrFirstAvailableVariant { id title availableForSale selectedOptions { name value } image { id url altText width height } price { amount currencyCode } compareAtPrice { amount currencyCode } product { id title handle vendor } }\n  }\n\n': {
    return: HomeWardrobeQuery;
    variables: HomeWardrobeQueryVariables;
  };
  '#graphql\n query HomeEditorial($country:CountryCode,$language:LanguageCode) @inContext(country:$country,language:$language) {\n  campaigns: metaobjects(type:"storefront_campaign", first:6) { nodes { id fields { key value reference { __typename ... on MediaImage { image { id url altText width height } } ... on Product { handle } ... on Collection { handle } } } } }\n  faqs: metaobjects(type:"storefront_faq",first:5) { nodes { id fields { key value } } }\n }\n': {
    return: HomeEditorialQuery;
    variables: HomeEditorialQueryVariables;
  };
  '#graphql\n query FavoriteProducts($ids:[ID!]!,$country:CountryCode,$language:LanguageCode) @inContext(country:$country,language:$language) { nodes(ids:$ids) { __typename ... on Product { ...ProductCard } } }\n #graphql\n  fragment ProductCard on Product {\n    __typename id handle title description availableForSale trackingParameters\n    featuredImage { id url altText width height }\n    images(first: 2) { nodes { id url altText width height } }\n    priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }\n    options { name optionValues { name swatch { color image { previewImage { url } } } } }\n    variants(first: 2) { nodes { id availableForSale } }\n    selectedOrFirstAvailableVariant { id title availableForSale selectedOptions { name value } image { id url altText width height } price { amount currencyCode } compareAtPrice { amount currencyCode } product { id title handle vendor } }\n  }\n\n': {
    return: FavoriteProductsQuery;
    variables: FavoriteProductsQueryVariables;
  };
  '#graphql\n  query PredictiveSearch($country: CountryCode, $language: LanguageCode, $term: String!) @inContext(country: $country, language: $language) {\n    predictiveSearch(query: $term, limit: 5, limitScope: EACH, types: [PRODUCT, COLLECTION, PAGE, ARTICLE, QUERY], unavailableProducts: SHOW) {\n      products {\n        __typename id title handle trackingParameters\n        selectedOrFirstAvailableVariant { id image { url altText width height } price { amount currencyCode } }\n      }\n      collections { __typename id title handle trackingParameters image { url altText width height } }\n      pages { __typename id title handle trackingParameters }\n      articles { __typename id title handle trackingParameters blog { handle } image { url altText width height } }\n      queries { __typename text styledText trackingParameters }\n    }\n  }\n': {
    return: PredictiveSearchQuery;
    variables: PredictiveSearchQueryVariables;
  };
  '#graphql\n  query QuickView($handle: String!, $country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      id title handle description\n      featuredImage { id url altText width height }\n      options { name optionValues { name swatch { color image { previewImage { url } } } } }\n      variants(first: 250) { nodes { ...ProductVariant } pageInfo { hasNextPage } }\n    }\n  }\n  #graphql\n  fragment ProductVariant on ProductVariant {\n    availableForSale\n    compareAtPrice { amount currencyCode }\n    id\n    image { id url altText width height }\n    price { amount currencyCode }\n    product { id title handle }\n    selectedOptions { name value }\n    sku\n    title\n    unitPrice { amount currencyCode }\n  }\n\n': {
    return: QuickViewQuery;
    variables: QuickViewQueryVariables;
  };
  '#graphql\n  query RecentProducts($ids: [ID!]!, $country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {\n    nodes(ids: $ids) { __typename ... on Product { ...ProductCard } }\n  }\n  #graphql\n  fragment ProductCard on Product {\n    __typename id handle title description availableForSale trackingParameters\n    featuredImage { id url altText width height }\n    images(first: 2) { nodes { id url altText width height } }\n    priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }\n    options { name optionValues { name swatch { color image { previewImage { url } } } } }\n    variants(first: 2) { nodes { id availableForSale } }\n    selectedOrFirstAvailableVariant { id title availableForSale selectedOptions { name value } image { id url altText width height } price { amount currencyCode } compareAtPrice { amount currencyCode } product { id title handle vendor } }\n  }\n\n': {
    return: RecentProductsQuery;
    variables: RecentProductsQueryVariables;
  };
  '#graphql\n  query Article($articleHandle:String!,$blogHandle:String!,$country:CountryCode,$language:LanguageCode)\n  @inContext(language:$language,country:$country) {\n    blog(handle:$blogHandle) {handle title articleByHandle(handle:$articleHandle) {handle title contentHtml publishedAt tags author:authorV2 {name} image {id altText url width height} seo {description title}}}\n  }\n': {
    return: ArticleQuery;
    variables: ArticleQueryVariables;
  };
  '#graphql\n  query Blog($language:LanguageCode,$country:CountryCode,$blogHandle:String!,$first:Int,$last:Int,$startCursor:String,$endCursor:String)\n  @inContext(language:$language,country:$country) {\n    blog(handle:$blogHandle) {\n      title handle seo {title description}\n      articles(first:$first,last:$last,before:$startCursor,after:$endCursor,reverse:true) {\n        nodes {...ArticleItem}\n        pageInfo {hasPreviousPage hasNextPage endCursor startCursor}\n      }\n    }\n  }\n  fragment ArticleItem on Article {\n    author:authorV2 {name}\n    excerpt handle id image {id altText url width height} publishedAt title blog {handle}\n  }\n': {
    return: BlogQuery;
    variables: BlogQueryVariables;
  };
  '#graphql\n  query Blogs($country:CountryCode,$language:LanguageCode,$first:Int,$last:Int,$startCursor:String,$endCursor:String)\n  @inContext(country:$country,language:$language) {\n    blogs(first:$first,last:$last,before:$startCursor,after:$endCursor) {\n      pageInfo {hasNextPage hasPreviousPage startCursor endCursor}\n      nodes {title handle seo {title description} articles(first:2,reverse:true) {nodes {handle title excerpt image {id altText url width height}}}}\n    }\n  }\n': {
    return: BlogsQuery;
    variables: BlogsQueryVariables;
  };
  '#graphql\n query EditorialCatalogue($country:CountryCode,$language:LanguageCode,$first:Int,$last:Int,$startCursor:String,$endCursor:String) @inContext(country:$country,language:$language) {\n  products(first:$first,last:$last,before:$startCursor,after:$endCursor) { nodes { id title handle featuredImage { id url altText width height } priceRange { minVariantPrice {amount currencyCode} } } pageInfo { hasNextPage hasPreviousPage startCursor endCursor } }\n  lookbook: metaobjects(type:"storefront_lookbook",first:24) { nodes { id fields { key value reference { __typename ... on Product { handle title featuredImage { id url altText width height } } ... on MediaImage { image { id url altText width height } } } } } }\n }\n': {
    return: EditorialCatalogueQuery;
    variables: EditorialCatalogueQueryVariables;
  };
  '#graphql\n  query MerchandisingCollection($handle: String!, $country: CountryCode, $language: LanguageCode, $first: Int, $last: Int, $startCursor: String, $endCursor: String, $filters: [ProductFilter!], $sortKey: ProductCollectionSortKeys!, $reverse: Boolean!) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      id handle title description seo { title description }\n      image { url altText width height }\n      products(first: $first, last: $last, before: $startCursor, after: $endCursor, filters: $filters, sortKey: $sortKey, reverse: $reverse) {\n        filters { ...CatalogFilter }\n        nodes { ...ProductCard }\n        pageInfo { hasPreviousPage hasNextPage startCursor endCursor }\n      }\n    }\n  }\n  #graphql\n  fragment ProductCard on Product {\n    __typename id handle title description availableForSale trackingParameters\n    featuredImage { id url altText width height }\n    images(first: 2) { nodes { id url altText width height } }\n    priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }\n    options { name optionValues { name swatch { color image { previewImage { url } } } } }\n    variants(first: 2) { nodes { id availableForSale } }\n    selectedOrFirstAvailableVariant { id title availableForSale selectedOptions { name value } image { id url altText width height } price { amount currencyCode } compareAtPrice { amount currencyCode } product { id title handle vendor } }\n  }\n\n  #graphql\n  fragment CatalogFilter on Filter {\n    id label type presentation\n    values {\n      id label count input\n      swatch { color image { previewImage { url altText width height } } }\n      image { previewImage { url altText width height } }\n    }\n  }\n\n': {
    return: MerchandisingCollectionQuery;
    variables: MerchandisingCollectionQueryVariables;
  };
  '#graphql\n  query MerchandisingCollections($country: CountryCode, $language: LanguageCode, $first: Int, $last: Int, $startCursor: String, $endCursor: String) @inContext(country: $country, language: $language) {\n    collections(first: $first, last: $last, before: $startCursor, after: $endCursor) {\n      nodes { id handle title description image { url altText width height } }\n      pageInfo { hasPreviousPage hasNextPage startCursor endCursor }\n    }\n  }\n': {
    return: MerchandisingCollectionsQuery;
    variables: MerchandisingCollectionsQueryVariables;
  };
  '#graphql\n  query AllProductsCatalog($country: CountryCode, $language: LanguageCode, $first: Int, $last: Int, $startCursor: String, $endCursor: String, $filters: [ProductFilter!], $sortKey: SearchSortKeys!, $reverse: Boolean!) @inContext(country: $country, language: $language) {\n    catalog: search(query: "", types: [PRODUCT], first: $first, last: $last, before: $startCursor, after: $endCursor, productFilters: $filters, sortKey: $sortKey, reverse: $reverse, unavailableProducts: SHOW) {\n      totalCount\n      productFilters { ...CatalogFilter }\n      nodes { __typename ... on Product { ...ProductCard } }\n      pageInfo { hasPreviousPage hasNextPage startCursor endCursor }\n    }\n  }\n  #graphql\n  fragment ProductCard on Product {\n    __typename id handle title description availableForSale trackingParameters\n    featuredImage { id url altText width height }\n    images(first: 2) { nodes { id url altText width height } }\n    priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }\n    options { name optionValues { name swatch { color image { previewImage { url } } } } }\n    variants(first: 2) { nodes { id availableForSale } }\n    selectedOrFirstAvailableVariant { id title availableForSale selectedOptions { name value } image { id url altText width height } price { amount currencyCode } compareAtPrice { amount currencyCode } product { id title handle vendor } }\n  }\n\n  #graphql\n  fragment CatalogFilter on Filter {\n    id label type presentation\n    values {\n      id label count input\n      swatch { color image { previewImage { url altText width height } } }\n      image { previewImage { url altText width height } }\n    }\n  }\n\n': {
    return: AllProductsCatalogQuery;
    variables: AllProductsCatalogQueryVariables;
  };
  '#graphql\n  query ContactPage($country:CountryCode,$language:LanguageCode) @inContext(country:$country,language:$language) {\n    page(handle:"contact") {body}\n    shop {shippingPolicy {body}}\n  }\n': {
    return: ContactPageQuery;
    variables: ContactPageQueryVariables;
  };
  '#graphql\n  query StoreFaq($country:CountryCode,$language:LanguageCode) @inContext(country:$country,language:$language) {\n    metaobjects(type:"storefront_faq", first:50) {nodes {id question:field(key:"question") {value} answer:field(key:"answer") {value}}}\n  }\n': {
    return: StoreFaqQuery;
    variables: StoreFaqQueryVariables;
  };
  '#graphql\n  query Page($language: LanguageCode, $country: CountryCode, $handle: String!)\n  @inContext(language: $language, country: $country) {\n    page(handle: $handle) { handle id title body seo {description title} }\n  }\n': {
    return: PageQuery;
    variables: PageQueryVariables;
  };
  '#graphql\n  fragment Policy on ShopPolicy {body handle id title url}\n  query Policy($country: CountryCode, $language: LanguageCode) @inContext(language:$language,country:$country) {\n    shop {privacyPolicy {...Policy} shippingPolicy {...Policy} termsOfService {...Policy} refundPolicy {...Policy} subscriptionPolicy {body handle id title url}}\n  }\n': {
    return: PolicyQuery;
    variables: PolicyQueryVariables;
  };
  '#graphql\n  fragment PolicyItem on ShopPolicy {id title handle}\n  query Policies($country:CountryCode,$language:LanguageCode) @inContext(country:$country,language:$language) {\n    shop {privacyPolicy {...PolicyItem} shippingPolicy {...PolicyItem} termsOfService {...PolicyItem} refundPolicy {...PolicyItem} subscriptionPolicy {id title handle}}\n  }\n': {
    return: PoliciesQuery;
    variables: PoliciesQueryVariables;
  };
  '#graphql\n  query ProductRecommendations($productId: ID!, $country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {\n    productRecommendations(productId: $productId) { ...ProductCard }\n  }\n  #graphql\n  fragment ProductCard on Product {\n    __typename id handle title description availableForSale trackingParameters\n    featuredImage { id url altText width height }\n    images(first: 2) { nodes { id url altText width height } }\n    priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }\n    options { name optionValues { name swatch { color image { previewImage { url } } } } }\n    variants(first: 2) { nodes { id availableForSale } }\n    selectedOrFirstAvailableVariant { id title availableForSale selectedOptions { name value } image { id url altText width height } price { amount currencyCode } compareAtPrice { amount currencyCode } product { id title handle vendor } }\n  }\n\n': {
    return: ProductRecommendationsQuery;
    variables: ProductRecommendationsQueryVariables;
  };
  '#graphql\n  query RegularSearch($country: CountryCode, $language: LanguageCode, $first: Int, $last: Int, $startCursor: String, $endCursor: String, $term: String!, $filters: [ProductFilter!], $sortKey: SearchSortKeys!, $reverse: Boolean!, $articleFirst: Int, $articleLast: Int, $articleStart: String, $articleEnd: String, $pageFirst: Int, $pageLast: Int, $pageStart: String, $pageEnd: String) @inContext(country: $country, language: $language) {\n    products: search(query: $term, types: [PRODUCT], first: $first, last: $last, before: $startCursor, after: $endCursor, productFilters: $filters, sortKey: $sortKey, reverse: $reverse, unavailableProducts: SHOW) {\n      totalCount productFilters { ...CatalogFilter }\n      nodes { __typename ... on Product { ...ProductCard } }\n      pageInfo { hasPreviousPage hasNextPage startCursor endCursor }\n    }\n    articles: search(query: $term, types: [ARTICLE], first: $articleFirst, last: $articleLast, before: $articleStart, after: $articleEnd) {\n      totalCount\n      nodes { __typename ... on Article { id title handle trackingParameters blog { handle } } }\n      pageInfo { hasPreviousPage hasNextPage startCursor endCursor }\n    }\n    pages: search(query: $term, types: [PAGE], first: $pageFirst, last: $pageLast, before: $pageStart, after: $pageEnd) {\n      totalCount\n      nodes { __typename ... on Page { id title handle trackingParameters } }\n      pageInfo { hasPreviousPage hasNextPage startCursor endCursor }\n    }\n  }\n  #graphql\n  fragment ProductCard on Product {\n    __typename id handle title description availableForSale trackingParameters\n    featuredImage { id url altText width height }\n    images(first: 2) { nodes { id url altText width height } }\n    priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }\n    options { name optionValues { name swatch { color image { previewImage { url } } } } }\n    variants(first: 2) { nodes { id availableForSale } }\n    selectedOrFirstAvailableVariant { id title availableForSale selectedOptions { name value } image { id url altText width height } price { amount currencyCode } compareAtPrice { amount currencyCode } product { id title handle vendor } }\n  }\n\n  #graphql\n  fragment CatalogFilter on Filter {\n    id label type presentation\n    values {\n      id label count input\n      swatch { color image { previewImage { url altText width height } } }\n      image { previewImage { url altText width height } }\n    }\n  }\n\n': {
    return: RegularSearchQuery;
    variables: RegularSearchQueryVariables;
  };
  '#graphql\n  query SitemapPolicies($country:CountryCode,$language:LanguageCode) @inContext(country:$country,language:$language) {\n    shop {shippingPolicy {handle} refundPolicy {handle} privacyPolicy {handle} termsOfService {handle} subscriptionPolicy {handle}}\n  }\n': {
    return: SitemapPoliciesQuery;
    variables: SitemapPoliciesQueryVariables;
  };
}

interface GeneratedMutationTypes {}

declare module '@shopify/hydrogen' {
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
