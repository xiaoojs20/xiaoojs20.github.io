// A continuous economic budget, not an insurer quote or a replacement schedule.
// CNY throughout; km is equivalent annual taxi demand, detour * km is driving.
export const MODEL_VERSION = '2026-11-09.1';
const PREVIOUS_MODEL_VERSION = '2026-11-08.3';
export const SEARCH_LIMIT_KM = 200000;
export const REFERENCE_PRICE = 250000;
export const CITIES = {
  beijing: { fare: 3.2, homeParking: 650, workParking: 200, otherParking: 120, petrol: 8.9, plate: 0 },
  shanghai: { fare: 3.6, homeParking: 850, workParking: 280, otherParking: 180, petrol: 9.41, plate: 93874 },
  quanzhou: { fare: 2.7, homeParking: 250, workParking: 80, otherParking: 60, petrol: 8.9, plate: 0 },
};
const VEHICLE_DEFAULTS = {
  // Model Y rear-wheel drive and 2027 Tiguan L Pro 380TSI 2WD Pilot Edition.
  ev: { price: 263500, electricityUse: 15, warrantyYears: 4, serviceBase: 600, serviceKm: 20000, damageRate: 2.1 },
  gas: { price: 251800, fuelUse: 9, warrantyYears: 3, serviceBase: 1000, serviceKm: 10000, damageRate: 1.6 },
};
export const DEFAULTS = Object.freeze({
  city: 'shanghai', type: 'ev', years: 5, km: 10000,
  ...CITIES.shanghai, ...VEHICLE_DEFAULTS.ev, plate: 0, taxMode: 'policy2026', customTax: 0,
  registration: 500, charger: 3000, saleFee: 2, plateRecovery: 100,
  residualFactor: 100, luxuryDecay: 1.4, mileageDepreciation: 2,
  compulsoryPremium: 950, liabilityCoverage: 2000000, liabilityRate: .035,
  damageQuote: 0, insuranceMileageRisk: 5, insuranceFactor: 100,
  serviceQuote: 0, servicePriceExponent: .6, serviceYears: 1, serviceAgeRate: 3,
  tyreBase: 800, tyreQuote: 0, tyrePriceExponent: .35, tyreKm: 50000, tyreYears: 6,
  repairRate: .3, warrantyCoverage: 90, repairAgeRate: 20, repairMileageRisk: 15,
  fuelUse: VEHICLE_DEFAULTS.gas.fuelUse, homeElectricity: .55, publicElectricity: 1.5, homeShare: 65,
  annualTax: 0, tollShare: 0, tollRate: .5,
  opportunityRate: 3, loanShare: 0, loanRate: 4,
  detour: 1, timeValue: 0, extraMinutes: 0,
  costs: Object.freeze({ parking: true, insurance: true, energy: true, maintenance: true,
    tyres: true, repairs: true, taxesTolls: true, acquisition: true, plate: true,
    depreciation: true, capital: true, time: true }),
});
export const BOUNDS = {
  price: [10000, 2000000], years: [.5, 10], km: [0, SEARCH_LIMIT_KM], fare: [0, 50],
  homeParking: [0, 50000], workParking: [0, 50000], otherParking: [0, 50000],
  petrol: [0, 30], plate: [0, 500000], customTax: [0, 500000],
  registration: [0, 50000], charger: [0, 100000], saleFee: [0, 20], plateRecovery: [0, 100],
  residualFactor: [0, 200], luxuryDecay: [0, 10], mileageDepreciation: [0, 20],
  compulsoryPremium: [0, 10000], liabilityCoverage: [0, 10000000], liabilityRate: [0, 1],
  damageRate: [0, 20], damageQuote: [0, 200000], insuranceMileageRisk: [0, 200], insuranceFactor: [0, 500],
  serviceBase: [0, 50000], serviceQuote: [0, 50000], servicePriceExponent: [0, 2],
  serviceKm: [1000, 100000], serviceYears: [.25, 10], serviceAgeRate: [0, 100],
  tyreBase: [0, 20000], tyreQuote: [0, 20000], tyrePriceExponent: [0, 2],
  tyreKm: [5000, 200000], tyreYears: [1, 10],
  repairRate: [0, 10], warrantyYears: [0, 10], warrantyCoverage: [0, 100],
  repairAgeRate: [0, 200], repairMileageRisk: [0, 200],
  fuelUse: [0, 50], electricityUse: [0, 100], homeElectricity: [0, 10], publicElectricity: [0, 20], homeShare: [0, 100],
  annualTax: [0, 50000], tollShare: [0, 100], tollRate: [0, 5],
  opportunityRate: [0, 20], loanShare: [0, 100], loanRate: [0, 30],
  detour: [.5, 3], timeValue: [0, 2000], extraMinutes: [-10, 10],
};

