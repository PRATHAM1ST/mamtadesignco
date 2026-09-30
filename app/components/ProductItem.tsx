import {lazy, Suspense, useState} from 'react';
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {ProductCardFragment} from 'storefrontapi.generated';
import {FavoriteButton} from './product/FavoriteButton';
import {AddToCartButton} from './AddToCartButton';
import {Icon} from './ui/Icon';
import {siteConfig} from '~/lib/site-config';

const QuickView = lazy(() => import('./product/QuickView').then((module) => ({default: module.QuickView})));
export function ProductItem({product, loading = 'lazy'}: {product: ProductCardFragment; loading?: 'eager' | 'lazy'}) {
  const [quickView, setQuickView] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const image = product.featuredImage;
  const secondary = product.images.nodes.find((item) => item.url !== image?.url);
  const variant = product.selectedOrFirstAvailableVariant;
  const productUrl = `/products/${product.handle}${product.trackingParameters ? `?${product.trackingParameters}` : ''}`;
  const single = product.variants.nodes.length === 1;
  const sale = variant?.compareAtPrice && Number(variant.compareAtPrice.amount) > Number(variant.price.amount);
  return <article className="product-item">
    <div className="product-card-media"><Link to={productUrl} prefetch="intent" className="product-card-image" aria-label={product.title}>
      {image ? <Image data={image} alt={image.altText || product.title} aspectRatio="3/4" sizes="(min-width: 1600px) 360px, (min-width: 900px) 25vw, 50vw" loading={loading}/> : <div className="image-placeholder">{product.title}</div>}
      {secondary && <Image className="product-card-secondary" data={secondary} alt="" aspectRatio="3/4" sizes="(min-width: 900px) 25vw, 50vw" loading="lazy"/>}
    </Link>
      {!product.availableForSale && <span className="product-badge">Sold out</span>}{sale && product.availableForSale && <span className="product-badge">Sale</span>}
      {siteConfig.enableWishlist && <FavoriteButton handle={product.handle} id={product.id}/>}
      <button className="card-quick-view" type="button" onClick={() => {setPreviewLoaded(true); setQuickView(true);}} aria-label={`Quick view ${product.title}`}>Quick view <Icon name="plus"/></button>
    </div>
    <div className="product-card-info"><Link to={productUrl} prefetch="intent"><h3>{product.title}</h3></Link><div className="card-price"><Money data={variant?.price || product.priceRange.minVariantPrice}/>{sale && variant?.compareAtPrice && <s><Money data={variant.compareAtPrice}/></s>}</div></div>
    <div className="product-card-bottom"><div className="card-swatches">{product.options.flatMap((option) => option.optionValues.filter((value) => value.swatch).slice(0, 5).map((value) => <span key={`${option.name}-${value.name}`} className="card-swatch" title={value.name} aria-label={value.name} style={{backgroundColor: value.swatch?.color || undefined}}>{value.swatch?.image?.previewImage?.url && <img src={value.swatch.image.previewImage.url} alt={value.name} loading="lazy" width="18" height="18"/>}</span>))}</div>
      {single && variant?.availableForSale ? <AddToCartButton lines={[{merchandiseId: variant.id, quantity: 1, selectedVariant: variant}]}><span>Quick add</span><Icon name="plus"/></AddToCartButton> : <Link className="card-select" to={productUrl}>{product.availableForSale ? 'Choose options' : 'View details'} <Icon name="arrow"/></Link>}
    </div>
    {previewLoaded && <Suspense fallback={<p role="status">Opening product…</p>}><QuickView handle={product.handle} open={quickView} onClose={() => setQuickView(false)}/></Suspense>}
  </article>;
}
