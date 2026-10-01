import {useRouteLoaderData} from 'react-router';
import {useEffect, useState} from 'react';
import {Link} from 'react-router';
import {Money} from '@shopify/hydrogen';
import type {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';
import type {RootLoader} from '~/root';
import {kiteOfferText, type KiteOffer} from '~/lib/kite';

export function KiteAnnouncement({offers}: {offers: KiteOffer[]}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  useEffect(() => {
    if (offers.length < 2 || paused || interacting || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % offers.length), 5000);
    return () => window.clearInterval(timer);
  }, [offers.length, paused, interacting]);
  if (!offers.length) return null;
  const active = index % offers.length;
  return <div className="kite-announcement" onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocus={() => setInteracting(true)} onBlur={(event) => {if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false);}}>
    <Link to="/shop">{kiteOfferText(offers[active])}</Link>
    {offers.length > 1 && <div className="kite-announcement-controls">
      <span className="sr-only">Offer {active + 1} of {offers.length}</span>
      {/* <button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? 'Resume offer rotation' : 'Pause offer rotation'}>{paused ? '▶' : 'Ⅱ'}</button> */}
      {/* <button type="button" onClick={() => {setIndex((active + 1) % offers.length); setPaused(true);}} aria-label="Show next offer">→</button> */}
    </div>}
  </div>;
}

export function KiteOffers({subtotal, currency, compact = false, pending = false}: {subtotal?: number; currency?: string; compact?: boolean; pending?: boolean}) {
  const root = useRouteLoaderData<RootLoader>('root');
  const offers = (root?.kiteOffers || []).filter((offer) => !currency || offer.currency === currency);
  if (!offers.length) return null;
  return <div className={`kite-offers${compact ? ' kite-offers-compact' : ''}`} aria-label="Automatic offers">
    {offers.map((offer) => {
      const remaining = subtotal === undefined ? null : Math.max(0, offer.minimum - subtotal);
      return <div className="kite-offer" key={offer.id}>
        <p>{kiteOfferText(offer)}</p>
        {!compact && (pending ? <small role="status">Updating offer eligibility…</small> : remaining !== null ? <>
          <progress max={offer.minimum} value={Math.min(subtotal!, offer.minimum)} aria-label={`Progress towards ${kiteOfferText(offer)}`} />
          <small>{remaining > 0 ? <>Add <Money as="span" data={{amount: remaining.toFixed(2), currencyCode: offer.currency as CurrencyCode}} /> more to reach this offer.</> : offer.kind === 'shipping' ? 'Spend requirement met. Shipping eligibility is confirmed at checkout.' : 'Spend requirement met. See applied savings below.'}</small>
        </> : <small>Automatic offer · No code needed</small>)}
      </div>;
    })}
  </div>;
}
