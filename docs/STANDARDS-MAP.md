# Standards map

Which published guidance each round of Cauldron Control touches. **This mapping is the author's, is indicative, and has not been reviewed or endorsed by NIST, ISA, the IEC, EEMUA, MITRE, OWASP, CISA or any other body.** It is at topic level, not clause level: no clause or section numbers are given, because they have not been checked. Experts are invited to add them (see [EXPERT-REVIEW.md](EXPERT-REVIEW.md)).

Full citations and how each source was checked are in [SOURCES.md](SOURCES.md).

| Round | What the player practises | NIST CSF 2.0 function | NIST SP 800-82 Rev. 3 (topic) | ISA/IEC 62443 | Other |
|---|---|---|---|---|---|
| 0. Orientation | The control loop; IT versus OT; what a PLC, HMI, safety system and field operator are | Identify | OT overview, components and architectures | 62443-1-1 (terminology, concepts and models) | |
| 1. Calm brew | Knowing what normal looks like; which instruments depend on the controller | Identify, Detect | OT risk management, monitoring | 62443-2-1 (security programme for asset owners) | |
| 2. Bad thermocouple | Telling a fault from an attack; cross-checking; a manual fallback | Detect, Respond | Incident handling, resilience | FR6 timely response to events | IEC 61511 (redundant sensing and voting in safety functions) |
| 3. Mirror, mirror | A display is a view; independent instruments and an independent safety system | Protect, Detect | Defence in depth, independent safety systems | FR3 system integrity; 62443-3-3 | IEC 61511 (independence of the safety system from the control system); ATT&CK for ICS T0831, T0832, T0880, T1692.002 |
| 4. The ledger bridge | IT-to-OT segmentation, a one-way link, command allow-listing, isolating a link in an incident | Protect, Respond | Network segmentation and architecture | Zones and conduits (62443-3-2); FR5 restricted data flow; FR2 use control | ATT&CK for ICS T1692.001, T0836 |
| 5. Too many voices | Alarm management, prioritisation, and the danger of suppressing alarms | Detect, Respond | | FR6 timely response to events | ISA-18.2; EEMUA 191; ATT&CK for ICS T0878, T0815 |
| 6. The Familiar | Limiting an AI assistant's authority; untrusted text as an instruction channel; limits enforced outside the AI; a kill switch | Govern, Protect | | FR2 use control (least privilege); FR5 restricted data flow | CISA, ACSC and partners' AI-in-OT principles; NIST AI RMF (Govern, Map, Measure, Manage) and AI 600-1; OWASP LLM06:2025; MITRE ATLAS AML.T0051 |

The seven IEC 62443 foundational requirements are: FR1 identification and authentication control, FR2 use control, FR3 system integrity, FR4 data confidentiality, FR5 restricted data flow, FR6 timely response to events, FR7 resource availability (per the IEC's 62443 background page; located, not read in full).

## What the game does not cover

It is a set of six concepts, not a curriculum. It does not teach, and should not be taken to cover:

- security levels, risk assessment or any compliance process in 62443 or NIST guidance (FR4 data confidentiality and FR7 resource availability are not exercised);
- physical security, supply chain security, patching, remote access, or identity management;
- how real attacks are carried out. The attacks are abstracted on purpose and contain no technical detail an attacker could use;
- a workforce framework mapping (for example to the NICE Framework). That is a useful next step for someone who knows the framework's current version.

## Reading it alongside the claims register

[CLAIMS-REGISTER.md](CLAIMS-REGISTER.md) lists every statement the game makes. This map says where the *ideas* sit in the standards; the register says whether the *facts* are right.
