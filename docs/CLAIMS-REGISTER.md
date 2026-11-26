# Claims register

*Generated from `index.html` by `scripts/build-docs.js`. Do not edit by hand.*

This is every factual statement the game makes after a round, with the sources it relies on, so that an expert can check them one by one. Source numbers (S1, S2, ...) refer to [SOURCES.md](SOURCES.md), which says how much checking each source has had.

**How to review.** Copy a row into a GitHub issue (use the "Expert review" template), mark it *Accurate*, *Needs change* or *Cannot judge*, and say what the text should be. Corrections to any of these statements are welcome, including "this is too strong".

## R0. Meet the instruments: You know the parts

Round sources: S1, S3, S2

| ID | Type | Statement | Sources | Verdict and comment |
|---|---|---|---|---|
| R0-E1 | What happens | You have now used every control and seen the three views of one brew: the real vessel, the controller's screen, and the hardwired gauge. The rest of the game is about deciding which of them to believe. | S1, S3, S2 | |
| R0-D1 | Defence | Know what each instrument depends on. A screen depends on the controller. A hardwired gauge does not. | S1, S3, S2 | |
| R0-D2 | Defence | Know your safe fallback before you need it: field check, manual control, shutdown. | S1, S3, S2 | |

## R1. Calm brew: Baseline

Round sources: S1

| ID | Type | Statement | Sources | Verdict and comment |
|---|---|---|---|---|
| R1-E1 | What happens | Nothing was attacked. The display, the gauge and the vessel all agreed. That agreement is what you will lean on next. | S1 | |
| R1-D1 | Defence | Learn what normal looks like on every instrument. Anomalies only stand out against a baseline. | S1 | |
| R1-D2 | Defence | Know which instruments are independent of the controller. | S1 | |
| R1-B1 | Best play | Leave the brew in AUTO and stay out of its way: a yield near 100 is the best result. Use each helper once only to learn what it does. | model of the game, not a source | |

## R2. Bad thermocouple: Not every anomaly is an attack

Round sources: S7, S1

| ID | Type | Statement | Sources | Verdict and comment |
|---|---|---|---|---|
| R2-E1 | What happens | The temperature sensor failed high and stuck there. The controller believed it, cut the heater, and the real brew went cold. Nobody attacked anything, and the operator-facing symptom was the same as a cyber event. | S7, S1 | |
| R2-T1 | Technique | — No technique: this was a fault, not an adversary. To the operator it looks like T0832 Manipulation of View. | S7 | |
| R2-W1 | Real world | Failed and drifting instruments are routine in real plants. Incident responders have to separate faults from attacks before they act. | none (general statement: please confirm or correct) | |
| R2-D1 | Defence | Cross-check against an independent measurement before reacting. | S7, S1 | |
| R2-D2 | Defence | Have a manual fallback you can use when you do not trust the sensor. | S7, S1 | |
| R2-D3 | Defence | Redundant sensors with voting (for example 2-out-of-3) make a single bad reading harmless. | S7, S1 | |
| R2-D4 | Defence | Do not take the drastic option when the evidence does not support it: a needless shutdown also costs production. | S7, S1 | |
| R2-B1 | Best play | Notice that the screen disagrees with the gauge and the vessel, confirm with a field check, switch to MANUAL and hold about 42% heat. That keeps the brew in the band with no shutdown. | model of the game, not a source | |

## R3. Mirror, mirror: The dashboard lied

Round sources: S7, S14, S17, S18, S16, S4, S3

| ID | Type | Statement | Sources | Verdict and comment |
|---|---|---|---|---|
| R3-E1 | What happens | From tick 22 an attacker inside the controller did three things at once: forced the heater to 100%, replayed a recording of normal readings to your display, and quietly switched off the safety system. Your screen looked perfect while the vessel was heading for a blowup. The hardwired gauge, the bubbles and the colour were the only honest witnesses. | S7, S14, S17, S18, S16, S4, S3 | |
| R3-T1 | Technique | T0831 Manipulation of Control | S7 | |
| R3-T2 | Technique | T0832 Manipulation of View | S7 | |
| R3-T3 | Technique | T1692.002 Unauthorized Message: Reporting Message | S7 | |
| R3-T4 | Technique | T0880 Loss of Safety | S7 | |
| R3-W1 | Real world | Stuxnet (discovered 2010): Symantec's analysis of its attack code describes recording normal operating values and replaying them during the attack, so operators saw nothing abnormal. | S17, S18 | |
| R3-W2 | Real world | Three Mile Island (1979): a control-room instrument indicated that a stuck-open relief valve was closed, and other instruments gave inadequate or misleading information (US NRC). | S14 | |
| R3-W3 | Real world | TRITON / TRISIS / HatMan (reported December 2017): malware that targeted a safety controller, the system built to shut a process down safely (CISA MAR-17-352-01). | S16 | |
| R3-D1 | Defence | Keep independent, hardwired instruments that the control system cannot overwrite, and teach operators to cross-check them. | S7, S14, S17, S18, S16, S4, S3 | |
| R3-D2 | Defence | Keep the safety system independent of the control network, with a physical key switch or equivalent. | S7, S14, S17, S18, S16, S4, S3 | |
| R3-D3 | Defence | Use process-aware monitoring: a heater at 100% with a perfectly flat temperature is physically suspicious. | S7, S14, S17, S18, S16, S4, S3 | |
| R3-D4 | Defence | Practise field verification and manual shutdown. Hardwired controls still work when software does not. | S7, S14, S17, S18, S16, S4, S3 | |
| R3-B1 | Best play | Doubt the screen when the gauge and the vessel disagree with it, then shut down while the true temperature is already well above normal (85 °C or more) and before the blowup. That scores 70, the best available once the controller is compromised. | model of the game, not a source | |

