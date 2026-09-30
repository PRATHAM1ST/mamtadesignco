import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem, type CartLine} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';

export type CartLayout = 'page' | 'aside';
export type CartMainProps = {cart: CartApiQueryFragment | null; layout: CartLayout};
export type LineItemChildrenMap = {[parentId: string]: CartLine[]};

function getLineItemChildrenMap(lines: CartLine[]): LineItemChildrenMap {
  const grouped: LineItemChildrenMap = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      (grouped[parentId] ??= []).push(line);
    }
    if ('lineComponents' in line && line.lineComponents.length) {
      (grouped[line.id] ??= []).push(...line.lineComponents);
      const nested = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, children] of Object.entries(nested)) (grouped[parentId] ??= []).push(...children);
    }
  }
  return grouped;
}

/** Both drawer and page reconcile the same Shopify cart, with Hydrogen optimism. */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);
  const hasItems = !!cart?.lines?.nodes.length;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);
  return <div className={`cart-main cart-main-${layout}`}>
    {!hasItems ? <CartEmpty /> : <div className="cart-details">
      <div className="cart-items"><p id={`cart-lines-${layout}`} className="sr-only">Items in your bag</p>
        <ul aria-labelledby={`cart-lines-${layout}`}>
          {(cart?.lines?.nodes || []).map((line) => 'parentRelationship' in line && line.parentRelationship?.parent ? null : <CartLineItem key={line.id} line={line} layout={layout} childrenMap={childrenMap} />)}
        </ul>
        {layout === 'aside' && <Link to="/cart" className="text-link">View your full bag ↗</Link>}
      </div>
      <CartSummary cart={cart} layout={layout} />
    </div>}
  </div>;
}

function CartEmpty() {
  const {close} = useAside();
  return <div className="cart-empty"><span className="cart-empty-mark" aria-hidden="true">◇</span><p className="eyebrow">Room for something beautiful</p><h2>Your bag awaits.</h2><p>Find the piece you will make your own.</p><Link to="/shop" className="button button-primary" onClick={close} prefetch="intent">Explore the collection <span aria-hidden="true">↗</span></Link></div>;
}
