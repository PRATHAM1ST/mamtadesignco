import {data, Form, Link, NavLink, Outlet, useLoaderData, useRouteError, isRouteErrorResponse} from 'react-router';
import type {Route} from './+types/account';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {routeSeo} from '~/lib/seo';
import {privateAccountRequest} from '~/lib/account-private.server';

export const meta: Route.MetaFunction = () => routeSeo({title: 'Your account', noindex: true});
export function shouldRevalidate() { return true; }
export function headers() { return {'Cache-Control': 'private, no-store'}; }

export async function loader({context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const result = await privateAccountRequest(customerAccount.query(CUSTOMER_DETAILS_QUERY, {variables: {language: customerAccount.i18n.language}}));
  if (result.errors?.length || !result.data?.customer) {
    console.error('Customer account details could not be loaded.');
    throw new Response('Your account could not be loaded. Please try signing in again.', {status: 502});
  }
  return data({customer: result.data.customer}, {headers: {'Cache-Control': 'private, no-store'}});
}

export default function AccountLayout() {
  const {customer} = useLoaderData<typeof loader>();
  return <div className="account content-shell">
    <header className="content-heading"><p className="eyebrow">Your personal space</p><h1>{customer.firstName ? `Welcome, ${customer.firstName}.` : 'Your account.'}</h1><p>Keep your details close, and your next celebration closer.</p></header>
    <div className="account-layout">
      <nav className="account-navigation" aria-label="Account">
        <NavLink to="/account" end>Overview</NavLink><NavLink to="/account/orders">Orders</NavLink><NavLink to="/account/profile">Profile</NavLink><NavLink to="/account/addresses">Addresses</NavLink>
        <Form method="post" action="/account/logout"><button type="submit">Sign out ↗</button></Form>
      </nav>
      <div className="account-content"><Outlet context={{customer}} /></div>
    </div>
  </div>;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const secureSignInUnavailable = isRouteErrorResponse(error) && error.status === 400;
  const message = secureSignInUnavailable ? 'Secure sign-in couldn’t open from this address. Please try the store’s secure website, or contact us for help.' : isRouteErrorResponse(error) && error.status === 401 ? 'Your session has ended. Sign in to continue.' : 'We couldn’t load your account. Please try again.';
  return <div className="content-shell content-empty"><p className="eyebrow">Your account</p><h1>{secureSignInUnavailable ? 'Your account, securely.' : 'Let’s try again.'}</h1><p role="alert">{message}</p><Link className="button" to={secureSignInUnavailable ? '/shop' : '/account/login'}>{secureSignInUnavailable ? 'Continue shopping →' : 'Sign in'}</Link><Link to={secureSignInUnavailable ? '/contact' : '/shop'}>{secureSignInUnavailable ? 'Contact us →' : 'Continue browsing →'}</Link></div>;
}

