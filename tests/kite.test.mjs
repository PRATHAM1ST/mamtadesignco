import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseKiteOffers, kiteOfferText} from '../app/lib/kite.ts';

function campaign(kind = 'order') {
  return {_id: 'campaign', title: 'Store offer', isEnabled: true, mode: 'AUTOMATIC',
    campaignScheduleData: {campaignSchedule: 'CONTINUOUS'}, salesChannelSettings: {channels: ['ONLINE_STORE']},
    discountFunctionType: kind === 'order' ? 'CONSOLIDATED_ORDER_DISCOUNT' : 'SHIPPING_DISCOUNT_V2',
    segmentsData: {segmentsList: [{discountType: kind === 'order' ? 'PERCENTAGE' : 'FREE_SHIPPING', discountValue: kind === 'order' ? '25' : 100,
      buyXRulesData: {rulesList: [{ruleType: 'cartSubtotal', ruleValue: {qualifierOperatorType: 'greaterThanOrEqualTo', qualifierValue: 6999}}]},
      getYRulesData: {rulesList: [{ruleType: kind === 'order' ? 'ORDER' : 'rateAll'}]},
    }]},
  };
}
const html = (...campaigns) => `<script type="application/json" id="kite-app-data">${JSON.stringify({userData: {currency: 'INR', storefrontAccessToken: 'never-forward-this'}, consolidatedCombinedDiscount: campaigns})}</script>`;

test('Kite published campaign edits determine offers, not hardcoded discount values', () => {
  const source = campaign();
  const segment = source.segmentsData.segmentsList[0];
  segment.discountValue = '15';
  segment.buyXRulesData.rulesList[0].ruleValue.qualifierValue = 3500;
  const [offer] = parseKiteOffers(html(source));
  assert.equal(kiteOfferText(offer), '15% off orders ₹3,500+');
  assert.equal(JSON.stringify(offer).includes('never-forward-this'), false);
  assert.deepEqual(Object.keys(offer).sort(), ['currency', 'id', 'kind', 'minimum', 'percentage', 'title']);
  assert.equal(parseKiteOffers(html(campaign('shipping')))[0].kind, 'shipping');
});

test('disabled, gated, scheduled, limited, and unrecognized Kite offers stay hidden', () => {
  for (const patch of [
    {isEnabled: false}, {isTestMode: true}, {isDeleted: true}, {mode: 'MANUAL'}, {isCampaignUrlEnabled: true},
    {campaignScheduleData: {campaignSchedule: 'SCHEDULED'}}, {salesChannelSettings: {channels: ['POS']}},
    {customerEligibilityRules: {rulesList: [{}]}}, {markets: ['US']}, {usageLimit: 10},
    {discountTriggeredRulesData: {rulesGlobalList: [{rulesList: [{}]}]}},
    {purchaseType: {appliesOnOneTimePurchase: false}}, {discountFunctionType: 'NEW_UNSUPPORTED_TYPE'},
  ]) assert.deepEqual(parseKiteOffers(html({...campaign(), ...patch})), [], JSON.stringify(patch));
  const restricted = campaign();
  restricted.segmentsData.segmentsList[0].buyXRulesData.rulesList.push({ruleType: 'customerTag'});
  assert.deepEqual(parseKiteOffers(html(restricted)), []);
});

test('invalid Kite data fails closed without blocking shopping', () => {
  for (const input of ['', '<script id="kite-app-data">broken JSON</script>', '<script id="kite-app-data">null</script>', html(null, {}, 'bad')]) {
    assert.deepEqual(parseKiteOffers(input), []);
  }
  for (const amount of [-1, 'invalid', null, 0]) {
    const source = campaign();
    source.segmentsData.segmentsList[0].buyXRulesData.rulesList[0].ruleValue.qualifierValue = amount;
    assert.deepEqual(parseKiteOffers(html(source)), []);
  }
});

test('scheduled Kite offers appear only inside their published window', () => {
  const source = {...campaign(), campaignScheduleData: {campaignSchedule: 'SCHEDULED', startDateTime_UTC: '2026-10-01T00:00:00Z', endDateTime_UTC: '2026-10-02T00:00:00Z'}};
  assert.equal(parseKiteOffers(html(source), Date.parse('2026-10-01T12:00:00Z')).length, 1);
  assert.equal(parseKiteOffers(html(source), Date.parse('2026-09-30T23:59:00Z')).length, 0);
  assert.equal(parseKiteOffers(html(source), Date.parse('2026-10-02T00:00:00Z')).length, 0);
});