export function validate(p) {
  if (!Object.hasOwn(CITIES, p.city) || !['ev', 'gas'].includes(p.type)
    || !['policy2026', 'full', 'custom'].includes(p.taxMode)) throw new RangeError('Invalid scenario');
  if (!p.costs || typeof p.costs !== 'object'
    || Object.keys(DEFAULTS.costs).some(key => typeof p.costs[key] !== 'boolean')) throw new RangeError('Invalid cost selection');
  for (const [key, [min, max]] of Object.entries(BOUNDS)) {
    if (typeof p[key] !== 'number' || !Number.isFinite(p[key]) || p[key] < min || p[key] > max) throw new RangeError('Invalid parameter: ' + key);
  }
  return p;
}

const AGE = [0, 1, 3, 5, 8, 10];
// These are scenario age-only retention anchors, not market observations.
const RETENTION = { gas: [1, .78, .51, .40, .27, .20], ev: [1, .80, .48, .35, .20, .13] };
export function retention(type, years) {
  if (!RETENTION[type] || !Number.isFinite(years) || years < 0 || years > 10) throw new RangeError('Unsupported age');
  const end = AGE.findIndex(age => age >= years);
  if (end === 0) return 1;
  const s = (years - AGE[end - 1]) / (AGE[end] - AGE[end - 1]);
  return Math.exp((1 - s) * Math.log(RETENTION[type][end - 1]) + s * Math.log(RETENTION[type][end]));
}

function valuePath(p, annualDrivingKm) {
  const decay = p.luxuryDecay / 100 * Math.max(p.price / 100000 - 3, 0)
    + p.mileageDepreciation / 100 * annualDrivingKm / 10000;
  if (p.residualFactor === 0) return { resale: 0, residualRate: 0, meanValue: 0 };
  // A power calibration can raise or lower retention without making value exceed price.
  const agePower = 100 / p.residualFactor;
  if (!Number.isFinite(agePower)) return { resale: 0, residualRate: 0, meanValue: 0 };
  const terminalRate = retention(p.type, p.years) ** agePower * Math.exp(-decay * p.years);
  // Exact integral of the piecewise exponential age/value curve over [0, H].
  let integral = 0;
  for (let n = 1; n < AGE.length && AGE[n - 1] < p.years; n++) {
    const left = AGE[n - 1], right = Math.min(AGE[n], p.years), duration = right - left;
    const slope = agePower * Math.log(RETENTION[p.type][n] / RETENTION[p.type][n - 1]) / (AGE[n] - left) - decay;
    const initialRate = RETENTION[p.type][n - 1] ** agePower * Math.exp(-decay * left);
    integral += initialRate * (Math.abs(slope) < 1e-12 ? duration : Math.expm1(slope * duration) / slope);
  }
  return { resale: p.price * terminalRate, residualRate: terminalRate,
    meanValue: p.price * integral / p.years };
}

function policyValue(p, annualDrivingKm) {
  const decay = p.luxuryDecay / 100 * Math.max(p.price / 100000 - 3, 0)
    + p.mileageDepreciation / 100 * annualDrivingKm / 10000;
  let total = 0;
  for (let year = 0; year < p.years; year++) {
    const weight = Math.min(1, p.years - year);
    const value = year === 0 ? p.price : p.residualFactor === 0 ? 0
      : p.price * retention(p.type, year) ** (100 / p.residualFactor) * Math.exp(-decay * year);
    total += value * weight;
  }
  return total / p.years;
}

