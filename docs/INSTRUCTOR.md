# Instructor guide

**Cauldron Control** is a 15-minute game (plus an optional 3-minute orientation) and a debrief. It is designed to open a class session on OT / industrial control system security without any prerequisites or lab setup.

## Learning objectives

After playing and debriefing, a learner can:

1. Explain why an operator display is a *view* of a process, and name an instrument that does not depend on the control system.
2. Distinguish a sensor **fault** from a **spoofed** reading, and say what evidence separates them.
3. Describe why a safety system should be independent of the control network.
4. Explain, in plain language, what segmentation between business (IT) and control (OT) networks prevents.
5. Map each round to a named technique (ATT&CK for ICS, and for the AI round MITRE ATLAS and the OWASP LLM Top 10) and a real-world case study.
6. Explain why alarm floods are a safety hazard, and name two ways to reduce them.
7. Explain why an AI assistant should get the least authority that does the job, and why limits must be enforced outside the AI.

## 50-minute lesson plan

| Time | Activity |
|---|---|
| 0–5 | Hook: "You are about to run a plant. Trust your instruments." No other framing. Do not reveal the rounds. |
| 5–23 | Learners play rounds 1 to 6 individually (about 15 minutes). Learners new to OT should start with the orientation (round 0, about 3 minutes). Encourage the Real-plant view toggle at the end. |
| 23–36 | Debrief, one round at a time, using the on-screen chart. Ask the "Think about it" question for each round before showing the defences. With less time, debrief rounds 3, 5 and 6. |
| 36–45 | Pairs: pick one real system (water treatment, a hospital HVAC plant, a bottling line). Where would the equivalent of the hardwired gauge be? Where would the DMZ go? |
| 45–50 | Exit ticket: each learner writes one thing they would check before trusting a dashboard. |

## Discussion questions

- Round 2: How sure did you need to be before you acted? What did a false alarm cost?
- Round 3: Which signal first made you doubt the screen? Who would have noticed this in a real plant, and when?
- Round 3: The attacker also disabled the safety system. What does that tell you about where the safety system should live?
- Round 4: What did your network choice cost in convenience? What does that trade-off look like at your own workplace or school?
- Round 5: How long did the critical alarm take you to find? Who decides which alarms exist on a real plant, and what happens when nobody removes the useless ones?
- Round 6: Which authority level did you pick, and would you defend it to a plant manager? What would have to be true before an AI could shut a plant down by itself?

## Hints, scoring and sound

Learners cannot fail the game: every round ends in a debrief. Each round offers up to three progressive hints (button or `H`), and hints used are recorded in the downloadable summary but never change the score. The start screen explains scoring. Sound effects are synthesised in the browser; the **Sound** switch at the top right turns them off (useful in a classroom). If you want learners to discover the puzzles unaided, ask them not to use hints until the debrief.

## Jumping to a round

The start screen has a **Jump to a round** menu, and `?round=0` to `?round=6` opens a round directly (for example `index.html?round=5`). Use it to repeat one round or to teach a single idea.

## Collecting results

On the last screen learners can download a small JSON file (rounds, outcomes, yield, score, hints used, and how many ticks passed before their first protective action). It contains no name or personal data. Learners can send you the file, or you can read it aloud in a discussion. The "ticks to first protective action" figure is a useful prompt for talking about detection time.

## Notes and caveats

- This is a **prototype** that has not yet been tested with a class. Please share what works and what does not.
- The physics is simplified for teaching. Do not use it to reason about real plant design.
- ATT&CK for ICS technique IDs: T0831 Manipulation of Control, T0832 Manipulation of View, T1692.002 Unauthorized Message: Reporting Message (formerly T0856 Spoof Reporting Message), T0880 Loss of Safety, T1692.001 Unauthorized Message: Command Message (formerly T0855 Unauthorized Command Message), T0836 Modify Parameter, T0878 Alarm Suppression, T0815 Denial of View. Round 6 cites MITRE ATLAS AML.T0051 LLM Prompt Injection and OWASP LLM06:2025 Excessive Agency. Verify against the current matrix at attack.mitre.org before using them in graded material.
- Real-world references: Stuxnet (discovered 2010), the 2015 attack on Ukraine's power grid, TRITON/TRISIS (2017), the Milford Haven refinery explosion (1994) and Three Mile Island (1979). Read the primary reports before teaching details beyond what the game states.

## Accessibility

The game uses text and shape as well as colour, has keyboard shortcuts (M, R, V, I, C, H, P, and E pressed twice to shut down), and respects the reduced-motion setting. A full screen-reader and keyboard audit is still on the roadmap.
