(() => {
  if (window.__offerLabInitialized) return;
  window.__offerLabInitialized = true;
  const checksZh = [
    '固定月薪、合同约定薪酬与税前口径是否一致？', '固定发放几薪，额外几薪是否与绩效挂钩？', '年终奖目标值、兑现规则和发放日期是什么？', '签字费是否计入总包、如何分期、有无离职退还条款？', '是否有租房、餐饮、交通或人才补贴，条件是什么？', '社保在哪个城市缴纳，各险种申报基数是什么？', '公积金个人和单位比例、申报基数是什么？', '是否有上海等地的补充公积金？', '是否提供企业年金和补充医疗，具体条款是什么？', '股权是 RSU、期权还是其他持股计划？', '授予数量、估值依据和归属时间表是什么？', '离职后未归属或已归属股权如何处理？', '是否有年度股权刷新授予？', '奖金与股权对应的绩效系数和评定规则是什么？', '合同主体、签约地点和实际办公城市是否明确？', '试用期期限、工资和考核规则是什么？', '竞业限制、违约责任、服务期与经济补偿如何约定？', '年假、加班、调休、远程办公和日常工作强度如何？', '哪些关键承诺写入正式 Offer、合同或相关协议？'
  ];
  const checksEn = [
    'Do fixed monthly pay, contractual pay and the gross amount agree?', 'How many salary months are guaranteed and how many depend on performance?', 'What are the target bonus, payout rules and payment date?', 'Is the signing bonus included in TC, paid in installments or subject to clawback?', 'Are rent, meals, transport or talent allowances available, and on what terms?', 'Where is social insurance paid and what is each scheme’s assessed base?', 'What are the employee and employer housing-fund rates and assessed base?', 'Is a supplementary housing fund offered where applicable?', 'Are enterprise annuity and supplementary medical cover offered, and on what terms?', 'Are the awards RSUs, options or another plan?', 'What are the grant quantity, valuation basis and vesting schedule?', 'What happens to vested and unvested awards on departure?', 'Are annual equity refresh grants offered?', 'What performance factors and assessments affect bonuses and equity?', 'Are the contracting entity, signing location and actual workplace clear?', 'What are the probation duration, salary and assessment terms?', 'What are the non-compete, penalty, service and compensation terms?', 'What are the leave, overtime, time off, remote-work and actual hours arrangements?', 'Which commitments are written into the formal offer, contract or agreements?'
  ];
  const htmlEscape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = n => new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(n);
  function setup(root, i) {
    const zh = root.dataset.language === 'zh', kind = root.dataset.offerLab, id = `offer-lab-${i}`;
    if (kind === 'checklist') {
      const checks = zh ? checksZh : checksEn;
      root.innerHTML = `<h4>${zh?'Offer 核对进度':'Offer review progress'}: <span data-count>0 / 19</span></h4><div class="offer-checks">${checks.map((t,j)=>`<label><input type="checkbox"><span>${j+1}. ${htmlEscape(t)}</span></label>`).join('')}</div><button type="button" data-copy>${zh?'复制完整清单':'Copy full checklist'}</button><button type="button" data-reset>${zh?'重置勾选':'Reset checks'}</button><div data-status role="status"></div>`;
      const inputs = [...root.querySelectorAll('input')], count = root.querySelector('[data-count]'), status = root.querySelector('[data-status]');
      const update = () => count.textContent = `${inputs.filter(x=>x.checked).length} / 19`;
      inputs.forEach(x=>x.addEventListener('change',update));
      root.querySelector('[data-reset]').addEventListener('click',()=>{inputs.forEach(x=>x.checked=false);update();status.textContent=zh?'已重置。':'Checks reset.'});
      root.querySelector('[data-copy]').addEventListener('click',async()=>{const content=checks.map((x,j)=>`${inputs[j].checked?'[x]':'[ ]'} ${j+1}. ${x}`).join('\n');try {if (!navigator.clipboard) throw new Error('unavailable'); await navigator.clipboard.writeText(content);status.textContent=zh?'清单已复制。':'Checklist copied.'} catch (_) {status.textContent=zh?'无法访问剪贴板，请选取下方正文清单复制。':'Clipboard unavailable; copy the plain-text checklist below.'}});
      return;
    }
    const cfg = kind === 'performance' ? {title:zh?'绩效兑现情景':'Performance scenario', label:zh?'年终奖兑现系数 K':'Bonus realization factor K', min:0,max:2,step:.1,value:.8} : kind === 'housing' ? {title:zh?'公积金缴存情景':'Housing-fund scenario',label:zh?'个人和单位各自缴存比例':'Employee and employer contribution rate each',min:5,max:12,step:1,value:12} : {title:zh?'期权价格情景':'Option price scenario',label:zh?'假设出售股价（元/股）':'Hypothetical sale price (RMB/share)',min:0,max:40,step:1,value:20};
    root.innerHTML = `<h4>${cfg.title}</h4><label for="${id}">${cfg.label}: <output for="${id}" data-value></output></label><input id="${id}" type="range" min="${cfg.min}" max="${cfg.max}" step="${cfg.step}" value="${cfg.value}"><div class="offer-range-note"><span>${cfg.min}</span><span>${cfg.max}</span></div><div class="offer-metrics" aria-live="polite"></div><p class="offer-hint"></p>`;
    const slider=root.querySelector('input'), output=root.querySelector('[data-value]'), metrics=root.querySelector('.offer-metrics'), hint=root.querySelector('.offer-hint');
    const metric=(label,value)=>`<div class="offer-metric">${label}<strong>${value}</strong></div>`;
    function update() {
      const n=Number(slider.value);
      if(kind==='performance') {
        output.textContent=n.toFixed(1)+'×';
        metrics.innerHTML=metric(zh?'全年税前现金':'Annual gross cash',`¥${money(35000*(12+4*n))}`)+metric(zh?'相当于':'Equivalent months',`${(12+4*n).toFixed(1)} ${zh?'薪':'months'}`);
        hint.textContent=zh?'固定 35,000 元 × 12，目标奖金为 4 个月工资。':'RMB 35,000 × 12 fixed salary, plus a four-month target bonus.';
      } else if(kind==='housing') {
        output.textContent=n+'% + '+n+'%';const m=30000*n/100;
        metrics.innerHTML=metric(zh?'个人每月':'Employee / month',`¥${money(m)}`)+metric(zh?'单位每月':'Employer / month',`¥${money(m)}`)+metric(zh?'全年账户新增':'Annual account increase',`¥${money(m*24)}`);
        hint.textContent=zh?'假设月缴存基数 30,000 元、双方同率；不计利息和提取。':'Assumes a RMB 30,000 base, equal rates, no interest or withdrawals.';
      } else {
        output.textContent=`¥${n}`;const exercise=n>5?50000:0,profit=10000*Math.max(n-5,0);
        metrics.innerHTML=metric(zh?'假设行权所需资金':'Assumed exercise cost',`¥${money(exercise)}`)+metric(zh?'潜在税前收益':'Potential pre-tax profit',`¥${money(profit)}`);
        hint.textContent=zh?'10,000 份，行权价 5 元；股价不高于行权价时假设不行权。不计税费，且假设可出售。':'10,000 options, RMB 5 strike; no exercise at or below strike. Excludes tax and fees and assumes a sale is possible.';
      }
    }
    slider.addEventListener('input',update);update();
  }
  document.querySelectorAll('[data-offer-lab]').forEach(setup);
})();