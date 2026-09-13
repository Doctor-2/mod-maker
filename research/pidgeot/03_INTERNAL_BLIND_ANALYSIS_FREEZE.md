# Custom Mega Pidgeot — INTERNAL historical blind-analysis freeze

**Do not provide this file to the independent blind reviewer before that reviewer freezes its own report.**

Purpose: preserve the prior analyst's evolving blind hypotheses and final pre-review judgment so they can later be compared against (a) the independent blind review and (b) designer intent without retroactive rewriting.

This file is deliberately evaluative. It is **not** part of the neutral evidence packet. Canonical facts and executed results should be audited against `02_FINAL_RAW_EVIDENCE_V1.md` and the cited public/engine sources rather than trusted from this summary.

Designer intent had **not** been revealed when this freeze was written.

---

## 1. Starting baseline and preregistered blind predictions

Before the custom mechanics were known in full, the analyst established the following baseline.

Official Mega Pidgeot in Champions / historical singles was interpreted primarily as a fast special Flying attacker/pivot: 121 Speed, 135 SpA, No Guard Hurricane, with Heat Wave, U-turn, Roost and Tailwind available. In Gen 7 singles, Tornadus-T was treated as a central opportunity-cost comparison; in M-A, the central question was not hazards but whether one Mega slot was worth spending on a fast reliable Hurricane/Tailwind user when stronger role-compression Megas existed.

The preregistered blind expectations were:

1. If the redesign remained mainly a faster/special Hurricane attacker with better stats or coverage, improvement should show more clearly in 66 than in M-A.
2. If the redesign added an on-field / action-space-changing ability, improvement should be larger in 64 doubles.
3. If Normal STAB became genuinely relevant, it could change switching/targeting logic more than ordinary coverage would.
4. A physical conversion would not automatically be healthy or useful because of Intimidate, recoil/contact and existing physical answers.
5. Role compression / board-state value was expected to matter more in M-A than simply adding more OHKOs.

These were written before the full custom mechanics were disclosed.

---

## 2. Rule correction that materially changed the analysis

The analyst initially misread “turbulence” as only the custom wind-accuracy field rule. The designer then clarified that the name derives from Delta Stream / Strong Winds and therefore carries the Flying-weakness-removal effect, with wind-move accuracy as an additional custom effect.

Correct custom design used for all final evidence:

- Normal/Flying
- 83 / 93 / 99 / 112 / 88 / 104
- Wingtip Vortex / turbulence while the holder is active
- Delta Stream-style neutralization of the Flying component of Rock/Electric/Ice weakness, globally for both sides
- all Showdown `wind`-flagged moves always pass accuracy/evasion checks, globally for both sides
- ordinary weather coexists with turbulence
- Hyper Beam accuracy globally 100
- Work Up added to current Champions Pidgeot movepool

After this correction, earlier judgments that treated the redesign as merely “bulkier No Guard Pidgeot” were discarded.

---

## 3. Main blind identity after the correction

The analyst's working identity changed from “fast immediate special attacker” to:

> **bulky/mid-speed field anchor + special attacker + speed-control option, with situational setup and a globally symmetric field rule.**

The main reason was not 112 SpA or raw bulk alone. The combination of:

- 83/99/88 defensive bases,
- removal of the holder's Flying-derived Rock/Electric/Ice weaknesses,
- Tailwind,
- Protect/Roost/U-turn utility,
- Work Up,
- field-wide partner/opponent interactions,
- and weather coexistence

created a different board role from official Mega Pidgeot.

The analyst repeatedly cautioned that “no natural type weakness while turbulence is active” does **not** mean wall-like invulnerability. Strong neutral STAB, double-targeting, setup denial and speed modes remain important.

---

## 4. Spread hypotheses and how engine evidence changed them

Three declared Champions SP families were used:

- S1: Modest 32 HP / 32 SpA / 2 SpD -> 190 HP / 180 SpA / 124 Spe
- S2: Modest 3 HP / 32 SpA / 31 Spe -> 161 HP / 180 SpA / 155 Spe
- S3: Timid 2 HP / 32 SpA / 32 Spe -> 160 HP / 164 SpA / 171 Spe

### Early prior

The analyst initially favored S1 strongly: if Pidgeot could set its own Tailwind, 124 x 2 appeared sufficient to outrun ordinary unboosted M-A speed tiers, allowing most Speed SP to be converted to HP.

### Update 1 — S2 has a distinct same-turn tempo role

Engine evidence E03 showed that 155 Speed is not merely a cosmetic breakpoint. Against neutral max-speed Garchomp 154:

- S2 Pidgeot moves first, sets Tailwind, then its slower Pelipper immediately benefits in the same turn and acts before Garchomp.
- S1 lets Garchomp act before Pidgeot sets Tailwind.

Thus S1 and S2 were frozen as genuinely different functional families rather than one simply dominating the other.

### Update 2 — Tailwind does not solve boosted-speed modes

The early statement that “Tailwind basically solves Pidgeot's speed problem” was explicitly withdrawn.

White Herb + Unburden Sneasler is a real M-A pattern. After Close Combat consumes White Herb:

- neutral/max common Sneasler can reach 344 under Unburden;
- Jolly max reaches 378;
- custom max-Timid Pidgeot reaches only 342 under Tailwind;
- official max-Timid Mega Pidgeot reaches 380 under Tailwind.

Final engine evidence E06 confirmed the resulting action-order split: official Mega Pidgeot moves before and KOs the Jolly Unburden Sneasler, while custom Mega Pidgeot is hit first and faints.

Frozen analyst interpretation: base 104 Speed creates a real ceiling that Speed investment cannot fully repair in at least one important existing M-A speed mode.

---

## 5. Defensive field value: benefit, but not free advantage

The analyst initially became very bullish when Strong Winds was correctly included, because Electric/Rock/Ice targeting into Pidgeot and allied Flying Pokémon can lose one super-effective component.

Later evidence refined this substantially.

### Confirmed externality

E01/E05 show a synthetic but explicit Pelipper/Rotom-W threshold where the same Thunderbolt changes from a KO without Wingtip to survival with Wingtip. This confirmed that the field rule changes actual HP damage, not only effectiveness text.

### Resource-versus-tempo update

E02 compared custom Pidgeot with Mega Dragonite under the same opening pressure. Wingtip kept Pelipper alive and allowed its Hurricane to nearly remove Sneasler, but preserving that Pelipper later required a switch and cost Kingambit an attacking turn; Pidgeot itself also ended the second turn much lower than Mega Dragonite.

Frozen analyst interpretation:

> Wingtip can convert a would-be KO into an extra action / preserved Pokémon resource, but that is not automatically net tempo or a better total position. The value depends on what the surviving resource does next and what action is spent preserving it.

This directly replaced earlier looser language such as “the ability effectively gives free turns.”

---

## 6. Existing counterplay judged most important

The analyst's final blind view was that the main counterplay is **not** “bring Electric/Rock/Ice coverage.” Those are precisely the attacks whose normal Flying-targeting role is altered.

More relevant existing answers include:

- strong neutral damage;
- double-targeting;
- Fake Out / flinch-based denial;
- Encore/Taunt and other action denial;
- boosted-speed modes such as Unburden;
- forcing Protect/switch decisions;
- exploiting that Normal/Flying is only neutral, not resistant, to Fighting;
- attacking the supporting partner / exploiting the cost of preserving a newly surviving resource;
- opponent-side exploitation of the same global field rule.

A recurring example was Sneasler + Kingambit style pressure. The analyst emphasized that this is useful balance evidence because these are already central M-A pieces rather than narrow custom-only counters.

---

## 7. Work Up hypothesis and update

### Early prior

Once the correct bulk/Strong Winds interaction was understood, the analyst initially worried Pidgeot might too easily obtain `Tailwind -> Work Up / Roost / attack` sequences.

