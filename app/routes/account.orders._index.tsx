import {data, Form, Link, useLoaderData, useNavigation} from 'react-router';
import type {Route} from './+types/account.orders._index';
import {Money, getPaginationVariables} from '@shopify/hydrogen';
import {buildOrderSearchQuery, parseOrderFilters} from '~/lib/orderFilters';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {routeSeo} from '~/lib/seo';
import {privateAccountRequest} from '~/lib/account-private.server';

export const meta: Route.MetaFunction = () => routeSeo({title: 'Your orders', noindex: true});
export function headers() { return {'Cache-Control': 'private, no-store'}; }
export async function loader({request, context}: Route.LoaderArgs) {
  const filters = parseOrderFilters(new URL(request.url).searchParams);
  const result = await privateAccountRequest(context.customerAccount.query(CUSTOMER_ORDERS_QUERY, {variables: {...getPaginationVariables(request, {pageBy: 12}), query: buildOrderSearchQuery(filters), language: context.customerAccount.i18n.language}}));
  if (result.errors?.length || !result.data?.customer) {
    console.error('Customer orders query failed.');
    throw new Response('Your orders could not be loaded. Please try again.', {status: 502});
  }
  return data({customer: result.data.customer, filters}, {headers: {'Cache-Control': 'private, no-store'}});
}

export default function Orders() {
  const {customer, filters} = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const pending = navigation.state !== 'idle';
  const hasFilters = Boolean(filters.name || filters.confirmationNumber);
  return <section className="orders"><h2>Your orders</h2><p>Every piece, every celebration.</p><Form method="get" className="order-search-form premium-form" key={JSON.stringify(filters)}><fieldset><legend className="sr-only">Find an order</legend><div className="order-search-inputs"><div><label htmlFor="order-number">Order number</label><input id="order-number" type="search" name="name" defaultValue={filters.name || ''} maxLength={100} /></div><div><label htmlFor="confirmation-number">Confirmation number</label><input id="confirmation-number" type="search" name="confirmation_number" defaultValue={filters.confirmationNumber || ''} maxLength={100} /></div><button className="button" type="submit" disabled={pending}>{pending ? 'Finding…' : 'Find order →'}</button></div>{hasFilters && <Link to="/account/orders">Clear search</Link>}</fieldset></Form>
    <div aria-live="polite">{customer.orders.nodes.length ? <PaginatedResourceSection connection={customer.orders} resourcesClassName="order-list">{({node: order}) => <Link className="order-card" key={order.id} to={`/account/orders/${btoa(order.id)}`}><strong>Order #{order.number}</strong><time dateTime={order.processedAt}>{new Intl.DateTimeFormat('en-IN', {dateStyle: 'medium', timeZone: 'Asia/Kolkata'}).format(new Date(order.processedAt))}</time><span>{(order.financialStatus || 'Status pending').toLowerCase().replace(/_/g, ' ')}</span><Money data={order.totalPrice} /><span>View order →</span></Link>}</PaginatedResourceSection> : <div className="content-empty"><h3>{hasFilters ? 'No matching orders.' : 'Your first celebration awaits.'}</h3><p>{hasFilters ? 'Try another order or confirmation number.' : 'When you place an order, you’ll find it here.'}</p><Link className="button" to={hasFilters ? '/account/orders' : '/shop'}>{hasFilters ? 'View all orders →' : 'Explore the shop →'}</Link></div>}</div>
  </section>;
}


