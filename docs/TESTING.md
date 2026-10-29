# Testing

`npm test` runs seven suites plus a traversal smoke test (216 checks).

The game is one HTML file, so `tests/h*.js` load its `<script>` into a Node `vm` sandbox with a stubbed DOM and expose internal state. This allows deterministic, frame-stepped tests without a browser.

| File | Covers |
|---|---|
| t.js | combo, Surge, weapons, checkpoints, saves, boss kill and phases, ending |
| t2.js | pause/death timers, boss respawn, replay, upgrades, core reachability |
| t3.js | E interaction, secret rooms, ground roots, auto-fire, audio levels |
| t4.js | multi-touch pointers, viewport scaling |
| t5.js | key remapping, touch layout, HUD options, music scheduler |
| t6.js | touch layout overlap, lost-release recovery |
| t7.js | desktop vs mobile menu visibility |
| bot.js | a bot holding "right" reaches every boss arena |

## What this does **not** prove
- Real browser rendering, real-device touch feel, real audio output, gamepad hardware, frame rate.
- That the bosses are fair or fun; bots only show they are killable.
- The harness uses a stubbed canvas for logic tests. Screenshots use `@napi-rs/canvas`, which is not a browser.

Please add a test with every gameplay change, and report real-device results in issues.
