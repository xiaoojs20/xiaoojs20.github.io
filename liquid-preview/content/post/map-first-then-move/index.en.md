---
title: "Map First, Then Move"
description: "From the secretary problem to optimal stopping and search theory: reveal the map through exploration, then decide when to act."
slug: map-first-then-move
date: "2026-11-26T20:33:00+08:00"
aliases: ["/p/when-to-stop-searching/"]
written: "2026.11"
note: true
hidden: true
share: false
license: false
math: true
---

A few days ago I listened to an episode with Justin Sun. He described buying property: look at a hundred apartments first, don't rush to transact. Then a smaller version: ten apartments, buy too early and you may miss a better one, buy too late and the earlier ones are gone — so which one do you take? He also mentioned the golden ratio, 0.618.

The direction is right. The number is not. Those remarks stack several different theories on top of one another: sometimes the secretary problem, sometimes search theory, sometimes the value of information, and underneath it all explore versus exploit. They are usually discussed as one thing, while answering different questions. So let me take them in order.

## The secretary problem, starting from ten apartments

### The setup

Suppose you run a company and need to hire the strongest of 100 candidates, under these rules:

- You know the total number of candidates in advance.
- Candidates are interviewed in a completely random order.
- After each interview you can rank that candidate against everyone interviewed so far.
- You must decide hire or reject immediately after each interview.
- A rejection cannot be reversed.
- A hire ends the process at once.
- The only objective is to hire the single best candidate.

The question: which strategy maximises the probability of hiring the best one?

The answer is not the 80/20 rule, not a 50/50 split, and not the golden ratio. It is the reciprocal of Euler's number:

$$
\frac{1}{e}\approx 36.79\%
$$

This is the 37% rule. Its structure has two phases: pure exploration to build a benchmark, then a selection phase in which you act on the first opportunity that beats everything seen so far.

### Why exactly 37%

Let there be $n$ candidates, with the first $r$ observed and rejected; afterwards you hire the first person better than everyone before. Let the global best appear at position $k$.

Success requires two things at once: the best arrives after the observation window, $k>r$; and among the first $k-1$ candidates the best one falls inside the first $r$ — otherwise you would have hired someone else earlier.

Since the order is random, the probability the best sits at position $k$ is $1/n$; the probability that the best of the first $k-1$ lies within the first $r$ is $r/(k-1)$. Summing over all successful cases:

$$
P(r)=\sum_{k=r+1}^{n}\frac{1}{n}\cdot\frac{r}{k-1}
=\frac{r}{n}\sum_{k=r+1}^{n}\frac{1}{k-1}
$$

For large $n$ the sum becomes an integral; with $x=r/n$:

$$
P(x)\approx -x\ln x
$$

Differentiating:

$$
P'(x)=-\ln x-1
$$

Setting it to zero gives $x^*=1/e$, and since $P''(x)=-1/x<0$ this is a maximum. Substituting back:

$$
P(x^*)=\frac{1}{e}\approx 36.79\%
$$

The optimal observation fraction and the asymptotic optimal success probability are the same number. What it means concretely: even with a million candidates this strategy still lands the best one with probability near 37%, while picking at random gives one in a million.

### Behaviour at finite sample sizes

The 37% above is a large-sample approximation. With finite populations the exact optimum shifts slightly. Using the asymptotic curve for $n=100$, the success rate by observation fraction is:

| Fraction observed | Probability of picking the best |
| --- | --- |
| 5% | 15.0% |
| 10% | 23.0% |
| 20% | 32.2% |
| 30% | 36.1% |
| **36.79%** | **36.79%** |
| 38.2% (1 − golden ratio) | 36.8% |
| 50% | 34.7% |
| 61.8% (golden ratio) | 29.7% |
| 80% | 17.9% |
| 90% | 9.5% |

With the exact formula instead, the optimum for 10 candidates is to observe and reject 3 (30.0%), succeeding 39.87% of the time — slightly above the asymptotic value. As the population grows the exact fraction converges to $1/e$: at 100 the optimum is 37 observed, with 37.10%; at 1000 it is 368, with 36.82%.

