/** Hydrogen returns GraphQL errors alongside partial data; never treat it as success. */
export function assertStorefrontSuccess(errors: readonly {message: string}[] | undefined, operation: string) {
  if (!errors?.length) return;
  console.error(`Storefront operation failed: ${operation}`, errors.map((error) => error.message));
  throw new Response('This part of the store is temporarily unavailable. Please try again.', {status: 502});
}

export const assertStorefrontResponse = assertStorefrontSuccess;
