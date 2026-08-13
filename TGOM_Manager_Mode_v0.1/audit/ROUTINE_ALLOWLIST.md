# Routine trainer allowlist

`tools/audit_routine_events.rb` inventories all 59 maps and 557 events. Its
command grammar finds candidates; candidates are not runtime-safe until every
page is reviewed and the exact tuple is copied into `SAFE_ROUTINE`.

| Region | Map | Runtime-safe routine events |
|---|---:|---|
| Winding Woods | 3 | 1 Ellen v0/v1 (Rep 10/15, A/B); 2 Jeff v0/v1 (10/15, A/B); 5 Liz v0/v1 (15/20, A/B) |
| Steel Caves | 7 | 3 Bill v0 (10, A); 4 Ricky v0/v1 (20/25, A/B); 7 Missy v0/v1 (15/20, A/B); 11 Jacob v0/v1 (20/25, A/B) |
| Steel Caves | 8 | 2 Burton v0 (15, A); 3 Linda v0/v1 (20/25, A/B); 4 Gladstone v0 (15, A); 5 Timothy v0 (20, A) |
| Steel Caves | 10 | 4 Nat v0/v1 (30/35, A/B); 5 Kevin v0 (20, A); 6 Dennis v0 (20, A); 7 Racer v1 (20, A) |
| Miser Marsh | 21 | 23 Davy, 24 Rob, 25 Anna, 27 Chris, all v0 (20, A) |

Each tuple was checked for a single ordinary `TrainerBattle.start`, its matching
Reputation variable operation, conditional variable 34 (Highest Reputation)
update from variable 29, and its terminal self-switch. Each page's exact RPG
page condition is stored in `full_event_audit.json` and mirrored by
`ROUTINE_CONDITIONS`. Delegation applies
only the currently reachable A/B page. It never runs an event command list.

Map012's Rough Rider battles are excluded because they participate in the
Badlands/Rider story sequence. Item events and every Gym, story, boss, reward,
gift, transfer, common-event, and unknown battle are excluded. Maps 4–6 are
categorically protected, preserving all Cave of Knowledge riddles, variable 37,
Ken recruitment, Lillith, and every starter/Charmander reward branch.
