# Cauldron Control

A browser game that teaches **operational technology (OT) security** through potion brewing.

You are the Alchemist on night shift. A controller holds a cauldron at 75 °C while you watch the dashboard. Over six short rounds you learn the central idea of industrial control system security: **the dashboard is a view of the process, not the process.**

- Runs entirely in the browser. One file, no install, no account, no server, no API keys.
- About 15 minutes to play (plus an optional 3-minute orientation). Works on shared lab machines, tablets and older laptops.
- A **Real-plant view** toggle swaps every potion name for its industrial name (HMI, PLC, SIS, ERP), so the game is a bridge to the real vocabulary.
- You can replay any round from its debrief (the shift report keeps your latest attempt), and set the **pace** (relaxed, normal or quick) before each round.
- You cannot lose: every round ends in a debrief. Each brief says what to aim for, each round has up to three progressive hints, and the debrief says what good play looks like.
- Synthesised sound effects (no audio files) with a Sound on/off switch that remembers your choice, and an optional **Boil sound** (off by default): the noise of the real vessel, which follows the true temperature and so can give a problem away.
- Nothing leaves the browser. Learners can download a JSON summary of their run for an instructor.

**Play it:** https://clarkngo.github.io/cauldron-control/

## The rounds

| Round | Idea | What happens |
|---|---|---|
| 0. Orientation (optional) | OT in one minute | A guided, unscored walkthrough for newcomers: a control-loop diagram, an illustrated glossary of every instrument with its real-plant equivalent, key terms, and each control once. |
| 1. Calm brew | Baseline | Nothing is wrong. Learn which instruments depend on the controller and which do not. |
| 2. Bad thermocouple | Faults are not always attacks | A sensor sticks high. The controller believes it and the real brew goes cold. Cross-check before you act. |
| 3. Mirror, mirror | Manipulation of view | An attacker forces the heater to 100%, replays normal readings to your screen and disables the safety system. Only the hardwired gauge and the cauldron itself tell the truth. |
| 4. The ledger bridge | IT-to-OT pivot | You choose how the business network connects to the controller (flat, DMZ, or allow-list), then an attacker tries to write a dangerous setpoint. |
| 5. Too many voices | Alarm flood | A stream of nuisance alarms buries the one that matters while the heater output sticks at 100%. Hide low-priority alarms, take manual control, or fall into the trap of silencing everything. |
| 6. The Familiar | AI in the loop | You choose how much authority an AI assistant gets (advisory, autopilot, or autopilot with limits). It raises a false alarm, then follows instructions hidden in a note from the business network. |

Each debrief shows a chart of **what was true versus what the display showed**, the relevant technique references (MITRE ATT&CK for ICS, ATLAS and the OWASP LLM Top 10), real-world case studies, defences to discuss, and a reflection question.

## Status

This is an early **prototype**. It has **not** yet been field-tested with a class, has **not** yet been reviewed by an independent industrial control systems expert, and has had **no** manual screen-reader audit. The simulation is deliberately simplified. Nothing here is endorsed by any standards body or agency named in it.

What is in place to make that review and audit easy:

- [docs/SOURCES.md](docs/SOURCES.md): every source, and how thoroughly each was checked (read, or only located).
- [docs/CLAIMS-REGISTER.md](docs/CLAIMS-REGISTER.md): every factual statement the game makes, with its sources, plus the simulation's assumptions. Generated from the game, and a test fails if it goes out of date.
- [docs/STANDARDS-MAP.md](docs/STANDARDS-MAP.md): where each round sits against NIST SP 800-82, IEC 62443, the NIST CSF, ISA-18.2 and IEC 61511 (indicative, not endorsed).
- [docs/EXPERT-REVIEW.md](docs/EXPERT-REVIEW.md): what a reviewer is asked to do, and a public review log (currently empty).
- [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md): the target (WCAG 2.2 AA), what was checked and what was not.

## Privacy

Nothing leaves the browser: no accounts, no analytics, no network requests apart from the links you choose to open. Your choices are remembered in your browser's local storage under these keys, and clearing site data removes them: `cc-sound`, `cc-amb` (boil sound), `cc-pace`, `cc-neutral` (neutral round labels), `cc-keys` (keyboard shortcuts) and `cc-motion` (reduced motion). The summary file is created on your computer only when you press Download.

## For instructors

See [docs/INSTRUCTOR.md](docs/INSTRUCTOR.md) for learning objectives, a 50-minute lesson plan and discussion questions.

## Run locally

```bash
python3 -m http.server 8765
# open http://localhost:8765
```

Instructors can switch on **Neutral round labels** (a switch on the start screen, or `?labels=neutral`; `?labels=full` turns it off). It hides round names, topics and clues about what goes wrong, so learners discover each puzzle themselves.

Testing or teaching: the start screen has a **Jump to a round** menu, and `?round=0` to `?round=6` opens a round directly (for example `index.html?round=3`).

## Tests

```bash
npm install
npm test
```

About 70 tests load `index.html` in jsdom and drive every round tick by tick: what happens if you do nothing, the intended solutions, the traps (for example silencing every alarm), the orientation coach, hints, retries, neutral labels, pace, and the technique IDs cited in each debrief. They run in a few seconds, and GitHub Actions runs them on every push and pull request. The same run checks accessibility with axe-core on every screen and computes colour contrast from the stylesheet, checks that the generated sources page and claims register are current, and checks that every claim has a source. The tests do not check layout, sound or animation, and they are no substitute for a manual accessibility audit or an expert review. The game itself still has no build step and no dependencies; `package.json` exists only for the tests.

## Roadmap

- Pilot with a community college cohort and collect feedback.
- More AI scenarios: an assistant whose inputs are spoofed (combining rounds 3 and 6), and an assistant that helps the player correctly.
- Keyboard and screen-reader audit; CSV export for gradebooks.
- Printable companion worksheets.

## License

Code: MIT. See [LICENSE](LICENSE).
