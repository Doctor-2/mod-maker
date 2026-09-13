'use strict';

const assert = require('./../../assert');
const common = require('./../../common');
const custom = common.mod('championsregmapidgeot');
let battle;
const L50 = set => ({ level: 50, ...set });

function moves(log) {
	return log.filter(line => line.startsWith('|move|')).map(line => line.split('|').slice(2, 5).join(':'));
}

function boosts(mon) {
	return { atk: mon.boosts.atk, spa: mon.boosts.spa };
}

describe('Custom Mega Pidgeot phase 2 v7 — Work Up support dependence', () => {
	afterEach(() => { if (battle) battle.destroy(); battle = null; });

	it('Follow Me + Friend Guard should not make Work Up automatic because Fake Out acts first', () => {
		battle = custom.createBattle({ gameType: 'doubles', seed: [1, 4, 2, 8] }, [[
			L50({ species: 'Pidgeot-Mega', ability: 'wingtipvortex', nature: 'Modest', evs: { hp: 32, spa: 32, spd: 2 }, moves: ['workup', 'protect'] }),
			L50({ species: 'Maushold-Four', ability: 'friendguard', nature: 'Jolly', evs: { hp: 32, spe: 32, def: 2 }, moves: ['followme', 'protect'] }),
		], [
			L50({ species: 'Sneasler', ability: 'unburden', item: 'whiteherb', nature: 'Jolly', evs: { hp: 2, atk: 32, spe: 32 }, moves: ['fakeout', 'closecombat'] }),
			L50({ species: 'Kingambit', ability: 'defiant', nature: 'Adamant', evs: { hp: 32, atk: 32, spd: 2 }, moves: ['protect', 'kowtowcleave'] }),
		]]);
		const pidgeot = battle.p1.active[0];
		battle.makeChoices('move workup, move followme', 'move fakeout 1, move protect');
		const out = { boosts: boosts(pidgeot), order: moves(battle.log), hp: pidgeot.hp, maxhp: pidgeot.maxhp };
		console.log('WORKUP_FOLLOWME_FAKEOUT', JSON.stringify(out));
		assert.deepEqual(out.boosts, { atk: 0, spa: 0 }, 'Fake Out +3 should flinch Pidgeot before Follow Me +2 can redirect it');
	});

	it('Armor Tail should buy Work Up against Fake Out plus passive partner action', () => {
		battle = custom.createBattle({ gameType: 'doubles', seed: [1, 4, 2, 8] }, [[
			L50({ species: 'Pidgeot-Mega', ability: 'wingtipvortex', nature: 'Modest', evs: { hp: 32, spa: 32, spd: 2 }, moves: ['workup', 'protect'] }),
			L50({ species: 'Farigiraf', ability: 'armortail', nature: 'Bold', evs: { hp: 32, def: 32, spd: 2 }, moves: ['helpinghand', 'protect'] }),
		], [
			L50({ species: 'Sneasler', ability: 'unburden', item: 'whiteherb', nature: 'Jolly', evs: { hp: 2, atk: 32, spe: 32 }, moves: ['fakeout', 'closecombat'] }),
			L50({ species: 'Kingambit', ability: 'defiant', nature: 'Adamant', evs: { hp: 32, atk: 32, spd: 2 }, moves: ['protect', 'kowtowcleave'] }),
		]]);
		const pidgeot = battle.p1.active[0];
		battle.makeChoices('move workup, move protect', 'move fakeout 1, move protect');
		const out = { boosts: boosts(pidgeot), order: moves(battle.log), hp: pidgeot.hp, maxhp: pidgeot.maxhp };
		console.log('WORKUP_ARMOR_TAIL_FAKEOUT', JSON.stringify(out));
		assert.deepEqual(out.boosts, { atk: 1, spa: 1 }, 'Armor Tail should deny Fake Out and allow Work Up to resolve');
	});

	it('Armor Tail should not convert Work Up into a safe setup turn against non-priority double targeting', () => {
		battle = custom.createBattle({ gameType: 'doubles', seed: [9, 5, 3, 1] }, [[
			L50({ species: 'Pidgeot-Mega', ability: 'wingtipvortex', nature: 'Modest', evs: { hp: 32, spa: 32, spd: 2 }, moves: ['workup', 'protect'] }),
			L50({ species: 'Farigiraf', ability: 'armortail', nature: 'Bold', evs: { hp: 32, def: 32, spd: 2 }, moves: ['helpinghand', 'protect'] }),
		], [
			L50({ species: 'Sneasler', ability: 'unburden', item: 'whiteherb', nature: 'Adamant', evs: { hp: 2, atk: 32, spe: 32 }, moves: ['fakeout', 'closecombat'] }),
			L50({ species: 'Kingambit', ability: 'defiant', nature: 'Adamant', evs: { hp: 32, atk: 32, spd: 2 }, moves: ['protect', 'kowtowcleave'] }),
		]]);
		const pidgeot = battle.p1.active[0];
		battle.makeChoices('move workup, move protect', 'move closecombat 1, move kowtowcleave 1');
		const out = { fainted: pidgeot.fainted, boosts: boosts(pidgeot), order: moves(battle.log), hp: pidgeot.hp, maxhp: pidgeot.maxhp };
		console.log('WORKUP_ARMOR_TAIL_DOUBLE_TARGET', JSON.stringify(out));
		assert(pidgeot.fainted, `priority denial should not stop ordinary double-target pressure: ${JSON.stringify(out)}`);
		assert(out.order.some(x => x.includes('Pidgeot:Work Up')), 'Pidgeot should actually spend the turn setting up before being finished by the slower hit');
	});
});
