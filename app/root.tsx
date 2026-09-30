import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
  Link,
} from 'react-router';
import type {Route} from './+types/root';
import favicon from '~/assets/favicon.svg';
import logo from '~/assets/logo.png';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import commerceStyles from '~/styles/commerce.css?url';
import catalogStyles from '~/styles/catalog.css?url';
import contentStyles from '~/styles/content.css?url';
import {PageLayout} from './components/PageLayout';
import {siteConfig} from '~/lib/site-config';
import {integrationEnabled} from '~/lib/integrations.server';
import {jsonLd} from '~/lib/seo';
import {assertStorefrontResponse} from '~/lib/storefront-errors';
import {ShopifyProvider} from '@shopify/hydrogen-react';

export type RootLoader = typeof loader;
// The root includes a private bag and account status; cache public Shopify queries separately.
export const headers = () => ({'Cache-Control': 'private, no-store'});

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  // Defaulting to no revalidation for root loader data to improve performance.
  // When using this feature, you risk your UI getting out of sync with your server.
  // Use with caution. If you are uncomfortable with this optimization, update the
  // line below to `return defaultShouldRevalidate` instead.
  // For more details see: https://remix.run/docs/en/main/route/should-revalidate
  return false;
};

/**
 * The main and reset stylesheets are added in the Layout component
 * to prevent a bug in development HMR updates.
 *
 * This avoids the "failed to execute 'insertBefore' on 'Node'" error
 * that occurs after editing and navigating to another page.
 *
 * It's a temporary fix until the issue is resolved.
 * https://github.com/remix-run/remix/issues/9242
 */
export function links() {
  return [
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', href: '/favicon.ico', sizes: 'any'},
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
    {rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png'},
    {rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png'},
    {rel: 'icon', type: 'image/png', sizes: '48x48', href: '/favicon-48x48.png'},
    {rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png'},
    {rel: 'apple-touch-icon-precomposed', href: '/apple-touch-icon-precomposed.png'},
    {rel: 'manifest', href: '/site.webmanifest'},
    {rel: 'preload', href: '/fonts/manrope-latin.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous'},
  ];
}

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const {storefront, env} = args.context;

  return {
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
    origin: new URL(args.request.url).origin,
    newsletterEnabled: integrationEnabled(env.NEWSLETTER_ENDPOINT),
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN || env.PUBLIC_STORE_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: true,
      // localize the privacy banner
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: Route.LoaderArgs) {
  const {storefront} = context;

  const [header] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: siteConfig.headerMenuHandle,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);
  assertStorefrontResponse(header.errors, 'Header');

  return {header};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  const {storefront, customerAccount, cart} = context;

  // defer the footer query (below the fold)
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: siteConfig.footerMenuHandle,
      },
    })
    .then((result) => {assertStorefrontResponse(result.errors, 'Footer'); return result;})
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });
  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
  };
}

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();

  return (
    <html lang="en-IN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#121212" />
        <meta name="msapplication-TileColor" content="#121212" />
        <meta name="msapplication-TileImage" content="/android-chrome-192x192.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        <link rel="stylesheet" href={commerceStyles}/>
        <link rel="stylesheet" href={catalogStyles}/>
        <link rel="stylesheet" href={contentStyles}/>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData<RootLoader>('root');
  const nonce = useNonce();

  if (!data) {
    return <Outlet />;
  }

  return (
    <ShopifyProvider storeDomain={data.publicStoreDomain} storefrontToken={data.publicStorefrontToken}
      storefrontApiVersion="2026-04" countryIsoCode="IN" languageIsoCode="EN" sameDomainForStorefrontApi>
    <Analytics.Provider
      cart={data.cart}
      shop={data.shop}
      consent={data.consent}
    >
      <PageLayout {...data}>
        <Outlet />
      </PageLayout>
      <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{__html: jsonLd({
        '@context': 'https://schema.org', '@graph': [
          {
            '@type': 'Organization',
            '@id': `${data.origin}/#organization`,
            name: data.header?.shop?.name || siteConfig.brandName,
            legalName: 'Mamta Design Co.',
            url: data.origin,
            logo: `${data.origin}/logo.png`,
            image: `${data.origin}/og-image.png`,
            description: 'Handcrafted Chaniya Choli, celebratory ethnic wear, and luxury couture for Navratri and festive occasions.',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Ahmedabad',
              addressRegion: 'Gujarat',
              addressCountry: 'IN'
            },
            contactPoint: {
              '@type': 'ContactPoint',
              contactType: 'customer service',
              areaServed: 'IN',
              availableLanguage: ['en', 'hi', 'gu']
            }
          },
          {
            '@type': 'WebSite',
            '@id': `${data.origin}/#website`,
            name: data.header?.shop?.name || siteConfig.brandName,
            url: data.origin,
            publisher: {'@id': `${data.origin}/#organization`},
            potentialAction: {
              '@type': 'SearchAction',
              target: `${data.origin}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string'
            }
          },
        ],
      })}}/>
    </Analytics.Provider>
    </ShopifyProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'We couldn’t load this page. Please try again in a moment.';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    if (errorStatus === 404) errorMessage = 'This page may have moved, or the piece is no longer available.';
  }

  return (
    <div className="route-error">
      <img src={logo} alt="Mamta Design Co." className="error-logo" width="60" height="60" />
      <p className="eyebrow">MAMTA DESIGN CO. · {errorStatus}</p>
      <h1>{errorStatus === 404 ? 'A different direction.' : 'A moment, please.'}</h1>
      <p>{errorMessage}</p>
      <Link className="button" to="/shop">Explore the wardrobe</Link>
      <Link className="text-link" to="/search">Search the store</Link>
    </div>
  );
}
