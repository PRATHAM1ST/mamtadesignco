import {useEffect, useState} from 'react';
import {Image} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {QuickViewQuery} from 'storefrontapi.generated';
import {Modal} from '../ui/Modal';
import {ProductPrice} from '../ProductPrice';
import {ProductOptionSwatch} from '../ProductForm';
import {AddToCartButton} from '../AddToCartButton';
import {useAside} from '../Aside';

type PreviewProduct = NonNullable<QuickViewQuery['product']>;
export function QuickView({handle, open, onClose}: {handle: string; open: boolean; onClose: () => void}) {
  const [product, setProduct] = useState<PreviewProduct | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    setProduct(null); setError(null); setLoading(true);
    void fetch(`/api/product?handle=${encodeURIComponent(handle)}`, {signal: controller.signal})
      .then(async (response) => {
        const result = await response.json() as QuickViewQuery & {error?: string};
        if (!response.ok || !result.product) throw new Error(result.error || 'This piece could not be loaded.');
        setProduct(result.product);
      }).catch((error: unknown) => {if (!(error instanceof Error && error.name === 'AbortError')) setError(error instanceof Error ? error.message : 'This piece could not be loaded.');})
      .finally(() => {if (!controller.signal.aborted) setLoading(false);});
    return () => controller.abort();
  }, [handle, open]);
  return <Modal open={open} onClose={onClose} title="A closer look" className="quick-view-modal">
    {loading && <div className="quick-view-loading" role="status"><div className="skeleton" /><p>Preparing your preview…</p></div>}
    {error && <div className="quick-view-error"><p role="alert">{error}</p><Link to={`/products/${handle}`} className="button button-primary" onClick={onClose}>View the piece</Link></div>}
    {product && <QuickViewProduct key={product.id} product={product} onClose={onClose} />}
  </Modal>;
}

function QuickViewProduct({product, onClose}: {product: PreviewProduct; onClose: () => void}) {
  const first = product.variants.nodes.find((variant) => variant.availableForSale) || product.variants.nodes[0];
  const [selected, setSelected] = useState<Record<string, string>>(() => Object.fromEntries(first?.selectedOptions.map((option) => [option.name, option.value]) || []));
  const variant = product.variants.nodes.find((variant) => variant.selectedOptions.every((option) => selected[option.name] === option.value));
  const image = variant?.image || product.featuredImage;
  const {open} = useAside();
  const query = new URLSearchParams(selected);
  return <div className="quick-view-grid">
    <div className="quick-view-image">{image && <Image data={image} alt={image.altText || product.title} width={800} sizes="(min-width: 800px) 450px, 90vw" loading="eager" />}</div>
    <div className="quick-view-details"><p className="eyebrow">Your festival edit</p><h3>{product.title}</h3><ProductPrice price={variant?.price} compareAtPrice={variant?.compareAtPrice} />
      {product.variants.pageInfo.hasNextPage ? <p>This piece has an extended selection. Visit the product page to explore all options.</p> : <>
        {product.options.filter((option) => option.optionValues.length > 1).map((option) => <fieldset className="product-options" key={option.name}><legend>{option.name}<span>{selected[option.name]}</span></legend><div className="product-options-grid">{option.optionValues.map((value) => {
          const matching = product.variants.nodes.filter((variant) => variant.selectedOptions.every((selection) => selection.name === option.name ? selection.value === value.name : selected[selection.name] === selection.value));
          const exists = matching.length > 0;
          const available = matching.some((variant) => variant.availableForSale);
          return <button type="button" className={`product-options-item${selected[option.name] === value.name ? ' is-selected' : ''}${!available ? ' is-unavailable' : ''}`} aria-pressed={selected[option.name] === value.name} aria-label={`${option.name}: ${value.name}${!available ? ' — sold out' : ''}`} disabled={!exists} key={value.name} onClick={() => setSelected({...selected, [option.name]: value.name})}><ProductOptionSwatch swatch={value.swatch} name={value.name} /></button>;
        })}</div></fieldset>)}
        <p className="product-availability" role="status">{!variant ? 'Choose an available combination.' : variant.availableForSale ? 'Available to order' : 'This selection is sold out'}</p>
        <AddToCartButton disabled={!variant?.availableForSale} lines={variant ? [{merchandiseId: variant.id, quantity: 1, selectedVariant: variant}] : []} onSuccess={() => {onClose(); open('cart');}}>{variant?.availableForSale ? 'Add to bag' : 'Sold out'}</AddToCartButton>
      </>}
      <Link className="text-link" to={`/products/${product.handle}?${query.toString()}`} onClick={onClose}>View the full piece ↗</Link>
    </div>
  </div>;
}