export function purchaseTax(p) {
  const full = p.price / 1.13 * .1;
  if (p.taxMode === 'custom') return p.customTax;
  return p.type === 'ev' && p.taxMode === 'policy2026' ? full - Math.min(full * .5, 15000) : full;
}

export function calculate(p, { solveCrossings = true } = {}) {
  validate(p);
  const P = p.price, H = p.years;
  const tax = p.costs.acquisition ? purchaseTax(p) : 0;
  const charger = p.costs.acquisition && p.type === 'ev' ? p.charger : 0;
  const registration = p.costs.acquisition ? p.registration : 0;
  const plate = p.costs.plate ? p.plate : 0, plateRefund = plate * p.plateRecovery / 100;
  const initial = P + tax + charger + registration + plate;
  const serviceUnit = p.serviceQuote > 0 ? p.serviceQuote : p.serviceBase * (P / REFERENCE_PRICE) ** p.servicePriceExponent;
  const tyreUnit = p.tyreQuote > 0 ? p.tyreQuote : p.tyreBase * (P / REFERENCE_PRICE) ** p.tyrePriceExponent;
  const damageNew = p.damageQuote > 0 ? p.damageQuote : P * p.damageRate / 100;
  const liability = p.liabilityCoverage * p.liabilityRate / 100;
  const postWarranty = Math.max(H - p.warrantyYears, 0);
  const repairAgeExposure = ((1 - p.warrantyCoverage / 100) * Math.min(H, p.warrantyYears)
    + postWarranty + p.repairAgeRate / 100 * postWarranty ** 2 / 2) / H;
  const energy = !p.costs.energy ? 0 : p.type === 'ev'
    ? p.electricityUse / 100 * (p.homeShare / 100 * p.homeElectricity + (1 - p.homeShare / 100) * p.publicElectricity)
    : p.fuelUse / 100 * p.petrol;
  const timePerKm = p.costs.time ? p.timeValue * p.extraMinutes / 60 : 0;
  const at = K => {
    if (!Number.isFinite(K) || K < 0 || K > SEARCH_LIMIT_KM) throw new RangeError('Distance outside model range');
    const actualKm = p.detour * K, totalKm = actualKm * H;
    const values = valuePath(p, actualKm);
    const insuranceMeanValue = policyValue(p, actualKm);
    const insuranceUsage = (1 + p.insuranceMileageRisk / 100 * actualKm / 10000) / (1 + p.insuranceMileageRisk / 100);
    const insurance = p.costs.insurance ? (p.compulsoryPremium
      + (liability + damageNew * insuranceMeanValue / P) * insuranceUsage) * p.insuranceFactor / 100 : 0;
    const serviceCount = Math.max(H / p.serviceYears, totalKm / p.serviceKm);
    const tyreSets = Math.max(H / p.tyreYears, totalKm / p.tyreKm);
    const capital = p.costs.capital ? p.opportunityRate / 100 * (initial + values.resale + plateRefund) / 2
      + (p.loanRate - p.opportunityRate) / 100 * p.loanShare / 100 * P / 2 : 0;
    const rows = {
      parking: p.costs.parking ? 12 * (p.homeParking + p.workParking + p.otherParking) : 0,
      insurance,
      energy: actualKm * energy,
      maintenance: p.costs.maintenance ? serviceUnit * serviceCount / H * (1 + p.serviceAgeRate / 100 * H / 2) : 0,
      tyres: p.costs.tyres ? 4 * tyreUnit * tyreSets / H : 0,
      repairs: p.costs.repairs ? P * p.repairRate / 100 * repairAgeExposure
        * (1 + p.repairMileageRisk / 100 * actualKm / 10000) : 0,
      taxesTolls: p.costs.taxesTolls ? p.annualTax + actualKm * p.tollShare / 100 * p.tollRate : 0,
      acquisition: p.costs.acquisition ? (tax + registration + charger + values.resale * p.saleFee / 100) / H : 0,
      plate: (plate - plateRefund) / H,
      depreciation: p.costs.depreciation ? (P - values.resale) / H : 0,
      capital,
      time: timePerKm * K,
    };
    return { ...values, actualKm, totalKm, serviceCount, tyreSets, insuranceMeanValue, insuranceUsage, rows,
      car: Object.values(rows).reduce((a, b) => a + b, 0), taxi: p.fare * K };
  };
  const current = at(p.km);
  const carAt = K => at(K).car, taxiAt = K => p.fare * K;
  let breakKm = null, identical = false;
  if (solveCrossings) {
    const zero = carAt(0), last = carAt(SEARCH_LIMIT_KM), taxiLast = taxiAt(SEARCH_LIMIT_KM);
    identical = Math.abs(zero) < 1e-9 && Math.abs(last - taxiLast) < 1e-7
      && Math.abs(carAt(SEARCH_LIMIT_KM / 2) - taxiAt(SEARCH_LIMIT_KM / 2)) < 1e-7;
    if (!identical && Math.abs(zero) < 1e-9 && carAt(1) < taxiAt(1)) breakKm = 0;
    else if (!identical && zero > 0 && last <= taxiLast) {
      let left = 0, right = SEARCH_LIMIT_KM;
      // C(K)/K is nonincreasing for these nonnegative component models.
      // Its sign crossing against q is unique. No crossing is claimed beyond the range.
      for (let n = 0; n < 60; n++) {
        const middle = (left + right) / 2;
        if (carAt(middle) > taxiAt(middle)) left = middle;
        else right = middle;
      }
      breakKm = (left + right) / 2;
    }
  }
  return { ...current, saving: current.taxi - current.car, breakKm,
    breakMonthly: breakKm === null ? null : p.fare * breakKm / 12, identical,
    energy, tax, initial, capital: current.rows.capital, insurance: current.rows.insurance,
    serviceUnit, tyreUnit, damageNew, liability, repairAgeExposure,
    carAt, taxiAt, at, searchLimitKm: SEARCH_LIMIT_KM };
}

