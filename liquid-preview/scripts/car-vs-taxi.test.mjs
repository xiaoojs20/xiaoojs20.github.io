import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULTS, MODEL_VERSION, SEARCH_LIMIT_KM, calculate, preset, purchaseTax, retention, restoreState } from '../static/js/car-vs-taxi-model.mjs';

const close = (a, b, tolerance = 1e-7) => assert.ok(Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(a), Math.abs(b)), a + ' != ' + b);
const fast = p => calculate(p, { solveCrossings: false });
const only = key => Object.fromEntries(Object.keys(DEFAULTS.costs).map(k => [k, k === key]));

test('Shanghai 250k example agrees with independent life-cycle arithmetic and numerical value integration', () => {
  const p = { ...DEFAULTS }, r = calculate(p), H = 5, P = 250000;
  const N = 20000, step = H / N;
  let integral = 0;
  for (let n = 0; n <= N; n++) {
    const age = n * step;
    const value = P * retention('ev', age) * Math.exp(-.02 * age);
    integral += value * (n === 0 || n === N ? .5 : 1);
  }
  const mean = integral * step / H;
  const resale = P * .35 * Math.exp(-.1);
  const tax = P / 1.13 * .05;
  const acquisition = (tax + 500 + 3000 + .02 * resale) / H;
  const capital = .03 * (P + tax + 500 + 3000 + resale) / 2;
  const renewalMean = Array.from({ length: 5 }, (_, age) => P * retention('ev', age) * Math.exp(-.02 * age)).reduce((a, b) => a + b, 0) / 5;
  const insurance = 950 + 700 + .021 * renewalMean;
  const maintenance = 600 * 5 / H * 1.075;
  const tyres = 4 * 800 * 1 / H;
  const repairs = P * .003 * .54 * 1.15;
  const total = (P - resale) / H + acquisition + capital + insurance + maintenance + tyres + repairs + 1310 * 12 + 1588.5;
  close(r.meanValue, mean);
  close(r.resale, resale);
  close(r.car, total);
  close(r.taxi, 36000);
  close(r.breakKm, 19496.70773411968);
  close(Object.values(r.rows).reduce((a, b) => a + b, 0), r.car);
});

test('automatic service, tyre and repair costs respond to price, while unit quotes override their price curves', () => {
  const p = { ...DEFAULTS }, low = fast(p), high = fast({ ...p, price: 500000 });
  close(high.serviceUnit / low.serviceUnit, 2 ** .6);
  close(high.tyreUnit / low.tyreUnit, 2 ** .35);
  close(high.rows.repairs / low.rows.repairs, 2);
  assert.ok(high.rows.insurance > low.rows.insurance);
  assert.ok(high.rows.depreciation > low.rows.depreciation);
  for (const price of [100000, 500000]) {
    const q = fast({ ...p, price, serviceQuote: 900, tyreQuote: 1200, damageQuote: 6000 });
    close(q.serviceUnit, 900);
    close(q.tyreUnit, 1200);
    close(q.damageNew, 6000);
  }
});

test('cumulative mileage reduces resale and average insured value; it is not charged as a second depreciation item', () => {
  const p = { ...DEFAULTS }, one = fast(p), two = fast({ ...p, km: 20000 });
  close(two.resale / one.resale, Math.exp(-.1));
  assert.ok(two.meanValue < one.meanValue);
  assert.ok(two.rows.depreciation > one.rows.depreciation);
  close(two.insuranceUsage, 1.1 / 1.05);
  close(one.insuranceUsage, 1);
  assert.equal(Object.hasOwn(two.rows, 'extraWear'), false);
  assert.equal(Object.hasOwn(DEFAULTS, 'extraWear'), false);
  close(fast({ ...p, mileageDepreciation: 0 }).resale, 250000 * .35);
});

test('service intervals use time or distance, then price and age, including a parked vehicle', () => {
  const p = { ...DEFAULTS };
  const parked = fast({ ...p, km: 0 }), busy = fast({ ...p, km: 40000 });
  close(parked.serviceCount, 5);
  close(parked.rows.maintenance, 645);
  close(busy.serviceCount, 10);
  close(busy.rows.maintenance, 1290);
  close(fast({ ...p, km: 40000, serviceQuote: 1000 }).rows.maintenance, 2150);
  assert.ok(fast({ ...p, years: 10 }).rows.maintenance > fast({ ...p, years: 1 }).rows.maintenance);
});

