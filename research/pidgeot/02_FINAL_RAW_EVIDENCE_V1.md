# Custom Mega Pidgeot — Final Raw Evidence v1

Status: blind evidence frozen for the first-pass M-A review.

This file is intentionally non-evaluative. It records canonical rules, public-source facts, declared calculations, executed engine observations, and unresolved limits. It does not assign a tier, recommend a balance change, or state designer intent.

## 1. Canonical custom design supplied by the designer

Species: Mega Pidgeot

- Type: Normal / Flying
- Base stats: 83 HP / 93 Atk / 99 Def / 112 SpA / 88 SpD / 104 Spe
- BST: 579
- Ability working name: Wingtip Vortex / 翼尖涡流

While a Wingtip Vortex holder is active:

1. A turbulence field rule is active.
2. The defensive type-effect principle of Delta Stream / Strong Winds applies globally: when Rock, Electric, or Ice is super-effective specifically because of a target's Flying type, the Flying-type super-effective component is neutralized. This applies to both teams.
3. All moves carrying Pokémon Showdown's built-in `wind` flag always pass the normal accuracy/evasion check. This applies to both teams.
4. Ordinary Rain / Sun / Sand / Snow can coexist with the turbulence rule and do not replace it; the turbulence rule does not replace ordinary weather.

Other design changes:

- Hyper Beam accuracy is globally 100 rather than 90, whether or not Mega Pidgeot is currently active.
- Pidgeot gains Work Up in Pokémon Champions.
- Otherwise, use the current Champions Pidgeot movepool.
- Standard Mega rules remain: Mega Stone occupies the item slot; only one Mega Evolution can occur per battle.

Current implementation assumption for an unresolved edge:

- “wind moves always hit” bypasses normal accuracy/evasion checks only. It does not copy No Guard's separate behavior for hitting a target in semi-invulnerable states such as Fly or Dig.

Other ability-manipulation edge semantics are not designer-resolved. The current implementation treats Wingtip Vortex as an ordinary ability for Neutralizing Gas / Gastro Acid / Trace / Skill Swap / Role Play / Receiver-type interactions. No competitive result below depends on those edges.

## 2. Official comparison baseline

Official Mega Pidgeot:

- Normal / Flying
- 83 / 80 / 80 / 135 / 80 / 121
- Ability: No Guard

Custom minus official Mega:

- HP: 0
- Atk: +13
- Def: +19
- SpA: -23
- SpD: +8
- Spe: -17

Relevant current Champions Pidgeot moves verified from Showdown/Smogon include Hurricane, Heat Wave, Hyper Beam, Tailwind, Protect, Roost, U-turn, Feather Dance, Whirlwind, Brave Bird, Dual Wingbeat, Quick Attack, Agility, Substitute, and others. Work Up is the custom Champions addition.

Primary direct sources:

- Champions Pidgeot: https://www.smogon.com/dex/champions/pokemon/pidgeot/
- Champions learnset source: https://raw.githubusercontent.com/smogon/pokemon-showdown/master/data/mods/champions/learnsets.ts
- Showdown move data / wind flags: https://raw.githubusercontent.com/smogon/pokemon-showdown/master/data/moves.ts

## 3. Target format facts

Primary benchmark: Pokémon Champions VGC 2026 Regulation M-A.

Public format page:
https://www.smogon.com/dex/champions/formats/vgc-2026-regulation-m-a/

Relevant format properties:

- Doubles
- six-Pokémon team preview
- select four for battle
- Level 50 battle scaling
- Item Clause
- Species Clause
- standard Mega limit of one Mega Evolution in a battle

Public M-A resources used:

- Role Compendium: https://www.smogon.com/forums/threads/vgc-regulation-m-a-role-compendium.3782099/
- Speed Tiers: https://www.smogon.com/forums/threads/vgc-regulation-m-a-speed-tiers.3780848/
- Indianapolis teams: https://limitlessvgc.com/tournaments/434/teams
- Indianapolis statistics: https://limitlessvgc.com/tournaments/434/statistics
- NAIC teams: https://limitlessvgc.com/tournaments/436/teams
- NAIC statistics: https://limitlessvgc.com/tournaments/436/statistics

