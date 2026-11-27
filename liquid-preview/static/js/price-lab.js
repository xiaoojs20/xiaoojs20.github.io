(() => {
  if (window.__priceLabInitialized) return;
  window.__priceLabInitialized = true;

  // 全部为国行官方首发价（人民币元），按同容量档对齐；null 表示该档位不存在或未发布
  const DATA = [
    {
      brand: { zh: '苹果', en: 'Apple' },
      mobile: { zh: '12GB', en: '12GB' },
      tiers: {
        standard: {
          '256': { prev: 'iPhone 17', prevPrice: 5999, curr: 'iPhone 18', currPrice: null, note: { zh: '标准版尚未发布', en: 'Standard model not released' } },
          '512': { prev: 'iPhone 17', prevPrice: 7999, curr: 'iPhone 18', currPrice: null, note: { zh: '标准版尚未发布', en: 'Standard model not released' } }
        },
        pro: {
          '256': { prev: 'iPhone 17 Pro', prevPrice: 8999, curr: 'iPhone 18 Pro', currPrice: 9999 },
          '512': { prev: 'iPhone 17 Pro', prevPrice: 10999, curr: 'iPhone 18 Pro', currPrice: 11999 }
        },
        promax: {
          '256': { prev: 'iPhone 17 Pro Max', prevPrice: 9999, curr: 'iPhone 18 Pro Max', currPrice: 10999 },
          '512': { prev: 'iPhone 17 Pro Max', prevPrice: 11999, curr: 'iPhone 18 Pro Max', currPrice: 12999 }
        }
      }
    },
    {
      brand: { zh: '小米', en: 'Xiaomi' },
      mobile: { zh: '12GB', en: '12GB' },
      tiers: {
        standard: {
          '256': { prev: 'Xiaomi 17', prevPrice: 4499, curr: 'Xiaomi 18', currPrice: null, note: { zh: '标准版尚未发布', en: 'Standard model not released' } },
          '512': { prev: 'Xiaomi 17', prevPrice: 4799, curr: 'Xiaomi 18', currPrice: null, note: { zh: '标准版尚未发布', en: 'Standard model not released' } }
        },
        pro: {
          '256': { prev: 'Xiaomi 17 Pro', prevPrice: 4999, curr: 'Xiaomi 18 Pro', currPrice: 5999 },
          '512': { prev: 'Xiaomi 17 Pro', prevPrice: 5299, curr: 'Xiaomi 18 Pro', currPrice: 6999 }
        },
        promax: {
          '256': { prev: 'Xiaomi 17 Pro Max', prevPrice: null, curr: 'Xiaomi 18 Pro Max', currPrice: 6999, note: { zh: '上代无 256GB 档', en: 'No 256GB tier last gen' } },
          '512': { prev: 'Xiaomi 17 Pro Max', prevPrice: 5999, curr: 'Xiaomi 18 Pro Max', currPrice: 7999 }
        }
      }
    },
    {
      brand: { zh: 'vivo', en: 'vivo' },
      mobile: { zh: '12GB', en: '12GB' },
      tiers: {
        standard: {
          '256': { prev: 'vivo X300', prevPrice: 4399, curr: 'vivo X500', currPrice: 5499 },
          '512': { prev: 'vivo X300', prevPrice: 4999, curr: 'vivo X500', currPrice: 5999 }
        },
        pro: {
          '256': { prev: 'vivo X300 Pro', prevPrice: 5299, curr: 'vivo X500 Pro', currPrice: 6499 },
          '512': { prev: 'vivo X300 Pro', prevPrice: 5999, curr: 'vivo X500 Pro', currPrice: 7999, note: { zh: '上代按 16+512 对齐', en: '16+512GB on previous gen' } }
        },
        promax: {
          '256': { prev: 'vivo X300 Pro Max', prevPrice: null, curr: 'vivo X500 Pro Max', currPrice: 6999, note: { zh: '上代无此机型', en: 'No such model last gen' } },
          '512': { prev: 'vivo X300 Pro Max', prevPrice: null, curr: 'vivo X500 Pro Max', currPrice: 7999, note: { zh: '上代无此机型', en: 'No such model last gen' } }
        }
      }
    },
    {
      brand: { zh: 'OPPO', en: 'OPPO' },
      mobile: { zh: '12GB', en: '12GB' },
      tiers: {
        standard: {
          '256': { prev: 'Find X9', prevPrice: 4399, curr: 'Find X10', currPrice: 5499 },
          '512': { prev: 'Find X9', prevPrice: 4999, curr: 'Find X10', currPrice: 5999 }
        },
        pro: {
          '256': { prev: 'Find X9 Pro', prevPrice: 5299, curr: 'Find X10 Pro Max', currPrice: 6799, note: { zh: '这代升格为 Pro Max', en: 'Promoted to Pro Max this gen' } },
          '512': { prev: 'Find X9 Pro', prevPrice: 5699, curr: 'Find X10 Pro Max', currPrice: 7499, note: { zh: '这代升格为 Pro Max', en: 'Promoted to Pro Max this gen' } }
        },
        promax: {
          '256': { prev: 'Find X9 Pro', prevPrice: 5299, curr: 'Find X10 Pro Max', currPrice: 6799, note: { zh: '上代无 Pro Max，按 Pro 对齐', en: 'No Pro Max last gen; matched to the Pro' } },
          '512': { prev: 'Find X9 Pro', prevPrice: 5699, curr: 'Find X10 Pro Max', currPrice: 7499, note: { zh: '上代无 Pro Max，按 Pro 对齐', en: 'No Pro Max last gen; matched to the Pro' } }
        }
      }
    },
    {
      brand: { zh: '华为', en: 'Huawei' },
      mobile: { zh: '12GB', en: '12GB' },
      tiers: {
        standard: {
          '256': { prev: 'Mate 80', prevPrice: 4699, curr: 'Mate 90', currPrice: 5999 },
          '512': { prev: 'Mate 80', prevPrice: 5199, curr: 'Mate 90', currPrice: 6999 }
        },
        pro: {
          '256': { prev: 'Mate 80 Pro', prevPrice: 5999, curr: 'Mate 90 Pro', currPrice: 6999 },
          '512': { prev: 'Mate 80 Pro', prevPrice: 6499, curr: 'Mate 90 Pro', currPrice: 7999 }
        },
        promax: {
          '256': { prev: 'Mate 80 Pro Max', prevPrice: null, curr: 'Mate 90 Pro Max', currPrice: null, note: { zh: '两代均无 256GB 档', en: 'No 256GB tier in either gen' } },
          '512': { prev: 'Mate 80 Pro Max', prevPrice: 7999, curr: 'Mate 90 Pro Max', currPrice: 9499, note: { zh: '上代按 16+512 对齐', en: '16+512GB on previous gen' } }
        }
      }
    }
  ];

  const TIERS = [
    { key: 'standard', zh: '标准版', en: 'Standard' },
    { key: 'pro', zh: 'Pro', en: 'Pro' },
    { key: 'promax', zh: 'Pro Max', en: 'Pro Max' }
  ];
  const CAPS = ['256', '512'];
  const money = n => '¥' + new Intl.NumberFormat('en-US').format(n);

  function setup(root, i) {
    const zh = root.dataset.language === 'zh';
    const state = { tier: 'pro', cap: '256' };
    root.innerHTML = `
      <div class="price-lab-head">
        <h4>${zh ? '主力旗舰跨代涨价对比' : 'Flagship price increases across generations'}</h4>
        <p class="price-lab-note">${zh ? '国行官方首发价，按同容量档对齐，不含补贴。' : 'China official launch prices, matched by storage tier, excluding subsidies.'}</p>
      </div>
      <div class="price-lab-controls">
        <div class="price-lab-group" role="group" aria-label="${zh ? '选择档位' : 'Choose tier'}">
          <span class="price-lab-label">${zh ? '档位' : 'Tier'}</span>
          ${TIERS.map(t => `<button type="button" data-tier="${t.key}" aria-pressed="false">${t[zh ? 'zh' : 'en']}</button>`).join('')}
        </div>
        <div class="price-lab-group" role="group" aria-label="${zh ? '选择容量' : 'Choose storage'}">
          <span class="price-lab-label">${zh ? '容量' : 'Storage'}</span>
          ${CAPS.map(c => `<button type="button" data-cap="${c}" aria-pressed="false">${c}GB</button>`).join('')}
        </div>
      </div>
      <div class="price-lab-table-wrap"><table class="price-lab-table"><thead><tr>
        <th>${zh ? '品牌' : 'Brand'}</th>
        <th>${zh ? '上一代' : 'Previous'}</th>
        <th>${zh ? '这一代' : 'Current'}</th>
        <th>${zh ? '涨幅' : 'Increase'}</th>
      </tr></thead><tbody data-body></tbody></table></div>
      <p class="price-lab-insight" data-insight aria-live="polite"></p>
      <p class="price-lab-foot">${zh ? '数据为发布时官方价；部分机型上一代无对应档位，或尚未发布，以「—」标出。' : 'Figures are official launch prices. A dash means the tier did not exist last generation or is not released yet.'}</p>`;

    const body = root.querySelector('[data-body]');
    const insight = root.querySelector('[data-insight]');

    function render() {
      root.querySelectorAll('[data-tier]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tier === state.tier)));
      root.querySelectorAll('[data-cap]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.cap === state.cap)));

      const rows = [];
      const increases = [];
      const tierLabel = TIERS.find(t => t.key === state.tier)[zh ? 'zh' : 'en'];
      DATA.forEach(item => {
        const d = item.tiers[state.tier][state.cap];
        let inc = '—';
        if (d.prevPrice != null && d.currPrice != null) {
          const delta = d.currPrice - d.prevPrice;
          const pct = (delta / d.prevPrice * 100).toFixed(1);
          inc = `${delta >= 0 ? '+' : ''}${money(delta)} (${delta >= 0 ? '+' : ''}${pct}%)`;
          increases.push({ brand: item.brand[zh ? 'zh' : 'en'], pct: Number(pct) });
        }
        // 备注优先贴到缺失的那一侧；两侧都有价格时贴在这一代
        const noteTag = d.note ? `<small class="price-lab-note">${d.note[zh ? 'zh' : 'en']}</small>` : '';
        const bothMissing = d.prevPrice == null && d.currPrice == null;
        const prevCell = d.prevPrice != null
          ? `${d.prev}<small>${money(d.prevPrice)}</small>`
          : `${d.prev}<small>—</small>${noteTag}`;
        const currCell = d.currPrice != null
          ? `${d.curr}<small>${money(d.currPrice)}</small>${d.prevPrice != null ? noteTag : ''}`
          : `${d.curr}<small>—</small>${bothMissing ? '' : noteTag}`;
        rows.push(`<tr>
          <td><strong>${item.brand[zh ? 'zh' : 'en']}</strong></td>
          <td>${prevCell}</td>
          <td>${currCell}</td>
          <td class="price-lab-inc">${inc}</td>
        </tr>`);
      });
      body.innerHTML = rows.join('');

      if (increases.length) {
        increases.sort((a, b) => a.pct - b.pct);
        const low = increases[0], high = increases[increases.length - 1];
        const same = low.brand === high.brand;
        insight.textContent = zh
          ? (same
            ? `${tierLabel} ${state.cap}GB：${low.brand}涨幅约 ${low.pct}%，其余机型缺少可比档位。`
            : `${tierLabel} ${state.cap}GB：${low.brand}涨幅最小（+${low.pct}%），${high.brand}最大（+${high.pct}%）。容量越大，涨幅越明显。`)
          : (same
            ? `${tierLabel} ${state.cap}GB: ${low.brand} rose about ${low.pct}%; other models have no comparable tier.`
            : `${tierLabel} ${state.cap}GB: ${low.brand} has the smallest increase (+${low.pct}%), ${high.brand} the largest (+${high.pct}%). Larger storage means steeper increases.`);
      } else {
        insight.textContent = zh
          ? '该档位各机型缺少可比的上一代或这一代，无法计算涨幅；试试 Pro 档。'
          : 'No comparable tier on one side, so no increase can be calculated. Try the Pro tier.';
      }
    }

    root.querySelectorAll('[data-tier]').forEach(b => b.addEventListener('click', () => { state.tier = b.dataset.tier; render(); }));
    root.querySelectorAll('[data-cap]').forEach(b => b.addEventListener('click', () => { state.cap = b.dataset.cap; render(); }));
    render();
  }

  document.querySelectorAll('[data-price-lab]').forEach(setup);
})();
