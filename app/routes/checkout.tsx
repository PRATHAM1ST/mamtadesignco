import {data, redirect, Form, Link, useActionData, useNavigation} from 'react-router';
import type {Route} from './+types/checkout';

export const meta: Route.MetaFunction = () => [{title: 'Checkout | Mamta Design Co.'}, {name: 'robots', content: 'noindex, nofollow'}];

export async function action({request, context}: Route.ActionArgs) {
  const fail = (error: string, status = 422) => data({error}, {status, headers: {'Cache-Control': 'private, no-store'}});
  if (request.method !== 'POST') return fail('Open your bag to continue to checkout.', 405);
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return fail('Your request could not be verified. Please return to your bag.', 403);
  try {
    // Refresh against Shopify immediately before handing over to hosted checkout.
    const cart = await context.cart.get();
    if (!cart?.id || !cart.lines.nodes.length || !cart.totalQuantity) return fail('Your bag is empty. Add a piece before continuing.');
    if (cart.errors?.length) return fail(cart.errors.map((error) => error.message).join(' '));
    if (cart.lines.nodes.some((line) => !line.merchandise.availableForSale)) return fail('A piece in your bag is no longer available. Remove it before checkout.');
    if (!cart.checkoutUrl) return fail('Shopify Checkout is temporarily unavailable. Please try again.', 502);
    const url = new URL(cart.checkoutUrl);
    if (url.protocol !== 'https:') return fail('The secure checkout link is unavailable. Please try again.', 502);
    const headers = context.cart.setCartId(cart.id);
    headers.set('Cache-Control', 'private, no-store');
    return redirect(cart.checkoutUrl, {status: 303, headers});
  } catch (error: unknown) {
    console.error('Shopify checkout handover failed', error instanceof Error ? error.message : 'Unknown error');
    return fail('We could not connect to checkout. Your bag is saved; please try again.', 502);
  }
}

export default function CheckoutRecovery() {
  const result = useActionData<typeof action>();
  const navigation = useNavigation();
  const busy = navigation.state !== 'idle';
  return <div className="checkout-recovery"><p className="eyebrow">Your bag is saved</p><h1>One more moment.</h1><p role="alert">{result?.error || 'Return to your bag to continue.'}</p><Link className="button button-primary" to="/cart">Return to your bag</Link><Form method="post"><button type="submit" className="text-button" disabled={busy} aria-busy={busy}>{busy ? 'Opening checkout…' : 'Try checkout again ↗'}</button></Form></div>;
}
