import type {CustomerAddressInput} from '@shopify/hydrogen/customer-account-api-types';
import type {AddressFragment, CustomerFragment} from 'customer-accountapi.generated';
import {data, useFetcher, useOutletContext} from 'react-router';
import {useId} from 'react';
import type {Route} from './+types/account.addresses';
import {UPDATE_ADDRESS_MUTATION, DELETE_ADDRESS_MUTATION, CREATE_ADDRESS_MUTATION} from '~/graphql/customer-account/CustomerAddressMutations';
import {routeSeo} from '~/lib/seo';
import {sameOriginRequest} from '~/lib/integrations.server';
import {privateAccountRequest} from '~/lib/account-private.server';

export const meta: Route.MetaFunction = () => routeSeo({title: 'Your addresses', noindex: true});
export function headers() { return {'Cache-Control': 'private, no-store'}; }
export async function loader({context}: Route.LoaderArgs) {
  await privateAccountRequest(context.customerAccount.handleAuthStatus());
  return data({}, {headers: {'Cache-Control': 'private, no-store'}});
}

const addressFields = [
  {key: 'firstName', label: 'First name', autocomplete: 'given-name', required: true},
  {key: 'lastName', label: 'Last name', autocomplete: 'family-name', required: true},
  {key: 'company', label: 'Company (optional)', autocomplete: 'organization'},
  {key: 'address1', label: 'Address', autocomplete: 'address-line1', required: true},
  {key: 'address2', label: 'Apartment, building or landmark (optional)', autocomplete: 'address-line2'},
  {key: 'city', label: 'City', autocomplete: 'address-level2', required: true},
  {key: 'zoneCode', label: 'State / province code', autocomplete: 'address-level1', required: true},
  {key: 'zip', label: 'PIN / postal code', autocomplete: 'postal-code', required: true},
  {key: 'territoryCode', label: 'Country code (for example, IN)', autocomplete: 'country', required: true},
  {key: 'phoneNumber', label: 'Phone (optional)', autocomplete: 'tel'},
] as const;

export async function action({request, context}: Route.ActionArgs) {
  const headers = {'Cache-Control': 'private, no-store'};
  const failure = (error: string, status = 400) => data({error, success: false}, {status, headers});
  if (!['POST', 'PUT', 'DELETE'].includes(request.method)) return failure('Method not allowed.', 405);
  if (!sameOriginRequest(request)) return failure('This request could not be accepted.', 403);
  if (!await context.customerAccount.isLoggedIn()) return failure('Your session has ended. Please sign in again.', 401);
  const form = await request.formData();
  const intent = String(form.get('intent') || form.get('_intent') || (request.method === 'POST' ? 'create' : request.method === 'PUT' ? 'update' : 'delete'));
  if (!['create', 'update', 'delete'].includes(intent)) return failure('Please select a valid address action.');
  const addressId = String(form.get('addressId') || '');
  if (intent !== 'create' && !addressId.startsWith('gid://shopify/CustomerAddress/')) return failure('Please select a valid saved address.');
  const address: CustomerAddressInput = {};
  for (const field of addressFields) {
    const value = String(form.get(field.key) || '').trim();
    if (value.length > 255) return failure(`Please shorten your ${field.label.toLowerCase()}.`);
    if (intent !== 'delete' && 'required' in field && field.required && !value) return failure(`Please enter your ${field.label.toLowerCase()}.`);
    address[field.key] = value;
  }
  if (intent !== 'delete' && !/^[A-Z]{2}$/.test(address.territoryCode || '')) return failure('Please enter a two-letter country code, such as IN.');
  const variables = {address, addressId, defaultAddress: form.get('defaultAddress') === 'on', language: context.customerAccount.i18n.language};
  try {
    let userErrors: Array<{message: string}> | undefined;
    if (intent === 'create') {
      const result = await context.customerAccount.mutate(CREATE_ADDRESS_MUTATION, {variables});
      if (result.errors?.length) throw new Error('Address create GraphQL failure');
      userErrors = result.data?.customerAddressCreate?.userErrors;
      if (!userErrors?.length && !result.data?.customerAddressCreate?.customerAddress) throw new Error('Address create response missing');
    } else if (intent === 'update') {
      const result = await context.customerAccount.mutate(UPDATE_ADDRESS_MUTATION, {variables});
      if (result.errors?.length) throw new Error('Address update GraphQL failure');
      userErrors = result.data?.customerAddressUpdate?.userErrors;
      if (!userErrors?.length && !result.data?.customerAddressUpdate?.customerAddress) throw new Error('Address update response missing');
    } else {
      const result = await context.customerAccount.mutate(DELETE_ADDRESS_MUTATION, {variables: {addressId, language: variables.language}});
      if (result.errors?.length) throw new Error('Address delete GraphQL failure');
      userErrors = result.data?.customerAddressDelete?.userErrors;
      if (!userErrors?.length && !result.data?.customerAddressDelete?.deletedAddressId) throw new Error('Address delete response missing');
    }
    if (userErrors?.length) return failure(userErrors.map(error => error.message).join(' '));
    return data({error: null, success: true}, {headers});
  } catch {
    console.error('Customer address mutation failed.');
    return failure('We couldn’t save this change. Please try again.', 502);
  }
}

