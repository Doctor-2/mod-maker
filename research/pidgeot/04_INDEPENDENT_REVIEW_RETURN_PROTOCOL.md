# Independent blind review return protocol — Custom Mega Pidgeot

Status: use this protocol after an independent blind report has been produced from the frozen neutral input set, but before designer intent is revealed.

This file is process-only. It does not state a competitive conclusion.

## 1. Preserve the returned report before analysis

When the independent blind report is supplied to the coordinating chat:

1. save the report verbatim as a separate source file;
2. record the model/configuration if the user supplies it;
3. record that the report was produced before designer intent was revealed;
4. do not rewrite, summarize into a replacement, or silently correct the original report;
5. do not provide the report author with the prior analyst's internal blind judgment before the report is frozen.

Suggested storage path:

- `research/pidgeot/independent_reviews/<date_or_model>_BLIND_REPORT_RAW.md`

The raw report remains immutable. Any later audit/correction note should be stored separately.

## 2. First audit pass: factual integrity only

Before consulting the prior analyst's evaluative freeze, audit the independent report against only:

- `research/pidgeot/02_FINAL_RAW_EVIDENCE_V1.md`;
- `research/pidgeot/01_SINGLES_RAW_CROSSCHECK.md`;
- canonical implementation / executed probe source and logs referenced by the raw evidence;
- direct public sources referenced by those files;
- `research/pidgeot/FINAL_REVIEW_INPUT_MANIFEST.md`;
- `research/pidgeot/FINAL_INDEPENDENT_REVIEW_PROTOCOL.md`.

Check only for:

- factual errors;
- public-source misreads;
- engine-result misreads;
- treating synthetic Stat Point allocations as tournament-player allocations;
- treating deterministic scripted scenarios as win-rate/tournament evidence;
- attributing the global Hyper Beam rule entirely to Wingtip/Pidgeot;
- silently generalizing M-A results to M-B or Gen 7 OU;
- claims presented as factual that are unsupported by the allowed source set.

Do not use disagreement with the prior analyst as a reason to edit the independent reviewer's competitive judgment.

## 3. Audit output

Create a separate audit note with one of the following outcomes for each issue:

- `NO ISSUE` — source supports the statement;
- `FACTUAL CORRECTION` — statement conflicts with a direct source / raw engine result;
- `OVERCLAIM` — statement goes beyond what the cited evidence establishes;
- `UNRESOLVED` — available evidence does not settle the point.

Where possible, quote or cite the smallest raw evidence/source fragment needed to establish the correction.

Do not replace the reviewer's original text. Preserve both the original report and the audit note.

## 4. Freeze the independent report

Once the factual audit is complete:

- mark the raw independent report as frozen;
- if factual corrections are needed, freeze the original report plus a separate correction/audit note;
- do not ask the reviewer to change tier/strength judgment merely to agree with another analyst;
- do not reveal designer intent yet until the raw report and factual audit are both preserved.

## 5. Only after the independent report is frozen

The coordinating chat may then read:

- `research/pidgeot/03_INTERNAL_BLIND_ANALYSIS_FREEZE.md`

for comparison with the independently frozen report.

This comparison must preserve both records separately. Do not merge them into a single retroactive blind conclusion.

At this point compare only what each blind analyst independently concluded from the pre-intent evidence:

- role / set-family interpretation;
- opportunity-cost interpretation;
- strength range and uncertainty;
- main counterplay;
- evidence gaps;
- non-obvious phenomena;
- disagreements and possible reasons for them.

## 6. Designer-intent reveal boundary

Only after sections 1–5 are complete should the user be asked to provide, in their own words:

- original design goals;
- intended role(s);
- target strength/power range;
- intended team structures or synergies;
- reasoning behind stats, typing, ability, Work Up, Hyper Beam change, and other deliberate choices;
- any expected weaknesses/counterplay;
- any intended behavior that has not yet been discussed.

Do not show the user a synthesized “correct answer” and then ask them to explain their intent. Collect their account first as a direct source.

Store it separately as `DESIGNER INTENT` material.

## 7. Post-intent work

Compare four separate records:

1. frozen neutral evidence;
2. prior coordinating analyst blind freeze;
3. independent blind report (+ factual audit note if any);
4. designer intent.

For each intended element, use neutral comparison labels such as:

- supported by current evidence;
- partially supported;
- contradicted by current evidence;
- not tested;
- emergent effect not stated in intent.

Add new engine/calculation/public-source work only when a concrete discrepancy or untested intent claim could materially change role, set choice, team structure, counterplay, opportunity cost, or strength assessment.

Do not reopen unrestricted M-A scenario mining.

## 8. Final synthesis preparation

Before a highest-reasoning final synthesis, build an input pack in this order:

1. canonical rules and direct public/raw sources;
2. frozen neutral raw evidence;
3. frozen independent blind report and factual audit;
4. prior analyst blind freeze;
5. designer intent verbatim;
6. any narrowly targeted post-intent evidence;
7. explicit unresolved questions.

The final model must be told which materials are raw/direct versus AI analysis. It should not be given a requested tier or desired conclusion.