export function preset(p, city = p.city, type = p.type) {
  const cityChanged = city !== p.city;
  const vehicleChanged = type !== p.type;
  const next = { ...p, city, type };
  if (cityChanged) Object.assign(next, CITIES[city]);
  if (vehicleChanged) {
    Object.assign(next, VEHICLE_DEFAULTS[type], {
      serviceYears: DEFAULTS.serviceYears,
      damageQuote: 0,
      serviceQuote: 0,
      tyreQuote: 0,
      taxMode: DEFAULTS.taxMode,
      customTax: 0,
    });
    if (type === 'gas') next.petrol = CITIES[city].petrol;
  }
  if (cityChanged || vehicleChanged) {
    next.plate = type === 'gas' ? CITIES[city].plate : 0;
    next.annualTax = type === 'gas' ? (city === 'shanghai' ? 360 : 420) : 0;
  }
  return next;
}

export function restoreState(raw) {
  if (!raw || ![MODEL_VERSION, PREVIOUS_MODEL_VERSION].includes(raw.version)
    || typeof raw.parameters !== 'object' || !raw.parameters) throw new RangeError('Unknown configuration version');
  const p = { ...DEFAULTS };
  // Earlier links may contain only overrides. Restore the defaults they were created with.
  if (raw.version === PREVIOUS_MODEL_VERSION) {
    Object.assign(p, { price: 250000, petrol: 8.9, fuelUse: 7.5, electricityUse: 18, warrantyYears: 3 });
  }
  for (const key of Object.keys(DEFAULTS)) if (Object.hasOwn(raw.parameters, key)) p[key] = raw.parameters[key];
  if (p.costs && typeof p.costs === 'object') p.costs = Object.fromEntries(Object.keys(DEFAULTS.costs).map(key => [key, p.costs[key]]));
  return validate(p);
}
