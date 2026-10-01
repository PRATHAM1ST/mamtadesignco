import {Pagination} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {HomeReviewsQuery} from 'storefrontapi.generated';
import {reviewContent} from '~/lib/storefront-content';
import { Icon } from './ui/Icon';

export function HomeReviews({reviews, error}: {reviews: HomeReviewsQuery['reviews'] | null; error: boolean}) {
  return <section id="reviews" className="home-reviews section-pad" aria-labelledby="reviews-heading">
    <div className="section-heading">
      <div><h2 id="reviews-heading">In your words.</h2><p>Customer reviews from the Mamta Design Co. community.</p></div>
      <Link to="/contact" className="text-link">Share your experience <Icon name="arrow" /></Link>
    </div>
    {error ? <p role="status">Reviews couldn’t be loaded. Please try again in a moment.</p> : reviews?.nodes.length ? (
      <Pagination connection={reviews} namespace="reviews">
        {({nodes, PreviousLink, NextLink, isLoading}) => <>
          <PreviousLink className="text-link" preventScrollReset>{isLoading ? 'Loading reviews…' : 'Previous reviews'}</PreviousLink>
          <div className="reviews-grid">{nodes.map((node) => {
            const review = reviewContent(node.fields);
            return review ? <figure key={node.id} className="review-quote">
              {review.rating && <p className="review-rating" aria-label={`${review.rating} out of 5 stars`}><span aria-hidden="true">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></p>}
              <blockquote><p>{review.body}</p></blockquote>
              <figcaption>{review.name}</figcaption>
            </figure> : null;
          })}</div>
          <NextLink className="text-link" preventScrollReset>{isLoading ? 'Loading reviews…' : 'More customer reviews'}</NextLink>
        </>}
      </Pagination>
    ) : <p>Customer stories will appear here as they’re published. Have a piece you love? We’d love to hear from you.</p>}
  </section>;
}
