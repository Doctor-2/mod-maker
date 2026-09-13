'use strict';

const assert = require('./../../assert');
const common = require('./../../common');
const custom = common.mod('championsregmapidgeot');
let battle;
const L50 = set => ({ level: 50, ...set });
const STOCK_FORMAT = '[Gen 9 Champions] VGC 2026 Reg M-A@@@!teampreview';

function turnMoves(log) {
	return log.filter(line => line.startsWith('|move|')).map(line => {
		const [, , user, move] = line.split('|');
		return `${user}:${move}`;
	});
}

function createStockBattle(options, teams) {
	return common.createBattle({ formatid: STOCK_FORMAT, ...options }, teams);
}
function createCustomBattle(options, teams) {
	return custom.createBattle(options, teams);
}

describe('Custom Mega Pidgeot phase 2 v6 — official-vs-redesign isolation', () => {
	afterEach(() => { if (battle) battle.destroy(); });

	function pelipperBranch(customForm) {
		const teams = [[
			L50(customForm ?
				{ species: 'Pidgeot-Mega', ability: 'wingtipvortex', moves: ['protect'] } :
				{ species: 'Pidgeot-Mega', ability: 'noguard', moves: ['protect'] }),
			L50({ species: 'Pelipper', ability: 'drizzle', item: 'sitrusberry', nature: 'Bold', evs: { hp: 32, def: 2, spd: 32 }, moves: ['sleeptalk'] }),
		], [
			L50({ species: 'Rotom-Wash', ability: 'levitate', nature: 'Bold', evs: { hp: 32, def: 32, spd: 2 }, moves: ['thunderbolt'] }),
			L50({ species: 'Magikarp', moves: ['splash'] }),
		]];
		battle = customForm ?
			createCustomBattle({ gameType: 'doubles', seed: [4, 3, 2, 1] }, teams) :
			createStockBattle({ seed: [4, 3, 2, 1] }, teams);
		const pelipper = battle.p1.active[1];
		const before = pelipper.hp;
		battle.makeChoices('move protect, move sleeptalk', 'move thunderbolt 2, move splash');
		const out = { fainted: pelipper.fainted, damage: before - pelipper.hp, hp: before };
		battle.destroy(); battle = null; return out;
	}

	it('changes Pidgeot from self-contained No Guard attacker into a field anchor that flips an ally survival threshold', () => {
		const official = pelipperBranch(false);
		const redesign = pelipperBranch(true);
		console.log('OFFICIAL_VS_CUSTOM_ALLY_EXTERNALITY', JSON.stringify({ official, redesign }));
		assert(official.fainted, `official No Guard Pidgeot should not protect Pelipper: ${JSON.stringify(official)}`);
		assert.false(redesign.fainted, `redesign should protect Pelipper via Wingtip Vortex: ${JSON.stringify(redesign)}`);
	});

	function unburdenBranch(customForm) {
		const teams = [[
			L50(customForm ?
				{ species: 'Pidgeot-Mega', ability: 'wingtipvortex', nature: 'Timid', evs: { hp: 2, spa: 32, spe: 32 }, moves: ['tailwind', 'hurricane'] } :
				{ species: 'Pidgeot-Mega', ability: 'noguard', nature: 'Timid', evs: { hp: 2, spa: 32, spe: 32 }, moves: ['tailwind', 'hurricane'] }),
		], [
			L50({ species: 'Sneasler', ability: 'unburden', item: 'whiteherb', nature: 'Jolly', evs: { hp: 2, atk: 32, spe: 32 }, moves: ['closecombat'] }),
		]];
		battle = customForm ?
			createCustomBattle({ seed: [7, 7, 7, 7] }, teams) :
			createStockBattle({ seed: [7, 7, 7, 7], gameType: 'singles' }, teams);
		const pidgeot = battle.p1.active[0];
		const sneasler = battle.p2.active[0];

		battle.makeChoices('move tailwind', 'move closecombat');
		const afterT1 = {
			pidgeotHp: pidgeot.hp,
			pidgeotMax: pidgeot.maxhp,
			pidgeotSpeed: pidgeot.getStat('spe', true, true),
			sneaslerSpeed: sneasler.getStat('spe', true, true),
			sneaslerItem: sneasler.item,
		};
		const cut = battle.log.length;
		battle.makeChoices('move hurricane', 'move closecombat');
		const out = {
			afterT1,
			t2Order: turnMoves(battle.log.slice(cut)),
			pidgeotFainted: pidgeot.fainted,
			sneaslerFainted: sneasler.fainted,
		};
		battle.destroy(); battle = null; return out;
	}

	it('shows the redesign giving up the official form exact max-Speed Tailwind edge over Jolly Unburden Sneasler', () => {
		const official = unburdenBranch(false);
		const redesign = unburdenBranch(true);
		console.log('OFFICIAL_VS_CUSTOM_UNBURDEN_SPEED', JSON.stringify({ official, redesign }));

		assert.equal(official.afterT1.pidgeotSpeed, 380, 'official max Timid Pidgeot should be 190 x2 under Tailwind');
		assert.equal(redesign.afterT1.pidgeotSpeed, 342, 'custom max Timid Pidgeot should be 171 x2 under Tailwind');
		assert.equal(official.afterT1.sneaslerSpeed, 378);
		assert.equal(redesign.afterT1.sneaslerSpeed, 378);
		assert.equal(official.afterT1.sneaslerItem, '', 'White Herb should have been consumed, activating Unburden');
		assert.equal(redesign.afterT1.sneaslerItem, '', 'White Herb should have been consumed, activating Unburden');

		assert(official.t2Order[0]?.includes('Pidgeot:Hurricane'), `official 380 should move before Sneasler 378: ${JSON.stringify(official)}`);
		assert(redesign.t2Order[0]?.includes('Sneasler:Close Combat'), `custom 342 should move after Sneasler 378: ${JSON.stringify(redesign)}`);
	});
});