### Engine update

Final evidence E07/E08 changed that view:

- Friend Guard Maushold reduces damage but Follow Me (+2) does not stop Sneasler Fake Out (+3) from flinching Pidgeot before Work Up.
- Armor Tail Farigiraf can remove the Fake Out line and permit Work Up.
- Armor Tail does not solve ordinary double-target damage; Close Combat + Kowtow Cleave can still KO the Pidgeot while it attempts setup.

Frozen analyst interpretation:

> Work Up has plausible payoff and specific support structures, but current evidence supports it more as a situational win condition / set branch than as an automatic default game plan.

The analyst did **not** conclude Work Up is weak; only that setup is not free and support modes solve different problems.

---

## 8. Weather / partner hypotheses and updates

### Rain

Rain was treated as a useful control environment because real M-A Pelipper/Basculegion/Archaludon/Mega Dragonite structures exist.

Historical analyst prior: Rain is likely a natural but not uniquely revealing home because rain already guarantees Hurricane accuracy and can reduce the value of Pidgeot's Heat Wave. If custom Pidgeot performs only as “another Hurricane + Tailwind Mega” there, Mega Dragonite is an important incumbent comparison.

### Sun / weather-flex

A non-obvious blind discovery was that turbulence coexists with ordinary weather. This removes the normal Sun penalty to Hurricane while allowing Sun-boosted Heat Wave to coexist with guaranteed wind accuracy.

Patrick Cheng's real Indianapolis roster supplied an especially relevant component set: Choice Scarf Compound Eyes Vivillon + Drought Torkoal + Basculegion + Farigiraf + Mega options.

Engine evidence E09 verified one controlled part of this concept: under Sun, Wingtip allowed the test Vivillon to survive Rock Slide where the no-Wingtip control fainted. A Tailwind difference in the same fixed-seed branch was caused by Rock Slide flinch and was explicitly not attributed to Wingtip.

Frozen analyst view: weather-flex / Sun compatibility remained one of the most interesting emergent team directions, but the blind evidence did **not** establish that it is an optimized or superior archetype.

### Wind accuracy partner ecosystem

The analyst originally worried that global wind accuracy might unlock many new partner sets. A movepool legality scan reduced that expectation: several especially powerful/low-accuracy Storm/Aeroblast options are not current M-A legal. The final prior was therefore:

> outside Pidgeot itself and a few weather-conflict cases, the wind-accuracy half is more likely to remove variance than to create a broad new class of partners.

This remained an inference, not a tournament result.

---

## 9. Symmetry / opponent-side benefit

A major blind theme was that Wingtip is not a one-sided buff.

Final evidence E11 verifies the defensive side: while Wingtip is active, an opposing Mega Charizard Y also loses one Rock weakness component, changing the Rock interaction from x4 to x2.

By canonical rule, opponent wind moves also gain the accuracy guarantee.

Frozen analyst interpretation:

> the design creates a shared ruleset that the Pidgeot team can prebuild around, rather than a purely owner-side defensive ability. Rational opponents may sometimes prefer Pidgeot to remain active because it improves their own wind move reliability or Flying survivability.

This was considered an important balancing cost and a source of matchup-dependent Mega/bring decisions.

---

## 10. U-turn / field-duration hypothesis

Official Mega Pidgeot commonly values U-turn as a low-cost momentum move. The analyst identified a redesign-specific tension:

- Wingtip exists only while the holder remains active;
- early U-turn can remove allied wind accuracy / Flying protection before later actions resolve;
- a later/slower U-turn can preserve the field rule for earlier actions and only then pivot.

E10 engine evidence verified the defensive timing component: after early U-turn, a later Electric attack regained its Flying super-effective component against the ally; when Pidgeot stayed active, that component remained suppressed.

Frozen analyst interpretation: U-turn is no longer automatically a low-cost staple; Speed can affect not only who moves first but how long Wingtip remains active within the turn.

This was treated as an emergent gameplay interaction, not as proof U-turn is bad.

