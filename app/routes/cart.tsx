import {useActionData, useLoaderData, data, type HeadersFunction} from 'react-router';
import type {Route} from './+types/cart';
import {CartForm, type CartQueryDataReturn} from '@shopify/hydrogen';
import {CartMain} from '~/components/CartMain';
import {CartFeedback} from '~/components/cart/CartFeedback';

export const meta: Route.MetaFunction = () => [{title: 'Your bag | Mamta Design Co.'}, {name: 'robots', content: 'noindex, nofollow'}];
export const headers: HeadersFunction = ({actionHeaders, loaderHeaders}) => {
  const headers = new Headers(actionHeaders.get('Set-Cookie') ? actionHeaders : loaderHeaders);
  headers.set('Cache-Control', 'private, no-store');
  return headers;
};

export async function action({request, context}: Route.ActionArgs) {
  const {cart} = context;
  const responseHeaders = new Headers({'Cache-Control': 'private, no-store'});
  const fail = (message: string, status = 400) => data({cart: null, errors: [{message}], warnings: [], success: false}, {status, headers: responseHeaders});
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return fail('This request could not be verified. Refresh the page and try again.', 403);
  if (request.method !== 'POST') return fail('This action requires a form submission.', 405);
  let formData: FormData;
  try {formData = await request.formData();} catch {return fail('The bag could not be updated. Please try again.');}
  let parsed: ReturnType<typeof CartForm.getFormInput>;
  try {parsed = CartForm.getFormInput(formData);} catch {return fail('The bag update was not valid. Please try again.');}
  const {action, inputs} = parsed;
  if (!action) return fail('Choose a bag action and try again.');
  let result: CartQueryDataReturn;
  try {
    switch (action) {
      case CartForm.ACTIONS.LinesAdd:
        if (!Array.isArray(inputs.lines) || !inputs.lines.length || inputs.lines.length > 100 || inputs.lines.some((line) => !/^gid:\/\/shopify\/ProductVariant\/\d+$/.test(line.merchandiseId) || (line.quantity != null && (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 99)))) return fail('Choose an available product and a quantity between 1 and 99.');
        result = await cart.addLines(inputs.lines);
        break;
      case CartForm.ACTIONS.LinesUpdate:
        if (!Array.isArray(inputs.lines) || !inputs.lines.length || inputs.lines.length > 100 || inputs.lines.some((line) => typeof line.id !== 'string' || (line.quantity != null && (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 99)))) return fail('Choose a quantity between 1 and 99.');
        result = await cart.updateLines(inputs.lines);
        break;
      case CartForm.ACTIONS.LinesRemove:
        if (!Array.isArray(inputs.lineIds) || !inputs.lineIds.length || inputs.lineIds.length > 100 || !inputs.lineIds.every((id) => typeof id === 'string')) return fail('That bag item could not be found.');
        result = await cart.removeLines(inputs.lineIds);
        break;
      case CartForm.ACTIONS.DiscountCodesUpdate: {
        const code = typeof inputs.discountCode === 'string' ? inputs.discountCode.trim() : '';
        const existing = Array.isArray(inputs.discountCodes) ? inputs.discountCodes.filter((value): value is string => typeof value === 'string') : [];
        const codes = [...new Set([...existing, ...(code ? [code] : [])])];
        if (codes.length > 20 || codes.some((value) => value.length > 255)) return fail('That discount code is not valid.');
        result = await cart.updateDiscountCodes(codes);
        break;
      }
      case CartForm.ACTIONS.GiftCardCodesAdd: {
        const code = typeof inputs.giftCardCode === 'string' ? inputs.giftCardCode.trim() : '';
        if (!code || code.length > 255) return fail('Enter a valid gift card code.');
        result = await cart.addGiftCardCodes([code]);
        break;
      }
      case CartForm.ACTIONS.GiftCardCodesRemove: {
        const ids = inputs.giftCardCodes;
        if (!Array.isArray(ids) || !ids.length || ids.length > 20 || !ids.every((id) => typeof id === 'string')) return fail('That gift card could not be found.');
        result = await cart.removeGiftCardCodes(ids);
        break;
      }
      case CartForm.ACTIONS.NoteUpdate: {
        if (typeof inputs.note !== 'string' || inputs.note.length > 5000) return fail('Keep your bag note under 5,000 characters.');
        result = await cart.updateNote(inputs.note);
        break;
      }
      case CartForm.ACTIONS.BuyerIdentityUpdate:
        result = await cart.updateBuyerIdentity(inputs.buyerIdentity);
        break;
      default: return fail('That bag action is not supported.');
    }
  } catch (error: unknown) {
    console.error('Shopify cart mutation failed', error instanceof Error ? error.message : 'Unknown error');
    return fail('Your bag could not be updated. Check your connection and try again.', 502);
  }
  const cartId = result.cart?.id;
  if (!cartId && !result.errors?.length) return fail('Your bag could not be updated. Please try again.', 502);
  const headers = cartId ? cart.setCartId(cartId) : responseHeaders;
  headers.set('Cache-Control', 'private, no-store');
  const success = !!result.cart && !result.errors?.length;
  const redirectTo = formData.get('redirectTo');
  // Only a successful mutation may navigate, and only within this storefront.
  if (success && typeof redirectTo === 'string' && redirectTo.startsWith('/') && !redirectTo.startsWith('//') && !redirectTo.includes('\\')) headers.set('Location', redirectTo);
  return data({cart: result.cart, errors: result.errors, warnings: result.warnings, success, analytics: {cartId}}, {status: headers.has('Location') ? 303 : result.errors?.length ? 422 : 200, headers});
}

export async function loader({context}: Route.LoaderArgs) {
  const cart = await context.cart.get();
  if (cart?.errors?.length) {
    console.error('Shopify cart retrieval failed', cart.errors.map((error) => error.message));
    throw new Response('Your bag could not be loaded. Please refresh and try again.', {status: 502});
  }
  return data(cart, {headers: {'Cache-Control': 'private, no-store'}});
}

export default function Cart() {
  const cart = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  return <div className="cart-page"><div className="cart-page-heading"><p className="eyebrow">Your considered edit</p><h1>The bag.</h1></div><CartFeedback result={result} /><CartMain layout="page" cart={cart} /></div>;
}
