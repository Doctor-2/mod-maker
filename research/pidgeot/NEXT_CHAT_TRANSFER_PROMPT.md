# Next-chat transfer prompt — Custom Mega Pidgeot benchmark

You are taking over an ongoing competitive-design research benchmark. The previous chat reached its context limit. Do not restart the project, re-ask settled mechanics, or repeat old damage/Sun/Rain analysis.

## Repository / branch

Repository: `Doctor-2/mod-maker`
Branch: `gpt/pidgeot-phase2-probes`

Read first:

1. `research/pidgeot/NEXT_CHAT_HANDOFF.md`
2. `research/pidgeot/BLIND_PHASE_FREEZE.md`
3. `research/pidgeot/02_FINAL_RAW_EVIDENCE_V1.md`
4. `research/pidgeot/01_SINGLES_RAW_CROSSCHECK.md`

For the coordinating chat only, also read:

5. `research/pidgeot/03_INTERNAL_BLIND_ANALYSIS_FREEZE.md`

**Important:** file 5 contains the prior analyst's evaluative blind judgments. It must never be given to the independent blind reviewer before that reviewer freezes its own report.

Also inspect `FINAL_REVIEW_INPUT_MANIFEST.md` and `FINAL_INDEPENDENT_REVIEW_PROTOCOL.md` before preparing any external-review packet.

## Current state

- Canonical v4.1 implementation is mechanically validated.
- M-A blind evidence collection is frozen.
- Final all-green run: GitHub Actions `34759159630`, job `103728752327`.
- v4.1 mechanics: 26 passing.
- frozen active Phase 2 competitive probes: 11 passing.
- Neutral final evidence is in `02_FINAL_RAW_EVIDENCE_V1.md`.
- Prior analyst historical blind judgments are separately frozen in `03_INTERNAL_BLIND_ANALYSIS_FREEZE.md`.
- Designer intent has **not** been revealed.
- No further open-ended M-A testing should occur before the independent blind report is frozen unless an actual evidence/implementation integrity problem is discovered.

## Immediate next step

Determine whether the user has already obtained an independent blind report.

### If the user has NOT yet obtained one

Do not add more competitive tests. Help them run one independent high-reasoning blind review using:

- `research/pidgeot/BLIND_INDEPENDENT_REVIEW_PROMPT.md`

or, for GPT Work:

- `research/pidgeot/GPT_WORK_BLIND_REVIEW_PROMPT.md`

The reviewer receives only the neutral first-pass inputs listed by `FINAL_REVIEW_INPUT_MANIFEST.md`.

Do **not** give the reviewer:

- `03_INTERNAL_BLIND_ANALYSIS_FREEZE.md`;
- `NEXT_CHAT_HANDOFF.md`;
- this transfer prompt;
- designer intent;
- previous tier/strength judgments;
- supported/refuted hypothesis labels.

The user has access to scarce high-reasoning GPT Work configurations and Claude Opus 5 Extra/Max. Model choice is secondary to preserving the evidence firewall. A previously discussed efficient option was Opus for the independent blind audit and scarce GPT Work highest reasoning for the final post-intent synthesis, but do not present that as mandatory.

### If the user HAS brought back the independent blind report

1. Read it completely.
2. Audit it against raw evidence and direct sources for factual mistakes, engine-result misreads, source misquotation, synthetic-SP overreach, or confusion between deterministic scenarios and win-rate evidence.
3. Correct factual issues if needed, but do not steer the reviewer's competitive judgment toward the previous analyst's view.
4. Freeze the independent report once factually sound.
5. Only now ask the user for the original designer intent/reasoning, preferably in the user's own words and without showing them the internal blind conclusions first.
6. Preserve the designer response as a direct source.
7. Compare:
   - neutral frozen evidence;
   - prior analyst blind freeze;
   - independent blind report;
   - designer intent.
8. Run only narrowly targeted post-intent tests needed to resolve a concrete discrepancy or untested intent claim.
9. Then prepare a final evidence pack for a highest-reasoning synthesis model.

## Final synthesis requirements

The eventual final report should receive raw/direct evidence, not only AI summaries. Keep separate:

- `CANONICAL RULE`
- `PUBLIC META`
- `ENGINE`
- `CALC`
- `INFERENCE`
- `UNRESOLVED`
- direct `DESIGNER INTENT`

Preserve both blind reports unchanged so post-intent knowledge cannot rewrite them retroactively.

The final model should be asked to synthesize competitive identity, role/set families, team homes, opportunity cost, counterplay, symmetric effects, global Hyper Beam attribution, M-A strength range/confidence, limited singles implications, intent alignment, and any minimal balance/design recommendations actually supported by evidence.

## Collaboration rules

- Continue automatically whenever no genuine user input/decision is required.
- Do not stop to announce a next step.
- Do not make the user copy information between tools if it is already accessible in the repo.
- Do not repeat settled damage tables or old weather analysis unless new evidence changes them.
- Prefer a few high-information tests across different team structures/actions over many repetitive scenarios.
- Engineering/harness errors are not Pokémon evidence.
- When giving material to an external reviewer/final model, include suitable original/raw evidence and use zero subjective / non-leading framing.
- In user-facing summaries, lead with what materially changed and keep the logic clear without unnecessary length.

The next genuine user decision/input point should normally be the designer-intent reveal **after** the independent blind report has been frozen.
