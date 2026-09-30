import type {CSSProperties} from 'react';
import {Link, useLoaderData} from 'react-router';
import {
  Image,
  Money,
  getPaginationVariables,
} from '@shopify/hydrogen';

import type {Route} from './+types/catalogue';

import {EditorialMotion} from '~/components/motion/EditorialMotion';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {Icon} from '~/components/ui/Icon';
import {routeSeo} from '~/lib/seo';
import {assertStorefrontResponse} from '~/lib/storefront-errors';

/* =========================================================
   SEO
========================================================= */

export const meta: Route.MetaFunction = ({data}) =>
  routeSeo({
    title: 'The catalogue · Mamta Design Co',
    description:
      'An editorial view of the Mamta Design Co Chaniya wardrobe.',
    url: data?.url,
  });

/* =========================================================
   LOADER
========================================================= */

export async function loader({
  context,
  request,
}: Route.LoaderArgs) {
  const result = await context.storefront.query(
    CATALOGUE_QUERY,
    {
      variables: getPaginationVariables(request, {
        pageBy: 12,
      }),
      cache: context.storefront.CacheShort(),
    },
  );

  assertStorefrontResponse(
    result.errors,
    'Editorial catalogue',
  );

  return {
    ...result,
    url: `${new URL(request.url).origin}/catalogue`,
  };
}

/* =========================================================
   TYPES
========================================================= */

type CatalogueLoaderData = Awaited<
  ReturnType<typeof loader>
>;

type CatalogueProduct =
  CatalogueLoaderData['products']['nodes'][number];

type LookbookEntry =
  CatalogueLoaderData['lookbook']['nodes'][number];

/* =========================================================
   IMAGE STYLES
========================================================= */

/**
 * The wrapper defines the image dimensions.
 *
 * Do NOT use Hydrogen's aspectRatio prop here.
 * This allows all Shopify images to render consistently,
 * even if their original dimensions are different.
 */
const imageFrameStyle: CSSProperties = {
  position: 'relative',
  width: '100%',
  aspectRatio: '4 / 5',
  overflow: 'hidden',
};

/**
 * Actual image fills the wrapper without distortion.
 */
const imageStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: '50% 20%',
};

/* =========================================================
   PAGE
========================================================= */

export default function Catalogue() {
  const {products, lookbook} =
    useLoaderData<typeof loader>();

  return (
    <EditorialMotion>
      <div className="catalogue-page section-pad">
        {/* ===============================
            HEADING
        =============================== */}

        <header className="catalogue-heading">
          <p className="eyebrow">
            MAMTA DESIGN CO. / THE CATALOGUE
          </p>

          <h1>
            A wardrobe
            <br />
            with <em>feeling.</em>
          </h1>

          <div>
            <p>
              Look a little closer.
              <br />
              Find the piece that feels like you.
            </p>

            <Link
              className="text-link"
              to="/shop"
            >
              Shop the wardrobe
              <Icon name="arrow" />
            </Link>
          </div>
        </header>

        {/* ===============================
            CMS LOOKBOOK
        =============================== */}

        {lookbook.nodes.length > 0 && (
          <div className="lookbook-grid cms-lookbook">
            {lookbook.nodes.map(
              (entry: LookbookEntry) => {
                const product =
                  entry.fields.find(
                    (field: {key: string}) =>
                      field.key === 'product',
                  )?.reference as CatalogueProduct;

                const image =
                  entry.fields.find(
                    (field: {key: string}) =>
                      field.key === 'image',
                  )?.reference as MediaImage;

                if (
                  product?.__typename !==
                  'Product'
                ) {
                  return null;
                }

                const photograph =
                  image?.__typename ===
                  'MediaImage'
                    ? image?.image
                    : product.featuredImage;

                const heading =
                  entry.fields.find(
                    (field: {key: string}) =>
                      field.key === 'title',
                  )?.value ?? product.title;

                const body =
                  entry.fields.find(
                    (field: {key: string}) =>
                      field.key === 'body',
                  )?.value;

                return (
                  <Link
                    key={entry.id}
                    className="lookbook-entry"
                    to={`/products/${product.handle}`}
                  >
                    <div
                      className="lookbook-image"
                      style={imageFrameStyle}
                    >
                      {photograph ? (
                        <Image
                          data={photograph}
                          sizes="
                            (min-width: 1200px) 45vw,
                            (min-width: 900px) 48vw,
                            (min-width: 600px) 50vw,
                            100vw
                          "
                          loading="lazy"
                          style={imageStyle}
                        />
                      ) : null}
                    </div>

                    <div className="lookbook-caption">
                      <h2>{heading}</h2>

                      {body ? (
                        <p>{body}</p>
                      ) : null}

                      <Icon name="arrow" />
                    </div>
                  </Link>
                );
              },
            )}
          </div>
        )}

        {/* ===============================
            PRODUCTS
        =============================== */}

        <PaginatedResourceSection
          connection={products}
          resourcesClassName="lookbook-grid"
        >
          {({
            node: product,
            index,
          }: {
            node: CatalogueProduct;
            index: number;
          }) => (
            <Link
              key={product.id}
              className="lookbook-entry"
              to={`/products/${product.handle}`}
            >
              <div
                className="lookbook-image"
                style={imageFrameStyle}
              >
                {product.featuredImage ? (
                  <Image
                    data={product.featuredImage}
                    sizes="
                      (min-width: 1200px) 45vw,
                      (min-width: 900px) 48vw,
                      (min-width: 600px) 50vw,
                      100vw
                    "
                    loading={
                      index === 0
                        ? 'eager'
                        : 'lazy'
                    }
                    style={imageStyle}
                  />
                ) : null}

                <span
                  className="lookbook-number"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(
                    2,
                    '0',
                  )}
                </span>
              </div>

              <div className="lookbook-caption">
                <h2>{product.title}</h2>

                <Money
                  data={
                    product.priceRange
                      .minVariantPrice
                  }
                />

                <Icon name="arrow" />
              </div>
            </Link>
          )}
        </PaginatedResourceSection>

        {/* ===============================
            EMPTY STATE
        =============================== */}

        {products.nodes.length === 0 && (
          <div className="empty-state">
            <h2>
              The catalogue is being prepared.
            </h2>

            <Link
              className="button"
              to="/shop"
            >
              Visit the shop
            </Link>
          </div>
        )}
      </div>
    </EditorialMotion>
  );
}

/* =========================================================
   SHOPIFY QUERY
========================================================= */

const CATALOGUE_QUERY = `#graphql
  query EditorialCatalogue(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  )
  @inContext(
    country: $country
    language: $language
  ) {
    products(
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
    ) {
      nodes {
        id
        title
        handle

        featuredImage {
          id
          url
          altText
          width
          height
        }

        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }

      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }

    lookbook: metaobjects(
      type: "storefront_lookbook"
      first: 24
    ) {
      nodes {
        id

        fields {
          key
          value

          reference {
            __typename

            ... on Product {
              handle
              title

              featuredImage {
                id
                url
                altText
                width
                height
              }
            }

            ... on MediaImage {
              image {
                id
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    }
  }
` as const;