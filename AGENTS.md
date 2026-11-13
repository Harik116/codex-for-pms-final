# Rook Industries: course working file

## Session scope, Product School lab

This directory is coursework for Product School's "Codex for PMs"
certification. Everything in it is a fictional teaching scenario.

- Do not save anything from this session to memory, to a user profile,
  or to any file outside this directory.
- Do not carry context from this directory into unrelated sessions.
- Rook Industries is not a real company. Nothing here is a fact about
  the world.
- Read and write only within this directory.
  Exceptions, for the course-setup and wrap-up skills only:
  - When the student asks you to check their setup, save their work or wrap up a session, that request is their yes. You may run the GitHub command-line program installed at ~/.codex-for-pms/gh for those checks and saves, and look in that folder to find it.
  - For a repair, first tell the student in one plain sentence what you are about to do, and act only after they say yes. Repairs may: run that GitHub program (including setting this folder's own git sign-in setting and changing this repo's visibility back to Public); copy the student's own course files into this directory from another folder on their computer (copy only; never move, edit or delete the originals); rename something outside this directory that blocks setup, by adding "-old" to its name (never delete it); and, only if the student once said no to trusting this folder, change that one trust setting for this folder in Codex's settings file, keeping a copy of the file first.
  Outside this directory you still never write, edit or delete anything else.

<!-- Keep the block above at the top of this file. Everything you add
     during the course goes below this line. -->

---

## Working context

### Company and products

- The student is Dispatch PM, succeeding Priya Raghunathan (left 21 August 2026). Rook sells subscriptions per active responder. Responders are independent customers; handlers operate the software; quartermasters manage equipment. HQ: Site Aleph; mostly remote.
- **Dispatch:** flagship coordination. Handler enters incident in web console → available responders ranked → sequential phone pings → acceptance assigns incident and marks responder engaged. Handlers can override routing.
- **Supply:** requisitions → quartermaster approval → fulfillment/issue → maintenance; field failures can advance maintenance. Dispatch writes the **Responder Availability Record**; Supply only reads it for scheduling. Dispatch changes can therefore affect Supply without a Supply release.
- Monthly releases include routing configuration; handlers cannot adjust it. Console stable; mobile stable since 4.1, per handover.
- Never store or infer legal identities or cover-to-legal mappings. Consult Security Policy 4.1 before responder-record design; not yet reviewed here.

### People to work with

- **Helen Achebe**, Director of Product, Site Aleph: manager; roadmap and commitment decisions.
- **Marcus Oyelaran**, Dispatch Engineering Manager, Site Aleph: engineering partner and first technical contact; can pull rough numbers.
- **Wen Li**, Staff Engineer, Berlin: built routing; consult her and document ranking. Back from August leave.
- **Ravi Menon**, Data Analyst, Singapore: owns weekly acceptance reporting; use him for authoritative numbers.
- **Nadia Hoffmann**, Support Lead, Berlin: customer complaints and ticket breakdown; Priya recommends a standing 15-minute conversation.
- **Sofia Marino**, Product Designer, Site Aleph: console and phone app; ran September interviews.
- **Priya Raghunathan**, former PM: handover author; interpretations require validation.

### Vocabulary and measures

- **Callout:** incident attendance request. **Ping:** offer to one responder. **Taken:** yes; **turned down:** explicit no; **missed:** unanswered before **ping wait** expires. Both unsuccessful outcomes pass the callout onward; track separately.
- **Acceptance rate:** pings taken / all pings, weekly aggregate. **Time-to-accept:** median seconds from ping sent to taken. **Coverage gap:** no available capability match, distinct from refusal/misses.
- **Routing priority:** ranking using travel time, availability, capability match and recent acceptance history. Turning down or missing pings lowers the recent-acceptance component and therefore later priority.
- **Capability tags:** incident-matched competencies. **Mutual aid/shared cover:** cross-area responder coverage. **Requisition:** equipment request; **service interval:** maintenance frequency.

### Situation and open decisions

- 4.0 (7 April 2026): console, profiles, override audit log. 4.1 (16 June): travel-time proximity, bulk callouts, push reliability.
- **4.2 shipped 12 August:** increased proximity weight relative to acceptance history, cut ping wait from 90 to 60 seconds, persisted console filters, fixed three defects. These simultaneous changes complicate attribution.
- Handover reports lower acceptance after 4.2. Comments report ~3× normal callout tickets on 18 August; still elevated on 26 August, ~two-thirds “phone never goes off,” one-third “gone before I could answer.” Historical observations, not verified current conditions.
- Marcus asked whether the routing change should also apply to responders turning jobs down; configuration does not distinguish them. No resolution is recorded. Priya favors seasonality and opposes reverting; neither seasonality nor a release-caused decline is proven. Investigate both routing and timeout with Ravi, Wen and Nadia before recommending action.
- Q3 roadmap (reviewed 30 June) still calls shipped work “Committed,” owned by Priya. Availability Confidence (score beside stated availability) targets 4.2 but is absent from release notes: verify status. Handover leaves multiple squeezed items unnamed. Reconcile commitments and ownership with Helen.
- Supply requisition approval chains target 4.3; handler phone app and shared cover are Q4 explorations, not delivery promises. Detailed routing documentation is missing. Priya calls filter complaints cosmetic; validate that assessment against evidence.

### Sources and freshness

