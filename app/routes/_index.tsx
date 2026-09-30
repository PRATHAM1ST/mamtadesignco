import {Suspense} from 'react';
import {Await, Link, useLoaderData} from 'react-router';
import {Image} from '@shopify/hydrogen';
import type {Route} from './+types/_index';
import {ProductItem} from '~/components/ProductItem';
import {EditorialMotion} from '~/components/motion/EditorialMotion';
import {Icon} from '~/components/ui/Icon';
import {PRODUCT_CARD_FRAGMENT} from '~/lib/product-fragments';
import {routeSeo} from '~/lib/seo';
import {assertStorefrontResponse} from '~/lib/storefront-errors';

export const meta: Route.MetaFunction = ({data}) =>
  routeSeo({
    title: 'Mamta Design Co · Designer Chaniya Choli & Navratri Couture',
    description:
      'Discover handcrafted Chaniya Choli, celebratory bridal wear, and designer Navratri couture from Mamta Design Co. Bespoke craftsmanship made in Ahmedabad, shipped worldwide.',
    url: data?.url,
    image: data?.products.nodes[0]?.featuredImage?.url,
    keywords: [
      'Mamta Design Co',
      'Chaniya Choli',
      'Navratri Chaniya Choli',
      'Designer Chaniya Choli',
      'Festive Couture',
      'Ahmedabad Chaniya',
      'Bridal Choli',
      'Traditional Navratri Outfits',
      'Indian Ethnic Wear',
    ],
  });
