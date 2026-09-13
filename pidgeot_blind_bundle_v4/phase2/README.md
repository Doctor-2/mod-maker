# Mega Pidgeot blind benchmark — Phase 2

This directory begins only after v4.1 mechanics acceptance passes.

The goal is **not** to collect a ladder win rate. It is to obtain paired, discriminating engine evidence for the frozen blind hypotheses.

## Provenance rule

Tournament species / item / ability / nature / moves are copied from public M-A tournament sheets. Public sheets do not expose Champions Stat Points, so all SP allocations used in probes are explicitly labelled **test spreads**, never tournament-original spreads.

## Pair A — secondary-Mega option value

Control roster: Francesco Pio Pero, NAIC 2026 1st / Turin Special Event 11th.

- Charizard @ Charizardite Y — Blaze — Modest — Heat Wave / Solar Beam / Weather Ball / Protect
- Sylveon @ Fairy Feather — Pixilate — Modest — Detect / Hyper Voice / Yawn / Quick Attack
- Kingambit @ Chople Berry — Defiant — Adamant — Sucker Punch / Kowtow Cleave / Low Kick / Iron Head
- Basculegion @ Focus Sash — Adaptability — Adamant — Protect / Last Respects / Aqua Jet / Liquidation
- Garchomp @ Sitrus Berry — Rough Skin — Jolly — Rock Tomb / Earthquake / Dragon Claw / Protect
- Aerodactyl @ Aerodactylite — Unnerve — Jolly — Tailwind / Dual Wingbeat / Rock Slide / Wide Guard

Experimental roster: replace Aerodactyl with custom Mega Pidgeot, keep the first five fixed.

Primary question: does Pidgeot create a matchup-specific Mega branch worth losing Aerodactyl's immediate tempo / Wide Guard / Rock pressure, rather than needing to be the default Mega every game?

## Pair B — closest special Tailwind-Mega role

Control roster: Pranav Sharma, Indianapolis 2026 35th.

- Dragonite @ Dragoninite — Inner Focus — Modest — Dragon Pulse / Hurricane / Tailwind / Protect
- Archaludon @ Chople Berry — Stamina — Modest — Dragon Pulse / Electro Shot / Aura Sphere / Protect
- Basculegion @ Choice Scarf — Adaptability — Adamant — Wave Crash / Last Respects / Flip Turn / Aqua Jet
- Sneasler @ Focus Sash — Poison Touch — Jolly — Dire Claw / Close Combat / Fake Out / Protect
- Kingambit @ Black Glasses — Defiant — Adamant — Kowtow Cleave / Sucker Punch / Iron Head / Protect
- Pelipper @ Sitrus Berry — public tournament sheet; remaining fields should be copied from source before scripted battle use

Experimental roster: replace Mega Dragonite with custom Mega Pidgeot, keep the other five fixed.

Primary question: what actual turn / matchup / team interaction does Pidgeot create that Mega Dragonite does not?

## Pair C — redesign isolation

Use the same five partners and the same opponent, comparing:

1. stock official Mega Pidgeot (No Guard, 83/80/80/135/80/121)
2. custom Mega Pidgeot (Wingtip Vortex, 83/93/99/112/88/104)

Do not force identical moves if a move is only legal on one design. The purpose is to identify whether the redesign changes decision patterns, not to create an artificial mirror.

## Frozen observations to record

Only count a game/branch as informative if at least one of these is observable:

- Wingtip Vortex changes a survival threshold that affects the chosen move/target;
- wind accuracy changes a chosen move/target;
- the opponent benefits from Wingtip Vortex;
- Pidgeot gains or fails to gain a Tailwind / Work Up turn for a concrete reason;
- U-turn is clicked or rejected because leaving would end Wingtip Vortex;
- Pidgeot is selected as the Mega in one matchup but not another;
- a control Mega reproduces the same value at lower roster/turn cost.

## Stop rule

Blind Phase 2 ends when mechanics pass, at least two Pidgeot set families have engine play, Pair A and Pair B each yield at least two informative observations, Pair C establishes whether the redesign changes play pattern, and at least one preregistered expectation is genuinely updated.
