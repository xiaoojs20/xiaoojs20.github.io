---
title: "How Much Money Do You Need to Be Financially Free?"
slug: how-much-for-freedom
date: "2026-11-27T00:45:00+08:00"
written: "2026.11"
note: true
share: false
license: false
math: true
---

The internet never lacks an answer to this question. Someone says five million is enough; someone else says a hundred million. These numbers contradict each other less because somebody did the arithmetic wrong than because the word "freedom" was never defined.

In [this video](https://www.bilibili.com/video/BV1yUHP6rEYD), 小Lin说 offers a version that can actually be calculated, and it comes down to a single multiplier: **take your monthly spending and multiply it by 480**. I re-derived the equation and filled in the parts the video left out.

## What "freedom" means

"Not working, living off savings for the rest of your life" hides three conditions that must hold at the same time:

1. **No work.** You no longer sell your time for money.
2. **No loss of purchasing power.** Today's standard of living persists until death, not bare survival.
3. **No end date.** Not "enough to last until 85".

The third is the one that quietly gets swapped out. Most "save X and retire" calculations are actually finite-horizon: spend until a certain age, end at zero. That is perfectly reasonable, but the answer becomes much smaller, as we will see.

All three conditions together describe something standard in finance: a **perpetuity**. You spend only the real return each year and never touch the principal. Money like that does not run out.

## How much principal sits behind CNY 10,000 a month

### Perpetuity: the principal stays intact

Let \(X\) be monthly spending at today's prices. Because prices rise, \(X\) rises with them; in real terms it is a flat line costing \(12X\) a year.

Let \(F\) be assets and \(r\) the annual return **after inflation**. For the real value of assets not to fall, one year of real return must exactly cover one year of spending:

$$
rF = 12X \quad\Longrightarrow\quad F = \frac{12X}{r} = 12X \cdot \frac{1}{r}.
$$

With \(r = 2.5\%\):

$$
F = \frac{12X}{0.025} = 480X.
$$

The mysterious 480 has no other secret: it is \(12 \div 0.025\).

The 480 is not an amount but a **multiplier**. Its job is to translate "how much per month" into "how much in total":

| Monthly spending \(X\) | Threshold assets \(480X\) |
| ---: | ---: |
| CNY 3,000 | CNY 1.44M |
| CNY 5,000 | CNY 2.40M |
| CNY 10,000 | CNY 4.80M |
| CNY 20,000 | CNY 9.60M |
| CNY 30,000 | CNY 14.40M |

There is a more useful reading of the same number: **CNY 480 of assets buys CNY 1 of permanent monthly income.** Any permanent increase of CNY 100 a month in spending therefore requires another CNY 48,000 of assets. A CNY 100 monthly subscription is worth CNY 48,000 on a perpetual basis.

### Finite horizon: the principal may be spent

Release the "no shrinkage" constraint and the question becomes a different one: how long does the money last?

With monthly spending \(X\), real return \(r\) and initial assets \(F\), requiring the balance to reach exactly zero at the end of year \(T\):

$$
F = 12X \cdot \frac{1 - (1+r)^{-T}}{r}.
$$

As \(T \to \infty\), \((1+r)^{-T}\) tends to zero and the expression collapses to \(F = 12X / r\), the 480 version. So 480 is an **upper bound**, not a lower one; the shorter the horizon, the less you need:

| Horizon | Coverage multiplier | Needed at CNY 10,000/month |
| --- | ---: | ---: |
| 30 years | 251 | CNY 2.51M |
| 50 years | 340 | CNY 3.40M |
| Perpetual | 480 | CNY 4.80M |

Thirty years and perpetuity differ by nearly half. That is the distance between "enough until 85" and "never runs out".

{{< freedom-lab kind="burn" >}}

CNY 6M, CNY 20,000 a month, 2.5% real: annual spending of CNY 240,000 exceeds the CNY 150,000 real return, the gap comes out of principal, and the balance reaches zero in about 39.7 years. On a perpetual basis the same portfolio supports CNY 12,500 a month. That gap of CNY 7,500 is the price of the promise that the principal never moves.

**The 4% rule is the back-tested version of the same equation.** The familiar rule (Bengen, the Trinity study) says that withdrawing 4% of a portfolio each year has historically survived 30 years. As a multiplier that is 25 times annual spending, or 300 times monthly spending, which places it between the 30-year (251×) and 50-year (340×) rows in the table above. It is not a different calculation; the difference is where the numbers come from. We fix the real return and solve for the principal; the rule tries historical sequences and asks which withdrawal survived the worst thirty years.

Put 4% back into the equation — 30 years, 4% withdrawn, balance at zero — and the implied real return is only about 1.2%. That does not mean the rule assumes 1.2%; the average real return behind it is far higher. It means volatility and unlucky starting years consume the difference, so the effect is to spend a 5% return as though it were 1.2%.

**The extra 49× is the price of volatility.** Over the same 30 years, a certain 2.5% needs only 251×, while the historical backtest needs 300×. Those 49 multiples buy insurance against not knowing which year you start in, which is sequence risk. Read the other way, 251× is the ideal case: in the real world a 2.5% return with volatility over 30 years drifts toward 300×. The figure is itself being revised down — Morningstar's 2025 safe withdrawal rate for 30 years is 3.9% ([Morningstar](https://www.morningstar.com/retirement/retirees-heres-what-your-withdrawal-rate-should-be-2025)) and Bengen's own 2024 number is 4.7% — so it is safer to read as an upper bound than as a promise.

### What the chart actually shows

{{< freedom-lab kind="multiplier" >}}

The most useful thing about this chart is not that it produces 480 but that it shows how fragile the number is. The curve rises steeply on the left and flattens on the right; the three lines bunch together on the right and only separate on the left.

- **The lower the return, the more an error costs.**
  - The multiple is inversely proportional to the real return, so a one-point disagreement in \(r\) moves the answer relatively by about \(1/r\): a tenth near 8%, half near 2% — and this is also the stretch hardest to judge.
  - \(X\) is on your bank statements, and the money for children and housing has a market price, but \(r\) is guesswork, and it is exactly the term that gets magnified most. The 480 is, in the end, the reading of an assumption.

- **The higher the return, the less the horizon matters.**
  - Whatever principal is left after 30 years shrinks quickly in present value as returns rise, so perpetuity and 30 years converge.
  - Perpetuity needs \(1/[1-(1+r)^{-30}]\) times the assets of a 30-year horizon: 1.11× at 8%, 2.23× at 2%, 3.87× at 1%.
  - The same preference for never touching the principal costs almost nothing at high returns and a great deal at low ones; the return is what prices it.

- **Only \(X\) and the horizon are yours to set.**
  - Returns come from the market, not from effort, so the sensible order is: record twelve months of spending first, so that \(X\) is a figure from statements; then fix the horizon as a specific year rather than "forever"; and only then decide on \(r\), taking its lower end.
  - The number that falls out is not a target to reach but what suffices under one assumption.

### Why it must be the real return

Nominal and real returns are separated by inflation. Write the nominal return as \(n\), inflation as \(i\) and the real return as \(r\); the relationship is not subtraction but Fisher's equation:

$$
1 + r = \frac{1 + n}{1 + i} \quad\Longrightarrow\quad r = \frac{1 + n}{1 + i} - 1.
$$

With a 4.5% nominal return and 2% inflation, \(r = 1.045 / 1.02 - 1 = 2.45\%\), which gives a multiplier of 489.6 rather than 480. The difference is small, but the concept is not: what must be preserved is purchasing power, not a nominal balance.

Fixed deposits make the arithmetic concrete. Roughly current levels: 0.95% for one year, 1.3% for five years, and core inflation around 1.0%.

$$
\begin{aligned}
r_{5y} &= \frac{1.013}{1.01} - 1 = 0.30\%,\\
r_{1y} &= \frac{1.0095}{1.01} - 1 = -0.05\%.
\end{aligned}
$$

Five-year deposits beat inflation by a hair. One-year deposits already lose in real terms. This is not merely a "low return" problem. When \(r \le 0\), \(1/r\) diverges, and **the perpetuity does not exist at all**: no amount of money preserves its purchasing power.

So "keep it all in the bank" is ruled out by the equation itself. It does not ask you to trade stocks; it only asks for a positive real return.

**Where 2.5% comes from.**

**Do not use US equity data.** The textbook "8% long-run stock return" comes from US markets and does not transfer to Chinese equities. Anyone who has invested in A-shares has that intuition, and the intuition is right.

**Look at domestic institutions' long-run record.** China's enterprise annuities returned about 6.17% a year on average from 2007 to 2024 (the video's figure). That is the record of professional fund managers.

**Subtract fees.** Management, custody, subscription, redemption and advisory costs, explicit and implicit, typically take another two to three percentage points before reaching an individual investor. Six percent arriving as under four is the normal case.

**Subtract inflation.** With long-run inflation at 2%, a 4%–4.5% nominal return corresponds to 2%–2.5% real. Taking the upper bound gives 480.

In fairness: 2.5% is a **conservative** assumption. Global equity markets have historically delivered real returns near 5%, and that would give a multiplier of 240. Choosing the conservative value means deducting the margin for "things go worse than planned" up front, in exchange for a number that still works if you are pessimistic.

### Additive terms: children, health, housing

The 480 covers day-to-day spending only. The equation also has three additive terms:

$$
F = 480X + KN + M + H.
$$

They do not belong inside \(X\). Everyday spending runs evenly year by year, whereas these three land in a few particular years; folding them into \(X\) would turn a smooth line into a few spikes and the multiplier would stop meaning anything. Each is treated in turn.

**Children, \(KN\).** \(K\) is the lifetime cost per child, \(N\) the number. The *China Fertility Cost Report* cited in the video puts the 2024 national average at about CNY 2,544 per child per month, or roughly CNY 580,000 to age 18, including pregnancy; about CNY 1.0M in Beijing, CNY 1.08M in Shanghai and CNY 430,000 in Guizhou. Regional differences track GDP per capita closely. The report also notes that China's cost relative to GDP per capita is the second highest in the world, after South Korea.

This is the item most often underestimated, because CNY 580,000 stops at 18. University fees, study abroad and a down payment on a home are not in it. The video's scope is 18 years; anything beyond has to be added by hand. The scale effect of "each additional child cuts average cost by 15%" is explicitly ignored, and the equation does not reflect it either: apply your own coefficient if you want it.

**Health, \(M\).** The video estimates CNY 150,000–300,000 over a lifetime in a second-tier city and CNY 300,000–600,000 in a first-tier city. The variance here is enormous and the upper bound is open, so this is a reserve rather than a budget.

**Housing, \(H\).** Add the market price in your target city directly, with no inflation or investment adjustment. If you already own a home, add nothing; if you plan to rent forever, put the rent into \(X\).

**Retirement is not listed separately.** \(X\) already includes the right to spend until the end of time. A more careful treatment would lower day-to-day consumption in old age while raising care costs; the video averages the two out with a single \(X\), which is a reasonable simplification.

## Worked examples

**The national urban average.** In 2025, urban household consumption per capita was CNY 35,869 a year, or CNY 2,989 a month ([National Bureau of Statistics](https://www.stats.gov.cn/sj/zxfb/202601/t20260119_1962321.html)). That definition already includes housing, health and education, so the later items are not added again:

$$
F = 480 \times 2{,}989 \approx \text{CNY } 1.435\text{M}.
$$

One person needs about CNY 1.44M; a couple about CNY 2.87M. On the all-household measure the figure is lower: consumption per capita was CNY 29,476 a year, CNY 2,456 a month, corresponding to CNY 1.18M.

**A family of four in a first-tier city.** Monthly spending of CNY 15,000, two children at CNY 1.5M each, CNY 1.5M reserved for the couple's health, and a 120 m² home worth CNY 7M:

| Item | Amount |
| --- | ---: |
| Ongoing spending \(480 \times 1.5\) | CNY 7.20M |
| Children \(1.5 \times 2\) | CNY 3.00M |
| Health | CNY 1.50M |
| Housing | CNY 7.00M |
| **Total** | **CNY 18.70M** |

Look at the structure: only 38% is the perpetual part, and 62% is three one-off outlays. For most families, **housing and children determine that number far more than the return assumption does**.

**Solving backwards.** With CNY 6M, one child at CNY 700,000 and CNY 500,000 for health, no home purchase:

$$
\begin{aligned}
480X &= 600 - 70 - 50 = 480,\\
X &= \text{CNY } 10{,}000 \text{ a month}.
\end{aligned}
$$

No children, a CNY 1.2M home, and still CNY 500,000 for health:

$$
\begin{aligned}
480X &= 600 - 120 - 50 = 430,\\
X &\approx \text{CNY } 9{,}000 \text{ a month}.
\end{aligned}
$$

(The video's second example gives CNY 9,000, which only reconciles if the CNY 500,000 health reserve is deducted as well; deducting the home price alone gives CNY 10,000. That is the only discrepancy I found when re-checking the arithmetic.)

"Six million and I can only spend nine thousand a month?" The reaction is understandable. The cost comes from that premise: **assets must not shrink by a single yuan**. Let the asset decline and the same CNY 6M supports far more spending, at the price of writing a depletion year into the plan.

The cases above all use fixed parameters. Swap in your own spending, children and housing, and work it through in the panel below.

{{< freedom-lab kind="core" >}}
