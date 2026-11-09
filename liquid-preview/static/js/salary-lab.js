(() => {
  const limits = {
    beijing: {name:['北京','Beijing'], p:[7270,36348], m:[7270,36348], u:[7270,36348], h:[2540,36348], ur:.005, fee:3},
    shanghai:{name:['上海','Shanghai'],p:[7546,37731],m:[7546,37731],u:[7546,37731],h:[2740,37731],ur:.005,fee:0},
    guangzhou:{name:['广州','Guangzhou'],p:[5521,27603],m:[6234,31170],u:[2680,42933],h:[2680,41697],ur:.002,fee:0},
    shenzhen:{name:['深圳','Shenzhen'],p:[5521,27603],m:[6727,33633],u:[2700,48471],h:[2520,48471],ur:.002,fee:0},
    hangzhou:{name:['杭州','Hangzhou'],p:[5122,25611],m:[5122,25611],u:[5122,25611],h:[2660,42151],ur:.005,fee:0},
    quanzhou:{name:['泉州','Quanzhou'],p:[4579,22893],m:[4579,22893],u:[4579,22893],h:[2195,24795],ur:.005,fee:0}
  };
  const round = n => Math.round((n + Number.EPSILON) * 100) / 100;
  const fmt = n => new Intl.NumberFormat('en-US', {minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
  const clamp = (n, bounds) => Math.max(bounds[0], Math.min(n, bounds[1]));
  const annualBands = [[36000,.03,0],[144000,.10,2520],[300000,.20,16920],[420000,.25,31920],[660000,.30,52920],[960000,.35,85920],[Infinity,.45,181920]];
  const bonusBands = [[3000,.03,0],[12000,.10,210],[25000,.20,1410],[35000,.25,2660],[55000,.30,4410],[80000,.35,7160],[Infinity,.45,15160]];
  const annualTax = amount => { const v = Math.max(0, amount); const [,rate,deduction] = annualBands.find(b => v <= b[0]); return round(Math.max(0, v * rate - deduction)); };
  const bonusTax = amount => { if (amount <= 0) return 0; const [,rate,deduction] = bonusBands.find(b => amount / 12 <= b[0]); return round(Math.max(0, amount * rate - deduction)); };
  const text = {
    zh:{title:'六城月 Base 与全年现金计算器', city:'工作城市', salary:'税前月 Base（k/月）', wage:'核定月缴费工资（k/月）', bonus:'全年税前年终奖（k/年）', sign:'当年税前签字费（k）', personal:'个人公积金比例（%）', employer:'单位公积金比例（%）', deduction:'全年专项附加扣除（元）', method:'年终奖计税', separate:'符合条件：单独计税', combined:'并入综合所得', details:'各险种实际缴费基数（可按工资单修改）', p:'养老基数（k/月）', m:'医保基数（k/月）', u:'失业基数（k/月）', h:'公积金基数（k/月）', foot:'金额输入单位为 k（1 k = 1,000 元），计算结果显示为元。默认全年在同一城市连续工作 12 个月，城市参数按 2026 年 11 月的固定政策快照计算；不等于 2026 自然年工资单。上海 12% 假设普通 7% + 补充 5%，须单位确有补充公积金；深圳按职工医保一档、非深户，杭州和泉州默认市区。北京医保含每月 3 元；不含其他附加险、年金、股权及其他收入。', basehint:'修改城市或核定月缴费工资会重新按示例上下限生成四项基数；也可再逐项编辑。不同年度、区县、账户类型和新入职规则可能不同，请以实际核定为准。', reset:'恢复默认值', err:'请填写完整有效的非负金额；月 Base 必须大于零，比例须在 0%–12% 之间。', burden:'所填个人五险一金高于月 Base，当前模型无法绘制非负工资分配，请检查基数和比例。', warn:'所填基数超出本示例的城市上下限；若你的实际政策或账户类型不同，请以公积金中心和社保机构核定为准。结果按输入值计算。', view:'月 Base 的去向（工资税额按全年均摊）', pen:'个人养老',med:'个人医保',un:'个人失业',fund:'个人公积金',itax:'工资个税（月均）',cash:'工资税后现金（月均）', gross:'全年税前现金', net:'全年税后现金', tax:'全年工资与奖金个税', housing:'全年公积金到账（个人+单位）', basecash:'月 Base 税后现金（年均）', wagebase:'全年工资专项扣除（个人五险一金）', personalyear:'个人公积金（年）', employeryear:'单位公积金（年）', salarytax:'Base 对应工资税（年）', extratax:'奖金和签字费增加的个税（年）', share:'占 Base', taxnote:'分配口径：先根据 Base 工资及扣除计算工资税，再加入签字费并将增加的综合所得税分配给签字费；年终奖选择并入综合所得时，最后加入年终奖并将增量税额分配给年终奖，单独计税时使用年终奖自身税额。全年总税为实际选定方式下的模型税额。此分摊用于画图，不是官方逐项纳税规则；累计预扣、汇算及扣除变化会使每月实发不同。签字费未必符合年终奖优惠；单独计税每年限一次，须自行确认资格。', personalnote:'单位公积金不从 Base 扣除；账户金额有提取限制，不等同现金。输入数据仅在本页面计算，不上传或保存。', citycap:'缴费参数快照（元/月）：养老', medical:'医保', unemployment:'失业', fundcap:'公积金', percent:'个人公积金税前扣除按不超过 12% 的输入计算。具体政策及取整以当地核定为准。'},
    en:{title:'Six-city monthly base and annual cash calculator',city:'Work city',salary:'Gross monthly base (k RMB/month)',wage:'Assessed monthly contributory wage (k RMB/month)',bonus:'Gross annual bonus (k RMB/year)',sign:'Gross signing bonus this year (k RMB)',personal:'Employee housing-fund rate (%)',employer:'Employer housing-fund rate (%)',deduction:'Annual special additional deductions (RMB)',method:'Annual bonus tax treatment',separate:'Separate, if eligible',combined:'Combine with income',details:'Assessed bases by scheme (editable)',p:'Pension base (k RMB/month)',m:'Medical base (k RMB/month)',u:'Unemployment base (k RMB/month)',h:'Housing-fund base (k RMB/month)',foot:'Amounts are entered in k (1 k = RMB 1,000); results are shown in RMB. Assumes 12 months in one city using a fixed November 2026 policy snapshot; this is not an actual calendar-year 2026 payslip. Shanghai 12% assumes 7% ordinary plus 5% supplementary, if the employer offers it. Shenzhen assumes tier-one medical and non-local registration; Hangzhou and Quanzhou use urban districts. Beijing includes RMB 3 monthly medical mutual aid. Extra insurance, annuities, equity and other income are excluded.',basehint:'Changing city or assessed contributory wages resets the four bases to illustrative local caps and floors. You can then edit each base. Year, district, account type and new-hire rules differ; use your actual assessment.',reset:'Reset defaults',err:'Enter valid non-negative amounts; monthly base must exceed zero and rates must be between 0% and 12%.',burden:'Employee contributions exceed monthly base. Check the bases and rates before drawing the salary allocation.',warn:'An entered base is outside this example’s city limits. If your local or account-specific rules differ, verify with the relevant agencies. The entered values are used as-is.',view:'Monthly base allocation (salary tax averaged over the year)',pen:'Employee pension',med:'Employee medical',un:'Employee unemployment',fund:'Employee housing fund',itax:'Salary tax (monthly average)',cash:'Salary cash (monthly average)',gross:'Annual gross cash',net:'Annual after-tax cash',tax:'Annual salary and bonus tax',housing:'Annual housing-fund deposits (employee + employer)',basecash:'Monthly base after tax (annual average)',wagebase:'Annual employee contributions',personalyear:'Employee housing fund / year',employeryear:'Employer housing fund / year',salarytax:'Base-only salary tax / year',extratax:'Incremental tax on bonuses / year',share:'Share of base',taxnote:'Attribution: base-only annual tax is calculated first; the incremental comprehensive-income tax after adding the signing bonus is assigned to it. A combined annual bonus is then assigned the additional tax it creates; a separately taxed bonus uses its own tax. Total tax follows the selected treatment. This allocation is for the chart, not an official item-by-item tax rule; cumulative withholding and annual settlement can differ. The annual bonus must qualify for separate taxation, which is available once per year; a signing bonus does not automatically qualify.',personalnote:'Employer housing-fund deposits are not deducted from base and are subject to withdrawal rules. Inputs are calculated locally and are not uploaded or saved.',citycap:'Illustrative assessed-base ranges (RMB/month): pension',medical:'medical',unemployment:'unemployment',fundcap:'housing',percent:'Employee housing-fund tax deduction uses the entered rate of at most 12%. Local assessment and rounding may differ.'}
  };
  function deductionsUI(zh) {
    const L = zh ? {
      title:'按个人情况选择专项附加扣除', desc:'只勾选符合条件且由本人申报的项目；信息仅在本页计算。各项目、分摊对象和月份须自行确认。', rent:'住房租金', mortgage:'住房贷款利息', childcare:'3 岁以下婴幼儿照护', education:'子女教育', elderly:'赡养老人', learning:'继续教育', medical:'大病医疗', months:'符合条件的月份', rentRate:'租金扣除标准（元/月）', loanShare:'本人扣除比例', childShare:'本人分摊比例', only:'独生子女：3,000 元/月', shared:'非独生子女：按分摊额度', elderShare:'本人每月分摊额度（k，最高 1.5）', study:'本人符合条件的学历（学位）继续教育', cert:'当年取得符合条件的职业资格证书', childLabel:'子女', patientLabel:'患者', eligible:'全年符合规定的医保目录内个人负担（k）', addChild:'添加一名子女',addPatient:'添加一名患者', remove:'删除', total:'估算全年专项附加扣除', hint:'同一子女、同一月份的照护和教育请勿重复；同一纳税年度内，住房租金和房贷利息在本人及配偶之间只能择一。大病医疗分别按患者计算，通常在年度汇算申报。本人、配偶及其他家庭成员的申报不能重复。', eduHint:'学历继续教育由本人申报时填写；父母申报的子女教育不应在本人继续教育中重复。职业资格证书每年按规定定额一次。', patientHint:'为本人、配偶或未成年子女各自添加一行，仅填写分配给本人申报的患者。每人超过 15,000 元的部分最高扣 80,000 元。', req:'请完整填写已勾选项目的有效月份、分摊比例或金额。', overlap:'住房租金和房贷的扣除月份合计不能超过 12 个月，并须确保没有重叠。', rentHint:'北京、上海、广州、深圳、杭州默认 1,500 元；泉州默认 1,100 元，请按主要工作城市和个税 App 核实后选择。',full:'100%（本人全额）',half:'50%（双方平分）'
    } : {
      title:'Choose special additional deductions',desc:'Select only eligible items you personally claim. Calculations remain on this page; verify your eligibility, allocation and months.',rent:'Housing rent',mortgage:'Mortgage interest',childcare:'Childcare under age three',education:"Children’s education",elderly:'Elderly dependant support',learning:'Continuing education',medical:'Major medical expenses',months:'Eligible months',rentRate:'Rent deduction (RMB/month)',loanShare:'Your share',childShare:'Your share',only:'Only child: RMB 3,000/month',shared:'With siblings: allocated share',elderShare:'Your monthly share (k RMB, maximum 1.5)',study:'Your own eligible degree continuing education',cert:'Qualifying vocational certificate obtained this year',childLabel:'Child',patientLabel:'Patient',eligible:'Annual eligible in-catalog out-of-pocket amount (k RMB)',addChild:'Add a child',addPatient:'Add a patient',remove:'Remove',total:'Estimated annual special additional deductions',hint:'Do not claim childcare and education for the same child in the same month. Rent and mortgage interest must be chosen as alternatives for the taxpayer and spouse in a tax year. Major medical is calculated per patient at annual settlement. Avoid duplicate family claims.',eduHint:'Enter continuing degree education claimed by you. Do not duplicate education claimed by a parent. The qualifying certificate allowance applies once per year.',patientHint:'Add separate rows for eligible expenses of yourself, your spouse or minor children allocated to your claim. For each patient, amounts above RMB 15,000 are deductible up to RMB 80,000.',req:'Complete all selected items with valid months, allocation and amounts.',overlap:'Rent and mortgage months cannot total more than 12 and must not overlap.',rentHint:'Beijing, Shanghai, Guangzhou, Shenzhen and Hangzhou default to RMB 1,500; Quanzhou defaults to RMB 1,100. Verify the category in the tax app.',full:'100% (you claim all)',half:'50% (split evenly)'
    };
    const opt=(v,l)=>`<option value="${v}">${l}</option>`;
    const months=(key)=>`<label>${L.months}<input type="number" data-ded="${key}" min="0" max="12" step="1" value="12" inputmode="numeric"></label>`;
    const category=(key,title,body)=>`<div class="ded-category" data-ded-category="${key}"><label class="ded-choice"><input type="checkbox" data-enable="${key}"${key==='rent'?' checked':''}><span>${title}</span></label><div data-panel="${key}" hidden>${body}</div></div>`;
    const shares=`<label>${L.childShare}<select data-row-key="share">${opt('1',L.full)}${opt('.5',L.half)}</select></label>`;
    const childTemplate=`<div class="ded-row" data-row><label>${L.months}<input data-row-key="months" type="number" min="0" max="12" step="1" value="12" inputmode="numeric"></label>${shares}<button type="button" data-remove>${L.remove}</button></div>`;
    const medicalTemplate=`<div class="ded-row" data-row><label>${L.eligible}<input data-row-key="amount" type="number" min="0" max="10000" step=".001" value="0" inputmode="decimal"></label><button type="button" data-remove>${L.remove}</button></div>`;
    return `<details class="deductions" data-deductions><summary>${L.title} · <span data-ded-count>${zh?'已选 0 项':'0 selected'}</span> · <strong data-ded-total>¥0.00</strong></summary><p>${L.desc}</p><div class="ded-list">`+
      category('rent',L.rent,`<div class="salary-grid">${months('rentMonths')}<label>${L.rentRate}<select data-ded="rentRate">${opt('1500','1,500')}${opt('1100','1,100')}${opt('800','800')}</select></label></div><p>${L.rentHint}</p>`)+
      category('mortgage',L.mortgage,`<div class="salary-grid">${months('mortgageMonths')}<label>${L.loanShare}<select data-ded="loanShare">${opt('1',L.full)}${opt('.5',L.half)}</select></label></div>`)+
      category('childcare',L.childcare,`<div data-rows>${childTemplate}</div><button type="button" data-add="childcare">${L.addChild}</button>`)+
      category('education',L.education,`<div data-rows>${childTemplate}</div><button type="button" data-add="education">${L.addChild}</button>`)+
      category('elderly',L.elderly,`<div class="salary-grid">${months('elderMonths')}<label>${L.elderly}<select data-ded="elderType">${opt('only',L.only)}${opt('shared',L.shared)}</select></label><label data-shared-label hidden>${L.elderShare}<input type="number" data-ded="elderShare" min="0" max="1.5" step=".001" value="1.5" inputmode="decimal"></label></div>`)+
      category('learning',L.learning,`<label class="ded-choice"><input type="checkbox" data-ded="degree">${L.study}</label><div data-degree-panel hidden>${months('degreeMonths')}</div><label class="ded-choice"><input type="checkbox" data-ded="cert">${L.cert}</label><p>${L.eduHint}</p>`)+
      category('medical',L.medical,`<p>${L.patientHint}</p><div data-rows>${medicalTemplate}</div><button type="button" data-add="medical">${L.addPatient}</button>`)+
      `</div><p>${L.hint}</p><template data-child-template>${childTemplate}</template><template data-medical-template>${medicalTemplate}</template></details>`;
  }
  function deductionAmount(root, zh) {
    const container=root.querySelector('[data-deductions]');
    const enabled=k=>container.querySelector(`[data-enable="${k}"]`).checked;
    const field=k=>container.querySelector(`[data-ded="${k}"]`);
    const valid=e=>e && e.value!=='' && e.validity.valid && Number.isFinite(Number(e.value));
    const scalar=k=>{const el=field(k); if(!valid(el)) throw new Error('invalid'); return Number(el.value);};
    let amount=0, rentMonths=0, loanMonths=0;
    try {
      if(enabled('rent')){rentMonths=scalar('rentMonths');amount+=rentMonths*scalar('rentRate');}
      if(enabled('mortgage')){loanMonths=scalar('mortgageMonths');amount+=loanMonths*1000*scalar('loanShare');}
      if(enabled('rent') && enabled('mortgage')) return {error:zh?'同一纳税年度内，住房租金和房贷利息在本人及配偶之间只能择一。':'Choose either rent or mortgage interest for the taxpayer and spouse in a tax year.'};
      for(const kind of ['childcare','education']) if(enabled(kind)) {
        for(const row of container.querySelectorAll(`[data-panel="${kind}"] [data-row]`)) {
          const m=row.querySelector('[data-row-key="months"]'), share=row.querySelector('[data-row-key="share"]');
          if(!valid(m)||!valid(share)) throw new Error('invalid'); amount+=2000*Number(m.value)*Number(share.value);
        }
      }
      if(enabled('elderly')) amount+=scalar('elderMonths')*(field('elderType').value==='only'?3000:scalar('elderShare')*1000);
      if(enabled('learning')) {if(field('degree').checked) amount+=400*scalar('degreeMonths');if(field('cert').checked) amount+=3600;}
      if(enabled('medical')) for(const row of container.querySelectorAll('[data-panel="medical"] [data-row]')) {const e=row.querySelector('[data-row-key="amount"]');if(!valid(e))throw new Error('invalid');amount+=Math.min(80000,Math.max(0,Number(e.value)*1000-15000));}
    } catch (_) {return {error:zh?'请完整填写已勾选项目的有效月份、分摊比例或金额。':'Complete all selected items with valid months, allocation and amounts.'};}
    return {amount:round(amount)};
  }
  function mount(root, index) {
    const zh = root.dataset.language === 'zh', t = text[zh?'zh':'en'], cityOptions = Object.entries(limits).map(([key,value])=>`<option value="${key}"${key==='shanghai'?' selected':''}>${value.name[zh?0:1]}</option>`).join('');
    const field = (key,label,value,min=0,max=10000,step='0.001')=>`<label>${label}<input data-key="${key}" type="number" inputmode="decimal" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;
    root.innerHTML = `<h4>${t.title}</h4><div class="salary-grid"><label>${t.city}<select data-key="city">${cityOptions}</select></label>${field('salary',t.salary,40,0.001)}${field('wage',t.wage,40)}${field('bonus',t.bonus,120)}${field('sign',t.sign,100)}${field('personal',t.personal,12,0,12,.1)}${field('employer',t.employer,12,0,12,.1)}<label class="salary-method">${t.method}<select data-key="method"><option value="separate">${t.separate}</option><option value="combined">${t.combined}</option></select></label></div>${deductionsUI(zh)}<details><summary>${t.details}</summary><p>${t.basehint}</p><div class="salary-grid">${field('p',t.p,36.348)}${field('m',t.m,36.348)}${field('u',t.u,36.348)}${field('h',t.h,36.348)}</div><p data-caps></p></details><p>${t.foot}</p><div class="salary-actions"><button type="button" data-reset>${t.reset}</button></div><p class="salary-warning" data-message role="status"></p><div class="salary-results" data-results><div class="salary-metrics" data-metrics></div><h5>${zh?'工资、年终奖和签字费的去向':'Allocation of salary and bonuses'}</h5><label class="salary-period">${zh?'显示方式':'Display period'}<select data-key="period"><option value="month">${zh?'月均（全年金额 ÷ 12）':'Monthly average (annual amount ÷ 12)'}</option><option value="year">${zh?'全年':'Annual'}</option></select></label><p data-average-explanation></p><div class="salary-period-total" data-period-total aria-live="polite"></div><div class="salary-visual"><div class="salary-donut" data-donut aria-hidden="true"></div><div class="salary-table-wrap"><table><thead><tr><th></th><th>${zh?'金额（元）':'Amount (RMB)'}</th><th>${zh?'占税前收入':'Share of gross'}</th></tr></thead><tbody data-parts></tbody></table></div></div><h5>${zh?'各收入的税前与税后':'Gross and net by income component'}</h5><p class="salary-scroll-hint">${zh?'← 左右滑动查看完整表格 →':'← Scroll sideways to see the full table →'}</p><div class="salary-table-wrap"><table><thead><tr><th>${zh?'收入':'Income'}</th><th>${zh?'税前':'Gross'}</th><th>${zh?'个人五险一金':'Employee contributions'}</th><th>${zh?'分摊个税':'Allocated tax'}</th><th>${zh?'税后现金':'Cash after tax'}</th></tr></thead><tbody data-income-breakdown></tbody></table></div><p>${zh?'选择“月均”时，工资、年终奖、签字费、个人缴费和个税均按全年数额除以 12。年终奖和签字费未必每月发放，图中金额并非每月实际到账。':'In monthly-average mode, annual salary, bonuses, employee contributions and tax are divided by 12. Bonuses may not be paid monthly, so these figures are not actual monthly deposits.'}</p><div class="salary-table-wrap"><table><tbody data-detail></tbody></table></div><p>${t.taxnote}</p><p>${t.personalnote} ${t.percent}</p></div>`;
    const get = key => root.querySelector(`[data-key="${key}"]`), num = key => Number(get(key).value) * (['salary','wage','bonus','sign','p','m','u','h'].includes(key) ? 1000 : 1), message=root.querySelector('[data-message]'), results=root.querySelector('[data-results]');
    const autoBases = () => {const city=limits[get('city').value], w=num('wage'); if(!Number.isFinite(w)||get('wage').value===''||w<0) return; ['p','m','u','h'].forEach(key=>{get(key).value=String(clamp(w,city[key])/1000);});};
    function update() {
      const city=limits[get('city').value];
      root.querySelector('[data-caps]').textContent=`${t.citycap} ${city.p.join('–')}; ${t.medical} ${city.m.join('–')}; ${t.unemployment} ${city.u.join('–')}; ${t.fundcap} ${city.h.join('–')}`;
      const keys=['salary','wage','bonus','sign','personal','employer','p','m','u','h'];
      if(keys.some(key=>get(key).value==='' || !get(key).validity.valid || !Number.isFinite(num(key))) || num('salary')<=0) {message.textContent=t.err;results.hidden=true;return;}
      const selected=root.querySelectorAll('[data-enable]:checked').length;root.querySelector('[data-ded-count]').textContent=zh?`已选 ${selected} 项`:`${selected} selected`;const chosen=deductionAmount(root,zh); if(chosen.error){message.textContent=chosen.error;root.querySelector('[data-ded-total]').textContent='—';results.hidden=true;return;} const ded=chosen.amount;root.querySelector('[data-ded-total]').textContent=`¥${fmt(ded)}`; const salary=num('salary'), bonus=num('bonus'), sign=num('sign');
      const pension=round(num('p')*.08), medical=round(num('m')*.02+city.fee), unemployment=round(num('u')*city.ur), fund=round(num('h')*num('personal')/100), employer=round(num('h')*num('employer')/100);
      const contrib=round(pension+medical+unemployment+fund);
      if(contrib>salary){message.textContent=t.burden;results.hidden=true;return;}
      const salaryOnlyTax=annualTax(salary*12-60000-contrib*12-ded);
      const salaryAndSignTax=annualTax(salary*12+sign-60000-contrib*12-ded);
      const signingTax=round(salaryAndSignTax-salaryOnlyTax);
      const annualBonusTax=get('method').value==='separate' ? bonusTax(bonus) : round(annualTax(salary*12+sign+bonus-60000-contrib*12-ded)-salaryAndSignTax);
      const yearlyTax=round(salaryOnlyTax+signingTax+annualBonusTax);
      const incTax=round(signingTax+annualBonusTax), gross=round(salary*12+bonus+sign), annualCash=round(gross-contrib*12-yearlyTax), salaryTaxMonth=round(salaryOnlyTax/12), salaryCash=round(salary-contrib-salaryTaxMonth);
      if(salaryCash<0){message.textContent=t.burden;results.hidden=true;return;}
      results.hidden=false;
      message.textContent=['p','m','u','h'].some(k=>num(k)<city[k][0]||num(k)>city[k][1])?t.warn:'';
      const period=get('period').value, divisor=period==='year'?1:12;
      const salaryNetAnnual=round(salary*12-contrib*12-salaryOnlyTax);
      const signNetAnnual=round(sign-signingTax), bonusNetAnnual=round(bonus-annualBonusTax);
      const segmentData=[
        [t.pen,pension*12,'#447597','base'],[t.med,medical*12,'#7da09d','base'],[t.un,unemployment*12,'#b77573','base'],[t.fund,fund*12,'#d6a050','base'],
        [zh?'Base 个税':'Base tax',salaryOnlyTax,'#765b9b','base'],[zh?'Base 税后现金':'Base cash after tax',salaryNetAnnual,'#536d61','base'],
        [zh?'签字费个税':'Signing bonus tax',signingTax,'#bf6d49','sign'],[zh?'签字费税后现金':'Signing bonus after tax',signNetAnnual,'#efaf7a','sign'],
        [zh?'年终奖个税':'Annual bonus tax',annualBonusTax,'#a7566d','bonus'],[zh?'年终奖税后现金':'Annual bonus after tax',bonusNetAnnual,'#db8ea6','bonus']
      ];
      const periodGross=round(gross/divisor);
      const parts=segmentData.map(([label,annual,color,group])=>({label,value:round(annual/divisor),color,group}));
      // Reconcile independent cent-rounding to the displayed total, assigning residual to the largest cash component.
      const residual=round(periodGross-parts.reduce((total,item)=>total+item.value,0));
      const cashParts=parts.filter(item=>item.label===(zh?'Base 税后现金':'Base cash after tax') || item.label===(zh?'签字费税后现金':'Signing bonus after tax') || item.label===(zh?'年终奖税后现金':'Annual bonus after tax'));
      const largest=cashParts.reduce((a,b)=>a.value>=b.value?a:b);largest.value=round(largest.value+residual);
      let cursor=0;const stops=parts.map(item=>{const start=cursor;cursor+=item.value/periodGross*100;return `${item.color} ${start.toFixed(5)}% ${cursor.toFixed(5)}%`;});
      root.querySelector('[data-donut]').style.background=`conic-gradient(${stops.join(',')})`;
      root.querySelector('[data-parts]').innerHTML=parts.map(item=>`<tr><td><span class="salary-dot" style="background:${item.color}"></span>${item.label}</td><td>${fmt(item.value)}</td><td>${(item.value/periodGross*100).toFixed(2)}%</td></tr>`).join('');
      const getPart=label=>parts.find(item=>item.label===label).value;
      const sumGroup=group=>round(parts.filter(item=>item.group===group).reduce((sum,item)=>sum+item.value,0));
      const baseTaxPart=getPart(zh?'Base 个税':'Base tax'),baseCashPart=getPart(zh?'Base 税后现金':'Base cash after tax');
      const signTaxPart=getPart(zh?'签字费个税':'Signing bonus tax'),signCashPart=getPart(zh?'签字费税后现金':'Signing bonus after tax');
      const bonusTaxPart=getPart(zh?'年终奖个税':'Annual bonus tax'),bonusCashPart=getPart(zh?'年终奖税后现金':'Annual bonus after tax');
      const contributionPart=round(parts.slice(0,4).reduce((sum,item)=>sum+item.value,0));
      const breakdown=(label,grossValue,contributions,tax,cash)=>`<tr><th>${label}</th><td>${fmt(grossValue)}</td><td>${fmt(contributions)}</td><td>${fmt(tax)}</td><td>${fmt(cash)}</td></tr>`;
      const totalTaxPart=round(baseTaxPart+signTaxPart+bonusTaxPart),totalCashPart=round(baseCashPart+signCashPart+bonusCashPart);
      const cashDots=cashParts.map(item=>`<span class="salary-dot" style="background:${item.color}"></span>`).join('');
      const taxParts=parts.filter(item=>[zh?'Base 个税':'Base tax',zh?'签字费个税':'Signing bonus tax',zh?'年终奖个税':'Annual bonus tax'].includes(item.label));
      const taxDots=taxParts.map(item=>`<span class="salary-dot" style="background:${item.color}"></span>`).join('');
      root.querySelector('[data-parts]').insertAdjacentHTML('beforeend',`<tr class="salary-cash-total"><th scope="row"><span class="salary-cash-dots" aria-hidden="true">${taxDots}</span>${zh?'个税合计（上述三项之和）':'Income tax total (sum of the three rows)'}</th><td>${fmt(totalTaxPart)}</td><td>${(totalTaxPart/periodGross*100).toFixed(2)}%</td></tr><tr class="salary-cash-total"><th scope="row"><span class="salary-cash-dots" aria-hidden="true">${cashDots}</span>${zh?'到手现金合计（上述三项之和）':'Take-home cash total (sum of the three rows)'}</th><td>${fmt(totalCashPart)}</td><td>${(totalCashPart/periodGross*100).toFixed(2)}%</td></tr>`);
      root.querySelector('[data-income-breakdown]').innerHTML=breakdown('Base',sumGroup('base'),contributionPart,baseTaxPart,baseCashPart)+breakdown(zh?'签字费':'Signing bonus',sumGroup('sign'),0,signTaxPart,signCashPart)+breakdown(zh?'年终奖':'Annual bonus',sumGroup('bonus'),0,bonusTaxPart,bonusCashPart)+breakdown(zh?'合计':'Total',periodGross,contributionPart,totalTaxPart,totalCashPart);
      root.querySelector('[data-period-total]').innerHTML=`<span>${zh?(period==='year'?'全年到手现金':'月均到手现金'):(period==='year'?'Annual take-home cash':'Average monthly take-home cash')}</span><strong>¥${fmt(totalCashPart)}</strong><small>${zh?`税前 ${fmt(periodGross)} − 个人五险一金 ${fmt(contributionPart)} − 个税 ${fmt(totalTaxPart)}`:`Gross ${fmt(periodGross)} − employee contributions ${fmt(contributionPart)} − tax ${fmt(totalTaxPart)}`}</small>`;
      root.querySelector('[data-average-explanation]').textContent=zh?`${period==='year'?'全年':'月均'}税前现金：${fmt(periodGross)} 元。分项取整的尾差计入最大一项税后现金。`:`${period==='year'?'Annual':'Monthly average'} gross cash: RMB ${fmt(periodGross)}. Cent-rounding residuals are assigned to the largest cash component.`;
      const metric=(label,value)=>`<div class="salary-metric">${label}<strong>¥${fmt(value)}</strong></div>`;
      root.querySelector('[data-metrics]').innerHTML=metric(t.tax,yearlyTax)+metric(t.housing,(fund+employer)*12);
      const row=(label,value)=>`<tr><th>${label}</th><td>¥${fmt(value)}</td></tr>`;
      root.querySelector('[data-detail]').innerHTML=row(t.gross,gross)+row(t.wagebase,contrib*12)+row(t.personalyear,fund*12)+row(t.employeryear,employer*12)+row(t.salarytax,salaryOnlyTax)+row(t.extratax,incTax);
    }
    const deductions=root.querySelector('[data-deductions]');
    const syncDeductionControls = () => {
      deductions.querySelectorAll('[data-enable]').forEach(box=>{deductions.querySelector(`[data-panel="${box.dataset.enable}"]`).hidden=!box.checked;});
      deductions.querySelector('[data-shared-label]').hidden=deductions.querySelector('[data-ded="elderType"]').value!=='shared';
      deductions.querySelector('[data-degree-panel]').hidden=!deductions.querySelector('[data-ded="degree"]').checked;
    };
    root.addEventListener('input', event => {if(event.target===get('wage')) autoBases();if(event.target.matches('[data-enable=rent], [data-enable=mortgage]') && event.target.checked){const other=event.target.dataset.enable==='rent'?'mortgage':'rent';deductions.querySelector(`[data-enable="${other}"]`).checked=false;}syncDeductionControls();update();});
    get('city').addEventListener('change',()=>{autoBases();deductions.querySelector('[data-ded="rentRate"]').value=get('city').value==='quanzhou'?'1100':'1500';update();});
    deductions.addEventListener('click',event=>{
      const add=event.target.closest('[data-add]'), remove=event.target.closest('[data-remove]');
      if(add){const kind=add.dataset.add, template=deductions.querySelector(kind==='medical'?'[data-medical-template]':'[data-child-template]');deductions.querySelector(`[data-panel="${kind}"] [data-rows]`).append(template.content.cloneNode(true));update();}
      if(remove){const rows=remove.closest('[data-rows]');if(rows.querySelectorAll('[data-row]').length>1){remove.closest('[data-row]').remove();update();}}
    });
    root.querySelector('[data-reset]').addEventListener('click',()=>{get('city').value='shanghai'; for(const [k,v] of Object.entries({salary:40,wage:40,bonus:120,sign:100,personal:12,employer:12}))get(k).value=v;get('method').value='separate';get('period').value='month'; const fresh=document.createElement('div');fresh.innerHTML=deductionsUI(zh);const replacement=fresh.firstElementChild;deductions.innerHTML=replacement.innerHTML;autoBases();syncDeductionControls();update();});
    autoBases();syncDeductionControls();update();
  }
  document.querySelectorAll('[data-salary-lab]').forEach(mount);
})();
