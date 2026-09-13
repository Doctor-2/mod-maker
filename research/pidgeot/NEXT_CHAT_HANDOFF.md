# Custom Mega Pidgeot benchmark — next-chat handoff

Status: first-pass blind evidence collection is frozen. Independent blind review has **not yet been supplied back to the coordinating chat** at the time of this handoff. Designer intent has **not** been revealed.

This file is for the coordinating assistant in the next chat. It is not an input to the independent blind reviewer.

---

## 1. User / process requirements that matter

- Continue autonomously whenever no user decision/input is genuinely required; do not stop merely to announce a next step.
- Avoid repeating previously established damage tables, Sun/Rain explanations, or old conclusions unless a new result changes them.
- Prefer a small number of high-information tests over large win-rate-style test sets.
- Test different team structures and different plausible actions, not one scripted line repeatedly.
- Harness/parser/CI failures are engineering issues, not competitive evidence; do not let them consume the competitive testing budget.
- When providing material to an independent high-reasoning model, use appropriate original/raw information and **zero subjective or leading framing**.
- Keep verified facts / engine observations / calculations / inference / uncertainty separate.
- Do not reveal or infer designer intent until the independent blind report is frozen.
- The user can use scarce GPT Work high/max-style reasoning and Claude Opus 5 Extra/Max. A practical allocation discussed was: use a strong independent blind reviewer first; reserve the scarcest GPT Work budget for final synthesis after designer intent and any necessary targeted follow-up tests. This is a workflow option, not a mandatory model choice.

---

## 2. Canonical design

Custom Mega Pidgeot:

- Type: Normal / Flying
- Base stats: **83 / 93 / 99 / 112 / 88 / 104**
- BST: 579
- Ability working name: **Wingtip Vortex / 翼尖涡流**

While a Wingtip Vortex holder is active:

1. Delta Stream / Strong Winds defensive principle applies globally: the Flying-type component of Rock/Electric/Ice super-effectiveness is neutralized.
2. This applies to both teams.
3. All Pokémon Showdown `wind`-flagged moves always pass normal accuracy/evasion checks, globally for both teams.
4. Normal Rain/Sun/Sand/Snow coexist with turbulence; neither replaces the other.

Other changes:

- Hyper Beam accuracy is globally 100 rather than 90, regardless of whether Pidgeot is on the field.
- Pidgeot gains Work Up in Champions.
- Otherwise use the current Champions Pidgeot movepool.
- Standard Mega rules remain: Mega Stone item, only one Mega Evolution per battle.

Current implementation assumption:

- wind accuracy guarantee does not copy No Guard's separate hit-through-semi-invulnerability behavior.

Deferred edge semantics:

- Neutralizing Gas / Gastro Acid / Trace / Skill Swap / Role Play / Receiver behavior has not been designer-resolved. Current code treats Wingtip as an ordinary ability for those interactions. No frozen strength conclusion depends on them.

Important correction history:

The first analyst initially missed that “turbulence” inherited the Delta Stream / Strong Winds Flying-weakness effect and looked only at wind accuracy. That error was corrected before final evidence collection. Do not reuse any pre-correction strength conclusion.

---

## 3. Primary benchmark and implementation

Primary format:

- Pokémon Champions VGC 2026 Regulation M-A
- doubles, six at team preview / bring four, Level 50

Canonical implementation repo:

- `Doctor-2/mod-maker`

Implementation branch:

- `claude/gallant-euler-6mpbzy`
- commits `fd5206b` then corrected v4.1 `32d2a5f`

Competitive-probe / research branch:

- `gpt/pidgeot-phase2-probes`

Canonical bundle:

- `pidgeot_blind_bundle_v4/BUNDLE_FOR_GPT.md`

v4.1 mechanics validation:

- 26 custom mechanics tests passing
- full Showdown suite 2382 passing / 0 failing
- TypeScript clean
- ESLint clean
- Pidgeot @ Pidgeotite + Work Up validates
- stock `championsregma` unchanged

Final frozen Phase 2 engine run:

- GitHub Actions run `34759159630`
- job `103728752327`
- mechanics: 26 passing
- active competitive probes: 11 passing

