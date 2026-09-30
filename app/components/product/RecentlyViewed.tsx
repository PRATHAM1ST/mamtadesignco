import {useEffect, useState} from 'react';
import type {ProductCardFragment} from 'storefrontapi.generated';
import {ProductItem} from '../ProductItem';

const storageKey = 'mamta.recent-products.v1';
export function RecentlyViewed({productId}: {productId: string}) {
  const [products, setProducts] = useState<ProductCardFragment[]>([]);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    const stored: unknown = (() => {try {return JSON.parse(localStorage.getItem(storageKey) || '[]');} catch {return [];}})();
    const previous = Array.isArray(stored) ? stored.filter((value): value is string => typeof value === 'string' && /^gid:\/\/shopify\/Product\/\d+$/.test(value) && value !== productId).slice(0, 7) : [];
    try {localStorage.setItem(storageKey, JSON.stringify([productId, ...previous]));} catch { /* Browser storage is optional. */ }
    setProducts([]);
    setFailed(false);
    if (previous.length) {
      void fetch('/api/recent-products', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ids: previous}), signal: controller.signal})
        .then(async (response) => {
          if (!response.ok) throw new Error('Could not refresh recently viewed products');
          const result = await response.json() as {products: ProductCardFragment[]};
          setProducts(result.products);
        }).catch((error: unknown) => {if (error instanceof Error && error.name !== 'AbortError') setFailed(true);});
    }
    return () => controller.abort();
  }, [productId]);
  if (!products.length && !failed) return null;
  return <section className="product-recommendations recently-viewed" aria-labelledby="recently-viewed-heading">
    <div className="section-heading"><p className="eyebrow">Your edit</p><h2 id="recently-viewed-heading">A second look.</h2></div>
    {failed ? <p role="status">Your recently viewed pieces could not be refreshed. Please try again later.</p> : <div className="products-grid">{products.slice(0, 4).map((product) => <ProductItem product={product} key={product.id} />)}</div>}
  </section>;
}
