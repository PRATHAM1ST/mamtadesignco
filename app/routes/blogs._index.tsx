import {assertStorefrontResponse} from '~/lib/storefront-errors';
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/blogs._index';
import {Image, getPaginationVariables, useNonce} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {routeSeo, jsonLd, breadcrumbJsonLd} from '~/lib/seo';

export const meta: Route.MetaFunction = ({data}) =>
  routeSeo({
    title: 'The Journal · Stories, Craft & Festive Culture',
    description:
      'Stories, artisanal craftsmanship, styling guides, and festive notes from Mamta Design Co. Explore the world behind our handcrafted Chaniya Cholis.',
    url: data?.url,
    keywords: [
      'Mamta Design Co Journal',
      'Chaniya Choli Stories',
      'Navratri Fashion Notes',
      'Gujarati Heritage Couture',
      'Artisanal Craftsmanship',
      'Festive Dressing Guide',
    ],
  });
export async function loader({context, request}: Route.LoaderArgs) {
  const {blogs, errors} = await context.storefront.query(BLOGS_QUERY, {variables: getPaginationVariables(request, {pageBy: 12}), cache: context.storefront.CacheLong()});
  assertStorefrontResponse(errors, 'Content');
  return {blogs, url: request.url};
}
export default function Blogs() {
  const {blogs, url} = useLoaderData<typeof loader>();
  const nonce = useNonce();
  const published = blogs.nodes.some(blog => blog.articles.nodes.length > 0);
  const origin = new URL(url).origin;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        name: 'The Journal · Mamta Design Co.',
        description: 'Stories, craftsmanship, and festive dressing guides from Mamta Design Co.',
        url,
      },
      breadcrumbJsonLd([
        {name: 'Home', url: origin},
        {name: 'The Journal', url},
      ]),
    ],
  };
  return (
    <div className="content-shell blogs">
      <header className="content-heading">
        <p className="eyebrow">Notes from Mamta</p>
        <h1>The journal.</h1>
        <p>For the moments before, during and after the celebration.</p>
      </header>
      {published ? (
        <PaginatedResourceSection connection={blogs} resourcesClassName="journal-grid">
          {({node: blog}) => (
            <section className="journal-section" key={blog.handle}>
              <Link className="eyebrow" to={`/blogs/${blog.handle}`}>
                {blog.title} →
              </Link>
              {blog.articles.nodes.map((article) => (
                <Link className="journal-card" key={article.handle} to={`/blogs/${blog.handle}/${article.handle}`}>
                  {article.image && (
                    <Image
                      data={article.image}
                      alt={article.image.altText || article.title}
                      aspectRatio="4/3"
                      sizes="(min-width: 900px) 42vw, 90vw"
                      loading="lazy"
                    />
                  )}
                  <h2>{article.title}</h2>
                  {article.excerpt && <p>{article.excerpt}</p>}
                  <span className="eyebrow">Read the story →</span>
                </Link>
              ))}
            </section>
          )}
        </PaginatedResourceSection>
      ) : (
        <div className="content-empty">
          <h2>A new chapter is on its way.</h2>
          <p>Our next story will appear here. Until then, explore the pieces.</p>
          <Link className="button" to="/shop">
            Visit the shop →
          </Link>
        </div>
      )}
      <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{__html: jsonLd(structuredData)}} />
    </div>
  );
}
const BLOGS_QUERY = `#graphql
  query Blogs($country:CountryCode,$language:LanguageCode,$first:Int,$last:Int,$startCursor:String,$endCursor:String)
  @inContext(country:$country,language:$language) {
    blogs(first:$first,last:$last,before:$startCursor,after:$endCursor) {
      pageInfo {hasNextPage hasPreviousPage startCursor endCursor}
      nodes {title handle seo {title description} articles(first:2,reverse:true) {nodes {handle title excerpt image {id altText url width height}}}}
    }
  }
` as const;


