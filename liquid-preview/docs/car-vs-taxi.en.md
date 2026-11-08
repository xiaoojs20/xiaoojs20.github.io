# Buying a Car 🆚 Taking Taxis: maintenance and verification

The bilingual articles are content/post/car-vs-taxi/index.zh.md and index.en.md. They share the shortcode, model module, UI and CSS. Routes are /zh/p/car-vs-taxi/ and /p/car-vs-taxi/. Notes and recent updates include them automatically.

## Calculation contract

Model version: 2026-11-08.3. Defaults: Shanghai, CNY 250,000 VAT-inclusive price, electric, five years and 10,000 annual trip kilometres. km is equivalent taxi demand; actual annual driving is detour × km. Multiply again by years for cumulative driving. Percent inputs are divided by 100 in equations.

Insurance, servicing, tyres, repairs and depreciation are calculated. Parking uses monthly quotes; annual vehicle tax uses local rules. These external prices cannot be inferred from vehicle price. Energy and tolls follow actual driving. Acquisition expenses are annualized, and capital costs also use terminal resale.

- Resale includes age, price and cumulative distance. Age anchors are assumptions, not market observations. Retention calibration uses r(t)^(100/interface value), raising or lowering retention without exceeding car price; zero means zero resale. The separate extraWear charge was removed.
- Insurance uses values at policy starts in years 0, 1, 2 and so on; the last partial year is allocated pro rata. damageQuote is new-car damage coverage only. Compulsory and liability coverage are separate. Mileage exposure is referenced to 10,000 driving km/year. This is a scenario budget, not an insurer forecast.
- Service and tyre unit prices use power curves referenced to CNY 250,000, or actual unit quotes. Equivalent visits/consumption take the larger time- or distance-triggered quantity, allowing fractions.
- Tyres are a continuous allowance for maintaining reference condition, not a cash replacement timetable. No separate initial-tyre purchase cost is added. Resale and repair assumptions must share the condition basis.
- Repairs use price share × warranty/age exposure × mileage risk. They are an allowance, not a certain bill.
- Coefficients are editable assumptions without vehicle-level calibration. Price exponents do not uniquely identify parts or maintenance costs for a vehicle.

## Crossings and charts

Costs are nonlinear, so the former F/v/w two-segment crossing formula no longer applies. calculate returns carAt, taxiAt and at using one model. The distance search range is 0–200,000 annual trip km. In the valid parameter domain, component cost per demanded kilometre is nonincreasing, permitting endpoint bracketing and bisection for the unique sign crossing. An absent crossing is a conclusion about this range only.

Price and age curves call calculate(p, { solveCrossings: false }) to avoid solving a distance crossing at every plotting point. Hollow dots mark current usage; purple dots mark equal costs. Exported samples include exact input and crossing points.

After the first calculation, input, preset and cost-selection changes update results automatically. Invalid input temporarily hides results; correcting it restores them. Reset restores Shanghai/CNY 250,000 before the first calculation. Powertrain switches show relevant consumption fields.

## Verification

Run:

    node --test liquid-preview/scripts/car-vs-taxi.test.mjs
    hugo --source liquid-preview --destination /tmp/car-vs-taxi-preview --baseURL http://127.0.0.1:8765/ --minify
    python3 -m http.server 8765 --bind 127.0.0.1 --directory /tmp/car-vs-taxi-preview

Fourteen tests cover independent accounting and numerical value integration, price/distance/age responses, quote overrides, service time triggers, tyre life, first-year insurance and renewals, warranty, energy, nonlinear crossings, unit-cost properties, continuity, tax/loan accounting, zero costs and state validation.

Check both languages, Notes and language switches. Default ownership is about CNY 5,553/month; crossing is 19,497 km/year and CNY 5,849/month. After price, age and distance edits, costs and chart markers must use the same parameters. Verify unit quotes, cost exclusions, zero distance, absent crossings, invalid-input recovery, CSV units and shared-state restoration. Inspect mobile and dark mode; KaTeX should have no errors.

For production, omit the local baseURL override. Inspect the isolated output before using the existing publishing process; exclude unrelated work in progress.

## Compatibility and sources

Version 3 changes cost categories and coefficient semantics. Version 2026-11-08.2 links show an incompatibility message; old annual budgets must not silently become new unit quotes. CSV contains version, all inputs, cost selections, annual and holding-period costs, vehicle values, equivalent service/tyre quantities and curve data.

The articles link to insurance provisions, Tesla maintenance guidance, Michelin life guidance, and tax/Shanghai plate policies. These support structure or policy, not the assumed coefficients. Recheck policy when changing purchase year.
