# Sources and how each was checked

*Generated from `index.html` by `scripts/build-docs.js`. Do not edit by hand.*

Every factual statement in Cauldron Control's debriefs is meant to trace to one of the sources below. This page says how much checking each source has had, because a reader should not have to guess.

- **Read**: the primary page or document was opened and the specific facts used by the game were checked against it (last checked 25 November 2026).
- **Located, not read in full**: the source was found by search and its title, publisher and date were taken from the listing. The facts attributed to it should be treated as unverified until a reviewer has read it. These are marked clearly so that they can be prioritised for expert review.

A "Read" source may still be only a summary page. The Symantec Stuxnet entry, for example, is the blog summary of the white paper, and the replay behaviour the game mentions is described in Symantec's separate analysis of an early Stuxnet version, which is "located".

| Ref | Source | Link | Status | Used in round |
|---|---|---|---|---|
| S1 | NIST SP 800-82 Rev. 3, Guide to Operational Technology (OT) Security (September 2023) | <https://csrc.nist.gov/pubs/sp/800/82/r3/final> | Read | 0, 1, 2, 4 |
| S2 | NIST Cybersecurity Framework (CSF) 2.0, NIST CSWP 29 (26 February 2024) | <https://doi.org/10.6028/NIST.CSWP.29> | Read | 0 |
| S3 | ISA/IEC 62443 series of standards on industrial automation and control systems security | <https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards> | Read | 0, 3, 4 |
| S4 | ANSI/ISA-61511-1-2018 / IEC 61511-1:2016+AMD1:2017, Functional safety: safety instrumented systems for the process industry sector | <https://www.isa.org/standards-and-publications/isa-standards/isa-84-standards> | Read | 3 |
| S5 | ANSI/ISA-18.2-2016, Management of Alarm Systems for the Process Industries | <https://www.isa.org/standards-and-publications/isa-standards/isa-18-series-of-standards> | Read | 5 |
| S6 | EEMUA Publication 191, Alarm systems: a guide to design, management and procurement (4th edition, November 2024) | <https://eemua.org/products/publications/print/eemua-publication-191> | Located, not read in full | 5 |
| S7 | MITRE ATT&CK for ICS matrix | <https://attack.mitre.org/matrices/ics/> | Read | 2, 3, 4, 5 |
| S8 | MITRE ATLAS, AML.T0051 LLM Prompt Injection | <https://atlas.mitre.org/techniques/AML.T0051> | Read | 6 |
| S9 | OWASP Top 10 for LLM Applications 2025, LLM06:2025 Excessive Agency | <https://genai.owasp.org/llmrisk/llm062025-excessive-agency/> | Read | 6 |
| S10 | CISA, ASD's ACSC and partners, Principles for the Secure Integration of Artificial Intelligence in Operational Technology (December 2025) | <https://www.cyber.gov.au/business-government/secure-design/operational-technology-environments/principles-for-the-secure-integration-of-artificial-intelligence-in-operational-technology> | Located, not read in full | 6 |
| S11 | NIST AI Risk Management Framework 1.0, NIST AI 100-1 (January 2023) | <https://www.nist.gov/itl/ai-risk-management-framework> | Located, not read in full | 6 |
| S12 | NIST AI 600-1, Artificial Intelligence Risk Management Framework: Generative AI Profile (July 2024) | <https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf> | Located, not read in full | 6 |
| S13 | UK Health and Safety Executive, The explosion and fires at the Texaco Refinery, Milford Haven, 24 July 1994 | <https://www.hse.gov.uk/comah/sragtech/casetexaco94.htm> | Read | 5 |
| S14 | US Nuclear Regulatory Commission, Backgrounder on the Three Mile Island Accident | <https://www.nrc.gov/regulations-legislation/fact-sheets-brochures/backgrounder-on-the-three-mile-island-accident> | Read | 3, 5 |
| S15 | CISA, IR-ALERT-H-16-056-01, Cyber-Attack Against Ukrainian Critical Infrastructure (revised July 2021) | <https://www.cisa.gov/news-events/ics-alerts/ir-alert-h-16-056-01> | Read | 4 |
| S16 | CISA (NCCIC / ICS-CERT), MAR-17-352-01 HatMan: Safety System Targeted Malware (18 December 2017) | <https://www.cisa.gov/sites/default/files/documents/MAR-17-352-01%20HatMan%E2%80%94Safety%20System%20Targeted%20Malware_S508C.pdf> | Read | 3 |
| S17 | Symantec, W32.Stuxnet Dossier (summary page; the full white paper is linked from it) | <https://www.security.com/threat-intelligence/stuxnet-dossier-espionage> | Read | 3 |
| S18 | Symantec, Stuxnet 0.5: Disrupting Uranium Processing at Natanz | <https://www.symantec.com/connect/blogs/stuxnet-05-disrupting-uranium-processing-natanz> | Located, not read in full | 3 |
| S19 | W3C, Web Content Accessibility Guidelines (WCAG) 2.2 (Recommendation, December 2024 edition) | <https://www.w3.org/TR/WCAG22/> | Read | documentation only |

## Notes on specific facts

- **Milford Haven (1994).** The HSE page lists an excessive number of alarms in the emergency as reducing the effectiveness of the operators' response. Secondary summaries quote a specific figure (275 alarms in the last 11 minutes); the HSE page read for this project does not state a figure, so the game does not use one.
- **Three Mile Island (1979).** The NRC backgrounder says alarms rang and warning lights flashed while operators did not realise the plant was losing coolant, that control-room instruments indicated the stuck-open relief valve was closed, and that other instruments gave inadequate or misleading information. Claims about the number of alarms or the alarm printer, which appear in other accounts, are not used because they were not confirmed on a primary page.
- **Ukraine (2015).** The CISA alert page states unscheduled outages on 23 December 2015 and attributes the activity to Russian nation-state actors. The game states only the outages.
- **HatMan / TRITON.** CISA's report, dated 18 December 2017, describes malware that affects Triconex safety controllers; it notes media also call it TRITON and TRISIS.
- **NIST SP 800-82 Rev. 3** is the final version (September 2023). NIST's page notes that a Rev. 4 draft is open for comment, so section references should be re-checked after it is published.
- **EEMUA 191** is listed as the 4th edition (November 2024) by sellers of the standard; EEMUA's own page was located but not read in full.
- **MITRE ATT&CK for ICS** technique IDs were checked on the live site. T0855 and T0856 now redirect to T1692.001 and T1692.002, and the game uses the new IDs.
