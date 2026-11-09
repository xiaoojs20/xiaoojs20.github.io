const WORDS = {
  zh: {
    title: '这辆车，值得自己买吗？', sub: '连续参数 · 年均全成本 · 同等出行需求',
    city: '城市示例', type: '动力类型', beijing: '北京', shanghai: '上海', quanzhou: '泉州', ev: '纯电', gas: '燃油',
    presetHint: '切换城市或动力将重置停车、油价、牌照、保养基准/间隔、车损险费率和车船税示例；其他参数保留。所有金额均为人民币。',
    price: '含税车价', priceUnit: '万元', years: '持有年限', yearsUnit: '年', km: '年出行里程', kmUnit: 'km/年', fare: '打车综合单价', fareUnit: '元/km',
    purchase: '购车、税费与残值', insurance: '保险、停车与日常持有', energy: '能源与里程损耗', finance: '资金与时间价值',
    taxMode: '购置税口径', taxAmount: '购置税额', policy2026: '2026–2027 新车政策', full: '全额购置税', custom: '手填税额',
    taxHint: '默认纯电车型须符合减免条件；其他购车年份、二手车或特殊计税情形请手填。',
    car: '自驾月均成本', taxi: '打车月均成本', threshold: '临界打车月消费', breakKm: '临界年出行里程',
    month: '元/月', distance: 'km/年', noCross: '范围内无交点', residual: '预计期末残值',
    carWins: '当前用量下，自驾每月少花', taxiWins: '当前用量下，打车每月少花', tie: '当前用量下，两者成本基本相同。',
    highKm: '临界点超过 6 万 km/年，已远高于常见私人用车情景；请把它当作数学外推。',
    noCrossHint: '在年出行里程 0–200,000 km 的模型范围内未找到交点；未对更高里程作判断。',
    timeHint: '已计入相对打车的时间价值，当前结果包含非现金成本。',
    chartKm: '月均成本随年出行里程变化', chartPrice: '月均成本随车价变化', chartYears: '月均成本随持有年限变化',
    axisKm: '年出行里程（km）', axisPrice: '车价（万元）', axisYears: '持有年限（年）', yAxis: '月均成本（元）',
    chartHint: '空心圆标当前自驾成本；紫点标两条成本线相等的交点。曲线由公式计算，输入值直接参与计算。',
    chartTable: '查看曲线采样数据', breakdown: '查看年度成本明细', assumption: '查看当前计算口径',
    row: '成本项目', amount: '元/年', total: '自驾合计',
    depreciation: '车辆折旧', acquisition: '税费、登记、充电桩与卖车费用摊销', plate: '牌照净损失摊销', capital: '资金占用及贷款利差',
    parking: '住宅、单位与外出停车', maintenance: '定期保养（按车价、时间与里程）', tyres: '轮胎消耗（按单价与寿命）', repairs: '维修风险准备金（按车价、车龄与里程）', taxesTolls: '车船税与通行费', time: '相对打车的时间成本',
    energyRow: '油费 / 电费', insuranceRow: '保险',
    assumptionText: '采用连续的年均经济预算。保险按各年续保时车值估算，非整年按使用期分摊；保养和轮胎使用可为小数的等效次数/消耗量，年均金额不是某年的实际账单。维修是风险准备金。残值已包含累计里程折旧，不另收里程折旧。贷款期近似等于持有期，本金均匀下降。系数均为可调整假设，未做车型级统计标定。',
    export: '导出参数与结果 CSV', share: '复制参数链接', reset: '恢复默认', copied: '参数链接已复制，可保存或分享。', copyFallback: '可复制下面的参数链接：',
    sharedLoaded: '已载入链接中的参数。', sharedError: '链接参数无效或版本不兼容，已使用默认值。',
    invalid: '请输入有效数值，范围：', stale: '参数未填完整，结果暂时隐藏。', failed: '计算器加载失败，请刷新重试；下文公式仍可阅读。',
    model: '模型版本', cashNote: '月均数值包含折旧和资金占用，并非每月实际扣款。',
    stepInputs: '1 · 设置用车与出行', stepCosts: '2 · 选择计入哪些成本', stepResults: '3 · 查看比较结果',
    costsHint: '勾选要计入的费用，再点“调整参数”填写金额。停车、保险和能源参数已展开；按里程计算的费用会标出算式，所有项目都可以修改或取消。',
    edit: '调整参数', close: '收起参数', included: '计入比较', excluded: '未计入',
    liveUpdate: '调整参数会自动更新三张图和交点。',
    detour: '自驾里程 / 打车里程', selectedCosts: '已计入成本', items: '项',
    insuranceHelp: '报价覆盖的是新车车损险分项，不含交强险和三者险，以每年自驾 1 万公里为参考。留 0 时按车价估算。首年用新车价，后续按续保时车值估算；非整年按使用期分摊。里程风险只是情景假设，实际报价还受车型、驾驶人和出险记录影响。',
    allEqual: '两种成本始终相同', allEqualHint: '当前勾选项与单价使两条成本曲线完全重合。',
    currentPoint: '当前用量', crossingPoint: '临界交点', both: '两者均为', inChart: '此图交点',
    electricityCost: '电费（随里程计算）', fuelCost: '油费（随里程计算）',
    mileageCost: '按当前自驾里程计算', annualBudget: '年度预算', annualized: '按持有期摊销',
    parkingBudget: '月度停车预算', electricityFormula: '年电费 = 自驾年里程 × 百公里电耗 ÷ 100 × 综合电价。',
    fuelFormula: '年油费 = 自驾年里程 × 百公里油耗 ÷ 100 × 油价。',
    blendedPrice: '家充与公充的加权综合电价', currentEstimate: '以下金额由当前里程计算，并非固定年费。',
    formulaHelp: '自动估算均使用可修改的假设系数；有实际单次报价或车型保养周期时，请优先覆盖。',
  },
  en: {
    title: 'What does owning this car cost?', sub: 'Continuous inputs · Annualized full cost · Equivalent travel demand',
    city: 'City example', type: 'Powertrain', beijing: 'Beijing', shanghai: 'Shanghai', quanzhou: 'Quanzhou', ev: 'Electric', gas: 'Petrol',
    presetHint: 'Changing city or powertrain resets parking, petrol, plate, service reference/interval, damage-insurance rate and annual tax examples; other inputs stay as entered. All amounts are in CNY.',
    price: 'VAT-inclusive price', priceUnit: 'CNY 10,000', years: 'Holding period', yearsUnit: 'years', km: 'Annual trip distance', kmUnit: 'km/year', fare: 'Effective taxi fare', fareUnit: 'CNY/km',
    purchase: 'Purchase, tax and resale', insurance: 'Insurance, parking and ownership', energy: 'Energy and mileage costs', finance: 'Capital and time value',
    taxMode: 'Purchase tax basis', taxAmount: 'Purchase tax amount', policy2026: '2026–2027 new-car policy', full: 'Full purchase tax', custom: 'Enter tax amount',
    taxHint: 'The EV default requires tax eligibility. Enter the actual tax for other purchase years, used cars or special tax arrangements.',
    car: 'Monthly ownership cost', taxi: 'Monthly taxi cost', threshold: 'Break-even taxi spending', breakKm: 'Break-even annual distance',
    month: 'CNY/month', distance: 'km/year', noCross: 'No crossing in range', residual: 'Estimated terminal resale',
    carWins: 'At this usage, driving saves per month:', taxiWins: 'At this usage, taxis save per month:', tie: 'At this usage, costs are approximately equal.',
    highKm: 'The crossing exceeds 60,000 km/year, well beyond typical private-car use. Treat it as mathematical extrapolation.',
    noCrossHint: 'No crossing was found within 0–200,000 annual trip kilometres. No conclusion is made beyond that model range.',
    timeHint: 'Relative travel-time value is included, so these totals contain non-cash costs.',
    chartKm: 'Monthly cost by annual trip distance', chartPrice: 'Monthly cost by car price', chartYears: 'Monthly cost by holding period',
    axisKm: 'Annual trip distance (km)', axisPrice: 'Car price (CNY 10,000)', axisYears: 'Holding period (years)', yAxis: 'Monthly cost (CNY)',
    chartHint: 'The hollow dot marks current driving cost; purple dots mark equal-cost crossings. Curves are evaluated from the model using your exact inputs.',
    chartTable: 'View sampled curve data', breakdown: 'View annual cost breakdown', assumption: 'View calculation assumptions',
    row: 'Cost item', amount: 'CNY/year', total: 'Ownership total',
    depreciation: 'Vehicle depreciation', acquisition: 'Annualized tax, registration, charger and selling fees', plate: 'Annualized net plate loss', capital: 'Capital cost and loan-rate adjustment',
    parking: 'Home, work and other parking', maintenance: 'Scheduled service (price, age and distance)', tyres: 'Tyre consumption (unit price and life)', repairs: 'Repair allowance (price, age and distance)', taxesTolls: 'Vehicle tax and tolls', time: 'Time cost relative to taxis',
    energyRow: 'Fuel / electricity', insuranceRow: 'Insurance',
    assumptionText: 'A continuous annualized economic budget. Insurance uses value at annual renewal, with partial years allocated pro rata. Service and tyres use fractional equivalent visits/consumption, not a particular year’s bills. Repairs are a risk allowance. Resale includes cumulative mileage; no separate mileage depreciation is charged. Loan term approximates the holding period with uniformly declining principal. Coefficients are editable assumptions without vehicle-level statistical calibration.',
    export: 'Export inputs & results CSV', share: 'Copy parameter link', reset: 'Reset defaults', copied: 'Parameter link copied. Save or share it.', copyFallback: 'Copy the parameter link below:',
    sharedLoaded: 'Parameters loaded from the link.', sharedError: 'Invalid or incompatible link parameters; defaults restored.',
    invalid: 'Enter a valid number in this range:', stale: 'Complete the inputs to show updated results.', failed: 'The calculator could not load. Refresh to try again; the formulas below remain available.',
    model: 'Model version', cashNote: 'Monthly figures include depreciation and capital cost; they are not monthly cash payments.',
    stepInputs: '1 · Set the car and travel demand', stepCosts: '2 · Choose the costs to include', stepResults: '3 · Compare the results',
    costsHint: 'Select each cost to include, then edit its parameters. Parking, insurance and energy start expanded. Distance-based costs show their calculation. Every item can be changed or excluded.',
    edit: 'Edit parameters', close: 'Hide parameters', included: 'Include', excluded: 'Excluded',
    liveUpdate: 'Adjust any input to update all three charts and their crossings.',
    detour: 'Driving distance / taxi distance', selectedCosts: 'Costs included', items: 'items',
    insuranceHelp: 'The quote overrides new-car damage coverage only, excluding compulsory and liability cover, at a reference 10,000 driving km/year. Enter 0 to estimate from price. Year one uses new-car value; renewals use value at each policy start. Partial years are allocated pro rata. Mileage risk is a scenario assumption; model, driver and claims also affect quotes.',
    allEqual: 'Costs coincide throughout', allEqualHint: 'The selected costs and fare make both cost curves identical.',
    currentPoint: 'Current usage', crossingPoint: 'Break-even', both: 'Both cost', inChart: 'Crossing in this chart',
    electricityCost: 'Electricity (distance-based)', fuelCost: 'Petrol (distance-based)',
    mileageCost: 'Calculated from current driving distance', annualBudget: 'Annual budget', annualized: 'Annualized over the holding period',
    parkingBudget: 'Monthly parking budget', electricityFormula: 'Annual electricity cost = annual driving distance × kWh/100 km ÷ 100 × effective electricity price.',
    fuelFormula: 'Annual petrol cost = annual driving distance × L/100 km ÷ 100 × petrol price.',
    blendedPrice: 'Weighted home/public charging price', currentEstimate: 'Amounts below are calculated from current distance, not fixed annual fees.',
    formulaHelp: 'Automatic estimates use editable assumption coefficients. Prefer actual unit quotes and the vehicle’s service schedule when available.',
  },
};

