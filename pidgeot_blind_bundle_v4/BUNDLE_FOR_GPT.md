# Custom Mega Pidgeot — complete bundle (single file)

Everything needed to reproduce this work, inlined so it can be pasted or uploaded in one
go. Target: Pokémon Showdown at tag `v0.11.11`. Every file under `showdown_overlay/` is
copied into the pokemon-showdown repo root, preserving paths; the overlay adds six files
and modifies none.

Canonical copy: https://github.com/Doctor-2/mod-maker/tree/claude/gallant-euler-6mpbzy/pidgeot_blind_bundle_v4

## Design rules implemented

- Mega Pidgeot = Normal/Flying, 83/93/99/112/88/104.
- Wingtip Vortex is active only while the ability holder is active.
- It globally reproduces Delta Stream's Flying-component weakness reduction.
- It coexists with normal weather.
- It globally guarantees the normal accuracy check for wind-flagged moves.
- Hyper Beam accuracy is 100 globally.
- Pidgeot gains Work Up.

## Reproduce

```
git clone --depth 1 --branch v0.11.11 https://github.com/smogon/pokemon-showdown.git ps
cd ps && git checkout v0.11.11 && npm ci
cp -R <bundle>/showdown_overlay/. .
npm run build
npx mocha test/sim/abilities/wingtipvortex.js
```




## `README.md`

```markdown
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
```

## `run.sh`

```bash
#!/usr/bin/env bash
# Reproduces the entire run from a clean machine.
#   usage: ./run.sh [workdir]      (default: <bundle>/.work)
set -euo pipefail

BUNDLE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORK="${1:-$BUNDLE/.work}"
mkdir -p "$WORK"
cd "$WORK"

# 1. clone + 2. checkout the tag
[ -d pokemon-showdown ] || git clone --depth 1 --branch v0.11.11 https://github.com/smogon/pokemon-showdown.git
cd pokemon-showdown
git checkout v0.11.11

# 3. install
npm ci

# 4. apply the overlay, preserving paths
cp -R "$BUNDLE/showdown_overlay/." .

# 5. build
npm run build

# 6. mechanics tests
#    NOTE: .mocharc.json already lists test/sim/**/*.js, so naming the file *adds* to that
#    list rather than narrowing it: this runs the whole suite (2375 passing). To run only
#    the new file: npx mocha --no-config --no-package test/sim/abilities/wingtipvortex.js
npx mocha test/sim/abilities/wingtipvortex.js

# 8. format + team validation, and a check that nothing leaked into the stock formats
node "$BUNDLE/verify.js"
```

## `verify.js`

