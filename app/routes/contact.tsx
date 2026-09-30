import {assertStorefrontResponse} from '~/lib/storefront-errors';
import {data, Form, Link, useActionData, useLoaderData, useNavigation} from 'react-router';
import type {Route} from './+types/contact';
import {integrationEnabled, sameOriginRequest, submitIntegration, validEmail} from '~/lib/integrations.server';
import {sanitizeHtml, plainText} from '~/lib/html';
import {routeSeo, jsonLd, breadcrumbJsonLd, contactJsonLd} from '~/lib/seo';
import {siteConfig} from '~/lib/site-config';
import {useNonce} from '@shopify/hydrogen';

export const meta: Route.MetaFunction = ({data}) =>
  routeSeo({
    title: 'Contact Us · Customer Care & Consultation',
    description:
      'Get in touch with the Mamta Design Co team in Ahmedabad. Inquiries about bespoke fitting, bridal consultation, orders, and worldwide delivery.',
    url: data?.url,
    keywords: [
      'Contact Mamta Design Co',
      'Bridal Consultation Ahmedabad',
      'Chaniya Choli inquiries',
      'Customer Care Mamta',
      'Custom fitting',
    ],
  });
export async function loader({context, request}: Route.LoaderArgs) {
  const {page, shop, errors} = await context.storefront.query(CONTACT_PAGE_QUERY, {cache: context.storefront.CacheLong()});
  assertStorefrontResponse(errors, 'Content');
  const policyEmail = plainText(shop.shippingPolicy?.body).match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i)?.[0];
  const configuredEmail = context.env.SUPPORT_EMAIL || siteConfig.supportEmail || policyEmail;
  return {body: sanitizeHtml(page?.body), enabled: integrationEnabled(context.env.CONTACT_ENDPOINT), email: configuredEmail && validEmail(configuredEmail) ? configuredEmail : undefined, url: request.url};
}
export async function action({request, context}: Route.ActionArgs) {
  const headers = {'Cache-Control': 'private, no-store'};
  const failure = (error: string, status = 400) => data({error, success: false}, {status, headers});
  if (request.method !== 'POST' || !sameOriginRequest(request)) return failure('This request could not be accepted.', 403);
  const form = await request.formData();
  if (form.get('website')) return failure('This request could not be accepted.');
  const name = String(form.get('name') || '').trim();
  const email = String(form.get('email') || '').trim();
  const message = String(form.get('message') || '').trim();
  if (!name || name.length > 100) return failure('Please enter your name (up to 100 characters).');
  if (!validEmail(email)) return failure('Please enter a valid email address.');
  if (message.length < 10 || message.length > 5000) return failure('Please enter a message between 10 and 5,000 characters.');
  const success = await submitIntegration({endpoint: context.env.CONTACT_ENDPOINT, secret: context.env.CONTACT_SECRET}, {name, email, message, source: 'hydrogen-contact'});
  return success ? data({error: null, success: true}, {headers}) : failure('We couldn’t send your message right now. Please try again later.', 503);
}
export default function Contact() {
  const {body, enabled, email, url} = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  const navigation = useNavigation();
  const nonce = useNonce();
  const pending = navigation.state !== 'idle';
  const origin = new URL(url).origin;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      contactJsonLd({
        url,
        email,
        phone: siteConfig.whatsapp,
        origin,
      }),
      breadcrumbJsonLd([
        {name: 'Home', url: origin},
        {name: 'Contact', url},
      ]),
    ],
  };
  return (
    <div className="content-shell contact-page">
      <header className="content-heading">
        <p className="eyebrow">A conversation, a celebration</p>
        <h1>We’re here for you.</h1>
      </header>
      <div className="contact-layout">
        <section>
          {body && <div className="prose" dangerouslySetInnerHTML={{__html: body}} />}
          {email && <a className="contact-email" href={`mailto:${email}`}>{email} ↗</a>}
          <div className="contact-quicklinks">
            <h2>The details, at your fingertips.</h2>
            <Link to="/policies">Shipping & returns →</Link>
            <Link to="/account/orders">Your orders →</Link>
            <Link to="/faq">Frequently asked questions →</Link>
          </div>
          {!enabled && !email && !body && (
            <p>For information about an order, visit your account. You’ll find shipping and returns information in our store policies.</p>
          )}
        </section>
        {enabled && (
          <Form method="post" className="premium-form">
            <fieldset disabled={pending || result?.success}>
              <legend className="sr-only">Send us a message</legend>
              <label htmlFor="contact-name">Your name</label>
              <input id="contact-name" name="name" autoComplete="name" maxLength={100} required />
              <label htmlFor="contact-email">Email address</label>
              <input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} required />
              <label htmlFor="contact-message">Your message</label>
              <textarea id="contact-message" name="message" rows={6} minLength={10} maxLength={5000} required />
              <div className="form-honeypot" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              <p className="form-fineprint">Please include your order number if your message is about an order. Avoid including payment information.</p>
              <button className="button" type="submit">{pending ? 'Sending…' : result?.success ? 'Message sent' : 'Send your note →'}</button>
            </fieldset>
            <p role={result?.error ? 'alert' : 'status'}>{result?.error || (result?.success ? 'Thank you. Your message has reached our team.' : '')}</p>
          </Form>
        )}
      </div>
      <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{__html: jsonLd(structuredData)}} />
    </div>
  );
}
const CONTACT_PAGE_QUERY = `#graphql
  query ContactPage($country:CountryCode,$language:LanguageCode) @inContext(country:$country,language:$language) {
    page(handle:"contact") {body}
    shop {shippingPolicy {body}}
  }
` as const;