// [key, 中文标签, English label, unit, step]. Numeric entries accept arbitrary decimals.
const GROUPS = {
  purchase: [
    ['customTax', '手填购置税', 'Manual purchase tax', 'CNY', 100],
    ['registration', '登记与上牌手续费', 'Registration fees', 'CNY', 100],
    ['charger', '家用充电桩投入（纯电）', 'Charger installation (EV)', 'CNY', 100],
    ['saleFee', '卖车费用 / 残值', 'Selling fee / resale value', '%', .1],
    ['residualFactor', '车龄保值率校准倍率', 'Age-retention calibration', '%', 1],
    ['luxuryDecay', '高价额外折旧系数 λ', 'Extra luxury depreciation λ', '%', .1],
    ['mileageDepreciation', '每累计 1 万公里的残值衰减系数 γ', 'Resale decay per cumulative 10,000 km γ', '%', .1],
    ['plate', '牌照 / 额度投入', 'Plate / quota outlay', 'CNY', 1000],
    ['plateRecovery', '牌照期末回收比例', 'Plate recovery at sale', '%', 1],
  ],
  insurance: [
    ['compulsoryPremium', '交强险实际年保费', 'Annual compulsory premium quote', 'CNY/year', 10],
    ['liabilityCoverage', '商业三者险保额', 'Third-party liability coverage', 'CNY', 100000],
    ['liabilityRate', '三者险保额费率（估算）', 'Liability coverage rate (assumption)', '%/year', .001],
    ['damageRate', '新车车损险费率（估算）', 'New-car damage rate (assumption)', '%/year', .1],
    ['damageQuote', '新车车损险分项报价（0＝车价估算）', 'New-car damage premium quote (0 = formula)', 'CNY/year', 100],
    ['insuranceMileageRisk', '每年多行驶 1 万公里的商业险风险增量', 'Commercial risk increase per annual 10,000 km', '%', 1],
    ['insuranceFactor', '保险校准倍率 / 出险影响', 'Insurance calibration / claims factor', '%', 1],
    ['homeParking', '住宅停车', 'Home parking', 'CNY/month', 10],
    ['workParking', '单位停车', 'Work parking', 'CNY/month', 10],
    ['otherParking', '外出停车', 'Other parking', 'CNY/month', 10],
  ],
  maintenance: [
    ['serviceBase', '25 万元基准车的单次保养费用', 'Service cost at CNY 250,000 reference price', 'CNY/service', 50],
    ['serviceQuote', '实际单次保养报价（0＝按车价估算）', 'Actual service quote (0 = price formula)', 'CNY/service', 50],
    ['servicePriceExponent', '保养费用随车价增长的指数 α', 'Service price exponent α', '', .1],
    ['serviceKm', '保养里程间隔', 'Service distance interval', 'km', 1000],
    ['serviceYears', '保养时间间隔', 'Service time interval', 'years', .1],
    ['serviceAgeRate', '每增一车龄年的保养费用增量', 'Service cost increase per age-year', '%/year', 1],
  ],
  tyres: [
    ['tyreBase', '25 万元基准车的单条轮胎价格', 'Single-tyre price at CNY 250,000 reference', 'CNY/tyre', 50],
    ['tyreQuote', '实际单条轮胎报价（0＝按车价估算）', 'Actual single-tyre quote (0 = price formula)', 'CNY/tyre', 50],
    ['tyrePriceExponent', '轮胎价格随车价增长的指数 β', 'Tyre price exponent β', '', .1],
    ['tyreKm', '一套轮胎的预计使用里程', 'Expected tyre-set mileage life', 'km', 1000],
    ['tyreYears', '一套轮胎的预计使用年限', 'Expected tyre-set age life', 'years', .5],
  ],
  repairs: [
    ['repairRate', '过保基础维修准备金 / 车价', 'Base post-warranty repair allowance / price', '%/year', .1],
    ['warrantyYears', '整车质保参考年限', 'Reference vehicle warranty', 'years', .5],
    ['warrantyCoverage', '质保期内的准备金减免比例', 'Allowance reduction during warranty', '%', 5],
    ['repairAgeRate', '过保后每增一年的风险增量', 'Risk increase per year beyond warranty', '%/year', 5],
    ['repairMileageRisk', '每年多行驶 1 万公里的风险增量', 'Risk increase per annual 10,000 km', '%', 5],
  ],
  road: [
    ['annualTax', '按当地规则填写车船税年税额', 'Annual vehicle tax under local rules', 'CNY/year', 10],
    ['tollShare', '自驾相对打车增加的收费道路里程占比', 'Extra tolled distance share versus taxis', '%', 5],
    ['tollRate', '收费道路单价', 'Toll per charged kilometre', 'CNY/km', .1],
  ],
  energy: [
    ['petrol', '汽油综合单价', 'Petrol price', 'CNY/L', .01],
    ['fuelUse', '燃油车百公里油耗', 'Petrol consumption', 'L/100 km', .1],
    ['electricityUse', '纯电车百公里电耗', 'EV consumption', 'kWh/100 km', .1],
    ['homeElectricity', '家充到车端综合电价', 'Effective home electricity price', 'CNY/kWh', .01],
    ['publicElectricity', '公充到车端综合电价', 'Effective public charging price', 'CNY/kWh', .01],
    ['homeShare', '家充电量比例', 'Home charging share', '%', 1],
    ['detour', '自驾里程 / 打车里程 a', 'Driving distance / taxi distance a', '×', .01],
  ],
  finance: [
    ['opportunityRate', '资金机会成本率 i', 'Opportunity cost rate i', '%/year', .1],
    ['loanShare', '车价贷款比例 L', 'Financed share of car price L', '%', 1],
    ['loanRate', '贷款年利率 j', 'Annual loan rate j', '%/year', .1],
    ['timeValue', '时间价值', 'Value of time', 'CNY/hour', 10],
    ['extraMinutes', '自驾相对打车多花时间（可为负）', 'Extra driving time vs taxi (may be negative)', 'min/km', .1],
  ],
};
const COST_FIELDS = {
  parking: ['homeParking', 'workParking', 'otherParking'],
  insurance: ['compulsoryPremium', 'liabilityCoverage', 'liabilityRate', 'damageRate', 'damageQuote', 'insuranceMileageRisk', 'insuranceFactor'],
  energy: ['petrol', 'fuelUse', 'electricityUse', 'homeElectricity', 'publicElectricity', 'homeShare'],
  maintenance: ['serviceBase', 'serviceQuote', 'servicePriceExponent', 'serviceKm', 'serviceYears', 'serviceAgeRate'],
  tyres: ['tyreBase', 'tyreQuote', 'tyrePriceExponent', 'tyreKm', 'tyreYears'],
  repairs: ['repairRate', 'warrantyYears', 'warrantyCoverage', 'repairAgeRate', 'repairMileageRisk'],
  taxesTolls: ['annualTax', 'tollShare', 'tollRate'],
  acquisition: ['customTax', 'registration', 'charger', 'saleFee'],
  plate: ['plate', 'plateRecovery'], depreciation: ['residualFactor', 'luxuryDecay', 'mileageDepreciation'],
  capital: ['opportunityRate', 'loanShare', 'loanRate'], time: ['timeValue', 'extraMinutes'],
};

