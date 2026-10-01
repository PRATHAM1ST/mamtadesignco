import type {CartLayout, LineItemChildrenMap} from '~/components/CartMain';
import {CartForm, Image, Money, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link, useFetcher} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {CartFeedback, type CartActionData} from './cart/CartFeedback';

export type CartLine = OptimisticCartLine<CartApiQueryFragment>;

export function CartLineItem({layout, line, childrenMap}: {layout: CartLayout; line: CartLine; childrenMap: LineItemChildrenMap}) {
  const {id, merchandise, quantity} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const mutation = useFetcher<CartActionData>({key: `cart-line-${id}`});
  const pending = !!line.isOptimistic || mutation.state !== 'idle';
  const children = childrenMap[id];
  return <li className={`cart-line${pending ? ' is-updating' : ''}`}>
    <div className="cart-line-inner">
      <Link className="cart-line-image" to={lineItemUrl} onClick={layout === 'aside' ? close : undefined} tabIndex={-1} aria-hidden="true">
        {image ? <Image alt="" aspectRatio="3/4" data={image} height={144} loading="lazy" width={108} sizes="108px" /> : <span>No image</span>}
      </Link>
      <div className="cart-line-info">
        <Link prefetch="intent" to={lineItemUrl} onClick={layout === 'aside' ? close : undefined} className="cart-line-title">{product.title}</Link>
        <ul className="cart-line-options">{selectedOptions.filter((option) => option.value !== 'Default Title').map((option) => <li key={option.name}>{option.name}: {option.value}</li>)}</ul>
        <div className="cart-unit-price"><span className="sr-only">Unit price</span><ProductPrice price={line.cost?.amountPerQuantity || merchandise.price} compareAtPrice={line.cost?.compareAtAmountPerQuantity} /></div>
        {!pending && !!line.discountAllocations?.length && <ul className="cart-applied-amounts" aria-label={`Applied offers for ${product.title}`}>{line.discountAllocations.map((discount, index) => <li key={index}><span>{'code' in discount ? discount.code : 'title' in discount ? discount.title : 'Discount'}</span><span>−<Money as="span" data={discount.discountedAmount} /></span></li>)}</ul>}
        <div className="cart-line-actions">
          <div className="cart-quantity" role="group" aria-label={`Quantity for ${product.title}`}>
            <CartForm fetcherKey={`cart-line-${id}`} route="/cart" action={CartForm.ACTIONS.LinesUpdate} inputs={{lines: [{id, quantity: quantity - 1}]}}><button type="submit" aria-label={`Decrease quantity of ${product.title}`} disabled={quantity <= 1 || pending}>-</button></CartForm>
            <output aria-label="Current quantity">{quantity}</output>
            <CartForm fetcherKey={`cart-line-${id}`} route="/cart" action={CartForm.ACTIONS.LinesUpdate} inputs={{lines: [{id, quantity: quantity + 1}]}}><button type="submit" aria-label={`Increase quantity of ${product.title}`} disabled={quantity >= 99 || pending}>+</button></CartForm>
          </div>
          <CartForm fetcherKey={`cart-line-${id}`} route="/cart" action={CartForm.ACTIONS.LinesRemove} inputs={{lineIds: [id]}}><button className="cart-line-remove" type="submit" disabled={pending} aria-label={`Remove ${product.title}`}>Remove</button></CartForm>
        </div>
        <CartFeedback result={mutation.data} />
        {pending && <span className="cart-line-status" role="status">Updating your bag…</span>}
        {!merchandise.availableForSale && !pending && <p className="commerce-feedback" role="status">This selection is no longer available. Remove it before checkout.</p>}
      </div>
      <div className="cart-line-total"><span className="sr-only">Line total</span>{line.isOptimistic ? <span className="cart-line-status">Confirming…</span> : line.cost?.totalAmount && <Money data={line.cost.totalAmount} />}</div>
    </div>
    {!!children?.length && <ul className="cart-line-children" aria-label={`Included with ${title}`}>{children.map((child) => <CartLineItem childrenMap={childrenMap} key={child.id} line={child} layout={layout} />)}</ul>}
  </li>;
}