export default function Addresses() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  return <section className="account-addresses"><h2>Your address book</h2><p>Save the places you call home.</p>
    {!customer.addresses.nodes.length && <p className="account-note">No addresses saved yet. Add your first address below.</p>}
    <details className="address-create" open={!customer.addresses.nodes.length}><summary>Add a new address <span aria-hidden="true">+</span></summary><AddressForm /></details>
    <div className="address-list">{customer.addresses.nodes.map(address => <details key={address.id} className="address-entry"><summary><span>{[address.firstName, address.lastName].filter(Boolean).join(' ')}{customer.defaultAddress?.id === address.id && <small>Default</small>}<span className="address-preview">{address.formatted.join(', ')}</span></span><span aria-hidden="true">+</span></summary><AddressForm address={address} isDefault={customer.defaultAddress?.id === address.id} /></details>)}</div>
  </section>;
}

function AddressForm({address, isDefault}: {address?: AddressFragment; isDefault?: boolean}) {
  const fetcher = useFetcher<typeof action>();
  const id = useId();
  const pending = fetcher.state !== 'idle';
  return <fetcher.Form method="post" className="premium-form address-form">
    <input type="hidden" name="addressId" value={address?.id || 'new'} />
    <input type="hidden" name="_intent" value={address ? 'update' : 'create'} />
    <fieldset disabled={pending}><legend className="sr-only">{address ? 'Edit address' : 'New address'}</legend><div className="address-fields">
      {addressFields.map(field => <div key={field.key}><label htmlFor={`${id}-${field.key}`}>{field.label}</label><input id={`${id}-${field.key}`} name={field.key} type={field.key === 'phoneNumber' ? 'tel' : 'text'} autoComplete={field.autocomplete} defaultValue={address?.[field.key] || (field.key === 'territoryCode' ? 'IN' : '')} required={'required' in field && field.required} maxLength={field.key === 'territoryCode' ? 2 : 255} /></div>)}
    </div><label className="checkbox-label"><input defaultChecked={isDefault} name="defaultAddress" type="checkbox" /> Set as default address</label>
    <p role={fetcher.data?.error ? 'alert' : 'status'}>{fetcher.data?.error || (fetcher.data?.success ? 'Your address book has been updated.' : '')}</p>
    <div className="form-actions"><button className="button" type="submit">{pending ? 'Saving…' : address ? 'Save address →' : 'Add address →'}</button>{address && <button className="text-button" name="intent" value="delete" type="submit" formNoValidate>Remove address</button>}</div></fieldset>
  </fetcher.Form>;
}

