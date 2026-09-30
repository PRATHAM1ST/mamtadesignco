import {Link, useLocation, useNavigate, useNavigation} from 'react-router';
import type {MappedProductOptions} from '@shopify/hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';

export function ProductForm({productOptions, selectedVariant, onSuccess}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  onSuccess?: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const navigation = useNavigation();
  const {open} = useAside();
  const selecting = navigation.state !== 'idle';

  function optionUrl(query: string, handle?: string) {
    const search = new URLSearchParams(location.search);
    search.delete('variant');
    new URLSearchParams(query).forEach((value, key) => search.set(key, value));
    return `${handle ? `/products/${handle}` : location.pathname}?${search.toString()}`;
  }

  return (
    <div className="product-form">
      {productOptions.map((option) => option.optionValues.length > 1 && (
        <fieldset className="product-options" key={option.name}>
          <legend>{option.name}<span>{option.optionValues.find((value) => value.selected)?.name}</span></legend>
          <div className="product-options-grid">
            {option.optionValues.map((value) => {
              const {name, handle, variantUriQuery, selected, available, exists, isDifferentProduct, swatch} = value;
              const label = `${option.name}: ${name}${!exists ? ' — unavailable combination' : !available ? ' — sold out' : ''}`;
              const className = `product-options-item${selected ? ' is-selected' : ''}${!available ? ' is-unavailable' : ''}`;
              if (isDifferentProduct) return (
                <Link key={name} className={className} aria-label={label} aria-current={selected ? 'true' : undefined} to={optionUrl(variantUriQuery, handle)} prefetch="intent" preventScrollReset>
                  <ProductOptionSwatch swatch={swatch} name={name} />
                </Link>
              );
              return (
                <button key={name} type="button" className={className} aria-label={label} aria-pressed={selected} disabled={!exists} onClick={() => {
                  if (!selected) void navigate(optionUrl(variantUriQuery), {preventScrollReset: true});
                }}>
                  <ProductOptionSwatch swatch={swatch} name={name} />
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
      <p className="product-availability" role="status">
        {!selectedVariant ? 'This combination is unavailable. Choose another option.' : selectedVariant.availableForSale ? 'Available to order' : 'This selection is sold out'}
      </p>
      <AddToCartButton disabled={!selectedVariant?.availableForSale || selecting} onSuccess={() => {onSuccess?.(); open('cart');}} lines={selectedVariant ? [{merchandiseId: selectedVariant.id, quantity: 1, selectedVariant}] : []}>
        {!selectedVariant ? 'Unavailable' : selectedVariant.availableForSale ? 'Add to bag' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

export function ProductOptionSwatch({swatch, name}: {swatch?: {color?: string | null; image?: {previewImage?: {url: string} | null} | null} | null; name: string}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;
  return (
    <>
      {(image || color) && <span className="product-option-label-swatch" aria-hidden="true" style={color ? {backgroundColor: color} : undefined}>
        {image && <img src={image} alt="" width={24} height={24} loading="lazy" />}
      </span>}
      <span>{name}</span>
    </>
  );
}