test('tyre consumption uses mileage or age; total consumption scales with holding period without inventing annual fees', () => {
  const p = { ...DEFAULTS };
  close(fast({ ...p, km: 0 }).rows.tyres, 4 * 800 / 6);
  close(fast(p).rows.tyres, 640);
  close(fast({ ...p, km: 20000 }).rows.tyres, 1280);
  close(fast({ ...p, years: 10 }).rows.tyres, 640);
  close(fast({ ...p, years: 10 }).rows.tyres * 10, fast(p).rows.tyres * 5 * 2);
  close(fast({ ...p, tyreQuote: 1200 }).rows.tyres, 960);
});

test('insurance uses average declining vehicle value and separates coverage from the mileage-risk assumption', () => {
  const p = { ...DEFAULTS };
  const short = fast({ ...p, years: 1 }), long = fast({ ...p, years: 10 });
  assert.ok(long.meanValue < short.meanValue);
  assert.ok(long.rows.insurance < short.rows.insurance);
  const r = fast({ ...p, damageQuote: 5000, insuranceMileageRisk: 0, insuranceFactor: 120 });
  close(r.rows.insurance, (950 + 700 + 5000 * r.insuranceMeanValue / p.price) * 1.2);
  close(fast({ ...p, years: 1, damageQuote: 5000 }).rows.insurance, 6650);
  close(fast({ ...p, years: .5, damageQuote: 5000 }).rows.insurance, 6650);
  const zeroDamage = fast({ ...p, damageRate: 0, damageQuote: 0, insuranceMileageRisk: 0 });
  close(zeroDamage.rows.insurance, 1650);
});

test('repair allowance responds to warranty, post-warranty age, price and distance', () => {
  const p = { ...DEFAULTS, warrantyCoverage: 100 };
  close(fast({ ...p, years: 3 }).rows.repairs, 0);
  close(fast({ ...p, years: 5 }).rows.repairs, 250000 * .003 * .48 * 1.15);
  assert.ok(fast({ ...p, years: 10 }).rows.repairs > fast({ ...p, years: 5 }).rows.repairs);
  assert.ok(fast({ ...p, km: 20000 }).rows.repairs > fast(p).rows.repairs);
});

test('zero-distance energy and tolls are zero; doubles track actual driving kilometres', () => {
  for (const type of ['ev', 'gas']) {
    const p = { ...preset({ ...DEFAULTS }, 'shanghai', type), detour: 1.2, tollShare: 20, tollRate: .5, annualTax: 0 };
    const zero = fast({ ...p, km: 0 }), one = fast(p), two = fast({ ...p, km: 20000 });
    assert.equal(zero.rows.energy, 0);
    assert.equal(zero.rows.taxesTolls, 0);
    close(two.rows.energy, 2 * one.rows.energy);
    close(two.rows.taxesTolls, 2 * one.rows.taxesTolls);
    close(one.rows.taxesTolls, 12000 * .2 * .5);
    close(two.rows.parking, one.rows.parking);
  }
});

test('bounded numerical crossings satisfy equality for cities, powertrains, ages and detours', () => {
  for (const city of ['beijing', 'shanghai', 'quanzhou']) {
    for (const type of ['gas', 'ev']) {
      for (const years of [.5, 4.5, 10]) {
        for (const fare of [0, .25, 3.6, 20]) {
          for (const detour of [.8, 1.3]) {
            const p = { ...preset({ ...DEFAULTS }, city, type), years, fare, detour };
            const r = calculate(p);
            if (r.breakKm !== null) {
              assert.ok(r.breakKm <= SEARCH_LIMIT_KM);
              close(r.carAt(r.breakKm), r.taxiAt(r.breakKm));
              assert.ok(r.carAt(r.breakKm * .99) > r.taxiAt(r.breakKm * .99));
              if (r.breakKm * 1.01 <= SEARCH_LIMIT_KM) assert.ok(r.carAt(r.breakKm * 1.01) < r.taxiAt(r.breakKm * 1.01));
            } else {
              for (const K of [1, 10000, 60000, SEARCH_LIMIT_KM]) assert.ok(r.carAt(K) > r.taxiAt(K));
            }
          }
        }
      }
    }
  }
});

test('cost per demanded kilometre is nonincreasing, supporting the root bracket across cost selections', () => {
  for (const key of Object.keys(DEFAULTS.costs)) {
    for (const price of [10000, 250000, 2000000]) {
      for (const years of [.5, 10]) {
        for (const residualFactor of [0, 100, 200]) {
          const r = fast({ ...DEFAULTS, price, years, residualFactor, costs: only(key) });
          assert.ok(r.resale >= 0 && r.resale <= price);
          let previous = Infinity;
          for (const K of [1, 100, 1000, 10000, 20000, 60000, 200000]) {
            const ratio = r.carAt(K) / K;
            assert.ok(ratio <= previous + 1e-7, key + ' ratio increased');
            previous = ratio;
          }
        }
      }
    }
  }
});

