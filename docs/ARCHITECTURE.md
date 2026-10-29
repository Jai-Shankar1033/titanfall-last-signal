# Architecture

The game is a single `index.html`: a 320x180 canvas scaled by whole device-pixel steps with smoothing off. The script is organised in sections, in this order:

| Section | Purpose |
|---|---|
| save | `load()` validates and sanitises `localStorage` data; `save()` writes it |
| audio | `snd`, `nz`, `sfx` (effects), `music` (scheduler on the audio clock) |
| input | key remapping (`ACT`, `bind`), touch UI (`lay`), gamepad (`gp`) |
| sprites | pixel maps -> cached canvases (`mk`, `rim`, `mkv`), bosses in `BS` |
| data | `WP` weapons, `E` enemies, `LV` levels, `SQ` boss attack sequences |
| state/menus | scene variable `S`, menu stack `M`, sub-menus |
| level | `lvl()` builds a run (`G`); `ph()` is shared gravity/platform physics |
| combat | `shoot`, `boom`, `dmg`, `kill`, `surge`, `bossHit` |
| enemies/boss | per-type state machines; boss step engine (`bossUpd`, `enter`) |
| play/draw | per-frame update and rendering (`bg`, `world`, `boss`, `hud`) |
| loop | `requestAnimationFrame` calling `upd` then `draw` |

## Scenes
`title`, `sel`, `set`, `sub`, `ctl`, `cred`, `brief`, `play`, `pause`, `dead`, `res`, `end`.

## Gameplay rules (encoded by tests)
**Signal Surge:** max 100; hit +2; kill +6; kill with a different weapon than the previous qualifying kill +4; radius 110; 3 damage to ordinary enemies; clears enemy bullets in range; Siege Walker open core takes 3; closed cores and phase transitions take 0; needs a full meter; consumes it; death, respawn and a new run reset it; blocked while paused.

**Combo:** kills within 2.5 s continue the chain; +0.25 per qualifying kill; max 2.0x.

**Grades:** S = 0 deaths and <= 180 s; A <= 1 death; B <= 3; otherwise C.

**Bosses:** Siege Walker 100 HP (phase 2 at 50); Thornback Harvester 180 HP (roots below 90); Signal Architect 360 HP (phase 2 below 260, phase 3 below 140). Damage is only taken while the core is open.

**Upgrades:** each collected data core adds +1 max HP and 3% faster fire. Per-level core counts use the maximum, so replaying cannot stack them.

## Save schema (`localStorage["tfl1"]`)
`v`, `un` (unlocked level), `best`, `cores`, `m`/`mu`/`sf` (volumes), `mute`, `rs` (reduced effects), `af` (touch auto-fire), `kb` (key bindings), `ts`/`to`/`lh` (touch size/opacity/left-handed), `hs`/`hb`/`hv` (HUD size/background/score). Unknown or invalid fields are replaced by defaults.

## Input
Key presses are translated through `mc()` so a rebound key becomes its canonical action and the old key stops working. Touch buttons track each pointer id separately; releases are also handled at window level so a lost event cannot leave a button stuck.

## Rendering and audio
World coordinates are 320x180 logical pixels. Sprites are drawn from string pixel maps; a 1 px rim light is added to the player and enemies for readability. Audio uses Web Audio oscillators and noise bursts; music notes are scheduled slightly ahead against `AudioContext.currentTime`.
