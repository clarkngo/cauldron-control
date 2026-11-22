# Cauldron Control

A browser game that teaches **operational technology (OT) security** through potion brewing.

You are the Alchemist on night shift. A controller holds a cauldron at 75 °C while you watch the dashboard. Over four short rounds you learn the central idea of industrial control system security: **the dashboard is a view of the process, not the process.**

- Runs entirely in the browser. One file, no install, no account, no server, no API keys.
- About 10 minutes to play. Works on shared lab machines, tablets and older laptops.
- A **Real-plant view** toggle swaps every potion name for its industrial name (HMI, PLC, SIS, ERP), so the game is a bridge to the real vocabulary.
- Nothing leaves the browser. Learners can download a JSON summary of their run for an instructor.

**Play it:** https://clarkngo.github.io/cauldron-control/

## The four rounds

| Round | Idea | What happens |
|---|---|---|
| 1. Calm brew | Baseline | Nothing is wrong. Learn which instruments depend on the controller and which do not. |
| 2. Bad thermocouple | Faults are not always attacks | A sensor sticks high. The controller believes it and the real brew goes cold. Cross-check before you act. |
| 3. Mirror, mirror | Manipulation of view | An attacker forces the heater to 100%, replays normal readings to your screen and disables the safety system. Only the hardwired gauge and the cauldron itself tell the truth. |
| 4. The ledger bridge | IT-to-OT pivot | You choose how the business network connects to the controller (flat, DMZ, or allow-list), then an attacker tries to write a dangerous setpoint. |

Each debrief shows a chart of **what was true versus what the display showed**, the relevant MITRE ATT&CK for ICS techniques, real-world case studies, defences to discuss, and a reflection question.

## Status

This is an early **prototype**. It has **not** yet been field-tested with a class, and the simulation is deliberately simplified. Technique IDs follow MITRE ATT&CK for ICS; check them against the current matrix before citing.

## For instructors

See [docs/INSTRUCTOR.md](docs/INSTRUCTOR.md) for learning objectives, a 50-minute lesson plan and discussion questions.

## Run locally

```bash
python3 -m http.server 8765
# open http://localhost:8765
```

## Roadmap

- Pilot with a community college cohort and collect feedback.
- Round 5: alarm flood and alarm suppression.
- Round 6: AI in the loop, both as a defender (an anomaly-detection assistant that can be wrong or spoofed) and as an attack surface (an assistant that acts on untrusted input).
- Keyboard and screen-reader audit; CSV export for gradebooks.
- Printable companion worksheets.

## License

Code: MIT. See [LICENSE](LICENSE).