Tournament-team caveat:

Limitless public team sheets provide species, item, ability, nature, and moves, but not Champions Stat Point allocations. Every SP allocation used in the engine probes below is therefore a declared synthetic test allocation, not a claim about a tournament player's exact original allocation.

## 4. Champions Stat Point and speed reference

Champions formula source:
https://bulbapedia.bulbagarden.net/wiki/Stat_point

At Level 50:

- HP = Base + SP + 75
- other stat = floor((Base + SP + 20) × alignment)
- 32 SP maximum per stat
- 66 SP total

Three custom Pidgeot test allocations used during the blind phase:

### S1
Modest, 32 HP / 32 SpA / 2 SpD

- HP 190
- Def 119
- SpA 180
- SpD 110
- Spe 124

### S2
Modest, 3 HP / 32 SpA / 31 Spe

- HP 161
- Def 119
- SpA 180
- SpD 108
- Spe 155

### S3
Timid, 2 HP / 32 SpA / 32 Spe

- HP 160
- Def 119
- SpA 164
- SpD 108
- Spe 171

Public M-A speed references relevant to executed tests include neutral max-SP Garchomp 154 and Jolly max-SP Sneasler 189 before Unburden. The current M-A speed resource lists +Speed max-SP Unburden Sneasler at 378.

## 5. Verified Showdown implementation

Repository:
https://github.com/Doctor-2/mod-maker

Canonical implementation branch:
`claude/gallant-euler-6mpbzy`

Relevant commits:

- `fd5206b` initial implementation
- `32d2a5f` corrected v4.1 implementation

Bundle:
`pidgeot_blind_bundle_v4/BUNDLE_FOR_GPT.md`

Implementation behavior verified in v4.1:

- inherits official `championsregma`
- custom Mega stats/type/ability
- global Flying-component defensive rule
- ordinary weather coexistence
- global wind-move accuracy guarantee
- no generic hit-through-semi-invulnerability rule
- Work Up legal for Pidgeot
- Hyper Beam globally 100 accuracy
- Mega-turn activation timing
- Mega-turn speed reordering

Reported validation from the implementation run:

- 26 custom mechanics tests passing
- full Showdown suite: 2382 passing / 0 failing
- TypeScript clean
- ESLint clean
- a Pidgeot @ Pidgeotite team containing Work Up validates in the custom format
- stock `championsregma` remains unchanged

Independent competitive-probe branch:
`gpt/pidgeot-phase2-probes`

Final all-green M-A probe run:
- GitHub Actions run: `34759159630`
- job: `103728752327`
- v4.1 mechanics: 26 passing
- active Phase 2 competitive probes: 11 passing

## 6. Executed M-A engine observations

All observations in this section are Level 50. Fixed seeds are used where relevant. These are scenario results, not aggregate win rates.

### E01 — Pelipper Electric threshold

Test Pelipper:
- 167 HP
- 122 SpD

Test Rotom-W:
- 125 SpA

Same Thunderbolt input, only the active field anchor differs.

Wingtip Vortex branch:
- damage: 67
- Pelipper survives
- effectiveness log: one super-effective component (`|1`)

Control without Wingtip:
- damage: 167
- Pelipper faints
- effectiveness log: two super-effective components (`|2`)

A separate fixed-seed damage-ratio probe also verified that removing the Flying component changes actual HP damage rather than only the effectiveness display.

### E02 — two-turn custom Pidgeot vs Mega Dragonite paired tree

The shell is based on real M-A components used by Pranav Sharma at Indianapolis: Mega Dragonite / Archaludon / Basculegion / Sneasler / Kingambit / Pelipper. Test SPs are synthetic.

Opponent pressure in the scenario: Sneasler + Rotom-W.

After turn 1:

Custom Mega Pidgeot branch:
- Pidgeot: 166/190
- Pelipper: 88/167
- Pelipper used Hurricane
- opposing Sneasler: 7/157

