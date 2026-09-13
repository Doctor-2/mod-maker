'use strict';

const assert = require('./../../assert');
const common = require('./../../common');
const custom = common.mod('championsregmapidgeot');
let battle;
const L50 = set => ({ level: 50, ...set });

function moveOrder(log) {
	return log.filter(line => line.startsWith('|move|')).map(line => {
		const [, , user, move] = line.split('|');
		return `${user}:${move}`;
	});
}

describe('Custom Mega Pidgeot phase 2 v8 — Torkoal / Scarf Vivillon sun-switch line', () => {
	afterEach(() => { if (battle) battle.destroy(); battle = null; });

	function run(withVortex) {
		battle = custom.createBattle({ gameType: 'doubles', seed: [12, 34, 56, 78] }, [[
			L50({
				species: 'Pidgeot-Mega', ability: withVortex ? 'wingtipvortex' : 'noguard',
				nature: 'Modest', evs: { hp: 3, spa: 32, spe: 31 },
				moves: ['tailwind', 'hurricane', 'protect', 'heatwave'],
			}),
			L50({
				species: 'Torkoal', ability: 'drought', item: 'charcoal', nature: 'Quiet',
				evs: { hp: 32, spa: 32, def: 2 }, moves: ['protect', 'eruption', 'heatwave', 'weatherball'],
			}),
			L50({
				species: 'Vivillon', ability: 'compoundeyes', item: 'choicescarf', nature: 'Timid',
				evs: { hp: 2, spa: 32, spe: 32 }, moves: ['sleeppowder', 'hurricane', 'ragepowder', 'raindance'],
			}),
		], [
			L50({
				species: 'Garchomp', ability: 'roughskin', item: 'sitrusberry', nature: 'Jolly',
				evs: { hp: 2, atk: 32, spe: 32 }, moves: ['rockslide', 'dragonclaw', 'protect', 'swordsdance'],
			}),
			L50({
				species: 'Kingambit', ability: 'defiant', item: 'blackglasses', nature: 'Adamant',
				evs: { hp: 32, atk: 32, spd: 2 }, moves: ['protect', 'kowtowcleave', 'ironhead', 'suckerpunch'],
			}),
		]]);

		const pidgeot = battle.p1.active[0];
		const originalTorkoal = battle.p1.active[1];
		assert.equal(battle.field.weather, 'sunnyday');
		const cut = battle.log.length;

		battle.makeChoices('move tailwind, switch 3', 'move rockslide, move protect');
		const vivillon = battle.p1.active[1];
		const out = {
			withVortex,
			weather: battle.field.weather,
			pidgeotHp: pidgeot.hp,
			pidgeotMax: pidgeot.maxhp,
			vivillonSpecies: vivillon?.species.name,
			vivillonHp: vivillon?.hp,
			vivillonMax: vivillon?.maxhp,
			vivillonFainted: vivillon?.fainted,
			torkoalLeftField: originalTorkoal !== battle.p1.active[1],
			tailwind: !!battle.p1.sideConditions['tailwind'],
			order: moveOrder(battle.log.slice(cut)),
		};
		battle.destroy(); battle = null;
		return out;
	}

	it('records the Torkoal-to-Scarf-Vivillon switch resource under Rock Slide', () => {
		const vortex = run(true);
		const control = run(false);
		console.log('SUN_VIVILLON_SWITCH', JSON.stringify({ vortex, control }));

		assert.equal(vortex.weather, 'sunnyday');
		assert.equal(control.weather, 'sunnyday');
		assert(vortex.torkoalLeftField && control.torkoalLeftField, 'both branches should pay the same Torkoal switch action');
		assert.equal(vortex.vivillonSpecies, 'Vivillon');
		assert.equal(control.vivillonSpecies, 'Vivillon');
		assert.false(vortex.vivillonFainted, `Wingtip branch should preserve the Scarf Vivillon resource through the x2 Rock Slide: ${JSON.stringify(vortex)}`);
		assert(control.vivillonFainted, `without Wingtip, the same Scarf Vivillon should be lost to the x4 Rock Slide: ${JSON.stringify(control)}`);
		// Tailwind is intentionally recorded, not asserted: Rock Slide flinch is a real outcome
		// of this board state and should not be turned into a harness requirement.
	});
});
