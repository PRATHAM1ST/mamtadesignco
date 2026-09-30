/** These contracts are deliberately inactive until a merchant connects a real service. */
export type DeliveryServiceability = {
  pincode: string;
  serviceable: boolean;
  message: string;
  estimatedDelivery?: {earliest: string; latest: string; timeZone: string};
};
export type DeliveryProvider = (input: {pincode: string; variantId: string; quantity: number}) => Promise<DeliveryServiceability>;
export type StockNotificationProvider = (input: {email: string; variantId: string; consent: boolean}) => Promise<{accepted: boolean}>;
export type MerchantReview = {id: string; author: string; body: string; productId?: string; rating?: number; verified?: boolean};
export type EditorialUGC = {id: string; imageUrl: string; alt: string; sourceUrl: string; productIds: string[]; permissionConfirmed: boolean};
export type PickupAvailability = {locationId: string; locationName: string; available: boolean; pickupTime: string};
export type PreorderDetails = {enabled: boolean; merchantMessage: string};
