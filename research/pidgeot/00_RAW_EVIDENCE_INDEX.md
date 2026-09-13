# Custom Mega Pidgeot — Raw Evidence Index

Purpose: source-only input for a later independent analysis. This file intentionally contains no tier judgment, recommendation, designer-intent interpretation, or historical assistant conclusion.

## A. Canonical custom rules supplied by the designer

Target species: Mega Pidgeot.

- Type: Normal / Flying.
- Base stats: HP 83 / Atk 93 / Def 99 / SpA 112 / SpD 88 / Spe 104. Total 579.
- Ability working name: Wingtip Vortex / 翼尖涡流.
- While the ability holder is active, the field is in a turbulence state.
- The turbulence state retains the defensive type-effect principle associated with Delta Stream / strong winds: when Rock-, Electric-, or Ice-type effectiveness is super-effective specifically because of a target's Flying type, that Flying-type super-effective component is neutralized. This applies to all Pokémon on the field, not only the holder or its allies.
- Unlike ordinary weather, this turbulence state is specified to coexist with Rain / Sun / Sand / Snow. Ordinary weather does not overwrite it, and it does not overwrite ordinary weather.
- Additional custom rule: all wind-category moves always hit while the Wingtip Vortex holder is active. The rule is global and applies to either side.
- Global move-rule change bundled with this design: Hyper Beam accuracy is 100 instead of 90.
- Pidgeot gains Work Up. Other moves use the current Pokémon Champions Pidgeot movepool.
- Standard Mega rules otherwise remain unchanged: one Mega Evolution per battle and the Mega Stone occupies the item slot.

### Implementation assumption currently used for engine tests

The phrase “wind moves always hit” is implemented as bypassing the normal accuracy/evasion check only. It does not add No Guard's separate ability to hit targets in semi-invulnerable states such as Fly/Dig unless the move already has such behavior. The designer has not yet been asked to resolve this edge case because it has not been needed for the competitive benchmark.

### Other edge semantics intentionally unresolved

No custom decision has yet been made for interaction with Neutralizing Gas, Gastro Acid, Trace, Skill Swap, Role Play, Receiver, or analogous ability-manipulation mechanics. The current implementation behaves as an ordinary ability for these interactions.

## B. Public Regulation M-A format / metagame sources

1. Smogon Champions Regulation M-A format page
   - https://www.smogon.com/dex/champions/formats/vgc-2026-regulation-m-a/
   - Format identifier shown publicly: `gen9championsvgc2026regma`.
   - Public format description includes 6-Pokémon team preview, bring 4, doubles, Item Clause, Species Clause, and Level 50 battle scaling.

2. Smogon VGC Regulation M-A Speed Tiers
   - https://www.smogon.com/forums/threads/vgc-regulation-m-a-speed-tiers.3780848/
   - Used only for public speed benchmarks. Example rows include +Speed 32-SP Unburden Sneasler = 378 and Mega Aerodactyl = 222 unboosted.

3. Smogon VGC Regulation M-A Role Compendium
   - https://www.smogon.com/forums/threads/vgc-regulation-m-a-role-compendium.3782099/
   - The resource states that included Pokémon are intended to represent viable Pokémon / Pokémon that have seen success in the format.