```js
'use strict';
// Step 8 + scope check. Run from the pokemon-showdown repo root, after `npm run build`:
//   node /path/to/pidgeot_blind_bundle_v4/verify.js

const path = require('path');
// resolved against the cwd, so this runs from the pokemon-showdown root wherever it was cloned
const { Dex, Teams } = require(path.resolve(process.cwd(), 'dist/sim'));
const { TeamValidator } = require(path.resolve(process.cwd(), 'dist/sim/team-validator'));

const FORMAT = '[Gen 9 Champions] VGC 2026 Reg M-A + Mega Pidgeot';
const BASE_FORMAT = '[Gen 9 Champions] VGC 2026 Reg M-A';

const team = [
	{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['workup', 'hyperbeam', 'hurricane', 'roost'], nature: 'Modest' },
	{ species: 'Snorlax', ability: 'immunity', item: 'leftovers', moves: ['bodyslam', 'crunch', 'protect', 'curse'], nature: 'Adamant' },
	{ species: 'Tyranitar', ability: 'sandstream', item: 'focussash', moves: ['rockslide', 'crunch', 'protect', 'dragondance'], nature: 'Jolly' },
	{ species: 'Gardevoir', ability: 'synchronize', item: 'sitrusberry', moves: ['psychic', 'moonblast', 'protect', 'trickroom'], nature: 'Modest' },
	{ species: 'Skarmory', ability: 'keeneye', item: 'choicescarf', moves: ['bravebird', 'ironhead', 'protect', 'tailwind'], nature: 'Jolly' },
	{ species: 'Azumarill', ability: 'thickfat', item: 'lumberry', moves: ['aquajet', 'playrough', 'protect', 'bellydrum'], nature: 'Adamant' },
];

function heading(text) {
	console.log(`\n=== ${text} ===`);
}

heading('format');
const format = Dex.formats.get(FORMAT);
console.log(`name:     ${format.name} (${format.name.length} chars, engine limit is 50)`);
console.log(`mod:      ${format.mod}`);
console.log(`gameType: ${format.gameType}`);
console.log(`ruleset:  ${format.ruleset.join(', ')}`);

heading('step 8: team validation');
console.log(Teams.export(team));
const problems = TeamValidator.get(FORMAT).validateTeam(team);
console.log(problems ? `REJECTED:\n${problems.join('\n')}` : 'VALID: no problems reported');

heading('Mega Pidgeot, this format vs. stock Reg M-A');
for (const modid of [format.mod, Dex.formats.get(BASE_FORMAT).mod]) {
	const species = Dex.mod(modid).species.get('Pidgeot-Mega');
	const s = species.baseStats;
	console.log(`${modid.padEnd(24)} ${species.types.join('/')} ${s.hp}/${s.atk}/${s.def}/${s.spa}/${s.spd}/${s.spe}  ability: ${species.abilities['0']}`);
}

heading('Hyper Beam accuracy');
for (const modid of [format.mod, 'championsregma', 'champions', 'gen9']) {
	console.log(`${modid.padEnd(24)} ${Dex.mod(modid).moves.get('hyperbeam').accuracy}`);
}

heading('Work Up');
for (const modid of [format.mod, 'championsregma']) {
	const dex = Dex.mod(modid);
	const learners = dex.species.all()
		.filter(s => !s.isNonstandard && s.tier !== 'Illegal')
		.filter(s => dex.species.getLearnsetData(s.id).learnset?.workup)
		.map(s => s.name);
	console.log(`${modid.padEnd(24)} isNonstandard: ${JSON.stringify(dex.moves.get('workup').isNonstandard)}  legal learners: ${learners.length ? learners.join(', ') : '(none)'}`);
}
```

## `showdown_overlay/data/mods/championsregmapidgeot/scripts.ts`

```ts
export const Scripts: ModdedBattleScriptsData = {
	inherit: 'championsregma',
	gen: 9,
	init() {
		// Pidgeot gains Work Up.
		// Learnsets can't use `inherit: true` for this: mod entries are merged shallowly,
		// so a partial `learnset` object would replace Pidgeot's entire movepool.
		this.modData('Learnsets', 'pidgeot').learnset.workup = ['9M'];
	},
};
```

## `showdown_overlay/data/mods/championsregmapidgeot/pokedex.ts`

```ts
export const Pokedex: import('../../../sim/dex-species').ModdedSpeciesDataTable = {
	pidgeotmega: {
		inherit: true,
		types: ["Normal", "Flying"],
		baseStats: { hp: 83, atk: 93, def: 99, spa: 112, spd: 88, spe: 104 },
		abilities: { 0: "Wingtip Vortex" },
	},
};
```

## `showdown_overlay/data/mods/championsregmapidgeot/abilities.ts`

```ts
export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	wingtipvortex: {
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Wingtip Vortex');
		},

		// Delta Stream's Flying-component weakness reduction, reproduced globally.
		// Delta Stream implements this on the `deltastream` *weather* condition; doing the same
		// here would make the effect exclusive with rain/sun/sand/snow. Running it off the
		// ability instead keeps normal weather untouched, and makes the effect last exactly as
		// long as the holder is active (ability handlers stop firing the moment it leaves,
		// faints, or is suppressed) rather than lingering as a field condition.
		// Delta Stream's condition carries onEffectivenessPriority -1. There is no declared
		// type for the onAny form of that key, and the order is inert here anyway: both
		// handlers return 0 on the same matchups, so whichever runs first leaves typeMod at 0.
		onAnyEffectiveness(typeMod, target, type, move) {
			if (move && move.effectType === 'Move' && move.category !== 'Status' && type === 'Flying' && typeMod > 0) {
				this.add('-fieldactivate', 'ability: Wingtip Vortex');
				return 0;
			}
		},

		// The normal accuracy check is guaranteed for wind-flagged moves, globally.
		// Weather rewrites the accuracy of several wind moves in their own `onModifyMove`
		// (Hurricane: never misses in rain, 50 in sun; Blizzard: never misses in snow/hail;
		// Bleakwind/Sandsear/Wildbolt Storm: never miss in rain). That handler runs in the
		// `singleEvent` at battle-actions.ts:431, before this one at :439, so restoring the
		// move's data accuracy here puts the move back on its ordinary accuracy check.
		// Everything downstream of `move.accuracy` still applies normally: accuracy/evasion
		// stages, Compound Eyes, Wide Lens, Gravity.
		onAnyModifyMove(move) {
			if (!move.flags['wind']) return;
			const baseAccuracy = this.dex.moves.get(move.id).accuracy;
			if (move.accuracy !== baseAccuracy) move.accuracy = baseAccuracy;
		},

		flags: {},
		name: "Wingtip Vortex",
		rating: 4,
		num: 1001,
		shortDesc: "Flying weaknesses are neutralized and wind moves take their normal accuracy check, globally.",
	},
};
```

