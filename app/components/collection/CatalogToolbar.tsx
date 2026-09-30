import {Form, Link, useLocation, useNavigate, useNavigation} from 'react-router';
import {useState} from 'react';
import {Image} from '@shopify/hydrogen';
import type {CatalogFilterFragment} from 'storefrontapi.generated';
import {Modal} from '~/components/ui/Modal';
import {clearFiltersUrl, filterParam, FILTER_PREFIX, resetPagination, toggleFilterUrl} from '~/lib/filters';

type SortOption = {value: string; label: string};

export function CatalogToolbar({filters, totalCount, shownCount, sortOptions}: {
  filters: CatalogFilterFragment[];
  totalCount?: number;
  shownCount: number;
  sortOptions: SortOption[];
}) {
  const [open, setOpen] = useState(false);
  const {pathname, search} = useLocation();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const params = new URLSearchParams(search);
  const activeCount = Array.from(params).filter(([key, value]) => key.startsWith(FILTER_PREFIX) && value !== '').length;
  const sortValue = params.get('sort') || 'featured';
  const selected = filters.flatMap((filter) => filter.values.map((value) => ({filter, value, param: filterParam(value.input)})))
    .filter(({param}) => param && params.getAll(param[0]).includes(param[1]));
  const priceSelected = params.get('filter.price.min') || params.get('filter.price.max');
  const currentParams = resetPagination(new URLSearchParams(params));

  const filterBody = <div className="catalog-filter-body" data-lenis-prevent>
    <div className="catalog-filter-heading"><p>{activeCount ? `${activeCount} active ${activeCount === 1 ? 'filter' : 'filters'}` : 'Find your piece'}</p>{activeCount > 0 && <Link className="text-link" to={clearFiltersUrl(pathname, params)}>Clear all</Link>}</div>
    {filters.map((filter) => filter.type === 'PRICE_RANGE'
      ? <PriceFilter key={`${filter.id}-${search}`} params={currentParams} />
      : <details className="catalog-filter-group" key={filter.id} open>
        <summary>{filter.label}</summary>
        <ul>{filter.values.map((value) => {
          const param = filterParam(value.input);
          if (!param) return null;
          const checked = params.getAll(param[0]).includes(param[1]);
          const image = value.swatch?.image?.previewImage || value.image?.previewImage;
          const swatch = value.swatch?.color;
          return <li key={value.id}>
            <Link className={`catalog-filter-value ${checked ? 'is-selected' : ''} ${value.count === 0 && !checked ? 'is-empty' : ''}`} to={toggleFilterUrl(pathname, params, ...param)} preventScrollReset aria-label={`${checked ? 'Remove' : 'Apply'} ${filter.label}: ${value.label}, ${value.count} ${value.count === 1 ? 'piece' : 'pieces'}`}>
              <span className="filter-check" aria-hidden="true">{checked ? '✓' : ''}</span>
              {image && <Image className="filter-swatch" data={image} alt="" width={24} height={24} />}
              {!image && swatch && <span className="filter-swatch" style={{backgroundColor: swatch}} aria-hidden="true" />}
              <span>{value.label}</span><small>{value.count}</small>
            </Link>
          </li>;
        })}</ul>
      </details>)}
    <button className="button button-primary filter-show-results" onClick={() => setOpen(false)}>Show {totalCount === undefined ? 'pieces' : `${totalCount} pieces`}</button>
  </div>;

  return <div className="catalog-controls" aria-busy={navigation.state === 'loading'}>
    <div className="catalog-toolbar">
      {filters.length > 0 && <button className="catalog-filter-trigger" type="button" onClick={() => setOpen(true)} aria-haspopup="dialog"><span aria-hidden="true">☷</span> Filter {activeCount > 0 && <span className="filter-count">{activeCount}</span>}</button>}
      <p className="catalog-count">{totalCount === undefined ? `${shownCount} pieces shown` : `${totalCount} ${totalCount === 1 ? 'piece' : 'pieces'}`}</p>
      <Form method="get" action={pathname} className="catalog-sort-form">
        {Array.from(currentParams).filter(([key]) => key !== 'sort').map(([key, value]) => <input key={`${key}-${value}`} type="hidden" name={key} value={value} />)}
        <label htmlFor="catalog-sort">Sort by</label>
        <select id="catalog-sort" name="sort" value={sortOptions.some((item) => item.value === sortValue) ? sortValue : 'featured'} onChange={(event) => {
          const next = resetPagination(new URLSearchParams(params));
          next.set('sort', event.target.value);
          void navigate(`${pathname}?${next}`, {preventScrollReset: true});
        }}>{sortOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
        <noscript><button type="submit">Apply sort</button></noscript>
      </Form>
    </div>
    {activeCount > 0 && <div className="catalog-applied" aria-label="Applied filters">
      {selected.map(({value, param}) => param && <Link className="filter-chip" key={value.id} to={toggleFilterUrl(pathname, params, ...param)} preventScrollReset>{value.label}<span aria-hidden="true">×</span><span className="sr-only">Remove filter</span></Link>)}
      {priceSelected && <Link className="filter-chip" to={(() => {const next = resetPagination(new URLSearchParams(params)); next.delete('filter.price.min'); next.delete('filter.price.max'); return `${pathname}?${next}`;})()} preventScrollReset>Price range <span aria-hidden="true">×</span><span className="sr-only">Remove filter</span></Link>}
      <Link className="text-link" to={clearFiltersUrl(pathname, params)} preventScrollReset>Clear all</Link>
    </div>}
    <Modal open={open} onClose={() => setOpen(false)} title="Refine your selection" className="filter-dialog drawer">{filterBody}</Modal>
    <noscript><div className="catalog-nojs-filters">{filters.map((filter) => filter.type !== 'PRICE_RANGE' && <details key={filter.id}><summary>{filter.label}</summary>{filter.values.map((value) => {const param = filterParam(value.input); return param && <Link key={value.id} to={toggleFilterUrl(pathname, params, ...param)}>{value.label} ({value.count})</Link>;})}</details>)}<PriceFilter params={currentParams} /></div></noscript>
  </div>;
}

function PriceFilter({params}: {params: URLSearchParams}) {
  const [error, setError] = useState('');
  return <details className="catalog-filter-group" open><summary>Price range</summary>
    <Form method="get" className="price-filter-form" preventScrollReset onSubmit={(event) => {
      const form = new FormData(event.currentTarget);
      const min = form.get('filter.price.min');
      const max = form.get('filter.price.max');
      if (min && max && Number(min) > Number(max)) {event.preventDefault(); setError('Minimum price must be below maximum price.');}
      else setError('');
    }}>
      {Array.from(params).filter(([key]) => !key.startsWith('filter.price.')).map(([key, value]) => <input key={`${key}-${value}`} type="hidden" name={key} value={value} />)}
      <div className="price-filter-inputs"><label>Minimum<input type="number" name="filter.price.min" min="0" step="any" defaultValue={params.get('filter.price.min') || ''} inputMode="decimal" placeholder="Any" /></label><span aria-hidden="true">—</span><label>Maximum<input type="number" name="filter.price.max" min="0" step="any" defaultValue={params.get('filter.price.max') || ''} inputMode="decimal" placeholder="Any" /></label></div>
      <button className="button button-outline" type="submit">Apply price</button>
      {error && <p className="price-filter-error" role="alert">{error}</p>}
    </Form>
  </details>;
}
