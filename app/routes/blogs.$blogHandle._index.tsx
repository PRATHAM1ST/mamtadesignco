import {assertStorefrontResponse} from '~/lib/storefront-errors';
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/blogs.$blogHandle._index';
import {Image, getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {routeSeo} from '~/lib/seo';

export const meta: Route.MetaFunction = ({data}) => routeSeo({title: data?.blog.seo?.title || data?.blog.title || 'Journal', description: data?.blog.seo?.description, url: data?.url});
export async function loader({context, request, params}: Route.LoaderArgs) {
  if (!params.blogHandle) throw new Response('Journal not found.', {status: 404});
  const {blog, errors} = await context.storefront.query(BLOG_QUERY, {variables: {blogHandle: params.blogHandle, ...getPaginationVariables(request, {pageBy: 8})}, cache: context.storefront.CacheLong()});
  assertStorefrontResponse(errors, 'Content');
  if (!blog) throw new Response('Journal not found.', {status: 404});
  redirectIfHandleIsLocalized(request, {handle: params.blogHandle, data: blog});
  return {blog, url: request.url};
}
export default function Blog() {
  const {blog} = useLoaderData<typeof loader>();
  return <div className="content-shell blog"><header className="content-heading"><Link className="eyebrow" to="/blogs">← The journal</Link><h1>{blog.title}</h1></header>{blog.articles.nodes.length ? <PaginatedResourceSection connection={blog.articles} resourcesClassName="journal-grid">{({node: article}) => <Link className="journal-card" key={article.id} to={`/blogs/${blog.handle}/${article.handle}`}>{article.image && <Image data={article.image} alt={article.image.altText || article.title} aspectRatio="4/3" loading="lazy" sizes="(min-width: 900px) 42vw, 90vw" />}<time className="eyebrow" dateTime={article.publishedAt}>{new Intl.DateTimeFormat('en-IN', {dateStyle: 'long', timeZone: 'Asia/Kolkata'}).format(new Date(article.publishedAt))}</time><h2>{article.title}</h2>{article.excerpt && <p>{article.excerpt}</p>}<span className="eyebrow">Read the story →</span></Link>}</PaginatedResourceSection> : <div className="content-empty"><h2>Our next story is on its way.</h2><Link className="button" to="/shop">Explore the pieces →</Link></div>}</div>;
}
const BLOG_QUERY = `#graphql
  query Blog($language:LanguageCode,$country:CountryCode,$blogHandle:String!,$first:Int,$last:Int,$startCursor:String,$endCursor:String)
  @inContext(language:$language,country:$country) {
    blog(handle:$blogHandle) {
      title handle seo {title description}
      articles(first:$first,last:$last,before:$startCursor,after:$endCursor,reverse:true) {
        nodes {...ArticleItem}
        pageInfo {hasPreviousPage hasNextPage endCursor startCursor}
      }
    }
  }
  fragment ArticleItem on Article {
    author:authorV2 {name}
    excerpt handle id image {id altText url width height} publishedAt title blog {handle}
  }
` as const;



