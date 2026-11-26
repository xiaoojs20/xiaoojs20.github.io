(() => {
  if (window.__stoppingLabReady) return;
  window.__stoppingLabReady = true;

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const CH = { w: 340, h: 172, l: 44, r: 16, t: 16, b: 30 };
  const px = (v, lo, hi) => CH.l + ((v - lo) / (hi - lo)) * (CH.w - CH.l - CH.r);
  const py = (v, lo, hi) => CH.h - CH.b - ((v - lo) / (hi - lo)) * (CH.h - CH.t - CH.b);
  const path = pts => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const wrap = (inner, label) => '<svg viewBox="0 0 ' + CH.w + ' ' + CH.h + '" role="img" aria-label="' + label + '">' + inner + '</svg>';
  const metric = (label, value, note) => '<div class="sl-metric">' + label + '<strong>' + value + '</strong>' + (note ? '<em>' + note + '</em>' : '') + '</div>';
  const axis = () => '<path class="sl-axis" d="M' + CH.l + ' ' + CH.t + 'V' + (CH.h - CH.b) + 'H' + (CH.w - CH.r) + '"/>';
  const tick = (x, y, text, anchor) => '<text class="sl-tick" x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'middle') + '">' + text + '</text>';

  /* ---------------- secretary ---------------- */
  function secretary(root, zh) {
    const state = { n: 100, r: 37 };
    root.innerHTML =
      '<h4>' + (zh ? '秘书问题模拟器：观察多少人，决定了成败' : 'Secretary problem simulator: where you stop changes everything') + '</h4>' +
      '<div class="sl-row"><div class="sl-seg" data-seg>' +
      [10, 100, 1000].map(v => '<button type="button" data-n="' + v + '" aria-pressed="' + (v === 100) + '">' + v + (zh ? ' 人' : '') + '</button>').join('') +
      '</div></div>' +
      '<label for="sl-sec-r">' + (zh ? '先观察并拒绝的人数' : 'Candidates observed and rejected first') + ': <output data-r></output></label>' +
      '<input id="sl-sec-r" type="range" min="1" max="99" step="1" value="37">' +
      '<div class="sl-range-note"><span>1</span><span data-rmax>99</span></div>' +
      '<div data-chart></div>' +
      '<div class="sl-metrics" data-metrics aria-live="polite"></div>' +
      '<p class="sl-hint">' + (zh
        ? '曲线是有限人数下的精确成功率，不是 37% 的近似公式；横轴为观察比例，纵轴为选中全局最优者的概率。'
        : 'The curve shows the exact success probability for a finite population, not the 37% approximation. Horizontal axis: fraction observed.') + '</p>';

    const slider = root.querySelector('input');
    const outR = root.querySelector('[data-r]');
    const rmax = root.querySelector('[data-rmax]');
    const metrics = root.querySelector('[data-metrics]');
    const chart = root.querySelector('[data-chart]');

    let H = harmonic(state.n);
    let best = scan(state.n, H);

    function harmonic(n) {
      const h = new Float64Array(n + 1);
      for (let i = 1; i <= n; i++) h[i] = h[i - 1] + 1 / i;
      return h;
    }
    function prob(r, n, h) {
      if (r < 1) return 0;
      return (r / n) * (h[n - 1] - h[r - 1]);
    }
    function scan(n, h) {
      let br = 1, bp = -1;
      for (let i = 1; i < n; i++) {
        const p = prob(i, n, h);
        if (p > bp) { bp = p; br = i; }
      }
      return { r: br, p: bp };
    }

    function draw() {
      const n = state.n;
      const pts = [];
      const steps = 150;
      for (let i = 0; i <= steps; i++) {
        const rr = Math.round(1 + (i / steps) * (n - 2));
        pts.push([px(rr / n, 0, 1), py(prob(rr, n, H), 0, 0.45)]);
      }
      const curP = prob(state.r, n, H);
      let s = axis();
      [0.25, 0.5, 0.75].forEach(v => {
        s += '<path class="sl-grid" d="M' + px(v, 0, 1) + ' ' + CH.t + 'V' + (CH.h - CH.b) + '"/>';
        s += tick(px(v, 0, 1), CH.h - CH.b + 13, Math.round(v * 100) + '%');
      });
      [0.1, 0.2, 0.3, 0.4].forEach(v => {
        s += '<path class="sl-grid" d="M' + CH.l + ' ' + py(v, 0, 0.45) + 'H' + (CH.w - CH.r) + '"/>';
        s += tick(CH.l - 6, py(v, 0, 0.45) + 3, Math.round(v * 100) + '%', 'end');
      });
      s += '<path class="sl-guide sl-guide--soft" d="M' + px(1 / Math.E, 0, 1) + ' ' + CH.t + 'V' + (CH.h - CH.b) + '"/>';
      s += '<text class="sl-caption" x="' + (px(1 / Math.E, 0, 1) + 4) + '" y="' + (CH.t + 10) + '">1/e</text>';
      s += '<path class="sl-curve" d="' + path(pts) + '"/>';
      s += '<circle class="sl-point--opt" cx="' + px(best.r / n, 0, 1) + '" cy="' + py(best.p, 0, 0.45) + '" r="4"/>';
      s += '<circle class="sl-point" cx="' + px(state.r / n, 0, 1) + '" cy="' + py(curP, 0, 0.45) + '" r="4.5"/>';
      chart.innerHTML = wrap(s, zh ? '不同观察比例下选中全局最优者的概率曲线' : 'Success probability against observation fraction');

      outR.textContent = state.r + ' / ' + n;
      metrics.innerHTML =
        metric(zh ? '观察比例' : 'Fraction observed', (100 * state.r / n).toFixed(1) + '%') +
        metric(zh ? '当前策略成功率' : 'Success now', (100 * curP).toFixed(2) + '%') +
        metric(zh ? '精确最优' : 'Exact optimum', best.r + ' / ' + n, (100 * best.p).toFixed(2) + '%');
    }

    function setN(n) {
      state.n = n;
      H = harmonic(n);
      best = scan(n, H);
      state.r = clamp(best.r, 1, n - 1);
      slider.max = String(n - 1);
      slider.value = String(state.r);
      rmax.textContent = String(n - 1);
      root.querySelectorAll('[data-n]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.n) === n)));
      draw();
    }

    root.querySelectorAll('[data-n]').forEach(btn => btn.addEventListener('click', () => setN(Number(btn.dataset.n))));
    slider.addEventListener('input', () => { state.r = Number(slider.value); draw(); });
    draw();
  }

  /* ---------------- queue ---------------- */
  function queue(root, zh) {
    root.innerHTML =
      '<h4>' + (zh ? 'M/M/1 排队：利用率越接近 100%，等待时间越失控' : 'M/M/1 queue: as utilisation nears 100%, waiting explodes') + '</h4>' +
      '<label for="sl-q-rho">' + (zh ? '系统利用率 ρ = λ / μ' : 'Utilisation ρ = λ / μ') + ': <output data-rho></output></label>' +
      '<input id="sl-q-rho" type="range" min="1" max="99" step="1" value="80">' +
      '<div class="sl-range-note"><span>1%</span><span>99%</span></div>' +
      '<div data-chart></div>' +
      '<div class="sl-metrics" data-metrics aria-live="polite"></div>' +
      '<p class="sl-verdict" data-verdict></p>' +
      '<p class="sl-hint">' + (zh
        ? '纵轴为对数刻度：W 是平均逗留时间，1/μ 是平均服务时间。队列长度 Lq = ρ² / (1 − ρ)。'
        : 'Vertical axis is logarithmic: W is mean time in system, 1/μ mean service time. Queue length Lq = ρ² / (1 − ρ).') + '</p>';

    const slider = root.querySelector('input');
    const out = root.querySelector('[data-rho]');
    const metrics = root.querySelector('[data-metrics]');
    const chart = root.querySelector('[data-chart]');
    const verdict = root.querySelector('[data-verdict]');
    const lg = v => Math.log10(clamp(v, 1, 100));

    function draw() {
      const rho = Number(slider.value) / 100;
      const w = 1 / (1 - rho);
      const lq = rho * rho / (1 - rho);
      const pts = [];
      for (let i = 0; i <= 160; i++) {
        const r = 0.01 + (i / 160) * 0.98;
        pts.push([px(r, 0.01, 0.99), py(lg(1 / (1 - r)), 0, 2)]);
      }
      let s = axis();
      [1, 2, 5, 10, 20, 50, 100].forEach(v => {
        s += '<path class="sl-grid" d="M' + CH.l + ' ' + py(lg(v), 0, 2) + 'H' + (CH.w - CH.r) + '"/>';
        s += tick(CH.l - 6, py(lg(v), 0, 2) + 3, v + '×', 'end');
      });
      [0.25, 0.5, 0.75].forEach(v => {
        s += tick(px(v, 0.01, 0.99), CH.h - CH.b + 13, Math.round(v * 100) + '%');
      });
      s += '<path class="sl-curve" d="' + path(pts) + '"/>';
      s += '<circle class="sl-point" cx="' + px(rho, 0.01, 0.99) + '" cy="' + py(lg(w), 0, 2) + '" r="4.5"/>';
      chart.innerHTML = wrap(s, zh ? '不同利用率下的平均逗留时间倍数' : 'Mean time in system against utilisation');

      out.textContent = (rho * 100).toFixed(0) + '%';
      metrics.innerHTML =
        metric(zh ? '平均逗留时间' : 'Mean time in system', w.toFixed(1) + '×', zh ? '相对平均服务时间' : 'mean service time') +
        metric(zh ? '平均排队人数' : 'Mean queue length', lq.toFixed(1), zh ? '不含正在服务者' : 'excluding in service');
      verdict.innerHTML = rho >= 0.95
        ? (zh ? '<strong>接近饱和。</strong> 利用率每再提高一点，等待时间都会成倍上涨；这类系统必须留出冗余。' : '<strong>Near saturation.</strong> Each further point of utilisation multiplies waiting; such systems need slack.')
        : rho >= 0.85
          ? (zh ? '<strong>已经偏紧。</strong> 延迟对负载变化非常敏感，任何突发流量都会放大排队。' : '<strong>Already tight.</strong> Delay is highly sensitive to load, and bursts amplify the queue.')
          : (zh ? '<strong>仍有冗余。</strong> 等待时间随利用率缓慢上升，系统对突发流量有一定缓冲。' : '<strong>Healthy slack.</strong> Waiting rises slowly with load and bursts are absorbed.');
    }

    slider.addEventListener('input', draw);
    draw();
  }

  /* ---------------- search ---------------- */
  function search(root, zh) {
    root.innerHTML =
      '<h4>' + (zh ? '最优搜索模拟器：成本与已有机会共同决定阈值' : 'Search simulator: cost and current option set the threshold') + '</h4>' +
      '<label for="sl-s-c">' + (zh ? '每次搜索的成本 c' : 'Cost per search c') + ': <output data-c></output></label>' +
      '<input id="sl-s-c" type="range" min="0.5" max="10" step="0.1" value="2">' +
      '<div class="sl-range-note"><span>0.5</span><span>10</span></div>' +
      '<label for="sl-s-b">' + (zh ? '当前机会的质量 b（0–100）' : 'Current option quality b (0–100)') + ': <output data-b></output></label>' +
      '<input id="sl-s-b" type="range" min="0" max="100" step="1" value="85">' +
      '<div class="sl-range-note"><span>0</span><span>100</span></div>' +
      '<div data-chart></div>' +
      '<div class="sl-metrics" data-metrics aria-live="polite"></div>' +
      '<p class="sl-verdict" data-verdict></p>' +
      '<p class="sl-hint">' + (zh
        ? '假设机会质量服从 U(0, 100)，继续搜索的期望增益 ΔV(b) = (100 − b)² / 200，阈值满足 ΔV(b*) = c。'
        : 'Assumes quality ~ U(0, 100). Expected gain from one more search is ΔV(b) = (100 − b)² / 200, with ΔV(b*) = c.') + '</p>';

    const sc = root.querySelector('#sl-s-c');
    const sb = root.querySelector('#sl-s-b');
    const oc = root.querySelector('[data-c]');
    const ob = root.querySelector('[data-b]');
    const metrics = root.querySelector('[data-metrics]');
    const chart = root.querySelector('[data-chart]');
    const verdict = root.querySelector('[data-verdict]');

    function draw() {
      const c = Number(sc.value);
      const b = Number(sb.value);
      const bStar = 100 - Math.sqrt(200 * c);
      const dv = Math.pow(100 - b, 2) / 200;
      const stop = dv <= c;

      const pts = [];
      for (let i = 0; i <= 120; i++) {
        const bb = (i / 120) * 100;
        pts.push([px(bb, 0, 100), py(Math.pow(100 - bb, 2) / 200, 0, 50)]);
      }
      let s = axis();
      [25, 50, 75].forEach(v => {
        s += '<path class="sl-grid" d="M' + px(v, 0, 100) + ' ' + CH.t + 'V' + (CH.h - CH.b) + '"/>';
        s += tick(px(v, 0, 100), CH.h - CH.b + 13, v);
      });
      [10, 20, 30, 40].forEach(v => {
        s += '<path class="sl-grid" d="M' + CH.l + ' ' + py(v, 0, 50) + 'H' + (CH.w - CH.r) + '"/>';
        s += tick(CH.l - 6, py(v, 0, 50) + 3, v, 'end');
      });
      s += '<path class="sl-curve" d="' + path(pts) + '"/>';
      s += '<path class="sl-guide" d="M' + CH.l + ' ' + py(c, 0, 50) + 'H' + (CH.w - CH.r) + '"/>';
      s += '<text class="sl-caption" x="' + (CH.w - CH.r - 2) + '" y="' + (py(c, 0, 50) - 4) + '" text-anchor="end">c = ' + c.toFixed(1) + '</text>';
      if (bStar > 0) {
        s += '<path class="sl-guide sl-guide--soft" d="M' + px(bStar, 0, 100) + ' ' + CH.t + 'V' + (CH.h - CH.b) + '"/>';
        s += '<text class="sl-caption" x="' + (px(bStar, 0, 100) + 3) + '" y="' + (CH.h - CH.b - 4) + '">b* = ' + bStar.toFixed(0) + '</text>';
      }
      s += '<circle class="sl-point" cx="' + px(b, 0, 100) + '" cy="' + py(dv, 0, 50) + '" r="4.5"/>';
      chart.innerHTML = wrap(s, zh ? '继续搜索的期望增益曲线与接受阈值' : 'Expected gain from further search and the acceptance threshold');

      oc.textContent = c.toFixed(1);
      ob.textContent = b;
      metrics.innerHTML =
        metric(zh ? '接受阈值 b*' : 'Reservation value b*', bStar.toFixed(1), zh ? '低于它才值得继续找' : 'keep searching below it') +
        metric(zh ? '继续搜索的期望增益' : 'Expected gain', dv.toFixed(2), zh ? '以质量分计' : 'quality points') +
        metric(zh ? '搜索成本' : 'Search cost', c.toFixed(1), zh ? '同单位' : 'same unit');
      verdict.innerHTML = stop
        ? (zh ? '<strong>停止搜索，接受当前机会。</strong> 再找一次的期望增益已经覆盖不了成本。' : '<strong>Stop and take the current option.</strong> One more search no longer covers its cost.')
        : (zh ? '<strong>继续搜索。</strong> 期望增益仍高于成本，再看几个是划算的。' : '<strong>Keep searching.</strong> Expected gain still exceeds cost.');
    }

    sc.addEventListener('input', draw);
    sb.addEventListener('input', draw);
    draw();
  }

  /* ---------------- multi-armed bandit ---------------- */
  function mab(root, zh) {
    const arms = [
      { key: 'A', mu: 70, n: 50, zh: '成熟业务', en: 'Mature business' },
      { key: 'B', mu: 64, n: 5, zh: '新兴 AI 方向', en: 'Emerging AI' },
      { key: 'C', mu: 52, n: 2, zh: '内容创作', en: 'Content creation' }
    ];
    const t = 120;
    root.innerHTML =
      '<h4>' + (zh ? '多臂老虎机：探索奖励会把冷门方向推到前面' : 'Multi-armed bandit: the exploration bonus can promote the untested arm') + '</h4>' +
      '<label for="sl-m-c">' + (zh ? '探索系数 c' : 'Exploration coefficient c') + ': <output data-c></output></label>' +
      '<input id="sl-m-c" type="range" min="0" max="15" step="0.5" value="2">' +
      '<div class="sl-range-note"><span>0</span><span>15</span></div>' +
      '<p class="sl-hint" style="margin:.1em 0 .2em">' + arms.map(a => a.key + ' ' + (zh ? a.zh : a.en) + (zh ? '（n=' : ' (n=') + a.n + '）').join(' · ') + '</p>' +
      '<div class="sl-bars" data-bars aria-live="polite"></div>' +
      '<p class="sl-verdict" data-verdict></p>' +
      '<p class="sl-hint">' + (zh
        ? 'UCB = 估计收益 + c·√(ln t / n)。条形为该分数，短竖线为 μ̂ ± c·se 的不确定性区间；收益与次数均为虚构示例，总尝试 t = 120。'
        : 'UCB = estimated payoff + c·√(ln t / n). Bars show the score, whiskers the μ̂ ± c·se interval. Payoffs and counts are fictional; total trials t = 120.') + '</p>';

    const slider = root.querySelector('input');
    const out = root.querySelector('[data-c]');
    const bars = root.querySelector('[data-bars]');
    const verdict = root.querySelector('[data-verdict]');
    const lnT = Math.log(t);

    function draw() {
      const c = Number(slider.value);
      const rows = arms.map(a => {
        const se = Math.sqrt(lnT / a.n);
        return { ...a, se, ucb: a.mu + c * se };
      }).sort((x, y) => y.ucb - x.ucb);
      const max = Math.max(...rows.map(r => r.ucb + c * r.se));
      const scaleMax = Math.max(max, 100);
      bars.innerHTML = rows.map(r => {
        const w = (r.ucb / scaleMax) * 100;
        const lo = ((r.mu - c * r.se) / scaleMax) * 100;
        const hi = ((r.mu + c * r.se) / scaleMax) * 100;
        return '<div class="sl-bar' + (r === rows[0] ? ' sl-bar--best' : '') + '">' +
          '<span>' + r.key + '</span>' +
          '<span class="sl-bar-track"><span class="sl-bar-fill" style="width:' + w.toFixed(1) + '%"></span>' +
          '<span class="sl-whisker" style="left:' + clamp(lo, 0, 100).toFixed(1) + '%;width:' + Math.max(hi - lo, 1).toFixed(1) + '%"></span></span>' +
          '<span class="sl-bar-value">' + r.ucb.toFixed(1) + '</span>' +
          '</div>';
      }).join('');

      out.textContent = c.toFixed(1);
      const top = rows[0];
      const name = zh ? top.zh : top.en;
      const mostKnown = arms.reduce((a, b) => (b.mu > a.mu ? b : a));
      if (top.key === mostKnown.key) {
        verdict.innerHTML = zh
          ? '<strong>当前应优先尝试：' + top.key + '（' + name + '）。</strong> 它既有最高的估计收益，样本也最充分；其他方向的不确定性还不足以抵消这段差距。'
          : '<strong>Try ' + top.key + ' (' + name + ') next.</strong> It has both the highest estimated payoff and the most evidence; uncertainty on the other arms does not yet close the gap.';
      } else {
        verdict.innerHTML = zh
          ? '<strong>当前应优先尝试：' + top.key + '（' + name + '）。</strong> 它只被尝试了 ' + top.n + ' 次，不确定性带来的奖励足以抵消收益估计上的差距。'
          : '<strong>Try ' + top.key + ' (' + name + ') next.</strong> With only ' + top.n + ' attempts, the bonus for uncertainty outweighs the lower estimated payoff.';
      }
    }

    slider.addEventListener('input', draw);
    draw();
  }

  /* ---------------- offer scoring ---------------- */
  function offer(root, zh) {
    const dims = [
      { w: 30, v: 90, zh: '长期职业成长', en: 'Long-term growth' },
      { w: 25, v: 85, zh: '薪酬及福利', en: 'Pay and benefits' },
      { w: 20, v: 90, zh: '行业发展前景', en: 'Industry prospects' },
      { w: 15, v: 80, zh: '团队与技术水平', en: 'Team and craft' },
      { w: 10, v: 60, zh: '工作生活平衡', en: 'Work-life balance' }
    ];
    root.innerHTML =
      '<h4>' + (zh ? 'Offer 综合效用：调分数，看加权结果' : 'Offer utility: adjust the scores, watch the weighting') + '</h4>' +
      '<div data-rows></div>' +
      '<div class="sl-metrics" data-metrics aria-live="polite"></div>' +
      '<p class="sl-hint">' + (zh
        ? '权重固定为 30/25/20/15/10，综合效用 U = Σ wⱼxⱼ。评分与权重仅用于演示多目标决策，实际应按个人偏好设定。'
        : 'Weights are fixed at 30/25/20/15/10, U = Σ wⱼxⱼ. Scores and weights are illustrative; set your own in practice.') + '</p>';

    const rows = root.querySelector('[data-rows]');
    rows.innerHTML = dims.map((d, i) =>
      '<label for="sl-o-' + i + '">' + (zh ? d.zh : d.en) + ' <em style="opacity:.6;font-style:normal">' + d.w + '%</em>: <output data-v="' + i + '">' + d.v + '</output></label>' +
      '<input id="sl-o-' + i + '" type="range" min="0" max="100" step="1" value="' + d.v + '" data-i="' + i + '">'
    ).join('');

    const metrics = root.querySelector('[data-metrics]');
    rows.querySelectorAll('input').forEach(inp => inp.addEventListener('input', () => {
      const i = Number(inp.dataset.i);
      dims[i].v = Number(inp.value);
      rows.querySelector('[data-v="' + i + '"]').textContent = inp.value;
      update();
    }));

    function update() {
      const total = dims.reduce((s, d) => s + d.w * d.v, 0) / 100;
      const ranked = dims.map((d, i) => ({ ...d, i, contribution: d.w * d.v / 100 })).sort((a, b) => b.contribution - a.contribution);
      metrics.innerHTML =
        metric(zh ? '综合效用' : 'Composite utility', total.toFixed(1), '/ 100') +
        metric(zh ? '最大贡献' : 'Largest contribution', (zh ? ranked[0].zh : ranked[0].en), ranked[0].contribution.toFixed(1)) +
        metric(zh ? '最小贡献' : 'Smallest contribution', (zh ? ranked[4].zh : ranked[4].en), ranked[4].contribution.toFixed(1));
    }
    update();
  }

  /* ---------------- resource allocation ---------------- */
  function resource(root, zh) {
    root.innerHTML =
      '<h4>' + (zh ? '能力资本配置：主方向与探索预算' : 'Capital allocation: core direction plus exploration') + '</h4>' +
      '<label for="sl-r-a">' + (zh ? '核心方向投入' : 'Core direction') + ': <output data-a></output></label>' +
      '<input id="sl-r-a" type="range" min="40" max="90" step="5" value="70">' +
      '<label for="sl-r-b">' + (zh ? '相邻方向探索' : 'Adjacent exploration') + ': <output data-b></output></label>' +
      '<input id="sl-r-b" type="range" min="0" max="40" step="5" value="20">' +
      '<div class="sl-stack"><span class="sl-seg-core" data-core></span><span class="sl-seg-adj" data-adj></span><span class="sl-seg-cross" data-cross></span></div>' +
      '<div class="sl-legend">' +
      '<span><i class="sl-dot-core"></i>' + (zh ? '核心' : 'Core') + ' <b data-lcore></b></span>' +
      '<span><i class="sl-dot-adj"></i>' + (zh ? '相邻' : 'Adjacent') + ' <b data-ladj></b></span>' +
      '<span><i class="sl-dot-cross"></i>' + (zh ? '跨域' : 'Cross') + ' <b data-lcross></b></span>' +
      '</div>' +
      '<div class="sl-metrics" data-metrics aria-live="polite"></div>' +
      '<p class="sl-hint">' + (zh
        ? '跨域探索为剩余部分（100 − 核心 − 相邻）。70/20/10 是可尝试的起点，不是数学上的最优比例。'
        : 'Cross-domain work takes the remainder (100 − core − adjacent). 70/20/10 is a starting point, not a proven optimum.') + '</p>';

    const sa = root.querySelector('#sl-r-a');
    const sb = root.querySelector('#sl-r-b');
    const oa = root.querySelector('[data-a]');
    const ob = root.querySelector('[data-b]');
    const core = root.querySelector('[data-core]');
    const adj = root.querySelector('[data-adj]');
    const cross = root.querySelector('[data-cross]');
    const lcore = root.querySelector('[data-lcore]');
    const ladj = root.querySelector('[data-ladj]');
    const lcross = root.querySelector('[data-lcross]');
    const metrics = root.querySelector('[data-metrics]');

    function draw() {
      const a = Number(sa.value);
      sb.max = String(100 - a);
      if (Number(sb.value) > 100 - a) sb.value = String(Math.max(0, 100 - a));
      const b = Number(sb.value);
      const c = 100 - a - b;
      oa.textContent = a + '%';
      ob.textContent = b + '%';
      core.style.width = a + '%';
      adj.style.width = b + '%';
      cross.style.width = c + '%';
      lcore.textContent = a + '%';
      ladj.textContent = b + '%';
      lcross.textContent = c + '%';
      metrics.innerHTML =
        metric(zh ? '长期积累' : 'Long-run accumulation', a + '%', zh ? '核心方向' : 'core direction') +
        metric(zh ? '发现新机会' : 'Discovery', (b + c) + '%', zh ? '相邻 + 跨域' : 'adjacent + cross');
    }

    sa.addEventListener('input', draw);
    sb.addEventListener('input', draw);
    draw();
  }

  /* ---------------- checklist ---------------- */
  function checklist(root, zh) {
    const itemsZh = [
      '明确优化目标：究竟在追求收入、成长、幸福、自由，还是风险最小化？',
      '判断可逆性：这项决策能否撤销，撤销成本多大？',
      '设定探索预算：最多投入多少时间、金钱和精力获取信息？',
      '获取代表性样本：是否了解了足够多具有差异性的机会？',
      '建立评价体系：硬性约束、评价维度、个人偏好与最低接受标准。',
      '评估继续搜索的价值：更多信息是否可能改变决策？',
      '保留未来选择权：能否先试用、短租、分批投入？',
      '及时行动与复盘：达到停止条件就行动，再按真实结果更新认知。'
    ];
    const itemsEn = [
      'Define the objective: income, growth, wellbeing, freedom, or risk?',
      'Assess reversibility: can this be undone, and at what cost?',
      'Set an exploration budget: how much time, money and energy at most?',
      'Get a representative sample: have you seen genuinely varied options?',
      'Build an evaluation system: constraints, dimensions, preferences, minimum standard.',
      'Value further search: could more information change the decision?',
      'Preserve optionality: can you trial, rent short-term, or stage the commitment?',
      'Act and review: act once the stopping condition is met, then update.'
    ];
    const items = zh ? itemsZh : itemsEn;
    root.innerHTML =
      '<h4>' + (zh ? '重大决策检查清单' : 'Major decision checklist') + ': <span data-count>0 / ' + items.length + '</span></h4>' +
      '<div class="sl-checks">' + items.map((t, i) => '<label><input type="checkbox"><span>' + (i + 1) + '. ' + t + '</span></label>').join('') + '</div>' +
      '<button type="button" data-copy>' + (zh ? '复制清单' : 'Copy checklist') + '</button>' +
      '<button type="button" data-reset>' + (zh ? '重置' : 'Reset') + '</button>' +
      '<div data-status role="status"></div>';

    const inputs = [...root.querySelectorAll('input')];
    const count = root.querySelector('[data-count]');
    const status = root.querySelector('[data-status]');
    const update = () => {
      const done = inputs.filter(x => x.checked).length;
      count.textContent = done + ' / ' + items.length;
      if (done === items.length) status.textContent = zh ? '八项都已过一遍，可以进入决策。' : 'All eight reviewed; ready to decide.';
    };
    inputs.forEach(x => x.addEventListener('change', update));
    root.querySelector('[data-reset]').addEventListener('click', () => {
      inputs.forEach(x => { x.checked = false; });
      update();
      status.textContent = zh ? '已重置。' : 'Reset.';
    });
    root.querySelector('[data-copy]').addEventListener('click', async () => {
      const text = items.map((t, i) => (inputs[i].checked ? '[x] ' : '[ ] ') + (i + 1) + '. ' + t).join('\n');
      try {
        if (!navigator.clipboard) throw new Error('unavailable');
        await navigator.clipboard.writeText(text);
        status.textContent = zh ? '清单已复制。' : 'Checklist copied.';
      } catch (e) {
        status.textContent = zh ? '无法访问剪贴板，请直接选取正文清单复制。' : 'Clipboard unavailable; copy the list above.';
      }
    });
  }

  const handlers = { secretary: secretary, queue: queue, search: search, mab: mab, offer: offer, resource: resource, checklist: checklist };

  document.querySelectorAll('[data-stopping-lab]').forEach(root => {
    const kind = root.dataset.stoppingLab;
    const zh = root.dataset.language === 'zh';
    if (!handlers[kind]) return;
    root.classList.remove('is-loading');
    handlers[kind](root, zh);
  });
})();
