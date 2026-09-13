'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

const custom = common.mod('championsregmapidgeot');
let battle;

function hasMiss(b) {
	return b.log.some(line => line.startsWith('|-miss|'));
}
function moveCount(b, moveName) {
	return b.log.filter(line => line.startsWith('|move|') && line.includes(`|${moveName}|`)).length;
}
function superEffective(b) {
	const prefix = '|-supereffective|';
	return b.log.filter(line => line.startsWith(prefix)).map(line => line.slice(prefix.length));
}

describe('Custom Mega Pidgeot phase 2 probes', () => {
	afterEach(() => { if (battle) battle.destroy(); });

	describe('H10: U-turn has a field-duration cost', () => {
		it('early U-turn should remove the wind accuracy guarantee before a slower ally moves', () => {
			battle = custom.createBattle({ gameType: 'doubles', forceRandomChance: false }, [[
				{ species: 'Pidgeot-Mega', ability: 'wingtipvortex', moves: ['uturn', 'protect'] },
				{ species: 'Smeargle', ability: 'owntempo', moves: ['hurricane'] },
				{ species: 'Wynaut', ability: 'shadowtag', moves: ['splash'] },
			], [
				{ species: 'Torkoal', ability: 'drought', moves: ['splash'] },
				{ species: 'Magikarp', moves: ['splash'] },
			]]);
			battle.makeChoices('move uturn 1, move hurricane 1', 'move splash, move splash');
			battle.choose('p1', 'switch 3, pass');
			assert(hasMiss(battle), 'after the faster Pidgeot U-turns out, the slower allied Hurricane should roll accuracy and miss in sun');
		});

		it('staying in should keep the wind accuracy guarantee for a slower ally', () => {
			battle = custom.createBattle({ gameType: 'doubles', forceRandomChance: false }, [[
				{ species: 'Pidgeot-Mega', ability: 'wingtipvortex', moves: ['uturn', 'protect'] },
				{ species: 'Smeargle', ability: 'owntempo', moves: ['hurricane'] },
			], [
				{ species: 'Torkoal', ability: 'drought', moves: ['splash'] },
				{ species: 'Magikarp', moves: ['splash'] },
			]]);
			battle.makeChoices('move protect, move hurricane 1', 'move splash, move splash');
			assert.false(hasMiss(battle));
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
				{ species: 'Pidgeot-Mega', ability: 'wingtipvortex', moves: ['uturn', 'protect'] },
				{ species: 'Tornadus', ability: 'prankster', moves: ['splash'] },
			], [
				{ species: 'Smeargle', ability: 'owntempo', moves: ['thundershock'] },
				{ species: 'Magikarp', moves: ['splash'] },
			]]);
			battle.makeChoices('move protect, move splash', 'move thundershock 2, move splash');
			assert.deepEqual(superEffective(battle), []);
		});

		it('a slower U-turn should preserve the field rule for actions that already resolved', () => {
			battle = custom.createBattle({ gameType: 'doubles', forceRandomChance: false }, [[
				{ species: 'Pidgeot-Mega', ability: 'wingtipvortex', moves: ['uturn'], nature: 'Quiet' },
				{ species: 'Aerodactyl', ability: 'pressure', moves: ['hurricane'] },
				{ species: 'Wynaut', ability: 'shadowtag', moves: ['splash'] },
			], [
				{ species: 'Torkoal', ability: 'drought', moves: ['splash'] },
				{ species: 'Magikarp', moves: ['splash'] },
			]]);
			battle.makeChoices('move uturn 1, move hurricane 1', 'move splash, move splash');
			battle.choose('p1', 'switch 3, pass');
			assert.false(hasMiss(battle));
			assert.equal(moveCount(battle, 'Hurricane'), 1);
		});
	});

	describe('paired role probes', () => {
		it('custom Pidgeot should flip a Pelipper Electric survival threshold that Mega Dragonite does not', () => {
			const run = anchor => {
				battle = custom.createBattle({ gameType: 'doubles', seed: [1, 2, 3, 4] }, [[
					anchor,
					{ species: 'Pelipper', ability: 'drizzle', item: 'sitrusberry', nature: 'Bold', evs: { hp: 32, spd: 32 }, moves: ['sleeptalk'] },
				], [
					{ species: 'Rotom-Wash', ability: 'levitate', item: 'leftovers', nature: 'Bold', moves: ['thunderbolt'] },
					{ species: 'Magikarp', moves: ['splash'] },
				]]);
				const pelipper = battle.p1.active[1];
				battle.makeChoices('move protect, move sleeptalk', 'move thunderbolt 2, move splash');
				const result = { fainted: pelipper.fainted, hp: pelipper.hp, maxhp: pelipper.maxhp, effectiveness: superEffective(battle), log: battle.log.slice() };
				battle.destroy(); battle = null; return result;
			};
			const vortex = run({ species: 'Pidgeot-Mega', ability: 'wingtipvortex', moves: ['protect'] });
			const dragonite = run({ species: 'Dragonite-Mega', ability: 'multiscale', moves: ['protect'] });
			assert(vortex.log.some(x => x.includes('|Thunderbolt|p1b: Pelipper')), `Pidgeot branch Thunderbolt did not target Pelipper: ${JSON.stringify(vortex.log)}`);
			assert(dragonite.log.some(x => x.includes('|Thunderbolt|p1b: Pelipper')), `Dragonite branch Thunderbolt did not target Pelipper: ${JSON.stringify(dragonite.log)}`);
			assert.false(vortex.fainted, `Wingtip Vortex should let this test-spread Pelipper survive: ${JSON.stringify(vortex)}`);
			assert(dragonite.fainted, `without Wingtip Vortex the same Pelipper should be KOed by the x4 Electric hit: ${JSON.stringify(dragonite)}`);
		});

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
