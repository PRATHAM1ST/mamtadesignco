import {useEffect} from 'react';
import {Link, useFetcher} from 'react-router';
import {useFavorites} from '~/components/product/FavoriteButton';
import {ProductItem} from '~/components/ProductItem';
import type {loader as favoritesLoader} from './api.favorites';
import {routeSeo} from '~/lib/seo';

export const meta = () => routeSeo({title:'Your favorites',noindex:true});
export default function Favorites() {
  const {ids, handles} = useFavorites();
  const fetcher = useFetcher<typeof favoritesLoader>();
  const key = ids.join(',');
  useEffect(() => {
    if (key) void fetcher.load(`/api/favorites?${new URLSearchParams(key.split(',').map((id) => ['id', id])).toString()}`);
    // The serialized identifiers are the dependency; fetcher data must not trigger another request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return <div className="favorites-page section-pad"><p className="eyebrow">THE PIECES YOU LOVE</p><h1>Keep them close.</h1>
    {!handles.length ? <div className="empty-state"><h2>A little room for favourites.</h2><p>Save a piece with the heart icon. Your favorites stay in this browser.</p><Link className="button" to="/shop">Explore the wardrobe</Link></div> : <><p className="content-notice">Saved in this browser. Prices and availability are refreshed from Shopify.</p>{fetcher.state !== 'idle' && <p role="status">Refreshing your favourites…</p>}<div className="products-grid favorites-grid">{fetcher.data?.products.filter((product) => product && handles.includes(product.handle)).map((product) => product && <ProductItem key={product.id} product={product}/>)}</div>{fetcher.data && !fetcher.data.products.length && <p className="content-notice">Your saved pieces are currently unavailable.</p>}</>}
  </div>;
}
