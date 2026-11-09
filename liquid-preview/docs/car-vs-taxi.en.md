# Buying a Car 🆚 Taking Taxis: maintenance and verification

The bilingual articles are content/post/car-vs-taxi/index.zh.md and index.en.md. They share the shortcode, model module, UI and CSS. Routes are /zh/p/car-vs-taxi/ and /p/car-vs-taxi/. Notes and recent updates include them automatically.

## Calculation contract

Model version 2026-11-09.1 opens with the CNY 263,500 Model Y RWD in Shanghai, five years and 10,000 annual trip kilometres. The petrol reference is the CNY 251,800 2027 Tiguan L Pro 380TSI 2WD Linghang. The km input is equivalent taxi demand. Actual annual driving is detour × km. Multiply again by years for cumulative driving. Percent inputs are divided by 100 in equations.

Insurance, servicing, tyres, repairs and depreciation are calculated. Parking uses monthly quotes; annual vehicle tax uses local rules. These external prices cannot be inferred from vehicle price. Energy and tolls follow actual driving. Acquisition expenses are annualized, and capital costs also use terminal resale.

- Resale includes age, price and cumulative distance. Age anchors are assumptions, not market observations. Retention calibration uses r(t)^(100/interface value), raising or lowering retention without exceeding car price; zero means zero resale. The separate extraWear charge was removed.
- Insurance uses values at policy starts in years 0, 1, 2 and so on; the last partial year is allocated pro rata. damageQuote is new-car damage coverage only. Compulsory and liability coverage are separate. Mileage exposure is referenced to 10,000 driving km/year. This is a scenario budget, not an insurer forecast.
- Service and tyre unit prices use power curves referenced to CNY 250,000, or actual unit quotes. Equivalent visits/consumption take the larger time- or distance-triggered quantity, allowing fractions.
- Tyres are a continuous allowance for maintaining reference condition, not a cash replacement timetable. No separate initial-tyre purchase cost is added. Resale and repair assumptions must share the condition basis.
- Repairs use price share × warranty/age exposure × mileage risk. They are an allowance, not a certain bill.
- Coefficients are editable assumptions without vehicle-level calibration. Price exponents do not uniquely identify parts or maintenance costs for a vehicle.

## Crossings and charts

Costs are nonlinear, so the former F/v/w two-segment crossing formula no longer applies. calculate returns carAt, taxiAt and at using one model. The distance search range is 0–200,000 annual trip km. In the valid parameter domain, component cost per demanded kilometre is nonincreasing, permitting endpoint bracketing and bisection for the unique sign crossing. An absent crossing is a conclusion about this range only.

The results display the distance, price and holding-period charts together. Price and holding-period curves call calculate(p, { solveCrossings: false }) to avoid solving a distance crossing at every plotting point. Hollow dots mark current usage, and purple dots mark equal costs. The CSV includes samples from all three charts, including exact input and crossing points.

On load, the calculator uses the defaults or the settings from a shared link. Input, preset and cost-selection changes update the results automatically. Invalid input temporarily hides results. Correcting it restores them. Reset restores the Shanghai Model Y case. Changing powertrain loads the reference vehicle, clears damage insurance, service and tyre quotes, and restores the default purchase-tax setting. Changing city loads regional cost examples.

## Verification

Run:

    node --test liquid-preview/scripts/car-vs-taxi.test.mjs
    hugo --source liquid-preview --destination /tmp/car-vs-taxi-preview --baseURL http://127.0.0.1:8765/ --minify
    python3 -m http.server 8765 --bind 127.0.0.1 --directory /tmp/car-vs-taxi-preview

Sixteen tests cover independent accounting, price/distance/age responses, quote overrides, warranty, energy, nonlinear crossings, continuity, tax/loan accounting, zero costs, vehicle presets and shared-link compatibility.

Check both languages, Notes and language switches. The default Model Y costs about CNY 5,720/month and crosses at 20,058 km/year. The Tiguan costs about CNY 6,365/month and crosses at 26,716 km/year. After price, age and distance edits, costs and chart markers must use the same parameters. Verify unit quotes, cost exclusions, zero distance, absent crossings, invalid-input recovery, CSV units and shared-state restoration. Inspect mobile, dark mode and KaTeX rendering.

For production, omit the local baseURL override. Inspect the isolated output before using the existing publishing process; exclude unrelated work in progress.

## Compatibility and sources

Version 2026-11-08.3 links fill omitted fields from the defaults in use when they were created. Version 2026-11-08.2 links show an incompatibility message because some cost fields had different meanings. CSV contains version, all inputs, cost selections, annual and holding-period costs, vehicle values, equivalent service/tyre quantities and curve data.

The articles link to insurance provisions, Tesla maintenance guidance, Michelin life guidance, and tax/Shanghai plate policies. These support structure or policy, not the assumed coefficients. Recheck policy when changing purchase year.
