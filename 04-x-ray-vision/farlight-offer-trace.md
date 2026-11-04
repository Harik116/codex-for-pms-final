# Farlight offer trace

## Candidate incident

Ticket #3110 was filed by Linda Pruitt on 29 August 2026 at 13:28:20. It describes an offer received "last night," the first in five days, which disappeared before Farlight could answer. The ticket contains no callout identifier, so the match below is strong but unconfirmed.

All times below use database source-local timestamps; no timezone conversion is applied.

| Event | Date and time | Source |
|---|---|---|
| Previous recorded Farlight offer | 23 August 2026 13:51:03 | Callout #41160; missed |
| Candidate incident arrives | 28 August 2026 19:28:12 | Callout #41245; Mill District |
| Offer sent to Farlight | 28 August 2026 19:28:20 | Ping outcome: missed |
| Offer sent to Cindermark | 28 August 2026 19:29:21 | Same callout; outcome: taken |

The next offer was sent 61 seconds after Farlight's. This is consistent with the configured 60-second timeout, but does not measure Farlight's display duration or exact expiry. Cindermark's timestamp is offer-send time, not acceptance time.

## What the supplied code establishes

- `config.py:9`: `OFFER_TIMEOUT_SECONDS = 60`, documented as 90 before 4.2.
- `offer.py:41`: calls `push_to_device`.
- `offer.py:42`: sets a server deadline 60 seconds after that function returns; it does not explicitly wait for a display acknowledgement.
- `offer.py:43`: polls for a response until the deadline.
- `offer.py:47`: withdraws the offer if no answer was returned, then returns `missed`.
- `offer.py:30` and `history.py:39`: a miss receives the same 0.12 recent-acceptance score penalty as an explicit decline.

The device push, poll and withdrawal helpers are placeholders in the supplied code. This establishes the shown control flow, not verified production delivery behavior or the exact runtime path for this incident.

## Missing evidence

The five available database tables contain no delivery/display acknowledgement, expiry timestamp, acceptance-attempt timestamp or historical routing score. No log/event/trace files were found in the course workspace filename search. Therefore the actual usable response window is unknown.

Request push dispatch completion, device receive/display, expiry/withdrawal, tap and server receipt events for callout #41245, with correlated IDs and aligned clocks. Confirm the ticket-to-callout match with the handler. Repeat on several successful and missed offers to distinguish ordinary timeout, delayed delivery and early expiry. If the events were not recorded, instrument them before claiming how long the responder had.
