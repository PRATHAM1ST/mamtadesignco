/** Merchant claims stay unset until the store explicitly provides them. */
export const siteConfig = {
  brandName: 'Mamta Design Co',
  supportEmail: undefined as string | undefined,
  whatsapp: undefined as string | undefined,
  announcement: undefined as string | undefined,
  freeShippingThreshold: undefined as {amount: string; currencyCode: string} | undefined,
  campaignEnd: undefined as string | undefined,
  enableWishlist: true,
  cartNotes: true,
  enablePickupMessaging: false,
  enableCodMessaging: false,
  social: [] as {label: string; url: string}[],
  headerMenuHandle: 'main-menu',
  footerMenuHandle: 'footer',
} as const;
