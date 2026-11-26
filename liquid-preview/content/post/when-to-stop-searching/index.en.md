---
title: "When to Stop Looking"
description: "From ten apartments in a podcast to the 37% rule, reservation values in search theory, and why queueing theory asks a different question."
slug: when-to-stop-searching
date: "2026-11-26T20:33:00+08:00"
written: "2026.11"
note: true
hidden: true
share: false
license: false
math: true
---

> Putting a few routinely confused theories in their proper places: the secretary problem, optimal stopping, search theory, the value of information, and the queueing theory that got pulled in along the way.

A few days ago I listened to an episode with Justin Sun. He argued that before buying an apartment you should look at a hundred of them, and gave a smaller version of the same story: ten apartments, buy too early and you may miss a better one, buy too late and the earlier ones are gone — so which one do you take? He also mentioned 0.618.

The direction is right. The number is not. Chasing it down, I found several distinct theories stacked together and usually discussed as one. What follows reorders them by the question each actually answers.

## How to buy one of ten apartments

Write the problem in canonical form: $n$ options arrive in random order; after each you must decide immediately; a rejection cannot be taken back; you can only tell whether an option is better or worse than everything before it, not its absolute quality; and the goal is the single best one.

This is the secretary problem. The answer: reject the first 37%, then take the first candidate better than everyone already seen.

The derivation is short. Let the first $r$ be observed and rejected, and let the global best sit at position $k$. Success needs two things at once — the best arrives after the observation window, $k>r$; and among the first $k-1$ candidates the best falls inside the first $r$, otherwise you would have locked in someone suboptimal earlier. Hence

$$
P(r)=\sum_{k=r+1}^{n}\frac{1}{n}\cdot\frac{r}{k-1}
=\frac{r}{n}\sum_{k=r+1}^{n}\frac{1}{k-1}
$$

Let $n\to\infty$ and $x=r/n$; the sum becomes an integral:

$$
P(x)\approx -x\ln x
$$

Set the derivative to zero:

$$
P'(x)=-\ln x-1=0\quad\Longrightarrow\quad x^*=\frac{1}{e}\approx 36.79\%
$$

Substituting back gives a rather elegant result: $P(x^*)=1/e$, about 36.79%. The optimal observation fraction and the resulting success probability are the same number. Even with a million candidates this strategy still finds the best one with probability near 37%, against one in a million for picking blindly.

Approximate success rates at $n=100$:

| Fraction observed | Probability of picking the best |
| --- | --- |
| 5% | 15.0% |
| 10% | 23.0% |
| 20% | 32.2% |
| 30% | 36.1% |
| **36.79%** | **36.79%** |
| 50% | 34.7% |
| 61.8% (golden ratio) | 29.7% |
| 80% | 17.9% |
| 90% | 9.5% |

Two things stand out. First, observing 61.8% yields 29.7% — the golden ratio does worse here than simply looking at a third. Second, the optimum is remarkably flat: 30% and 37% differ by half a percentage point. There is nothing sacred about 36.79%; what it says is "roughly a third", and that both too little and too much observation cost you.

For ten apartments the exact optimum is not "the first 3.7" but the first 3: look at three, buy none, then from the fourth onward take the first one better than all three. That succeeds 39.87% of the time, slightly above the asymptotic value.

## The secretary problem is one special case

The secretary problem is easy to explain because it compresses all uncertainty into a relative ranking. The price is a rigid set of assumptions. Relax any one of them and you have a different problem — laid out side by side, they also show where the later theories belong:

| Condition | Secretary problem | Buying property | Better fit |
| --- | --- | --- | --- |
| Population size | Known | Unknown | Search theory |
| Revisiting | Forbidden | Usually possible | Search theory |
| Evaluation | Relative rank only | Absolute quality | Search theory |
| Cost of information | Ignored | Real time and effort | Value of information |
| Objective | The global best | Good enough | Satisficing |

In general form this becomes optimal stopping:

$$
\sup_{\tau\in\mathcal{T}}\ \mathbb{E}\left[R_\tau-C_\tau\right]
$$

What you optimise is not a fixed choice but a policy that decides, from the information seen so far, when to quit. As dynamic programming its skeleton is familiar:

$$
V_t(s)=\max\Big\{\underbrace{g_t(s)}_{\text{act now}},\ \underbrace{-c_t+\gamma\,\mathbb{E}\left[V_{t+1}(S_{t+1})\mid S_t=s\right]}_{\text{wait}}\Big\}
$$

If you have met a value function in reinforcement learning, you have met this one. Optimal stopping is a special Markov decision process: two actions per state, stop or continue, and stopping jumps straight to a terminal state.

## Buying property is a search problem

The first two rows of that table — unknown population, revisiting allowed — push the apartment question into search theory. The classical model is McCall's 1970 job search model, and its centre is a threshold. Let opportunity value be a random variable $X$, let the option you can currently keep be worth $b$, and let one more search cost $c$. The expected gain from searching once more is

$$
\Delta V(b)=\mathbb{E}\left[(X-b)^+\right]=\int_b^{\infty}\left[1-F(x)\right]\mathrm{d}x
$$

Where this just equals the cost of searching, you have the break-even point $b^*$, the reservation value:

$$
\mathbb{E}\left[(X-b^*)^+\right]=c
$$

A worked example. If quality is uniform on 0 to 100, $X\sim U(0,100)$, then

$$
\Delta V(b)=\int_b^{100}\frac{x-b}{100}\,\mathrm{d}x=\frac{(100-b)^2}{200}
$$

