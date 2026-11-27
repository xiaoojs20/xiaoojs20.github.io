// 财富自由交互面板：临界资产计算器、乘数曲线、耗尽时间
// 依赖 freedom-model.mjs（由短代码通过 data-model-url 传入，带版本号）
(() => {
  if (window.__freedomLabReady) return;
  window.__freedomLabReady = true;

  const roots = Array.from(document.querySelectorAll('[data-freedom-lab]'));
  if (!roots.length) return;

  const trim = s => s.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1');
  const group = (n, d) => n.toLocaleString('en-US', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });

  const wan = v => {
    if (!isFinite(v)) return '∞';
    const w = v / 1e4;
    if (Math.abs(w) >= 1000) return group(Math.round(w));
    if (Math.abs(w) >= 100) return trim(w.toFixed(1));
    return trim(w.toFixed(2));
  };
  const money = (v, zh) => (zh ? wan(v) + ' 万' : (v >= 1e6 ? 'CNY ' + trim((v / 1e6).toFixed(2)) + 'M' : 'CNY ' + group(Math.round(v))));
  const moneyFull = (v, zh) => (zh ? wan(v) + ' 万元' : money(v, zh));
  const pct = (v, digits) => {
    const d = digits === undefined ? (Math.abs(v) < 0.1 ? 2 : 1) : digits;
    return trim((v * 100).toFixed(d)) + '%';
  };
  const times = (v, zh) => {
    if (!isFinite(v)) return '∞';
    const abs = Math.abs(v);
    const text = abs >= 1000 ? group(Math.round(v)) : trim(v.toFixed(abs >= 100 ? 0 : 1));
    return text + (zh ? ' 倍' : '×');
  };

  const metric = (label, value, note) => '<div class="fl-metric">' + label + '<strong>' + value + '</strong>' + (note ? '<em>' + note + '</em>' : '') + '</div>';

  /* ---------------- 面板一：临界资产 ---------------- */
  function core(root, zh, M) {
    const st = { monthly: 10000, real: 0.025, years: Infinity, children: 0, perChild: 700000, health: 300000, housing: 2000000 };

    const slider = (key, label, min, max, step, lo, hi) => {
      const val = key === 'real' ? st[key] * 100 : st[key];
      return '<label for="fl-c-' + key + '">' + label + ': <output data-out="' + key + '"></output></label>' +
        '<input id="fl-c-' + key + '" data-in="' + key + '" type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '">' +
        '<div class="fl-range-note"><span>' + lo + '</span><span>' + hi + '</span></div>';
    };

    root.innerHTML =
      '<h4>' + (zh ? '临界资产计算器：把每月开销换成一次性总资产' : 'Threshold calculator: turn a monthly budget into a lump sum') + '</h4>' +
      '<div class="fl-cols"><div>' +
      '<p class="fl-group">' + (zh ? '常规开销' : 'Ongoing spending') + '</p>' +
      slider('monthly', zh ? '月开销 X' : 'Monthly spending X', 2000, 60000, 500, zh ? '2,000' : '2,000', zh ? '6 万' : '60,000') +
      slider('real', zh ? '实际收益率 r' : 'Real return r', 0.5, 6, 0.1, '0.5%', '6%') +
      '<label>' + (zh ? '维持期限' : 'Horizon') + '</label>' +
      '<div class="fl-seg" data-horizon>' +
      [['inf', zh ? '永续' : 'Forever'], ['50', zh ? '50 年' : '50 yrs'], ['30', zh ? '30 年' : '30 yrs']]
        .map(([k, t]) => '<button type="button" data-h="' + k + '" aria-pressed="' + (k === 'inf') + '">' + t + '</button>').join('') +
      '</div></div><div>' +
      '<p class="fl-group">' + (zh ? '一次性大项' : 'One-off items') + '</p>' +
      slider('children', zh ? '孩子数量 N' : 'Children N', 0, 3, 1, '0', '3') +
      slider('perChild', zh ? '单孩终身成本 K' : 'Cost per child K', 300000, 3000000, 50000, zh ? '30 万' : '300k', zh ? '300 万' : '3M') +
      slider('health', zh ? '终身健康预留 M' : 'Lifetime health M', 0, 3000000, 100000, '0', zh ? '300 万' : '3M') +
      slider('housing', zh ? '房产预留 H' : 'Housing H', 0, 20000000, 200000, '0', zh ? '2,000 万' : '20M') +
      '</div></div>' +
      '<div class="fl-headline"><span>' + (zh ? '临界资产' : 'Threshold assets') + '</span><strong data-total></strong></div>' +
      '<div class="fl-compose" data-compose></div>' +
      '<div class="fl-legend" data-legend></div>' +
      '<div class="fl-metrics" data-metrics aria-live="polite"></div>' +
      '<p class="fl-verdict" data-verdict></p>';

    const ins = {};
    root.querySelectorAll('[data-in]').forEach(el => { ins[el.dataset.in] = el; });
    const out = key => root.querySelector('[data-out="' + key + '"]');
    const totalEl = root.querySelector('[data-total]');
    const compose = root.querySelector('[data-compose]');
    const legend = root.querySelector('[data-legend]');
    const metrics = root.querySelector('[data-metrics]');
    const verdict = root.querySelector('[data-verdict]');

    function draw() {
      const r = M.requiredAssets(st);
      const lump = r.kids + r.health + r.housing;

      totalEl.textContent = money(r.total, zh);
      totalEl.title = zh ? '临界资产合计' : 'Total threshold assets';

      const parts = [
        { k: 'base', v: r.base, zh: '常规开销', en: 'Ongoing', cls: 'fl-seg-base' },
        { k: 'kids', v: r.kids, zh: '育儿', en: 'Children', cls: 'fl-seg-kids' },
        { k: 'health', v: r.health, zh: '健康', en: 'Health', cls: 'fl-seg-health' },
        { k: 'house', v: r.housing, zh: '房产', en: 'Housing', cls: 'fl-seg-house' }
      ];
      const denom = r.total > 0 ? r.total : 1;
      compose.innerHTML = parts.filter(p => p.v > 0)
        .map(p => '<span class="' + p.cls + '" style="width:' + (100 * p.v / denom).toFixed(2) + '%"></span>').join('');
      legend.innerHTML = parts.filter(p => p.v > 0)
        .map(p => '<span><i class="' + p.cls + '"></i>' + (zh ? p.zh : p.en) + ' <b>' + money(p.v, zh) + '</b></span>').join('');

      metrics.innerHTML =
        metric(zh ? '覆盖倍数' : 'Multiplier', times(r.multiplier, zh), zh ? '总资产 / 月开销' : 'assets / monthly spend') +
        metric(zh ? '年提取率' : 'Withdrawal rate', pct(r.withdrawal, 2), zh ? '年开销 / 总资产' : 'annual spend / assets') +
        (lump > 0
          ? metric(zh ? '一次性大项' : 'One-off items', money(lump, zh), zh ? '占 ' + pct(lump / denom, 1) : pct(lump / denom, 1) + ' of total')
          : metric(zh ? '一次性大项' : 'One-off items', zh ? '未加' : 'none', zh ? '育儿 / 健康 / 房产' : 'children / health / housing'));

      if (!(r.real > 0) && !isFinite(st.years)) {
        verdict.innerHTML = zh
          ? '<strong>实际收益率不为正，永续方案无解。</strong> 扣掉通胀后拿不到正收益，任何资产规模都会在购买力上慢慢缩水。'
          : '<strong>No solution exists at a non-positive real return.</strong> Without real growth, any pile of assets loses purchasing power over time.';
      } else {
        const yearsOf = trim((r.base / (12 * st.monthly)).toFixed(1));
        verdict.innerHTML = zh
          ? '<strong>每月 ' + moneyFull(st.monthly, zh) + ' 的开销，需要 ' + moneyFull(r.total, zh) + '。</strong> 其中 ' + moneyFull(r.base, zh)
            + ' 是永续部分，相当于 ' + yearsOf + ' 年的年支出' + (lump > 0 ? '；另有 ' + moneyFull(lump, zh) + ' 是今天就要备好的一次性大项。' : '，还没有加上育儿、健康与房产。')
          : '<strong>A budget of ' + money(st.monthly, zh) + ' a month needs ' + money(r.total, zh) + '.</strong> The perpetual part is '
            + money(r.base, zh) + ', or ' + yearsOf + ' years of spending' + (lump > 0 ? '; the remaining ' + money(lump, zh) + ' has to be set aside up front.' : '; children, health and housing are not added yet.');
      }
    }

    function syncLabels() {
      out('monthly').textContent = money(st.monthly, zh) + (zh ? '/月' : '/mo');
      out('real').textContent = pct(st.real, 1);
      out('children').textContent = st.children + (zh ? ' 个' : '');
      out('perChild').textContent = money(st.perChild, zh);
      out('health').textContent = money(st.health, zh);
      out('housing').textContent = money(st.housing, zh);
      ins.perChild.disabled = st.children === 0;
      out('perChild').parentElement.style.opacity = st.children === 0 ? '0.45' : '';
    }

    Object.keys(ins).forEach(key => {
      ins[key].addEventListener('input', () => {
        const v = Number(ins[key].value);
        st[key] = key === 'real' ? v / 100 : v;
        syncLabels();
        draw();
      });
    });

    root.querySelectorAll('[data-h]').forEach(btn => btn.addEventListener('click', () => {
      const h = btn.dataset.h;
      st.years = h === 'inf' ? Infinity : Number(h);
      root.querySelectorAll('[data-h]').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      draw();
    }));

    syncLabels();
    draw();
  }

  /* ---------------- 面板二：乘数曲线 ---------------- */
  function multiplier(root, zh, M) {
    root.innerHTML =
      '<h4>' + (zh ? '乘数曲线：480 只是 r = 2.5% 时的一个点' : 'Multiplier curve: 480 is just the point where r = 2.5%') + '</h4>' +
      '<div class="fl-presets" data-presets style="margin-bottom:.2em">' +
      '<div class="fl-seg">' +
      [['1', '1%'], ['2.5', '2.5%'], ['4', '4%']].map(([v, t]) =>
        '<button type="button" data-p="' + v + '" aria-pressed="' + (v === '2.5') + '">' + t + '</button>').join('') +
      '</div></div>' +
      '<label for="fl-m-r">' + (zh ? '实际收益率 r' : 'Real return r') + ': <output data-r></output></label>' +
      '<input id="fl-m-r" type="range" min="0.5" max="10" step="0.1" value="2.5">' +
      '<div class="fl-range-note"><span>0.5%</span><span>10%</span></div>' +
      '<div data-chart></div>' +
      '<div class="fl-key">' +
      '<span><i class="k-now"></i>' + (zh ? '永续' : 'Perpetual') + '</span>' +
      '<span><i class="k-50"></i>' + (zh ? '50 年' : '50 years') + '</span>' +
      '<span><i class="k-30"></i>' + (zh ? '30 年' : '30 years') + '</span>' +
      '</div>' +
      '<p class="fl-note">' + (zh
        ? '乘数 = 需要准备的资产 ÷ 每月开销。永续口径要求本金一分不动；50 年、30 年允许本金花完，所以倍数依次降低。'
        : 'Multiplier = assets needed ÷ monthly spending. A perpetuity never touches the principal; 50- and 30-year horizons spend it down, so the multiple is lower.') + '</p>' +
      '<div class="fl-metrics" data-metrics aria-live="polite"></div>' +
      '<p class="fl-verdict" data-verdict></p>' +
      '<p class="fl-hint">' + (zh
        ? '纵轴为覆盖倍数（对数刻度），横轴为扣除通胀后的实际收益率 r。曲线位置越低，同样月开销需要的资产越少。'
        : 'Vertical axis: coverage multiplier (log scale). Horizontal axis: real return after inflation. The lower the curve, the less assets the same monthly spending requires.') + '</p>';

    const slider = root.querySelector('input');
    const outR = root.querySelector('[data-r]');
    const chart = root.querySelector('[data-chart]');
    const metrics = root.querySelector('[data-metrics]');
    const verdict = root.querySelector('[data-verdict]');

    const W = 380, H = 205, L = 44, R = 12, T = 14, B = 30;
    const RMIN = 0.005, RMAX = 0.10;
    const xAt = v => L + (v - RMIN) / (RMAX - RMIN) * (W - L - R);
    const yLo = Math.log10(90), yHi = Math.log10(3000);
    const yAt = v => H - B - (Math.log10(Math.min(Math.max(v, 90), 3000)) - yLo) / (yHi - yLo) * (H - T - B);
    const mult = (r, years) => 12 * M.coverageFactor(r, years);
    const path = pts => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const tick = (x, y, text, anchor) => '<text class="fl-tick" x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '">' + text + '</text>';

    function series(years) {
      const pts = [];
      for (let r = RMIN; r <= RMAX + 1e-4; r += 0.001) pts.push([xAt(r), yAt(mult(r, years))]);
      return path(pts);
    }

    function draw() {
      const r = Number(slider.value) / 100;
      let s = '<path class="fl-axis" d="M' + L + ' ' + T + 'V' + (H - B) + 'H' + (W - R) + '"/>';
      [100, 200, 300, 480, 600, 1000, 2000].forEach(v => {
        s += '<path class="fl-grid" d="M' + L + ' ' + yAt(v) + 'H' + (W - R) + '"/>';
        s += tick(L - 6, yAt(v) + 3, v >= 1000 ? trim((v / 1000).toFixed(1)) + 'k' : String(v), 'end');
      });
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(v => {
        s += '<path class="fl-grid" d="M' + xAt(v / 100) + ' ' + T + 'V' + (H - B) + '"/>';
        s += tick(xAt(v / 100), H - B + 13, v + '%');
      });
      s += '<path class="fl-guide" d="M' + xAt(0.025) + ' ' + T + 'V' + (H - B) + '"/>';
      s += '<text class="fl-caption" x="' + (xAt(0.025) + 4) + '" y="' + (T + 10) + '">2.5%</text>';
      s += '<path class="fl-curve fl-curve--30" d="' + series(30) + '"/>';
      s += '<path class="fl-curve fl-curve--50" d="' + series(50) + '"/>';
      s += '<path class="fl-curve" d="' + series(Infinity) + '"/>';

      const m = mult(r, Infinity), m50 = mult(r, 50), m30 = mult(r, 30);
      const px = xAt(r), flip = px > W - 74;
      s += '<circle class="fl-point--ghost" cx="' + px + '" cy="' + yAt(m30) + '" r="4"/>';
      s += '<circle class="fl-point--ghost" cx="' + px + '" cy="' + yAt(m50) + '" r="4"/>';
      s += '<circle class="fl-point" cx="' + px + '" cy="' + yAt(m) + '" r="4.5"/>';
      s += '<text class="fl-caption" x="' + (px + (flip ? -7 : 7)) + '" y="' + (yAt(m) - 6) + '"'
        + (flip ? ' text-anchor="end"' : '') + '>' + times(m, zh) + '</text>';
      chart.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="'
        + (zh ? '覆盖倍数随实际收益率变化的曲线' : 'Coverage multiplier against real return') + '">' + s + '</svg>';

      outR.textContent = pct(r, 1);
      metrics.innerHTML =
        metric(zh ? '永续乘数' : 'Perpetual', times(m, zh), zh ? '本金一分不动' : 'principal untouched') +
        metric(zh ? '50 年乘数' : '50 years', times(m50, zh), zh ? '本金够花 50 年' : 'lasts 50 years') +
        metric(zh ? '30 年乘数' : '30 years', times(m30, zh), zh ? '本金够花 30 年' : 'lasts 30 years') +
        metric(zh ? '期限折让' : 'Horizon discount', pct(1 - m30 / m, 0), zh ? '相对永续省下的资产' : 'assets saved vs perpetual');
      verdict.innerHTML = zh
        ? '<strong>r = ' + pct(r, 1) + ' 时，永续需要 ' + times(m, zh) + '月开销。</strong> 换成 30 年期限只需 ' + times(m30, zh)
          + '，因为本金允许花完。常见的 4% 法则对应 300 倍（25 年支出），它假设更高的实际收益，也只覆盖 30 年。'
        : '<strong>At r = ' + pct(r, 1) + ', perpetuity needs ' + times(m, zh) + ' monthly spending.</strong> A 30-year horizon needs only '
          + times(m30, zh) + ', because the principal may be spent down. The familiar 4% rule is 300× (25 years of spending): it assumes a higher real return and only covers 30 years.';
    }

    slider.addEventListener('input', () => {
      root.querySelectorAll('[data-p]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.p === String(Number(slider.value)))));
      draw();
    });
    root.querySelectorAll('[data-p]').forEach(btn => btn.addEventListener('click', () => {
      slider.value = btn.dataset.p;
      root.querySelectorAll('[data-p]').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      draw();
    }));
    draw();
  }

  /* ---------------- 面板三：耗尽时间 ---------------- */
  function burn(root, zh, M) {
    const st = { assets: 6000000, monthly: 20000, real: 0.025 };

    const slider = (key, label, min, max, step, lo, hi) =>
      '<label for="fl-b-' + key + '">' + label + ': <output data-out="' + key + '"></output></label>' +
      '<input id="fl-b-' + key + '" data-in="' + key + '" type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + st[key] + '">' +
      '<div class="fl-range-note"><span>' + lo + '</span><span>' + hi + '</span></div>';

    root.innerHTML =
      '<h4>' + (zh ? '耗尽时间：允许本金下降，每月能多花多少' : 'Runway: if the principal may fall, how much more can you spend') + '</h4>' +
      slider('assets', zh ? '可投资产 F' : 'Investable assets F', 1000000, 30000000, 200000, zh ? '100 万' : '1M', zh ? '3,000 万' : '30M') +
      slider('monthly', zh ? '月开销 X' : 'Monthly spending X', 2000, 60000, 500, zh ? '2,000' : '2,000', zh ? '6 万' : '60,000') +
      slider('real', zh ? '实际收益率 r' : 'Real return r', 0, 6, 0.1, '0', '6%') +
      '<div data-chart></div>' +
      '<div class="fl-metrics" data-metrics aria-live="polite"></div>' +
      '<p class="fl-verdict" data-verdict></p>' +
      '<p class="fl-hint">' + (zh
        ? '曲线为资产的实际价值（已扣除通胀），横轴为年数。年开销低于资产 × 实际收益率时曲线水平，否则本金逐年下降并在某一年归零。'
        : 'The line shows real asset value after inflation against years. When annual spending is below assets × real return the line is flat; otherwise the principal falls to zero in a given year.') + '</p>';

    const ins = {};
    root.querySelectorAll('[data-in]').forEach(el => { ins[el.dataset.in] = el; });
    const out = key => root.querySelector('[data-out="' + key + '"]');
    const chart = root.querySelector('[data-chart]');
    const metrics = root.querySelector('[data-metrics]');
    const verdict = root.querySelector('[data-verdict]');

    const W = 380, H = 195, L = 46, R = 12, T = 14, B = 28;
    const TMAX = 60;

    function draw() {
      const d = M.depletionYears({ assets: st.assets, monthly: st.monthly, real: st.real });
      const traj = M.trajectory(st.assets, st.monthly, st.real, TMAX);
      const xAt = t => L + (t / TMAX) * (W - L - R);
      const yAt = v => H - B - (v / Math.max(st.assets, 1)) * (H - T - B);

      let s = '<path class="fl-axis" d="M' + L + ' ' + T + 'V' + (H - B) + 'H' + (W - R) + '"/>';
      [0, 10, 20, 30, 40, 50, 60].forEach(t => {
        s += '<path class="fl-grid" d="M' + xAt(t) + ' ' + T + 'V' + (H - B) + '"/>';
        s += '<text class="fl-tick" x="' + xAt(t) + '" y="' + (H - B + 13) + '" text-anchor="middle">' + t + '</text>';
      });
      [0.5, 1].forEach(f => {
        s += '<path class="fl-grid" d="M' + L + ' ' + yAt(st.assets * f) + 'H' + (W - R) + '"/>';
        s += '<text class="fl-tick" x="' + (L - 6) + '" y="' + (yAt(st.assets * f) + 3) + '" text-anchor="end">' + pct(f, 0) + '</text>';
      });

      let line = '';
      traj.forEach((v, t) => { line += (t ? 'L' : 'M') + xAt(t).toFixed(1) + ' ' + yAt(v).toFixed(1); });
      s += '<path class="fl-area" d="' + line + 'L' + xAt(TMAX) + ' ' + yAt(0) + 'L' + xAt(0) + ' ' + yAt(0) + 'Z"/>';
      s += '<path class="fl-curve" d="' + line + '"/>';

      if (!d.perpetual && isFinite(d.years) && d.years <= TMAX) {
        s += '<path class="fl-guide" d="M' + xAt(d.years) + ' ' + T + 'V' + (H - B) + '"/>';
        s += '<circle class="fl-point" cx="' + xAt(d.years) + '" cy="' + yAt(0) + '" r="4.5"/>';
        s += '<text class="fl-caption" x="' + Math.min(xAt(d.years) + 5, W - 46) + '" y="' + (T + 10) + '">'
          + (zh ? '第 ' : 'year ') + Math.ceil(d.years) + (zh ? ' 年' : '') + '</text>';
      }
      chart.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="'
        + (zh ? '资产实际价值随时间的变化' : 'Real asset value over time') + '">' + s + '</svg>';

      const cap = st.assets * st.real / 12;
      out('assets').textContent = money(st.assets, zh);
      out('monthly').textContent = money(st.monthly, zh) + (zh ? '/月' : '/mo');
      out('real').textContent = pct(st.real, 1);

      metrics.innerHTML =
        (d.perpetual
          ? metric(zh ? '可维持年限' : 'Runway', zh ? '永续' : 'Perpetual', zh ? '资产实际价值不变' : 'real value constant')
          : metric(zh ? '可维持年限' : 'Runway', trim(d.years.toFixed(1)) + (zh ? ' 年' : ' yrs'), zh ? '此后本金为零' : 'then nothing left')) +
        metric(zh ? '永续安全上限' : 'Perpetual ceiling', money(cap, zh) + (zh ? '/月' : '/mo'), zh ? '资产 × r ÷ 12' : 'assets × r / 12') +
        metric(zh ? '年提取率' : 'Withdrawal rate', pct(st.assets > 0 ? 12 * st.monthly / st.assets : 0, 2), zh ? '对比 r = ' + pct(st.real, 1) : 'vs r = ' + pct(st.real, 1));

      if (d.perpetual) {
        verdict.innerHTML = zh
          ? '<strong>花不完。</strong> 年开销 ' + money(12 * st.monthly, zh) + ' 没有超过实际收益 ' + money(st.assets * st.real, zh)
            + '，资产的实际价值保持不变。'
          : '<strong>It lasts.</strong> Annual spending of ' + money(12 * st.monthly, zh) + ' stays below the real return of '
            + money(st.assets * st.real, zh) + ', so real value is preserved.';
      } else {
        verdict.innerHTML = zh
          ? '<strong>约 ' + trim(d.years.toFixed(1)) + ' 年后耗尽。</strong> 每月多花出的部分在拿本金补，资产随时间单调下降。换成永续口径，同样这笔钱每月只能花 ' + money(cap, zh) + '。'
          : '<strong>Depleted in about ' + trim(d.years.toFixed(1)) + ' years.</strong> The excess spending comes out of principal, so assets fall monotonically. On a perpetual basis the same portfolio supports '
            + money(cap, zh) + ' a month.';
      }
    }

    Object.keys(ins).forEach(key => {
      ins[key].addEventListener('input', () => {
        const v = Number(ins[key].value);
        st[key] = key === 'real' ? v / 100 : v;
        draw();
      });
    });
    draw();
  }

  const handlers = { core: core, multiplier: multiplier, burn: burn };

  import(roots[0].dataset.modelUrl).then(M => {
    roots.forEach(root => {
      const kind = root.dataset.freedomLab;
      if (!handlers[kind]) return;
      handlers[kind](root, root.dataset.language === 'zh', M);
    });
  }).catch(() => {
    roots.forEach(root => {
      const zh = root.dataset.language === 'zh';
      root.innerHTML = '<p class="fl-loading">' + (zh ? '计算器加载失败，正文中的公式与示例仍然可用。' : 'The calculator failed to load; the formulas and worked examples below still apply.') + '</p>';
    });
  });
})();