## `showdown_overlay/data/mods/championsregmapidgeot/moves.ts`

```ts
export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	// Hyper Beam accuracy is 100 globally.
	hyperbeam: {
		inherit: true,
		accuracy: 100,
	},
	// Work Up is Past in the Champions mod, which would make it unusable even once it is
	// in Pidgeot's learnset. No other Champions-legal species learns it (see
	// results/verify.txt), so this only enables it for Pidgeot.
	workup: {
		inherit: true,
		isNonstandard: null,
	},
};
```

## `showdown_overlay/config/custom-formats.ts`

```ts
export const Formats: import('../sim/dex-formats').FormatList = [
	{
		section: "Custom Mega Pidgeot",
	},
	{
		name: "[Gen 9 Champions] VGC 2026 Reg M-A + Mega Pidgeot",
		desc: `[Gen 9 Champions] VGC 2026 Reg M-A, with Mega Pidgeot rebuilt around Wingtip Vortex.`,
		mod: 'championsregmapidgeot',
		gameType: 'doubles',
		bestOfDefault: true,
		ruleset: ['Flat Rules', 'VGC Timer', 'Open Team Sheets'],
	},
	{
		name: "[championsregmapidgeot] Custom Game",
		mod: 'championsregmapidgeot',
		searchShow: false,
		challengeShow: false,
		debug: true,
		battle: { trunc: Math.trunc },
		ruleset: ['Team Preview', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 50'],
	},
	{
		name: "[championsregmapidgeot] Doubles Custom Game",
		mod: 'championsregmapidgeot',
		gameType: 'doubles',
		searchShow: false,
		challengeShow: false,
		debug: true,
		battle: { trunc: Math.trunc },
		ruleset: ['Team Preview', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 50'],
	},
];
```

## `showdown_overlay/test/sim/abilities/wingtipvortex.js`