Setting this equal to $c$ gives $b^*=100-\sqrt{200c}$. With a search cost equivalent to 2 points the threshold is 80: once you hold an option above 80, another search no longer pays for itself.

The conclusions all feel obvious, but they are computed rather than felt: cheaper search justifies chasing higher quality; a stronger current option shrinks the gain from continuing; a tighter deadline pushes you toward "good enough".

So "look at a hundred" is not a theorem, it is a rule of thumb. The actual principle is marginal benefit equal to marginal cost, and that threshold depends on the quality distribution, the cost of viewing, your own judgement, and the option you already hold. Change the city, the budget or the timeline and the number changes with them.

## Queueing theory asks something else

The same podcast mentions queueing theory, easy to lump in. It asks a different question: how to match randomly arriving demand against limited service capacity.

In the classic M/M/1 model, with arrival rate $\lambda$, service rate $\mu$ and $\lambda<\mu$, the mean time in system is

$$
W=\frac{1}{\mu-\lambda}
$$

Written in terms of utilisation $\rho=\lambda/\mu$, this is $W=\dfrac{1}{\mu(1-\rho)}$, and the trouble is visible: as $\rho$ approaches 1, waiting time does not grow linearly, it diverges. At 80% utilisation the mean time in system is 5 times the mean service time; at 90% it is 10 times; at 99% it is 100 times. This is why service systems should not run at full load, and why GPU inference clusters, hospital appointments and bank counters all keep slack.

It shares its probabilistic machinery with optimal stopping, but one asks "how much capacity do I need" and the other asks "when should I act". Their only real overlap is that both put a price on waiting — one on how long the queue takes, the other on whether waiting is worth it.

## Looking also recalibrates your judgement

The cost-of-information row of that table hides half the argument. Viewing the fiftieth apartment, you may dislike it entirely, yet its asking price, its transaction price, its finish and its location sharpen your sense of what the previous forty-nine were really worth. That viewing still produced value — not by finding an option, but by calibrating the function you evaluate options with.

Without new information your best expected payoff is $V_0=\max_a \mathbb{E}_\theta[U(a,\theta)]$; after observing $Y$ you can re-decide, so it becomes $V_1=\mathbb{E}_Y\left[\max_a \mathbb{E}_{\theta\mid Y}[U(a,\theta)]\right]$. The difference

$$
\mathrm{EVSI}=V_1-V_0
$$

is what the information is worth. As long as the cost of obtaining it stays below that, keep looking.

This explains why thirty apartments are worth viewing and a five-hundred-yuan jacket is not worth three hours of comparison shopping: the same method, applied to amounts and irreversibility that differ by orders of magnitude, returns orders of magnitude differently. Many people do the reverse — agonising over a cheap purchase, then choosing a city or a job on a single impression.

A hundred is not necessarily better than thirty, either. If the hundred are near-identical the information gain flattened out long ago; thirty covering different districts, layouts and building ages may tell you more. Effective sample size is about variety, not count.

## The return on exploring, and its cost

Optimal stopping also assumes that choosing ends the story. But jobs can be changed, directions can pivot, cities can be left. The better description is exploration versus exploitation, whose algorithmic face is the multi-armed bandit. The classic UCB rule scores each option as

$$
a_t=\arg\max_i\left[\underbrace{\hat{\mu}_i}_{\text{estimated payoff}}+\underbrace{c\sqrt{\frac{\ln t}{n_i}}}_{\text{exploration bonus}}\right]
$$

A direction with a modest estimated payoff can still deserve a try if it has barely been sampled and remains uncertain. This is one mathematical basis for widening your sample of life while young: what you learn early shapes decisions for decades, so its information value is unusually high.

Exploration is not free. Skills, networks, reputation and capital accumulate, crudely captured by $K_{t+1}=(1-\delta)K_t+I_t$ — switching directions depreciates the old $K$ at rate $\delta$ and restarts the new one from zero.

So the sensible arrangement is not "explore when young, exploit when old" but one main direction plus a standing exploration budget. A 70/20/10 split is worth trying as a starting point, not as an optimum.

## Changing the problem beats solving it

The least realistic thing about the secretary problem is that none of its rules can be changed. In life most of them can:

| Original problem | What can be changed |
| --- | --- |
| Must decide on the spot | Do valuation, mortgage pre-approval and due diligence in advance |
| The offer expires soon | Ask for an extension, run interviews in parallel |
| Unsure about a career switch | Ship a small side project first |
| Unsure about a city | Rent there for three months |
| Unsure the demand is real | Build an MVP |
| Unsure about timing the market | Stagger entries instead of going all in |

Behind this is real options theory: under uncertainty, the right to wait, scale up, scale down or exit has economic value in itself. Breaking one irreversible decision into a series of reversible experiments caps your downside, and each round of real feedback corrects your judgement.

## To close

Everything above is one tension seen from two sides: accumulating information and preserving options pull against each other, and to look at a few more you must give up a few. Deciding early pays for insufficient information; deciding late pays for opportunities lost. The rational move is neither endless collection nor a gut call, but the cheapest point between them.

If only four lines survive:

- Make no major commitment before your evaluation criteria have formed.
- Effective sample size comes from variety, not count.
- Allocate research effort by the stakes and the irreversibility.
- Anything that can be split into small experiments should not be a single verdict.

The specific number matters far less than the structure it reveals: the point of a decision was never to eliminate uncertainty, but to find, while uncertainty persists, the moment worth acting on.

Further reading: *Algorithms to Live By* by Brian Christian and Tom Griffiths — chapter one is optimal stopping, chapter two is explore versus exploit, and it works well as an entry point.