---

## 11. Mega timing and vulnerable pre-Mega state

Implementation tests verified that when an already-active base Pidgeot selects Mega Evolution, Mega Evolution and Wingtip activation occur before normal moves, and Gen 9/Champions dynamic speed ordering uses the Mega form's new Speed for that turn.

Historical analyst inference preserved for later testing:

> a Pidgeot that has not Mega Evolved and switches in from the back does not yet provide Wingtip during the switch-in action, so the base form creates a potentially meaningful pre-Mega tempo/defensive tax. This may encourage leading it or Mega Evolving early.

This was not promoted to a final strength conclusion from one scripted matchup.

---

## 12. Multiple Mega candidates and base-form opportunity cost

The analyst initially noted that M-A permits a six-Pokémon roster to hold multiple Mega Stones even though only one Mega can evolve in a battle; top public teams used this directly.

Early optimistic hypothesis: custom Pidgeot might be valuable as a matchup-specific secondary Mega branch rather than needing to be the default Mega every game.

E04 materially narrowed that hypothesis using the NAIC champion Charizard Y + Aerodactyl roster structure:

- when Charizard Y is chosen as the Mega, base Aerodactyl still contributes very high Speed, Tailwind and Wide Guard;
- the substituted base Pidgeot does not reproduce that floor;
- the engine comparison demonstrated both Wide Guard role compression and same-turn Tailwind speed value that base Pidgeot lacked.

Frozen analyst interpretation:

> Pidgeot can still be a preview-level alternative Mega, but it is not an Aerodactyl-style “comfortable co-bring even when not Mega” option. A roster choosing Pidgeot often incurs a stronger pressure to actually Mega Evolve it if it is brought.

This was treated as a real roster/Mega-slot opportunity cost.

---

## 13. Official Mega Pidgeot vs custom redesign

The final blind comparison was not “custom is strictly stronger.” The redesign trades axes.

Supported change in identity:

- Official: more self-contained, much faster, stronger immediate special attack, No Guard reliability.
- Custom: lower immediate SpA/Speed, more bulk, field-wide externalities, weather coexistence, Work Up branch, team/opponent rule manipulation.

E05 directly demonstrates an ally effect the official form does not provide.
E06 directly demonstrates a speed matchup the official form wins and the custom form loses.

Frozen analyst interpretation: the redesign creates a genuinely different play pattern rather than simply adding power to the official set.

---

## 14. Hyper Beam: separate environment variable

The global Hyper Beam change (90 -> 100 accuracy) is not conditional on Pidgeot or Wingtip.

Public high-placement M-A teams already use Pixilate Sylveon Hyper Beam, so this patch can affect the environment even in games where Pidgeot is absent.

Historical calculations also suggested existing Hyper Beam users can be meaningful neutral-pressure tools against Pidgeot itself; however no dedicated 90-vs-100 competitive engine A/B was frozen because the direct rule change is reliability rather than damage.

Frozen analyst requirement for final attribution:

> do not attribute all effects of global Hyper Beam 100 to Wingtip or to Pidgeot's own on-field power. Treat it as a separate rules-package variable.

---

## 15. Limited singles blind interpretation

No singles tier conclusion was frozen.

The analyst's qualitative prior was that the custom form is **not** simply “official Mega Pidgeot but better” in Gen 7 OU:

- custom max-Timid Speed 337 is far below official 375 and loses important speed matchups;
- singles cannot exploit simultaneous ally protection/accuracy support;
- Stealth Rock still removes 25% because Strong Winds does not change hazard damage;
- in exchange, the custom form may have a different bulky progress/setup profile because of Wingtip self-protection, Roost, Work Up and better defenses.

This remained a cross-format hypothesis only. No custom Gen 7 engine team or optimized set was run.

---

## 16. Frozen prior strength assessment before independent review

This is the prior analyst's own evaluative conclusion, intentionally excluded from the neutral reviewer packet.

### M-A