Two things stand out. First, observing 61.8% yields only 29.7% — the golden ratio is clearly worse than simply looking at a third, and worse than 50%. But its complement, 38.2%, is almost exactly optimal at 36.8%. If 0.618 refers to the share left for selection rather than the share observed, the number is very close to correct — probably why 0.618 and 37% keep appearing in the same conversation. Second, the optimum is flat: 30% and 36.79% differ by less than one percentage point. So there is no reason to carry 36.79% around to two decimals; what the number says is "roughly a third".

{{< stopping-lab kind="secretary" >}}

### Why observing too much hurts

Split success into two multiplied factors:

- the probability that the global best has not yet been passed over;
- the probability of correctly recognising and taking the best, given that it has not been passed over.

The more you observe, the more reliable your benchmark, so the second factor rises. But the chance that the best is already behind you also rises, so the first factor falls. Their product produces an interior optimum.

Behind this sits a more general regularity: accumulating information and preserving opportunities are not aligned objectives. To obtain more information you sometimes have to give up opportunities you already hold.

## From the secretary problem to optimal stopping

The secretary problem is elegant but its assumptions are harsh: **fixed population**, **no going back**, **relative rank only**, **no need to judge absolute value**, **no room for good enough**. In real life almost none of them hold.

### The general form

Suppose at time $t$ you receive new information, forming the information set $\mathcal{F}\_{t}$, and decide whether to stop. Let $\tau$ be the stopping time, $R_\tau$ the payoff from acting, $C_\tau$ the accumulated search cost. The objective is

$$
\sup_{\tau\in\mathcal{T}}\ \mathbb{E}\left[R_\tau-C_\tau\right]
$$

What is optimised is not a fixed choice but a policy that decides, from the information in hand, when to stop.

As dynamic programming this means comparing two values: the payoff from acting now, $g_t(s)$, and the expected value of carrying on. The latter pays the current cost and then discounts the next period's value, with the expectation taken over future states given the current state $s$:

$$
\tilde V_{t+1}(s)=-c_t+\gamma\,\mathbb{E}_s\left[V_{t+1}(S_{t+1})\right]
$$

so the optimal value in each state is

$$
V_t(s)=\max\left\{\,g_t(s),\ \tilde V_{t+1}(s)\,\right\}
$$

| Symbol | Meaning |
| --- | --- |
| $s$ | Current state and information |
| $g_t(s)$ | Payoff from acting immediately |
| $c_t$ | Cost of continuing to search |
| $\gamma$ | Discount factor on future payoff |
| $V_t(s)$ | Expected value under the optimal policy |

Anyone who has met a value function in reinforcement learning will recognise this. Optimal stopping is a special Markov decision process: two actions per state, stop or continue, and stopping enters a terminal state.

### Why you need not cling to 37%

Change any assumption and the optimal policy changes:

| Change in the problem | How the optimal policy changes |
| --- | --- |
| Only relative ranks are observable | The classical 37% rule |
| Absolute scores and their distribution are known | A dynamic threshold based on score and remaining chances |
| Earlier candidates can be recalled | Keep the current best and keep searching |
| Searching is expensive | Stop earlier |
| The population size is unknown | Decide from arrival patterns and time costs |
| The global best is not required | Accept options above a payoff threshold |
| Multiple attempts and revisions are allowed | Becomes a general sequential decision problem |

The second row matters a lot. Gilbert and Mosteller studied the full-information best-choice problem in 1966: if candidate quality is i.i.d. with a known continuous distribution, the asymptotic optimal success probability rises from 36.79% to about 58.02%. If every option can be evaluated accurately and kept until a final choice, success is of course 100%.

| Information available | Asymptotic optimal success |
| --- | --- |
| Relative ranks only | 36.79% |
| Absolute quality and its distribution | 58.02% |
| All options observable before choosing | 100% |

Better decisions come not only from better stopping rules but from better information, better judgement, and from altering the constraints of the decision itself.

## Search theory: how many apartments should you actually see

Buying property differs from the secretary problem in four conspicuous ways: the number of listings is unknown; a viewed listing can often be revisited; you can judge absolute quality roughly; and viewing costs time and energy. The better fit is search theory, classically McCall's 1970 job-search model.

### The reservation value

Let the value of an opportunity be a random variable $X$, let the best option you can keep be worth $b$, and let one more search cost $c$. The expected incremental value of searching once more is

