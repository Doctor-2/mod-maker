# Final Independent Review — Input Manifest

This manifest identifies the source material permitted for the independent high-reasoning blind review after the evidence-collection phase is frozen. It does not contain a requested conclusion.

## First-pass inputs only

### 1. Frozen final raw evidence
- `research/pidgeot/02_FINAL_RAW_EVIDENCE_V1.md`

This is the primary evidence map. It contains canonical custom rules, public-source provenance, implementation/reproducibility information, final executed M-A engine observations, limited cross-format status, and explicit evidence limits. It intentionally contains no tier judgment or designer intent.

The earlier `research/pidgeot/00_RAW_EVIDENCE_INDEX.md` is a research-stage draft and should not replace the final raw-evidence file.

### 2. Gen 7 OU cross-format raw evidence
- `research/pidgeot/01_SINGLES_RAW_CROSSCHECK.md`

This is a limited cross-format source/calculation file. It is not an M-A result and must not be merged into the M-A evidence without labeling the format change.

### 3. Canonical implementation bundle
- `pidgeot_blind_bundle_v4/BUNDLE_FOR_GPT.md`
- `pidgeot_blind_bundle_v4/showdown_overlay/`

These contain the implemented custom rules and v4.1 mechanics tests.

### 4. Frozen competitive-probe source / executed result
- `pidgeot_blind_bundle_v4/showdown_overlay/test/sim/misc/pidgeot-phase2-v2.js`
- `pidgeot_blind_bundle_v4/showdown_overlay/test/sim/misc/pidgeot-phase2-v4.js`
- `pidgeot_blind_bundle_v4/showdown_overlay/test/sim/misc/pidgeot-phase2-v5.js`
- `pidgeot_blind_bundle_v4/showdown_overlay/test/sim/misc/pidgeot-phase2-v6.js`
- `pidgeot_blind_bundle_v4/showdown_overlay/test/sim/misc/pidgeot-phase2-v7.js`
- `pidgeot_blind_bundle_v4/showdown_overlay/test/sim/misc/pidgeot-phase2-v8.js`

Frozen all-green M-A run:
- GitHub Actions run `34759159630`
- job `103728752327`
- v4.1 mechanics: 26 passing
- active Phase 2 competitive probes: 11 passing

Only results retained in `02_FINAL_RAW_EVIDENCE_V1.md` should be treated as competitive engine evidence. A source file's intended assertion is not evidence if the corresponding executed run failed for harness reasons or was excluded from the frozen result.

### 5. Direct public sources
Use the exact direct URLs in `02_FINAL_RAW_EVIDENCE_V1.md` and `01_SINGLES_RAW_CROSSCHECK.md`, including the Smogon M-A format/role/speed resources, Limitless Indianapolis/NAIC team pages, Showdown source, and Bulbapedia mechanics pages where cited.

When a public source is available, prefer it over a prior AI summary.

### 6. Review protocol
- `research/pidgeot/FINAL_INDEPENDENT_REVIEW_PROTOCOL.md`

The reviewer should follow that protocol, including evidence labels, uncertainty discipline and adversarial checks.

## Deliberately excluded from the first pass

Do **not** provide/read during the independent first pass:

- `research/pidgeot/03_INTERNAL_BLIND_ANALYSIS_FREEZE.md`;
- `research/pidgeot/NEXT_CHAT_HANDOFF.md`;
- prior assistant tier/strength conclusions;
- historical supported/refuted hypothesis labels;
- designer intent, inspiration, target power level or intended role;
- prompts/summaries that state what the custom Mega is “supposed” to do;
- a suggested final tier or recommendation;
- simulated player/community opinions.

These are excluded to preserve an independent benchmark, not because they are unavailable.

## Second-pass material

Only after the independent reviewer has frozen its first-pass report:

1. provide designer intent verbatim or as a clearly identified designer source;
2. optionally provide `03_INTERNAL_BLIND_ANALYSIS_FREEZE.md` to compare the first analyst's historical blind judgments with the independent review;
3. ask for explicit comparison among raw evidence, independent review, prior analyst freeze and designer intent;
4. add only narrowly targeted post-intent tests if a concrete discrepancy remains unresolved.

## Model allocation

No specific model is mandated. The user can access scarce high-reasoning GPT Work configurations and Claude Opus 5 Extra/Max. If scarce quota is used, prefer spending it on independent/final synthesis rather than routine engine execution. Model choice must not change the first-pass input-isolation rule.
