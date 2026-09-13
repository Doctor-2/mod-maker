# GPT Work / high-reasoning independent blind-review prompt

You are conducting an independent competitive-design review of one custom Pokémon. Treat this as a fresh analysis. Do not infer or search for designer intent, and do not assume any prior analyst's conclusion is correct.

## Repository / branch

Public repository:
`https://github.com/Doctor-2/mod-maker`

Use branch:
`gpt/pidgeot-phase2-probes`

## First-pass inputs

Read in this order:

1. `research/pidgeot/FINAL_INDEPENDENT_REVIEW_PROTOCOL.md`
2. `research/pidgeot/FINAL_REVIEW_INPUT_MANIFEST.md`
3. `research/pidgeot/02_FINAL_RAW_EVIDENCE_V1.md`
4. `research/pidgeot/01_SINGLES_RAW_CROSSCHECK.md`

Then audit implementation / executed source only as needed:

- `pidgeot_blind_bundle_v4/BUNDLE_FOR_GPT.md`
- `pidgeot_blind_bundle_v4/showdown_overlay/`
- frozen GitHub Actions run `34759159630`, job `103728752327`

Open the direct public Smogon / Limitless / Bulbapedia / Showdown sources linked by the raw-evidence files whenever they materially support a conclusion. Prefer direct source evidence over AI summaries.

The older `research/pidgeot/00_RAW_EVIDENCE_INDEX.md` is a research-stage draft; do not substitute it for the final raw-evidence file.

## Independence firewall

Do **not** read or request during this first pass:

- `research/pidgeot/03_INTERNAL_BLIND_ANALYSIS_FREEZE.md`;
- `research/pidgeot/NEXT_CHAT_HANDOFF.md`;
- designer intent / intended role / inspiration / target power level;
- prior assistant tier judgments, balance recommendations, or supported/refuted-hypothesis summaries;
- simulated community/player reactions.

Do not guess what the designer wanted.
Do not accept framing from test names, comments or file names. Interpret actual inputs and outputs independently.

## Task

Produce a rigorous blind competitive report on the custom Mega Pidgeot, using Pokémon Champions VGC 2026 Regulation M-A as the primary benchmark.

Independently determine, to the extent evidence permits:

- likely actual roles;
- strength range relative to the demonstrated M-A environment;
- meaningful Stat Point / set families;
- plausible team structures;
- Mega-slot / roster / base-form opportunity costs;
- existing counterplay;
- holder, ally and opponent effects of Wingtip Vortex;
- Work Up's practical status;
- four-moveslot implications for Tailwind, Protect, Hurricane, Heat Wave, Hyper Beam, U-turn, Roost and alternatives;
- whether global Hyper Beam 100 accuracy is a separate environment variable;
- what is robust versus synthetic-spread/script dependent;
- what the limited Gen 7 OU evidence suggests without inventing a singles tier result;
- whether lack of full M-B engine testing materially limits the M-A assessment.

## Evidence labels

For each major conclusion use one or more labels:

- `CANONICAL RULE`
- `PUBLIC META`
- `ENGINE`
- `CALC`
- `INFERENCE`
- `UNRESOLVED`

Maintain strict separation.

Do not turn deterministic scenarios into win-rate claims.
Do not treat synthetic SPs as real tournament SPs.
Do not treat a survival threshold as automatic net tempo.
Do not treat harness failures as Pokémon evidence.
Do not count a symmetric field effect only as owner-side upside.

## Required adversarial review

Before freezing the report, attempt to falsify your own main interpretation:

1. What plausible reading makes the Pokémon substantially weaker?
2. What plausible reading makes it substantially stronger?
3. Which observed gains are resource/tempo transfers rather than net gains?
4. Which claims are sensitive to one synthetic spread or scripted action?
5. Could an established M-A incumbent perform the useful role at lower cost?
6. Does the analysis overvalue successful setup turns?
7. Does it over- or under-value team-preview option value given base Pidgeot's non-Mega floor?
8. Which symmetric Wingtip effects can an opponent exploit?
9. Is there enough evidence to distinguish viable / strong / top-tier, or should the conclusion remain a range?

If evidence is insufficient, mark the question unresolved.

## Output

Write a self-contained report with:

1. Executive assessment + uncertainty range.
2. Mechanical identity / role map.
3. Set and SP families, explaining what each buys.
4. Supported vs plausible-but-untested vs unsupported team structures.
5. Opportunity-cost comparison with official Mega Pidgeot, Mega Dragonite, Mega Aerodactyl and other relevant incumbents where supported.
6. Counterplay and opponent-side exploitation.
7. Work Up / four-moveslot assessment.
8. M-A strength assessment + confidence.
9. Limited Gen 7 OU cross-format interpretation, separated from M-A.
10. Sensitivity analysis and evidence gaps.
11. Most non-obvious competitive phenomena supported by evidence.
12. Short appendix with strongest evidence for and against your own assessment.

Do not compare against designer intent in this pass.

At the end, explicitly state that the blind conclusion is frozen and should not be retroactively rewritten after designer intent is revealed.
