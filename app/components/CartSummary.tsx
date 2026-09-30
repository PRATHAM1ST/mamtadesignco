import {useEffect, useId, useState} from 'react';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {Form, useFetchers, useNavigation, type FetcherWithComponents} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from './CartMain';
import {CartFeedback, type CartActionData} from './cart/CartFeedback';
import {siteConfig} from '~/lib/site-config';

type CartSummaryProps = {cart: OptimisticCart<CartApiQueryFragment | null>; layout: CartLayout};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const fetchers = useFetchers();
  const navigation = useNavigation();
  const id = useId();
  const busy = fetchers.some((fetcher) => fetcher.state !== 'idle' && fetcher.formAction?.includes('/cart'));
  const checkingOut = navigation.state !== 'idle' && navigation.formAction?.endsWith('/checkout');
  return <section className={`cart-summary cart-summary-${layout}`} aria-labelledby={`cart-summary-${id}`}>
    <h2 id={`cart-summary-${id}`}>Your order</h2>
    <dl className="cart-subtotal"><dt>Subtotal</dt><dd>{busy || cart?.isOptimistic ? <span className="cart-calculating" role="status">Updating…</span> : cart?.cost?.subtotalAmount ? <Money data={cart.cost.subtotalAmount} /> : 'Unavailable'}</dd></dl>
    {!!cart?.discountAllocations?.length && <ul className="cart-applied-amounts" aria-label="Shopify discounts">{cart.discountAllocations.map((discount) => <li key={`${'code' in discount ? discount.code : 'title' in discount ? discount.title : 'Discount'}-${discount.discountedAmount.amount}`}><span>{'code' in discount ? discount.code : 'title' in discount ? discount.title : 'Discount'}</span><span>−<Money data={discount.discountedAmount} /></span></li>)}</ul>}
    <CartDiscounts discountCodes={cart?.discountCodes} />
    <CartGiftCards giftCards={cart?.appliedGiftCards} />
    {siteConfig.cartNotes && <CartNote note={cart?.note || ''} />}
    <p className="cart-checkout-note">Shipping, applicable taxes and final discounts are confirmed at checkout.</p>
    <Form method="post" action="/checkout"><button className="button button-primary cart-checkout-button" type="submit" disabled={busy || !!cart?.isOptimistic || checkingOut || !cart?.totalQuantity} aria-busy={checkingOut}>{checkingOut ? 'Opening checkout…' : 'Continue to checkout'}<span aria-hidden="true">↗</span></button></Form>
    <p className="cart-secure-checkout"><span aria-hidden="true">◇</span> Secure Shopify Checkout</p>
  </section>;
}

function CartDiscounts({discountCodes}: {discountCodes?: CartApiQueryFragment['discountCodes']}) {
  const id = useId();
  const codes = discountCodes?.filter((code) => code.applicable).map((code) => code.code) || [];
  const invalid = discountCodes?.filter((code) => !code.applicable) || [];
  return <div className="cart-discounts">
    {!!codes.length && <ul className="applied-discounts" aria-label="Applied discount codes">{codes.map((code) => <li key={code}><span>{code}</span><CartForm route="/cart" action={CartForm.ACTIONS.DiscountCodesUpdate} inputs={{discountCodes: codes.filter((current) => current !== code)}}>{(fetcher: FetcherWithComponents<CartActionData>) => <><button type="submit" disabled={fetcher.state !== 'idle'} aria-label={`Remove discount ${code}`}>×</button><CartFeedback result={fetcher.data} /></>}</CartForm></li>)}</ul>}
    {invalid.map((code) => <p className="commerce-feedback commerce-feedback-error" key={code.code} role="status">“{code.code}” does not apply to this bag.</p>)}
    <CartForm route="/cart" action={CartForm.ACTIONS.DiscountCodesUpdate} inputs={{discountCodes: codes}}>{(fetcher: FetcherWithComponents<CartActionData>) => <>
      <label htmlFor={`discount-${id}`}>Discount code</label><div className="cart-code-form"><input id={`discount-${id}`} type="text" name="discountCode" placeholder="Enter a code" autoComplete="off" maxLength={255} /><button type="submit" disabled={fetcher.state !== 'idle'}>{fetcher.state !== 'idle' ? 'Applying…' : 'Apply'}</button></div><CartFeedback result={fetcher.data} />
    </>}</CartForm>
  </div>;
}

function CartGiftCards({giftCards}: {giftCards?: CartApiQueryFragment['appliedGiftCards']}) {
  const id = useId();
  return <details className="cart-summary-detail"><summary>Have a gift card? <span aria-hidden="true">+</span></summary>
    {!!giftCards?.length && <ul className="applied-giftcards" aria-label="Applied gift cards">{giftCards.map((card) => <li key={card.id}><span>•••• {card.lastCharacters}</span><Money data={card.amountUsed} /><CartForm route="/cart" action={CartForm.ACTIONS.GiftCardCodesRemove} inputs={{giftCardCodes: [card.id]}}>{(fetcher: FetcherWithComponents<CartActionData>) => <><button type="submit" disabled={fetcher.state !== 'idle'} aria-label={`Remove gift card ending ${card.lastCharacters}`}>Remove</button><CartFeedback result={fetcher.data} /></>}</CartForm></li>)}</ul>}
    <CartForm route="/cart" action={CartForm.ACTIONS.GiftCardCodesAdd}>{(fetcher: FetcherWithComponents<CartActionData>) => <><label htmlFor={`giftcard-${id}`}>Gift card code</label><div className="cart-code-form"><input id={`giftcard-${id}`} type="text" name="giftCardCode" autoComplete="off" maxLength={255} required /><button type="submit" disabled={fetcher.state !== 'idle'}>{fetcher.state !== 'idle' ? 'Applying…' : 'Apply'}</button></div><CartFeedback result={fetcher.data} /></>}</CartForm>
  </details>;
}

function CartNote({note}: {note: string}) {
  const id = useId();
  const [value, setValue] = useState(note);
  useEffect(() => setValue(note), [note]);
  return <details className="cart-summary-detail"><summary>Add a note <span aria-hidden="true">+</span></summary>
    <CartForm route="/cart" action={CartForm.ACTIONS.NoteUpdate} inputs={{note: value}}>{(fetcher: FetcherWithComponents<CartActionData>) => <><label htmlFor={`note-${id}`}>Note for your order</label><textarea id={`note-${id}`} name="note" rows={3} maxLength={5000} value={value} onChange={(event) => setValue(event.target.value)} /><button className="text-button" type="submit" disabled={fetcher.state !== 'idle'}>{fetcher.state !== 'idle' ? 'Saving…' : 'Save note'}</button><CartFeedback result={fetcher.data} />{fetcher.state === 'idle' && fetcher.data?.success && fetcher.data.cart?.note === value && <p role="status">Your note is saved.</p>}</>}</CartForm>
  </details>;
}
