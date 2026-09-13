'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

const custom = common.mod('championsregmapidgeot');
let battle;

function hasMiss(b) {
	return b.log.some(line => line.startsWith('|-miss|'));
}
function superEffective(b) {
	const prefix = '|-supereffective|';
	return b.log.filter(line => line.startsWith(prefix)).map(line => line.slice(prefix.length));
}

describe('Custom Mega Pidgeot phase 2 probes', () => {
	afterEach(() => { if (battle) battle.destroy(); });

	describe('H10: U-turn has a field-duration cost', () => {
		it('early U-turn should remove the wind accuracy guarantee before a later opponent moves', () => {
			battle = custom.createBattle({ forceRandomChance: false }, [[
				{ species: 'Pidgeot-Mega', ability: 'wingtipvortex', moves: ['uturn'] },
				{ species: 'Wynaut', moves: ['splash'] },
			], [
				{ species: 'Torkoal', ability: 'drought', moves: ['hurricane'] },
			]]);
			battle.makeChoices('move uturn', 'move hurricane');
			battle.makeChoices('switch 2', '');
			assert(hasMiss(battle), 'after Pidgeot leaves first, the later Hurricane should regain its sun accuracy check and miss under forced-fail RNG');
		});

		it('staying in should keep the wind accuracy guarantee for a later opponent', () => {
			battle = custom.createBattle({ forceRandomChance: false }, [[
				{ species: 'Pidgeot-Mega', ability: 'wingtipvortex', moves: ['protect'] },
			], [
				{ species: 'Torkoal', ability: 'drought', moves: ['hurricane'] },
			]]);
			battle.makeChoices('move protect', 'move hurricane');
			assert.false(hasMiss(battle), 'while Pidgeot stays active, Hurricane should skip the accuracy roll even in sun');
		});

		it('early U-turn should restore a later Flying weakness on an ally', () => {
			battle = custom.createBattle({ gameType: 'doubles' }, [[
				{ species: 'Pidgeot-Mega', ability: 'wingtipvortex', moves: ['uturn', 'protect'] },
				{ species: 'Tornadus', ability: 'prankster', moves: ['splash'] },
				{ species: 'Wynaut', ability: 'shadowtag', moves: ['splash'] },
			], [
				{ species: 'Smeargle', ability: 'owntempo', moves: ['thundershock'] },
				{ species: 'Magikarp', moves: ['splash'] },
			]]);
			battle.makeChoices('move uturn 1, move splash', 'move thundershock 2, move splash');
			battle.choose('p1', 'switch 3');
			assert.deepEqual(superEffective(battle), ['p1b: Tornadus|1']);
		});

		it('staying in should keep the later Flying weakness suppressed on an ally', () => {
			battle = custom.createBattle({ gameType: 'doubles' }, [[
				{ species: 'Pidgeot-Mega', ability: 'wingtipvortex', moves: ['protect'] },
				{ species: 'Tornadus', ability: 'prankster', moves: ['splash'] },
			], [
				{ species: 'Smeargle', ability: 'owntempo', moves: ['thundershock'] },
				{ species: 'Magikarp', moves: ['splash'] },
			]]);
			battle.makeChoices('move protect, move splash', 'move thundershock 2, move splash');
			assert.deepEqual(superEffective(battle), []);
		});

		it('a late U-turn should not retroactively remove the guarantee from an earlier move', () => {
			battle = custom.createBattle({ forceRandomChance: false }, [[
				{ species: 'Pidgeot-Mega', ability: 'wingtipvortex', moves: ['uturn'], nature: 'Quiet' },
				{ species: 'Wynaut', moves: ['splash'] },
			], [
				{ species: 'Aerodactyl', ability: 'drought', moves: ['hurricane'] },
			]]);
			battle.makeChoices('move uturn', 'move hurricane');
			battle.makeChoices('switch 2', '');
			assert.false(hasMiss(battle), 'the faster Hurricane should already have received the guarantee before the slower Pidgeot leaves');
		});
	});

	describe('actual damage semantics', () => {
		it('should roughly halve actual Electric damage when only the Flying weakness component is removed', () => {
			const run = withVortex => {
				battle = custom.createBattle({ gameType: 'doubles', seed: [1, 2, 3, 4] }, [[
					withVortex ?
						{ species: 'Pidgeot-Mega', ability: 'wingtipvortex', moves: ['protect'] } :
						{ species: 'Dragonite-Mega', ability: 'multiscale', moves: ['protect'] },
					{ species: 'Gyarados', ability: 'intimidate', moves: ['splash'] },
				], [
					{ species: 'Pichu', ability: 'static', moves: ['thundershock'] },
					{ species: 'Magikarp', moves: ['splash'] },
				]]);
				const gyarados = battle.p1.active[1];
				const before = gyarados.hp;
				battle.makeChoices('move protect, move splash', 'move thundershock 2, move splash');
				const out = { damage: before - gyarados.hp, hp: before, effectiveness: superEffective(battle), log: battle.log.slice() };
				battle.destroy(); battle = null; return out;
			};
			const vortex = run(true);
			const normal = run(false);
			assert(normal.damage > vortex.damage, `Vortex must reduce actual damage: normal=${JSON.stringify(normal)} vortex=${JSON.stringify(vortex)}`);
			assert(Math.abs(normal.damage - 2 * vortex.damage) <= 3, `expected the removed Flying x2 component to approximately halve damage: normal=${JSON.stringify(normal)} vortex=${JSON.stringify(vortex)}`);
		});
	});

	describe('paired role probes', () => {
		it('custom Pidgeot should also protect an opposing Charizard Y from one layer of Rock weakness', () => {
			const run = anchor => {
				battle = custom.createBattle({ gameType: 'doubles' }, [[anchor, { species: 'Garchomp', ability: 'roughskin', moves: ['rockslide'] }], [
					{ species: 'Charizard-Mega-Y', ability: 'drought', moves: ['sunnyday'] }, { species: 'Magikarp', moves: ['splash'] },
				]]);
				battle.makeChoices('move protect, move rockslide', 'move sunnyday, move splash');
				const result = superEffective(battle); battle.destroy(); battle = null; return result;
			};
			const vortex = run({ species: 'Pidgeot-Mega', ability: 'wingtipvortex', moves: ['protect'] });
			const dragonite = run({ species: 'Dragonite-Mega', ability: 'multiscale', moves: ['protect'] });
			assert.deepEqual(vortex, ['p2a: Charizard|1']);
			assert.deepEqual(dragonite, ['p2a: Charizard|2']);
		});
	});
});
