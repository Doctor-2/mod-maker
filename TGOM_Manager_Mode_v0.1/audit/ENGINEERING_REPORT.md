# TGOM Manager Mode v0.1 engineering report

## Production base

Production builds use root `PluginScripts.rxdata` (SHA-256
`582e7e0e4bae1a5b6631210074727c504480251ebc24d7b563d4a430d8cc1bd4`), which
contains the TGOM Companion Logger. The injector verifies that plugin is present.
The pre-Companion backup is rejected by the build script.

## Event safety model

`tools/audit_routine_events.rb` inventories every map, event, page, command code,
script line and trainer signature. Its safe command grammar only identifies
candidates. Human promotion to `SAFE_ROUTINE` is recorded in
`ROUTINE_ALLOWLIST.md`; unknown content fails closed. Map events are not edited.

The promoted routine regions are Map003, Maps007/008/010, and Map021. Map012
Rough Rider candidates are story-linked and remain excluded. Delegation sets
the same per-page self-switch only when the exact original page condition passes,
and grants exact `max party level * trainer type base_money`, the page's
Reputation, Highest Reputation, and the normal battle-money statistic. Battle-only
multipliers remain excluded. Items and every unlisted page remain.

Maps004–006 are protected wholesale. This preserves all ten Cave of Knowledge
riddles, variable 37, Ken, Lillith, and all starter/Charmander gift branches.
Gym, story, boss, reward and other scripted battles are not intercepted.

## Manager systems

The Gym Staff menu exposes audited clearing, three-candidate scouting,
recruitment, catch-up training, anchoring/travel, curated story entrances and
return. Tokens are awarded idempotently from completed three-battle Gym shifts,
Rank Up, official area unlock switches, and the first retained important-event
loss. Reputation is not a token source.
Blacklist permanently suppresses a species; the last two reports apply a soft
weight reduction. Training derives its target from the current-rank Gym
challenger bracket. Travel uses only audited Gym/entrance coordinates and rejects
locked or protected maps.

Manager actions are written through `TGOMCompanion.write_line("MANAGER", ...)`,
preserving the production Companion Logger and its passive battle transcript.

## Verification boundary

`tests/test_manager.rb` is a pure Ruby unit harness plus contracts against the
committed extracted map audit. `tests/test_extracted_source.rb` inspects the
actual Essentials 20.1 `Scripts.rxdata` and TGOM `System.rxdata` for the level UI,
evolution, battle-end hook, and named switch/variable contracts. The package
round-trip verifies the Companion plugin remains before Manager. These tests do
not load a live save, render Pokégear, play a three-challenger shift, choose a
move/evolution interactively, or execute an actual map transfer; those remain
live-runtime acceptance checks.
