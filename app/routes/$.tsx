import type {Route} from './+types/$';
import {Form, Link, useRouteError, isRouteErrorResponse} from 'react-router';
import {routeSeo} from '~/lib/seo';

export const meta: Route.MetaFunction = () => routeSeo({title: 'Page not found', noindex: true});

export async function loader({request}: Route.LoaderArgs) {
  throw new Response(`${new URL(request.url).pathname} not found`, {
    status: 404,
  });
}

export default function CatchAllPage() {
  return null;
}

export function ErrorBoundary() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return <div className="content-shell content-empty"><p className="eyebrow">{notFound ? '404 / An unexpected turn' : 'A small interruption'}</p><h1>{notFound ? 'A different way to the celebration.' : 'Let’s try again.'}</h1><p>{notFound ? 'This page has moved, or is yet to be written. Your next favourite piece is still waiting.' : 'We couldn’t load this page. Please try again in a moment.'}</p><Link className="button" to="/shop">Explore the shop →</Link><Form className="premium-form" action="/search" method="get"><label htmlFor="not-found-search">Find something beautiful</label><input id="not-found-search" name="q" type="search" maxLength={200} required /><button className="text-button" type="submit">Search →</button></Form></div>;
}
