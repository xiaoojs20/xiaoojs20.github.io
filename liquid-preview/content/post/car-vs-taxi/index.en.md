---
title: "Buying a Car 🆚 Taking Taxis"
description: "A continuous model linking insurance, servicing, tyres, repairs and depreciation to price, distance and holding period."
slug: car-vs-taxi
date: "2026-11-09T00:38:54+08:00"
written: "2026.11"
note: true
hidden: true
share: false
license: false
math: true
---

If I spend CNY 3,000 a month on taxis, should I buy a car?

A parked car ages and ties up capital. Driving adds energy, servicing, tyres and loss of vehicle value. The comparison needs to account for these changes together.

The model below accepts prices such as CNY 186,000 and holding periods such as 4.5 years. Insurance, servicing, tyres, repairs and depreciation are linked by equations, with unit-quote overrides where available. **Its coefficients are editable budgeting assumptions, without vehicle-level statistical calibration.**

## Configure costs before viewing results

The calculator opens with a rear-wheel-drive Model Y in Shanghai. Switching to petrol loads the 2027 Tiguan L Pro 380TSI 2WD Linghang trim. Both examples use a cash purchase, five years of ownership and 10,000 annual trip kilometres. Beijing, Shanghai and Quanzhou offer regional examples. Use your own parking, energy, insurance and service quotes when available.

The page opens with charts by annual trip distance, car price and holding period. Editing inputs or selecting costs updates the curves, crossings and breakdown automatically. Each chart varies its horizontal-axis input and uses your current settings for the other inputs. Incomplete inputs temporarily hide results. Valid inputs restore them.

{{< car-vs-taxi >}}

Monthly amounts include depreciation, capital and risk allowances. They represent average economic cost over the holding period. Actual monthly payments will follow a different pattern.

## What drives each cost

| Cost | Calculation basis |
| --- | --- |
| Insurance | Compulsory quote, liability coverage and rate, annual renewal values, mileage-risk assumption |
| Scheduled service | Unit cost, equivalent visits triggered by time or distance, age factor |
| Tyres | Unit price and equivalent consumption from cumulative distance or age |
| Repair allowance | Vehicle price, warranty cover, years beyond warranty and annual distance |
| Depreciation | Price, holding period, cumulative driving distance and estimated resale |
| Electricity or petrol | Actual driving distance × consumption × energy price |
| Tolls | Additional charged distance × toll rate |
| Parking | Monthly home, work and other parking quotes |
| Tax, registration, charger and plates | Policy or actual quotes; annualized net outlay |
| Capital | Initial outlay, terminal recovery, borrowing and opportunity rates |
| Time | Relative travel-time difference × value of time |

Car price alone cannot identify parking rent, tyre dimensions or energy efficiency. Automatic estimates are a starting point when quotes are missing; vehicles at the same price can differ substantially.

## Depreciation: age and cumulative distance

Let \(P\) be the VAT-inclusive price, \(H\) the holding period, and \(K\) the annual taxi distance needed for equivalent journeys. With driving/taxi distance ratio \(a\), annual driving is \(k=aK\) and cumulative distance is \(M=kH\).

The model starts with an age-retention curve:

| Age, years | 0 | 1 | 3 | 5 | 8 | 10 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Petrol | 100% | 78% | 51% | 40% | 27% | 20% |
| Electric | 100% | 80% | 48% | 35% | 20% | 13% |

These are **age-only scenario anchors**, not observed market retention. Log-linear interpolation between adjacent ages supports fractional holding periods.

A calibration parameter \(b\), default 1, transforms retention to \(r(t)^{1/b}\). A higher \(b\) improves retention while keeping value below the new-car price. The interface uses percent values; zero sets subsequent vehicle values and terminal resale to zero, while first-year coverage still uses new-car value.

Add luxury-depreciation coefficient \(\lambda\) and cumulative mileage-decay coefficient \(\gamma\) per 10,000 km:

$$
V(t;K)=P\,r(t)^{1/b}
\exp\!\left[-\lambda t\max\!\left(\frac{P}{100000}-3,0\right)
-\gamma\frac{aKt}{10000}\right].
$$

Terminal resale is \(R=V(H;K)\); average depreciation is \((P-R)/H\). Defaults are \(\lambda=1.4\%\) and \(\gamma=2\%\), with decimal rates in equations. Mileage is included in resale, and the old separate extra-mileage depreciation charge has been removed.

Resale assumes normal maintenance and reference tyre condition. The tyre allowance maintains that condition; mileage depreciation should describe the remaining vehicle value loss. Calibrate real used-car estimates and maintenance allowances to the same condition basis.

## Insurance: estimate each annual renewal

Damage coverage is related to actual vehicle value; see the [commercial motor insurance model provisions](https://e.cic.cn/web/web/public/Clause.jsp). The model uses vehicle values at policy starts in years 0, 1, 2 and so on. Year one uses new-car value; the final partial year is allocated pro rata. With policy-year weight \(w_n=\min(1,H-n)\):

$$
\bar V_I=\frac{1}{H}\sum_{n=0}^{\lceil H\rceil-1}w_nV(n;K),\qquad V(0;K)=P.
$$

Insurance is split into compulsory premium \(I_c\), liability coverage \(Q\) with rate \(s\), and new-car damage premium \(D_0\). Without a damage-premium quote, \(D_0=P\,d\), where \(d\) is an adjustable assumed rate.

$$
U(k)=\frac{1+\eta k/10000}{1+\eta},\qquad
C_{\rm insurance}
=z\left[I_c+\left(Qs+D_0\frac{\bar V_I}{P}\right)U(k)\right].
$$

Here \(z\) calibrates total premiums and \(\eta\) is a mileage-risk scenario coefficient, referenced to 10,000 annual driving kilometres. Damage coverage follows renewal vehicle values; liability cost follows coverage. Enter the actual annual compulsory quote.

This is not an insurer’s pricing rule. Model, driver, location, claims and discounts affect actual premiums; the mileage coefficient is not statistically fitted. The override is the **new-car damage premium at reference mileage**, with compulsory and liability cover listed separately. For a one-year holding period, a CNY 5,000 damage quote, CNY 950 compulsory premium and CNY 700 estimated liability cost total CNY 6,650 at reference mileage and 100% calibration. Recheck quotes when changing cars.

## Servicing: unit cost times time- or distance-triggered visits

Different vehicles and tasks have different intervals. [Tesla’s official maintenance guidance](https://www.tesla.cn/support/vehicle-maintenance), for example, lists time-based and distance-based tasks separately. Replace this model’s generic intervals using the vehicle manual.

With reference price \(P_0=250000\), automatic service cost is:

$$
B(P)=B_0(P/P_0)^\alpha.
$$

An actual unit quote overrides \(B(P)\). With time interval \(T_B\) years and distance interval \(L_B\) km:

$$
N_B=\max(H/T_B,M/L_B),\qquad
C_{\rm maintenance}
=\frac{B(P)N_B}{H}(1+g_BH/2).
$$

\(g_B\) is the cost increment per age-year. \(N_B\) is a fractional equivalent visit count for continuous budgeting, rather than a prediction of individual workshop dates. Even a low-mileage vehicle can reach a time-based service interval.

## Tyres: unit price, mileage life and age

Estimate a single-tyre price from car price, or enter an actual quote:

$$
T(P)=T_0(P/P_0)^\beta,\qquad
C_{\rm tyres}
=\frac{4T(P)}{H}\max(M/L_T,H/T_T).
$$

\(L_T\) is expected mileage life and \(T_T\) expected age life. Defaults of CNY 800 per tyre, 50,000 km and six years are adjustable assumptions. [Michelin’s guidance](https://www.michelin.com.cn/auto/how-often-change-tires/index.html) explains that life depends on use, wear and time, rather than a guaranteed universal mileage.

This is a continuous allowance for maintaining reference tyre condition. No separate initial-tyre purchase charge is added, and it is not a particular year’s replacement bill. At constant annual distance, annualized consumption may stay unchanged while total cost rises with the holding period.

## Repairs: warranty, age and use

Let \(\rho\) be the base repair rate, \(W\) warranty years, \(c\) the allowance reduction during warranty, \(g_R\) the annual post-warranty age increment, and \(\mu\) the mileage-risk coefficient. With \(D=\max(H-W,0)\):

$$
E(H)=\frac{(1-c)\min(H,W)+D+g_RD^2/2}{H},
$$

$$
C_{\rm repairs}=P\rho E(H)\left(1+\mu\frac{k}{10000}\right).
$$

This reserves for uncertain costs and does not predict a matching repair bill. Adjust warranty coverage to the actual contract. Avoid counting normal wear, servicing, accidents or insured losses twice.

## Energy, parking, taxes and capital

Electricity follows actual driving distance. The Model Y budget uses 15 kWh/100 km and 65% home charging. The example home and public prices are CNY 0.55 and 1.50 per kWh, for a weighted CNY 0.8825/kWh. At 10,000 km per year, electricity costs about CNY 1,324. The Tiguan L Pro budget uses 9 L/100 km and Shanghai's published 95-octane price ceiling of CNY 9.41/L on October 29, 2026. Fuel costs CNY 8,469 at the same distance. Both consumption figures are budgeting inputs that can be updated from actual bills. [Shanghai fuel price notice](https://www.shanghai.gov.cn/nw12344/20261029/c7fb9bdcc57e4b7eb6f62eb3d0083e7f.html)

Parking sums actual monthly quotes and multiplies by twelve. Tolls use the additional charged-distance share and price per kilometre. Include only tolls added by driving relative to taxis.

For an ordinary new car, full purchase tax is estimated as \(P/1.13\times10\%\), excluding VAT from the tax base; see the [State Taxation Administration example](https://www.chinatax.gov.cn/n810356/n3255681/c4553945/content.html). Eligible new-energy passenger vehicles bought in 2026–2027 receive a 50% reduction capped at CNY 15,000, as explained by the [Ministry of Finance](https://www.mof.gov.cn/jrttts/202306/t20230629_3893518.htm). Tax is charged once at purchase. Enter actual tax for other years, used cars or special arrangements. Trade-in subsidies are excluded.

The Shanghai petrol example uses the October 2026 average private plate auction price of CNY 93,874 as an initial outlay. The budget assumes 100% recovery when selling the car and charges for the capital tied up during ownership. The EV example assumes eligibility for Shanghai's 2026 dedicated new-energy plate, with zero quota outlay. [Plate auction records](https://www.alltobid.com/contents/16/71.html) · [Shanghai auction rules](https://www.shanghai.gov.cn/wzjd/20241230/df4ac88c3ef2413fb92b2bfa69706c91.html?siteId=1) · [Dedicated plate eligibility](https://www.shanghai.gov.cn/202603bgtwj/20260210/84cb024ac225492f82d4039da1fe320f.html)

With initial price and selected acquisition expenses \(A_0\), and terminal resale plus recovered plate value \(A_H\), capital cost is approximated by:

$$
C_{\rm capital}
=i\frac{A_0+A_H}{2}+(j-i)\frac{LP}{2}.
$$

\(i\) is opportunity cost, \(j\) the loan rate and \(L\) the financed share of price. Loan term is approximated by the holding period with uniformly declining principal. Principal is not added again as consumption. This is an annual average, not a repayment schedule or net-present-value analysis.

## Finding the crossing of continuous cost curves

Sum the selected annual costs to get \(C_{\rm car}(K)\); taxi cost is \(C_{\rm taxi}(K)=qK\). Since insurance, resale and service intervals vary with distance, the previous two-segment linear threshold equation no longer applies.

The page solves:

$$
C_{\rm car}(K^*)-qK^*=0,\qquad
T^*=\frac{qK^*}{12}.
$$

The range is 0–200,000 annual trip kilometres. Cost equations are evaluated repeatedly and the crossing is refined by bisection. An absent crossing is reported only for that range. Crossings above 60,000 km/year are flagged as high-mileage extrapolation.

Changing current annual distance moves the usage marker and updates current costs. The crossing of the same annual-distance curves is determined by their cost rules. Changing price, holding period, rates or service intervals changes those curves themselves.

## A worked default scenario

Both Shanghai cases use a cash purchase, five years of ownership and 10,000 annual trip kilometres. The opportunity cost is 3%, parking is CNY 1,310/month, taxis cost CNY 3.6/km and time cost is zero.

| Vehicle input | Model Y RWD | Tiguan L Pro 380TSI 2WD Linghang |
| --- | ---: | ---: |
| VAT-inclusive list price | CNY 263,500 | CNY 251,800 |
| Consumption budget per 100 km | 15 kWh | 9 L |
| Basic vehicle warranty | 4 years or 80,000 km | 3 years or 100,000 km |
| Service interval input | 1 year or 20,000 km, budget equivalent | 1 year or 10,000 km |
| Annual vehicle tax | CNY 0 | CNY 360 |

Prices are for the named trims. The Tiguan service input follows SAIC Volkswagen's standard EA888 2.0T schedule. The Model Y uses a service budget equivalent. Repair costs use the warranty term in years. At 10,000 km a year, the time limit comes first for both vehicles. For a high-mileage scenario, divide the kilometre limit by expected annual distance and enter the shorter of that result and the warranty term. Insurance, unit service and tyre costs, and resale use model estimates that can be updated from actual quotes or data. [Tesla configuration](https://www.tesla.cn/modely/design?referral=33681) · [Tesla warranty](https://www.tesla.cn/support/vehicle-warranty) · [Tiguan configuration and warranty](https://dealer.yiche.com/100024951/price_detail/191658.html?leads_source=p033003) · [SAIC Volkswagen service schedule](https://brand2.svw-volkswagen.com/temp/pdf/clwh/2024/%E9%80%94%E8%A7%82%20L%20Pro%E4%BF%9D%E5%85%BB%E6%89%8B%E5%86%8C.pdf) · [Shanghai vehicle tax rates](https://shanghai.chinatax.gov.cn/zcfw/zcjd/201901/t443831.html)

| Annual average, CNY | Model Y | Tiguan L Pro |
| --- | ---: | ---: |
| Depreciation | 36,010 | 32,133 |
| Annualized acquisition and selling expenses | 3,366 | 4,921 |
| Insurance | 5,202 | 4,283 |
| Parking | 15,720 | 15,720 |
| Scheduled service | 666 | 1,080 |
| Tyre consumption | 652 | 642 |
| Repair allowance | 273 | 469 |
| Electricity or fuel | 1,324 | 8,469 |
| Vehicle tax | 0 | 360 |
| Capital | 5,432 | 8,302 |
| **Total** | **68,644** | **76,379** |

Rows are rounded independently. Totals use unrounded values. Monthly ownership averages about **CNY 5,720** for the Model Y and **CNY 6,365** for the Tiguan L Pro. Taxis cost about **CNY 3,000/month** at the same distance. The two ownership curves cross taxi costs at about **20,058 km/year** and **26,716 km/year**, respectively.

The Tiguan's cash invoice price has a substantial effect on the comparison. Under these inputs, the two monthly ownership costs are close when the Tiguan's VAT-inclusive vehicle price is about **CNY 209,900**.

I care about what moves the result: replace service quotes, tyre dimensions and parking rent with real figures, then shorten the planned holding period by two years and watch the crossing move. Family journeys, carrying belongings and spontaneous departures may justify paying more for a car. I want to see that extra cost clearly before deciding whether to pay it.