```js
'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

const mod = common.mod('championsregmapidgeot');
const FORMAT = '[Gen 9 Champions] VGC 2026 Reg M-A + Mega Pidgeot';

/**
 * Every `-supereffective` line the battle has emitted, as `<target>|<degree>`,
 * where degree is 1 for 2x and 2 for 4x. A matchup that has been reduced to
 * neutral emits no line at all.
 */
function superEffective(b) {
	const prefix = '|-supereffective|';
	return b.log.filter(line => line.startsWith(prefix)).map(line => line.slice(prefix.length));
}

let battle;

describe('Wingtip Vortex', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should be the ability of a Normal/Flying Mega Pidgeot with 83/93/99/112/88/104 base stats', () => {
		battle = mod.createBattle([[
			{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['workup'] },
		], [
			{ species: 'Wynaut', ability: 'shadowtag', moves: ['splash'] },
		]]);
		battle.makeChoices('move workup mega', 'move splash');
		const pidgeot = battle.p1.active[0];
		assert.species(pidgeot, 'Pidgeot-Mega');
		assert.deepEqual(pidgeot.species.types, ['Normal', 'Flying']);
		assert.deepEqual(pidgeot.species.baseStats, { hp: 83, atk: 93, def: 99, spa: 112, spd: 88, spe: 104 });
		assert.equal(pidgeot.ability, 'wingtipvortex');
	});

	it('should not set any weather of its own', () => {
		battle = mod.createBattle([[
			{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['workup'] },
		], [
			{ species: 'Wynaut', ability: 'shadowtag', moves: ['splash'] },
		]]);
		battle.makeChoices('move workup mega', 'move splash');
		assert.false(battle.field.isWeather('deltastream'));
		assert.equal(battle.field.weather, '');
	});

	it('should coexist with normal weather', () => {
		battle = mod.createBattle([[
			{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['workup'] },
		], [
			{ species: 'Smeargle', ability: 'owntempo', moves: ['raindance', 'sunnyday', 'sandstorm', 'snowscape'] },
		]]);
		battle.makeChoices('move workup mega', 'move raindance');
		assert(battle.field.isWeather('raindance'), 'Rain Dance should set the weather');
		battle.makeChoices('move workup', 'move sunnyday');
		assert(battle.field.isWeather('sunnyday'), 'Sunny Day should set the weather');
		battle.makeChoices('move workup', 'move sandstorm');
		assert(battle.field.isWeather('sandstorm'), 'Sandstorm should set the weather');
		battle.makeChoices('move workup', 'move snowscape');
		assert(battle.field.isWeather('snowscape'), 'Snowscape should set the weather');
	});

	describe(`Flying-component weakness reduction`, () => {
		it('should neutralize a super effective hit on the holder', () => {
			battle = mod.createBattle([[
				{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['workup'] },
			], [
				{ species: 'Smeargle', ability: 'owntempo', moves: ['thundershock'] },
			]]);
			battle.makeChoices('move workup mega', 'move thundershock');
			assert.deepEqual(superEffective(battle), [], 'Electric should be neutral on Normal/Flying here');
		});

		it('should be the reason that hit was neutral', () => {
			// Same battle without the Mega Evolution: the reduction is gone
			battle = mod.createBattle([[
				{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['workup'] },
			], [
				{ species: 'Smeargle', ability: 'owntempo', moves: ['thundershock'] },
			]]);
			battle.makeChoices('move workup', 'move thundershock');
			assert.deepEqual(superEffective(battle), ['p1a: Pidgeot|1']);
		});

		it('should apply to Pokemon other than the ability holder', () => {
			battle = mod.createBattle({ gameType: 'doubles' }, [[
				{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['workup'] },
				{ species: 'Tornadus', ability: 'prankster', moves: ['splash'] },
			], [
				{ species: 'Smeargle', ability: 'owntempo', moves: ['discharge'] },
				{ species: 'Wynaut', ability: 'shadowtag', moves: ['splash'] },
			]]);
			// Discharge hits every adjacent Pokemon, so pure-Flying Tornadus is hit by a
			// Pokemon that is neither the ability holder nor targeting it
			battle.makeChoices('move workup mega, move splash', 'move discharge, move splash');
			assert.deepEqual(superEffective(battle), [], 'Tornadus should have taken a neutral hit');
		});

		it('should stop applying as soon as the holder is no longer active', () => {
			battle = mod.createBattle({ gameType: 'doubles' }, [[
				{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['workup'] },
				{ species: 'Tornadus', ability: 'prankster', moves: ['splash'] },
				{ species: 'Wynaut', ability: 'shadowtag', moves: ['splash'] },
			], [
				{ species: 'Smeargle', ability: 'owntempo', moves: ['discharge'] },
				{ species: 'Ditto', ability: 'limber', moves: ['splash'] },
			]]);
			battle.makeChoices('move workup mega, move splash', 'move discharge, move splash');
			assert.deepEqual(superEffective(battle), []);

			battle.makeChoices('switch 3, move splash', 'move discharge, move splash');
			assert.deepEqual(superEffective(battle), ['p1b: Tornadus|1'], 'the reduction should be gone');
		});

		it('should only reduce the Flying-type component of the matchup', () => {
			battle = mod.createBattle([[
				{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['rockslide'] },
			], [
				{ species: 'Talonflame', ability: 'flamebody', moves: ['splash'] },
			]]);
			// Rock is 4x on Fire/Flying; only the Flying half drops, so it stays 2x
			battle.makeChoices('move rockslide mega', 'move splash');
			assert.deepEqual(superEffective(battle), ['p2a: Talonflame|1']);
		});

		it('should not touch weaknesses with no Flying component', () => {
			battle = mod.createBattle([[
				{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['surf'] },
			], [
				{ species: 'Tyranitar', ability: 'sandstream', moves: ['splash'] },
			]]);
			battle.makeChoices('move surf mega', 'move splash');
			assert.deepEqual(superEffective(battle), ['p2a: Tyranitar|1']);
		});
	});

	describe(`wind-flagged move accuracy`, () => {
		/** Runs the given turns and reports the accuracy `moveid` was checked at each time. */
		function accuracyOf(moveid, teams, choices, options) {
			battle = mod.createBattle(options || {}, teams);
			const seen = [];
			battle.onEvent('Accuracy', battle.format, (accuracy, target, source, move) => {
				if (move.id === moveid) seen.push(accuracy);
				return false; // force a miss, so the rest of the turn stays quiet
			});
			for (const choice of choices) battle.makeChoices(...choice);
			return seen;
		}

		const windTeams = () => [[
			{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['raindance', 'sunnyday', 'snowscape'] },
		], [
			{ species: 'Smeargle', ability: 'owntempo', moves: ['hurricane', 'blizzard', 'thunder'] },
		]];

		it('should give Hurricane its normal accuracy check in rain', () => {
			const seen = accuracyOf('hurricane', windTeams(), [['move raindance mega', 'move hurricane']]);
			assert.deepEqual(seen, [70], 'rain should not let Hurricane skip its accuracy check');
		});

		it('should give Hurricane its normal accuracy check in sun', () => {
			const seen = accuracyOf('hurricane', windTeams(), [['move sunnyday mega', 'move hurricane']]);
			assert.deepEqual(seen, [70], 'sun should not drop Hurricane to 50 accuracy');
		});

		it('should give Blizzard its normal accuracy check in snow', () => {
			const seen = accuracyOf('blizzard', windTeams(), [['move snowscape mega', 'move blizzard']]);
			assert.deepEqual(seen, [70], 'snow should not let Blizzard skip its accuracy check');
		});

		it('should leave moves without the wind flag alone', () => {
			const seen = accuracyOf('thunder', windTeams(), [['move raindance mega', 'move thunder']]);
			assert.deepEqual(seen, [true], 'Thunder is not wind-flagged, so rain should still make it always hit');
		});

		it('should apply to wind moves between two Pokemon that are not the holder', () => {
			const seen = accuracyOf('hurricane', [[
				{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['raindance'] },
				{ species: 'Wynaut', ability: 'shadowtag', moves: ['splash'] },
			], [
				{ species: 'Smeargle', ability: 'owntempo', moves: ['hurricane'] },
				{ species: 'Ditto', ability: 'limber', moves: ['splash'] },
			]], [['move raindance mega, move splash', 'move hurricane 2, move splash']], { gameType: 'doubles' });
			assert.deepEqual(seen, [70]);
		});

		it('should stop normalizing wind moves once the holder leaves the field', () => {
			const seen = accuracyOf('hurricane', [[
				{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['raindance'] },
				{ species: 'Wynaut', ability: 'shadowtag', moves: ['splash'] },
			], [
				{ species: 'Smeargle', ability: 'owntempo', moves: ['hurricane'] },
			]], [
				['move raindance mega', 'move hurricane'],
				['switch 2', 'move hurricane'],
			]);
			assert.deepEqual(seen, [70, true], 'rain should make Hurricane always hit again');
		});
	});
});

describe('Custom Mega Pidgeot mod data', () => {
	it('should give Hyper Beam 100 accuracy', () => {
		assert.equal(mod.dex.moves.get('hyperbeam').accuracy, 100);
	});

	it('should check Hyper Beam at 100 accuracy for any Pokemon', () => {
		const b = mod.createBattle([[
			{ species: 'Smeargle', ability: 'owntempo', moves: ['hyperbeam'] },
		], [
			{ species: 'Wynaut', ability: 'shadowtag', moves: ['splash'] },
		]]);
		const seen = [];
		b.onEvent('Accuracy', b.format, (accuracy, target, source, move) => {
			if (move.id === 'hyperbeam') seen.push(accuracy);
			return false;
		});
		b.makeChoices('move hyperbeam', 'move splash');
		b.destroy();
		assert.deepEqual(seen, [100]);
	});

	it('should give Pidgeot Work Up', () => {
		assert(mod.dex.species.getLearnsetData('pidgeot').learnset.workup, 'Pidgeot should have Work Up in its learnset');
		assert.equal(mod.dex.moves.get('workup').isNonstandard, null, 'Work Up should be usable in this mod');
	});

	it('should validate a team with Pidgeot + Pidgeotite + Work Up', () => {
		const team = [
			{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['workup', 'hyperbeam', 'hurricane', 'roost'], nature: 'Modest' },
			{ species: 'Snorlax', ability: 'immunity', item: 'leftovers', moves: ['bodyslam', 'crunch', 'protect', 'curse'], nature: 'Adamant' },
			{ species: 'Tyranitar', ability: 'sandstream', item: 'focussash', moves: ['rockslide', 'crunch', 'protect', 'dragondance'], nature: 'Jolly' },
			{ species: 'Gardevoir', ability: 'synchronize', item: 'sitrusberry', moves: ['psychic', 'moonblast', 'protect', 'trickroom'], nature: 'Modest' },
			{ species: 'Skarmory', ability: 'keeneye', item: 'choicescarf', moves: ['bravebird', 'ironhead', 'protect', 'tailwind'], nature: 'Jolly' },
			{ species: 'Azumarill', ability: 'thickfat', item: 'lumberry', moves: ['aquajet', 'playrough', 'protect', 'bellydrum'], nature: 'Adamant' },
		];
		assert.legalTeam(team, FORMAT);
	});
});
```