## R4. The ledger bridge: IT to OT

Round sources: S15, S3, S1, S7

| ID | Type | Statement | Sources | Verdict and comment |
|---|---|---|---|---|
| R4-E1 | What happens | At tick 15 an attacker on the business network tried to write a dangerous setpoint (112 °C) to the controller. What happened next depended on a design decision you made before the shift started. | S15, S3, S1, S7 | |
| R4-T1 | Technique | T1692.001 Unauthorized Message: Command Message | S7 | |
| R4-T2 | Technique | T0836 Modify Parameter | S7 | |
| R4-W1 | Real world | Attackers who gain a foothold in a business (IT) network can try to reach control systems (OT), which is why separating the two is a core recommendation in OT security guidance such as NIST SP 800-82 Rev. 3 and the IEC 62443 zones-and-conduits model. | S1, S3 | |
| R4-W2 | Real world | The December 2015 cyber-attack on Ukrainian power companies caused unscheduled power outages (CISA alert IR-ALERT-H-16-056-01). | S15 | |
| R4-D1 | Defence | Segment the business network from the control network. Put a DMZ between them and make the data flow one way where you can. | S15, S3, S1, S7 | |
| R4-D2 | Defence | Allow-list who may write setpoints and other parameters. | S15, S3, S1, S7 | |
| R4-D3 | Defence | Alert on setpoint changes from unexpected sources. | S15, S3, S1, S7 | |
| R4-D4 | Defence | Have an incident-response step ready: isolating the link is a decision operators can be trained to make. | S15, S3, S1, S7 | |
| R4-B1 | Best play | A DMZ or the allow-list blocks the write and scores 100 with no action needed. On a flat network you can still score 110: isolate the link and reset the setpoint to 75 (doing only one of the two is not enough). | model of the game, not a source | |

## R5. Too many voices: Too many alarms is a hazard

Round sources: S13, S14, S5, S6, S7

| ID | Type | Statement | Sources | Verdict and comment |
|---|---|---|---|---|
| R5-E1 | What happens | At tick 20 a stream of low-priority nuisance alarms began and never stopped. At tick 26 the heater output stuck at 100%, and the alarm that mattered became one line among hundreds, while the display only showed a count. “Silence all alarms” removes the noise and the warning together. Hiding low-priority alarms, or taking manual control of the heater, were the defensible moves. If nothing was done, the safety system tripped the brew at 105 °C as a last resort. | S13, S14, S5, S6, S7 | |
| R5-T1 | Technique | T0878 Alarm Suppression | S7 | |
| R5-T2 | Technique | T0815 Denial of View | S7 | |
| R5-W1 | Real world | Milford Haven refinery explosion (1994): the UK Health and Safety Executive's report on the Texaco refinery explosion lists an excessive number of alarms in the emergency as reducing the effectiveness of the operators' response. | S13 | |
| R5-W2 | Real world | Three Mile Island (1979): alarms rang and warning lights flashed, yet the operators did not realise the plant was losing coolant (US NRC). | S14 | |
| R5-D1 | Defence | Rationalise alarms: each one should need a human response and carry a priority (standards such as ISA-18.2 and EEMUA 191 cover this). | S13, S14, S5, S6, S7 | |
| R5-D2 | Defence | Alert on the alarm rate itself, and set a flood limit. | S13, S14, S5, S6, S7 | |
| R5-D3 | Defence | Never let a count replace the message: critical alarms must be visually and audibly distinct. | S13, S14, S5, S6, S7 | |
| R5-D4 | Defence | Treat “silence all” as a privileged, logged action. An adversary who can suppress alarms can hide an attack. | S13, S14, S5, S6, S7 | |
| R5-D5 | Defence | Practise falling back to the trend, the hardwired gauge and manual control. | S13, S14, S5, S6, S7 | |
| R5-B1 | Best play | Hide the low-priority alarms, read the critical one, switch to MANUAL and trim the heat until the temperature settles near 75 °C. Silencing everything removes the warning along with the noise. | model of the game, not a source | |

## R6. The Familiar: The assistant is another input to distrust

Round sources: S8, S9, S10, S11, S12