$$
\begin{aligned}
\Delta V(b)&=\mathbb{E}\left[\max(X,b)-b\right]\\
&=\mathbb{E}\left[(X-b)^+\right]
\end{aligned}
$$

where $(X-b)^+=\max(X-b,0)$. If opportunity values follow a distribution $F(x)$, then

$$
\Delta V(b)=\int_b^{\infty}\left[1-F(x)\right]\mathrm{d}x
$$

Under the classical conditions — i.i.d. draws, fixed search cost, the current best kept — the stopping threshold $b^*$ satisfies

$$
\mathbb{E}\left[(X-b^*)^+\right]=c
$$

This $b^*$ is the reservation value; in a job search it is the reservation wage. Once the current opportunity clears it, carrying further search costs no longer pays.

### A worked example

Let quality be uniform on 0 to 100, $X\sim U(0,100)$. Then

$$
\Delta V(b)=\int_b^{100}\frac{x-b}{100}\,\mathrm{d}x=\frac{(100-b)^2}{200}
$$

Setting this equal to the search cost $c$:

$$
b^*=100-\sqrt{200c}
$$

With a search cost equivalent to 2 points, the threshold is 80. Holding an option above 80, another search no longer covers its cost.

Same neighbourhood, quality still uniform on 0 to 100, but two different people.

One lives nearby: a ten-minute drive to each viewing, so the time and effort of one more search is worth about 2 points. Plugging into $b^*=100-\sqrt{200c}$, their reservation value is 80. A house below 80 is worth one more look; above 80, they sign.

Another flies in from out of town: every viewing takes leave, a train ticket and a hotel night, worth about 12.5 points. The same formula gives

$$
b^*=100-\sqrt{200\times 12.5}=100-50=50
$$

so their reservation value is just 50. A 65-point house is not good enough for the first buyer, but the second should already accept it.

Both look at the same homes with the same judgement. The only difference is search cost. Multiply the cost more than sixfold and the reasonable standard falls by 30 points. So "how many should I see before deciding" has no universal answer — it depends on who you are, where you are, and how much time you have. The higher the search cost, the sooner you accept good enough.

The model yields four conclusions with mathematical backing: cheaper search justifies chasing higher quality; a stronger current option shrinks the gain from continuing; a tighter deadline pushes you to accept good enough; and a more favourable distribution of future opportunities raises the acceptance standard.

{{< stopping-lab kind="search" >}}

So "look at a hundred" is not a derived result but a rule of thumb about gathering enough information. The real principle is the balance of marginal benefit and marginal cost, and that threshold depends on the quality distribution, the cost of viewing, your judgement, and what you already hold. Change the city, the budget or the timeline and the number changes too.

## The value of information: why big decisions deserve research

Searching is not only about finding a better option; it can also be about improving your ability to evaluate the options you already have. These are different problems.

Viewing the fiftieth apartment, you may not like it at all, yet its transaction price, finish and location sharpen your read on the previous forty-nine. That viewing still produced value.

### The definition

Let $a$ be an action, $\theta$ an uncertain state, $U(a,\theta)$ the payoff. Without new information the best expected payoff is

$$
V_0=\max_a \mathbb{E}_\theta\left[U(a,\theta)\right]
$$

After observing $Y$ you can re-decide:

$$
V_1=\mathbb{E}_Y\left[\max_a \mathbb{E}_{\theta\mid Y}\left[U(a,\theta)\right]\right]
$$

The expected value of the information is the difference:

$$
\mathrm{EVSI}=V_1-V_0
$$

EVSI stands for expected value of sample information. As long as the cost of acquiring it stays below this, further information is worth paying for.

### Why property deserves many viewings and a jacket does not

Suppose research lets you avoid a loss equal to 5% of the transaction value:

| Decision | Amount involved | Loss potentially avoided |
| --- | --- | --- |
| A jacket | ¥500 | ¥25 |
| A phone | ¥6,000 | ¥300 |
| A car | ¥300,000 | ¥15,000 |
| An apartment | ¥5,000,000 | ¥250,000 |
| A long-term career choice | Millions in income and opportunity | Potentially very large |

The 5% is illustrative, not a statistical finding. But it points at a principle: research effort should be matched to the long-term impact and irreversibility of the decision.

