import {Await, useRouteLoaderData} from 'react-router';
import {Suspense} from 'react';
import type {RootLoader} from '~/root';
import {CartDiscounts} from '~/components/CartSummary';
import {KiteOffers} from './KiteOffers';

export function StoreOffer() {
  const root = useRouteLoaderData<RootLoader>('root');
  return <><KiteOffers /><details className="purchase-offers">
    <summary>{root?.promotion?.title || 'Offers & discount codes'}</summary>
    {root?.promotion && <p>{root.promotion.code ? <>Use code <strong>{root.promotion.code}</strong>. </> : null}{root.promotion.terms}</p>}
    <p>Add your piece to the bag to check offer eligibility. Final savings are confirmed at checkout.</p>
    <Suspense fallback={<p role="status">Loading discount codes…</p>}>
      <Await resolve={root?.cart} errorElement={<p>Discount codes can also be entered at checkout.</p>}>
        {(cart) => <CartDiscounts discountCodes={cart?.discountCodes} />}
      </Await>
    </Suspense>
  </details></>;
}
