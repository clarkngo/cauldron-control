"use strict";
/*
 * Accessibility tests (WCAG 2.2 AA, as far as can be checked without a real browser).
 *
 * axe-core runs against every screen of the game in jsdom. jsdom has no layout engine, so axe's colour-contrast rule
 * cannot run there; contrast is instead computed from the design tokens in the stylesheet (see the contrast test).
 * These tests do not replace a manual keyboard and screen-reader audit: see docs/ACCESSIBILITY.md for what was
 * and was not tested by hand.
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM, VirtualConsole } = require("jsdom");

const ROOT = path.join(__dirname, "..");
const HTML = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const AXE = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

function load(query = "") {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on("jsdomError", e => errors.push(String(e.message || e)));
  const dom = new JSDOM(HTML, {
    url: "http://localhost/" + query, runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(w) {
      let seed = 4242; w.Math.random = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
      w.scrollTo = () => {};
      w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: () => () => {}, set: () => true });
    }
  });
  const w = dom.window;
  w.eval(AXE);
  return { w, d: w.document, $: id => w.document.getElementById(id), CC: w.CC, errors };
}

const RULES = { "color-contrast": { enabled: false }, "scrollable-region-focusable": { enabled: false } };   // jsdom has no layout
async function audit(env, label) {
  const res = await env.w.axe.run(env.d, { rules: RULES, runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] } });
  const lines = res.violations.map(v => `${v.id} (${v.impact}): ${v.help} -> ${v.nodes.slice(0, 3).map(n => n.target.join(" ")).join(" | ")}`);
  assert.equal(lines.length, 0, `${label}: accessibility violations:\n${lines.join("\n")}`);
}

test("axe: start screen, every brief, and the shift report have no violations", async () => {
  const env = load();
  try {
    await audit(env, "start screen");
    for (let r = 0; r <= 6; r++) {
      env.d.querySelector(`#jumpRow button[data-round="${r}"]`).click();
      await audit(env, `brief ${r}`);
    }
    env.d.querySelector('#jumpRow button[data-round="1"]').click();
    env.$("btnBegin").click(); env.CC.A.pause();
    while (!env.CC.state().ended) env.CC.step();
    await audit(env, "debrief");
    env.d.querySelector('#jumpRow button[data-round="6"]').click();
    for (let i = 0; i < 6; i++) { env.$("btnBegin").click(); env.CC.A.pause(); while (!env.CC.state().ended) env.CC.step(); env.$("btnNext").click(); }
    assert.ok(!env.$("s-final").hidden);
  } finally { env.w.close(); }
});

for (const [r, ticks, opts] of [[0, 3, {}], [1, 40, {}], [3, 40, {}], [4, 20, { net: "flat" }], [5, 40, {}], [6, 45, { ai: "advisory" }]]) {
  test(`axe: round ${r} while playing has no violations`, async () => {
    const env = load();
    try {
      env.d.querySelector(`#jumpRow button[data-round="${r}"]`).click();
      if (opts.net) env.d.querySelector(`input[name=net][value=${opts.net}]`).checked = true;
      if (opts.ai) env.d.querySelector(`input[name=ai][value=${opts.ai}]`).checked = true;
      env.$("btnBegin").click(); env.CC.A.pause();
      for (let i = 0; i < ticks && !env.CC.state().ended; i++) env.CC.step();
      if (r > 0) env.$("btnTip").click();
      await audit(env, `round ${r} in play`);
    } finally { env.w.close(); }
  });
}

test("axe: the final shift report has no violations", async () => {
  const env = load();
  try {
    env.$("btnStart").click();
    env.$("btnBegin").click(); env.CC.A.pause(); env.CC.A.finish(); env.$("btnNext").click();
    for (let r = 1; r <= 6; r++) { env.$("btnBegin").click(); env.CC.A.pause(); while (!env.CC.state().ended) env.CC.step(); env.$("btnNext").click(); }
    assert.ok(!env.$("s-final").hidden);
    await audit(env, "shift report");
  } finally { env.w.close(); }
});

/* ---------- contrast, from the design tokens ---------- */
function lum(hex) {
  const c = hex.replace("#", ""), v = [0, 2, 4].map(i => parseInt(c.length === 3 ? c[i / 2] + c[i / 2] : c.substr(i, 2), 16) / 255)
    .map(x => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)));
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
}
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

