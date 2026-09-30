import type {Route} from './+types/account_.authorize';
import {privateAccountRequest} from '~/lib/account-private.server';

export function headers() { return {'Cache-Control': 'private, no-store'}; }

export async function loader({context}: Route.LoaderArgs) {
  return privateAccountRequest(context.customerAccount.authorize());
}