## `results/commands.md`

```markdown
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
```

## `results/test-output.txt`

```text


  Wingtip Vortex
    ✔ should be the ability of a Normal/Flying Mega Pidgeot with 83/93/99/112/88/104 base stats (54ms)
    ✔ should not set any weather of its own
    ✔ should coexist with normal weather
    Flying-component weakness reduction
      ✔ should neutralize a super effective hit on the holder
      ✔ should be the reason that hit was neutral
      ✔ should apply to Pokemon other than the ability holder
      ✔ should stop applying as soon as the holder is no longer active
      ✔ should only reduce the Flying-type component of the matchup
      ✔ should not touch weaknesses with no Flying component
    wind-flagged move accuracy
      ✔ should give Hurricane its normal accuracy check in rain
      ✔ should give Hurricane its normal accuracy check in sun
      ✔ should give Blizzard its normal accuracy check in snow
      ✔ should leave moves without the wind flag alone
      ✔ should apply to wind moves between two Pokemon that are not the holder
      ✔ should stop normalizing wind moves once the holder leaves the field

  Custom Mega Pidgeot mod data
    ✔ should give Hyper Beam 100 accuracy
    ✔ should check Hyper Beam at 100 accuracy for any Pokemon
    ✔ should give Pidgeot Work Up
    ✔ should validate a team with Pidgeot + Pidgeotite + Work Up


  19 passing (146ms)

```