Many people do the reverse — hours of comparison shopping for a cheap item, then a single impression to choose a job, a city or a career. From an information-economics view, that is inefficient allocation of decision resources.

## Explore versus exploit: why youth should widen the sample

Optimal stopping assumes that choosing ends the process. Life is not like that: you can take a job and then switch, try a model and then adjust, learn a skill and then pivot.

- Exploration: try unknown options, gain information, discover higher payoffs.
- Exploitation: concentrate resources on known good options and collect steady returns.

This is the central tension of reinforcement learning and the multi-armed bandit. The classic UCB rule scores each option as

$$
a_t=\arg\max_i\left[\underbrace{\hat{\mu}_i}_{\text{estimated payoff}}+\underbrace{c\sqrt{\frac{\ln t}{n_i}}}_{\text{exploration bonus}}\right]
$$

where $n_i$ is how often option $i$ has been tried. A direction with a modest estimated payoff can still deserve priority if it has barely been sampled and remains uncertain. This is one mathematical basis for widening your sample of life.

{{< stopping-lab kind="mab" >}}

UCB does carry specific statistical assumptions, and a career is not a stationary, independent bandit. What is worth borrowing is the joint consideration of potential payoff and uncertainty.

Exploration is not free. Skills, networks, capital and reputation compound, captured crudely by

$$
K_{t+1}=(1-\delta)K_t+I_t
$$

Switching directions depreciates the old $K$ at rate $\delta$ and restarts the new one from zero. The ideal is therefore not "explore when young, exploit when old" but one direction that produces steady returns, with a standing budget for trying new ones.

## Applied to concrete decisions

### Housing: build a benchmark, then recognise the opportunity

First-time buyers hit two problems: they don't know what a fair price is, and they don't know what they actually want. A more disciplined process has three stages.

Stage one, broad sampling. Learn about districts, prices, layouts, building ages, management and commuting. Don't transact; the task is market literacy and clarifying your real requirements.

Stage two, narrowing. Rule out listings that fail hard constraints, build a valuation standard from actual transaction prices, and stop adding volume blindly in favour of targeted search.

Stage three, decide on preset conditions. When a listing meets core needs, the price is reasonable, title and quality checks pass, and further search has limited incremental value, consider buying.

Thirty representative apartments may beat a hundred near-identical ones. This is the statistical question of sample representativeness: effective sample size matters more than raw count.

### Job search: don't lock in early, don't chase forever

Suppose you expect to see 30 potential roles during campus recruiting. The secretary-problem lesson is not to commit to the first firm too early, but to use interviews, conversations and salary discussions to learn how the market prices you.

A weighted evaluation model helps:

| Dimension | Example weight |
| --- | --- |
| Long-term career growth | 30% |
| Compensation and benefits | 25% |
| Industry prospects | 20% |
| Team and technical level | 15% |
| Work-life balance | 10% |

Composite utility is

$$
U_i=\sum_{j=1}^{m}w_jx_{ij}
$$

where $w_j$ is the weight of dimension $j$ and $x_{ij}$ is offer $i$'s score on it. Under these weights, an offer scoring 90, 85, 90, 80, 60 comes to 84.3. Both weights and scores are illustrative: set your own and audit hard constraints separately.

{{< stopping-lab kind="offer" >}}

Real job searches differ from the secretary problem: offers expire, and several processes can run in parallel. So beyond optimising the stopping rule, change the rules — ask for extensions, run interviews concurrently, line offers up in the same window. Increasing how many opportunities you can hold at once often beats fine-tuning when to stop.

### Partners: learn your preferences, don't chase a global optimum

Partner choice is often used to illustrate the secretary problem: search from 20 to 30, so the 37% rule says end the observation phase around 23.7. That inference is loose, because intimate relationships violate the assumptions badly:

| Secretary problem | Partner choice in reality |
| --- | --- |
| Fixed number of candidates | Unknown how many you will meet |
| Fixed candidate quality | People grow and change |
| Unilateral choice | Mutual selection |
| Quality judged immediately | Deep traits need time together |
| A single ranking | Values, temperament and goals are multidimensional |
| Payoff fixed once chosen | Relationship quality is built jointly |