Mega Dragonite branch:
- Dragonite: 188/198
- Pelipper: 0/167
- Pelipper did not execute Hurricane
- opposing Sneasler: 157/157

After turn 2:

Custom Mega Pidgeot branch:
- Pidgeot: 48/190
- Kingambit: 137/207
- Pelipper alive in reserve: 88 HP
- Kingambit entered by switch and did not use Iron Head that turn
- Sneasler: 7/157
- Tailwind active

Mega Dragonite branch:
- Dragonite: 136/198
- Kingambit: 143/207
- Pelipper fainted
- Kingambit used Iron Head
- Sneasler: 30/157
- Tailwind active

This observation records a different resource/tempo state after the same initial pressure; it does not establish which full game is favored.

### E03 — S2 vs S1 same-turn Tailwind order

Board: custom Mega Pidgeot + Pelipper vs neutral max-speed Garchomp benchmark.

With S2 (Pidgeot Speed 155):
1. Pidgeot Tailwind
2. Pelipper Hurricane
3. Garchomp Swords Dance

With S1 (Pidgeot Speed 124):
1. Garchomp Swords Dance
2. Pidgeot Tailwind
3. Pelipper Hurricane

Recorded unboosted values:
- S2 Pidgeot: 155
- S1 Pidgeot: 124
- Pelipper: 85
- Garchomp: 154

### E04 — second-Mega-candidate base-form comparison beside Mega Charizard Y

The control idea uses the NAIC champion roster structure containing Charizardite Y and Aerodactylite on the same six-Pokémon roster.

When Charizard Y is the selected Mega, compare base Aerodactyl with base Pidgeot holding Pidgeotite.

Rock Slide / Wide Guard branch:

Aerodactyl branch:
- Charizard damage: 0
- Aerodactyl damage: 0
- order begins Aerodactyl Wide Guard -> Charizard Heat Wave -> Tyranitar Rock Slide

Pidgeot branch:
- Charizard damage: 155
- Pidgeot damage: 161
- order begins Pidgeot Tailwind -> Charizard Heat Wave -> Tyranitar Rock Slide

Speed-control branch against Jolly Sneasler:

Aerodactyl branch:
- base Aerodactyl Speed: 200
- order: Aerodactyl Tailwind -> Charizard Heat Wave -> Sneasler Close Combat

Pidgeot branch:
- base Pidgeot Speed in test: 152
- order: Sneasler Close Combat -> Charizard Heat Wave -> Pidgeot Tailwind

Other recorded test values:
- Charizard Speed: 152
- Sneasler Speed: 189

### E05 — official Mega Pidgeot vs custom Mega Pidgeot: ally externality

Same Pelipper / Rotom-W threshold setup, now comparing the real official M-A Mega Pidgeot to the custom form.

Official No Guard Mega Pidgeot branch:
- Pelipper damage: 167/167
- Pelipper faints

Custom Wingtip Vortex branch:
- Pelipper damage: 67/167
- Pelipper survives

### E06 — official Mega Pidgeot vs custom Mega Pidgeot: White Herb / Unburden action order

Both Pidgeot versions use Timid max-Speed test allocations. Sneasler is Jolly max-Speed with White Herb + Unburden and uses Close Combat on turn 1, consuming White Herb after its defensive drops.

After turn 1:

Official Mega Pidgeot:
- HP: 28/160
- raw Speed reported by `getStat`: 190
- Sneasler raw Speed: 189
- Sneasler item field: empty (White Herb consumed)

Custom Mega Pidgeot:
- HP: 39/160
- raw Speed: 171
- Sneasler raw Speed: 189
- White Herb consumed

Turn 2 action result:

Official branch:
- first relevant action: Pidgeot Hurricane
- Sneasler faints before its second Close Combat
- Pidgeot remains alive

Custom branch:
- first relevant action: Sneasler Close Combat
- Pidgeot faints before using Hurricane
- Sneasler remains alive

The engine's `getStat` output records raw current Speed; Tailwind and Unburden affect action ordering via separate modifiers rather than changing that displayed raw value.

