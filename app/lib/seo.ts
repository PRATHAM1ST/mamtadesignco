import type {MetaDescriptor} from 'react-router';

type RouteSeo = {
  title: string;
  description?: string | null;
  url?: string;
  image?: string | null;
  noindex?: boolean;
};

export function routeSeo({title, description, url, image, noindex}: RouteSeo): MetaDescriptor[] {
  const fullTitle = title.includes('Mamta') ? title : `${title} | Mamta Design Co`;
  const meta: MetaDescriptor[] = [
    {title: fullTitle},
    {property: 'og:title', content: fullTitle},
    {property: 'og:type', content: 'website'},
    {property: 'og:site_name', content: 'Mamta Design Co'},
    {name: 'twitter:card', content: image ? 'summary_large_image' : 'summary'},
    {name: 'twitter:title', content: fullTitle},
  ];
  if (description) meta.push(
    {name: 'description', content: description},
    {property: 'og:description', content: description},
    {name: 'twitter:description', content: description},
  );
  if (url) {
    const canonical = new URL(url);
    canonical.hash = '';
    canonical.search = '';
    meta.push({tagName: 'link', rel: 'canonical', href: canonical.href}, {property: 'og:url', content: canonical.href});
  }
  if (image) meta.push({property: 'og:image', content: image}, {name: 'twitter:image', content: image});
  if (noindex) meta.push({name: 'robots', content: 'noindex, nofollow'});
  return meta;
}

export function jsonLd(value: unknown) {
  // Escape HTML delimiters so merchant text cannot close a JSON-LD script.
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}
