import {redirect} from 'react-router';
import type {Route} from './+types/account.$';
import {privateAccountRequest} from '~/lib/account-private.server';

export function headers() { return {'Cache-Control': 'private, no-store'}; }

// fallback wild card for all unauthenticated routes in account section
export async function loader({context}: Route.LoaderArgs) {
  await privateAccountRequest(context.customerAccount.handleAuthStatus());

  return redirect('/account');
}
