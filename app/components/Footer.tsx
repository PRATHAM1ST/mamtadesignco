import {Suspense} from 'react';
import {Await, Link} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {siteConfig} from '~/lib/site-config';
import {menuUrl} from '~/lib/menu';
import {Newsletter} from '~/components/forms/Newsletter';

export function Footer({footer, header, publicStoreDomain, newsletterEnabled = false}: {
  footer: Promise<FooterQuery | null>; header: HeaderQuery; publicStoreDomain: string; newsletterEnabled?: boolean;
}) {
  return <footer className="footer">
    <div className="footer-top"><div><p className="eyebrow">MAMTA DESIGN CO.</p><h2>For the nights<br/>you remember.</h2><Link className="text-link" to="/shop">Find your Chaniya <span>↗</span></Link></div>
      <div className="footer-navigation"><nav aria-label="Explore the store"><p className="eyebrow">EXPLORE</p><Link to="/shop">Shop all</Link><Link to="/catalogue">The catalogue</Link><Link to="/collections">Collections</Link><Link to="/blogs">Journal</Link><Link to="/favorites">Your favorites</Link></nav>
        <nav aria-label="Customer care"><p className="eyebrow">HERE FOR YOU</p><Link to="/account">Your account</Link><Link to="/contact">Contact</Link><Link to="/policies">Store policies</Link>
          <Suspense><Await resolve={footer}>{(response) => response?.menu?.items.map((item) => item.url && <Link key={item.id} to={menuUrl(item.url, [publicStoreDomain, header.shop.primaryDomain.url])}>{item.title}</Link>)}</Await></Suspense>
          {siteConfig.supportEmail && <a href={`mailto:${siteConfig.supportEmail}`}>{siteConfig.supportEmail}</a>}
        </nav></div>
      {newsletterEnabled && <Newsletter enabled={newsletterEnabled}/>}
    </div>
    <div className="footer-wordmark" aria-hidden="true">mamta.</div>
    <div className="footer-bottom"><span>© {new Date().getUTCFullYear()} {siteConfig.brandName}</span><span>India · English</span><span>Secure checkout by Shopify</span></div>
  </footer>;
}
