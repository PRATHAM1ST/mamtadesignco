import {createWithCache, CacheCustom, type HydrogenContext} from '@shopify/hydrogen';
import {parseKiteOffers} from './kite';

export async function loadKiteOffers(context: Pick<HydrogenContext, 'env' | 'waitUntil'>, request: Request) {
  const domain = context.env.PUBLIC_STORE_DOMAIN;
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(domain)) return [];
  try {
    const withCache = createWithCache({cache: await caches.open('kite-offers'), waitUntil: context.waitUntil || (() => {}), request});
    return await withCache.run({
      cacheKey: ['kite-public-offers-v1', domain],
      cacheStrategy: CacheCustom({maxAge: 60, staleWhileRevalidate: 0}),
      shouldCacheResult: () => true,
    }, async () => {
      // Kite publishes this JSON through its theme embed; do not load its AJAX-cart scripts into Hydrogen.
      // ponytail: public embed format is app-owned; replace this adapter when Kite provides a supported headless feed.
      const response = await fetch(`https://${domain}/`, {headers: {'User-Agent': 'MamtaDesignCo-Storefront/1.0', Accept: 'text/html'}, redirect: 'manual', signal: AbortSignal.timeout(2500)});
      if (!response.ok) throw new Error(`Kite public configuration returned ${response.status}`);
      return parseKiteOffers(await response.text());
    });
  } catch (error) {
    console.error('Kite offer messaging unavailable', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}