### E07 — Work Up / Maushold branch

Board includes custom Mega Pidgeot + Friend Guard Maushold versus Sneasler + Kingambit.

Chosen actions:
- Pidgeot: Work Up
- Maushold: Follow Me
- Sneasler: Fake Out into Pidgeot
- Kingambit: Protect

Recorded result:
- Pidgeot Atk boost: 0
- Pidgeot SpA boost: 0
- Pidgeot HP: 171/190
- move order includes Sneasler Fake Out before Maushold Follow Me

### E08 — Work Up / Armor Tail branches

Branch A:
- Pidgeot + Armor Tail Farigiraf
- Sneasler attempts Fake Out
- Kingambit Protects

Recorded:
- Pidgeot Atk +1
- Pidgeot SpA +1
- Pidgeot remains 190/190
- Work Up resolves

Branch B:
- same Pidgeot + Armor Tail Farigiraf concept
- Sneasler uses ordinary Close Combat into Pidgeot
- Kingambit uses Kowtow Cleave into Pidgeot

Recorded order:
1. Farigiraf Protect
2. Sneasler Close Combat into Pidgeot
3. Pidgeot Work Up
4. Kingambit Kowtow Cleave into Pidgeot

Final Pidgeot HP: 0/190.

The scenario records that Armor Tail blocks the priority Fake Out line but does not prevent ordinary double-target damage.

### E09 — Torkoal / Choice Scarf Vivillon sun-switch scenario

Real-team components are based on Patrick Cheng's Indianapolis roster containing Choice Scarf Compound Eyes Vivillon, Drought Torkoal, Basculegion, Farigiraf, and Mega options.

Test line:
- Sun established by Torkoal
- Torkoal switches to Choice Scarf Vivillon
- Pidgeot attempts Tailwind
- opposing Jolly Garchomp uses Rock Slide
- same custom Pidgeot stats in both branches; only Wingtip Vortex vs No Guard control changes the field rule

Wingtip branch:
- Sun remains active
- Pidgeot: 128/161
- Vivillon: 43/157, survives
- Torkoal left the field
- Tailwind not established in this fixed-seed result because Rock Slide flinched Pidgeot

Control branch:
- Sun active
- Pidgeot: 93/161
- Vivillon: 0/157, faints
- Torkoal left the field
- Tailwind active in this fixed-seed result

Only the Vivillon survival difference is a controlled Wingtip comparison here. The Tailwind difference is a recorded Rock Slide flinch outcome and is not treated as a controlled effect of Wingtip.

### E10 — U-turn field-duration timing

A Level-50 engine probe compared:

A. Wingtip Pidgeot U-turns out before a later Electric attack targets an allied Flying Pokémon.
B. Wingtip Pidgeot stays active while the same later Electric attack occurs.

Recorded effectiveness:

- after early U-turn and completed replacement, the later attack regains its Flying-type super-effective component against the ally;
- while Pidgeot remains active, that Flying component remains suppressed.

This is a timing observation about the field rule. It is not a claim about how often U-turn should be selected in actual play.

### E11 — symmetric opponent-side benefit

An executed paired probe placed opposing Mega Charizard Y on the field while Wingtip Vortex was active and compared Rock-type effectiveness with a non-Wingtip control.

Recorded effectiveness log:
- with Wingtip Vortex: opposing Charizard Y receives one Rock super-effective component (x2 total from Fire/Flying interaction after the Flying component is neutralized)
- control: opposing Charizard Y receives two components (x4)

The canonical wind-accuracy rule is likewise global by design, so opponent wind moves receive the same accuracy guarantee while the holder remains active.

## 7. Public tournament components directly used or referenced

Indianapolis 2026, 35th Pranav Sharma:
- Mega Dragonite / Archaludon / Basculegion / Sneasler / Kingambit / Pelipper
- Mega Dragonite: Modest; Dragon Pulse / Hurricane / Tailwind / Protect
- Pelipper: Bold Sitrus; Weather Ball / Hurricane / Wide Guard / Tailwind
- Sneasler: Jolly Focus Sash; Dire Claw / Close Combat / Fake Out / Protect
- Kingambit: Adamant Black Glasses; Kowtow Cleave / Sucker Punch / Iron Head / Protect