Do not treat earlier failed CI runs as competitive evidence. Several failures were harness issues: wrong mid-turn U-turn choice handling, raw battle sets accidentally defaulting to Lv100 when level was omitted, misuse of `forceRandomChance:false`, and official-format Team Preview lifecycle. These debugging episodes motivated cleaner final probes but are not results.

---

## 4. Neutral source-of-truth files

For any fresh analysis or external review, prefer these:

1. `research/pidgeot/02_FINAL_RAW_EVIDENCE_V1.md`
   - canonical rules
   - source provenance
   - final executed M-A engine observations E01-E11
   - explicit evidence limits
   - no tier judgment / no designer intent

2. `research/pidgeot/01_SINGLES_RAW_CROSSCHECK.md`
   - limited Gen 7 OU source/calculation cross-check
   - no singles engine result / no tier conclusion

3. `research/pidgeot/FINAL_REVIEW_INPUT_MANIFEST.md`

4. `research/pidgeot/FINAL_INDEPENDENT_REVIEW_PROTOCOL.md`

5. Direct public Smogon / Limitless / Bulbapedia links listed in the raw evidence.

The older `00_RAW_EVIDENCE_INDEX.md` is a research-stage draft; do not use it in place of `02_FINAL_RAW_EVIDENCE_V1.md` for final review.

---

## 5. Final frozen engine observations (neutral shorthand)

The full exact details are in `02_FINAL_RAW_EVIDENCE_V1.md`; this section is navigation only.

- **E01:** Wingtip changes a declared Pelipper / Rotom-W Thunderbolt threshold from KO to survival; actual damage ratio was separately verified.
- **E02:** custom Pidgeot vs Mega Dragonite under the same Sneasler + Rotom-W opening produces different resource/tempo states after two turns; the test explicitly does not declare which full game is favored.
- **E03:** Speed-155 Modest Pidgeot can Tailwind before neutral max Garchomp 154, causing slower Pelipper to benefit and move before Garchomp in the same turn; Speed-124 bulky Pidgeot cannot.
- **E04:** in a Charizard Y + second-Mega-candidate structure, base Aerodactyl retains Wide Guard / high-speed Tailwind value when Charizard is the selected Mega; base Pidgeot does not reproduce those exact functions.
- **E05:** official No Guard Mega Pidgeot does not protect allied Pelipper at the E01 threshold; custom Wingtip Pidgeot does.
- **E06:** official max-Timid Mega Pidgeot wins a Tailwind action-order race against Jolly White Herb/Unburden Sneasler in the declared branch; custom max-Timid Pidgeot loses it.
- **E07:** Maushold Follow Me does not stop faster-priority Fake Out from denying Pidgeot's Work Up in the declared branch.
- **E08:** Armor Tail can remove the Fake Out line and allow Work Up, but does not prevent ordinary double-target Close Combat + Kowtow pressure.
- **E09:** in a Torkoal -> Choice Scarf Vivillon Sun-switch scenario, Wingtip changes Vivillon's Rock Slide survival outcome. A Tailwind difference in the same seed was caused by flinch and is not a controlled Wingtip result.
- **E10:** early U-turn removes Wingtip before a later attack and restores the ally's Flying-derived weakness component; staying in keeps it suppressed.
- **E11:** the defensive rule is symmetric: an opposing Mega Charizard Y also receives the Rock-weakness reduction while Wingtip is active.

No aggregate custom-Pidgeot win rate or tournament result exists.

---

## 6. Internal prior analyst freeze — keep hidden from independent reviewer

The prior coordinating analyst's complete evolving blind hypotheses and final pre-review judgment are now preserved at:

- `research/pidgeot/03_INTERNAL_BLIND_ANALYSIS_FREEZE.md`

This file intentionally contains historical tier/strength judgments, supported/refuted hypothesis labels and interpretive framing.

**Do not include it in the independent reviewer's first pass.**

It exists because the user specifically wants the benchmark to retain what the first analyst believed before designer intent / independent review, rather than letting those judgments disappear with this chat.

After the independent reviewer freezes its own report, this file may be used for an audit comparison.

---

## 7. Limited cross-format state

### Gen 7 OU / 66

Only limited source + calculation evidence exists.

Key facts in the frozen cross-check:

