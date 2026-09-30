import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';

export function ProductImage({image, title = 'Garment'}: {image: ProductVariantFragment['image']; title?: string}) {
  if (!image) return <div className="product-image product-media-empty">Photography is not available for this piece.</div>;
  return <div className="product-image"><Image alt={image.altText || title} data={image} sizes="(min-width: 900px) 50vw, 100vw" width={1000} loading="eager" /></div>;
}
