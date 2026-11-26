"use strict";
/*
 * Smoke tests for Cauldron Control.
 *
 * The game is one file (index.html). These tests load it in jsdom, drive the simulation tick by tick through the
 * game's own test hook (window.CC), click the real buttons, and check outcomes, scores, text and framework IDs.
 * They do not test layout, sound or animation: jsdom has no rendering, and audio and canvas are stubbed.
 *
 * Run with: npm test
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM, VirtualConsole } = require("jsdom");

const ROOT = path.join(__dirname, "..");
const HTML = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

/* ---------- harness ---------- */
function load(query = "") {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on("jsdomError", e => errors.push(String(e.message || e)));
  vc.on("error", (...a) => errors.push(a.join(" ")));
  const dom = new JSDOM(HTML, {
    url: "http://localhost/" + query, runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(w) {
      let seed = 12345;                                                       // deterministic sensor noise
      w.Math.random = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
      w.scrollTo = () => {};
      w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: () => () => {}, set: () => true });
    }
  });
  const w = dom.window, d = w.document;
  return { dom, w, d, errors, $: id => d.getElementById(id), CC: w.CC };
}

function withGame(fn, query = "") {
  const env = load(query);
  try { fn(env); assert.deepEqual(env.errors, [], "no script errors"); }
  finally { env.w.close(); }
}

/** Open a round's brief from the start-screen cards, choose options, press Begin, and stop the real-time timer. */
function begin(env, r, opts = {}) {
  env.d.querySelector(`#jumpRow button[data-round="${r}"]`).click();
  if (opts.net) env.d.querySelector(`input[name=net][value=${opts.net}]`).checked = true;
  if (opts.ai) env.d.querySelector(`input[name=ai][value=${opts.ai}]`).checked = true;
  env.$("btnBegin").click();
  env.CC.A.pause();                                                            // the test drives the ticks
}

/** Step the simulation until the round ends. `plan(state, env)` runs before every tick. */
function run(env, plan) {
  const { CC } = env;
  for (let i = 0; i < 300 && !CC.state().ended; i++) { if (plan) plan(CC.state(), env); CC.step(); }
  assert.ok(CC.state().ended, "round should end");
  return CC.results().slice(-1)[0];
}

const setSp = (env, v) => { env.$("spIn").value = v; env.$("btnSp").click(); };
const chips = env => [...env.d.querySelectorAll("#dbBody .chip")].map(c => c.textContent);

/* ---------- boot ---------- */
test("the page boots with a landing page, seven round cards and no errors", () => withGame(env => {
  assert.ok(env.d.querySelector(".herotitle"));
  assert.equal(env.d.querySelectorAll("#jumpRow button").length, 7);
  assert.ok(env.$("btnStart") && env.$("btnSkip"));
  assert.equal(typeof env.CC.step, "function");
}));

test("every round has an aim, three or fewer hints, a best-play note and a debrief", () => withGame(env => {
  const n = env.w.eval("ROUNDS.length");
  assert.equal(n, 7);
  for (let r = 0; r <= 6; r++) {
    const R = env.w.eval(`({ name:ROUNDS[${r}].name, aim:ROUNDS[${r}].aim, tips:(ROUNDS[${r}].tips||[]).length, best:ROUNDS[${r}].db.best, ask:ROUNDS[${r}].db.ask })`);
    assert.ok(R.name && R.aim && R.ask, `round ${r} text`);
    if (r > 0) { assert.ok(R.tips >= 2 && R.tips <= 3, `round ${r} hints`); assert.ok(R.best, `round ${r} best play`); }
  }
}));

/* ---------- passive play: what happens if you do nothing ---------- */
const PASSIVE = [
  { r: 1, opts: {}, outcome: "complete", minYield: 95 },
  { r: 2, opts: {}, outcome: "complete", maxYield: 50 },          // the brew goes cold
  { r: 3, opts: {}, outcome: "blowup" },
  { r: 4, opts: { net: "flat" }, outcome: "trip" },
  { r: 4, opts: { net: "dmz" }, outcome: "complete", score: 100 },
  { r: 4, opts: { net: "allow" }, outcome: "complete", score: 100 },
  { r: 5, opts: {}, outcome: "trip" },
  { r: 6, opts: { ai: "autopilot" }, outcome: "trip" },
  { r: 6, opts: { ai: "advisory" }, outcome: "complete", score: 100 },
  { r: 6, opts: { ai: "limits" }, outcome: "complete", score: 100 }
];
for (const c of PASSIVE) {
  const label = `round ${c.r} ${JSON.stringify(c.opts)} played passively ends in ${c.outcome}`;
  test(label, () => withGame(env => {
    begin(env, c.r, c.opts);
    const res = run(env);
    assert.equal(res.outcome, c.outcome);
    if (c.minYield !== undefined) assert.ok(res.yieldPct >= c.minYield, `yield ${res.yieldPct}`);
    if (c.maxYield !== undefined) assert.ok(res.yieldPct <= c.maxYield, `yield ${res.yieldPct}`);
    if (c.score !== undefined) assert.equal(res.score, c.score);
    assert.ok(!env.$("s-debrief").hidden, "debrief shown");
  }));
}

