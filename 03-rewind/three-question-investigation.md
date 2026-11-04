# Three questions about the post-release change

Source: all 1,696 individual rows in Rook's pings table, plus weekly counts from callouts and area mappings from responders. No routing code inspected. This is fictional course data.

## Periods

Baseline: 29 June–9 August, six full weeks. Post-release: 17 August–6 September, three full weeks. Excludes the mixed week of 10 August from pooled comparisons. These differ from the earlier exact-date pre/post-12 August comparison.

## 1 Does the responder mix hide deterioration

Baseline: 794 taken / 1,034 pings = 76.79%. Post: 332 / 485 = 68.45%.

Weight each responder's pooled post acceptance by their baseline share of pings: sum((baseline responder pings / 1,034) * (post taken / post pings)) = 54.07%. This holds offer shares fixed, not incident characteristics or availability. It is a descriptive standardization, not a causal forecast; quiet responders have very small post samples.

| Responder | Baseline pings | Baseline taken | Post pings | Post taken |
|---|---:|---:|---:|---:|
| Captain Vantage | 72 | 53 | 50 | 37 |
| Cindermark | 54 | 43 | 35 | 25 |
| Corporal Ashgrove | 60 | 47 | 22 | 15 |
| Farlight | 72 | 53 | 4 | 0 |
| Halfmoon | 66 | 48 | 25 | 17 |
| Ironvale | 48 | 37 | 33 | 23 |
| Meteor Mite | 67 | 46 | 7 | 1 |
| Nightwell | 90 | 68 | 59 | 42 |
| Sgt. Bulwark | 54 | 41 | 32 | 23 |
| Sgt. Falkirk | 60 | 48 | 44 | 31 |
| Stormwrack | 78 | 62 | 53 | 40 |
| The Drift | 37 | 31 | 23 | 16 |
| The Gale | 78 | 61 | 58 | 42 |
| The Longcast | 43 | 32 | 26 | 18 |
| The Undertow | 72 | 56 | 6 | 1 |
| Vesper | 83 | 68 | 8 | 1 |

Farlight, Meteor Mite, The Undertow and Vesper together: 294/1,034 baseline pings (28.43%) versus 25/485 post pings (5.15%). In the final week they receive 3/165 (1.82%).

Weekly fixed baseline shares: release week 53.56%; 17 August 55.45%; 24 August 49.28%. For 31 August Farlight has no observed pings, so a full-cohort standardized point estimate is undefined. Allowing her unknown acceptance to vary from 0–100% gives 53.34–60.30%. Do not silently drop her or label zero offers as a 0% observed acceptance rate.

## 2 Do misses rise before offers fall

| Week | Responder | Pings | Taken | Missed | Turned down |
|---|---|---:|---:|---:|---:|
| 2026-08-03 | Farlight | 12 | 8 | 1 | 3 |
| 2026-08-03 | Meteor Mite | 11 | 8 | 0 | 3 |
| 2026-08-03 | The Undertow | 12 | 9 | 0 | 3 |
| 2026-08-03 | Vesper | 14 | 12 | 0 | 2 |
| 2026-08-10 | Farlight | 10 | 4 | 4 | 2 |
| 2026-08-10 | Meteor Mite | 10 | 4 | 4 | 2 |
| 2026-08-10 | The Undertow | 11 | 4 | 5 | 2 |
| 2026-08-10 | Vesper | 12 | 6 | 4 | 2 |
| 2026-08-17 | Farlight | 3 | 0 | 2 | 1 |
| 2026-08-17 | Meteor Mite | 4 | 1 | 2 | 1 |
| 2026-08-17 | The Undertow | 4 | 1 | 2 | 1 |
| 2026-08-17 | Vesper | 5 | 1 | 3 | 1 |
| 2026-08-24 | Farlight | 1 | 0 | 1 | 0 |
| 2026-08-24 | Meteor Mite | 2 | 0 | 1 | 1 |
| 2026-08-24 | The Undertow | 1 | 0 | 1 | 0 |
| 2026-08-24 | Vesper | 2 | 0 | 1 | 1 |
| 2026-08-31 | Farlight | 0 | 0 | 0 | 0 |
| 2026-08-31 | Meteor Mite | 1 | 0 | 1 | 0 |
| 2026-08-31 | The Undertow | 1 | 0 | 1 | 0 |
| 2026-08-31 | Vesper | 1 | 0 | 1 | 0 |

Across all responders: baseline misses 24/1,034 = 2.32%, post misses 73/485 = 15.05%. Explicit declines 216/1,034 = 20.89% before, 80/485 = 16.49% after. Four responders have sharply elevated release-week misses followed by fewer weekly offers. Weekly sequence supports investigation of a feedback loop but does not establish the within-week sequence, timeout causation or ranking penalties.

## 3 Is there less work or different allocation

| Week starting | City callouts |
|---|---:|
| 2026-06-29 | 141 |
| 2026-07-06 | 139 |
| 2026-07-13 | 138 |
| 2026-07-20 | 144 |
| 2026-07-27 | 137 |
| 2026-08-03 | 138 |
| 2026-08-10 | 110 |
| 2026-08-17 | 121 |
| 2026-08-24 | 124 |
| 2026-08-31 | 127 |

City callouts average 139.5/week baseline versus 124/week post, down 11.11%. Demand declines may contribute, but the four quiet responders' combined offers decline 83.0% (49/week to 8.33/week). Availability and capability eligibility are not observed.

| Responder | Home area | Baseline area callouts/week | Post area callouts/week | Baseline responder pings/week | Post responder pings/week |
|---|---|---:|---:|---:|---:|
| Farlight | Uptown | 9.50 | 9.00 | 12.00 | 1.33 |
| Meteor Mite | Eastgate | 18.67 | 16.00 | 11.17 | 2.33 |
| The Undertow | Harborside | 10.17 | 9.33 | 12.00 | 2.00 |
| Vesper | Old Town | 11.50 | 11.33 | 13.83 | 2.67 |

Home area does not imply eligibility or exclusive service territory. Pings may repeat across responders for one callout; callout and ping counts are not interchangeable.

Eastgate example: Meteor Mite's Eastgate-callout pings by week from 29 June: 10,10,8,11,11,9,8,3,1,0. The Gale's: 12,11,13,11,13,12,11,14,16,17. Local callouts: 18,18,17,19,21,19,15,15,16,17. Observed offers shift within a shared area; cannot establish which responder was eligible or why one was selected.

Missing from available tables: historical availability, responder capability tags, structured incident capability requirements, candidate rankings, travel-time scores, timeout configuration history and delivery/response latency. what_happened is free text, not a validated requirement field. Request historical candidate/decision logs and consult Wen/Marcus; code can explain intended behavior but not prove a particular historical selection.

Conclusion: the aggregate conceals changes in who receives offers; misses increase; demand is insufficient by itself to explain the observed pattern. Root cause remains unproven.

