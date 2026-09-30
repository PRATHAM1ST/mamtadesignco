import {FilterXSS} from 'xss';

const sanitizer = new FilterXSS({
  whiteList: {
    a: ['href', 'title'], abbr: ['title'], b: [], blockquote: [], br: [], caption: [],
    code: [], dd: [], div: [], dl: [], dt: [], em: [], figcaption: [], figure: [],
    h2: [], h3: [], h4: [], h5: [], h6: [], hr: [], i: [],
    img: ['src', 'alt', 'width', 'height', 'loading'], li: [], ol: [], p: [],
    pre: [], s: [], small: [], span: [], strong: [], sub: [], sup: [],
    table: [], tbody: [], td: ['colspan', 'rowspan'], th: ['scope', 'colspan', 'rowspan'],
    thead: [], tr: [], u: [], ul: [],
  },
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'iframe', 'object', 'embed'],
  css: false,
});

/** Shopify rich text is trusted merchant content; still strip executable markup. */
export function sanitizeHtml(html: string | null | undefined) {
  return sanitizer.process(html || '');
}

export const sanitizeShopifyHtml = sanitizeHtml;

export function plainText(html: string | null | undefined) {
  return new FilterXSS({whiteList: {}, stripIgnoreTag: true, stripIgnoreTagBody: ['script', 'style']})
    .process((html || '').replace(/<\/(?:p|div|h[1-6]|li|td|th|blockquote)>|<br\s*\/?>/gi, ' ')).replace(/\s+/g, ' ').trim();
}