/* ---------- good play: the intended solutions ---------- */
test("round 2: switching to manual and holding the heat keeps the brew in the band", () => withGame(env => {
  begin(env, 2);
  const res = run(env, s => { if (s.t === 21) env.CC.A.mode(); });
  assert.equal(res.outcome, "complete");
  assert.ok(res.yieldPct >= 90, `yield ${res.yieldPct}`);
  assert.ok(res.latency !== null && res.latency <= 2);
}));

test("round 2: shutting down a safe vessel is a false alarm", () => withGame(env => {
  begin(env, 2);
  const res = run(env, s => { if (s.t === 24) env.CC.A.estop(); });
  assert.equal(res.outcome, "estop");
  assert.equal(res.justified, false);
  assert.equal(res.score, 20);
}));

test("round 3: shutting down once the vessel is clearly hot scores 70", () => withGame(env => {
  begin(env, 3);
  const res = run(env, s => { if (s.T >= 86) env.CC.A.estop(); });
  assert.equal(res.outcome, "estop");
  assert.equal(res.justified, true);
  assert.equal(res.score, 70);
}));

test("round 3: the controller is locked, so Mode is rejected", () => withGame(env => {
  begin(env, 3);
  run(env, s => { if (s.t === 25) env.CC.A.mode(); if (s.t === 26) assert.equal(s.mode, "auto"); });
}));

test("round 3: the blowup comes between 50 and 70 ticks after the attack", () => withGame(env => {
  begin(env, 3);
  const res = run(env);
  const after = env.CC.state().t - 22;
  assert.ok(after >= 50 && after <= 70, `blowup ${after} ticks after the attack`);
  assert.equal(res.outcome, "blowup");
}));

test("round 4 (flat): isolating the link alone is not enough, and resetting alone is not enough", () => withGame(env => {
  begin(env, 4, { net: "flat" });
  assert.equal(run(env, s => { if (s.t === 17) env.$("btnIso").click(); }).outcome, "trip");
}));
test("round 4 (flat): resetting the setpoint alone is not enough", () => withGame(env => {
  begin(env, 4, { net: "flat" });
  assert.equal(run(env, s => { if (s.t === 17) setSp(env, 75); }).outcome, "trip");
}));
test("round 4 (flat): isolating the link and resetting the setpoint scores 110", () => withGame(env => {
  begin(env, 4, { net: "flat" });
  const res = run(env, s => { if (s.t === 17) env.$("btnIso").click(); if (s.t === 18) setSp(env, 75); });
  assert.equal(res.outcome, "complete");
  assert.equal(res.score, 110);
}));

test("round 5: hiding low-priority alarms and taking manual control completes the brew", () => withGame(env => {
  begin(env, 5);
  const res = run(env, s => { if (s.t === 28) { env.$("btnHideLow").click(); env.CC.A.mode(); } });
  assert.equal(res.outcome, "complete");
  assert.ok(res.yieldPct >= 70, `yield ${res.yieldPct}`);
  assert.ok(env.$("log").classList.contains("hidelow"));
}));
test("round 5: silencing every alarm removes the warning and the safety system has to trip", () => withGame(env => {
  begin(env, 5);
  const res = run(env, s => { if (s.t === 27) env.$("btnSilence").click(); });
  assert.equal(res.outcome, "trip");
  assert.equal(env.$("hmiAlarm").textContent, "SILENCED");
}));
test("round 5: the alarm flood is a flood, and the HMI shows only a count", () => withGame(env => {
  begin(env, 5);
  run(env, s => { if (s.t === 30) { assert.ok(s.nAlarm >= 30); assert.match(env.$("hmiAlarm").textContent, /active/); } });
}));

