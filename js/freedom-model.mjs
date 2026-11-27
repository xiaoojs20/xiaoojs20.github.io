// 财富自由临界资产模型
// 与 static/js/freedom-lab.mjs 共用；测试见 scripts/freedom-lab.test.mjs
// 所有比率使用小数（0.025 而不是 2.5%）；金额单位为元。

export const MODEL_VERSION = '1.0.0';

export const DEFAULTS = {
  monthly: 10000, // 当前物价下的月开销
  real: 0.025, // 实际投资回报率（扣通胀后）
  nominal: 0.045, // 名义投资回报率，用于演示 Fisher 换算
  inflation: 0.02, // 长期通胀
  years: Infinity, // Infinity 表示永续（资产实际价值不下降）
  children: 0,
  perChild: 700000,
  health: 300000,
  housing: 2000000,
};

const safe = (v, lo, hi) => Math.min(hi, Math.max(lo, Number.isFinite(v) ? v : lo));

// 名义收益率换算实际收益率：Fisher 关系 (1+n) = (1+r)(1+i)
export function realRate(nominal, inflation) {
  const n = safe(nominal, -0.5, 1);
  const i = safe(inflation, -0.2, 1);
  return (1 + n) / (1 + i) - 1;
}

// 参数里显式给出的实际收益率优先，否则由名义收益率与通胀换算
function resolveReal(q) {
  return Number.isFinite(q.real) ? q.real : realRate(q.nominal, q.inflation);
}

// 资产 / 年支出的覆盖倍数
// 永续：1/r。有限年限（期末归零）：年金现值系数 [1 - (1+r)^-T] / r。
export function coverageFactor(real, years) {
  if (years === Infinity) return real > 0 ? 1 / real : Infinity;
  const T = safe(years, 0, 300);
  if (T === 0) return 0;
  if (Math.abs(real) < 1e-12) return T;
  return (1 - Math.pow(1 + real, -T)) / real;
}

// 正向：给定月开销与各项预留，求临界资产
// 一次性大项（育儿、医疗、房产）按今日价格直接相加，不做期限折现，与正文口径一致。
export function requiredAssets(p = {}) {
  const q = { ...DEFAULTS, ...p };
  const real = resolveReal(q);
  const factor = coverageFactor(real, q.years);
  const monthly = safe(q.monthly, 0, 1e7);
  const base = 12 * monthly * factor;
  const children = safe(q.children, 0, 10);
  const kids = children * safe(q.perChild, 0, 1e8);
  const health = safe(q.health, 0, 1e9);
  const housing = safe(q.housing, 0, 1e9);
  const total = base + kids + health + housing;
  return {
    real,
    monthly,
    factor,
    base,
    kids,
    health,
    housing,
    total,
    multiplier: monthly > 0 ? total / monthly : Infinity,
    withdrawal: total > 0 ? (12 * monthly) / total : 0,
  };
}

// 反向：给定资产，求可支撑的月开销
export function monthlyCapacity(p = {}) {
  const q = { ...DEFAULTS, ...p };
  const real = resolveReal(q);
  const factor = coverageFactor(real, q.years);
  const free = safe(q.assets, 0, 1e10) - safe(q.children, 0, 10) * safe(q.perChild, 0, 1e8)
    - safe(q.health, 0, 1e9) - safe(q.housing, 0, 1e9);
  if (free <= 0 || !Number.isFinite(factor) || factor <= 0) {
    return { real, factor, free: Math.max(free, 0), monthly: 0, feasible: false };
  }
  return { real, factor, free, monthly: free / (12 * factor), feasible: true };
}

// 资产能撑多少年：允许本金下降时的期限
// 年支出 <= 资产 × 实际收益率时永续，返回 Infinity。
export function depletionYears(p = {}) {
  const q = { ...DEFAULTS, ...p };
  const real = resolveReal(q);
  const F = safe(q.assets, 0, 1e10);
  const annual = 12 * safe(q.monthly, 0, 1e7);
  if (annual <= 0) return { real, years: Infinity, perpetual: true };
  if (F <= 0) return { real, years: 0, perpetual: false };
  if (annual <= F * real) return { real, years: Infinity, perpetual: true };
  if (Math.abs(real) < 1e-12) return { real, years: F / annual, perpetual: false };
  const ratio = 1 - (real * F) / annual;
  return { real, years: -Math.log(ratio) / Math.log(1 + real), perpetual: false };
}

// 逐年的资产实际价值轨迹，用于面板绘图
export function trajectory(assets, monthly, real, years = 60) {
  const out = [assets];
  let v = assets;
  for (let t = 1; t <= years; t++) {
    v = v * (1 + real) - 12 * monthly;
    out.push(Math.max(v, 0));
    if (v <= 0) {
      for (let k = t + 1; k <= years; k++) out.push(0);
      break;
    }
  }
  return out;
}
