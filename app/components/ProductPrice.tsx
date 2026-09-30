import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

export function ProductPrice({price, compareAtPrice}: {price?: MoneyV2 | null; compareAtPrice?: MoneyV2 | null}) {
  const sale = !!price && !!compareAtPrice && price.currencyCode === compareAtPrice.currencyCode && Number(compareAtPrice.amount) > Number(price.amount);
  return (
    <div className={`product-price${sale ? ' product-price-on-sale' : ''}`}>
      {price ? <Money data={price} /> : <span>Price unavailable</span>}
      {sale && compareAtPrice && <><span className="sr-only">Original price</span><s><Money data={compareAtPrice} /></s></>}
    </div>
  );
}