The analyst's final pre-independent-review range was approximately:

> **clearly competitively plausible / viable, with a credible path to being strong, but current deterministic evidence is insufficient to call it top-tier or broken.**

Reasons pulling the judgment upward:

- Wingtip creates real ally survival/action thresholds rather than cosmetic text;
- multiple functional SP families exist;
- same-turn Tailwind tempo can matter;
- weather coexistence creates interactions official Mega Pidgeot cannot reproduce;
- the design changes board decisions and resource flow, not only damage;
- the custom form shows a genuine role distinct from official Mega Pidgeot and Mega Dragonite.

Reasons preventing a top-tier/broken conclusion:

- lower Speed and SpA are meaningful, not cosmetic;
- important boosted-speed modes remain above even max-Timid Tailwind custom Pidgeot;
- strong neutral damage / double targeting / Fake Out / setup denial remain existing answers;
- Work Up is not free;
- symmetric Wingtip effects can benefit opponents;
- preserving an ally via Wingtip can trade against immediate tempo or Pidgeot's own HP;
- the base form is a real cost in multi-Mega roster structures;
- deterministic probes are not ladder/tournament win rates and synthetic SPs are not optimized tournament spreads.

The analyst expected the most likely mature identity to be some mixture of **field anchor / special attacker / Tailwind control**, with Work Up as a situational branch rather than the sole identity. It was left unresolved whether the strongest mature home would be weather-flex, ordinary balance, or another structure not represented by the limited probes.

### Gen 7 OU

No strength tier was frozen. The analyst expected a substantially different profile from M-A and from official Mega Pidgeot, but considered the evidence insufficient to choose between “bulky niche”, “meaningfully viable”, or weaker outcomes.

---

## 17. Historical hypothesis outcome map

This is a record of the original analyst's updates, not a neutral fact list.

- Preregistered “field/action-space ability helps 64 more” -> structurally supported by the M-A evidence; not a cross-format win-rate claim.
- Preregistered “Normal STAB may become meaningful” -> partially supported at design level by global 100% Hyper Beam, but no dedicated final engine value test establishes optimal usage.
- Preregistered “role compression matters more than raw damage” -> partially supported; field value/Tailwind/utility matter, but four-moveslot pressure and Mega/base-form costs prevent free compression.
- Early “bulky S1 probably default” -> weakened; S2 has a distinct same-turn tempo function.
- Early “Tailwind largely fixes speed” -> refuted for important boosted-speed modes, especially White Herb/Unburden Sneasler.
- Early concern “Work Up may obtain too many free turns” -> weakened; support can create setup turns but existing denial/double-target counterplay remains.
- Early optimism “secondary Mega option may be cheap” -> weakened substantially by Aerodactyl base-form comparison.
- Early concern “wind accuracy may create many new partner sets” -> weakened by current M-A move legality; likely more variance removal than broad role creation, with weather-conflict exceptions.
- “Symmetric field rule is a real cost” -> supported mechanically and by opponent-side Charizard effectiveness probe.
- “U-turn has a redesign-specific field-duration cost” -> supported for the defensive timing component.

---

## 18. What must happen next

1. Keep this file hidden from the independent blind reviewer.
2. Give the reviewer only the neutral manifest/protocol/raw evidence and direct sources.
3. Freeze the reviewer's full blind report before revealing designer intent.
4. Audit the independent report for factual/source/engine misreads without steering its competitive judgment.
5. Only after the independent report is frozen, reveal the designer's intent verbatim.
6. Compare: designer intent vs raw evidence vs prior analyst blind freeze vs independent blind review.
7. Run only targeted post-intent tests that answer an actual unresolved discrepancy; do not reopen unlimited M-A scenario mining.
8. For the final synthesis, use a high-reasoning model if available. The user can access GPT Work high/max-style reasoning with scarce quota and Claude Opus 5 Extra/Max. Preserve raw evidence and zero-leading inputs; use the scarce highest-reasoning pass for final synthesis rather than routine execution.
