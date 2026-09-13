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
- frozen GitHub Actions run `34759159630`, job `103728752327`

Open the direct public Smogon / Limitless / Bulbapedia / Showdown sources linked by the raw-evidence files when they materially support a conclusion. Prefer direct source evidence over prior summaries.

The older `00_RAW_EVIDENCE_INDEX.md` is a research-stage draft; do not use it in place of `02_FINAL_RAW_EVIDENCE_V1.md`.

## Critical independence constraints

For this first pass, do **not** read or request:

- `research/pidgeot/03_INTERNAL_BLIND_ANALYSIS_FREEZE.md`;
- `research/pidgeot/NEXT_CHAT_HANDOFF.md`;
- the designer's intended role, inspiration, target power level, or reasoning;
- previous assistant tier judgments or recommendations;
- any historical supported/refuted-hypothesis summary;
- simulated community/player reactions.

Do not try to guess what the designer wanted. Analyze the finished mechanics and evidence as if the design were anonymous.

Do not let test names such as “tax”, “benefit”, “control”, comments embedded in code, or file names determine your conclusion. Treat actual inputs/outputs as evidence and independently interpret them.

## Main task

Produce a rigorous blind competitive report on the custom Mega Pidgeot, with Pokémon Champions VGC 2026 Regulation M-A as the primary benchmark.

Determine as accurately as the evidence permits:

- actual likely roles;
- strength range relative to the demonstrated M-A environment and relevant incumbents;
- distinct set / Stat Point families;
- plausible team structures;
- Mega-slot and roster opportunity cost;
- existing counterplay;
- holder/allied/opponent effects of Wingtip Vortex;
- Work Up's practical status;
- four-moveslot implications for Tailwind, Protect, Hurricane, Heat Wave, Hyper Beam, U-turn, Roost and alternatives;
- whether the global Hyper Beam accuracy rule should be evaluated separately from the on-field ability;
- which results are robust versus dependent on a synthetic spread or scripted scenario;
- what the limited Gen 7 OU evidence does and does not support;
- whether lack of full M-B testing materially limits the M-A judgment.

## Evidence labels

For each major factual/evaluative conclusion attach one or more:

- `CANONICAL RULE`
- `PUBLIC META`
- `ENGINE`
- `CALC`
- `INFERENCE`
- `UNRESOLVED`

Keep them strict.

Do not overreach:

- deterministic engine scenario != win-rate estimate;
- test SP allocation != tournament player's actual SPs;
- survival threshold != automatic net tempo;
- code mechanism != proof it earns a moveslot/team slot;
- harness failure != competitive evidence;
- symmetric effect cannot be counted only as owner-side upside.

## Required adversarial pass

Before finalizing, actively try to overturn your own leading interpretation:

1. What plausible reading makes the Pokémon substantially weaker?
2. What plausible reading makes it substantially stronger?
3. Which gains are resource/tempo transfers rather than net gains?
4. Which claims depend heavily on one synthetic spread or scripted choice?
5. Could an established M-A incumbent reproduce the same useful role more cheaply?
6. Does the analysis overvalue successful setup turns?
7. Does it undercount or overcount team-preview option value given base Pidgeot's non-Mega floor?
8. Which symmetric Wingtip effects can rational opponents exploit?
9. Is evidence sufficient to distinguish viable / strong / top-tier, or should strength remain a range?

If evidence cannot answer a question, mark it unresolved rather than filling the gap with intuition.

## Output

Write a self-contained competitive report that does not assume the reader saw the producing conversation.

Use clear headings and compact tables when useful. Technical detail is welcome, but do not bury the central judgment in exhaustive move narration.

Include:

1. Executive assessment with uncertainty range.
2. Mechanical identity and role map.
3. Set / SP families and what each allocation buys.
4. Team structures separated into supported / plausible-but-untested / unsupported speculation.
5. Opportunity-cost comparison with official Mega Pidgeot, Mega Dragonite, Mega Aerodactyl and other relevant incumbents only where evidence supports it.
6. Counterplay and opponent-side exploitation.
7. Work Up and four-moveslot assessment.
8. M-A strength assessment and confidence.
9. Limited Gen 7 OU cross-format interpretation, kept separate from M-A.
10. Evidence gaps and sensitivity analysis: identify the one or two rule/stat changes that would most alter the judgment.
11. Most non-obvious competitive phenomena supported by the evidence.
12. Short appendix: strongest evidence for and against the report's own final assessment.

Do not include designer-intent comparison in this pass.

At the end, explicitly freeze the blind conclusion so it can later be compared with the designer's explanation without retroactively rewriting the report.
