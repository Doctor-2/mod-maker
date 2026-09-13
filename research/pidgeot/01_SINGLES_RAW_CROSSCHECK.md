# Custom Mega Pidgeot — Gen 7 OU raw cross-check

Purpose: limited cross-format evidence only. This file contains source facts and declared calculations; it does not assign a tier or recommend a set.

## Why this cross-check is mechanically distinct

Singles has only one active Pokémon per side. Therefore, while Mega Pidgeot is active:
- Wingtip Vortex can affect Mega Pidgeot itself and the opponent's active Pokémon;
- it cannot simultaneously protect an allied Flying Pokémon or guarantee an allied wind move, because no ally is concurrently active;
- switching or U-turning Mega Pidgeot out ends the ability's field effect before the replacement acts.

No claim about overall strength follows from those facts alone.

## Public source facts

1. Current 2026 SM OU team-building / speed resource:
   https://www.smogon.com/forums/threads/sm-ou-team-building-ressources-role-compendium-speed-tiers.3779673/

   Relevant public speed values include:
   - Garchomp, +Speed max: 333
   - Mega Pinsir, +Speed max: 339
   - Kartana, +Speed max: 348
   - Gengar / Latios, +Speed max: 350
   - Tornadus-T, +Speed max: 375
   - Greninja, +Speed max: 377 (also listed in historical/current SM speed resources)

2. Official SM Mega Pidgeot analysis:
   https://www.smogon.com/dex/sm/pokemon/pidgeot/

   The official Mega is 83/80/80/135/80/121 with No Guard. The standard listed set is Hurricane / Heat Wave / U-turn / Roost with Timid max SpA / max Speed. The analysis identifies reliable Hurricane, Speed, U-turn and Roost as strengths and Stealth Rock, Electric/Rock checks, special walls, faster attackers and Mega-slot competition as limitations.

   The same page lists Work Up + Refresh + Roost as an alternative SM option, so Work Up is not novel to the historical Gen 7 movepool even though it is a custom addition to the current Champions Pidgeot movepool.

3. Historical SM OU Mega Pidgeot analysis:
   https://www.smogon.com/forums/threads/pidgeot.3606162/

   It explicitly identifies Tornadus-T as indirect competition: both official Mega Pidgeot and Tornadus-T share base 121 Speed, while Tornadus-T has Regenerator, item freedom and broader coverage; official Mega Pidgeot's distinguishing advantage is move reliability.

4. Delta Stream / strong winds mechanics:
   https://bulbapedia.bulbagarden.net/wiki/Delta_Stream

   Strong winds remove the Flying-type super-effective component for Rock/Electric/Ice attacks. The source explicitly states that strong winds have no effect on Stealth Rock.

5. Stealth Rock mechanics:
   https://bulbapedia.bulbagarden.net/wiki/Stealth_rock

   In Gen VI onward, Stealth Rock is explicitly unaffected by strong winds. Normal/Flying therefore still takes Rock-effectiveness hazard damage on entry.

## Level-100 speed calculations for the custom form

Standard Gen 7 stat formula, 31 IV, 252 EV, positive Speed nature:

- custom Mega Pidgeot base 104 Speed -> **337**
- official Mega Pidgeot base 121 Speed -> **375**

Thus the custom max-Timid value is:
- above +Speed max Garchomp 333;
- below +Speed Mega Pinsir 339;
- below Kartana 348;
- below Gengar / Latios 350;
- below Tornadus-T 375;
- below Greninja 377.

This is only a speed-order fact; it does not establish matchup outcomes by itself.

## Example Electric-pressure calculation

Purpose: test whether removal of Flying's Electric weakness automatically removes the need for defensive investment in singles. It does not represent an asserted standard tournament spread.

Attacker benchmark:
- Tapu Koko, level 100
- base 95 SpA
- 252 SpA EV, neutral SpA nature (e.g. Timid)
- calculated SpA = 289
- Thunderbolt, 90 BP
- STAB x1.5
- Electric Terrain x1.5
- type modifier against custom Mega Pidgeot under Wingtip Vortex = x1 (Flying weakness component removed)

Custom Mega Pidgeot benchmark A:
- Timid 252 SpA / 252 Spe
- 0 HP EV / 0 SpD EV
- HP = 307
- SpD = 212
- SpA = 323
- Speed = 337

Calculated Thunderbolt damage: **200–236 / 307 (65.1–76.9%)**.
Stealth Rock remains 25% because strong winds do not affect it; after Stealth Rock the 307-HP benchmark has 231 HP remaining. Under the standard 16 damage rolls, Thunderbolt reaches at least 231 on 3/16 rolls = **18.75% KO after Stealth Rock** in this declared benchmark.

Custom Mega Pidgeot benchmark B:
- 252 HP EV / 0 SpD EV
- HP = 370
- SpD = 212

Same Thunderbolt damage: **200–236 / 370 (54.1–63.8%)**.
After 25% Stealth Rock damage, 278 HP remain, so this declared max-HP benchmark survives one such Thunderbolt from full before entry-hazard damage.

These two calculations are retained only as an EV-resource tradeoff example. They do not imply Tapu Koko is the unique or primary counter and do not establish the optimal Pidgeot spread.

## Current cross-format evidence gaps

- No custom Gen 7 Showdown mod/replay has been run for this candidate.
- No full Gen 7 team has been optimized around the custom form.
- No claim has yet been made that a bulky Work Up / Roost set is viable or superior to an offensive set.
- The interaction between Stealth Rock pressure, reduced Speed, lower immediate SpA, recovery and no move-based weaknesses needs to be weighed jointly in final analysis rather than inferred from any single threshold above.
