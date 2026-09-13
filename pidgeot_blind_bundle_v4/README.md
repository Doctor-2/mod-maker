# pidgeot_blind_bundle_v4

Custom Mega Pidgeot for Pokémon Showdown `v0.11.11`, built as a mod overlay on top of
`[Gen 9 Champions] VGC 2026 Reg M-A`.

```
showdown_overlay/     files copied verbatim into the pokemon-showdown repo root
run.sh                clone → checkout → npm ci → overlay → build → test → validate
verify.js             format + team validation, and a scope check on the stock formats
results/              exact commands, the overlay diff, and all captured output
```

## The input bundle was not present

The task named `pidgeot_blind_bundle_v4` as its input, but no such directory existed in
this session — no overlay sources, and no `test/sim/abilities/wingtipvortex.js`. Rather
than stop, the overlay and the test file here were **written from the task's own
"rules that must not be silently changed" list**, which specifies the design completely
enough to implement. If the original bundle turns up, diff it against
`showdown_overlay/` before trusting this: two things below could differ from what its
author wrote.

### 1. The wind-accuracy rule has two readings

> It globally guarantees the normal accuracy check for wind-flagged moves.

Implemented as: **wind-flagged moves are held to their ordinary accuracy check**, so
weather can no longer rewrite it. Hurricane stays at 70 in rain (instead of never
missing) and at 70 in sun (instead of 50); Blizzard stays at 70 in snow. Everything
downstream of the move's accuracy still applies normally — accuracy/evasion stages,
Compound Eyes, Wide Lens, Gravity.

The other reading — wind moves simply always hit — was rejected because it guarantees
that *no* accuracy check happens, which is the opposite of guaranteeing the normal one.
It also reads as the more natural partner to "coexists with normal weather": the vortex
holds wind moves steady against weather interference. Only the sign of the
`onAnyModifyMove` handler in `abilities.ts` would change if this reading is wrong.

### 2. The format name is 6 characters over the engine limit

`sim/dex-formats.ts:812` throws on any format name longer than 50 characters.
`[Gen 9 Champions] VGC 2026 Reg M-A + Custom Mega Pidgeot` is 56, so it cannot exist in
this engine version. The format is registered as:

```
[Gen 9 Champions] VGC 2026 Reg M-A + Mega Pidgeot     (49 chars)
```

Only the name changed. Nothing about the metagame or the mechanics was touched.

## How each rule is implemented

| Rule | Where |
| --- | --- |
| Mega Pidgeot = Normal/Flying, 83/93/99/112/88/104 | `data/mods/championsregmapidgeot/pokedex.ts` |
| Wingtip Vortex only while the holder is active | ability `onAny*` handlers — they stop firing the moment the holder leaves, faints, or is suppressed |
| Reproduces Delta Stream's Flying-component weakness reduction, globally | `onAnyEffectiveness`, same shape as the `deltastream` weather condition |
| Coexists with normal weather | the effect lives on the ability, **not** on a weather; there is no `setWeather` and no `onAnySetWeather` block, so rain/sun/sand/snow behave normally |
| Guarantees the normal accuracy check for wind-flagged moves, globally | `onAnyModifyMove` restores the move's data accuracy after the move's own `onModifyMove` has applied weather |
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

## Results

* `npx mocha test/sim/abilities/wingtipvortex.js` → **2375 passing, 0 failing**. That
  command runs the full suite (see `results/commands.md`), so the overlay demonstrably
  causes no regressions. The 19 new tests on their own also pass.
* Step 8: the team in `verify.js` — Pidgeot @ Pidgeotite with Work Up, plus five legal
  partners — validates with no problems (`results/verify.txt`).
* `npx tsc` and `npx eslint` are both clean.
* The overlay adds 6 files and modifies none (`results/overlay.diff`). Stock
  `championsregma` still has canon Mega Pidgeot, Hyper Beam at 90, and Work Up as Past.

## Reading this from another tool (e.g. ChatGPT)

`Doctor-2/mod-maker` is a public repo, so everything here is fetchable without
credentials. Three ways in, cheapest first:

1. **Hand over one file.** `BUNDLE_FOR_GPT.md` inlines every source file, the commands
   and the captured output in a single ~32 KB markdown file — paste or upload it.
2. **Give a URL to fetch.** Raw files need no auth:
   `https://raw.githubusercontent.com/Doctor-2/mod-maker/claude/gallant-euler-6mpbzy/pidgeot_blind_bundle_v4/BUNDLE_FOR_GPT.md`
   (swap the trailing path for any other file in this directory). Browse at
   `https://github.com/Doctor-2/mod-maker/tree/claude/gallant-euler-6mpbzy/pidgeot_blind_bundle_v4`.
3. **Let it run the code.** Point a tool with a shell at `run.sh`; it needs only git,
   node and network access to github and npm.
