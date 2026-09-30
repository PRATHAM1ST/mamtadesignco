import {Suspense, useEffect, useState} from 'react';
import {Await, Link, NavLink, useAsyncValue, useLocation} from 'react-router';
import {useOptimisticCart, useAnalytics, type CartViewPayload} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from './Aside';
import {Icon} from './ui/Icon';
import {siteConfig} from '~/lib/site-config';
import {menuUrl} from '~/lib/menu';
import logo from '~/assets/logo.png';

interface HeaderProps {
  header: HeaderQuery; cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>; publicStoreDomain: string;
}
export function Header({header, cart, isLoggedIn, publicStoreDomain}: HeaderProps) {
  const {open} = useAside();
  const {pathname} = useLocation();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const marker = document.getElementById('header-marker');
    if (!marker) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    observer.observe(marker);
    return () => observer.disconnect();
  }, []);
  return <header className={`header ${pathname === '/' ? 'header-home' : ''} ${scrolled ? 'header-scrolled' : ''}`}>
    <div className="header-left"><button className="icon-button" aria-label="Open navigation" onClick={() => open('mobile')}><Icon name="menu"/></button>
      <HeaderMenu menu={header.menu} viewport="desktop" primaryDomainUrl={header.shop.primaryDomain.url} publicStoreDomain={publicStoreDomain}/>
    </div>
    <Link to="/" className="wordmark" aria-label={`${siteConfig.brandName} home`}>
      <img src={logo} alt="Logo" className="brand-logo" width="64" height="64" />
      <div className='logo-text'>
        <span>MAMTA</span>
        <small>DESIGN CO.</small>
      </div>
    </Link>
    <nav className="header-ctas" aria-label="Your account and shopping bag">
      <a href="/search" className="icon-button" aria-label="Search" onClick={(event) => {event.preventDefault(); open('search');}}><Icon name="search"/></a>
      <Link to="/account" className="icon-button account-link" aria-label="Your account"><Icon name="user"/><Suspense><Await resolve={isLoggedIn} errorElement={null}>{(loggedIn) => loggedIn ? <span className="account-dot"/> : null}</Await></Suspense></Link>
      {siteConfig.enableWishlist && <Link to="/favorites" className="icon-button favorites-link" aria-label="Favorites"><Icon name="heart"/></Link>}
      <Suspense fallback={<CartBadge count={null}/>}><Await resolve={cart} errorElement={<Link className="icon-button" to="/cart" aria-label="Open bag"><Icon name="bag"/></Link>}><CartCount/></Await></Suspense>
    </nav>
  </header>;
}
export function HeaderMenu({menu, viewport, primaryDomainUrl, publicStoreDomain}: {
  menu: HeaderQuery['menu']; viewport: 'desktop' | 'mobile'; primaryDomainUrl: string; publicStoreDomain: string;
}) {
  const {close} = useAside();
  const fallback = [{id: 'shop', title: 'Shop', url: '/shop', items: []}, {id: 'catalogue', title: 'Catalogue', url: '/catalogue', items: []}];
  const items = menu?.items.length ? menu.items : fallback;
  const domains = [primaryDomainUrl, publicStoreDomain];
  return <nav className={`header-menu-${viewport}`} aria-label={viewport === 'mobile' ? 'Store navigation' : 'Main navigation'}>
    {items.map((item) => item.url && <div className="menu-group" key={item.id}>
      <NavLink className="header-menu-item" to={menuUrl(item.url, domains)} onClick={close} end={item.url.endsWith('/')} prefetch="intent">{item.title}</NavLink>
      {!!item.items.length && <details className="menu-children"><summary>Explore {item.title}<Icon name="chevron"/></summary><div>{item.items.map((child) => child.url && <Link key={child.id} to={menuUrl(child.url, domains)} onClick={close}>{child.title}</Link>)}</div></details>}
    </div>)}
    {viewport === 'mobile' && <div className="menu-extra">
      <div className="mobile-menu-brand"><img src={logo} alt="Mamta Design Co." width="42" height="42" /></div>
      <Link to="/catalogue" onClick={close}>The catalogue <Icon name="arrow"/></Link><Link to="/account" onClick={close}>Your account</Link><Link to="/policies" onClick={close}>Customer care</Link><p className="eyebrow">THE NIGHT IS YOURS.</p>
    </div>}
  </nav>;
}
function CartCount() {
  const source = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(source);
  return <CartBadge count={cart?.totalQuantity ?? 0}/>;
}
function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();
  return <a href="/cart" className="cart-toggle icon-button" aria-label={`Shopping bag${count ? `, ${count} items` : ''}`} onClick={(event) => {
    event.preventDefault(); open('cart');
    publish('cart_viewed', {cart, prevCart, shop, url: window.location.href} as CartViewPayload);
  }}><Icon name="bag"/>{count !== null && <span className="cart-count" aria-hidden="true">{count}</span>}</a>;
}