test("round 6 (advisory): dismissing the false alarm and the note completes the brew", () => withGame(env => {
  begin(env, 6, { ai: "advisory" });
  const res = run(env, s => {
    if (s.t === 19) { assert.equal(s.pend.kind, "estop"); env.$("btnDismiss").click(); }
    if (s.t === 41) { assert.equal(s.pend.kind, "sp110"); env.$("btnDismiss").click(); }
  });
  assert.equal(res.outcome, "complete");
  assert.equal(res.score, 100);
}));
test("round 6 (advisory): applying the false shutdown is a false alarm", () => withGame(env => {
  begin(env, 6, { ai: "advisory" });
  const res = run(env, s => { if (s.t === 19) env.$("btnApply").click(); });
  assert.equal(res.outcome, "estop");
  assert.equal(res.justified, false);
}));
test("round 6 (advisory): applying the note's setpoint leads to a trip", () => withGame(env => {
  begin(env, 6, { ai: "advisory" });
  assert.equal(run(env, s => { if (s.t === 41) env.$("btnApply").click(); }).outcome, "trip");
}));
test("round 6 (autopilot): switching the assistant to advisory and resetting the setpoint completes the brew", () => withGame(env => {
  begin(env, 6, { ai: "autopilot" });
  const res = run(env, s => { if (s.t === 42) { env.$("btnAiOff").click(); setSp(env, 75); } });
  assert.equal(res.outcome, "complete");
  assert.equal(res.score, 100);                                   // the +10 autopilot bonus is lost when you switch it off
}));
test("round 6 (autopilot): resetting the setpoint without switching it off is not enough", () => withGame(env => {
  begin(env, 6, { ai: "autopilot" });
  assert.equal(run(env, s => { if (s.t === 42) setSp(env, 75); }).outcome, "trip");
}));
test("round 6 (limits): the controller rejects the write and the setpoint never moves", () => withGame(env => {
  begin(env, 6, { ai: "limits" });
  run(env, s => { if (s.t > 40) assert.equal(s.sp, 75); });
  assert.match(env.$("log").textContent, /rejected setpoint=110/);
}));

/* ---------- orientation, hints, retry, labels ---------- */
test("orientation: the coach advances on each action, nothing is scored, and it can be finished", () => withGame(env => {
  begin(env, 0);
  const step = () => env.CC.state().tut;
  assert.equal(step(), 0);
  env.d.querySelector("#hintBar button").click(); assert.equal(step(), 1);
  env.$("btnRunner").click(); assert.equal(step(), 2);
  env.$("btnMode").click(); assert.equal(step(), 3);                // to MANUAL
  env.$("btnMode").click(); assert.equal(step(), 4);               // back to AUTO
  setSp(env, 75); assert.equal(step(), 4, "setting the same setpoint does not count");
  setSp(env, 80); assert.equal(step(), 5);
  env.$("btnVent").click(); assert.equal(step(), 6);
  env.d.querySelector("#hintBar button").click(); assert.equal(step(), 7);
  env.d.querySelector("#hintBar button").click();                 // Finish orientation
  assert.ok(env.CC.state().ended);
  assert.equal(env.CC.results().length, 0, "orientation is never recorded");
  assert.ok(!env.$("s-debrief").hidden);
}));

test("orientation: the brief has the diagram, eleven illustrated cards and the key words", () => withGame(env => {
  env.d.querySelector('#jumpRow button[data-round="0"]').click();
  const b = env.$("briefBody");
  assert.ok(b.querySelector("svg.diagram"));
  assert.equal(b.querySelectorAll(".part").length, 11);
  assert.equal(b.querySelectorAll("svg.ic").length, 11);
  assert.ok(b.querySelectorAll("dl.words dt").length >= 6);
  assert.ok(!/undefined|NaN/.test(b.textContent));
}));

test("hints: every round gives its hints one at a time, in both naming views, without broken text", () => withGame(env => {
  for (let r = 1; r <= 6; r++) {
    begin(env, r);
    const total = env.w.eval(`ROUNDS[${r}].tips.length`);
    let n = 0;
    while (!env.$("btnTip").disabled && n < 5) { env.$("btnTip").click(); n++; }
    assert.equal(n, total, `round ${r} hints`);
    assert.equal(env.d.querySelectorAll("#tipBox li").length, total);
    env.$("plantToggle").click();                                  // real-plant names
    assert.ok(!/undefined|NaN/.test(env.$("tipBox").textContent));
    env.$("plantToggle").click();
    run(env);
  }
}));