test("colour contrast: text is at least 4.5:1 and meaningful graphics at least 3:1 on the panels they sit on", () => {
  const root = HTML.match(/:root\{([^}]*)\}/)[1];
  const tok = {}; for (const m of root.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{3,6})/g)) tok[m[1]] = m[2];
  const bgs = ["bg", "panel", "panel2"];
  const text = ["ink", "mute", "brass", "info", "ok", "warn", "bad"];
  const fails = [];
  for (const t of text) for (const b of bgs) { const r = ratio(tok[t], tok[b]); if (r < 4.5) fails.push(`text --${t} on --${b}: ${r.toFixed(2)}`); }
  // buttons: label colour on the button background
  const pairs = [["#1a1409", tok.brass, "primary button"], ["#ffd2cb", tok.panel2, "danger button label"], [tok.ink, tok.panel2, "button label"], ["#f06a5a", "#0e0c0a", "alarm readout on its box"], [tok.ink, "#0e0c0a", "readout"], [tok.mute, "#0e0c0a", "readout caption"]];
  for (const [fg, bg, name] of pairs) { const r = ratio(fg, bg); if (r < 4.5) fails.push(`${name}: ${r.toFixed(2)}`); }
  // non-text: borders and focus ring that identify controls, and the gauge colours
  for (const [fg, bg, name] of [[tok.focus, tok.bg, "focus ring"], [tok.focus, tok.panel, "focus ring on panel"], [tok.brass, tok.panel, "brass outline"], ["#8196a4", "#262019", "gauge low arc"]]) {
    const r = ratio(fg, bg); if (r < 3) fails.push(`${name}: ${r.toFixed(2)}`);
  }
  assert.deepEqual(fails, []);
});

/* ---------- behaviour that WCAG 2.2 asks for ---------- */
test("structure: skip link, one main landmark, and a descriptive page title on each screen", () => {
  const env = load();
  try {
    assert.equal(env.d.querySelector("a.skip").getAttribute("href"), "#main");
    assert.ok(env.$("main"));
    assert.equal(env.d.querySelectorAll("main").length, 1);
    assert.equal(env.d.title, "Cauldron Control");
    env.d.querySelector('#jumpRow button[data-round="3"]').click();
    assert.match(env.d.title, /Briefing: Round 3/);
    env.$("btnBegin").click(); env.CC.A.pause();
    assert.match(env.d.title, /In play: Round 3/);
    while (!env.CC.state().ended) env.CC.step();
    assert.match(env.d.title, /Debrief: Round 3/);
    assert.ok(!/Mirror/.test(env.d.title), "the title must not reveal the round topic");
  } finally { env.w.close(); }
});

test("focus order follows visual order: the assistant panel comes straight after the HMI", () => {
  const env = load();
  try {
    const order = [...env.d.querySelectorAll(".grid > .panel")].map(p => p.className.split(" ").filter(c => c !== "panel")[0]);
    assert.deepEqual(order, ["vessel", "hmi", "aibox", "gaugebox", "controls", "logbox"]);
  } finally { env.w.close(); }
});

test("keyboard shortcuts can be switched off (WCAG 2.1.4) and are ignored while typing in a select", () => {
  const env = load();
  try {
    env.d.querySelector('#jumpRow button[data-round="1"]').click(); env.$("btnBegin").click(); env.CC.A.pause();
    const press = (k, target = env.d.body) => target.dispatchEvent(new env.w.KeyboardEvent("keydown", { key: k, bubbles: true }));
    press("m"); assert.equal(env.CC.state().mode, "manual");
    press("m"); assert.equal(env.CC.state().mode, "auto");
    env.$("keysToggle").click();                                    // switch shortcuts off
    assert.equal(env.w.localStorage.getItem("cc-keys"), "off");
    press("m"); assert.equal(env.CC.state().mode, "auto", "shortcut ignored when switched off");
    env.$("keysToggle").click();
    press("m", env.$("pace")); assert.equal(env.CC.state().mode, "auto", "typing in a select must not trigger shortcuts");
    press("m"); assert.equal(env.CC.state().mode, "manual");
  } finally { env.w.close(); }
});

