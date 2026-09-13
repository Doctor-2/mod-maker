# Exact commands

Run in order. `$PS` is the pokemon-showdown checkout, `$BUNDLE` is this directory.
`run.sh` executes all of it unattended.

```
git clone --depth 1 --branch v0.11.11 https://github.com/smogon/pokemon-showdown.git ps
cd ps
git checkout v0.11.11                    # already at the tag from the shallow clone
npm ci
cp -R $BUNDLE/showdown_overlay/. .
npm run build
npx mocha test/sim/abilities/wingtipvortex.js
```

## Results

| command | result |
| --- | --- |
| `git clone --depth 1 --branch v0.11.11 …` | `739a5e1` — "Bump package.json version to v0.11.11 (#12203)" |
| `git checkout v0.11.11` | `git describe --tags` → `v0.11.11` |
| `npm ci` | exit 0 |
| `cp -R showdown_overlay/. .` | 6 files added, 0 existing files modified (see `overlay.diff`) |
| `npm run build` | exit 0 |
| `npx mocha test/sim/abilities/wingtipvortex.js` | **2375 passing, 67 pending, 0 failing** |

`.mocharc.json` sets `spec` to the whole suite, so passing a filename adds to that list
instead of narrowing it — the command above runs everything, which is how we know the
overlay causes no regressions. The new file on its own:

```
npx mocha --no-config --no-package test/sim/abilities/wingtipvortex.js --reporter spec
```

→ **19 passing, 0 failing** (`test-output.txt`).

## Extra checks (not requested, run to confirm the overlay is clean)

```
npx tsc                                                    # exit 0
npx eslint data/mods/championsregmapidgeot config/custom-formats.ts \
           test/sim/abilities/wingtipvortex.js             # exit 0
node $BUNDLE/verify.js                                     # verify.txt
```

## Iterations along the way

Three failures came up and were corrected; none of them changed the specified design.

1. `Format "[Gen 9 Champions] VGC 2026 Reg M-A + Custom Mega Pidgeot" has a name longer
   than 50 characters` — thrown by `sim/dex-formats.ts:812`. The requested name is 56
   characters and cannot exist in this engine version. Renamed to
   `[Gen 9 Champions] VGC 2026 Reg M-A + Mega Pidgeot` (49). See README.
2. The first filler Pokémon in the validation team used items and a species that the
   Champions mod marks nonstandard (Life Orb, Assault Vest, Covert Cloak, Metagross).
   Replaced with legal ones. This was a wrong test assumption, not an overlay bug —
   Pidgeot + Pidgeotite + Work Up itself was never rejected.
3. `npx tsc` rejected `onAnyEffectivenessPriority` (not declared, though the runtime
   honours any `on<Event>Priority` key) and the bare `FormatList` type that
   `config/formats.ts`'s own instructions suggest. Dropped the inert priority and used
   the `import('../sim/dex-formats').FormatList` form that `config/formats.ts` itself uses.
   `assert.hasAbility` was also swapped for a plain equality check, because it depends on
   a global that only exists when `test/main.js` is loaded.

## Clean-machine reproduction

`run.sh` was then run end to end against a fresh clone in an empty directory — clone,
checkout, `npm ci`, overlay, build, test, validate — and finished with exit 0:

* `npx mocha test/sim/abilities/wingtipvortex.js` → **2375 passing, 67 pending, 0 failing**
* `node verify.js` → team `VALID: no problems reported`
* `git status` in the fresh checkout shows the six overlay files added and nothing else
  changed against the `v0.11.11` tree.

## v4.1 — wind rule corrected

v4 read "guarantees the normal accuracy check" as *restoring* a wind move's ordinary
accuracy. The canonical rule is that wind-flagged moves **always hit**. The
`onAnyModifyMove` handler was replaced with No Guard's accuracy-event pattern narrowed to
the wind flag, and the wind tests were rewritten around it.

The rewritten tests drive `createBattle({ forceRandomChance: false, … })`, which forces
every `randomChance` roll to fail. Any move that still lands never rolled — which is what
"always hits" means — so the assertions are exact rather than probabilistic. Under v4's
behaviour every one of them fails.

Re-run after the change:

```
cp -R $BUNDLE/showdown_overlay/. .
npm run build
npx mocha test/sim/abilities/wingtipvortex.js                       # 2382 passing, 0 failing
npx mocha --no-config --no-package test/sim/abilities/wingtipvortex.js   # 26 passing
npx tsc                                                             # exit 0
npx eslint data/mods/championsregmapidgeot config/custom-formats.ts \
           test/sim/abilities/wingtipvortex.js                      # exit 0
node $BUNDLE/verify.js                                              # team VALID
```

Two Mega-turn timing tests were added at the same time. Both pass against the engine as
shipped: Mega Evolution resolves before every move in the turn, so the vortex is up
before a faster attacker connects, and the turn's move order is re-sorted using the Mega
forme's Speed (Pidgeot 121 < Garchomp 122 < Mega Pidgeot 124 at level 50, no investment).
