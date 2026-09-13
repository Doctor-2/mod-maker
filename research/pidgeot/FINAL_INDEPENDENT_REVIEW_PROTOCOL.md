# Independent Final Review Protocol — Custom Mega Pidgeot

Use this protocol only after the blind evidence-collection phase is complete.

## Input isolation

For the first independent analysis pass, provide only:

1. `research/pidgeot/02_FINAL_RAW_EVIDENCE_V1.md`;
2. `research/pidgeot/01_SINGLES_RAW_CROSSCHECK.md`;
3. the canonical design/implementation bundle and exact executed probe source/logs referenced by the final raw evidence;
4. the direct public source pages referenced by those raw-evidence files;
5. `research/pidgeot/FINAL_REVIEW_INPUT_MANIFEST.md` and this protocol.

The earlier `00_RAW_EVIDENCE_INDEX.md` is a research-stage draft and is not the primary final-review evidence file.

Do **not** provide on the first pass:

- `research/pidgeot/03_INTERNAL_BLIND_ANALYSIS_FREEZE.md`;
- `research/pidgeot/NEXT_CHAT_HANDOFF.md`;
- prior assistant tier/strength judgments;
- designer intent;
- historical hypotheses labeled as supported/refuted;
- recommendations about what the reviewer “should” conclude;
- simulated player/community reactions;
- summaries written to persuade the reviewer that a mechanic is strong, weak, elegant, healthy, problematic, central, or unimportant.

Historical analyst material may be supplied only after the reviewer has committed and frozen an independent first-pass report.

## Reviewer task

Analyze the custom Mega Pidgeot in Pokémon Champions VGC 2026 Regulation M-A from the supplied evidence.

Independently address:

- likely viable roles and set families;
- realistic Stat Point / speed allocation tradeoffs;
- Mega-slot and roster opportunity cost;
- the effect of Wingtip Vortex on the holder, allies, and opponents;
- whether the global wind-accuracy component materially creates new team structures or mainly changes reliability;
- whether Work Up is a stable plan, a situational plan, or unsupported by the current evidence;
- the practical importance of Tailwind, Protect, U-turn, Heat Wave, Hurricane, Hyper Beam, Roost and relevant alternatives without assuming all fit on one set;
- comparison with the closest demonstrated M-A incumbents, including official Mega Pidgeot, Mega Dragonite, and Mega Aerodactyl where evidence exists;
- counterplay already present in the M-A environment;
- any matchup/archetype in which Wingtip Vortex helps the opponent enough to affect decisions;
- whether the global Hyper Beam accuracy change should be attributed to the Pokémon itself or treated as a separate environment-level rule change;
- what conclusions generalize beyond the tested scenarios and what conclusions do not;
- whether the limited Gen 7 OU evidence supports only a different profile or something stronger than that;
- whether the absence of a full M-B engine test materially limits the M-A judgment.

Do not infer designer intent during this pass.

## Evidence discipline

For every major conclusion, classify support as one or more of:

- `CANONICAL RULE`: directly supplied design rule;
- `PUBLIC META`: direct tournament/resource evidence;
- `ENGINE`: executed Pokémon Showdown result;
- `CALC`: explicit calculation with declared assumptions;
- `INFERENCE`: analysis beyond direct observations;
- `UNRESOLVED`: evidence insufficient or conflicting.

Rules:

- A deterministic engine scenario is not a ladder/tournament win-rate estimate.
- A synthetic Stat Point allocation is not a tournament player's real allocation.
- A survival threshold does not automatically imply net tempo or a favorable full-game state.
- A mechanism existing in code does not prove that it matters enough to earn a moveslot/team slot.
- A test harness failure is not competitive evidence.
- An opponent-side symmetric effect must not be counted only as a benefit to the custom Pokémon.
- A source file's intended assertion is not evidence unless the corresponding executed result passed and is retained in the frozen evidence.
- If a direct public source conflicts with a summary, use the direct source and flag the discrepancy.

## Required adversarial checks

Before finalizing, explicitly try to falsify the reviewer's own leading interpretation:

1. What reading of the same evidence could make the design substantially weaker?
2. What reading could make it substantially stronger?
3. Which observed advantages are resource/tempo transfers rather than net gains?
4. Which apparent counters or benefits depend on one synthetic spread or scripted choice?
5. Which benefits are symmetric and available to the opponent?
6. Could an established incumbent reproduce the same useful role at lower Mega/roster cost?
7. Does the analysis overvalue successful setup turns while undercounting games where setup is not selected?
8. Does it overvalue survival thresholds without accounting for the action/positioning cost of preserving the surviving Pokémon?
9. Does it undercount team-preview option value, or overcount it given the base-form floor?
10. Is the evidence strong enough to distinguish viable / strong / top-tier, or should the result remain a range?

If the evidence cannot answer a question, mark it unresolved rather than filling the gap with intuition.

## Output requested from the independent reviewer

Produce a self-contained report with:

1. Executive assessment with uncertainty range.
2. Mechanical identity and role map.
3. Set / SP allocation families and their distinct purposes.
4. Team archetypes separated into supported, plausible-but-untested, and unsupported/speculative.
5. Opportunity-cost comparison against demonstrated alternatives.
6. Counterplay and opponent-side exploitation.
7. Work Up and four-moveslot assessment.
8. Evidence-derived M-A strength assessment and confidence.
9. Limited Gen 7 OU cross-format interpretation, clearly separated from M-A.
10. Sensitivity analysis: the one or two rule/stat changes that would most alter the judgment.
11. Evidence gaps and confidence levels.
12. The most non-obvious competitive phenomena supported by the evidence.
13. A short appendix giving the strongest evidence for and against the report's own assessment.

At the end, explicitly freeze the blind conclusion so it can later be compared with designer intent without retroactively rewriting it.

## Second pass after designer-intent reveal

Only after the independent blind report is frozen:

1. supply the designer's explanation verbatim or as a clearly marked direct designer source;
2. optionally supply `03_INTERNAL_BLIND_ANALYSIS_FREEZE.md` for historical comparison;
3. compare each intended element against the evidence and blind reports using labels such as supported / partially supported / contradicted / not tested / emergent;
4. preserve the original independent blind report unchanged;
5. add only the smallest targeted post-intent tests needed to resolve a concrete discrepancy.
