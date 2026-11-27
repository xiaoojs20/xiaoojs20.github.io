import test from 'node:test';
import assert from 'node:assert/strict';
import {
  coverageFactor,
  depletionYears,
  monthlyCapacity,
  realRate,
  requiredAssets,
  trajectory,
} from '../static/js/freedom-model.mjs';

const near = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b)), a + ' != ' + b);

// 独立校验：用逐步递推二分求“期末恰好归零”的初始资产，与年金闭式解对拍
function bisectAssets(real, years, monthly) {
  let lo = 0;
  let hi = 1e10;
  for (let i = 0; i < 120; i++) {
    const mid = (lo + hi) / 2;
    if (trajectory(mid, monthly, real, years)[years] > 0) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

test('the 480 multiplier is exactly 12 / 2.5% over an infinite horizon', () => {
  near(coverageFactor(0.025, Infinity), 40);
  near(requiredAssets({ monthly: 1, real: 0.025, health: 0, housing: 0 }).multiplier, 480);
  near(requiredAssets({ monthly: 10000, real: 0.025, health: 0, housing: 0 }).base, 4_800_000);

  // 名义 4.5%、通胀 2% 经 Fisher 换算得 2.45%，对应 489.6 倍
  near(realRate(0.045, 0.02), 0.024509803921568627);
  const fisher = requiredAssets({ monthly: 1, nominal: 0.045, inflation: 0.02, real: null, health: 0, housing: 0 });
  near(fisher.real, 0.024509803921568627);
  near(fisher.multiplier, 489.6);
  assert.ok(fisher.multiplier > 480);

  // 存定期的实际收益率：五年期 1.3% 对 1.0% 通胀仅 0.30%，一年期 0.95% 已经为负
  near(realRate(0.013, 0.01), 0.002970297029702976);
  assert.ok(realRate(0.0095, 0.01) < 0);
});

test('a fixed horizon cuts the multiplier, and the limit converges to the perpetuity', () => {
  const at = y => requiredAssets({ monthly: 1, real: 0.025, years: y, health: 0, housing: 0 }).multiplier;
  near(at(30), 251.16351111313378);
  near(at(50), 340.3477401665078);
  assert.ok(at(30) < at(50) && at(50) < 480);
  near(at(300), 480, 1e-3);

  // 闭式解与逐步递推对拍
  for (const [r, T] of [[0.025, 30], [0.04, 20], [0.01, 45], [-0.01, 25]]) {
    near(bisectAssets(r, T, 1000), 12 * 1000 * coverageFactor(r, T), 1e-6);
  }

  // 零实际收益率时，覆盖倍数等于年限
  near(coverageFactor(0, 40), 40);
  near(requiredAssets({ monthly: 10000, real: 0, years: 25 }).base, 3_000_000);
});

test('the worked examples in the article add up', () => {
  // 全国城镇居民人均每月 2,990 元，夫妻两人
  const urban = requiredAssets({ monthly: 2990, real: 0.025 });
  near(urban.base, 1_435_200);
  near(urban.base * 2, 2_870_400);

  // 一线城市四口之家：月开销 1.5 万，两个孩子各 150 万，健康 150 万，房产 700 万
  const family = requiredAssets({
    monthly: 15000, real: 0.025,
    children: 2, perChild: 1_500_000, health: 1_500_000, housing: 7_000_000,
  });
  near(family.base, 7_200_000);
  near(family.kids, 3_000_000);
  near(family.total, 18_700_000);
  near(family.withdrawal, 0.009625668449197862);

  // 反向：600 万、一个孩子预留 70 万、健康 50 万、不买房
  const back = monthlyCapacity({
    assets: 6_000_000, real: 0.025, children: 1, perChild: 700_000, health: 500_000, housing: 0,
  });
  near(back.monthly, 10000);

  // 不要孩子、买 120 万的房、健康 50 万：与视频的 0.9 万一致
  const back2 = monthlyCapacity({
    assets: 6_000_000, real: 0.025, health: 500_000, housing: 1_200_000,
  });
  near(back2.monthly, 8_958.333333333334);
});

test('spending above the real return depletes the portfolio on a predictable schedule', () => {
  const slow = depletionYears({ assets: 6_000_000, monthly: 20000, real: 0.025 });
  near(slow.years, 39.721566497754424);
  assert.equal(slow.perpetual, false);

  // 资产 600 万时永续的安全上限是每年 15 万，即每月 1.25 万
  near(6_000_000 * 0.025 / 12, 12500);
  assert.equal(depletionYears({ assets: 6_000_000, monthly: 12499, real: 0.025 }).perpetual, true);
  assert.equal(depletionYears({ assets: 6_000_000, monthly: 12501, real: 0.025 }).perpetual, false);

  // 与原视频对照：600 万、月花 2 万，资产逐步下降，约 39.7 年耗尽
  const crossed = trajectory(6_000_000, 20000, 0.025, 60).findIndex(v => v === 0);
  assert.equal(crossed, 40);
  assert.ok(Math.abs(slow.years - crossed) < 1);

  near(depletionYears({ assets: 3_600_000, monthly: 10000, real: 0 }).years, 30);

  // 恰好取走实际收益时，资产实际价值保持不变
  trajectory(4_800_000, 10000, 0.025, 60).forEach(v => near(v, 4_800_000, 1e-9));
});
