# Custom Mega Pidgeot — coordinator handoff after independent blind review return

Date/state: 2026-09-14. This file is for the next coordinating chat. It is not an independent-review input.

## 1. Current workflow state

The first-pass M-A blind evidence collection is frozen.

An independent Claude blind review has now been produced outside this coordinating chat. The coordinating chat that created this handoff has **not read, summarized, evaluated, or reframed that returned report**. This is intentional so the next chat can preserve and audit the report from the raw source without inheriting a second-hand interpretation.

Designer intent has not been revealed to the coordinating analysis and must remain withheld until the returned independent report is preserved and factually audited.

No new open-ended M-A competitive scenarios should be added before that audit is complete unless an integrity error is found in the frozen implementation/evidence.

## 2. Repository / branches

Repository:
- `Doctor-2/mod-maker`

Canonical implementation branch:
- `claude/gallant-euler-6mpbzy`
- v4.1 commit sequence includes `fd5206b` and corrected `32d2a5f`

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

Current unresolved edge assumption:
- wind accuracy guarantee does not copy No Guard's separate hit-through-semi-invulnerability behavior.
- Neutralizing Gas / Gastro Acid / Trace / Skill Swap / Role Play / Receiver interactions remain designer-unresolved; current code treats Wingtip as an ordinary ability for those edges.

## 4. Primary source files

Read these before doing any new analysis:

1. `research/PROJECT_METHOD_AND_CONTEXT.md`
2. `research/pidgeot/BLIND_PHASE_FREEZE.md`
3. `research/pidgeot/02_FINAL_RAW_EVIDENCE_V1.md`
4. `research/pidgeot/01_SINGLES_RAW_CROSSCHECK.md`
5. `research/pidgeot/FINAL_REVIEW_INPUT_MANIFEST.md`
6. `research/pidgeot/FINAL_INDEPENDENT_REVIEW_PROTOCOL.md`
7. `research/pidgeot/04_INDEPENDENT_REVIEW_RETURN_PROTOCOL.md`

Do **not** read `research/pidgeot/03_INTERNAL_BLIND_ANALYSIS_FREEZE.md` until the returned independent report has first been preserved and factually audited against the neutral/raw source set. After that audit, read it for historical comparison.

The returned Claude report itself should be stored verbatim in a separate `research/pidgeot/independent_reviews/` file before any editing or comparison.

## 5. Neutral M-A engine evidence map

The exact definitions, synthetic SPs, seeds, source provenance and limitations are in `02_FINAL_RAW_EVIDENCE_V1.md`. This shorthand is navigation only.

- E01: declared Pelipper / Rotom-W Thunderbolt threshold changes from KO without Wingtip to survival with Wingtip; actual HP damage ratio was separately checked.
- E02: same initial Sneasler + Rotom-W pressure produces different two-turn board/resource states for custom Pidgeot vs Mega Dragonite; the scenario does not determine which full game is favored.
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

## 6. Important provenance / interpretation constraints

- Limitless public teams expose species/item/ability/nature/moves but not Champions SPs. Synthetic SPs used in probes are test allocations, not player allocations.
- Deterministic engine scenarios are not win-rate or tournament-performance evidence.
- A survival threshold is not automatically net tempo or a favorable full-game state.
- Hyper Beam 90 -> 100 is a global package rule and must be attributed separately from Wingtip's on-field effect.
- M-A conclusions must not be silently generalized to M-B or Gen 7 OU.
- Harness/parser/CI failures during development are engineering history, not competitive evidence.
- Earlier analysis that omitted the Delta Stream/Strong Winds defensive effect was superseded before final evidence collection and must not be reused.

## 7. Historical prior analyst record

The first coordinating analyst's blind reasoning, preregistered predictions, corrections, hypothesis updates and final pre-independent-review strength judgment are preserved verbatim in:

- `research/pidgeot/03_INTERNAL_BLIND_ANALYSIS_FREEZE.md`

This file is deliberately evaluative and is not a neutral evidence source.

Do not summarize or reveal its conclusions to the independent reviewer before the returned report is frozen. In this workflow, the independent report already exists; nevertheless, audit that report against neutral/raw evidence first, then read the internal file for comparison. This prevents the audit itself from becoming a competitive-judgment alignment exercise.

## 8. Returned independent report: next actions

When the user supplies the Claude report in the new chat:

1. save it verbatim before analysis;
2. confirm it was generated before designer intent was revealed;
3. audit only factual/source/engine/provenance claims against neutral/raw evidence;
4. preserve any corrections in a separate audit note rather than rewriting the report;
5. freeze the independent report plus audit note;
6. only then read `03_INTERNAL_BLIND_ANALYSIS_FREEZE.md` and compare the two blind records;
7. only after both blind records are preserved should the user be asked for designer intent in their own words.

Detailed procedure:
- `research/pidgeot/04_INDEPENDENT_REVIEW_RETURN_PROTOCOL.md`

## 9. Designer-intent reveal boundary

Do not reveal the prior analysts' combined conclusion to the user immediately before asking for intent.

Ask the user to state, in their own words, the original:
- intended role(s);
- target power/strength range;
- reasoning behind stats/type/ability;
- reasoning behind Work Up and Hyper Beam changes;
- expected team structures/synergies;
- expected weaknesses/counterplay;
- any deliberate interaction the blind work may or may not have found.

Store this as a direct `DESIGNER INTENT` source before synthesizing it with blind conclusions.

## 10. Post-intent and final workflow

After intent is preserved:

1. compare neutral evidence, prior analyst blind freeze, independent blind report, and designer intent as four distinct records;
2. add only minimal targeted tests for a concrete unresolved discrepancy/intent claim that could materially change role, set, team structure, counterplay, opportunity cost or strength assessment;
3. do not reopen unlimited M-A scenario mining;
4. prepare a final evidence pack with raw/direct material first;
5. use a highest-reasoning model for final synthesis if desired.

The user can access GPT Work high/max-style reasoning and Claude Opus 5 Extra/Max. Model choice should not change source isolation. The scarce highest-reasoning pass is most useful once the evidence, independent report, designer intent and any necessary post-intent tests have all been frozen.

## 11. Communication/process constraints

- Continue automatically when no genuine user decision/input is needed.
- Do not ask the user to repeat mechanics/results that are already in the repository.
- Do not make the user shuttle existing repo material between tools/AIs.
- Prefer a small number of high-information tests across different team structures and plausible actions.
- Keep `CANONICAL RULE`, `PUBLIC META`, `ENGINE`, `CALC`, `INFERENCE`, `UNRESOLVED`, and later `DESIGNER INTENT` distinct.
- For external reviewer/final-model inputs, include suitable raw/original material and use zero subjective/zero leading framing.
- Do not repeat settled damage tables or Sun/Rain discussion unless new evidence changes them.
- When reporting to the user, emphasize what actually changed the judgment or workflow state.