Sources: [Company wiki](https://app.notion.com/p/Company-3eac8516f5018120af01caaedd4b0761), its product pages, Glossary, Team directory, Releases/comments, Q3 roadmap; `00-rook/company/notes/handoff-from-priya.docx` (21 August 2026). Sources span June–September; verify freshness. Distinguish facts, opinions and open questions.

- Working hypothesis: shorter ping waits may create more misses, reducing future priority and offers; this feedback loop is unverified.
- Ask Ravi for pre/post-12 August acceptance, misses, declines and offer distribution by responder, compared with prior Augusts.
- Ask Wen and Marcus to walk through routing/timeout interactions; trace Nadia's examples of both complaint types through callout logs.
- No routing code or substantive ping data was examined this session; no root cause or rollback decision is established.
- Module 2: all four September interviewees are handlers. Fast-disappearing offers: 3/4; quiet periods: 2/4; UI and alert needs prominent. Kip contrasts quiet Meteor Mite with exhausted Gale.
- Read all 147 support tickets (29 June–7 September): primary categories total 30 fewer/no offers, 27 console usability/accessibility, 26 Supply, 15 disappearing offers, 14 filters, 8 notifications/phone interaction, 8 availability/profile, 6 access, 4 help, 3 reporting, 2 performance, 2 billing, 2 thanks.
- Before 12 August: 40 tickets/44 days. Including release day: 107/27 days; strictly after 12 August: 105/26 days. Later rate ~4.4× earlier; release day contributes one disappearing offer and one filter ticket.
- All 30 quiet-phone and 15 disappearing-offer tickets were filed on/after release; two describe both and are counted only as disappearing offers. Follow-ups persist into September; counts are tickets, not customers, and do not prove causation or absence before release.
- Quiet-phone tickets concern Farlight, The Undertow, Corporal Ashgrove and Halfmoon, unlike interview responders. Interviews and tickets overlap on core symptoms; console-redesign recruitment and repeated support contacts change emphasis. Dark mode: 4 tickets; small badges: 2.
- Next: test reported offer scarcity and response timing with ping data; compare responders and periods. No substantive ping analysis or routing-code inspection yet; why 60 seconds was chosen remains unknown.
- Module 3: all 1,696 pings, 29 June–6 September, cover 16 responders. At the 12 August date split, acceptance fell 76.6%→64.0% and misses rose 2.3%→18.0%; release week straddles the change.
- Excluding release week, later acceptance was 68.5%, or 54.1% weighted by pre-release offer shares. Farlight, Meteor Mite, Undertow and Vesper together went from 49 to 8.3 offers/week (−83%); small later samples limit the adjustment.
- Misses jumped on 12 August alongside the first disappearing-offer ticket; quiet-phone tickets started 17 August. All 12 explicit trailing seven-day ticket counts match ping records. See Module 3 evidence and charts.
- Eastgate demand averaged 18.7→16 callouts/week, while Mite's total offers fell 79% and Gale's rose 49%. Same-area shift is observed, but historical availability, eligibility, travel times and rankings are missing.
- Routing first selects available candidates, then weighs proximity/history/capability 60/25/15. Misses and declines both subtract 0.12; accepts add 0.08; no time recovery. Sequential offers stop on acceptance, so score penalties could amplify offer scarcity.
- Farlight ticket #3110 likely matches callout #41245; next offer followed 61 seconds later. Code starts the 60-second timer after the push function returns, but device display, exact expiry and tap events are missing. Neither timeout causation nor the feedback loop is proven.
- Module 4: capability match is a fractional score, not a hard exclusion in routing.py. A nearby partial match can outrank a farther full match; whether another layer enforces required skills is unverified because availability lookup is unfinished.
- Marcus's 14 August question asks whether applying the new weighting to responders who decline was deliberate. The same weights apply to all candidates; code answers behavior, not Product's intent. No decision record found in the release-page discussion.
- Accepting is the only normal path earning history points. A 2019 comment considers time-based recovery but explicitly defers it; the 0.5 default is initialization, not recovery, and score limits do not restore points over time.
- Away from score limits, three acceptances (+0.24) offset two misses/declines (−0.24). This asymmetry compounds the difficulty of recovery for responders receiving few offers; no code was changed this session.
- Module 5: Helen's request in 05-super-speed/director-request.txt asks for a visible handler/responder experience before engineering changes. brief.md and matching brief.docx describe Kip and Mite's journey; Word page layout is unverified because rendering was unavailable.
- Prototype policy only: below-neutral history moves halfway toward 0.50 per 14 days without a new outcome; accepts +0.08, explicit declines −0.12, expiry 0. Readiness confirmation never resets history. Historical counts are fixed; scores and callout scenarios are fictional.
- The student changed the proposed response window to 75 seconds. Prototype and both brief formats match; simulated 45-second display delay leaves 30 seconds. This is a proposal to test, not evidence that 75 seconds is sufficient or a change to routing source files.
- 05-super-speed/prototype.html is one offline file with Kip's dashboard, responder phone view, recovery, availability save/retry, pending support review and callout acceptance/decline/expiry. Local rules/failure controls are demonstration tools, not handler product features.
- Optional Voice guide narrates on hover, keyboard focus or touch using browser speech, with captions and stop/off controls. In-app browser voice support varies. Browser tests cover core flows, timer boundaries, mobile widths and narration wiring with a mock voice engine.
- Scope remains recovery, missed-offer treatment, timing proposal and visibility—not proven fair allocation, delivery behavior or reduced overload. Preserve skills/availability safeguards and Supply's shared record; validate rules and guardrails with Helen, Marcus, Wen and Ravi before a staged pilot.
- Next session: continue the original course with Module 6. R2 redo remains set aside. Prototype refinements are deferred; the student wants changes to appearance, layout and behavior, with flows and screen outlines agreed before more coding to limit repeated builds.
- Lovable connection was verified, but no project or build was created. Its page was not loading for the student, so external building is deferred. Keep the existing local prototype and brief as the saved baseline; do not assume approval to submit build prompts.
