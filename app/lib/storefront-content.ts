type Fields = ReadonlyArray<{key: string; value?: string | null}>;

export function reviewContent(fields: Fields) {
  const value = (key: string) => fields.find((field) => field.key === key)?.value?.trim();
  const name = value('customer_name');
  const body = value('review');
  if (!name || !body) return null;
  const rating = Number(value('rating'));
  return {name, body, rating: Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : null};
}

export function promotionContent(fields: Fields = [], now = Date.now()) {
  const value = (key: string) => fields.find((field) => field.key === key)?.value?.trim();
  const title = value('offer_title');
  if (!title) return null;
  const start = value('offer_starts_at');
  const end = value('offer_ends_at');
  if (start && (!Number.isFinite(Date.parse(start)) || now < Date.parse(start))) return null;
  if (end && (!Number.isFinite(Date.parse(end)) || now >= Date.parse(end))) return null;
  return {title, code: value('offer_code'), terms: value('offer_terms')};
}