4. Indianapolis 2026 teams (1013 players, Regulation M-A)
   - https://limitlessvgc.com/tournaments/434/teams
   - Relevant raw team entries used in experiments include:
     - 35th Pranav Sharma: Mega Dragonite / Archaludon / Basculegion / Sneasler / Kingambit / Pelipper.
       - Dragonite: Dragoninite, Inner Focus, Modest; Dragon Pulse / Hurricane / Tailwind / Protect.
       - Pelipper: Sitrus Berry, Drizzle, Bold; Weather Ball / Hurricane / Wide Guard / Tailwind.
       - Sneasler: Focus Sash, Poison Touch, Jolly; Dire Claw / Close Combat / Fake Out / Protect.
       - Kingambit: Black Glasses, Defiant, Adamant; Kowtow Cleave / Sucker Punch / Iron Head / Protect.
     - 36th Richard Wan: includes White Herb / Unburden / Adamant Sneasler with Protect / Fake Out / Dire Claw / Close Combat; also Mega Aerodactyl and Mega Froslass.
     - 76th Patrick Cheng: Vivillon / Torkoal / Basculegion / Mega Kangaskhan / Mega Blastoise / Farigiraf.
       - Vivillon: Choice Scarf, Compound Eyes, Timid; Sleep Powder / Hurricane / Rage Powder / Rain Dance.
       - Torkoal: Charcoal, Drought, Quiet; Protect / Eruption / Heat Wave / Weather Ball.
       - Farigiraf: Sitrus Berry, Armor Tail, Quiet; Psychic / Thunderbolt / Helping Hand / Trick Room.

5. Indianapolis 2026 statistics
   - https://limitlessvgc.com/tournaments/434/statistics
   - Phase-2 public statistics page.

6. NAIC 2026 teams (1096 players, Regulation M-A)
   - https://limitlessvgc.com/tournaments/436/teams
   - 1st Francesco Pio Pero roster includes Charizard @ Charizardite Y and Aerodactyl @ Aerodactylite on the same six-Pokémon roster, establishing that multiple Mega Stone holders can be present on the roster even though only one Mega Evolution can occur in a battle.

7. NAIC 2026 statistics
   - https://limitlessvgc.com/tournaments/436/statistics
   - Phase-2 public statistics page.

## C. Engine implementation / reproducibility sources

### Verified implementation baseline

Repository: https://github.com/Doctor-2/mod-maker

Claude implementation branch:
- `claude/gallant-euler-6mpbzy`
- Initial implementation commit: `fd5206b`
- Corrected v4.1 commit: `32d2a5f`

The v4.1 bundle reports:
- real Pokémon Showdown `v0.11.11` checkout;
- 26 custom mechanics tests passing;
- full Showdown suite 2382 passing / 0 failing;
- `npx tsc` clean;
- `npx eslint` clean;
- Pidgeot @ Pidgeotite + Work Up team validation reports legal under the custom format;
- stock `championsregma` remains unchanged.

Current implementation source bundle:
- `pidgeot_blind_bundle_v4/BUNDLE_FOR_GPT.md`
- `pidgeot_blind_bundle_v4/showdown_overlay/`

Independent competitive-probe branch:
- `gpt/pidgeot-phase2-probes`

The competitive-probe branch inherits the v4.1 overlay and adds deterministic or fixed-seed test scenarios. Test Pokémon are explicitly set to level 50 after an earlier harness issue showed that raw test sets otherwise default to level 100 for the damage formula.

## D. Data-provenance constraint for tournament teams

The public Limitless team pages provide species, item, ability, nature, and moves. They do not provide Champions Stat Point allocations. Therefore any SP distribution in an engine probe is a declared test allocation, not claimed to be the tournament player's original SP allocation.

## E. Raw engine observations retained for later analysis

The labels below are neutral IDs. Full logs remain in `.phase2-results/latest.txt` or the corresponding test source files.

### E01 — Electric attack into Pelipper with/without Wingtip Vortex

Test level: 50.
Pelipper test allocation: 167 HP / 122 SpD in the executed branch.
Rotom-W test SpA: 125.
Same attack and fixed setup; only field anchor differs.

Recorded output:
- Wingtip Vortex active: Pelipper damage = 67; Pelipper did not faint; effectiveness log = `|1`.
- Control without Wingtip Vortex: Pelipper damage = 167; Pelipper fainted; effectiveness log = `|2`.

### E02 — two-turn paired tree: custom Mega Pidgeot vs Mega Dragonite

Common partner/opponent structure uses the Pranav-style Pelipper / Kingambit / Basculegion shell and Sneasler + Rotom-W pressure. Test SPs are synthetic and explicit in the source.

