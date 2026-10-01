import {data} from 'react-router';
import type {Route} from './+types/api.cart';

/** Current public purchase information only; customer identity stays out of this response. */
export async function loader({context}: Route.LoaderArgs) {
  const cart = await context.cart.get();
  return data({cart: cart ? {checkoutUrl: cart.checkoutUrl, totalQuantity: cart.totalQuantity, cost: cart.cost, lines: cart.lines, note: cart.note, discountAllocations: cart.discountAllocations, discountCodes: cart.discountCodes} : null, errors: cart?.errors, success: !!cart && !cart.errors?.length}, {headers: {'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex'}});
}
