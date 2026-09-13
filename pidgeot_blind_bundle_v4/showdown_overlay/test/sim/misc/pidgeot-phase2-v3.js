'use strict';

const assert = require('./../../assert');
const common = require('./../../common');
const custom = common.mod('championsregmapidgeot');
let battle;
const L50 = set => ({ level: 50, ...set });

function usedMove(b, ident, move) {
	return b.log.some(line => line.startsWith(`|move|${ident}|${move}|`));
}
function alive(side) {
	return side.pokemon.filter(mon => !mon.fainted).map(mon => `${mon.species.baseSpecies}:${mon.hp}/${mon.maxhp}`);
}

describe('Custom Mega Pidgeot phase 2 v3 — three-turn resource conversion', () => {
	afterEach(() => { if (battle) battle.destroy(); });

	function runBranch(kind) {
		const pidgeot = kind === 'pidgeot';
		const anchor = pidgeot ?
			L50({ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', nature: 'Modest', evs: { hp: 32, spa: 32, spd: 2 }, moves: ['tailwind', 'hurricane', 'protect', 'heatwave'] }) :
			L50({ species: 'Dragonite', ability: 'innerfocus', item: 'dragoninite', nature: 'Modest', evs: { hp: 32, spa: 32, spd: 2 }, moves: ['tailwind', 'hurricane', 'protect', 'dragonpulse'] });

		battle = custom.createBattle({ gameType: 'doubles', seed: [11, 22, 33, 44] }, [[
			anchor,
			L50({ species: 'Pelipper', ability: 'drizzle', item: 'sitrusberry', nature: 'Bold', evs: { hp: 32, def: 2, spd: 32 }, moves: ['weatherball', 'hurricane', 'wideguard', 'tailwind'] }),
			L50({ species: 'Kingambit', ability: 'defiant', item: 'blackglasses', nature: 'Adamant', evs: { hp: 32, atk: 32, spd: 2 }, moves: ['kowtowcleave', 'suckerpunch', 'ironhead', 'protect'] }),
			L50({ species: 'Basculegion', ability: 'adaptability', item: 'choicescarf', nature: 'Adamant', evs: { hp: 2, atk: 32, spe: 32 }, moves: ['wavecrash', 'lastrespects', 'flipturn', 'aquajet'] }),
		], [
			L50({ species: 'Sneasler', ability: 'unburden', item: 'whiteherb', nature: 'Jolly', evs: { hp: 2, atk: 32, spe: 32 }, moves: ['protect', 'closecombat', 'direclaw', 'fakeout'] }),
			L50({ species: 'Rotom-Wash', ability: 'levitate', item: 'leftovers', nature: 'Bold', evs: { hp: 32, def: 32, spd: 2 }, moves: ['willowisp', 'thunderbolt', 'hydropump', 'lightscreen'] }),
			L50({ species: 'Tyranitar', ability: 'sandstream', item: 'tyranitarite', nature: 'Jolly', evs: { hp: 2, atk: 32, spe: 32 }, moves: ['protect', 'rockslide', 'knockoff', 'dragondance'] }),
			L50({ species: 'Sinistcha', ability: 'hospitality', item: 'sitrusberry', nature: 'Relaxed', evs: { hp: 32, def: 32, spd: 2 }, moves: ['ragepowder', 'trickroom', 'matchagotcha', 'protect'] }),
		]]);

		const anchorMon = battle.p1.active[0];
		const pelipper = battle.p1.active[1];
		const sneasler = battle.p2.active[0];
		const rotom = battle.p2.active[1];

		// T1: Fake Out denies Tailwind; Rotom pressures Pelipper.
		battle.makeChoices('move tailwind mega, move hurricane 1', 'move fakeout 1, move thunderbolt 2');
		const t1 = {
			anchor: `${anchorMon.hp}/${anchorMon.maxhp}`,
			pelipper: `${pelipper.hp}/${pelipper.maxhp}`,
			pelipperFainted: pelipper.fainted,
			sneasler: `${sneasler.hp}/${sneasler.maxhp}`,
			pelipperHurricane: usedMove(battle, 'p1b: Pelipper', 'Hurricane'),
		};
		if (pelipper.fainted) battle.choose('p1', 'pass, switch 3');

		// T2: Wingtip branch preserves Pelipper by manually pivoting it; control already has Kingambit in.
		if (pidgeot) battle.makeChoices('move tailwind, switch 3', 'move closecombat 1, move thunderbolt 2');
		else battle.makeChoices('move tailwind, move ironhead 1', 'move closecombat 1, move thunderbolt 2');
		const t2 = {
			anchor: `${anchorMon.hp}/${anchorMon.maxhp}`,
			kingambit: `${battle.p1.active[1].hp}/${battle.p1.active[1].maxhp}`,
			sneasler: `${sneasler.hp}/${sneasler.maxhp}`,
			rotom: `${rotom.hp}/${rotom.maxhp}`,
			pelipperReserve: `${pelipper.hp}/${pelipper.maxhp}`,
			pelipperAlive: !pelipper.fainted,
			kingambitIronHead: usedMove(battle, 'p1b: Kingambit', 'Iron Head'),
			tailwind: !!battle.p1.sideConditions['tailwind'],
		};

		// T3: same broad intention in both branches — exploit Tailwind to remove Sneasler first,
		// attack Rotom with Kingambit, while Rotom continues targeting the Mega anchor.
		battle.makeChoices('move hurricane 1, move kowtowcleave 2', 'move closecombat 1, move thunderbolt 1');
		const t3 = {
			anchor: `${anchorMon.hp}/${anchorMon.maxhp}`,
			anchorFainted: anchorMon.fainted,
			kingambit: `${battle.p1.active[1]?.hp || 0}/${battle.p1.active[1]?.maxhp || 0}`,
			sneasler: `${sneasler.hp}/${sneasler.maxhp}`,
			sneaslerFainted: sneasler.fainted,
			rotom: `${rotom.hp}/${rotom.maxhp}`,
			pelipper: `${pelipper.hp}/${pelipper.maxhp}`,
			pelipperAlive: !pelipper.fainted,
			p1Alive: alive(battle.p1),
			p2Alive: alive(battle.p2),
		};
		const result = { kind, t1, t2, t3 };
		battle.destroy(); battle = null; return result;
	}

	it('tests whether preserved Pelipper converts into a different resource shape rather than a free extra Pokemon', () => {
		const pidgeot = runBranch('pidgeot');
		const dragonite = runBranch('dragonite');
		console.log('THREE_TURN_RESOURCE_CONVERSION', JSON.stringify({ pidgeot, dragonite }));

		assert(pidgeot.t2.pelipperAlive && !dragonite.t2.pelipperAlive, 'T2 should retain the preregistered Pelipper resource split');
		assert(pidgeot.t3.sneaslerFainted && dragonite.t3.sneaslerFainted, 'Tailwind anchors should remove Sneasler before its queued Close Combat on T3');
		assert(pidgeot.t3.anchorFainted, `48 HP Pidgeot was predicted to fall to the continuing Thunderbolt: ${JSON.stringify(pidgeot.t3)}`);
		assert.false(dragonite.t3.anchorFainted, `healthier Mega Dragonite was predicted to survive the same T3 pressure: ${JSON.stringify(dragonite.t3)}`);
		assert.equal(pidgeot.t3.p1Alive.length, dragonite.t3.p1Alive.length, 'the predicted conversion is equal remaining Pokemon count, but different identities/HP');
	});
});