After turn 1:
- Custom Pidgeot branch: Pidgeot 166/190; Pelipper 88/167; Sneasler 7/157; Pelipper successfully used Hurricane.
- Mega Dragonite branch: Dragonite 188/198; Pelipper 0/167; Sneasler 157/157; Pelipper did not execute Hurricane.

After turn 2:
- Custom Pidgeot branch: Pidgeot 48/190; Kingambit 137/207; Sneasler 7/157; Pelipper remained alive in reserve at 88 HP; Kingambit had entered by switch and did not use Iron Head; Tailwind active.
- Mega Dragonite branch: Dragonite 136/198; Kingambit 143/207; Sneasler 30/157; Pelipper fainted; Kingambit used Iron Head; Tailwind active.

### E03 — speed-investment / same-turn Tailwind order

Custom Mega Pidgeot and Pelipper vs neutral max-speed Garchomp benchmark.

Recorded order with Modest 155-Speed Pidgeot:
1. Pidgeot Tailwind
2. Pelipper Hurricane
3. Garchomp Swords Dance

Recorded order with 124-Speed bulky Pidgeot:
1. Garchomp Swords Dance
2. Pidgeot Tailwind
3. Pelipper Hurricane

Recorded underlying unboosted speeds in the test:
- Pidgeot mid-speed = 155
- Pidgeot bulky = 124
- Pelipper = 85
- Garchomp = 154

### E04 — non-Mega second-Mega-candidate role comparison in a Charizard-Y roster

Control support: base Aerodactyl.
Alternative support: base Pidgeot holding Pidgeotite but not Mega-Evolved because Charizard Y is the selected Mega in the branch.

Rock Slide / Wide Guard branch output:
- Aerodactyl branch: Charizard damage 0; Aerodactyl damage 0; order starts Aerodactyl Wide Guard, then Charizard Heat Wave, then Tyranitar Rock Slide.
- Pidgeot branch: Charizard damage 155; Pidgeot damage 161; order starts Pidgeot Tailwind, then Charizard Heat Wave, then Tyranitar Rock Slide.

Speed-control branch output against Jolly Sneasler:
- Aerodactyl branch support Speed = 200; order: Aerodactyl Tailwind -> Charizard Heat Wave -> Sneasler Close Combat.
- Pidgeot branch support Speed = 152; order: Sneasler Close Combat -> Charizard Heat Wave -> Pidgeot Tailwind.
- Charizard test Speed = 152; Sneasler test Speed = 189.

### E05 — White Herb / Unburden speed boundary observed in the Pidgeot-vs-Dragonite decision tree

In the executed branch, Sneasler used Close Combat, consumed White Herb to repair the stat drops, and activated Unburden before the following turn.

Public speed source benchmark:
- +Speed max-SP Unburden Sneasler = 378.
- Neutral max-SP Unburden Sneasler = 340 on the current Smogon speed-tier table; separate engine calculations in this project must be used for any exact alternative spread rather than relying on memory.

Custom max-Timid Mega Pidgeot calculated/test target under Tailwind = 342.
Official max-Timid Mega Pidgeot target under Tailwind = 380.

The official-vs-custom engine isolation test for this exact comparison is still being repaired at the time this file was created; do not treat the intended order as executed evidence until the test passes.

## F. Not-yet-resolved evidence gaps

This section is descriptive, not a recommendation list.

- Official Mega Pidgeot vs custom Mega Pidgeot paired engine isolation is not yet complete because the official-format test initially encountered Team Preview lifecycle handling.
- Work Up support-dependence probes are written but not yet recorded as passing/failing in this index.
- The current raw evidence contains a rain/balance shell, a dual-Mega roster comparison, and setup-support probes. A weather-flex / sun-oriented shell has public real-team components identified but has not yet produced a competitive engine result.
- No aggregate custom-Pidgeot ladder win rate has been collected.
- No designer-intent explanation has been revealed to the analyst during the blind phase.
