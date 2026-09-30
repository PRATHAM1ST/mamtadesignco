import {assertStorefrontResponse} from '~/lib/storefront-errors';
import {Link, useLoaderData} from 'react-router';
import {useState} from 'react';
import type {Route} from './+types/blogs.$blogHandle.$articleHandle';
import {Image, useNonce} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {routeSeo, jsonLd, breadcrumbJsonLd, articleJsonLd} from '~/lib/seo';
import {sanitizeHtml, plainText} from '~/lib/html';

export const meta: Route.MetaFunction = ({data}) =>
  routeSeo({
    title: `${data?.article.seo?.title || data?.article.title || 'Story'} · ${data?.blog?.title || 'The Journal'}`,
    description:
      data?.article.seo?.description ||
      plainText(data?.article.contentHtml).slice(0, 160),
    url: data?.url,
    image: data?.article.image?.url,
    type: 'article',
    keywords: [
      data?.article.title || '',
      data?.blog.title || 'The Journal',
      'Mamta Design Co',
      ...(data?.article.tags || []),
      'Navratri Fashion',
      'Chaniya Choli Couture',
      'Designer Choli Ahmedabad',
    ].filter(Boolean),
  });
export async function loader({context, request, params}: Route.LoaderArgs) {
  const {blogHandle, articleHandle} = params;
  if (!articleHandle || !blogHandle) throw new Response('Story not found.', {status: 404});
  const {blog, errors} = await context.storefront.query(ARTICLE_QUERY, {variables: {blogHandle, articleHandle}, cache: context.storefront.CacheLong()});
  assertStorefrontResponse(errors, 'Content');
  if (!blog?.articleByHandle) throw new Response('Story not found.', {status: 404});
  redirectIfHandleIsLocalized(request, {handle: articleHandle, data: blog.articleByHandle}, {handle: blogHandle, data: blog});
  return {article: {...blog.articleByHandle, contentHtml: sanitizeHtml(blog.articleByHandle.contentHtml)}, blog: {handle: blog.handle, title: blog.title}, url: new URL(request.url).origin + new URL(request.url).pathname};
}
export default function Article() {
  const {article, blog, url} = useLoaderData<typeof loader>();
  const nonce = useNonce();
  const [shareStatus, setShareStatus] = useState('');
  async function share() {
    try {
      if (navigator.share) await navigator.share({title: article.title, url});
      else { await navigator.clipboard.writeText(url); setShareStatus('Story link copied.'); }
    } catch { setShareStatus('Copy the address in your browser to share this story.'); }
  }
  const origin = new URL(url).origin;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      articleJsonLd({
        headline: article.title,
        description: article.seo?.description || plainText(article.contentHtml).slice(0, 160),
        url,
        image: article.image?.url,
        datePublished: article.publishedAt,
        authorName: article.author?.name,
        origin,
      }),
      breadcrumbJsonLd([
        {name: 'Home', url: origin},
        {name: 'The Journal', url: `${origin}/blogs`},
        {name: blog.title, url: `${origin}/blogs/${blog.handle}`},
        {name: article.title, url},
      ]),
    ],
  };
  return (
    <article className="content-shell article-page">
      <header className="content-heading">
        <Link className="eyebrow" to={`/blogs/${blog.handle}`}>
          ← {blog.title}
        </Link>
        <h1>{article.title}</h1>
        <div className="article-byline">
          <time dateTime={article.publishedAt}>
            {new Intl.DateTimeFormat('en-IN', {dateStyle: 'long', timeZone: 'Asia/Kolkata'}).format(
              new Date(article.publishedAt),
            )}
          </time>
          {article.author?.name && <span>By {article.author.name}</span>}
        </div>
      </header>
      {article.image && (
        <Image
          className="article-cover"
          data={article.image}
          alt={article.image.altText || article.title}
          sizes="(min-width: 1440px) 1200px, 90vw"
          loading="eager"
          fetchPriority="high"
        />
      )}
      <div className="prose" dangerouslySetInnerHTML={{__html: article.contentHtml}} />
      <footer className="article-footer">
        {article.tags.length > 0 && <p>{article.tags.join(' · ')}</p>}
        <button className="text-button" type="button" onClick={() => {void share();}}>
          Share this story ↗
        </button>
        <p role="status">{shareStatus}</p>
        <Link to={`/blogs/${blog.handle}`}>More from the journal →</Link>
      </footer>
      <script nonce={nonce} type="application/ld+json" dangerouslySetInnerHTML={{__html: jsonLd(structuredData)}} />
    </article>
  );
}
const ARTICLE_QUERY = `#graphql
  query Article($articleHandle:String!,$blogHandle:String!,$country:CountryCode,$language:LanguageCode)
  @inContext(language:$language,country:$country) {
    blog(handle:$blogHandle) {handle title articleByHandle(handle:$articleHandle) {handle title contentHtml publishedAt tags author:authorV2 {name} image {id altText url width height} seo {description title}}}
  }
` as const;




