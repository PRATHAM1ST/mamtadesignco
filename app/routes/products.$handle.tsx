import {Suspense, useEffect, useRef, useState} from 'react';
import {Await, Link, useLoaderData} from 'react-router';
import type {Route} from './+types/products.$handle';
import {getSelectedProductOptions, Analytics, useOptimisticVariant, getProductOptions, getAdjacentAndFirstAvailableVariants, useNonce} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductForm} from '~/components/ProductForm';
import {ProductGallery} from '~/components/product/ProductGallery';
import {SizeGuide, parseSizeGuide} from '~/components/product/SizeGuide';
import {RecentlyViewed} from '~/components/product/RecentlyViewed';
import {ProductItem} from '~/components/ProductItem';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {PRODUCT_QUERY, variantGid} from '~/lib/product';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/product-fragments';
import {sanitizeHtml} from '~/lib/html';

export const meta: Route.MetaFunction = ({data}) => {
  if (!data) return [{title: 'Piece not found | Mamta Design Co.'}, {name: 'robots', content: 'noindex'}];
  const title = `${data.product.seo.title || data.product.title} | Mamta Design Co.`;
  const description = data.product.seo.description || data.product.description.slice(0, 160);
  const image = data.product.selectedOrFirstAvailableVariant?.image?.url;
  return [{title}, {name: 'description', content: description}, {rel: 'canonical', href: data.canonical}, {property: 'og:type', content: 'product'}, {property: 'og:title', content: title}, {property: 'og:description', content: description}, {property: 'og:url', content: data.canonical}, ...(image ? [{property: 'og:image', content: image}, {name: 'twitter:card', content: 'summary_large_image'}] : [])];
};

export async function loader({context, params, request}: Route.LoaderArgs) {
  const handle = params.handle;
  if (!handle) throw new Response('Piece not found', {status: 404});
  const url = new URL(request.url);
  const requestedVariant = variantGid(url.searchParams.get('variant'));
  const options = getSelectedProductOptions(request).filter((option) => option.name !== 'variant' && !option.name.startsWith('utm_') && !['gclid', 'fbclid'].includes(option.name));
  const result = await context.storefront.query(PRODUCT_QUERY, {
    variables: {handle, selectedOptions: options, variantId: requestedVariant ?? 'gid://shopify/ProductVariant/0', hasVariant: !!requestedVariant},
    cache: context.storefront.CacheShort(),
  });
  if (result.errors?.length) {
    console.error('Shopify product retrieval failed', result.errors.map((error) => error.message));
    throw new Response('This piece could not be loaded. Please try again.', {status: 502});
  }
  if (!result.product?.id) throw new Response('Piece not found', {status: 404});
  const product = result.product;
  product.descriptionHtml = sanitizeHtml(product.descriptionHtml);
  const policies = {
    shippingPolicy: result.shop.shippingPolicy ? {...result.shop.shippingPolicy, body: sanitizeHtml(result.shop.shippingPolicy.body)} : null,
    refundPolicy: result.shop.refundPolicy ? {...result.shop.refundPolicy, body: sanitizeHtml(result.shop.refundPolicy.body)} : null,
  };
  redirectIfHandleIsLocalized(request, {handle, data: product});
  let variantError: string | null = null;
  if (url.searchParams.has('variant')) {
    if (requestedVariant && result.selectedVariant && 'product' in result.selectedVariant && result.selectedVariant.product.id === product.id) product.selectedOrFirstAvailableVariant = result.selectedVariant;
    else {product.selectedOrFirstAvailableVariant = null; variantError = 'That selection is no longer available. Choose an option below.';}
  }
  const recommendations = context.storefront.query(RECOMMENDATIONS_QUERY, {variables: {productId: product.id}, cache: context.storefront.CacheShort()})
    .then(({productRecommendations, errors}) => ({products: errors?.length ? [] : productRecommendations || [], error: !!errors?.length}))
    .catch((error: unknown) => {console.error('Shopify product recommendations failed', error instanceof Error ? error.message : 'Unknown error'); return {products: [], error: true};});
  return {product, policies, recommendations, canonical: `${url.origin}/products/${product.handle}`, variantError};
}

