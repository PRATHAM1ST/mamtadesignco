# Mamta Design Co

A bespoke Shopify Hydrogen storefront for a Navratri Chaniya wardrobe. Midnight aubergine, warm ivory, portrait photography, and editorial typography frame an authoritative Shopify shopping experience.

## Stack and requirements

Node 24 LTS is recommended (the unit runner imports TypeScript directly). React 18.3.1, Hydrogen 2026.4.6, React Router, strict TypeScript, Vite, and Oxygen. Shopify Storefront and Customer Account schemas are version 2026-04. The original project was Hydrogen 2026.1.0 / Router 7.12.0; stable dependency updates address security advisories, without adopting the separate Hydrogen developer preview.

Use the exact versions in package.json and the committed npm lockfile. Run `npm ci` for reproducible installations. On Windows PowerShell with script execution restricted, use `npm.cmd` instead of `npm`.

React Router packages are pinned together to stable 7.18.4 to fix the 7.16 line's security advisories. A targeted npm override replaces Hydrogen's narrow 7.16 peer range; this is an explicit security exception, validated by type checking, builds and browser commerce tests. Reassess the override when Shopify widens its supported range. Lodash is similarly pinned to patched 4.18.1. The application keeps React Router 7's established SSR architecture and does not enable experimental RSC APIs.

## Start locally

```sh
npm ci
npx shopify hydrogen env pull
npm run dev
```

The project is already linked to the merchant's Hydrogen storefront. The CLI writes credentials to ignored `.env`; never commit it or paste its contents into issue reports. `.env.example` lists the variable names. Local development runs at http://localhost:3000. Customer Account authorization needs a public HTTPS development domain registered in Shopify; localhost alone cannot exercise the complete login callback.

For local Customer Account testing, start `npm run dev -- --customer-account-push` and use the HTTPS tunnel URL printed by Shopify CLI. Authorize with a merchant-approved test customer. The local HTTP experience displays a safe account recovery message; it does not simulate a successful login.

## Environment

| Variable | Purpose |
| --- | --- |
| SESSION_SECRET | Server-only cookie signing secret; generate a strong random value |
| PUBLIC_STORE_DOMAIN | Shopify store domain, without protocol |
| PUBLIC_STOREFRONT_API_TOKEN | Public Storefront token, including consent integration |
| PRIVATE_STOREFRONT_API_TOKEN | Server-only Storefront token |
| PUBLIC_STOREFRONT_ID | Hydrogen storefront identifier used by analytics |
| PUBLIC_CHECKOUT_DOMAIN | Checkout domain for consent/CSP; falls back to store domain |
| PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID | Public Customer Account application ID |
| SHOP_ID | Shopify shop ID used by modern Customer Account authentication |
| SUPPORT_EMAIL | Optional confirmed customer support address |
| CONTACT_ENDPOINT / CONTACT_SECRET | Optional HTTPS contact backend and server-only bearer secret |
| NEWSLETTER_ENDPOINT / NEWSLETTER_SECRET | Optional HTTPS newsletter backend and server-only bearer secret |

Only deliberately public values reach loader data. Customer secrets, private tokens, and integration secrets remain server-side.

## Shopify setup

1. Use the Hydrogen sales channel and publish products/collections to this storefront. Activate India in Shopify Markets. Server context currently requests country `IN`, language `EN`; currency always comes from Shopify, never an assumed conversion.
2. Configure actual collections and the `main-menu` / `footer` Shopify menus. Nested navigation is supported. With no collections, the catalog remains fully shoppable and collection views show a useful empty state.
3. Configure availability/price/option/metafield filters through Shopify Search & Discovery. Filter UI renders only filters returned by Shopify. Global catalog search supports Featured and price order; collection routes also support the API's collection sorting keys.
4. Enable modern Customer Accounts and configure the Hydrogen client, authorized JavaScript origins, `/account/authorize` callback, and logout domain. Profile, addresses, order list/detail, authorization and sign-out use Customer Account API operations, not password authentication.
5. Publish actual pages, policies, blog articles, and editorial metaobjects. Shopify policies appear as real policy links; returns, shipping charges, COD and dispatch promises are never invented.
6. Confirm shipping/payment settings in Shopify Checkout before launch. A storefront build cannot verify merchant payment configuration.

