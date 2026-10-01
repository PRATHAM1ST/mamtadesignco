export type KiteOffer = {id: string; title: string; kind: 'shipping' | 'order'; minimum: number; percentage: number; currency: string};

const object = (value: unknown): Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
const list = (value: unknown): unknown[] => Array.isArray(value) ? value : [];

/** Only public, automatic, unrestricted subtotal offers can be advertised to every visitor. */
export function parseKiteOffers(html: string, now = Date.now()): KiteOffer[] {
  const json = html.match(/<script\b[^>]*\bid=["']kite-app-data["'][^>]*>([\s\S]*?)<\/script>/i)?.[1];
  if (!json) return [];
  let config: Record<string, unknown>;
  try { config = object(JSON.parse(json)); } catch { return []; }
  const currency = object(config.userData).currency;
  if (typeof currency !== 'string' || !/^[A-Z]{3}$/.test(currency)) return [];
  const offers: KiteOffer[] = [];
  for (const entry of [...list(config.shippingDiscountV2), ...list(config.consolidatedCombinedDiscount)]) {
    const campaign = object(entry);
    if (campaign.isEnabled !== true || campaign.isDeleted || campaign.isTestMode || campaign.isCampaignUrlEnabled || campaign.mode !== 'AUTOMATIC') continue;
    if (!list(object(campaign.salesChannelSettings).channels).includes('ONLINE_STORE')) continue;
    // ponytail: only global subtotal campaigns; add other rule types with Kite's supported headless API.
    const schedule = object(campaign.campaignScheduleData);
    if (schedule.campaignSchedule === 'SCHEDULED') {
      const start = Date.parse(String(schedule.startDateTime_UTC || schedule.startDateTime || ''));
      const end = Date.parse(String(schedule.endDateTime_UTC || schedule.endDateTime || ''));
      if (!Number.isFinite(start) || !Number.isFinite(end) || now < start || now >= end) continue;
    } else if (schedule.campaignSchedule !== 'CONTINUOUS') continue;
    if (list(campaign.markets).length || list(campaign.selectedCollectionIds).length || list(campaign.selectedCustomerTags).length || list(campaign.customerSegmentIds).length) continue;
    if (list(object(campaign.customerEligibilityRules).rulesList).length) continue;
    const triggers = object(campaign.discountTriggeredRulesData);
    if (list(triggers.rulesList).length || list(triggers.rulesGlobalList).some((group) => list(object(group).rulesList).length)) continue;
    const purchase = object(campaign.purchaseType || campaign.discountOnSubscriptionProducts);
    if (purchase.appliesOnOneTimePurchase === false || campaign.appliesOncePerCustomer || campaign.usageLimit || object(campaign.usage).oncePerCustomer || object(campaign.usage).limitTotal) continue;
    const segments = list(object(campaign.segmentsData).segmentsList);
    if (segments.length !== 1) continue;
    const segment = object(segments[0]);
    const rules = list(object(segment.buyXRulesData).rulesList);
    const targets = list(object(segment.getYRulesData).rulesList);
    if (rules.length !== 1 || targets.length !== 1 || list(segment.discountMarketValues).length) continue;
    const rule = object(rules[0]);
    const condition = object(rule.ruleValue);
    if (rule.ruleType !== 'cartSubtotal' || condition.qualifierOperatorType !== 'greaterThanOrEqualTo') continue;
    if (condition.qualifierType && condition.qualifierType !== 'overallSubtotal') continue;
    if (condition.currency && condition.currency !== currency) continue;
    const minimum = Number(condition.qualifierValue);
    const target = object(targets[0]);
    const kind = campaign.discountFunctionType === 'SHIPPING_DISCOUNT_V2' && segment.discountType === 'FREE_SHIPPING' && target.ruleType === 'rateAll' ? 'shipping'
      : campaign.discountFunctionType === 'CONSOLIDATED_ORDER_DISCOUNT' && segment.discountType === 'PERCENTAGE' && target.ruleType === 'ORDER' ? 'order' : null;
    const percentage = Number(segment.discountValue);
    if (!kind || !Number.isFinite(minimum) || minimum <= 0 || !Number.isFinite(percentage) || percentage <= 0 || percentage > 100 || (kind === 'shipping' && percentage !== 100)) continue;
    if (typeof campaign._id !== 'string' || typeof campaign.title !== 'string') continue;
    offers.push({id: campaign._id, title: campaign.title.slice(0, 160), kind, minimum, percentage, currency});
  }
  return offers;
}

export function kiteOfferText(offer: KiteOffer) {
  const amount = new Intl.NumberFormat('en-IN', {style: 'currency', currency: offer.currency, minimumFractionDigits: 0, maximumFractionDigits: 2}).format(offer.minimum);
  return offer.kind === 'shipping' ? `Free shipping on orders ${amount}+` : `${offer.percentage}% off orders ${amount}+`;
}