## `results/verify.txt`

```text

=== format ===
name:     [Gen 9 Champions] VGC 2026 Reg M-A + Mega Pidgeot (49 chars, engine limit is 50)
mod:      championsregmapidgeot
gameType: doubles
ruleset:  Flat Rules, VGC Timer, Open Team Sheets

=== step 8: team validation ===
Pidgeot @ pidgeotite  
Ability: keeneye  
Modest Nature  
- workup  
- hyperbeam  
- hurricane  
- roost  

Snorlax @ leftovers  
Ability: immunity  
Adamant Nature  
- bodyslam  
- crunch  
- protect  
- curse  

Tyranitar @ focussash  
Ability: sandstream  
Jolly Nature  
- rockslide  
- crunch  
- protect  
- dragondance  

Gardevoir @ sitrusberry  
Ability: synchronize  
Modest Nature  
- psychic  
- moonblast  
- protect  
- trickroom  

Skarmory @ choicescarf  
Ability: keeneye  
Jolly Nature  
- bravebird  
- ironhead  
- protect  
- tailwind  

Azumarill @ lumberry  
Ability: thickfat  
Adamant Nature  
- aquajet  
- playrough  
- protect  
- bellydrum  


VALID: no problems reported

=== Mega Pidgeot, this format vs. stock Reg M-A ===
championsregmapidgeot    Normal/Flying 83/93/99/112/88/104  ability: Wingtip Vortex
championsregma           Normal/Flying 83/80/80/135/80/121  ability: No Guard

=== Hyper Beam accuracy ===
championsregmapidgeot    100
championsregma           90
champions                90
gen9                     90

=== Work Up ===
championsregmapidgeot    isNonstandard: null  legal learners: Pidgeot
championsregma           isNonstandard: "Past"  legal learners: (none)
```