## Scripts and validation

### Homepage reviews and offers

**Kite:** the header rotates published offers every five seconds (with pause/next controls and reduced-motion support). Matching messages appear on product cards, product pages, and in the cart/drawer. Cart progress uses Shopify's subtotal; applied discounts and the estimated total use Shopify's actual calculations. Hosted checkout receives the same Shopify cart. No discount percentages or thresholds are hardcoded in application code.

The server reads the `kite-app-data` JSON published by the Kite app embed at the store's `myshopify.com` homepage, caches the safe offer summary for 60 seconds, and refreshes on navigation, cart mutations, and once per minute in visible tabs. Keep the Kite theme embed enabled and the Shopify theme storefront publicly accessible. This is an adapter for Kite's published embed format, **not an official Kite headless SDK**; an app format change may require updating `app/lib/kite.ts`. It supports the store's automatic, unrestricted subtotal-based free-shipping and percentage-order discounts, including valid scheduled windows. Customer/product/market restrictions, codes, gift campaigns, usage limits, and unfamiliar rule types are deliberately excluded from global advertising. Shopify still evaluates all enabled discount functions at checkout. No raw Kite configuration, tokens, or app scripts are sent to the browser. If fetching/parsing fails, shopping continues with the manual offer fallback.

Manage the actual offers in **Apps → Kite → Promotions**. The current offers are automatic, so shoppers do not need a code. The Shopify Plus checkout editor is separate from this Hydrogen repository: configure any Kite checkout app block there. A free-gift checkout block requires a configured Kite gift rule and its Checkout ID; this integration does not create a gift campaign or publish checkout blocks. See [Kite's checkout setup](https://help.skailama.com/en/article/how-to-create-free-gift-on-checkout-auto-add-only-for-shopify-plus-rj1p6n/). Run `npm run test:e2e -- tests/kite.spec.ts` for the store's current two live campaigns; update those test expectations if the merchant changes their rules.

Customer reviews are shared store-wide on the homepage, with six per page and links to load more. In Shopify **Settings → Custom data → Metaobjects**, create `storefront_review` with required single-line `customer_name`, required multi-line `review`, and optional integer `rating` (validation: 1–5). Enable Storefront API read access and the publishable capability; publish only real, approved customer reviews. No product reference is needed. Unpublished entries stay hidden. If using a review app instead, its entries must be synced into this definition or its API integrated; app reviews are not automatically available as metaobjects.

Offers use the existing `storefront_homepage` definition, entry handle `homepage`. Add single-line `offer_title`, optional single-line `offer_code`, multi-line `offer_terms`, and optional date/time fields `offer_starts_at` / `offer_ends_at`. Enable Storefront API read access and publish the entry. The offer appears above the header and beside the product purchase controls. Create the actual discount and eligibility rules separately in Shopify Discounts; this content only advertises it. Without configured offer content, the site shows a neutral discount-code reminder. Codes can be entered on product pages and in the bag; Shopify validates them and calculates savings.

Sharing metadata is server-rendered with a 1.91:1 aspect ratio (1200 x 628). The homepage uses `/og-image.jpg`; Shopify product, collection, and journal images use center-cropped 1200x628 JPEG renditions so multi-megabyte source PNGs do not reach social crawlers and card previews display cleanly. Titles, descriptions, canonical links, Open Graph and Twitter cards share `app/lib/seo.ts`. Search/account/cart pages are noindex, and HTTP error pages send `X-Robots-Tag: noindex, nofollow`. After deployment, validate a public product link and its image URL with the relevant sharing debugger to refresh cached previews. `npm run test:e2e -- tests/sharing.spec.ts` checks crawler HTML, product image size, error indexing, reviews and discount UI against the local server.

```sh
npm run codegen      # Validates GraphQL against the installed Shopify schemas; generates API and route types
npm run typecheck
npm run lint
npm test             # Node tests: URL filters, safe rich text, SEO and integration validation
npx playwright install chromium
npm run dev          # Keep running in a second terminal
npm run test:e2e      # Live store browser checks; creates test carts, never submits an order
npm run build        # Oxygen production bundle plus GraphQL validation
npm run preview
```

Browser checks cover real product data, cart quantity/removal/discount feedback, server-authoritative totals, guarded checkout redirect, keyboard predictive search, filter URLs/back navigation, responsive overflow, dialog focus, no-JavaScript search/filtering, reduced motion, favorites, content/status/caching, and automated WCAG checks. Complete customer OAuth and authenticated profile/address changes require a human-controlled test customer and public callback domain. No order is placed by the tests. Real multi-option variants, pickup, videos and size guides need corresponding merchant fixtures to exercise those live states.

## Architecture

- `app/root.tsx`: SSR shell, consent-aware Shopify analytics, nonce/CSP, market locale and private root responses.
- `app/lib/context.ts`: official Hydrogen context, secure session, authoritative cart handler, India market.
- `app/lib/product-fragments.ts`: shared product-card query; no per-card request waterfall.
- `app/components/ui/Modal.tsx`: native dialog focus containment, Escape, focus restoration, scroll locking, Motion panel animation.
- `app/components/motion`: GSAP editorial timelines with scoped cleanup; one GSAP ticker drives Lenis, which updates ScrollTrigger. Native mobile/reduced-motion scrolling and React Router scroll restoration remain in control.
- `app/components/collection` and `app/lib/filters.ts`: Shopify filters and supported sorting encoded in meaningful URLs; changes reset stale pagination and preserve attribution.
- `app/components/product`: gallery/video/zoom, current variants, quick view, optional size chart, browser-identifier recently viewed.
- `app/components/cart`: shared full-page/drawer presentation over Hydrogen optimistic cart. Shopify cost fields are authoritative; no manual tax, shipping or total calculations.
- `app/lib/html.ts`: allowlist sanitation of merchant HTML, compatible with edge runtime; Vite bundles its CommonJS parser for Oxygen.
- `app/lib/integrations.server.ts`: bounded validated requests to merchant form services; success requires an explicit backend acknowledgment.
- `app/lib/commerce-integrations.ts`: typed boundaries for delivery, stock alerts, truthful reviews/UGC, pickup and preorder services.

Routes include `/`, `/shop`, `/catalogue`, `/collections`, `/collections/all`, collection/product handles, `/search`, `/api/predictive-search`, `/cart`, `/checkout`, `/favorites`, `/account` and its authentication/profile/order/address routes, dynamic pages/blogs/policies, `/contact`, `/faq`, robots, segmented Shopify sitemaps, and HTTP-correct 404 handling. `/pages/contact` redirects to the designed contact route. `/checkout` hands off to the freshly retrieved Shopify cart `checkoutUrl` after validating the cart and availability.

## Merchant content model

Create these definitions in Shopify **Settings → Custom data → Metaobjects**, allow Storefront access, enable publishable status and publish entries. Undefined definitions or empty lists produce no fake content.

| Type / handle | Fields | Rendering |
| --- | --- | --- |
| `storefront_homepage` / `homepage` | `eyebrow`, `headline`, `headline_accent`, `body`, `cta_label` (text) | Overrides the campaign hero's starting brand copy |
| `storefront_campaign` | `headline` (text), `body` (multiline), `image` (file), `product` (product reference), `collection` (collection reference) | Homepage editorial story modules; entries can express nine nights / nine looks or actual craft stories |
| `storefront_faq` | `question` (text), `answer` (multiline text) | Standalone FAQ and homepage subset |
| `storefront_lookbook` | `title` (text), `body` (multiline), `image` (file), `product` (product reference) | Merchant-curated imagery and product links in the catalogue |

Product metafields in namespace `storefront`:

- `details` and `care`: merchant-controlled multiline text.
- `size_guide`: JSON with `inches: {columns: string[], rows: string[][]}` and/or `cm: {columns: string[], rows: string[][]}`, plus optional `notes` and `instructions` strings. Measurements are never generated or inferred. See `parseSizeGuide` for validation; invalid/unset charts stay hidden.

Product titles, descriptions, images, availability, swatches, pricing, variants, recommendations, collection taxonomy and journal entries come directly from Shopify. The catalogue also provides an editorial view of actual published products without needing separate campaign content.

Business settings live in `app/lib/site-config.ts`. Announcement, support/social/WhatsApp, free shipping and campaign dates default to unset. Populate only confirmed values. Cart notes and browser favorites are enabled. There is no automatic fake countdown, free-shipping progress, testimonial, stock counter, COD badge or newsletter success.

## Integration contracts and launch readiness

Contact and newsletter forms stay hidden until an HTTPS endpoint is configured. The backend must validate/rate-limit requests and return JSON `{ "success": true }` only after successfully persisting/sending the request. Contact payload: `{name,email,message,source}`; newsletter: `{email,consent:true,source}`. Optional bearer secrets stay server-only. The storefront validates lengths, email, same-origin submission and a honeypot, and imposes an eight-second timeout. Add provider-level CAPTCHA/rate limiting before opening a high-volume public form.

Delivery serviceability, stock notification, preorder, pickup, customer-linked wishlists, UGC/reviews and payment promotions require merchant data or an actual backend. Their contracts are defined; purchase UI does not advertise these services while unconfigured. Contact shows a confirmed configured email or a `mailto` address from the store's own shipping policy.

Favorites store only product IDs/handles and are capped at 40. Recently viewed stores capped IDs. Rendering always retrieves current Shopify data; stored prices/availability are never used. Storage is local to the browser and is not a customer-linked wishlist.

## Analytics, privacy and SEO

Shopify's `Analytics.Provider` handles commerce changes without duplicate custom add/remove tracking. Product/collection/search page events use official components. Customer privacy banner and supported backend consent are enabled; there is no additional third-party analytics. Root/customer/cart responses are private and `no-store`; public catalogue queries use Hydrogen caches.

Route metadata comes from merchant data where available. Product structured data uses actual selected price/currency/availability; articles use actual titles/authors/dates. Canonical metadata excludes visitor attribution/UI state. Robots and segmented sitemaps include published Shopify resources and storefront discovery paths. Private routes and search are noindex. Shopify HTML and JSON-LD delimiters are sanitized/escaped.

## Deployment

Build with `npm run build`, set environment values on the linked Oxygen environment, then deploy using the Shopify Hydrogen CLI or the existing GitHub Oxygen workflow. Review the build, connected store, merchant policies, customer account callback and test checkout first. No deployment or live payment submission is performed by this implementation task.

## Troubleshooting

- **GraphQL fails**: run `npm run codegen`; verify published resources, storefront access scopes and definition access. Partial Shopify errors are checked and surfaced.
- **No collections**: publish collections to the Hydrogen sales channel; `/shop` can browse actual products independently.
- **Account callback fails**: confirm public HTTPS callback/origin and Customer Account client in Shopify. Cookie signatures require the same stable session secret.
- **Oxygen reports `require is not defined`**: retain `xss`/`cssfilter` in Vite SSR optimization and bundling configuration.
- **Forms absent**: configure the real merchant integration endpoints; the UI does not pretend subscriptions/messages succeeded.
- **Port 3000 busy**: stop only the development process you started, or use the port printed by the CLI and update Playwright baseURL.
- **Secrets**: `.env`, `.shopify`, build outputs, traces and Playwright reports are ignored; review any diagnostic artifacts before sharing externally.

Refer to [official Hydrogen documentation](https://shopify.dev/docs/api/hydrogen/2026-04) and [Customer Account setup](https://shopify.dev/docs/storefronts/headless/building-with-the-customer-account-api/hydrogen) when configuring the merchant store.