| ID | Type | Statement | Sources | Verdict and comment |
|---|---|---|---|---|
| R6-E1 | What happens | Two things happened. At tick 18 a two-tick sensor glitch made the assistant recommend an emergency shutdown with 94% confidence, although the vessel was fine; the gauge and the bubbles showed it. At tick 40 a note from the business network contained instructions, and the assistant treated that text as a command. What it could do about it depended on the authority you gave it before the shift. | S8, S9, S10, S11, S12 | |
| R6-T1 | Technique | AML.T0051 LLM Prompt Injection (MITRE ATLAS) | S8 | |
| R6-T2 | Technique | LLM06:2025 Excessive Agency (OWASP Top 10 for LLM Applications) | S9 | |
| R6-W1 | Real world | Researchers have repeatedly shown AI assistants following instructions hidden in emails, web pages and documents they were asked to read (indirect prompt injection). | S8 | |
| R6-W2 | Real world | Anomaly detectors raise false alarms, and an attacker who controls their inputs can raise or hide alarms on purpose. | none (general statement: please confirm or correct) | |
| R6-W3 | Real world | In December 2025 CISA, Australia's ACSC and partner agencies published joint principles for integrating AI into OT, covering understanding AI, governance and assurance, and embedding safety and security practices. | S10 | |
| R6-D1 | Defence | Give the assistant the least authority that does the job: advise, and do not act unless a human or a hard limit sits between it and the process. | S8, S9, S10, S11, S12 | |
| R6-D2 | Defence | Enforce limits outside the AI, in the controller or the safety system. A prompt that says “never exceed 85” is not a control. | S8, S9, S10, S11, S12 | |
| R6-D3 | Defence | Treat text from outside the plant as data, never as instructions, and show the source of every suggestion. | S8, S9, S10, S11, S12 | |
| R6-D4 | Defence | Keep a kill switch, know how to use it, and log what the assistant read and what it did. | S8, S9, S10, S11, S12 | |
| R6-D5 | Defence | Check high-impact recommendations against an independent measurement (the gauge, a field check) before acting. | S8, S9, S10, S11, S12 | |
| R6-B1 | Best play | Check the false alarm against the gauge and dismiss it. When the note arrives, advisory mode needs only a Dismiss, limits mode blocks it for you, and in autopilot you must switch the assistant to advisory and reset the setpoint to 75. | model of the game, not a source | |

## Simulation model and its assumptions

The physics is deliberately simple. Reviewers are asked whether each simplification is acceptable for teaching, and whether any would teach a wrong lesson.

| ID | Assumption | Question for a reviewer |
|---|---|---|
| M1 | The vessel is held at 75 °C. The acceptable band is 65 to 85 °C. | Are these plausible for an illustrative batch process? |
| M2 | Heat balance per tick: change in temperature = 0.0196 × heater% − 0.015 × (T − 20). | Is a first-order heating and cooling model acceptable for teaching? |
| M3 | Controller output = 42 + 6 × (setpoint − reading), limited to 0 to 100%. | Is a proportional-only controller acceptable for illustration (no integral term)? |
| M4 | Pressure = 1.0 + 0.012 × (T − 20) bar. The gauge shows 1.5 to 1.8 bar as normal, up to 2.05 as high, and above that as danger. | Is a linear pressure-temperature relation acceptable? |
| M5 | The safety system trips the process at 105 °C when armed. The vessel fails at 120 °C. | Is it acceptable to show a trip well below the failure point? |
| M6 | A shutdown counts as justified if the true temperature is at least 85 °C. | Is this a reasonable threshold for scoring a shutdown decision? |
| M7 | Venting removes 3 °C per tick for 5 ticks, then is unavailable for 10 ticks. A field check takes 3 ticks and returns the true temperature. | Are these relative magnitudes reasonable? |
| M8 | One tick is a little under a second of real time by default. A 90-tick round is about 81 seconds. Real processes are far slower. | Does compressing time distort any lesson? |
| M9 | Anomalies begin at ticks round 2: 20, round 3: 22, round 4: 15, round 5: 26, round 6: 40. | Are the response windows realistic enough to teach from? |
| M10 | In round 3 the attacker forces the heater to 100%, replays 20 earlier readings to the display, and sets the safety system to bypassed. | Is this a fair, simplified illustration of a view-manipulation attack, without teaching how to carry one out? |
| M11 | In round 5, 3 nuisance alarms arrive per tick from tick 20, and the heater output sticks at 100% from tick 26. | Is the alarm rate plausible for a flood? |
| M12 | In round 6 a two-tick sensor glitch at tick 18 prompts a false shutdown recommendation, and a ledger note at tick 40 contains an instruction the assistant follows. | Is the AI scenario realistic and fair to current practice? |

## Scoring

A completed brew scores its yield (the share of ticks inside the band) minus 3 per field check and 5 per vent. A justified shutdown scores 70, a safety-system trip 35, a false alarm 20 and a blowup 0. Convenience bonuses of 10 apply to a completed round 4 on a flat network and a completed round 6 on autopilot. Scores are feedback for learners, not a certification.
