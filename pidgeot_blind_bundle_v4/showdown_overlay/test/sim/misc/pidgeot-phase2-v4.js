'use strict';

const assert = require('./../../assert');
const common = require('./../../common');
const custom = common.mod('championsregmapidgeot');
let battle;
const L50 = set => ({ level: 50, ...set });

function moveOrder(b) {
	return b.log.filter(line => line.startsWith('|move|')).map(line => {
		const [, , user, move] = line.split('|');
		return `${user}:${move}`;
	});
}

describe('Custom Mega Pidgeot phase 2 v4 — speed-investment tempo', () => {
	afterEach(() => { if (battle) battle.destroy(); });

	function runPidgeot(spread) {
		battle = custom.createBattle({ gameType: 'doubles', seed: [9, 8, 7, 6] }, [[
			L50({
				species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', nature: 'Modest',
				evs: spread, moves: ['tailwind', 'protect'],
			}),
			L50({ species: 'Pelipper', ability: 'drizzle', nature: 'Bold', evs: { hp: 32, def: 32, spd: 2 }, moves: ['hurricane'] }),
		], [
			L50({ species: 'Garchomp', ability: 'roughskin', nature: 'Serious', evs: { spe: 32, hp: 32, atk: 2 }, moves: ['swordsdance'] }),
			L50({ species: 'Magikarp', moves: ['splash'] }),
		]]);
		const pidgeot = battle.p1.active[0];
		const pelipper = battle.p1.active[1];
		const garchomp = battle.p2.active[0];
		battle.makeChoices('move tailwind mega, move hurricane 1', 'move swordsdance, move splash');
		const result = {
			order: moveOrder(battle),
			pidgeotSpeed: pidgeot.getStat('spe', true, true),
			pelipperSpeed: pelipper.getStat('spe', true, true),
			garchompSpeed: garchomp.getStat('spe', true, true),
			tailwind: !!battle.p1.sideConditions['tailwind'],
		};
		battle.destroy(); battle = null; return result;
	}

	it('155-Speed Modest Pidgeot should create same-turn partner tempo that the 124-Speed bulky spread cannot', () => {
		const mid = runPidgeot({ hp: 3, spa: 32, spe: 31 });
		const bulky = runPidgeot({ hp: 32, spa: 32, spd: 2 });
		console.log('SAME_TURN_TAILWIND_TEMPO', JSON.stringify({ mid, bulky }));

		assert.equal(mid.pidgeotSpeed, 155);
		assert.equal(bulky.pidgeotSpeed, 124);
		assert.equal(mid.garchompSpeed, 154);
		assert.equal(mid.pelipperSpeed, 85);

		const midPidgeot = mid.order.findIndex(x => x.includes('Pidgeot:Tailwind'));
		const midPelipper = mid.order.findIndex(x => x.includes('Pelipper:Hurricane'));
		const midGarchomp = mid.order.findIndex(x => x.includes('Garchomp:Swords Dance'));
		assert(midPidgeot < midPelipper && midPelipper < midGarchomp,
			`mid-speed branch should be Pidgeot -> newly-Tailwinded Pelipper -> Garchomp: ${JSON.stringify(mid)}`);

		const bulkyGarchomp = bulky.order.findIndex(x => x.includes('Garchomp:Swords Dance'));
		const bulkyPidgeot = bulky.order.findIndex(x => x.includes('Pidgeot:Tailwind'));
		assert(bulkyGarchomp < bulkyPidgeot,
			`bulky branch should let Garchomp act before Tailwind is established: ${JSON.stringify(bulky)}`);
	});
});
