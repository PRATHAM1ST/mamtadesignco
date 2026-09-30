import {data, Link, useLoaderData} from 'react-router';
import type {Route} from './+types/account.orders.$id';
import {Money, Image} from '@shopify/hydrogen';
import {CUSTOMER_ORDER_QUERY} from '~/graphql/customer-account/CustomerOrderQuery';
import {routeSeo} from '~/lib/seo';
import {privateAccountRequest} from '~/lib/account-private.server';

export const meta: Route.MetaFunction = ({data}) => routeSeo({title: data?.order?.name ? `Order ${data.order.name}` : 'Your order', noindex: true});
export function headers() { return {'Cache-Control': 'private, no-store'}; }
export async function loader({params, context}: Route.LoaderArgs) {
  let orderId: string;
  try { orderId = atob(params.id || ''); } catch { throw new Response('Order not found.', {status: 404}); }
  if (!orderId.startsWith('gid://shopify/Order/')) throw new Response('Order not found.', {status: 404});
  const result = await privateAccountRequest(context.customerAccount.query(CUSTOMER_ORDER_QUERY, {variables: {orderId, language: context.customerAccount.i18n.language}}));
  if (result.errors?.length) {
    console.error('Customer order query failed.');
    throw new Response('This order could not be loaded. Please try again.', {status: 502});
  }
  if (!result.data?.order) throw new Response('Order not found.', {status: 404});
  return data({order: result.data.order}, {headers: {'Cache-Control': 'private, no-store'}});
}

export default function OrderRoute() {
  const {order} = useLoaderData<typeof loader>();
  return <section className="account-order"><Link className="eyebrow" to="/account/orders">← All orders</Link><h2>Order {order.name}</h2>{order.processedAt && <p>Placed <time dateTime={order.processedAt}>{new Intl.DateTimeFormat('en-IN', {dateStyle: 'long', timeZone: 'Asia/Kolkata'}).format(new Date(order.processedAt))}</time></p>}{order.confirmationNumber && <p>Confirmation {order.confirmationNumber}</p>}
    <div className="order-line-list">{order.lineItems.nodes.map(line => <div className="order-line" key={line.id}>{line.image && <Image data={line.image} alt={line.image.altText || line.title} width={96} height={120} sizes="96px" loading="lazy" />}<div><h3>{line.title}</h3>{line.variantTitle !== 'Default Title' && <p>{line.variantTitle}</p>}<p>Quantity {line.quantity}</p>{line.price && <p>Unit price <Money data={line.price} /></p>}{line.totalDiscount && Number(line.totalDiscount.amount) > 0 && <p>Line discount <Money data={line.totalDiscount} /></p>}</div></div>)}</div>
    <div className="order-detail-grid"><section><h3>Shipping address</h3>{order.shippingAddress ? <address><p>{order.shippingAddress.formatted?.join(', ')}</p></address> : <p>No shipping address provided.</p>}<p className="eyebrow">Fulfilment</p><p>{order.fulfillmentStatus.replace(/_/g, ' ').toLowerCase()}</p></section><dl className="order-totals">{order.subtotal && <div><dt>Subtotal</dt><dd><Money data={order.subtotal} /></dd></div>}{order.totalTax && <div><dt>Tax</dt><dd><Money data={order.totalTax} /></dd></div>}{order.totalPrice && <div><dt>Total</dt><dd><Money data={order.totalPrice} /></dd></div>}</dl></div>
    <a className="button" target="_blank" href={order.statusPageUrl} rel="noopener noreferrer">Track your order ↗</a>
  </section>;
}

