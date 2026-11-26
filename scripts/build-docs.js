"use strict";
/*
 * Generates docs/SOURCES.md and docs/CLAIMS-REGISTER.md from the game's own data (ROUNDS and SOURCES in index.html),
 * so the documents cannot drift from what the game says. A test fails if they are out of date.
 *
 *   node scripts/build-docs.js        write the files
 */
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");

const ROOT = path.join(__dirname, "..");
const CHECKED = "25 November 2026";          // update when the sources are re-checked

/* per-claim sources for the real-world statements (round -> list of source keys per statement); null = general statement */
const CLAIM_SOURCES = {
  2: [null],
  3: [["stuxnet", "stuxnet05"], ["nrctmi"], ["hatman"]],
  4: [["nist80082", "isa62443"], ["ukraine"]],
  5: [["hse"], ["nrctmi"]],
  6: [["atlas"], null, ["aiot"]]
};

function loadData() {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const dom = new JSDOM(html, {
    url: "http://localhost/", runScripts: "dangerously", pretendToBeVisual: true,
    beforeParse(w) { w.scrollTo = () => {}; w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: () => () => {}, set: () => true }); }
  });
  const data = JSON.parse(dom.window.eval(`JSON.stringify({
    rounds: ROUNDS.map(r => ({ name:r.name, kicker:r.kicker, aim:r.aim, refs:r.refs || [], db:r.db })),
    sources: SOURCES,
    k: { SP0, BAND, TRIP, BLOW, TICKS, BASE_HEAT, SUSPECT_T, ANOM }
  })`));
  dom.window.close();
  return data;
}

const clean = t => String(t).replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const cell = t => clean(t).replace(/\|/g, "\\|");
const STATUS = { read: "Read", located: "Located, not read in full" };

function sourcesMd(d) {
  const keys = Object.keys(d.sources);
  const usedIn = k => d.rounds.map((r, i) => (r.refs.includes(k) ? (i === 0 ? "0" : String(i)) : null)).filter(Boolean).join(", ") || "documentation only";
  const rows = keys.map((k, i) => `| S${i + 1} | ${cell(d.sources[k].t)} | <${d.sources[k].u}> | ${STATUS[d.sources[k].v]} | ${usedIn(k)} |`).join("\n");
  return `# Sources and how each was checked

*Generated from \`index.html\` by \`scripts/build-docs.js\`. Do not edit by hand.*

Every factual statement in Cauldron Control's debriefs is meant to trace to one of the sources below. This page says how much checking each source has had, because a reader should not have to guess.

- **Read**: the primary page or document was opened and the specific facts used by the game were checked against it (last checked ${CHECKED}).
- **Located, not read in full**: the source was found by search and its title, publisher and date were taken from the listing. The facts attributed to it should be treated as unverified until a reviewer has read it. These are marked clearly so that they can be prioritised for expert review.

A "Read" source may still be only a summary page. The Symantec Stuxnet entry, for example, is the blog summary of the white paper, and the replay behaviour the game mentions is described in Symantec's separate analysis of an early Stuxnet version, which is "located".

| Ref | Source | Link | Status | Used in round |
|---|---|---|---|---|
${rows}

## Notes on specific facts

- **Milford Haven (1994).** The HSE page lists an excessive number of alarms in the emergency as reducing the effectiveness of the operators' response. Secondary summaries quote a specific figure (275 alarms in the last 11 minutes); the HSE page read for this project does not state a figure, so the game does not use one.
- **Three Mile Island (1979).** The NRC backgrounder says alarms rang and warning lights flashed while operators did not realise the plant was losing coolant, that control-room instruments indicated the stuck-open relief valve was closed, and that other instruments gave inadequate or misleading information. Claims about the number of alarms or the alarm printer, which appear in other accounts, are not used because they were not confirmed on a primary page.
- **Ukraine (2015).** The CISA alert page states unscheduled outages on 23 December 2015 and attributes the activity to Russian nation-state actors. The game states only the outages.
- **HatMan / TRITON.** CISA's report, dated 18 December 2017, describes malware that affects Triconex safety controllers; it notes media also call it TRITON and TRISIS.
- **NIST SP 800-82 Rev. 3** is the final version (September 2023). NIST's page notes that a Rev. 4 draft is open for comment, so section references should be re-checked after it is published.
- **EEMUA 191** is listed as the 4th edition (November 2024) by sellers of the standard; EEMUA's own page was located but not read in full.
- **MITRE ATT&CK for ICS** technique IDs were checked on the live site. T0855 and T0856 now redirect to T1692.001 and T1692.002, and the game uses the new IDs.
`;
}