What transfers is this: before committing long term, meet a range of people through real social life and learn your own preferences, boundaries and core needs. But there is no reason to deliberately reject the first 37%, and certainly no reason to abandon a good relationship because a theoretically better partner might exist. Partner choice is less about taking the maximum from a pool than about finding someone long-term compatible and building value together.

### Investing: act after research, don't wait for the perfect entry

The familiar bind: buy now and it may fall tomorrow; wait and it may run away.

Holding cash preserves the option to invest later, but waiting carries opportunity cost in appreciation, dividends and compounding. One important improvement is to avoid a single all-in decision. Staged entry, regular investing and target allocations convert a hard one-shot stopping problem into a staged one.

For long-term index investing, hunting the absolute bottom is not a sensible objective. For individual stocks, thresholds based on valuation, fundamentals and risk usually beat mechanically waiting for some fraction of time to elapse.

### Career: when to stop exploring and go deep

Probably the most useful application for younger readers. Suppose four directions: build expertise in a mature industry, enter a fast-growing technology field, start a company, or build an audience as a creator.

Careers differ because payoffs are not fixed: time invested builds capability, network and resources, which reshape future payoff distributions. The equation $K_{t+1}=(1-\delta)K_t+I_t$ is the reminder that frequent switching raises learning costs and destroys accumulation.

A reasonable arrangement runs a core direction alongside exploration. 70/20/10 is a workable example: 70% into the core for capability and long-term returns, 20% into adjacent exploration, 10% into cross-domain bets with non-linear upside. It is not a proven optimum, but it maintains accumulation without foreclosing discovery.

{{< stopping-lab kind="resource" >}}

## Changing the problem beats solving it

The rules of the secretary problem cannot be changed. In life they usually can:

| Original problem | How to change the decision structure |
| --- | --- |
| Must decide on the spot | Prepare valuation, financing and due diligence in advance |
| Offer about to expire | Ask for an extension, interview in parallel |
| Unsure about a career switch | Ship a low-cost project or part-time trial first |
| Unsure about a city | Live there briefly before settling |
| Unsure a venture will work | Build an MVP to test real demand |
| Unsure about investing now | Stagger entries rather than one decision |
| Unsure a research direction is viable | Run a small pilot experiment |

Behind this is real options theory: under uncertainty, the right to wait, scale up, scale down or exit has economic value in itself.

Rather than trying to think your way to the one correct answer, break a major irreversible decision into a series of small reversible experiments. The traditional mode is a single irreversible verdict; the sequential mode is staged commitment with continuously updated beliefs. The latter caps the cost of being wrong and uses real feedback to correct judgement.

## Conclusion

After all the derivation, what deserves long-term use is not the number 37% but these six points.

1. Make no major commitment before your evaluation criteria are reliable. With too little information you do not even know what level the current opportunity occupies.
2. Deliberately widen your effective sample. More varied people, industries, cities and ways of living both surface opportunities and improve your evaluation system.
3. Allocate research effort in proportion to importance. The more valuable, long-term and irreversible the decision, the more time it deserves; everything else should be finished quickly.
4. Do not chase the global optimum; chase the expected optimum net of cost. Waiting indefinitely for a possibly better option does not necessarily raise final payoff.
5. Convert irreversible major decisions into reversible small experiments wherever possible. Much uncertainty cannot be reasoned away, only discovered through action.
6. Keep accumulating along one direction while retaining capacity to explore. Neither freeze so early that new possibilities vanish, nor explore so long that compounding never starts.

Applied to any particular case, how deep the exploration should go depends on just two variables: what the decision is worth, and whether a mistake can be undone. Cross them and the required density follows:

| Decision type | Suitable strategy |
| --- | --- |
| Low value, reversible | Decide fast, minimise cognitive cost |
| Low value, irreversible | Satisfy basic conditions and move on |
| High value, reversible | Small-scale trial and error, adjust dynamically |
| High value, irreversible | Deep research, strict stopping threshold |

The cell that goes wrong is not the first but the last: something expensive that cannot be undone, handled the way the first cell is handled — decided offhandedly, then paid for over a long time.

Everything above is one tension seen from two sides: accumulating information and preserving options pull against each other, and to look at a few more you must give up a few. Deciding early pays for insufficient information; deciding late pays for opportunities lost.

The purpose of a decision is not to eliminate uncertainty, but to find, while uncertainty persists, the moment worth acting on.

Map first, then move.
