# Cauldron Control

A browser game that teaches **operational technology (OT) security** through potion brewing.

You are the Alchemist on night shift. A controller holds a cauldron at 75 °C while you watch the dashboard. Over six short rounds you learn the central idea of industrial control system security: **the dashboard is a view of the process, not the process.**

- Runs entirely in the browser. One file, no install, no account, no server, no API keys.
- About 15 minutes to play (plus an optional 3-minute orientation). Works on shared lab machines, tablets and older laptops.
- A **Real-plant view** toggle swaps every potion name for its industrial name (HMI, PLC, SIS, ERP), so the game is a bridge to the real vocabulary.
- Nothing leaves the browser. Learners can download a JSON summary of their run for an instructor.

**Play it:** https://clarkngo.github.io/cauldron-control/

## The rounds

| Round | Idea | What happens |
|---|---|---|
| 0. Orientation (optional) | OT in one minute | A guided, unscored walkthrough for newcomers: the control loop, the three views of the brew, a potion-to-plant glossary, and each control once. |
| 1. Calm brew | Baseline | Nothing is wrong. Learn which instruments depend on the controller and which do not. |
| 2. Bad thermocouple | Faults are not always attacks | A sensor sticks high. The controller believes it and the real brew goes cold. Cross-check before you act. |
| 3. Mirror, mirror | Manipulation of view | An attacker forces the heater to 100%, replays normal readings to your screen and disables the safety system. Only the hardwired gauge and the cauldron itself tell the truth. |
| 4. The ledger bridge | IT-to-OT pivot | You choose how the business network connects to the controller (flat, DMZ, or allow-list), then an attacker tries to write a dangerous setpoint. |
| 5. Too many voices | Alarm flood | A stream of nuisance alarms buries the one that matters while the heater output sticks at 100%. Hide low-priority alarms, take manual control, or fall into the trap of silencing everything. |
| 6. The Familiar | AI in the loop | You choose how much authority an AI assistant gets (advisory, autopilot, or autopilot with limits). It raises a false alarm, then follows instructions hidden in a note from the business network. |

Each debrief shows a chart of **what was true versus what the display showed**, the relevant technique references (MITRE ATT&CK for ICS, ATLAS and the OWASP LLM Top 10), real-world case studies, defences to discuss, and a reflection question.

## Status

This is an early **prototype**. It has **not** yet been field-tested with a class, and the simulation is deliberately simplified. Technique IDs follow MITRE ATT&CK for ICS; check them against the current matrix before citing.

## For instructors

See [docs/INSTRUCTOR.md](docs/INSTRUCTOR.md) for learning objectives, a 50-minute lesson plan and discussion questions.

## Run locally

```bash
python3 -m http.server 8765
# open http://localhost:8765
```

Testing or teaching: the start screen has a **Jump to a round** menu, and `?round=0` to `?round=6` opens a round directly (for example `index.html?round=3`).

## Roadmap

- Pilot with a community college cohort and collect feedback.
- More AI scenarios: an assistant whose inputs are spoofed (combining rounds 3 and 6), and an assistant that helps the player correctly.
- Keyboard and screen-reader audit; CSV export for gradebooks.
- Printable companion worksheets.

## License

Code: MIT. See [LICENSE](LICENSE).