export async function loader({context, request}: Route.LoaderArgs) {
  const editorial = context.storefront.query(EDITORIAL_QUERY, {cache: context.storefront.CacheLong()})
    .then((result) => {assertStorefrontResponse(result.errors, 'Homepage editorial'); return {result, error: false};})
    .catch((error: unknown) => {console.error('Editorial content could not be loaded', error instanceof Error ? error.message : 'Unknown error'); return {result: null, error: true};});
  const data = await context.storefront.query(HOME_QUERY, {cache: context.storefront.CacheShort()});
  assertStorefrontResponse(data.errors, 'Homepage wardrobe');
  return {...data, editorial, url: new URL(request.url).origin + '/'};
}
export default function Homepage() {
  const {products, collections, editorial, homepage} = useLoaderData<typeof loader>();
  const hero = products.nodes[0];
  const featured = products.nodes[1] || hero;
  const text = (key: string, fallback: string) => homepage?.fields.find((field) => field.key === key)?.value || fallback;
  return <EditorialMotion>
    <section className="hero">
      <div className="hero-copy" data-hero-copy><p className="eyebrow">{text('eyebrow', 'THE NAVRATRI WARDROBE')}</p><h1>{text('headline', 'The night')}<br/><em>{text('headline_accent', 'is yours.')}</em></h1><p className="hero-description">{text('body', 'Chaniya, celebration, and a little drama. Dress for the moments that move you.')}</p><div className="hero-actions"><Link className="button button-light" to="/shop">{text('cta_label','Find your Chaniya')} <Icon name="arrow"/></Link><Link className="hero-secondary" to="/catalogue">Explore the catalogue</Link></div><span className="hero-edition">MAMTA DESIGN CO. &nbsp; / &nbsp; NAVRATRI</span></div>
      <div className="hero-media">{hero?.featuredImage ? <><Image data-hero-image data={hero.featuredImage} alt={hero.featuredImage.altText || hero.title} aspectRatio="3/4" sizes="(min-width: 900px) 55vw, 100vw" loading="eager" fetchPriority="high"/><Link className="hero-product-caption" to={`/products/${hero.handle}`}><span>{hero.title}</span><Icon name="arrow"/></Link></> : <div className="hero-empty"><span className="display-monogram">m.</span></div>}</div>
      <a href="#the-wardrobe" className="hero-scroll" aria-label="Scroll to the wardrobe">EXPLORE BELOW <span>↓</span></a>
    </section>
    <div className="editorial-strip"><span>AN EXPRESSION OF YOU.</span><span className="strip-flower" aria-hidden="true">✳</span><span>AFTER DARK. BEFORE DAWN.</span><span className="strip-flower" aria-hidden="true">✳</span><span>DRESS FOR THE DANCE.</span></div>
    <section id="the-wardrobe" className="section-pad wardrobe-section">
      <div className="section-heading" data-reveal><div><p className="eyebrow">THE WARDROBE</p><h2>Go on.<br/><em>Make an entrance.</em></h2></div><Link to="/shop" className="text-link">Shop all pieces <Icon name="arrow"/></Link></div>
      {products.nodes.length ? <div className="products-grid">{products.nodes.slice(0, 4).map((product) => <ProductItem key={product.id} product={product}/>)}</div> : <div className="empty-state"><h3>A new chapter is on its way.</h3><p>Our wardrobe will appear here when pieces are published.</p></div>}
    </section>
    {featured?.featuredImage && <section className="editorial-feature" data-reveal><div className="editorial-feature-image"><Image data={featured.images.nodes[1] || featured.featuredImage} sizes="(min-width: 900px) 50vw, 100vw" aspectRatio="3/4" loading="lazy"/></div><div className="editorial-feature-copy"><p className="eyebrow">IN FOCUS</p><span className="small-motif" aria-hidden="true">✳</span><h2>{featured.title.replace(/ Chaniya$/i, '')}<em>After hours.</em></h2><p>{featured.description.slice(0, 250)}{featured.description.length > 250 ? '…' : ''}</p><Link to={`/products/${featured.handle}`} className="text-link">Explore the piece <Icon name="arrow"/></Link></div></section>}
    {!!collections.nodes.length && <section className="section-pad"><div className="section-heading"><div><p className="eyebrow">COLLECTIONS</p><h2>A mood for every night.</h2></div><Link className="text-link" to="/collections">Explore all <Icon name="arrow"/></Link></div><div className="collection-editorial-grid">{collections.nodes.map((collection) => <Link className="collection-editorial-tile" key={collection.id} to={`/collections/${collection.handle}`}>{collection.image && <Image data={collection.image} sizes="(min-width:900px) 33vw, 100vw" aspectRatio="3/4" loading="lazy"/>}<h3>{collection.title}</h3></Link>)}</div></section>}
    <Suspense><Await resolve={editorial}>{({result, error}) => <>
      {error && <p className="content-notice" role="status">Our editorial stories are temporarily unavailable.</p>}
      {result?.campaigns.nodes.map((module) => {
        const headline = module.fields.find((field) => field.key === 'headline')?.value;
        const body = module.fields.find((field) => field.key === 'body')?.value;
        const imageRef = module.fields.find((field) => field.key === 'image')?.reference;
        const productRef = module.fields.find((field) => field.key === 'product')?.reference;
        const collectionRef = module.fields.find((field) => field.key === 'collection')?.reference;
        const href = productRef?.__typename === 'Product' ? `/products/${productRef.handle}` : collectionRef?.__typename === 'Collection' ? `/collections/${collectionRef.handle}` : '/catalogue';
        if (!headline) return null;
        return <section className="cms-story section-pad" key={module.id}><div><p className="eyebrow">THE MAMTA EDIT</p><h2>{headline}</h2>{body && <p>{body}</p>}<Link to={href} className="text-link">Explore the story <Icon name="arrow"/></Link></div>{imageRef?.__typename === 'MediaImage' && imageRef.image && <Image data={imageRef.image} sizes="(min-width:900px) 50vw, 100vw" loading="lazy"/>}</section>;
      })}
      {!!result?.faqs.nodes.length && <section className="home-faq section-pad"><div><p className="eyebrow">A LITTLE GUIDANCE</p><h2>Before the<br/><em>celebration.</em></h2><Link className="text-link" to="/faq">All your questions <Icon name="arrow"/></Link></div><div>{result.faqs.nodes.slice(0, 5).map((faq) => {const question = faq.fields.find((field) => field.key === 'question')?.value; const answer = faq.fields.find((field) => field.key === 'answer')?.value; return question && answer ? <details key={faq.id}><summary>{question}<Icon name="plus"/></summary><p>{answer}</p></details> : null;})}</div></section>}
    </>}</Await></Suspense>
    {products.nodes.length > 4 && <section className="section-pad second-wardrobe"><div className="section-heading"><div><p className="eyebrow">KEEP LOOKING</p><h2>Your next favourite.</h2></div><Link className="text-link" to="/catalogue">View the catalogue <Icon name="arrow"/></Link></div><div className="products-grid">{products.nodes.slice(4, 8).map((product) => <ProductItem key={product.id} product={product}/>)}</div></section>}
    <section className="service-links"><Link to="/policies">Before you order <span>Shipping, returns & store policies</span><Icon name="arrow"/></Link><Link to="/contact">A conversation away <span>Get in touch with Mamta Design Co</span><Icon name="arrow"/></Link><Link to="/account">Your wardrobe, continued <span>Your account & order history</span><Icon name="arrow"/></Link></section>
  </EditorialMotion>;
}
const HOME_QUERY = `#graphql
 query HomeWardrobe($country: CountryCode, $language: LanguageCode) @inContext(country:$country, language:$language) {
   products(first:8, sortKey:CREATED_AT, reverse:true) { nodes { ...ProductCard } }
   collections(first:3) { nodes { id handle title image { id url altText width height } } }
   homepage: metaobject(handle:{type:"storefront_homepage",handle:"homepage"}) { fields { key value } }
 }
 ${PRODUCT_CARD_FRAGMENT}
` as const;
const EDITORIAL_QUERY = `#graphql
 query HomeEditorial($country:CountryCode,$language:LanguageCode) @inContext(country:$country,language:$language) {
  campaigns: metaobjects(type:"storefront_campaign", first:6) { nodes { id fields { key value reference { __typename ... on MediaImage { image { id url altText width height } } ... on Product { handle } ... on Collection { handle } } } } }
  faqs: metaobjects(type:"storefront_faq",first:5) { nodes { id fields { key value } } }
 }
` as const;
