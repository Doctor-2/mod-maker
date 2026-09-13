# pidgeot_blind_bundle_v4 — v4.1

Custom Mega Pidgeot for Pokémon Showdown `v0.11.11`, built as a mod overlay on top of
`[Gen 9 Champions] VGC 2026 Reg M-A`.

```
showdown_overlay/     files copied verbatim into the pokemon-showdown repo root
run.sh                clone → checkout → npm ci → overlay → build → test → validate
verify.js             format + team validation, and a scope check on the stock formats
results/              exact commands, the overlay diff, and all captured output
```

## v4.1 correction

v4 implemented the wind rule as "restore the move's ordinary accuracy", which left
Hurricane at 70% in rain and in sun and Blizzard at 70% in snow. That was wrong. The
canonical rule is:

> Wingtip Vortex makes every move with Showdown's built-in `wind` flag **always hit**
> while a Wingtip Vortex holder is active. It is global — it benefits either side, not
> only Mega Pidgeot and its allies.

It is now implemented with No Guard's accuracy-event pattern, narrowed to the wind flag:

```ts
onAnyAccuracy(accuracy, target, source, move) {
	if (move?.flags['wind']) return true;
},
```

It is an accuracy guarantee only. There is deliberately **no** `onAnyInvulnerability`
counterpart, so it does not carry moves through Fly/Dig/Dive — a wind move that normally
reaches an airborne target (Gust, Twister, Hurricane) still does, and one that doesn't
(Blizzard) still doesn't. There is a test for exactly that. Nothing else changed: the
Flying-component weakness reduction and weather coexistence are untouched.

## The input bundle was not present

The task named `pidgeot_blind_bundle_v4` as its input, but no such directory existed in
the session that produced v4 — no overlay sources, and no
`test/sim/abilities/wingtipvortex.js`. Both were written from the task's rule list. That
reconstruction is what produced the wind-rule error above; the remaining known deviation
from the original request is the format name:

**The format name is 6 characters over the engine limit.** `sim/dex-formats.ts:812`
throws on any format name longer than 50 characters, and
`[Gen 9 Champions] VGC 2026 Reg M-A + Custom Mega Pidgeot` is 56. The format is
registered as `[Gen 9 Champions] VGC 2026 Reg M-A + Mega Pidgeot` (49). Name only —
confirmed harmless.

## How each rule is implemented

| Rule | Where |
| --- | --- |
| Mega Pidgeot = Normal/Flying, 83/93/99/112/88/104 | `data/mods/championsregmapidgeot/pokedex.ts` |
| Wingtip Vortex only while the holder is active | ability `onAny*` handlers — they stop firing the moment the holder leaves, faints, or is suppressed |
| Reproduces Delta Stream's Flying-component weakness reduction, globally | `onAnyEffectiveness`, same shape as the `deltastream` weather condition |
| Coexists with normal weather | the effect lives on the ability, **not** on a weather; there is no `setWeather` and no `onAnySetWeather` block, so rain/sun/sand/snow behave normally |
| Wind-flagged moves always hit, globally | `onAnyAccuracy` returning `true`, No Guard's pattern narrowed to the wind flag |
| Hyper Beam accuracy 100, globally | `moves.ts` — a data change, so it applies to every Pokémon in the mod |
| Pidgeot gains Work Up | `scripts.ts` `init()` |

Two implementation notes:

* **Why the reduction is not a weather.** Delta Stream puts its `onEffectiveness` on the
  `deltastream` weather. Copying that would make the effect mutually exclusive with rain
  and sun, contradicting "coexists with normal weather", and would leave it up after the
  holder left. Running it off the ability satisfies both rules at once.
* **Work Up needed two changes.** The Champions mod marks Work Up `isNonstandard: "Past"`,
  so putting it in Pidgeot's learnset alone would not make it usable; `moves.ts` sets
  `isNonstandard: null`. No other legal species in the mod learns it, so nothing else
  gains access — `results/verify.txt` prints the full list of legal learners (`Pidgeot`).
  The learnset entry is added in `init()` rather than in a `learnsets.ts` file because mod
  data entries merge shallowly: a partial `learnset` object would replace Pidgeot's entire
  movepool.

## Undecided on purpose

Wingtip Vortex is currently an ordinary ability for these interactions, which means
Neutralizing Gas and Gastro Acid suppress it and Trace / Skill Swap / Role Play / Receiver
can move it. Neither behaviour has been ruled on; nothing in the code special-cases them
either way, so deciding later is a local change.

## Results

* `npx mocha test/sim/abilities/wingtipvortex.js` → **2382 passing, 0 failing**. That
  command runs the full suite (see `results/commands.md`), so the overlay demonstrably
  causes no regressions. The 26 tests in this file on their own also pass.
* Step 8: the team in `verify.js` — Pidgeot @ Pidgeotite with Work Up, plus five legal
  partners — validates with no problems (`results/verify.txt`).
* `npx tsc` and `npx eslint` are both clean.
* The overlay adds 6 files and modifies none (`results/overlay.diff`). Stock
  `championsregma` still has canon Mega Pidgeot, Hyper Beam at 90, and Work Up as Past.

### What the tests cover

Mega stats/type/ability; no custom weather; coexistence with rain/sun/sand/snow;
the Flying-component reduction (on the holder, on a third party, only the Flying half of
a 4x matchup, not on unrelated weaknesses, and gone the moment the holder leaves);
wind moves always hitting in rain, in sun, in snow, through ±6 accuracy/evasion stages,
between two Pokémon that are neither the holder, and stopping when the holder leaves;
non-wind moves keeping their own weather and accuracy behaviour; semi-invulnerability
still blocking a wind move that never bypassed it; Hyper Beam at 100 globally; Work Up
legality; and team validation in the custom format.

Two timing tests cover the Mega Evolution turn itself:

* **Activation.** Aerodactyl outspeeds Mega Pidgeot and attacks with Rock Slide on the
  turn Pidgeot Mega Evolves. Mega Evolution resolves ahead of every move in the turn, so
  the Flying-component reduction is already up — no super effective hit. The paired test
  without Mega Evolution takes the 2x hit.
* **Speed.** At level 50 with no investment the Champions stat formula gives Pidgeot 121,
  Garchomp 122 and Mega Pidgeot 124, so the tier is decided by the Mega forme alone.
  Pidgeot moves first on the turn it Mega Evolves and second on a turn it doesn't.

## Reading this from another tool (e.g. ChatGPT)

`Doctor-2/mod-maker` is a public repo, so everything here is fetchable without
credentials. Three ways in, cheapest first:

1. **Hand over one file.** `BUNDLE_FOR_GPT.md` inlines every source file, the commands
   and the captured output in a single markdown file — paste or upload it.
2. **Give a URL to fetch.** Raw files need no auth:
   `https://raw.githubusercontent.com/Doctor-2/mod-maker/claude/gallant-euler-6mpbzy/pidgeot_blind_bundle_v4/BUNDLE_FOR_GPT.md`
   (swap the trailing path for any other file in this directory). Browse at
   `https://github.com/Doctor-2/mod-maker/tree/claude/gallant-euler-6mpbzy/pidgeot_blind_bundle_v4`.
3. **Let it run the code.** Point a tool with a shell at `run.sh`; it needs only git,
   node and network access to github and npm.
