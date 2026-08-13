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

Map003 events 1, 2 and 5 are the only promoted routine trainers. Delegation sets
the same per-page self-switch and grants exact `max party level * trainer type
base_money` plus the page's Reputation. Items and every unlisted page remain.

Maps004–006 are protected wholesale. This preserves all ten Cave of Knowledge
riddles, variable 37, Ken, Lillith, and all starter/Charmander gift branches.
Gym, story, boss, reward and other scripted battles are not intercepted.

## Manager systems

The Gym Staff menu exposes audited clearing, three-candidate scouting,
recruitment, catch-up training, anchoring/travel and return. Tokens are awarded
idempotently from observed Reputation milestones, including Reputation earned by
delegated Gym work.
Blacklist and recent history suppress candidates. Training derives its target
from the currently audited opponents, and travel only uses a player-recorded
anchor/origin while rejecting protected maps.

Manager actions are written through `TGOMCompanion.write_line("MANAGER", ...)`,
preserving the production Companion Logger and its passive battle transcript.