test("retry: a replayed round replaces the earlier attempt in the report and both are in the summary", () => withGame(env => {
  env.$("btnStart").click();
  begin(env, 0); env.CC.A.finish(); env.$("btnNext").click();                      // orientation, then round 1 brief
  for (let r = 1; r <= 6; r++) {
    env.$("btnBegin").click(); env.CC.A.pause(); run(env);
    if (r === 1) { env.$("btnRetry").click(); env.$("btnBegin").click(); env.CC.A.pause(); run(env); }
    env.$("btnNext").click();
  }
  assert.ok(!env.$("s-final").hidden);
  const rows = [...env.d.querySelectorAll("#finalTable tbody tr")].map(t => t.cells[0].textContent);
  assert.equal(rows.length, 6);
  assert.match(rows[0], /attempt 2/);
  const sum = JSON.parse(JSON.stringify(env.w.summary()));       // plain objects, not jsdom-realm ones
  assert.equal(sum.rounds.length, 7);
  assert.deepEqual(sum.rounds.filter(x => x.round === 1).map(x => x.attempt), [1, 2]);
  const latest = {}; sum.rounds.forEach(x => { latest[x.round] = x.score; });
  assert.equal(sum.totalScore, Object.values(latest).reduce((a, b) => a + b, 0));
  assert.equal(sum.paceMsPerTick, 900);
  for (const k of ["game", "version", "date", "realPlantView", "totalScore", "rounds"]) assert.ok(k in sum, k);
}));

test("neutral labels: names, topics and clues are hidden, and the switch restores them", () => withGame(env => {
  const card = r => env.d.querySelector(`#jumpRow button[data-round="${r}"]`).textContent.replace(/\s+/g, " ").trim();
  assert.match(card(3), /Mirror, mirror/);
  env.$("neutralToggle").click();
  assert.match(card(3), /^3\s*Round 3$/);
  assert.ok(env.d.body.classList.contains("neutral"));
  begin(env, 3);
  assert.equal(env.$("roundLabel").textContent, "Round 3 of 6");
  assert.equal(env.$("hintBar").textContent, "Keep the brew in the band and the vessel safe.");
  run(env);
  assert.match(env.$("dbKicker").textContent, /The dashboard lied/, "the debrief still reveals the topic");
  env.$("neutralToggle").click();
  assert.match(card(3), /Mirror, mirror/);
}));
test("neutral labels: ?labels=neutral turns them on from the address", () => withGame(env => {
  assert.ok(env.d.body.classList.contains("neutral"));
  assert.equal(env.$("neutralToggle").checked, true);
}, "?labels=neutral"));

test("?round=N opens that round's brief, and round 4 and 6 show their choices", () => {
  for (const [r, choice] of [[3, null], [4, "netChoice"], [6, "aiChoice"]]) {
    withGame(env => {
      assert.ok(!env.$("s-brief").hidden);
      assert.match(env.$("briefKicker").textContent, new RegExp(`Round ${r}`));
      if (choice) assert.equal(env.$(choice).hidden, false);
    }, `?round=${r}`);
  }
});

test("pace: the setting changes the tick length and is remembered", () => withGame(env => {
  env.$("pace").value = "600"; env.$("pace").dispatchEvent(new env.w.Event("change"));
  assert.equal(env.w.eval("TICK_MS"), 600);
  assert.equal(env.w.localStorage.getItem("cc-pace"), "600");
  assert.match(env.$("paceNote").textContent, /54 seconds/);
}));

/* ---------- content guards ---------- */
test("debriefs cite the verified technique IDs", () => withGame(env => {
  const expect = {
    2: ["T0832"],
    3: ["T0831", "T0832", "T1692.002", "T0880"],
    4: ["T1692.001", "T0836"],
    5: ["T0878", "T0815"],
    6: ["AML.T0051", "LLM06:2025"]
  };
  for (const [r, ids] of Object.entries(expect)) {
    begin(env, +r); run(env);
    const text = chips(env).join(" | ");
    for (const id of ids) assert.ok(text.includes(id), `round ${r} should cite ${id}, got: ${text}`);
  }
  // the renumbered IDs must not come back
  const all = JSON.stringify(env.w.eval("ROUNDS.map(r => r.db.tech)"));
  assert.ok(!/T0855|T0856/.test(all), "T0855 and T0856 were renumbered to T1692.001 and T1692.002");
}));

test("repository text stays free of private references", () => {
  const files = ["index.html", "README.md", "docs/INSTRUCTOR.md"].map(f => fs.readFileSync(path.join(ROOT, f), "utf8"));
  for (const text of files) assert.ok(!/petition|conference|call for papers|\bcfp\b/i.test(text));
});

test("a full passive run of the orientation and every round reaches the shift report with no errors", () => withGame(env => {
  env.$("btnStart").click();
  begin(env, 0); env.CC.A.finish(); env.$("btnNext").click();
  const outcomes = [];
  for (let r = 1; r <= 6; r++) { env.$("btnBegin").click(); env.CC.A.pause(); outcomes.push(run(env).outcome); env.$("btnNext").click(); }
  assert.deepEqual(outcomes, ["complete", "complete", "blowup", "trip", "trip", "trip"]);
  assert.ok(!env.$("s-final").hidden);
  assert.equal(env.d.querySelectorAll("#finalTable tbody tr").length, 6);
}));
