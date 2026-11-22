# Instructor guide

**Cauldron Control** is a 10-minute game plus a debrief. It is designed to open a class session on OT / industrial control system security without any prerequisites or lab setup.

## Learning objectives

After playing and debriefing, a learner can:

1. Explain why an operator display is a *view* of a process, and name an instrument that does not depend on the control system.
2. Distinguish a sensor **fault** from a **spoofed** reading, and say what evidence separates them.
3. Describe why a safety system should be independent of the control network.
4. Explain, in plain language, what segmentation between business (IT) and control (OT) networks prevents.
5. Map each round to a named ATT&CK for ICS technique and a real-world case study.

## 50-minute lesson plan

| Time | Activity |
|---|---|
| 0–5 | Hook: "You are about to run a plant. Trust your instruments." No other framing. Do not reveal the rounds. |
| 5–20 | Learners play all four rounds individually (about 10 minutes). Encourage the Real-plant view toggle at the end. |
| 20–35 | Debrief, one round at a time, using the on-screen chart. Ask the "Think about it" question for each round before showing the defences. |
| 35–45 | Pairs: pick one real system (water treatment, a hospital HVAC plant, a bottling line). Where would the equivalent of the hardwired gauge be? Where would the DMZ go? |
| 45–50 | Exit ticket: each learner writes one thing they would check before trusting a dashboard. |

## Discussion questions

- Round 2: How sure did you need to be before you acted? What did a false alarm cost?
- Round 3: Which signal first made you doubt the screen? Who would have noticed this in a real plant, and when?
- Round 3: The attacker also disabled the safety system. What does that tell you about where the safety system should live?
- Round 4: What did your network choice cost in convenience? What does that trade-off look like at your own workplace or school?

## Collecting results

On the last screen learners can download a small JSON file (rounds, outcomes, yield, score, and how many ticks passed before their first protective action). It contains no name or personal data. Learners can send you the file, or you can read it aloud in a discussion. The "ticks to first protective action" figure is a useful prompt for talking about detection time.

## Notes and caveats

- This is a **prototype** that has not yet been tested with a class. Please share what works and what does not.
- The physics is simplified for teaching. Do not use it to reason about real plant design.
- ATT&CK for ICS technique IDs: T0831 Manipulation of Control, T0832 Manipulation of View, T1692.002 Unauthorized Message: Reporting Message (formerly T0856 Spoof Reporting Message), T0880 Loss of Safety, T1692.001 Unauthorized Message: Command Message (formerly T0855 Unauthorized Command Message), T0836 Modify Parameter. Verify against the current matrix at attack.mitre.org before using them in graded material.
- Real-world references: Stuxnet (discovered 2010), the 2015 attack on Ukraine's power grid, and TRITON/TRISIS (2017). Read the primary reports before teaching details beyond what the game states.

## Accessibility

The game uses text and shape as well as colour, has keyboard shortcuts (M, R, V, E, I, Space), and respects the reduced-motion setting. A full screen-reader and keyboard audit is still on the roadmap.
