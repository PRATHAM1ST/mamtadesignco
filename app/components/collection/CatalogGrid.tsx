import {Pagination} from '@shopify/hydrogen';
import {Link, useLocation} from 'react-router';
import type {ProductCardFragment} from 'storefrontapi.generated';
import type {ComponentProps} from 'react';
import {ProductItem} from '~/components/ProductItem';
import {clearFiltersUrl, resetPagination} from '~/lib/filters';

type ProductConnection = ComponentProps<typeof Pagination<ProductCardFragment>>['connection'];

export function CatalogGrid({connection}: {connection: ProductConnection}) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const pageKey = `${location.pathname}?${resetPagination(new URLSearchParams(params))}`;
  const count = 'nodes' in connection ? connection.nodes.length : connection.edges.length;
  if (!count) return (
    <div className="catalog-empty">
      <span className="eyebrow">A fresh start</span>
      <h2>No pieces in this selection.</h2>
      <p>Try a wider price range or remove a filter.</p>
      <Link className="button button-primary" to={clearFiltersUrl(location.pathname, params)}>Clear filters</Link>
    </div>
  );
  return <Pagination key={pageKey} connection={connection}>
    {({nodes, isLoading, PreviousLink, NextLink}) => (
      <div aria-busy={isLoading}>
        <div className="catalog-pagination"><PreviousLink className="text-link">{isLoading ? 'Loading…' : '← Previous pieces'}</PreviousLink></div>
        <div className="products-grid catalog-grid">
          {nodes.map((product, index) => <ProductItem key={product.id} product={product} loading={index < 4 ? 'eager' : 'lazy'} />)}
        </div>
        <div className="catalog-pagination"><NextLink className="button button-outline">{isLoading ? 'Loading…' : 'Discover more pieces ↓'}</NextLink></div>
      </div>
    )}
  </Pagination>;
}
