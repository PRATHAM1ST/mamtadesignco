import {Await} from 'react-router';
import {lazy, Suspense} from 'react';
import type {CartApiQueryFragment, FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {Aside} from './Aside';
import {Footer} from './Footer';
import {Header, HeaderMenu} from './Header';
import {CartMain} from './CartMain';
import {SearchOverlayContent} from './search/SearchOverlayContent';
import {siteConfig} from '~/lib/site-config';

const ScrollExperience = lazy(() => import('./motion/ScrollExperience').then((module) => ({default: module.ScrollExperience})));
interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>; footer: Promise<FooterQuery | null>; header: HeaderQuery;
  isLoggedIn: Promise<boolean>; publicStoreDomain: string; newsletterEnabled?: boolean; children?: React.ReactNode;
}
export function PageLayout({cart, footer, header, isLoggedIn, publicStoreDomain, newsletterEnabled, children}: PageLayoutProps) {
  return <Aside.Provider>
    <a className="skip-link" href="#main-content">Skip to content</a><div id="header-marker" aria-hidden="true"/>
    {siteConfig.announcement && <div className="announcement">{siteConfig.announcement}</div>}
    <Header header={header} cart={cart} isLoggedIn={isLoggedIn} publicStoreDomain={publicStoreDomain}/>
    <main id="main-content" tabIndex={-1}>{children}</main>
    <Footer footer={footer} header={header} publicStoreDomain={publicStoreDomain} newsletterEnabled={newsletterEnabled}/>
    <Aside type="cart" heading="Your bag"><Suspense fallback={<p role="status">Retrieving your bag…</p>}><Await resolve={cart} errorElement={<p role="alert">Your bag couldn’t be loaded. Please refresh to try again.</p>}>{(resolved) => <CartMain cart={resolved} layout="aside"/>}</Await></Suspense></Aside>
    <Aside type="search" heading="Find something beautiful"><SearchOverlayContent/></Aside>
    <Aside type="mobile" heading="Explore"><HeaderMenu menu={header.menu} viewport="mobile" primaryDomainUrl={header.shop.primaryDomain.url} publicStoreDomain={publicStoreDomain}/></Aside>
    <Suspense><ScrollExperience/></Suspense>
  </Aside.Provider>;
}
