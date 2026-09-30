import {data, Link, useLoaderData, useOutletContext} from 'react-router';
import {Money} from '@shopify/hydrogen';
import type {CustomerFragment} from 'customer-accountapi.generated';
import type {Route} from './+types/account._index';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';
import {routeSeo} from '~/lib/seo';
import {privateAccountRequest} from '~/lib/account-private.server';

export const meta: Route.MetaFunction = () => routeSeo({title: 'Account overview', noindex: true});
export function headers() { return {'Cache-Control': 'private, no-store'}; }
export async function loader({context}: Route.LoaderArgs) {
  const result = await privateAccountRequest(context.customerAccount.query(CUSTOMER_ORDERS_QUERY, {variables: {first: 3, language: context.customerAccount.i18n.language}}));
  if (result.errors?.length || !result.data?.customer) throw new Response('Your orders could not be loaded.', {status: 502});
  return data({orders: result.data.customer.orders.nodes}, {headers: {'Cache-Control': 'private, no-store'}});
}

export default function AccountOverview() {
  const {orders} = useLoaderData<typeof loader>();
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  return <div className="account-overview"><h2>Your latest orders</h2>
    {orders.length ? <div className="order-list">{orders.map(order => <Link className="order-card" key={order.id} to={`/account/orders/${btoa(order.id)}`}><span>Order #{order.number}</span><time dateTime={order.processedAt}>{new Intl.DateTimeFormat('en-IN', {dateStyle: 'medium', timeZone: 'Asia/Kolkata'}).format(new Date(order.processedAt))}</time><span>{order.fulfillmentStatus.replace(/_/g, ' ').toLowerCase()}</span><Money data={order.totalPrice} /><span>View order →</span></Link>)}</div> : <div className="content-empty"><h3>Your first celebration awaits.</h3><p>When you place an order, you’ll find it here.</p><Link className="button" to="/shop">Explore the shop →</Link></div>}
    <div className="account-overview-panels"><section><p className="eyebrow">Personal details</p><h3>{[customer.firstName, customer.lastName].filter(Boolean).join(' ') || 'Your profile'}</h3><Link to="/account/profile">Manage profile →</Link></section><section><p className="eyebrow">Your address book</p><h3>{customer.defaultAddress ? 'Ready for your next order.' : 'Make yourself at home.'}</h3>{customer.defaultAddress && <address>{customer.defaultAddress.formatted.join(', ')}</address>}<Link to="/account/addresses">Manage addresses →</Link></section></div>
  </div>;
}