Indianapolis 2026, 76th Patrick Cheng:
- includes Choice Scarf Compound Eyes Vivillon, Drought Torkoal, Basculegion, Farigiraf and two Mega candidates
- Vivillon: Timid Choice Scarf; Sleep Powder / Hurricane / Rage Powder / Rain Dance
- Torkoal: Quiet Charcoal; Protect / Eruption / Heat Wave / Weather Ball
- Farigiraf: Quiet Sitrus Berry, Armor Tail; Psychic / Thunderbolt / Helping Hand / Trick Room

NAIC 2026 champion Francesco Pio Pero:
- six-Pokémon roster includes both Charizard @ Charizardite Y and Aerodactyl @ Aerodactylite
- this is direct public evidence that a successful M-A roster can carry multiple Mega Stone holders even though only one Mega Evolution can be used in a battle

White Herb / Unburden Sneasler also appears in successful M-A public team sheets; the final reviewer should consult the direct Limitless pages rather than infer its frequency from this file alone.

## 8. Global Hyper Beam rule as a separate variable

The custom package sets Hyper Beam accuracy to 100 globally.

Public M-A team sheets include Fairy Feather + Pixilate Sylveon using Hyper Beam at high placements, so this rule affects an already-used environment option rather than only Pidgeot.

No additional competitive engine A/B was run for 90 vs 100 accuracy because the direct mechanical change is reliability rather than damage or move role. The final analysis should keep environment-level Hyper Beam attribution separate from Wingtip Vortex attribution.

## 9. Limited Gen 7 OU cross-format evidence

See:
`research/pidgeot/01_SINGLES_RAW_CROSSCHECK.md`

Key source facts retained there:

- singles has no simultaneously active ally, so Wingtip cannot simultaneously protect an allied Flying Pokémon or guarantee an allied wind move;
- custom max-Timid Level-100 Speed = 337;
- official Mega Pidgeot max-Timid Level-100 Speed = 375;
- public SM OU speed references include Garchomp 333, Mega Pinsir 339, Kartana 348, Gengar/Latios 350, Tornadus-T 375, Greninja 377;
- Delta Stream / strong winds do not reduce Stealth Rock damage;
- Normal/Flying therefore still takes 25% Stealth Rock damage;
- only limited declared calculations were performed; no custom Gen 7 engine battle or optimized team was run.

No 66 tier conclusion is part of the frozen evidence.

## 10. M-B stress-test status

Public M-B format source:
https://www.smogon.com/dex/champions/formats/vgc26-regulation-m-b/

Public Mega Blaziken M-B strategy:
https://www.smogon.com/dex/champions/pokemon/blaziken/vgc-2026-regulation-m-b/

M-B contains a different roster and includes Mega Blaziken with Speed Boost. The public strategy explicitly describes accumulated Speed Boost as allowing it to outrun Mega Aerodactyl and slower Tailwind-boosted Pokémon after sufficient turns.

No custom-Pidgeot M-B engine test was added in this blind phase. The reason for stopping is methodological: the already-executed M-A White Herb/Unburden Sneasler scenario directly tests the structural question of opponent boosted-speed modes exceeding custom Pidgeot's Tailwind speed ceiling. M-B remains a future robustness benchmark if a later question depends on mechanisms not represented in M-A.

This stop decision is not evidence that the custom Pidgeot would have the same strength in M-B.

## 11. Frozen evidence limits

The blind Phase 2 evidence deliberately does not provide:

- an aggregate ladder win rate;
- a tournament result for the custom Pokémon;
- a claim that any synthetic SP allocation is optimal;
- a claim that one tested turn tree represents all rational play;
- a final M-A tier placement;
- designer intent;
- a full M-B balance result;
- a full Gen 7 OU balance result;
- resolved rules for the deferred ability-manipulation edge cases.

The M-A engine test set is frozen at this point to avoid continuing to add scenarios after observing results.
