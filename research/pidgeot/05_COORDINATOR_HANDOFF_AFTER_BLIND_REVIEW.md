# Custom Mega Pidgeot — coordinator handoff at independent-blind-review boundary

Current state: 2026-09-26. This file is for the next coordinating chat. It is **not** an input for the independent blind reviewer.

## 1. Current workflow state

The first-pass M-A blind evidence collection is complete and frozen.

Designer intent has **not** been revealed.

The coordinating analyst's own historical blind reasoning is separately frozen in:

- `research/pidgeot/03_INTERNAL_BLIND_ANALYSIS_FREEZE.md`

An independent high-reasoning blind review has **not yet been supplied back to the coordinator in this workflow**. The immediate next stage is to run that independent review from the neutral input packet, or, if the user has already run it elsewhere, to preserve the returned report verbatim and audit it before reading the internal analyst freeze.

Do not add open-ended M-A scenarios now unless an integrity error is found in the frozen implementation/evidence.

## 2. Repository / branches

Repository:
- `Doctor-2/mod-maker`

Canonical implementation branch:
- `claude/gallant-euler-6mpbzy`
- v4.1 correction commit: `32d2a5f` (preceded by `fd5206b`)

Frozen competitive-probe / research branch:
- `gpt/pidgeot-phase2-probes`

Final frozen M-A engine run:
- GitHub Actions run `34759159630`
- job `103728752327`
- v4.1 mechanics: 26 passing
- active Phase 2 competitive probes: 11 passing

## 3. Canonical custom design

Mega Pidgeot:
- Type: Normal / Flying
- Base stats: 83 / 93 / 99 / 112 / 88 / 104
- BST: 579

Ability working name:
- Wingtip Vortex / 翼尖涡流

While a Wingtip Vortex holder is active:
1. Delta Stream / Strong Winds defensive principle applies globally: the Flying-type component of Rock/Electric/Ice super-effectiveness is neutralized.
2. This applies to both teams.
3. All Pokémon Showdown `wind`-flagged moves always pass normal accuracy/evasion checks, globally for both teams.
4. Rain / Sun / Sand / Snow coexist with turbulence; neither replaces the other.

Other package changes:
- Hyper Beam accuracy is globally 100 instead of 90, independent of whether Pidgeot is active.
- Pidgeot gains Work Up in Champions.
- Otherwise use the Champions Pidgeot movepool.
- Standard Mega Stone / one-Mega-per-battle constraints remain.

Current unresolved edge assumptions:
- the wind accuracy guarantee does not copy No Guard's separate hit-through-semi-invulnerability behavior;
- Neutralizing Gas / Gastro Acid / Trace / Skill Swap / Role Play / Receiver interactions remain designer-unresolved; current code treats Wingtip as an ordinary ability for those edges.

## 4. Frozen source files

For a new coordinating chat, read in this order:

1. `research/PROJECT_METHOD_AND_CONTEXT.md`
2. `research/pidgeot/NEXT_CHAT_HANDOFF.md`
3. `research/pidgeot/BLIND_PHASE_FREEZE.md`
4. `research/pidgeot/02_FINAL_RAW_EVIDENCE_V1.md`
5. `research/pidgeot/01_SINGLES_RAW_CROSSCHECK.md`
6. `research/pidgeot/FINAL_REVIEW_INPUT_MANIFEST.md`
7. `research/pidgeot/FINAL_INDEPENDENT_REVIEW_PROTOCOL.md`
8. `research/pidgeot/04_INDEPENDENT_REVIEW_RETURN_PROTOCOL.md`

At this boundary, **do not read**:
- `research/pidgeot/03_INTERNAL_BLIND_ANALYSIS_FREEZE.md`

until the independent blind report has been produced, preserved verbatim, and factually audited against the neutral/raw source set.

This sequencing is deliberate: the coordinator's historical blind judgment must not contaminate the independent review or its first factual audit.

## 5. Neutral M-A engine evidence map

The exact definitions, synthetic SP allocations, seeds, source provenance and limitations are in `02_FINAL_RAW_EVIDENCE_V1.md`. This list is navigation only and does not state a tier judgment.

