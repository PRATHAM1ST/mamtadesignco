import type {Route} from './+types/account_.login';
import {privateAccountRequest} from '~/lib/account-private.server';
import {data, Link} from 'react-router';
import {routeSeo} from '~/lib/seo';

export function headers() { return {'Cache-Control': 'private, no-store'}; }
export const meta: Route.MetaFunction = () => routeSeo({title: 'Sign in', noindex: true});

export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const acrValues = url.searchParams.get('acr_values') || undefined;
  const loginHint = url.searchParams.get('login_hint') || undefined;
  const loginHintMode = url.searchParams.get('login_hint_mode') || undefined;
  const locale = url.searchParams.get('locale') || undefined;

  const response = await privateAccountRequest(context.customerAccount.login({
    countryCode: context.storefront.i18n.country,
    acrValues,
    loginHint,
    loginHintMode,
    locale,
  }));
  if (response.status >= 400) {
    return data({unavailable: true}, {status: response.status, headers: {'Cache-Control': 'private, no-store'}});
  }
  return response;
}

export default function LoginUnavailable() {
  return <div className="content-shell content-empty"><p className="eyebrow">Your account</p><h1>Your account, securely.</h1><p role="alert">Secure sign-in couldn’t open from this address. Please try the store’s secure website, or contact us for help.</p><Link className="button" to="/shop">Continue shopping →</Link><Link to="/contact">Contact us →</Link></div>;
}
