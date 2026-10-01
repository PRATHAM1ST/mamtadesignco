import {Await, Link, useRevalidator} from 'react-router';
import {lazy, Suspense, useEffect} from 'react';
import type {CartApiQueryFragment, FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {Aside} from './Aside';
import {Footer} from './Footer';
import {Header, HeaderMenu} from './Header';
import {CartMain} from './CartMain';
import {SearchOverlayContent} from './search/SearchOverlayContent';
import {siteConfig} from '~/lib/site-config';
import type {promotionContent} from '~/lib/storefront-content';
import type {KiteOffer} from '~/lib/kite';
import {KiteAnnouncement} from './KiteOffers';

const ScrollExperience = lazy(() => import('./motion/ScrollExperience').then((module) => ({default: module.ScrollExperience})));
interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>; footer: Promise<FooterQuery | null>; header: HeaderQuery;
  isLoggedIn: Promise<boolean>; publicStoreDomain: string; newsletterEnabled?: boolean; children?: React.ReactNode;
  promotion?: ReturnType<typeof promotionContent>;
  kiteOffers?: KiteOffer[];
}
export function PageLayout({cart, footer, header, isLoggedIn, publicStoreDomain, newsletterEnabled, promotion, kiteOffers = [], children}: PageLayoutProps) {
  const revalidator = useRevalidator();
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible' && revalidator.state === 'idle') void revalidator.revalidate();
    }, 60000);
    return () => window.clearInterval(timer);
  }, [revalidator]);
  return <Aside.Provider>
    <a className="skip-link" href="#main-content">Skip to content</a><div id="header-marker" aria-hidden="true"/>
    <div className="announcement">
      {kiteOffers.length ? <KiteAnnouncement offers={kiteOffers} /> : promotion ? <Link to="/shop">{promotion.title}{promotion.code && <> · Use code <strong>{promotion.code}</strong></>}{promotion.terms && <span className="announcement-terms">{promotion.terms}</span>}</Link> : siteConfig.announcement || <Link to="/cart">Have a discount code? Apply it in your bag.</Link>}
    </div>
    <Header header={header} cart={cart} isLoggedIn={isLoggedIn} publicStoreDomain={publicStoreDomain}/>
    <main id="main-content" tabIndex={-1}>{children}</main>
    <Footer footer={footer} header={header} publicStoreDomain={publicStoreDomain} newsletterEnabled={newsletterEnabled}/>
    <Aside type="cart" heading="Your bag"><Suspense fallback={<p role="status">Retrieving your bag…</p>}><Await resolve={cart} errorElement={<p role="alert">Your bag couldn’t be loaded. Please refresh to try again.</p>}>{(resolved) => <CartMain cart={resolved} layout="aside"/>}</Await></Suspense></Aside>
    <Aside type="search" heading="Find something beautiful"><SearchOverlayContent/></Aside>
    <Aside type="mobile" heading="Explore"><HeaderMenu menu={header.menu} viewport="mobile" primaryDomainUrl={header.shop.primaryDomain.url} publicStoreDomain={publicStoreDomain}/></Aside>
    <Suspense><ScrollExperience/></Suspense>
  </Aside.Provider>;
}
