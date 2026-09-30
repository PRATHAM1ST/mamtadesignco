import {data} from 'react-router';
import type {Route} from './+types/api.newsletter';
import {sameOriginRequest, submitIntegration, validEmail} from '~/lib/integrations.server';

export async function action({request, context}: Route.ActionArgs) {
  const headers = {'Cache-Control': 'private, no-store'};
  if (request.method !== 'POST' || !sameOriginRequest(request)) return data({error: 'This request could not be accepted.'}, {status: 403, headers});
  const form = await request.formData();
  const email = String(form.get('email') || '').trim();
  if (form.get('website')) return data({error: 'This request could not be accepted.'}, {status: 400, headers});
  if (!validEmail(email)) return data({error: 'Please enter a valid email address.'}, {status: 400, headers});
  const success = await submitIntegration({endpoint: context.env.NEWSLETTER_ENDPOINT, secret: context.env.NEWSLETTER_SECRET}, {email, consent: true, source: 'hydrogen-newsletter'});
  return success ? data({success: true}, {headers}) : data({error: 'We couldn’t subscribe you right now. Please try again later.'}, {status: 503, headers});
}

export function loader() { return new Response('Method not allowed', {status: 405}); }
