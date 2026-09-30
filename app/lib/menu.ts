export function menuUrl(url: string, domains: string[]) {
  if (url.startsWith('/')) return url;
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return '/';
    const internal = domains.some((domain) => {
      try {return parsed.hostname === new URL(domain.includes('://') ? domain : `https://${domain}`).hostname;} catch {return false;}
    });
    return internal ? `${parsed.pathname}${parsed.search}${parsed.hash}` : parsed.href;
  } catch {return '/';}
}
