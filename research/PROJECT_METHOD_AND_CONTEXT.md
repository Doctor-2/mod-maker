# Custom Mega competitive-research project — method and context

This is a coordinating-project file, not a blind-review input for any specific Pokémon unless explicitly listed in that Pokémon's review manifest.

## 1. Project scope

The designer has roughly:

- 10–20 substantially designed custom/reworked Mega Evolutions;
- another 20–30 less-complete ideas.

Most are primarily designed for Pokémon Champions doubles with six-Pokémon team preview and four selected for battle (“64”, VGC-like). Some may also be interesting in six-on-six singles (“66”).

Standard Mega constraints remain unless a candidate explicitly says otherwise:

- Mega Stone occupies the item slot;
- one Mega Evolution per battle.

Long-term intended custom environment may eventually remove all official Megas and use only the designer's custom Mega pool while expanding other roster/item content gradually. Therefore official Megas are useful as calibration/incumbent baselines during research, not necessarily permanent competitors in the final custom environment.

## 2. Benchmark formats

Primary doubles sequence:

1. Pokémon Champions Regulation M-A — first diagnostic benchmark.
2. Regulation M-B — second expansion/robustness benchmark when it exposes a genuinely different mechanism or when M-A leaves an important question unresolved.

Primary singles sequence:

1. Gen 7 OU — first diagnostic/discovery benchmark.
2. Gen 9 National Dex — second robustness/stress test when useful.

Do not cross-test formats merely for volume. Use a second format when the format change exposes a different mechanism (for example, simultaneous ally support in doubles versus no active ally in singles; different speed modes; different incumbent competition).

## 3. Evidence provenance

Prefer direct sources and label provenance.

Useful source families:

- official Pokémon / Pokémon Champions rules and mechanics pages;
- Pokémon Showdown source and battle engine;
- Smogon format / role / speed / analysis resources;
- Limitless public tournament team/statistics pages;
- Bulbapedia for mechanics/formulas where appropriate.

Important limitation:

Public Champions data does not necessarily expose official aggregate ranked usage or every player's exact Stat Point allocation. Tournament team sheets can expose species/item/ability/nature/moves without SPs. Synthetic SP allocations used in tests must therefore be labeled as test allocations, not attributed to players.

## 4. Standard candidate workflow

### Stage A — blind design review

The designer provides mechanics + target format but withholds intended role, target strength, inspiration and expected synergies.

Before looking at intent, identify:

- mechanical identity;
- candidate roles;
- closest incumbents / opportunity costs;
- meaningful speed/damage/survival thresholds;
- plausible sets and four-moveslot tension;
- likely team homes;
- counterplay;
- 2–4 concrete falsifiable predictions.

Avoid merely restating card text.

### Stage B — meta grounding

Use direct current/relevant format evidence:

- role compendium / speed tiers;
- representative tournament teams;
- actual incumbent Mega usage / moves where public;
- relevant move legality and mechanics;
- calculations with declared assumptions.

Update the blind predictions rather than silently rewriting them.

### Stage C — thin engine implementation

Use the smallest Pokémon Showdown mod/overlay that inherits the target format.

Do not build:

- a new battle simulator;
- a giant custom Pokémon database;
- a web UI;
- a fake multi-agent player ecosystem.

First pass mechanics acceptance tests before any balance games. Harness failures are engineering problems, not competitive evidence.

### Stage D — targeted falsification / paired control

Prefer a small number of high-information deterministic or scripted scenarios over raw game volume.

Good tests:

- same shell / same opponent / same seed, replacing only the candidate or incumbent;
- same board, comparing 2–3 genuinely plausible actions;
- threshold cases that change action order, survival, resource flow, bring decisions or opportunity cost;
- positive and negative branches;
- team-preview / secondary-Mega costs where relevant.

Test across different team structures and operations rather than repeating one favorable shell.

Do not interpret a deterministic scenario as a win-rate estimate.

### Stage E — freeze blind evidence

Before designer intent is revealed:

- freeze neutral raw evidence;
- freeze the coordinating analyst's historical blind predictions/judgment in a separate internal file;
- stop adding open-ended scenarios once marginal information gain is low.

The independent reviewer receives only neutral raw/direct evidence, not the coordinating analyst's prior conclusions.

### Stage F — independent high-reasoning blind review

A high-reasoning model independently synthesizes the frozen evidence.

Inputs must be zero-leading:

- canonical rules;
- direct public sources;
- raw calculations;
- successful engine observations;
- explicit limitations.

Exclude:

- designer intent;
- prior tier judgment;
- supported/refuted hypothesis labels;
- persuasive framing;
- simulated community sentiment.

The independent report must freeze its conclusion before seeing intent.

### Stage G — designer-intent reveal

After the independent blind report is frozen, collect the designer's original reasoning in their own words.

Compare intended elements with evidence using categories such as:

- supported;
- partially supported;
- contradicted;
- not tested;
- emergent effect/role not stated in intent.

Do not rewrite the earlier blind reports retroactively.

### Stage H — minimal post-intent verification

Only add tests that resolve a concrete mismatch or untested design-intent claim.

Do not reopen unlimited scenario mining.

### Stage I — final synthesis

For a final report, provide a highest-reasoning model with raw/direct evidence first, followed by clearly separated:

- blind analyst freeze;
- independent blind review;
- designer intent;
- post-intent tests.

The final report should distinguish facts/calculations/engine evidence/inference/uncertainty and should be adversarial to its own conclusion.

## 5. What “good evidence” means

A useful test should affect at least one of:

- likely role;
- set / SP choice;
- team structure;
- bring/Mega decision;
- move choice;
- opportunity cost;
- counterplay;
- strength range;
- balance recommendation.

If a test only reconfirms an already-settled mechanic, it is usually not worth another scenario.

Prefer evidence that finds non-obvious phenomena, including negative results.

## 6. Analysis discipline

Keep separate:

- `CANONICAL RULE`
- `PUBLIC META`
- `ENGINE`
- `CALC`
- `INFERENCE`
- `UNRESOLVED`
- after reveal: direct `DESIGNER INTENT`

Avoid:

- fake player/community reactions presented as real sentiment;
- interpreting a synthetic spread as a real tournament spread;
- interpreting one scripted line as optimal play;
- attributing a global rules patch entirely to the candidate Pokémon;
- treating survival as automatically equivalent to net tempo;
- assuming higher raw damage is always more valuable than role compression;
- making the user shuttle files/results between AIs when the repo/tooling already exposes them.

## 7. Testing breadth versus budget

The designer explicitly prefers different team ideas and different plausible operations, but with a limited number of tests chosen for information value.

A good portfolio can include, where relevant:

- weather and non-weather structures;
- setup-support and immediate-offense structures;
- one-Mega and multi-Mega roster structures;
- stay/Protect/Tailwind/setup/attack/switch/pivot branches;
- opponent alternative targeting/denial lines;
- an incumbent replacement control.

Do not inflate sample count merely to look comprehensive.

## 8. Communication preferences for this project

- Chinese default; English Pokémon/tool terms are fine.
- Lead with the current target or what materially changed.
- Use concrete numbers/tables when they improve understanding.
- Prefer deep calculations and actual meta grounding to casual claims.
- Do not repeat already-settled damage tables or broad explanations unless new evidence changes them.
- Negative findings are welcome when grounded.
- Continue automatically when no genuine user input is needed.
- Stop only at a real decision/input boundary.
- Final high-reasoning model inputs should include suitable raw/original information and be zero-leading.