function claimsMd(d) {
  const keys = Object.keys(d.sources), num = k => `S${keys.indexOf(k) + 1}`;
  const k = d.k;
  let out = `# Claims register

*Generated from \`index.html\` by \`scripts/build-docs.js\`. Do not edit by hand.*

This is every factual statement the game makes after a round, with the sources it relies on, so that an expert can check them one by one. Source numbers (S1, S2, ...) refer to [SOURCES.md](SOURCES.md), which says how much checking each source has had.

**How to review.** Copy a row into a GitHub issue (use the "Expert review" template), mark it *Accurate*, *Needs change* or *Cannot judge*, and say what the text should be. Corrections to any of these statements are welcome, including "this is too strong".

`;
  d.rounds.forEach((r, i) => {
    const id = i === 0 ? "R0" : `R${i}`, db = r.db, src = r.refs.map(num).join(", ") || "none";
    out += `## ${id}. ${r.name}: ${cell(db.title)}\n\nRound sources: ${src}\n\n| ID | Type | Statement | Sources | Verdict and comment |\n|---|---|---|---|---|\n`;
    const row = (n, type, text, srcs) => { out += `| ${id}-${n} | ${type} | ${cell(text)} | ${srcs} | |\n`; };
    row("E1", "What happens", db.what, src);
    db.tech.forEach((t, j) => row(`T${j + 1}`, "Technique", `${t[0]} ${t[1]}`, t[0].startsWith("AML") ? num("atlas") : t[0].startsWith("LLM") ? num("owasp") : num("attackics")));
    db.real.forEach((t, j) => { const m = (CLAIM_SOURCES[i] || [])[j]; row(`W${j + 1}`, "Real world", t, m ? m.map(num).join(", ") : "none (general statement: please confirm or correct)"); });
    db.def.forEach((t, j) => row(`D${j + 1}`, "Defence", t, src));
    if (db.best) row("B1", "Best play", db.best, "model of the game, not a source");
    out += "\n";
  });
  out += `## Simulation model and its assumptions

The physics is deliberately simple. Reviewers are asked whether each simplification is acceptable for teaching, and whether any would teach a wrong lesson.

| ID | Assumption | Question for a reviewer |
|---|---|---|
| M1 | The vessel is held at ${k.SP0} °C. The acceptable band is ${k.BAND[0]} to ${k.BAND[1]} °C. | Are these plausible for an illustrative batch process? |
| M2 | Heat balance per tick: change in temperature = 0.0196 × heater% − 0.015 × (T − 20). | Is a first-order heating and cooling model acceptable for teaching? |
| M3 | Controller output = ${k.BASE_HEAT} + 6 × (setpoint − reading), limited to 0 to 100%. | Is a proportional-only controller acceptable for illustration (no integral term)? |
| M4 | Pressure = 1.0 + 0.012 × (T − 20) bar. The gauge shows 1.5 to 1.8 bar as normal, up to 2.05 as high, and above that as danger. | Is a linear pressure-temperature relation acceptable? |
| M5 | The safety system trips the process at ${k.TRIP} °C when armed. The vessel fails at ${k.BLOW} °C. | Is it acceptable to show a trip well below the failure point? |
| M6 | A shutdown counts as justified if the true temperature is at least ${k.SUSPECT_T} °C. | Is this a reasonable threshold for scoring a shutdown decision? |
| M7 | Venting removes 3 °C per tick for 5 ticks, then is unavailable for 10 ticks. A field check takes 3 ticks and returns the true temperature. | Are these relative magnitudes reasonable? |
| M8 | One tick is a little under a second of real time by default. A 90-tick round is about 81 seconds. Real processes are far slower. | Does compressing time distort any lesson? |
| M9 | Anomalies begin at ticks ${Object.entries(k.ANOM).map(([r, t]) => `round ${r}: ${t}`).join(", ")}. | Are the response windows realistic enough to teach from? |
| M10 | In round 3 the attacker forces the heater to 100%, replays 20 earlier readings to the display, and sets the safety system to bypassed. | Is this a fair, simplified illustration of a view-manipulation attack, without teaching how to carry one out? |
| M11 | In round 5, 3 nuisance alarms arrive per tick from tick 20, and the heater output sticks at 100% from tick 26. | Is the alarm rate plausible for a flood? |
| M12 | In round 6 a two-tick sensor glitch at tick 18 prompts a false shutdown recommendation, and a ledger note at tick 40 contains an instruction the assistant follows. | Is the AI scenario realistic and fair to current practice? |

## Scoring

A completed brew scores its yield (the share of ticks inside the band) minus 3 per field check and 5 per vent. A justified shutdown scores 70, a safety-system trip 35, a false alarm 20 and a blowup 0. Convenience bonuses of 10 apply to a completed round 4 on a flat network and a completed round 6 on autopilot. Scores are feedback for learners, not a certification.
`;
  return out;
}

function build() { const d = loadData(); return { "docs/SOURCES.md": sourcesMd(d), "docs/CLAIMS-REGISTER.md": claimsMd(d) }; }

if (require.main === module) {
  for (const [f, text] of Object.entries(build())) { fs.writeFileSync(path.join(ROOT, f), text); console.log("wrote", f, `(${text.split("\n").length} lines)`); }
}
module.exports = { build, CLAIM_SOURCES };
