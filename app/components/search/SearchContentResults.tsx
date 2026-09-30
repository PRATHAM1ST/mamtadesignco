import {Pagination} from '@shopify/hydrogen';
import {Link, useLocation} from 'react-router';
import type {ComponentProps} from 'react';
import {resetPagination} from '~/lib/filters';
import {urlWithTrackingParams} from '~/lib/search';

type ContentNode = {
  id: string;
  title: string;
  handle: string;
  trackingParameters?: string | null;
  blog?: {handle: string};
};

export function SearchContentResults<Node extends ContentNode>({connection, term, namespace, title}: {
  connection: ComponentProps<typeof Pagination<Node>>['connection'];
  term: string;
  namespace: 'articles' | 'pages';
  title: string;
}) {
  const location = useLocation();
  const key = `${namespace}?${resetPagination(new URLSearchParams(location.search))}`;
  return <section className="search-content-section"><h2>{title}</h2>
    <Pagination key={key} namespace={namespace} connection={connection}>{({nodes, PreviousLink, NextLink, isLoading}) => <>
      <PreviousLink className="text-link">Previous {namespace}</PreviousLink>
      <div className="search-content-links">{nodes.map((node) => <Link key={node.id} to={urlWithTrackingParams({baseUrl: namespace === 'articles' && node.blog ? `/blogs/${node.blog.handle}/${node.handle}` : `/pages/${node.handle}`, term, trackingParams: node.trackingParameters})}>{node.title}<span aria-hidden="true">↗</span></Link>)}</div>
      <NextLink className="text-link">{isLoading ? 'Loading…' : `More ${namespace} ↓`}</NextLink>
    </>}</Pagination>
  </section>;
}
