# Accessibility statement

**Target:** WCAG 2.2 level AA. **Status:** the game has been checked with automated tools and by hand in a browser, and has **not** yet had a manual screen-reader audit, testing with disabled users, or a third-party audit. It should not be described as "WCAG 2.2 AA conformant" until it has. This page says what was done and what was not.

Last checked: 25 November 2026, against the version in the repository at that date.

## What is built in

- **Keyboard:** every control can be reached and used from the keyboard, with a visible focus ring. A skip link jumps to the main content. The emergency shutdown key needs two presses so a stray key cannot end a round.
- **Single-key shortcuts** (M, R, V, I, C, H, S, P, E) can be switched off under **Settings → Keyboard shortcuts** (WCAG 2.1.4), and are ignored while typing in a field or choosing from a list.
- **Time:** there is a Pause button, three pace settings (relaxed 1.3 s, normal 0.9 s, quick 0.6 s per tick), up to three hints per round, and you cannot lose the game (WCAG 2.2.1).
- **Motion:** the cauldron animation follows the system "reduce motion" setting and has its own **Reduce motion** switch (WCAG 2.2.2).
- **Sound:** off-able, and never the only way information is given. The optional boil sound is off by default (WCAG 1.4.2).
- **Not by colour alone:** alarm severity is written (LOW, HIGH, CRIT), the gauge reading is written with a word (normal, high, danger), and the vessel's state is described in a sentence.
- **Screen reader support:** a **Read status** button (key S) speaks one sentence with the display readings, the gauge and the state of the vessel, so the "honest witnesses" the game relies on are available without sight. The pot and gauge carry live text labels. Hints and coach steps are announced politely, critical alarms assertively, and the round-5 alarm flood is deliberately not announced line by line.
- **Charts have text:** the debrief chart has a written summary and a data table. The control-loop diagram has a text description and the same information is repeated in the cards below it.
- **Structure:** one main landmark, a heading outline, descriptive page titles on every screen, labelled form controls and tables with header cells.
- **Reflow and targets:** the layout works at 320 px width without sideways scrolling (the control-loop diagram scrolls inside its own labelled, focusable box). Buttons are at least 44 px high. A focused control is kept clear of the sticky banner and the fixed action bar (WCAG 2.4.11).
- **Colour contrast:** text is at least 4.5:1 and controls and meaningful graphics at least 3:1 on the colours they sit on. This is checked by a test that reads the colour tokens from the stylesheet.
- **Privacy:** preferences are kept in the browser only. Nothing is sent anywhere.

## How it was checked

1. **Automated, in a simulated browser** (`tests/a11y.test.js`, run on every push): axe-core 4.x with the WCAG 2.0, 2.1 and 2.2 A and AA rule sets plus best-practice rules, on the start screen, all seven briefs, all rounds while playing, the debrief and the shift report. Zero violations.
2. **Automated, in a real browser:** axe-core including its colour-contrast rule, on the start screen, briefs, play and debrief screens of rounds 0, 5 and 6, at 320 px and desktop widths. This found one real problem (scrolling regions that could not be reached by keyboard), which was fixed.
3. **By hand in a browser:** reflow at 320 px, the settings menu, and that a focused control is not hidden behind the fixed action bar.

## What has not been done

- No testing with NVDA, JAWS, VoiceOver or TalkBack. The labels and live regions are designed for them but are unverified in practice.
- No testing with people who use assistive technology, switch access, voice control or magnification.
- No audit of the real-time play experience for people with cognitive or motor disabilities beyond the accommodations above.
- Automated tools find only a minority of issues. Passing them is necessary, not sufficient.

## Known limitations

- Round play is real time. Pause, pace and hints reduce the pressure but do not remove it.
- The cauldron picture and the gauge needle are visual. Their text equivalents (status sentence, captions, labels) describe the same state but are not live-updated line by line, by design.
- Colour is used for the gauge arcs and pot, always with a text equivalent alongside.

## Report a problem

Open an issue at <https://github.com/clarkngo/cauldron-control/issues> with the device, browser and assistive technology you used. Accessibility reports are treated as bugs, not feature requests.
