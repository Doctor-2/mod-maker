# Final Independent Review — Input Manifest

This manifest identifies the source material to provide to a high-reasoning reviewer after the blind evidence-collection phase is frozen. It does not contain a requested conclusion.

## First-pass inputs only

### 1. Frozen final raw evidence
- `research/pidgeot/02_FINAL_RAW_EVIDENCE_V1.md`

This is the primary evidence map for the independent blind review. It contains the canonical custom rules, public-source provenance, implementation/reproducibility information, final executed M-A engine observations, limited cross-format status, and explicit evidence limits. It intentionally contains no tier judgment or designer intent.

The earlier `00_RAW_EVIDENCE_INDEX.md` is a research-stage draft and should not be used as the primary final-review input when `02_FINAL_RAW_EVIDENCE_V1.md` is available.

### 2. Gen 7 OU cross-format raw evidence
- `research/pidgeot/01_SINGLES_RAW_CROSSCHECK.md`

This is a limited cross-format source/calculation file. It is not an M-A result and must not be merged into the M-A evidence without labeling the format change.

### 3. Canonical implementation bundle
- `pidgeot_blind_bundle_v4/BUNDLE_FOR_GPT.md`
- `pidgeot_blind_bundle_v4/showdown_overlay/`

These contain the implemented custom rules and the v4.1 mechanics tests.

### 4. Competitive probe source
- `pidgeot_blind_bundle_v4/showdown_overlay/test/sim/misc/pidgeot-phase2-v2.js`
- `pidgeot_blind_bundle_v4/showdown_overlay/test/sim/misc/pidgeot-phase2-v4.js`
- `pidgeot_blind_bundle_v4/showdown_overlay/test/sim/misc/pidgeot-phase2-v5.js`
- `pidgeot_blind_bundle_v4/showdown_overlay/test/sim/misc/pidgeot-phase2-v6.js`
- `pidgeot_blind_bundle_v4/showdown_overlay/test/sim/misc/pidgeot-phase2-v7.js`
- `pidgeot_blind_bundle_v4/showdown_overlay/test/sim/misc/pidgeot-phase2-v8.js`

The frozen all-green M-A probe run is GitHub Actions run `34759159630`, job `103728752327`: v4.1 mechanics 26 passing and active Phase 2 probes 11 passing.

Only results recorded as executed in the frozen raw-evidence file should be treated as engine evidence. A source file's intended assertion is not evidence if the corresponding run failed for harness reasons.

### 5. Public sources
Use the exact direct URLs in `02_FINAL_RAW_EVIDENCE_V1.md`, including the Smogon M-A format/role/speed resources and Limitless Indianapolis/NAIC team pages. Prefer the direct public source over any prior assistant summary when the source is available.

### 6. Review protocol
- `research/pidgeot/FINAL_INDEPENDENT_REVIEW_PROTOCOL.md`

The reviewer should follow this protocol, including its evidence labels and adversarial checks.

## Deliberately excluded from the first pass

Do not provide on first pass:
- prior assistant tier/strength conclusions;
- historical supported/refuted hypothesis labels;
- designer intent;
- prompts that state what the custom Mega is “supposed” to do;
- a suggested final tier;
- simulated player/community opinions.

## Second-pass material

Only after the reviewer has frozen its independent first-pass report:
1. provide designer intent verbatim or as a clearly identified designer source;
2. optionally provide the historical hypothesis/falsification ledger for audit;
3. ask for comparison between blind evidence, independent report, and designer intent.

## Model allocation

No specific model is mandated by this file. If scarce high-reasoning quota is used, it is intended for the final independent synthesis/review rather than for routine engine execution or data collection.
