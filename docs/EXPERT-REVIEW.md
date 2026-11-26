# Expert review packet

**Status: no independent expert review has been completed yet.** This page exists so that one can be done efficiently. Until a review is on record in the log at the bottom, treat the content as the author's best effort from public sources.

## What is being asked

About 45 to 90 minutes from someone with industrial control system, process safety, alarm management or OT security experience (or, for round 6, AI security). You do not need to play the whole game, but ten minutes with it helps: [play it](https://clarkngo.github.io/cauldron-control/).

Please review, in this order:

1. **The claims register** ([CLAIMS-REGISTER.md](CLAIMS-REGISTER.md)). Every factual statement the game makes after a round, with the sources it relies on. Mark each row *Accurate*, *Needs change* or *Cannot judge*. "Too strong" and "missing a caveat" are exactly the comments wanted.
2. **The model assumptions** (the "Simulation model" table at the end of the register, M1 to M12). The physics is deliberately simple. Does any simplification teach a wrong lesson?
3. **Scenario fairness and responsibility.** Rounds 3, 4 and 6 depict attacks. They are abstracted and give no operational detail. Is anything too specific, or misleading about how such attacks happen?
4. **Vocabulary.** The orientation (round 0) pairs each potion-themed name with its real-plant equivalent. Are the real-world descriptions right for a newcomer?
5. **The standards map** ([STANDARDS-MAP.md](STANDARDS-MAP.md)). Is the topic-level mapping reasonable? Please add clause numbers where you can.
6. **What is missing or misleading** that a learner might carry into a workplace.

## Specific questions

- Is a proportional-only controller with a first-order heat model acceptable for illustration?
- Round 3 forces the heater, replays earlier readings and bypasses the safety system at once. Is that a fair composite, or too convenient?
- Is "shut down once the true temperature is at least 85 °C" a fair rule for scoring a shutdown decision, and is it right that a justified shutdown scores below a completed brew?
- Round 5 lets the player hide low-priority alarms. Is that a realistic operator action, and is "silence all" a realistic trap?
- Round 6 offers three authority levels for an AI assistant. Do they match how such assistants are deployed or proposed?
- Which real incidents would you use instead, and which of the current ones would you drop?

## How to respond

Open an issue using the **Expert review** template and paste the rows you are commenting on, or edit a copy of the register and send it. Either is fine. Corrections will be made in `index.html` (the register and sources page are generated from it) and listed in the changelog below.

## What the author will do with it

- Fix errors and soften overclaims, and say so in the log.
- Record the version reviewed and the date.
- Credit reviewers by name only with their permission. A review is not an endorsement unless you say so in writing, and no endorsement will be implied.
- Publish this log, including negative findings.

## Review log

| Date | Reviewer (with permission) | Area | Version reviewed | Outcome |
|---|---|---|---|---|
| | *None yet* | | | |

## Known limitations of the content

- Several sources are "located, not read in full" in [SOURCES.md](SOURCES.md). Facts attributed to them are the first to check.
- The game has not been tested with learners, so its learning effect is unmeasured.
- The scoring thresholds (for example 85 °C for a justified shutdown) are the author's judgement.