async function mount(root, index) {
  const zh = root.dataset.language === 'zh', t = WORDS[zh ? 'zh' : 'en'];
  const { DEFAULTS, BOUNDS, MODEL_VERSION, REFERENCE_PRICE, calculate, preset, restoreState } = await import(root.dataset.modelUrl);
  let p = { ...DEFAULTS }, result, curveRows = [], initialStatus = '';
  const charts = {
    km: { title: t.chartKm, label: t.axisKm },
    price: { title: t.chartPrice, label: t.axisPrice },
    years: { title: t.chartYears, label: t.axisYears },
  };
  if (location.hash.startsWith('#ct=')) {
    try { p = restoreState(JSON.parse(decodeURIComponent(location.hash.slice(4)))); initialStatus = t.sharedLoaded; }
    catch { initialStatus = t.sharedError; }
  }
  const id = key => `car-lab-${index}-${key}`;
  const fmt = (n, digits = 0) => new Intl.NumberFormat(zh ? 'zh-CN' : 'en-US', { maximumFractionDigits: digits }).format(n);
  const unit = text => zh ? text.replace('CNY/year²', '元/年²').replace('CNY/year', '元/年').replace('CNY/month', '元/月').replace('CNY/hour', '元/小时').replace('CNY/service', '元/次').replace('CNY/tyre', '元/条').replace('CNY', '元').replace('km/year', 'km/年').replace('%/year', '%/年').replace('years', '年') : text;
  const field = (key, label, suffix, range = null) => {
    const scale = key === 'price' ? 10000 : 1;
    const [min, max] = BOUNDS[key].map(n => n / scale);
    return `<div data-field-wrap="${key}"><label for="${id(key)}">${label} <span class="lab-unit">${suffix}</span></label>
      <input id="${id(key)}" name="${key}" type="number" step="any" min="${min}" max="${max}" value="${p[key] / scale}" data-field="${key}" data-scale="${scale}" aria-describedby="${id('error')}">
      ${range ? `<input type="range" min="${min}" max="${max}" step="${range}" value="${p[key] / scale}" data-range="${key}" aria-label="${label} (${suffix})">` : ''}</div>`;
  };
  const select = (key, label, values) => `<label for="${id(key)}">${label}<select id="${id(key)}" data-select="${key}">${values.map(value => `<option value="${value}"${p[key] === value ? ' selected' : ''}>${t[value]}</option>`).join('')}</select></label>`;
  const rowLabel = key => key === 'energy' ? (p.type === 'ev' ? t.electricityCost : t.fuelCost) : key === 'insurance' ? t.insuranceRow : t[key];
  const fieldDefinitions = Object.fromEntries(Object.values(GROUPS).flat().map(definition => [definition[0], definition]));
  const costOptions = Object.entries(COST_FIELDS).map(([key, fields]) => {
    const open = ['parking', 'insurance', 'energy'].includes(key);
    return `<section class="lab-cost-option" data-cost-option="${key}"><div class="lab-cost-option-heading">
      <label for="${id('cost-' + key)}"><input id="${id('cost-' + key)}" type="checkbox" data-cost="${key}" ${p.costs[key] ? 'checked' : ''}><span data-cost-title="${key}">${rowLabel(key)}</span></label>
      <button type="button" data-edit-cost="${key}" aria-expanded="${open}" aria-controls="${id('fields-' + key)}">${open ? t.close : t.edit}</button></div>
      <p class="lab-cost-estimate" data-cost-estimate="${key}"></p>${key === 'energy' ? '<p class="lab-hint" data-energy-explanation></p>' : `<p class="lab-hint" data-cost-explanation="${key}"></p>`}<div id="${id('fields-' + key)}" data-cost-fields="${key}" ${open ? '' : 'hidden'}>
      ${key === 'acquisition' ? `<div class="lab-presets">${select('taxMode', t.taxMode, ['policy2026', 'full', 'custom'])}</div><p class="lab-hint">${t.taxHint}</p>` : ''}
      <div class="lab-fields">${fields.map(fieldKey => { const [k, cn, en, u] = fieldDefinitions[fieldKey]; return field(k, zh ? cn : en, unit(u)); }).join('')}</div>
      ${key === 'insurance' ? `<p class="lab-hint">${t.insuranceHelp}</p>` : ''}</div></section>`;
  }).join('');
  root.innerHTML = `<p class="lab-eyebrow">THE COST OF MOBILITY</p><h3 class="lab-title">${t.title}</h3><p class="lab-subtitle">${t.sub}</p>
    <p class="lab-step">${t.stepInputs}</p>
    <div class="lab-presets">${select('city', t.city, ['beijing', 'shanghai', 'quanzhou'])}${select('type', t.type, ['ev', 'gas'])}</div>
    <p class="lab-hint">${t.presetHint}</p>
    <div class="lab-main-inputs">${field('price', t.price, t.priceUnit, .1)}${field('years', t.years, t.yearsUnit, .1)}${field('km', t.km, t.kmUnit, 100)}${field('fare', t.fare, t.fareUnit)}</div>
    <div class="lab-detour">${field('detour', t.detour, '×')}</div>
    <p class="lab-step">${t.stepCosts}</p><p class="lab-hint">${t.costsHint}</p><p class="lab-hint">${t.formulaHelp}</p>
    <div class="lab-cost-options">${costOptions}</div>
    <details><summary>${t.assumption}</summary><p class="lab-hint">${t.assumptionText}</p><p class="lab-hint">${t.model} ${MODEL_VERSION}</p></details>
    <p class="lab-error" id="${id('error')}" role="alert"></p>
    <div class="lab-actions"><button type="button" data-reset>${t.reset}</button><p class="lab-hint">${t.liveUpdate}</p></div><p class="lab-status" data-ready role="status"></p>
    <div class="lab-results" hidden><p class="lab-step">${t.stepResults}</p><p class="lab-hint" data-included></p><div class="lab-kpis">${['car', 'taxi', 'threshold', 'breakKm'].map((key, i) => `<div class="lab-kpi${i === 2 ? ' lab-kpi--primary' : ''}"><span>${t[key]}</span><strong data-output="${key}"></strong><span>${key === 'breakKm' ? t.distance : t.month}</span></div>`).join('')}</div>
    <p class="lab-verdict" data-verdict aria-live="polite"></p><p class="lab-hint">${t.cashNote}</p><div class="lab-warnings" data-warnings></div>
    ${Object.entries(charts).map(([axis, chart]) => `
    <section class="lab-chart" data-chart-panel="${axis}" aria-labelledby="${id(`heading-${axis}`)}">
      <p class="lab-chart-heading" id="${id(`heading-${axis}`)}"><strong>${chart.title}</strong></p><div data-chart></div>
      <div class="lab-legend"><span><i></i>${t.car}</span><span><i class="lab-taxi-key"></i>${t.taxi}</span><span><i class="lab-current-key"></i>${t.currentPoint}</span><span><i class="lab-crossing-key"></i>${t.crossingPoint}</span></div>
      <div class="lab-chart-values" data-chart-values></div><p class="lab-hint">${t.chartHint}</p>
      <details><summary>${t.chartTable}</summary><div class="lab-table-wrap" data-samples></div></details>
    </section>`).join('')}
    <details><summary>${t.breakdown}</summary><div class="lab-table-wrap" data-breakdown></div><p class="lab-hint" data-residual></p></details>
    <div class="lab-actions"><button type="button" data-export>${t.export}</button><button type="button" data-share>${t.share}</button></div><p class="lab-status" data-status role="status"></p><p class="lab-share-url" data-share-url hidden></p></div>`;
  const $ = selector => root.querySelector(selector);
  const chartPanels = root.querySelectorAll('[data-chart-panel]');
  if (initialStatus === t.sharedLoaded) $('[data-status]').textContent = initialStatus;
  const inputUnits = { ...Object.fromEntries(Object.values(GROUPS).flat().map(([key, , , u]) => [key, u])),
    price: 'CNY', years: 'years', km: 'km/year', fare: 'CNY/km' };

  function read() {
    let invalid = null;
    for (const input of root.querySelectorAll('[data-field]')) {
      if (input.disabled) continue;
      const value = input.valueAsNumber * Number(input.dataset.scale);
      const [min, max] = BOUNDS[input.dataset.field];
      const valid = input.value.trim() !== '' && Number.isFinite(value) && value >= min && value <= max;
      input.setAttribute('aria-invalid', String(!valid));
      if (!valid && !invalid) invalid = { input, min, max };
      if (valid) p[input.dataset.field] = value;
    }
    if (invalid) $('.lab-results').hidden = true;
    if (invalid) {
      const scale = Number(invalid.input.dataset.scale);
      const label = root.querySelector(`label[for="${invalid.input.id}"]`).textContent;
      $(`#${id('error')}`).textContent = `${label} — ${t.invalid} ${fmt(invalid.min / scale, 4)}–${fmt(invalid.max / scale, 4)}. ${t.stale}`;
      return false;
    }
    $(`#${id('error')}`).textContent = '';
    return true;
  }

  function sync(onlyCosts = false) {
    if (!onlyCosts) {
      for (const input of root.querySelectorAll('[data-field]')) input.value = p[input.dataset.field] / Number(input.dataset.scale);
      for (const input of root.querySelectorAll('[data-range]')) input.value = p[input.dataset.range] / (input.dataset.range === 'price' ? 10000 : 1);
      for (const input of root.querySelectorAll('[data-select]')) input.value = p[input.dataset.select];
    }
    for (const input of root.querySelectorAll('[data-cost]')) input.checked = p.costs[input.dataset.cost];
    for (const option of root.querySelectorAll('[data-cost-option]')) {
      const enabled = p.costs[option.dataset.costOption];
      option.classList.toggle('lab-cost-option--excluded', !enabled);
      for (const input of option.querySelectorAll('[data-field], [data-select]')) input.disabled = !enabled;
    }
    for (const key of ['petrol', 'fuelUse', 'electricityUse', 'homeElectricity', 'publicElectricity', 'homeShare']) {
      const applicable = p.type === 'gas' ? ['petrol', 'fuelUse'].includes(key) : !['petrol', 'fuelUse'].includes(key);
      $(`[data-field-wrap="${key}"]`).hidden = !applicable;
      $(`[data-field="${key}"]`).disabled = !p.costs.energy || !applicable;
    }
    $('[data-cost-title="energy"]').textContent = rowLabel('energy');
  }

  function draw(panel) {
    const axis = panel.dataset.chartPanel;
    const { title, label: axisLabel } = charts[axis];
    const titleId = id(`chart-title-${axis}`);
    const descriptionId = id(`chart-description-${axis}`);
    const niceStep = (span, count = 5) => {
      const raw = Math.max(span, 1e-9) / count;
      const magnitude = 10 ** Math.floor(Math.log10(raw));
      const fraction = raw / magnitude;
      return (fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10) * magnitude;
    };
    const maxKm = Math.min(200000, Math.max(15000, p.km * 1.25,
      result.breakKm !== null && result.breakKm <= 60000 ? result.breakKm * 1.5 : 0));
    let [lo, hi] = axis === 'km' ? [0, maxKm] : axis === 'price' ? [10000, Math.min(2000000, Math.max(1000000, p.price * 1.2))] : [.5, 10];
    const xStep = niceStep(hi - lo);
    if (axis === 'km') hi = Math.min(200000, Math.ceil(hi / xStep) * xStep);
    const scale = axis === 'price' ? 10000 : 1;
    const evaluate = x => {
      const r = axis === 'km' ? result : calculate({ ...p, [axis]: x }, { solveCrossings: false });
      return { x, car: (axis === 'km' ? r.carAt(x) : r.car) / 12, taxi: (axis === 'km' ? r.taxiAt(x) : r.taxi) / 12 };
    };
    const xs = Array.from({ length: 81 }, (_, i) => lo + (hi - lo) * i / 80);
    xs.push(p[axis]);
    const crossings = [];
    if (axis === 'km') {
      if (result.breakKm !== null && result.breakKm >= lo && result.breakKm <= hi) crossings.push(result.breakKm);
      for (const pivot of [p.serviceKm / p.serviceYears / p.detour, p.tyreKm / p.tyreYears / p.detour]) {
        if (pivot >= lo && pivot <= hi) xs.push(pivot);
      }
    } else if (!result.identical) {
      // The mileage chart uses the model's crossing. Bisect each bracket for price and age.
      for (let n = 1; n <= 80; n++) {
        let left = lo + (hi - lo) * (n - 1) / 80, right = lo + (hi - lo) * n / 80;
        const difference = x => { const s = evaluate(x); return s.car - s.taxi; };
        let dLeft = difference(left);
        const dRight = difference(right);
        if (dLeft * dRight > 0 || (dLeft === 0 && dRight === 0)) continue;
        for (let j = 0; j < 50; j++) {
          const middle = (left + right) / 2, dMiddle = difference(middle);
          if (dLeft * dMiddle <= 0) { right = middle; }
          else { left = middle; dLeft = dMiddle; }
        }
        const crossing = (left + right) / 2;
        if (!crossings.some(x => Math.abs(x - crossing) < 1e-6)) crossings.push(crossing);
      }
    }
    xs.push(...crossings);
    const samples = [...new Set(xs)].sort((a, b) => a - b).map(evaluate);
    const ys = samples.flatMap(point => [point.car, point.taxi]);
    const low = Math.min(0, ...ys), high = Math.max(1, ...ys);
    const yStep = niceStep((high - low) * 1.08, 6);
    const yMin = Math.floor(low / yStep) * yStep, yMax = Math.ceil(high * 1.08 / yStep) * yStep;
    const X = x => 63 + (x - lo) / (hi - lo) * 527;
    const Y = y => 230 - (y - yMin) / (yMax - yMin) * 190;
    const valueUnit = axis === 'km' ? t.distance : axis === 'price' ? t.priceUnit : t.yearsUnit;
    const xDigits = axis === 'years' ? 2 : axis === 'price' ? 4 : 0;
    const xText = x => `${fmt(x / scale, xDigits)} ${valueUnit}`;
    const path = key => samples.map((s, i) => `${i ? 'L' : 'M'}${X(s.x).toFixed(2)},${Y(s[key]).toFixed(2)}`).join(' ');
    const yTicks = Array.from({ length: Math.round((yMax - yMin) / yStep) + 1 }, (_, i) => yMin + i * yStep);
    const xTicks = [...new Set([lo, ...Array.from({ length: Math.ceil((hi - lo) / xStep) + 1 }, (_, i) => Math.ceil(lo / xStep) * xStep + i * xStep).filter(x => x > lo && x < hi), hi])];
    const grid = yTicks.map(y => `<line class="lab-grid" x1="63" x2="590" y1="${Y(y)}" y2="${Y(y)}"/><text x="56" y="${Y(y) + 4}" text-anchor="end">${fmt(y, yStep < 1 ? 2 : 0)}</text>`).join('')
      + xTicks.map(x => `<text x="${X(x)}" y="250" text-anchor="${x === hi ? 'end' : x === lo ? 'start' : 'middle'}">${fmt(x / scale, axis === 'years' ? 1 : 0)}</text>`).join('');
    const markers = crossings.map(x => {
      const s = evaluate(x), label = `${axis === 'km' ? t.crossingPoint : t.inChart}: ${xText(x)} · ${t.both} ¥${fmt(s.car)} / ${zh ? '月' : 'month'}`;
      const anchor = X(x) > 480 ? 'end' : 'start', offset = anchor === 'end' ? -9 : 9;
      return `<line class="lab-marker lab-marker--crossing" data-crossing-x="${x}" x1="${X(x)}" x2="${X(x)}" y1="40" y2="230"/><circle class="lab-point lab-point--crossing" data-crossing-car="${s.car}" data-crossing-taxi="${s.taxi}" cx="${X(x)}" cy="${Y(s.car)}" r="5"><title>${label}</title></circle><text class="lab-crossing-label" x="${X(x) + offset}" y="${Math.max(52, Y(s.car) - 10)}" text-anchor="${anchor}">${t.crossingPoint}</text>`;
    }).join('');
    panel.querySelector('[data-chart]').innerHTML = `<svg viewBox="0 0 610 287" role="img" aria-labelledby="${titleId} ${descriptionId}"><title id="${titleId}">${title}</title><desc id="${descriptionId}">${axisLabel}. ${t.yAxis}. ${t.chartHint}</desc>${grid}<text x="63" y="15">${t.yAxis}</text><path class="lab-line lab-line--car" d="${path('car')}"/><path class="lab-line lab-line--taxi" d="${path('taxi')}"/><line class="lab-marker" x1="${X(p[axis])}" x2="${X(p[axis])}" y1="40" y2="230"/><circle class="lab-point" cx="${X(p[axis])}" cy="${Y(result.car / 12)}" r="4"><title>${t.currentPoint}: ${xText(p[axis])}, ${t.car} ¥${fmt(result.car / 12)}</title></circle>${markers}<text x="326" y="279" text-anchor="middle">${axisLabel}</text></svg>`;
    const descriptions = [`${t.currentPoint}: ${xText(p[axis])} · ${t.car} ¥${fmt(result.car / 12)}, ${t.taxi} ¥${fmt(result.taxi / 12)} / ${zh ? '月' : 'month'}`,
      ...crossings.map(x => `${axis === 'km' ? t.crossingPoint : t.inChart}: ${xText(x)} · ${t.both} ¥${fmt(evaluate(x).car)} / ${zh ? '月' : 'month'}`)];
    panel.querySelector('[data-chart-values]').replaceChildren(...descriptions.map((text, i) => { const el = document.createElement('p'); el.textContent = text; if (i) el.className = 'lab-crossing-value'; return el; }));
    const tableXs = [...new Set([...Array.from({ length: 5 }, (_, i) => lo + (hi - lo) * i / 4), p[axis], ...crossings])].sort((a, b) => a - b);
    panel.querySelector('[data-samples]').innerHTML = `<table><thead><tr><th>${axisLabel}</th><th>${t.car}</th><th>${t.taxi}</th></tr></thead><tbody>${tableXs.map(x => { const s = evaluate(x); return `<tr><td>${fmt(x / scale, xDigits)}${crossings.includes(x) ? ` (${t.crossingPoint})` : ''}</td><td>${fmt(s.car)}</td><td>${fmt(s.taxi)}</td></tr>`; }).join('')}</tbody></table>`;
    return samples.flatMap(sample => [
      ['curve', `${axis}=${sample.x};car`, sample.car, 'CNY/month'],
      ['curve', `${axis}=${sample.x};taxi`, sample.taxi, 'CNY/month'],
    ]);
  }

  function update() {
    if (!read()) return;
    result = calculate(p);
    const actualKm = p.detour * p.km;
    for (const [key, value] of Object.entries(result.rows)) {
      let summary = t.excluded;
      if (p.costs[key]) {
        const annual = `¥${fmt(value, 2)} / ${zh ? '年' : 'year'}`;
        const monthly = `¥${fmt(value / 12, 2)} / ${zh ? '月' : 'month'}`;
        if (key === 'energy') {
          summary = `${t.mileageCost}: ${fmt(actualKm, 2)} km × ¥${fmt(result.energy, 5)}/km = ${annual} (${monthly})`;
        } else if (key === 'maintenance') {
          summary = `¥${fmt(result.serviceUnit, 2)} × ${fmt(result.serviceCount, 3)} × ${fmt(1 + p.serviceAgeRate / 100 * p.years / 2, 3)} ÷ ${fmt(p.years, 2)} = ${annual}`;
        } else if (key === 'tyres') {
          summary = `4 × ¥${fmt(result.tyreUnit, 2)} × ${fmt(result.tyreSets, 3)} ÷ ${fmt(p.years, 2)} = ${annual}`;
        } else if (key === 'depreciation') {
          summary = `(¥${fmt(p.price)} − ¥${fmt(result.resale, 2)}) ÷ ${fmt(p.years, 2)} = ${annual}`;
        } else if (key === 'repairs') {
          summary = `¥${fmt(p.price)} × ${fmt(p.repairRate, 3)}% × ${fmt(result.repairAgeExposure, 3)} × ${fmt(1 + p.repairMileageRisk / 100 * actualKm / 10000, 3)} = ${annual}`;
        } else if (key === 'insurance') {
          summary = `${zh ? '按各年续保车值加权计算' : 'From weighted annual renewal values'}: ${annual} (${monthly})`;
        } else if (key === 'taxesTolls') {
          summary = `¥${fmt(p.annualTax, 2)} + ${fmt(actualKm)} km × ${fmt(p.tollShare, 2)}% × ¥${fmt(p.tollRate, 2)}/km = ${annual}`;
        } else if (key === 'capital') {
          summary = `${zh ? '按投入、期末回收与利率计算' : 'From outlay, terminal recovery and interest rates'}: ${annual} (${monthly})`;
        } else if (key === 'time') {
          summary = `${t.mileageCost}: ${fmt(p.km * p.extraMinutes / 60, 2)} h × ¥${fmt(p.timeValue, 2)}/h = ${annual}`;
        } else if (key === 'parking') summary = `${t.parkingBudget}: ${monthly} (${annual})`;
        else if (['acquisition', 'plate'].includes(key)) summary = `${t.annualized}: ${annual} (${monthly})`;
        else summary = `${t.annualBudget}: ${annual} (${monthly})`;
      }
      $(`[data-cost-estimate="${key}"]`).textContent = summary;
    }
    const serviceUnitRule = p.serviceQuote > 0 ? `${zh ? '使用实际单次报价' : 'Actual service quote'} ¥${fmt(p.serviceQuote, 2)}`
      : `¥${fmt(p.serviceBase, 2)} × (${fmt(p.price)} / ${fmt(REFERENCE_PRICE)})^${fmt(p.servicePriceExponent, 2)}`;
    const tyreUnitRule = p.tyreQuote > 0 ? `${zh ? '使用实际单胎报价' : 'Actual single-tyre quote'} ¥${fmt(p.tyreQuote, 2)}`
      : `¥${fmt(p.tyreBase, 2)} × (${fmt(p.price)} / ${fmt(REFERENCE_PRICE)})^${fmt(p.tyrePriceExponent, 2)}`;
    const explanations = zh ? {
      parking: '按所在地与车位报价填写，年费为三类月费合计 × 12；不强行随车价变化。',
      insurance: `续保时点的加权车值 ¥${fmt(result.insuranceMeanValue, 2)}。年均保费 = [${fmt(p.compulsoryPremium, 2)} + (${fmt(result.liability, 2)} + ${fmt(result.damageNew, 2)} × ${fmt(result.insuranceMeanValue / p.price, 5)}) × ${fmt(result.insuranceUsage, 4)}] × ${fmt(p.insuranceFactor / 100, 3)}。里程系数并非保险公司的实际计费规则。`,
      maintenance: `单次费用 = ${serviceUnitRule}；等效次数 = max(${fmt(p.years, 2)} 年 / ${fmt(p.serviceYears, 2)} 年, ${fmt(result.totalKm)} km / ${fmt(p.serviceKm)} km)。再乘车龄费用系数，按持有期摊销。`,
      tyres: `单胎价格 = ${tyreUnitRule}；等效耗用套数 = max(${fmt(result.totalKm)} / ${fmt(p.tyreKm)} km, ${fmt(p.years, 2)} / ${fmt(p.tyreYears, 2)} 年)。这是维持基准轮胎状态的连续耗用预算，不是实际换胎账单；未另加初装轮胎购置费。`,
      repairs: `基础比例 × 车价，再按质保覆盖、过保时间和实际年里程调整；风险准备金不表示一定会发生同额维修。`,
      taxesTolls: `年通行费 = ${fmt(actualKm)} km × ${fmt(p.tollShare)}% × ${fmt(p.tollRate, 2)} 元/km，再加当地规则确定的车船税 ${fmt(p.annualTax, 2)} 元。`,
      acquisition: `购置税 ${fmt(result.tax, 2)}、登记费、纯电充电桩及残值 × 卖车费用率合计，除以持有年限。`,
      plate: '净牌照损失 = 投入 × (1 − 回收比例)，按持有期摊销；资金占用在资金成本中计算。',
      depreciation: `持有 ${fmt(p.years, 2)} 年，累计自驾 ${fmt(result.totalKm)} km。期末残值同时计入车龄、车价与累计里程；不再另收里程折旧。校准值 100% 为基准，调高会提高保值率（采用幂变换），0 表示残值为 0。`,
      capital: '按初期投入与期末可回收金额的平均值估算资金占用，加贷款利差；残值随车龄与里程重新计算。',
      time: '相对打车的每公里时间差 × 出行里程 × 时间价值，允许自驾节省时间时出现负值。',
    } : {
      parking: 'Local space quotes: sum the monthly amounts and multiply by 12. Car price does not determine parking rent.',
      insurance: `Weighted renewal value: ¥${fmt(result.insuranceMeanValue, 2)}. Annual premium = [${fmt(p.compulsoryPremium, 2)} + (${fmt(result.liability, 2)} + ${fmt(result.damageNew, 2)} × ${fmt(result.insuranceMeanValue / p.price, 5)}) × ${fmt(result.insuranceUsage, 4)}] × ${fmt(p.insuranceFactor / 100, 3)}. Mileage exposure is a scenario assumption, not an insurer tariff.`,
      maintenance: `Unit cost = ${serviceUnitRule}. Equivalent visits = max(${fmt(p.years, 2)} / ${fmt(p.serviceYears, 2)} years, ${fmt(result.totalKm)} / ${fmt(p.serviceKm)} km). Apply the age factor and annualize.`,
      tyres: `Unit price = ${tyreUnitRule}. Equivalent sets = max(${fmt(result.totalKm)} / ${fmt(p.tyreKm)} km, ${fmt(p.years, 2)} / ${fmt(p.tyreYears, 2)} years). A continuous allowance for maintaining reference tyre condition, not a replacement invoice. No separate initial-tyre purchase charge is added.`,
      repairs: 'A base share of car price adjusted for warranty cover, years out of warranty and annual distance. This risk allowance is not a predicted repair bill.',
      taxesTolls: `Annual tolls = ${fmt(actualKm)} km × ${fmt(p.tollShare)}% × ${fmt(p.tollRate, 2)} CNY/km, plus locally determined vehicle tax of CNY ${fmt(p.annualTax, 2)}.`,
      acquisition: 'Annualize purchase tax, registration, EV charger and the selling fee based on terminal resale.',
      plate: 'Annualize outlay × (1 − recovery share). Capital tied up is counted under capital cost.',
      depreciation: `${fmt(p.years, 2)} years and ${fmt(result.totalKm)} cumulative driving kilometres. Resale includes age, price and distance, without extra mileage depreciation. Calibration 100% is the baseline; higher values improve retention through a power transform, and 0 sets resale to zero.`,
      capital: 'Use average initial and terminal recoverable capital plus the loan-rate adjustment. Terminal value updates with age and distance.',
      time: 'Relative minutes per kilometre × trip distance × time value; negative when driving saves time.',
    };
    for (const [key, explanation] of Object.entries(explanations)) {
      $(`[data-cost-explanation="${key}"]`).textContent = p.costs[key] ? explanation : '';
    }
    const blended = p.homeShare / 100 * p.homeElectricity + (1 - p.homeShare / 100) * p.publicElectricity;
    $('[data-energy-explanation]').textContent = !p.costs.energy ? '' : p.type === 'ev'
      ? `${t.electricityFormula} ${t.blendedPrice}: ${fmt(blended, 4)} ${unit('CNY/kWh')}; ${fmt(actualKm, 2)} km × ${fmt(p.electricityUse, 2)} kWh/100 km = ${fmt(actualKm * p.electricityUse / 100, 2)} kWh/${zh ? '年' : 'year'}. ${t.currentEstimate}`
      : `${t.fuelFormula} ${fmt(actualKm, 2)} km × ${fmt(p.fuelUse, 2)} L/100 km × ${fmt(p.petrol, 2)} ${unit('CNY/L')} = ${fmt(result.rows.energy, 2)} ${unit('CNY/year')}. ${t.currentEstimate}`;
    $('.lab-results').hidden = false;
    const included = Object.keys(p.costs).filter(key => p.costs[key]);
    $('[data-included]').textContent = `${t.selectedCosts}: ${included.length}/12 ${t.items} — ${included.map(rowLabel).join(zh ? '、' : ', ')}.`;
    for (const [key, value] of Object.entries({ car: result.car / 12, taxi: result.taxi / 12, threshold: result.breakMonthly, breakKm: result.breakKm })) {
      $(`[data-output="${key}"]`).textContent = value === null ? (result.identical ? t.allEqual : t.noCross) : fmt(value);
    }
    $('[data-verdict]').textContent = Math.abs(result.saving) < 1 ? t.tie : `${result.saving > 0 ? t.carWins : t.taxiWins} ¥${fmt(Math.abs(result.saving) / 12)}`;
    const warnings = [];
    if (result.identical) warnings.push(t.allEqualHint);
    else if (result.breakKm === null) warnings.push(t.noCrossHint);
    else if (result.breakKm > 60000) warnings.push(t.highKm);
    if (p.costs.time && p.timeValue && p.extraMinutes) warnings.push(t.timeHint);
    $('[data-warnings]').replaceChildren(...warnings.map(text => { const el = document.createElement('p'); el.textContent = text; return el; }));
    $('[data-breakdown]').innerHTML = `<table><thead><tr><th>${t.row}</th><th>${t.amount}</th></tr></thead><tbody>${Object.entries(result.rows).map(([key, value]) => `<tr><td>${rowLabel(key)}</td><td>${fmt(value, 2)}</td></tr>`).join('')}<tr><th>${t.total}</th><th>${fmt(result.car, 2)}</th></tr></tbody></table>`;
    $('[data-residual]').textContent = `${t.residual}: ¥${fmt(result.resale)} (${fmt(result.residualRate * 100, 1)}%). ${t.taxAmount}: ¥${fmt(result.tax)}.`;
    curveRows = Array.from(chartPanels).flatMap(draw);
  }

  root.addEventListener('input', event => {
    const el = event.target;
    if (el.dataset.range) {
      const field = $(`[data-field="${el.dataset.range}"]`);
      field.value = el.value;
    } else if (el.dataset.field) {
      const slider = $(`[data-range="${el.dataset.field}"]`);
      if (slider && Number.isFinite(el.valueAsNumber)) slider.value = el.value;
    } else return;
    $('[data-status]').textContent = '';
    $('[data-ready]').textContent = '';
    $('[data-share-url]').hidden = true;
    update();
  });
  root.addEventListener('change', event => {
    const el = event.target;
    if (el.dataset.cost) {
      p = { ...p, costs: { ...p.costs, [el.dataset.cost]: el.checked } };
      sync(true); $('[data-ready]').textContent = ''; update(); return;
    }
    if (!el.dataset.select) return;
    if (el.dataset.select === 'taxMode') p.taxMode = el.value;
    else {
      // Do not silently replace an invalid field with its last valid value.
      if (!read()) { el.value = p[el.dataset.select]; return; }
      p = preset(p, el.dataset.select === 'city' ? el.value : p.city, el.dataset.select === 'type' ? el.value : p.type);
      sync();
    }
    $('[data-status]').textContent = '';
    $('[data-ready]').textContent = '';
    $('[data-share-url]').hidden = true;
    update();
  });
  $('[data-reset]').addEventListener('click', () => {
    p = { ...DEFAULTS };
    if (location.hash.startsWith('#ct=')) history.replaceState(null, '', location.pathname + location.search);
    sync(); update(); $('[data-status]').textContent = ''; $('[data-ready]').textContent = ''; $('[data-share-url]').hidden = true;
  });
  root.addEventListener('click', event => {
    const button = event.target.closest('[data-edit-cost]');
    if (!button) return;
    const panel = $(`[data-cost-fields="${button.dataset.editCost}"]`);
    panel.hidden = !panel.hidden;
    button.setAttribute('aria-expanded', String(!panel.hidden));
    button.textContent = panel.hidden ? t.edit : t.close;
  });
  $('[data-share]').addEventListener('click', async () => {
    if (!read()) return;
    const url = new URL(location.href);
    url.hash = 'ct=' + encodeURIComponent(JSON.stringify({ version: MODEL_VERSION, parameters: p }));
    try { await navigator.clipboard.writeText(url.href); $('[data-status]').textContent = t.copied; }
    catch {
      $('[data-status]').textContent = t.copyFallback;
      $('[data-share-url]').textContent = url.href; $('[data-share-url]').hidden = false;
    }
  });
  $('[data-export]').addEventListener('click', () => {
    if (!read()) return;
    result = calculate(p);
    const rows = [['section', 'key', 'value', 'unit'], ['model', 'version', MODEL_VERSION, ''],
      ...Object.entries(p).filter(([key]) => key !== 'costs').map(([key, value]) => ['input', key, value, inputUnits[key] ?? '']),
      ...Object.entries(p.costs).map(([key, value]) => ['cost_selection', key, value, 'included']),
      ...Object.entries(result.rows).map(([key, value]) => ['annual_cost', key, value, 'CNY/year']),
      ['result', 'car', result.car, 'CNY/year'], ['result', 'taxi', result.taxi, 'CNY/year'],
      ['result', 'breakKm', result.breakKm ?? 'no finite crossing', 'km/year'],
      ['result', 'breakMonthly', result.breakMonthly ?? 'no finite crossing', 'CNY/month'],
      ['result', 'terminalResale', result.resale, 'CNY'],
      ['result', 'terminalRetention', result.residualRate, 'fraction'],
      ['result', 'purchaseTax', result.tax, 'CNY'],
      ['result', 'meanVehicleValue', result.meanValue, 'CNY'],
      ['result', 'weightedRenewalValue', result.insuranceMeanValue, 'CNY'],
      ['result', 'actualDrivingKm', result.actualKm, 'km/year'],
      ['result', 'totalDrivingKm', result.totalKm, 'km'],
      ['result', 'equivalentServiceCount', result.serviceCount, 'visits over holding period'],
      ['result', 'equivalentTyreSets', result.tyreSets, 'sets over holding period'],
      ['result', 'holdingPeriodCost', result.car * p.years, 'CNY'],
      ['result', 'savingWithOwnership', result.saving, 'CNY/year'],
      ...curveRows,
    ];
    const csv = '\uFEFF' + rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = `car-vs-taxi-${MODEL_VERSION}.csv`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  window.addEventListener('hashchange', () => {
    if (!location.hash.startsWith('#ct=')) return;
    $('[data-share-url]').hidden = true;
    try {
      p = restoreState(JSON.parse(decodeURIComponent(location.hash.slice(4))));
      $('[data-ready]').textContent = '';
      sync(); update(); $('[data-status]').textContent = t.sharedLoaded;
    } catch {
      p = { ...DEFAULTS };
      sync(); update(); $('[data-status]').textContent = '';
      $('[data-ready]').textContent = t.sharedError;
    }
  });
  sync(); update();
  if (initialStatus === t.sharedError) $('[data-ready]').textContent = initialStatus;
}

document.querySelectorAll('[data-car-lab]').forEach((root, index) => {
  mount(root, index).catch(error => {
    console.error('Car calculator:', error);
    root.textContent = WORDS[root.dataset.language === 'zh' ? 'zh' : 'en'].failed;
  });
});