test('price and age remain continuous at former price bands and retention knots', () => {
  const p = { ...DEFAULTS, price: 186123.45, years: 4.5, km: 12765.43 };
  assert.notEqual(fast({ ...p, price: p.price + .01 }).car, fast(p).car);
  close(retention('ev', 4), Math.sqrt(.48 * .35));
  for (const years of [1, 3, 5, 8]) assert.ok(Math.abs(fast({ ...p, years: years + 1e-7 }).car - fast({ ...p, years: years - 1e-7 }).car) < .1);
  assert.ok(Math.abs(fast({ ...p, price: 300000.01 }).car - fast({ ...p, price: 299999.99 }).car) < .1);
  for (const K of [20000, 50000 / 6]) assert.ok(Math.abs(fast({ ...DEFAULTS, km: K + 1e-6 }).car - fast({ ...DEFAULTS, km: K - 1e-6 }).car) < .1);
});

test('purchase tax cap, plate recovery, loan adjustments and negative relative time retain correct accounting', () => {
  for (const price of [100000, 339000, 500000]) {
    const p = { ...DEFAULTS, price }, full = price / 1.13 * .1;
    close(purchaseTax(p), full - Math.min(full / 2, 15000));
    close(purchaseTax({ ...p, type: 'gas' }), full);
    close(purchaseTax({ ...p, taxMode: 'custom', customTax: 1234.56 }), 1234.56);
  }
  const p = preset({ ...DEFAULTS }, 'shanghai', 'gas'), r = fast(p), withoutPlate = fast({ ...p, plate: 0 });
  assert.equal(r.rows.plate, 0);
  close(r.car - withoutPlate.car, p.plate * p.opportunityRate / 100);
  close(fast({ ...DEFAULTS, loanShare: 60, loanRate: 3 }).car, fast(DEFAULTS).car);
  close(fast({ ...DEFAULTS, loanShare: 60, loanRate: 5 }).car - fast(DEFAULTS).car, .02 * .6 * DEFAULTS.price / 2);
  close(fast({ ...DEFAULTS, timeValue: 60, extraMinutes: -1 }).car, fast(DEFAULTS).car - DEFAULTS.km);
});

test('deselected costs contribute zero; all-zero and coincident curves are explicit', () => {
  for (const key of Object.keys(DEFAULTS.costs)) {
    const r = fast({ ...DEFAULTS, costs: { ...DEFAULTS.costs, [key]: false } });
    assert.equal(r.rows[key], 0);
    close(Object.values(r.rows).reduce((a, b) => a + b, 0), r.car);
  }
  const costs = Object.fromEntries(Object.keys(DEFAULTS.costs).map(key => [key, false]));
  const r = calculate({ ...DEFAULTS, costs });
  assert.equal(r.car, 0);
  assert.equal(r.breakKm, 0);
  assert.equal(calculate({ ...DEFAULTS, costs, fare: 0 }).identical, true);
  assert.equal(calculate({ ...DEFAULTS, fare: 0 }).breakKm, null);
});

test('shared state includes all assumptions and rejects old formulas, invalid numbers and unsafe fields', () => {
  const p = { ...DEFAULTS, price: 186123.45, years: 4.5, tyreQuote: 1234.56, damageQuote: 5000 };
  const raw = JSON.parse(JSON.stringify({ version: MODEL_VERSION, parameters: p }));
  assert.deepEqual(restoreState(raw), p);
  assert.throws(() => restoreState({ ...raw, version: '2026-11-08.2' }));
  assert.equal(Object.hasOwn(restoreState({ ...raw, parameters: { ...p, unexpected: '<script>' } }), 'unexpected'), false);
  for (const patch of [{ years: 0 }, { price: NaN }, { km: Infinity }, { fare: -1 }, { years: 11 }, { loanShare: 101 }, { tyreKm: 0 }, { residualFactor: 201 }]) assert.throws(() => calculate({ ...p, ...patch }), RangeError);
  assert.throws(() => restoreState({ ...raw, parameters: { ...p, city: '<script>' } }));
  assert.throws(() => restoreState({ ...raw, parameters: { ...p, costs: { ...p.costs, parking: 'false' } } }));
  assert.throws(() => calculate(p).carAt(SEARCH_LIMIT_KM + 1));
});
