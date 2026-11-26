"use strict";
/* Tests that keep the documentation honest: generated docs match the game, every claim has a source, every link target exists. */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM, VirtualConsole } = require("jsdom");
const { build, CLAIM_SOURCES } = require("../scripts/build-docs.js");

const ROOT = path.join(__dirname, "..");
const HTML = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

function load() {
  const vc = new VirtualConsole();
  const dom = new JSDOM(HTML, { url: "http://localhost/", runScripts: "dangerously", pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(w) { w.scrollTo = () => {}; w.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: () => () => {}, set: () => true }); } });
  return dom.window;
}
const data = w => JSON.parse(w.eval("JSON.stringify({ rounds: ROUNDS.map(r => ({ refs:r.refs||[], real:r.db.real, name:r.name })), sources: SOURCES })"));

test("docs/SOURCES.md and docs/CLAIMS-REGISTER.md are up to date (run: node scripts/build-docs.js)", () => {
  for (const [file, text] of Object.entries(build())) {
    assert.equal(fs.readFileSync(path.join(ROOT, file), "utf8"), text, `${file} is out of date`);
  }
});

test("every round cites sources, every cited source exists, and every source has a real link and a status", () => {
  const w = load(); const d = data(w); w.close();
  const urls = new Set();
  d.rounds.forEach((r, i) => {
    assert.ok(r.refs.length >= 1, `round ${i} has no sources`);
    for (const k of r.refs) assert.ok(d.sources[k], `round ${i} cites unknown source ${k}`);
  });
  for (const [k, s] of Object.entries(d.sources)) {
    assert.match(s.u, /^https:\/\//, k);
    assert.ok(["read", "located"].includes(s.v), `${k} status`);
    assert.ok(s.t.length > 10, `${k} citation`);
    assert.ok(!urls.has(s.u), `${k} duplicates a URL`); urls.add(s.u);
  }
});

test("every real-world claim has a source mapping (or is explicitly marked as a general statement)", () => {
  const w = load(); const d = data(w); w.close();
  d.rounds.forEach((r, i) => {
    if (!r.real.length) return;
    const m = CLAIM_SOURCES[i];
    assert.ok(m, `round ${i} has real-world claims but no source mapping`);
    assert.equal(m.length, r.real.length, `round ${i}: ${r.real.length} claims but ${m.length} mappings`);
    m.forEach(keys => { if (keys) for (const k of keys) assert.ok(d.sources[k], `unknown source ${k}`); });
  });
});

test("claims that went further than their primary source are not back in the game", () => {
  const all = HTML;
  for (const banned of [/275 alarms/, /more than a hundred alarms/i, /hundreds of alarms/i, /alarm printer fell behind/i, /classic case study/i])
    assert.ok(!banned.test(all), `unsupported wording is back: ${banned}`);
});

test("the model assumptions documented in the claims register match the code", () => {
  const reg = fs.readFileSync(path.join(ROOT, "docs/CLAIMS-REGISTER.md"), "utf8");
  for (const [doc, code] of [["0.0196 × heater%", "0.0196 * heat"], ["0.015 × (T − 20)", "0.015 * (S.T - 20)"], ["6 × (setpoint − reading)", "6 * (S.sp - reading)"],
    ["1.0 + 0.012 × (T − 20)", "1.0 + (T - 20) * 0.012"], ["Venting removes 3 °C per tick for 5 ticks", "dT -= 3"], ["unavailable for 10 ticks", "S.ventCool = 10"]]) {
    assert.ok(reg.includes(doc), `register should say: ${doc}`);
    assert.ok(HTML.includes(code), `code should contain: ${code}`);
  }
});

test("debriefs show their sources as links that open safely in a new tab", () => {
  const w = load(), d = w.document;
  try {
    d.querySelector('#jumpRow button[data-round="5"]').click(); d.getElementById("btnBegin").click(); w.CC.A.pause();
    while (!w.CC.state().ended) w.CC.step();
    const links = [...d.querySelectorAll("#dbBody a")];
    assert.ok(links.length >= 4);
    for (const a of links) {
      assert.match(a.href, /^https:\/\//);
      assert.equal(a.target, "_blank");
      assert.match(a.rel, /noopener/); assert.match(a.rel, /noreferrer/);
      assert.match(a.textContent, /opens in a new tab/);
    }
    assert.match(d.getElementById("dbBody").textContent, /Texaco Refinery, Milford Haven/);
  } finally { w.close(); }
});

test("every document the game links to exists in the repository", () => {
  const targets = [...HTML.matchAll(/github\.com\/clarkngo\/cauldron-control\/blob\/main\/([\w./-]+)/g)].map(m => m[1]);
  assert.ok(targets.length >= 6);
  for (const t of new Set(targets)) assert.ok(fs.existsSync(path.join(ROOT, t)), `${t} is linked from the game but missing`);
});

test("the README lists every browser-storage key the game uses, so the privacy statement is complete", () => {
  const used = new Set([...HTML.matchAll(/["'](cc-[a-z]+)["']/g)].map(m => m[1]));
  const readme = fs.readFileSync(path.join(ROOT, "README.md"), "utf8");
  assert.ok(used.size >= 6);
  for (const key of used) assert.ok(readme.includes("`" + key + "`"), `${key} is used but not listed in the README privacy section`);
});

test("the game makes no network requests of its own", () => {
  assert.ok(!/\bfetch\s*\(|XMLHttpRequest|navigator\.sendBeacon|new WebSocket|<script[^>]+src=|<link[^>]+href=["']http/i.test(HTML));
});
