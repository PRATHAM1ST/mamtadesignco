import {redirect} from 'react-router';
import type {Route} from './+types/account_.logout';
import {privateAccountRequest} from '~/lib/account-private.server';

export function headers() { return {'Cache-Control': 'private, no-store'}; }

// if we don't implement this, /account/logout will get caught by account.$.tsx to do login
export async function loader() {
  return redirect('/');
}

export async function action({context}: Route.ActionArgs) {
  return privateAccountRequest(context.customerAccount.logout());
}