test("reduced motion can be switched on and is remembered", () => {
  const env = load();
  try {
    assert.ok(!env.d.body.classList.contains("still"));
    env.$("motionToggle").click();
    assert.ok(env.d.body.classList.contains("still"));
    assert.equal(env.w.localStorage.getItem("cc-motion"), "reduced");
  } finally { env.w.close(); }
});

test("screen-reader status: one sentence carries the readings, the gauge and the vessel", () => {
  const env = load();
  try {
    env.d.querySelector('#jumpRow button[data-round="3"]').click(); env.$("btnBegin").click(); env.CC.A.pause();
    for (let i = 0; i < 50; i++) env.CC.step();                    // well into the attack: screen flat, vessel hot
    env.$("btnStatus").click();
    return new Promise(resolve => setTimeout(() => {
      const msg = env.$("statusLive").textContent;
      try {
        assert.match(msg, /Tick 50 of 90/);
        assert.match(msg, /temperature 7\d\.\d/, "the HMI still shows a normal temperature");
        assert.match(msg, /gauge: 1\.9\d bar, high/i, "the gauge tells the truth");
        assert.match(msg, /rolling and hot|churning/, "the vessel tells the truth");
        assert.equal(env.$("statusLive").getAttribute("aria-live"), "polite");
        assert.match(env.$("gauge").getAttribute("aria-label"), /bar, high/);
        assert.match(env.$("pot").getAttribute("aria-label"), /rolling and hot|churning/);
      } finally { env.w.close(); }
      resolve();
    }, 150));
  } catch (e) { env.w.close(); throw e; }
});

test("the debrief chart has a text alternative and a data table", () => {
  const env = load();
  try {
    env.d.querySelector('#jumpRow button[data-round="3"]').click(); env.$("btnBegin").click(); env.CC.A.pause();
    while (!env.CC.state().ended) env.CC.step();
    assert.equal(env.$("dbChart").getAttribute("role"), "img");
    assert.equal(env.$("dbChart").getAttribute("aria-labelledby"), "dbChartText");
    assert.match(env.$("dbChartText").textContent, /True temperature peaked at \d+ °C at tick \d+/);
    assert.match(env.$("dbChartText").textContent, /Attack begins at tick 22/);
    const rows = env.$("dbTable").tBodies[0].rows;
    assert.ok(rows.length >= 15);
    assert.ok(!/NaN|undefined/.test(env.$("dbTable").textContent));
  } finally { env.w.close(); }
});

test("hints and the coach are announced politely", () => {
  const env = load();
  try {
    assert.equal(env.$("hintBar").getAttribute("aria-live"), "polite");
    assert.equal(env.$("tipBox").getAttribute("aria-live"), "polite");
    assert.equal(env.$("srAlert").getAttribute("aria-live"), "assertive");
  } finally { env.w.close(); }
});

test("every scrolling region can be reached and labelled from the keyboard", () => {
  const env = load();
  try {
    const css = HTML.match(/<style>([\s\S]*?)<\/style>/)[1];
    assert.ok(/#log\{[^}]*overflow:auto/.test(css) && /\.aimsgs\{[^}]*overflow:auto/.test(css) && /\.scrollx\{overflow-x:auto/.test(css), "these are the scrolling regions");
    for (const sel of ["#log", "#aiMsgs"]) { const el = env.d.querySelector(sel); assert.equal(el.getAttribute("tabindex"), "0", sel); assert.ok(el.getAttribute("aria-label"), sel); }
    env.d.querySelector('#jumpRow button[data-round="0"]').click();
    const box = env.d.querySelector("#briefBody .scrollx");
    assert.equal(box.getAttribute("tabindex"), "0"); assert.equal(box.getAttribute("role"), "region"); assert.ok(box.getAttribute("aria-label"));
    assert.equal(env.d.querySelector("#dbTable").closest(".scrollx").getAttribute("tabindex"), "0");
  } finally { env.w.close(); }
});