- E01: declared Pelipper / Rotom-W Thunderbolt threshold changes from KO without Wingtip to survival with Wingtip; actual HP damage semantics were separately checked.
- E02: same initial Sneasler + Rotom-W pressure produces different two-turn board/resource states for custom Pidgeot vs Mega Dragonite; the scenario does not establish which full game is favored.
- E03: Speed-155 Modest custom Pidgeot can Tailwind before neutral max-SP Garchomp 154, allowing slower Pelipper to receive Tailwind and act before Garchomp in the same turn; Speed-124 bulky Pidgeot cannot.
- E04: beside Mega Charizard Y, base Aerodactyl retains Wide Guard and high-speed Tailwind utility when Aerodactyl is not the selected Mega; base Pidgeot does not reproduce those exact functions in the paired scenario.
- E05: official No Guard Mega Pidgeot does not protect allied Pelipper at the E01 threshold; custom Wingtip Pidgeot does.
- E06: official max-Timid Mega Pidgeot acts before a declared Jolly White Herb/Unburden Sneasler under Tailwind and KOs it; custom max-Timid Pidgeot acts after Sneasler and faints first in the same declared branch.
- E07: Maushold Follow Me does not prevent faster-priority Fake Out from denying Pidgeot's Work Up in the tested branch.
- E08: Armor Tail can remove the Fake Out line and allow Work Up, but does not prevent ordinary double-target Close Combat + Kowtow pressure.
- E09: in the declared Torkoal -> Choice Scarf Vivillon Sun-switch scenario, Wingtip changes Vivillon's Rock Slide survival result. A Tailwind difference in the same fixed seed was caused by Rock Slide flinch and is explicitly not attributed to Wingtip.
- E10: early U-turn removes Wingtip before a later attack and restores an allied Flying-derived weakness component; staying active keeps it suppressed.
- E11: the defensive rule is symmetric; opposing Mega Charizard Y also receives the Flying-component Rock-weakness reduction while Wingtip is active.

There is no aggregate custom-Pidgeot ladder win rate, tournament result, optimized-SP proof, full M-B balance test, or full Gen 7 OU balance test.

## 6. Provenance / interpretation constraints

- Limitless public teams expose species/item/ability/nature/moves but not Champions SPs. Synthetic SPs used in probes are test allocations, not player allocations.
- Deterministic engine scenarios are not win-rate or tournament-performance evidence.
- A survival threshold is not automatically net tempo or a favorable full-game state.
- Hyper Beam 90 -> 100 is a global package rule and must be attributed separately from Wingtip's on-field effect.
- M-A conclusions must not be silently generalized to M-B or Gen 7 OU.
- Harness/parser/CI failures during development are engineering history, not competitive evidence.
- Earlier analysis that omitted the Delta Stream/Strong Winds defensive effect was superseded before final evidence collection and must not be reused.

## 7. Independent blind review — next action

Preferred first-pass input is exactly the neutral packet specified by:

- `research/pidgeot/BLIND_INDEPENDENT_REVIEW_PROMPT.md`
- `research/pidgeot/FINAL_REVIEW_INPUT_MANIFEST.md`
- `research/pidgeot/FINAL_INDEPENDENT_REVIEW_PROTOCOL.md`

Do not append:
- designer intent;
- the prior analyst's internal freeze;
- prior tier judgments;
- supported/refuted hypothesis labels;
- suggested conclusions.

The user can use Claude Opus 5 Extra/Max for this independent blind review to conserve scarce GPT Work quota. Model choice is secondary to source isolation and zero-leading input.

## 8. When the independent report returns

Follow `research/pidgeot/04_INDEPENDENT_REVIEW_RETURN_PROTOCOL.md`:

1. store the report verbatim in `research/pidgeot/independent_reviews/`;
2. record model/config if supplied;
3. factually audit it against neutral/raw evidence only;
4. store corrections/overclaims in a separate audit note;
5. freeze report + audit;
6. only then read `03_INTERNAL_BLIND_ANALYSIS_FREEZE.md` and compare the two blind records;
7. only after both blind records are preserved should designer intent be collected.

## 9. Designer-intent boundary

When the workflow reaches this boundary, collect the designer's explanation in their own words **before** showing a synthesized blind conclusion.

Ask for:
- intended role(s);
- target power/strength range;
- reasoning behind stats/type/ability;
- reasoning behind Work Up and Hyper Beam changes;
- expected team structures/synergies;
- expected weaknesses/counterplay;
- deliberate interactions the blind work may or may not have found.

Store it as a direct `DESIGNER INTENT` source.

## 10. Final synthesis model allocation

After designer intent and any minimal post-intent verification are frozen:

- build a raw-first final evidence pack;
- use a highest-reasoning model for final synthesis if desired.

The user can access:
- GPT Work high/max-style reasoning, but quota is scarce;
- Claude Opus 5 Extra/Max, with more concern about prose quality.

Recommended allocation:
- independent blind evidence review can use Claude Opus 5 Extra/Max;
- reserve GPT Work Max/Extra-High-like budget for the final integrated synthesis if available;
- optionally use a separate adversarial review pass after the final draft.

No model may be given a requested tier, desired outcome, or persuasive summary. Inputs must include suitable original/raw information and remain zero-leading.

## 11. Communication/process constraints

- Continue automatically when no genuine user input is needed.
- Do not ask the user to repeat mechanics/results already in the repository.
- Do not make the user shuttle existing repo material between tools/AIs.
- Prefer a small number of high-information tests across different team structures and plausible actions.
- Keep `CANONICAL RULE`, `PUBLIC META`, `ENGINE`, `CALC`, `INFERENCE`, `UNRESOLVED`, and later `DESIGNER INTENT` distinct.
- For external reviewer/final-model inputs, include suitable raw/original material and use zero subjective/zero leading framing.
- Do not repeat settled damage tables or Sun/Rain discussion unless new evidence changes them.
- When reporting to the user, emphasize what actually changed the judgment or workflow state.