export default function Product() {
  const {product, policies, recommendations, canonical, variantError} = useLoaderData<typeof loader>();
  const variant = useOptimisticVariant(product.selectedOrFirstAvailableVariant, getAdjacentAndFirstAvailableVariants(product));
  const optionBase = variant || getAdjacentAndFirstAvailableVariants(product)[0];
  const productOptions = getProductOptions({...product, selectedOrFirstAvailableVariant: optionBase}).map((option) => variant ? option : {...option, optionValues: option.optionValues.map((value) => ({...value, selected: false}))});
  const guide = parseSizeGuide(product.sizeGuide?.value);
  const nonce = useNonce();
  const purchase = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  const {open} = useAside();
  useEffect(() => {
    if (!purchase.current) return;
    const observer = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting && entry.boundingClientRect.bottom < 0));
    observer.observe(purchase.current);
    return () => observer.disconnect();
  }, []);
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Product', name: product.title,
    description: product.description, url: canonical,
    image: product.media.nodes.filter((media) => media.__typename === 'MediaImage').map((media) => media.previewImage?.url).filter(Boolean),
    ...(variant ? {sku: variant.sku || undefined, offers: {'@type': 'Offer', price: variant.price.amount, priceCurrency: variant.price.currencyCode, availability: variant.availableForSale ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: canonical}} : {}),
  };
  return (
    <>
      <div className="pdp-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/shop">Shop</Link><span aria-hidden="true">/</span><span>{product.title}</span></nav>
        <div className="pdp-layout">
          <ProductGallery media={product.media.nodes} selectedImage={variant?.image} title={product.title} />
          <div className="pdp-details">
            <p className="eyebrow">{product.vendor || 'Mamta Design Co.'}</p>
            <h1>{product.title}</h1>
            <ProductPrice price={variant?.price} compareAtPrice={variant?.compareAtPrice} />
            <p className="pdp-purchase-note">Shipping and applicable taxes calculated at checkout.</p>
            {(variantError || !variant) && <div className="commerce-feedback commerce-feedback-error" role="alert"><p>{variantError || 'This combination is unavailable. Choose another selection.'}</p><Link to={`/products/${product.handle}`} className="text-link">View available selections</Link></div>}
            {guide && <SizeGuide guide={guide} />}
            <div ref={purchase}><ProductForm productOptions={productOptions} selectedVariant={variant} /></div>
            <div className="pdp-assurance"><span aria-hidden="true">↗</span><p>Continue securely with Shopify Checkout.</p></div>
            <div className="product-accordions">
              {!!product.descriptionHtml && <details open><summary>The piece <span aria-hidden="true">+</span></summary><div className="rich-text" dangerouslySetInnerHTML={{__html: product.descriptionHtml}} /></details>}
              {!!product.details?.value && <details><summary>Details <span aria-hidden="true">+</span></summary><p className="metafield-copy">{product.details.value}</p></details>}
              {!!product.care?.value && <details><summary>Care for your garment <span aria-hidden="true">+</span></summary><p className="metafield-copy">{product.care.value}</p></details>}
              {!!policies.shippingPolicy && <details><summary>Delivery <span aria-hidden="true">+</span></summary><div className="rich-text" dangerouslySetInnerHTML={{__html: policies.shippingPolicy.body}} /><Link to={`/policies/${policies.shippingPolicy.handle}`} className="text-link">Read the shipping policy ↗</Link></details>}
              {!!policies.refundPolicy && <details><summary>Returns & exchanges <span aria-hidden="true">+</span></summary><div className="rich-text" dangerouslySetInnerHTML={{__html: policies.refundPolicy.body}} /><Link to={`/policies/${policies.refundPolicy.handle}`} className="text-link">Read the returns policy ↗</Link></details>}
            </div>
          </div>
        </div>
        <Suspense fallback={null}><Await resolve={recommendations}>{(result) => result.error ? <p className="recommendations-status" role="status">Related pieces could not be loaded. <Link to="/shop">Explore the shop</Link>.</p> : result.products.length > 0 && <section className="product-recommendations" aria-labelledby="recommendations-heading"><div className="section-heading"><p className="eyebrow">Considered together</p><h2 id="recommendations-heading">Continue your edit.</h2></div><div className="products-grid">{result.products.slice(0, 4).map((item) => <ProductItem product={item} key={item.id} />)}</div></section>}</Await></Suspense>
        <RecentlyViewed productId={product.id} />
      </div>
      {showSticky && <div className="mobile-purchase-bar"><div><span>{variant?.title === 'Default Title' ? product.title : variant?.title || 'Choose a selection'}</span><ProductPrice price={variant?.price} /></div><AddToCartButton disabled={!variant?.availableForSale} onSuccess={() => open('cart')} lines={variant ? [{merchandiseId: variant.id, quantity: 1, selectedVariant: variant}] : []}>{variant?.availableForSale ? 'Add to bag' : 'Sold out'}</AddToCartButton></div>}
      <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd).replace(/</g, '\u003c')}} />
      <Analytics.ProductView data={{products: [{id: product.id, title: product.title, price: variant?.price.amount || '0', vendor: product.vendor, variantId: variant?.id || '', variantTitle: variant?.title || '', quantity: 1}]}} />
    </>
  );
}

const RECOMMENDATIONS_QUERY = `#graphql
  query ProductRecommendations($productId: ID!, $country: CountryCode, $language: LanguageCode) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) { ...ProductCard }
  }
  ${PRODUCT_CARD_FRAGMENT}
` as const;
