# Independent Final Review Protocol — Custom Mega Pidgeot

Use this protocol only after the blind evidence collection phase is complete.

## Input isolation

For the first analysis pass, provide the reviewing model only:

1. `00_RAW_EVIDENCE_INDEX.md` (updated final version);
2. the canonical design/implementation bundle and exact engine logs referenced by that index;
3. direct public source pages referenced by the index.

Do **not** provide:
- prior assistant tier judgments;
- designer intent;
- historical hypotheses labeled as supported/refuted;
- recommendations about what the model “should” conclude;
- simulated player reactions;
- summaries written to persuade the reviewer that a mechanic is strong, weak, elegant, healthy, or problematic.

Historical hypotheses may be supplied only after the reviewer has committed an independent first-pass analysis.

## Reviewer task

Analyze the custom Mega Pidgeot in Pokémon Champions VGC Regulation M-A from the supplied evidence.

The analysis must independently address:

- likely viable roles and set families;
- realistic Stat Point / speed allocation tradeoffs;
- Mega-slot and roster opportunity cost;
- the effect of Wingtip Vortex on the holder, allies, and opponents;
- whether the global wind-accuracy component materially creates new team structures or mainly reduces variance;
- whether Work Up is a stable plan, a situational plan, or unsupported by the current evidence;
- the practical importance of Tailwind, Protect, U-turn, Heat Wave, Hurricane, Hyper Beam, and relevant alternatives without assuming all fit on one set;
- comparison with the closest demonstrated M-A incumbents, including official Mega Pidgeot, Mega Dragonite, and Mega Aerodactyl where evidence exists;
- counterplay that already exists in the M-A environment;
- any matchup or archetype in which Wingtip Vortex helps the opponent enough to change decisions;
- whether the global Hyper Beam accuracy change should be attributed to the Pokémon itself or treated as a separate environment-level rule change;
- what conclusions generalize beyond the tested scenarios and what conclusions do not.

## Evidence discipline

For every major conclusion, classify support as one or more of:

- `CANONICAL RULE`: directly supplied design rule;
- `PUBLIC META`: direct tournament/resource evidence;
- `ENGINE`: executed Pokémon Showdown result;
- `CALC`: explicit calculation with declared assumptions;
- `INFERENCE`: analysis that goes beyond the direct observations;
- `UNRESOLVED`: evidence insufficient or conflicting.

Do not convert a deterministic scenario test into an implied ladder win rate.
Do not treat a synthetic Stat Point allocation as a tournament player's real allocation.
Do not treat a test harness failure as competitive evidence.
Do not infer designer intent during the blind pass.
Do not assume a mechanism is competitively important merely because it exists.

## Required adversarial checks

Before finalizing, explicitly try to falsify the reviewer's own leading interpretation by asking:

1. What evidence would make the design substantially weaker than the current interpretation?
2. What evidence would make it substantially stronger?
3. Which observed advantages are actually opportunity-cost transfers rather than net gains?
4. Which apparent counters depend on one test spread or one scripted choice?
5. Which benefits are symmetric and therefore available to the opponent?
6. Could a different incumbent reproduce the same role more cheaply?
7. Does the analysis overvalue successful setup turns while undercounting games where setup is not selected?
8. Does it overvalue survival thresholds without accounting for the action/positioning cost needed to preserve the surviving Pokémon?

## Output requested from the independent reviewer

Produce a structured report containing:

1. Executive assessment with uncertainty range, not a single unsupported tier label.
2. Mechanical identity and role map.
3. Set / SP allocation families and their distinct purposes.
4. Team archetypes: supported, plausible-but-untested, and unsupported.
5. Opportunity-cost comparison against demonstrated alternatives.
6. Counterplay and opponent-side exploitation.
7. Evidence-derived strength assessment in M-A.
8. Sensitivity analysis: which one or two rule/stat changes would most change the conclusion.
9. Evidence gaps and confidence levels.
10. A short list of genuinely non-obvious phenomena found in the evidence.

Only after this independent report is frozen should designer intent be revealed and compared against it.

## Second pass after designer-intent reveal

After the independent blind report is frozen, supply the designer's explanation verbatim or as a clearly marked direct source. Then ask the reviewer to classify each intended element as:

- supported by blind evidence;
- partially supported;
- contradicted;
- not tested;
- emergent role/effect not stated in the intent.

The second pass may update design recommendations, but it must preserve the original blind conclusions so the benchmark remains auditable.
