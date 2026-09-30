import type {CustomerFragment} from 'customer-accountapi.generated';
import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';
import {data, Form, useActionData, useNavigation, useOutletContext} from 'react-router';
import type {Route} from './+types/account.profile';
import {routeSeo} from '~/lib/seo';
import {sameOriginRequest} from '~/lib/integrations.server';
import {privateAccountRequest} from '~/lib/account-private.server';

export const meta: Route.MetaFunction = () => routeSeo({title: 'Your profile', noindex: true});
export function headers() { return {'Cache-Control': 'private, no-store'}; }
export async function loader({context}: Route.LoaderArgs) { await privateAccountRequest(context.customerAccount.handleAuthStatus()); return data({}, {headers: {'Cache-Control': 'private, no-store'}}); }

export async function action({request, context}: Route.ActionArgs) {
  const headers = {'Cache-Control': 'private, no-store'};
  if (!['POST', 'PUT'].includes(request.method)) return data({error: 'Method not allowed.', success: false}, {status: 405, headers});
  if (!sameOriginRequest(request)) return data({error: 'This request could not be accepted.', success: false}, {status: 403, headers});
  if (!await context.customerAccount.isLoggedIn()) return data({error: 'Your session has ended. Please sign in again.', success: false}, {status: 401, headers});
  const form = await request.formData();
  const firstName = String(form.get('firstName') || '').trim();
  const lastName = String(form.get('lastName') || '').trim();
  if (firstName.length > 100 || lastName.length > 100) return data({error: 'Please use names shorter than 100 characters.', success: false}, {status: 400, headers});
  try {
    const result = await context.customerAccount.mutate(CUSTOMER_UPDATE_MUTATION, {variables: {customer: {firstName, lastName}, language: context.customerAccount.i18n.language}});
    const userErrors = result.data?.customerUpdate?.userErrors;
    if (userErrors?.length) return data({error: userErrors.map(error => error.message).join(' '), success: false}, {status: 400, headers});
    if (result.errors?.length || !result.data?.customerUpdate?.customer) throw new Error('Customer update failed');
    return data({error: null, success: true}, {headers});
  } catch {
    console.error('Customer profile update failed.');
    return data({error: 'We couldn’t save your profile. Please try again.', success: false}, {status: 502, headers});
  }
}

export default function AccountProfile() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  const {state} = useNavigation();
  const result = useActionData<typeof action>();
  return <section className="account-profile"><h2>Personal details</h2><p>A few details that make this space yours.</p><Form method="post" className="premium-form"><fieldset><legend className="sr-only">Personal information</legend><label htmlFor="firstName">First name</label><input id="firstName" name="firstName" type="text" autoComplete="given-name" defaultValue={customer.firstName || ''} maxLength={100} /><label htmlFor="lastName">Last name</label><input id="lastName" name="lastName" type="text" autoComplete="family-name" defaultValue={customer.lastName || ''} maxLength={100} /></fieldset><p role={result?.error ? 'alert' : 'status'}>{result?.error || (result?.success ? 'Your profile has been saved.' : '')}</p><button className="button" type="submit" disabled={state !== 'idle'}>{state !== 'idle' ? 'Saving…' : 'Save details →'}</button></Form></section>;
}

