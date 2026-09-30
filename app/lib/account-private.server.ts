/** Authentication redirects can be thrown before React Router merges headers. */
export async function privateAccountRequest<T>(operation: Promise<T>): Promise<T> {
  try {
    const result = await operation;
    if (result instanceof Response) result.headers.set('Cache-Control', 'private, no-store');
    return result;
  } catch (error) {
    if (error instanceof Response) error.headers.set('Cache-Control', 'private, no-store');
    throw error;
  }
}