- custom max-Timid Speed 337 vs official Mega Pidgeot 375;
- custom 337 is above Garchomp 333 but below Mega Pinsir 339, Kartana 348, Gengar/Latios 350, Tornadus-T 375, Greninja 377;
- singles lacks simultaneously active allies, so the team-support half of Wingtip is structurally reduced;
- Strong Winds does not reduce Stealth Rock damage; Normal/Flying still takes 25%;
- no custom Gen 7 team / engine battle / optimized set was run.

No singles tier conclusion is frozen as neutral evidence.

### M-B

No custom Pidgeot M-B engine test was run. M-B remains a possible later robustness benchmark if a post-review question requires a mechanism not represented in M-A. Do not silently generalize the M-A strength result to M-B.

---

## 8. Global Hyper Beam attribution

Hyper Beam 90 -> 100 accuracy is a global package rule, not an on-field Wingtip effect.

Public M-A high-placement teams already use Pixilate Sylveon Hyper Beam, so the rule can change the environment even when Pidgeot is absent.

No dedicated 90-vs-100 engine A/B was included in the frozen blind phase. Final analysis must keep this attribution separate from Wingtip / Mega Pidgeot's on-field strength.

---

## 9. Current workflow state / next mandatory sequence

The M-A blind evidence collection is frozen. **Do not add new M-A scenarios before the independent reviewer freezes its report**, unless an actual integrity error is discovered in the frozen evidence/implementation.

Next sequence:

1. Run one independent high-reasoning blind review using only the neutral manifest/protocol/raw evidence and direct sources.
2. Do not provide `03_INTERNAL_BLIND_ANALYSIS_FREEZE.md`, this handoff, designer intent, or prior assistant strength conclusions to that reviewer.
3. Bring the complete independent blind report back to the coordinating chat.
4. Audit the report only for evidence/source/engine misreads and unsupported factual claims. Do not steer its competitive judgment during this audit.
5. Once factually sound, freeze the independent report unchanged.
6. **Only then** ask the user to reveal the original design intent/reasoning in their own words.
7. Compare three independent records:
   - neutral frozen evidence;
   - prior analyst blind freeze;
   - independent reviewer blind report;
   against designer intent.
8. Run only the smallest targeted post-intent tests needed to resolve a real discrepancy or unanswered intent claim.
9. Build a final evidence pack that contains raw evidence first, then clearly separated blind reports, designer intent, and post-intent tests.
10. Use a highest-reasoning model for final synthesis if desired. The final model must be given raw evidence and direct sources, not only previous AI summaries.

---

## 10. Independent-review entry points

Neutral generic prompt:

- `research/pidgeot/BLIND_INDEPENDENT_REVIEW_PROMPT.md`

GPT Work-oriented equivalent:

- `research/pidgeot/GPT_WORK_BLIND_REVIEW_PROMPT.md`

Both should be kept zero-leading. The reviewer should not be told that any particular mechanic is expected to be strong, weak, elegant, healthy, central, or problematic.

Suggested efficient quota allocation discussed with the user:

- independent blind review: Claude Opus 5 Extra/Max is acceptable if available, because this pass is primarily evidence reasoning and adversarial review;
- final post-intent synthesis: scarce GPT Work highest-reasoning quota may be especially valuable for a polished final report;
- this is not a requirement: model choice should not alter the evidence isolation protocol.

---

## 11. What the next coordinating chat should not do

- Do not ask the user to restate mechanics, tests or files already in this repo.
- Do not reveal the internal blind-analysis file to the independent reviewer.
- Do not ask for designer intent early.
- Do not restart broad M-A scenario mining simply because a new chat has less context.
- Do not treat previous harness failures as Pokémon weaknesses.
- Do not repeat old damage tables/Sun/Rain discussion unless a new result changes a conclusion.
- Do not collapse deterministic engine scenarios into a win-rate/tier proof.
- Do not let an independent review overwrite the prior analyst's historical freeze; keep both for later comparison.

---

## 12. User-facing communication preference for this workflow

When reporting progress/results to the user:

- lead with what materially changed;
- use clear tables/headings/numbers when they improve comprehension;
- avoid long repeated recaps;
- state uncertainty directly;
- continue automatically when no user choice is needed;
- stop only at genuine decision points (the next one is normally the designer-intent reveal **after** independent review is frozen).
