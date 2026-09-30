import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {urlWithTrackingParams, type PredictiveSearchReturn} from '~/lib/search';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

type PredictiveItems = PredictiveSearchReturn['result']['items'];
export type PredictiveOption = {
  id: string;
  title: string;
  group: string;
  url: string;
  image?: {url: string; altText?: string | null; width?: number | null; height?: number | null} | null;
  price?: MoneyV2;
};

export function getPredictiveOptions(items: PredictiveItems, term: string): PredictiveOption[] {
  return [
    ...items.products.map((item) => ({id: item.id, title: item.title, group: 'Pieces', image: item.selectedOrFirstAvailableVariant?.image, price: item.selectedOrFirstAvailableVariant?.price, url: urlWithTrackingParams({baseUrl: `/products/${item.handle}`, trackingParams: item.trackingParameters, term})})),
    ...items.collections.map((item) => ({id: item.id, title: item.title, group: 'Collections', image: item.image, url: urlWithTrackingParams({baseUrl: `/collections/${item.handle}`, trackingParams: item.trackingParameters, term})})),
    ...items.queries.map((item) => ({id: `suggestion-${item.text}`, title: item.text, group: 'Suggested searches', url: urlWithTrackingParams({baseUrl: '/search', trackingParams: item.trackingParameters, term: item.text})})),
    ...items.articles.map((item) => ({id: item.id, title: item.title, group: 'Journal', image: item.image, url: urlWithTrackingParams({baseUrl: `/blogs/${item.blog.handle}/${item.handle}`, trackingParams: item.trackingParameters, term})})),
    ...items.pages.map((item) => ({id: item.id, title: item.title, group: 'Pages', url: urlWithTrackingParams({baseUrl: `/pages/${item.handle}`, trackingParams: item.trackingParameters, term})})),
  ];
}

export function SearchResultsPredictive({options, listId, activeIndex, onSelect, onActive}: {
  options: PredictiveOption[];
  listId: string;
  activeIndex: number;
  onSelect: () => void;
  onActive: (index: number) => void;
}) {
  return <div id={listId} role="listbox" aria-label="Search suggestions" className="predictive-results">
    {Array.from(new Set(options.map((option) => option.group))).map((group) => <div role="group" aria-label={group} className="predictive-result-group" key={group}>
      <h3 aria-hidden="true">{group}</h3>
      {options.map((option, index) => option.group === group && <Link key={option.id} id={`${listId}-${index}`} role="option" aria-selected={activeIndex === index} className={`predictive-result-link ${activeIndex === index ? 'is-active' : ''}`} to={option.url} onClick={onSelect} onPointerMove={() => onActive(index)}>
        {option.image && <Image className="predictive-result-image" data={option.image} alt={option.image.altText || option.title} width={76} height={98} sizes="76px" crop="center" loading="lazy" />}
        <span className="predictive-result-copy"><span>{option.title}</span>{option.price && <small><Money data={option.price} /></small>}</span><span className="predictive-result-arrow" aria-hidden="true">↗</span>
      </Link>)}
    </div>)}
  </div>;
}

