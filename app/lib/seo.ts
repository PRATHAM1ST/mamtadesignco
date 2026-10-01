import type {MetaDescriptor} from 'react-router';

export type RouteSeo = {
  title: string;
  description?: string | null;
  url?: string;
  image?: string | {url: string; width?: number | null; height?: number | null; altText?: string | null} | null;
  noindex?: boolean;
  type?: 'website' | 'product' | 'article';
  keywords?: string | string[];
  price?: {
    amount: string | number;
    currencyCode: string;
  };
  availability?: string;
};

export function routeSeo({
  title,
  description,
  url,
  image,
  noindex,
  type = 'website',
  keywords,
  price,
  availability,
}: RouteSeo): MetaDescriptor[] {
  const brandSuffix = 'Mamta Design Co.';
  const cleanTitle = (title || 'Mamta Design Co.').trim();
  const fullTitle = cleanTitle.includes('Mamta') ? cleanTitle : `${cleanTitle} | ${brandSuffix}`;
  const defaultDesc =
    'Handcrafted Chaniya Choli, celebratory ethnic wear, and luxury couture for Navratri and festive occasions by Mamta Design Co.';
  const metaDesc = (description && description.trim()) || defaultDesc;

  let origin = '';
  let canonicalUrl = '';
  if (url) {
    try {
      const parsed = new URL(url);
      origin = parsed.origin;
      parsed.hash = '';
      parsed.search = '';
      canonicalUrl = parsed.href;
    } catch {
      canonicalUrl = url;
    }
  }

  const imageData = typeof image === 'string' ? {url: image} : image;
  const imageUrl = imageData?.url || '/og-image.jpg';
  let resolvedImage = '';
  let shopifyImage = false;
  try {
    const parsed = origin ? new URL(imageUrl, origin) : new URL(imageUrl);
    if (parsed.hostname === 'cdn.shopify.com' && /\.(png|jpe?g|webp|avif)$/i.test(parsed.pathname)) {
      // Original product PNGs can exceed social crawlers' image download limits.
      // Open Graph images must always maintain a 1.91:1 aspect ratio (1200 x 628).
      parsed.searchParams.set('width', '1200');
      parsed.searchParams.set('height', '628');
      parsed.searchParams.set('crop', 'center');
      parsed.searchParams.set('format', 'jpg');
      shopifyImage = true;
    }
    if (['https:', 'http:'].includes(parsed.protocol)) resolvedImage = parsed.href;
  } catch { /* A sharing image must have an absolute public URL. */ }
  // Open Graph image ratios must always be 1.91:1 (standard: 1200 x 628).
  const imageWidth = shopifyImage ? 1200 : (imageData?.width || 1200);
  const imageHeight = shopifyImage ? 628 : Math.round(imageWidth / 1.91);
  const imageAlt = imageData?.altText || fullTitle;

  const meta: MetaDescriptor[] = [
    {title: fullTitle},
    {property: 'og:site_name', content: 'Mamta Design Co.'},
    {property: 'og:type', content: type},
    {property: 'og:title', content: fullTitle},
    {property: 'og:description', content: metaDesc},
    {name: 'description', content: metaDesc},
    {property: 'og:locale', content: 'en_IN'},
    {property: 'og:locale:alternate', content: 'en_US'},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: fullTitle},
    {name: 'twitter:description', content: metaDesc},
    {name: 'author', content: 'Mamta Design Co.'},
    {name: 'geo.region', content: 'IN-GJ'},
    {name: 'geo.placename', content: 'Ahmedabad'},
  ];

  if (canonicalUrl) {
    meta.push(
      {tagName: 'link', rel: 'canonical', href: canonicalUrl},
      {property: 'og:url', content: canonicalUrl},
    );
  }

  if (resolvedImage) {
    meta.push(
      {property: 'og:image', content: resolvedImage},
      ...(shopifyImage || !imageData ? [{property: 'og:image:type', content: 'image/jpeg'}] : []),
      ...(resolvedImage.startsWith('https:') ? [{property: 'og:image:secure_url', content: resolvedImage}] : []),
      ...(imageWidth && imageHeight ? [
        {property: 'og:image:width', content: String(imageWidth)},
        {property: 'og:image:height', content: String(imageHeight)},
      ] : []),
      {property: 'og:image:alt', content: imageAlt},
      {name: 'twitter:image', content: resolvedImage},
      {name: 'twitter:image:alt', content: imageAlt},
    );
  }

  if (type === 'product' && price) {
    meta.push(
      {property: 'product:price:amount', content: String(price.amount)},
      {property: 'product:price:currency', content: price.currencyCode},
    );
    if (availability) {
      meta.push({property: 'product:availability', content: availability});
    }
  }

  if (noindex) {
    meta.push(
      {name: 'robots', content: 'noindex, nofollow'},
      {name: 'googlebot', content: 'noindex, nofollow'},
    );
  } else {
    meta.push(
      {
        name: 'robots',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
      {
        name: 'googlebot',
        content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      },
    );
  }

  const keywordList = Array.isArray(keywords)
    ? keywords.join(', ')
    : keywords ||
      'Mamta Design Co, Chaniya Choli, Navratri Chaniya Choli, Designer Chaniya, Luxury Ethnic Wear, Traditional Choli, Ahmedabad Fashion, Gujarati Couture, Bridal Chaniya Choli';
  meta.push({name: 'keywords', content: keywordList});

  return meta;
}

export function jsonLd(value: unknown) {
  // Escape HTML delimiters so merchant text cannot close a JSON-LD script.
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

export function breadcrumbJsonLd(items: {name: string; url: string}[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqJsonLd(faqs: {question?: string | null; answer?: string | null}[]) {
  const validFaqs = faqs.filter(
    (faq): faq is {question: string; answer: string} =>
      Boolean(faq.question?.trim() && faq.answer?.trim()),
  );
  return {
    '@type': 'FAQPage',
    mainEntity: validFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question.trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer.trim(),
      },
    })),
  };
}

export function articleJsonLd({
  headline,
  description,
  url,
  image,
  datePublished,
  authorName,
  origin,
}: {
  headline: string;
  description?: string | null;
  url: string;
  image?: string | null;
  datePublished?: string | null;
  authorName?: string | null;
  origin: string;
}) {
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline,
    ...(description ? {description} : {}),
    url,
    ...(image ? {image} : {}),
    ...(datePublished ? {datePublished} : {}),
    author: {
      '@type': 'Person',
      name: authorName || 'Mamta Design Co.',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Mamta Design Co.',
      url: origin,
      logo: `${origin}/logo.png`,
    },
  };
}

export function contactJsonLd({
  url,
  email,
  phone,
  origin,
}: {
  url: string;
  email?: string | null;
  phone?: string | null;
  origin: string;
}) {
  return {
    '@type': 'ContactPage',
    '@id': `${url}#contact`,
    name: 'Contact Mamta Design Co.',
    url,
    mainEntity: {
      '@type': 'LocalBusiness',
      name: 'Mamta Design Co.',
      url: origin,
      image: `${origin}/og-image.jpg`,
      ...(email ? {email} : {}),
      ...(phone ? {telephone: phone} : {}),
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ahmedabad',
        addressRegion: 'Gujarat',
        addressCountry: 'IN',
      },
      priceRange: '₹₹₹',
    },
  };
}
