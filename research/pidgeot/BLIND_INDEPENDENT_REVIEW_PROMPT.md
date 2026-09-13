# Independent blind-review prompt

You are conducting an independent competitive-design review of one custom Pokémon. Treat this as a fresh analysis. Do not infer or search for the designer's intent, and do not assume any prior analyst's conclusion is correct.

## Repository / branch

Repository: `Doctor-2/mod-maker`
Branch: `gpt/pidgeot-phase2-probes`

## Read these first

1. `research/pidgeot/FINAL_INDEPENDENT_REVIEW_PROTOCOL.md`
2. `research/pidgeot/FINAL_REVIEW_INPUT_MANIFEST.md`
3. `research/pidgeot/02_FINAL_RAW_EVIDENCE_V1.md`
4. `research/pidgeot/01_SINGLES_RAW_CROSSCHECK.md`

Then inspect the canonical implementation and executed probe source/logs only as needed to audit claims in the raw-evidence file:

- `pidgeot_blind_bundle_v4/BUNDLE_FOR_GPT.md`
- `pidgeot_blind_bundle_v4/showdown_overlay/`
- GitHub Actions run `34759159630`, job `103728752327`

Open the direct public Smogon / Limitless / Bulbapedia sources linked by the raw-evidence files when they materially support a conclusion. Prefer direct source evidence over prior summaries.

## Critical independence constraints

For this first pass, do **not** read or request:

- the designer's intended role, inspiration, target power level, or reasoning;
- previous assistant tier judgments or recommendations;
- any historical supported/refuted-hypothesis summary;
- simulated community/player reactions.

Do not try to guess what the designer wanted. Analyze the finished mechanics and evidence as if the design were anonymous.

Do not let test names such as “tax”, “benefit”, “control”, or prior comments embedded in code determine your conclusion. Treat the actual inputs/outputs as evidence and independently interpret them.

## Main task

Produce a rigorous blind competitive report on the custom Mega Pidgeot, with Pokémon Champions VGC 2026 Regulation M-A as the primary benchmark.

The purpose is not to praise or criticize the design. Determine as accurately as possible:

- what roles it would actually occupy;
- how strong it appears relative to the demonstrated M-A environment and relevant incumbents;
- which set / Stat Point families have distinct competitive purposes;
- what kinds of teams would plausibly want it;
- what opportunity costs its Mega slot and base form impose;
- what existing counterplay works;
- which parts of Wingtip Vortex materially affect games, including opponent-side benefits;
- whether Work Up is a stable game plan, situational option, or not supported by current evidence;
- how important Tailwind, Protect, Hurricane, Heat Wave, Hyper Beam, U-turn, Roost and other plausible moves are given four-moveslot constraints;
- whether the global Hyper Beam accuracy rule should be evaluated separately from the Pokémon's own ability;
- which findings are robust versus dependent on a synthetic spread or scripted scenario;
- whether the limited Gen 7 OU evidence suggests a genuinely different singles profile, without pretending that an untested singles tier placement is established;
- whether the absence of a full M-B engine test materially limits the M-A judgment.

## Evidence discipline

For each major factual or evaluative conclusion, attach one or more labels:

- `CANONICAL RULE`
- `PUBLIC META`
- `ENGINE`
- `CALC`
- `INFERENCE`
- `UNRESOLVED`

Keep these distinctions strict.

Examples of prohibited overreach:

- A deterministic engine scenario is not a win-rate estimate.
- A test SP allocation is not a tournament player's real allocation.
- A survival threshold does not automatically imply net tempo or a favorable game state.
- A mechanism existing in code does not prove that it matters enough to earn a moveslot or team slot.
- A test harness failure is not competitive evidence.
- An opponent-side symmetric effect must not be counted only as a benefit to the custom Pokémon.

## Required adversarial pass

Before finalizing, actively attempt to overturn your own leading interpretation. At minimum test these questions against the evidence:

1. What plausible reading of the same evidence makes the Pokémon substantially weaker?
2. What plausible reading makes it substantially stronger?
3. Which apparent gains are resource/tempo transfers rather than net gains?
4. Which matchup claims depend heavily on one synthetic SP spread or one scripted move choice?
5. Could an established M-A incumbent reproduce the same useful role at lower Mega/roster cost?
6. Does the analysis overvalue successful setup turns relative to games where setup is not selected?
7. Does it undercount the value of team-preview option value, or overcount it given base Pidgeot's non-Mega floor?
8. Which symmetric Wingtip effects can rational opponents exploit?
9. Is the evidence sufficient to distinguish “viable”, “strong”, and “top-tier”, or should the strength conclusion remain a range?

If evidence cannot answer a question, mark it unresolved rather than filling the gap with intuition.

## Output

Write a self-contained report that a competitive Pokémon player can read without having seen the conversation that produced the evidence.

Use clear headings and compact tables where they improve comparison. Technical detail is welcome, but do not bury the central judgment in exhaustive move-by-move narration.

Include:

1. Executive assessment with an uncertainty range.
2. Mechanical identity and role map.
3. Set / Stat Point families, explaining what each allocation buys rather than merely listing numbers.
4. Supported team structures vs plausible-but-untested structures vs unsupported speculation.
5. Opportunity-cost comparison with official Mega Pidgeot, Mega Dragonite, Mega Aerodactyl, and other relevant incumbents when the evidence supports comparison.
6. Counterplay and opponent-side exploitation.
7. Assessment of Work Up and four-moveslot pressure.
8. M-A strength assessment and confidence level.
9. Limited Gen 7 OU cross-format interpretation, clearly separated from M-A.
10. Evidence gaps and sensitivity analysis: identify the one or two rule/stat changes that would most alter the strength judgment.
11. The most non-obvious competitive phenomena revealed by the evidence.
12. A short appendix listing the strongest evidence for and against the report's own final assessment.

Do not include designer-intent comparison in this pass.

At the end, explicitly freeze the blind conclusion so it can later be compared with the designer's explanation without retroactively rewriting this report.
