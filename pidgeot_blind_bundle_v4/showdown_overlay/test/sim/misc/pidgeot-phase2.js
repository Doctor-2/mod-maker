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
	afterEach(() => {
		if (battle) battle.destroy();
	});

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
			// U-turn interrupts the turn with a one-sided switch request. The slower ally's
			// Hurricane is already queued, so only choose the replacement here.
			battle.choose('p1', 'switch 3');
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
			assert.false(hasMiss(battle), 'with Pidgeot still active, the allied Hurricane should bypass the accuracy roll');
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
			assert.deepEqual(superEffective(battle), ['p1b: Tornadus|1'], 'the later Electric attack should regain the Flying weakness after Pidgeot leaves');
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
			assert.deepEqual(superEffective(battle), [], 'with Pidgeot still active, the later Electric attack should remain neutral on pure Flying');
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
			// Hurricane has already resolved before the slower U-turn opens the switch request.
			battle.choose('p1', 'switch 3');
			assert.false(hasMiss(battle), 'the faster ally should get the accuracy guarantee before the slower Pidgeot pivots out');
			assert.equal(moveCount(battle, 'Hurricane'), 1, 'the already-resolved allied Hurricane must not execute twice');
		});
	});

	describe('paired role probes', () => {
		it('custom Pidgeot should flip a Pelipper Electric survival threshold that Mega Dragonite does not', () => {
			const run = anchor => {
				battle = custom.createBattle({ gameType: 'doubles', forceRandomChance: false }, [[
					anchor,
					{
						species: 'Pelipper', ability: 'drizzle', item: 'sitrusberry', nature: 'Bold',
						evs: { hp: 32, spd: 32 }, moves: ['sleeptalk'],
					},
				], [
					{
						species: 'Rotom-Wash', ability: 'levitate', item: 'leftovers', nature: 'Calm',
						evs: { spa: 32 }, moves: ['thunderbolt'],
					},
					{ species: 'Magikarp', moves: ['splash'] },
				]]);
				const pelipper = battle.p1.active[1];
				battle.makeChoices('move protect, move sleeptalk', 'move thunderbolt 2, move splash');
				const result = {
					fainted: pelipper.fainted,
					hp: pelipper.hp,
					maxhp: pelipper.maxhp,
					effectiveness: superEffective(battle),
				};
				battle.destroy();
				battle = null;
				return result;
			};

			const vortex = run({ species: 'Pidgeot-Mega', ability: 'wingtipvortex', moves: ['protect'] });
			const dragonite = run({ species: 'Dragonite-Mega', ability: 'multiscale', moves: ['protect'] });

			assert.false(vortex.fainted, `Wingtip Vortex should let this test-spread Pelipper survive: ${JSON.stringify(vortex)}`);
			assert(dragonite.fainted, `without Wingtip Vortex the same Pelipper should be KOed by the x4 Electric hit: ${JSON.stringify(dragonite)}`);
		});

		it('custom Pidgeot should also protect an opposing Charizard Y from one layer of Rock weakness', () => {
			const run = anchor => {
				battle = custom.createBattle({ gameType: 'doubles' }, [[
					anchor,
					{ species: 'Garchomp', ability: 'roughskin', moves: ['rockslide'] },
				], [
					{ species: 'Charizard-Mega-Y', ability: 'drought', moves: ['sunnyday'] },
					{ species: 'Magikarp', moves: ['splash'] },
				]]);
				battle.makeChoices('move protect, move rockslide', 'move sunnyday, move splash');
				const result = superEffective(battle);
				battle.destroy();
				battle = null;
				return result;
			};

			const vortex = run({ species: 'Pidgeot-Mega', ability: 'wingtipvortex', moves: ['protect'] });
			const dragonite = run({ species: 'Dragonite-Mega', ability: 'multiscale', moves: ['protect'] });

			assert.deepEqual(vortex, ['p2a: Charizard|1'], 'Vortex should reduce Fire/Flying Rock x4 to x2 even for the opponent');
			assert.deepEqual(dragonite, ['p2a: Charizard|2'], 'without Vortex Charizard Y should retain its x4 Rock weakness');
		});
	});
});
