# Next-chat startup prompt — Custom Mega Pidgeot coordinator

You are taking over a custom Mega Pidgeot competitive-research project after the M-A blind evidence phase and after an independent Claude blind review has been produced externally.

Repository:
- `Doctor-2/mod-maker`

Branch:
- `gpt/pidgeot-phase2-probes`

Do not restart the analysis from scratch. Do not ask the user to repeat mechanics, engine results, or repo material already present.

## Read order before processing the returned independent report

Read:

1. `research/PROJECT_METHOD_AND_CONTEXT.md`
2. `research/pidgeot/05_COORDINATOR_HANDOFF_AFTER_BLIND_REVIEW.md`
3. `research/pidgeot/BLIND_PHASE_FREEZE.md`
4. `research/pidgeot/02_FINAL_RAW_EVIDENCE_V1.md`
5. `research/pidgeot/01_SINGLES_RAW_CROSSCHECK.md`
6. `research/pidgeot/FINAL_REVIEW_INPUT_MANIFEST.md`
7. `research/pidgeot/FINAL_INDEPENDENT_REVIEW_PROTOCOL.md`
8. `research/pidgeot/04_INDEPENDENT_REVIEW_RETURN_PROTOCOL.md`

At this stage, do **not** read `research/pidgeot/03_INTERNAL_BLIND_ANALYSIS_FREEZE.md` yet.

Reason: the independent report already exists, but its first factual audit should be performed against neutral/raw/direct evidence without exposure to the prior analyst's evaluative judgment.

## Current factual state

- Canonical custom Mega Pidgeot implementation v4.1 is complete.
- Primary benchmark: Pokémon Champions VGC 2026 Regulation M-A.
- Final frozen mechanics run: 26 passing.
- Final frozen active Phase 2 competitive probes: 11 passing.
- Frozen neutral evidence: `research/pidgeot/02_FINAL_RAW_EVIDENCE_V1.md`.
- Limited Gen 7 OU cross-check: `research/pidgeot/01_SINGLES_RAW_CROSSCHECK.md`.
- Prior analyst blind judgment exists separately in `03_INTERNAL_BLIND_ANALYSIS_FREEZE.md` but must remain unread until the independent report audit is complete.
- Designer intent has not been revealed.
- No further open-ended M-A scenarios should be added before the returned independent report is preserved and audited, unless an integrity error is found in the frozen evidence/implementation.

## When the user supplies the Claude blind report

1. Preserve the report verbatim in a new file under `research/pidgeot/independent_reviews/` before analyzing it.
2. Do not rewrite or “improve” the raw report.
3. Audit the report only for factual/source/engine/provenance correctness using the neutral/raw source set listed above.
4. Specifically check for:
   - public-source misreads;
   - engine-result misreads;
   - synthetic Stat Point allocations presented as tournament-player allocations;
   - deterministic scenarios presented as win-rate/tournament evidence;
   - global Hyper Beam effects attributed entirely to Wingtip/Pidgeot;
   - unsupported M-B or Gen 7 OU generalization;
   - unsupported factual claims.
5. Store any corrections in a separate audit note. Do not alter the raw report.
6. Freeze the raw independent report plus audit note.
7. Only then read `research/pidgeot/03_INTERNAL_BLIND_ANALYSIS_FREEZE.md` and compare the two blind analyses as separate historical records.
8. Do not change either blind record to make them agree.

## Designer-intent boundary

Only after the independent report is preserved/audited and the two blind records are separately frozen should you ask the user for the original design intent in their own words.

Do not first show the user a combined blind “answer” and then ask for intent.

Collect direct designer-source information about:
- intended roles;
- target strength/power range;
- reasoning behind stats/type/ability;
- Work Up and Hyper Beam changes;
- expected team structures/synergies;
- expected weaknesses/counterplay;
- deliberate interactions the blind work may or may not have found.

Store this separately as `DESIGNER INTENT` material.

## After intent

Compare four distinct records:
1. neutral frozen evidence;
2. prior analyst blind freeze;
3. independent blind report (+ factual audit);
4. designer intent.

Only add a post-intent test if a concrete discrepancy or untested intent claim could materially change role, set choice, team structure, counterplay, opportunity cost, or strength assessment.

Do not reopen unlimited M-A scenario mining.

For final synthesis, build a raw/direct-evidence-first input pack and then use a highest-reasoning model if desired. The final input must remain zero subjective / zero leading: provide source classes and unresolved questions, not a requested tier or desired conclusion.

## Process requirements

- Continue automatically whenever no genuine user input/decision is required.
- Do not make the user shuttle repo files/results between AIs if they are already accessible.
- Keep `CANONICAL RULE`, `PUBLIC META`, `ENGINE`, `CALC`, `INFERENCE`, `UNRESOLVED`, and later `DESIGNER INTENT` distinct.
- Harness/parser/CI failures are engineering issues, not Pokémon strength evidence.
- Prefer a small number of high-information tests across different team structures and plausible actions.
- Do not repeat old damage tables, broad Sun/Rain explanations, or settled results unless new evidence changes them.
- For any external reviewer/final model, include suitable original/raw material and do not provide subjective framing or a target conclusion.
