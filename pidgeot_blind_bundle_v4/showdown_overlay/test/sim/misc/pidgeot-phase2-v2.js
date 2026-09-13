'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

const custom = common.mod('championsregmapidgeot');
let battle;
const L50 = set => ({ level: 50, ...set });

function usedMove(b, ident, move) {
	return b.log.some(line => line.startsWith(`|move|${ident}|${move}|`));
}
function superEffective(b) {
	const prefix = '|-supereffective|';
	return b.log.filter(line => line.startsWith(prefix)).map(line => line.slice(prefix.length));
}

describe('Custom Mega Pidgeot phase 2 v2', () => {
	afterEach(() => { if (battle) battle.destroy(); });

	it('flips an explicit level-50 Pelipper Thunderbolt threshold', () => {
		const run = withVortex => {
			battle = custom.createBattle({ gameType: 'doubles', seed: [4, 3, 2, 1] }, [[
				L50(withVortex ?
					{ species: 'Pidgeot-Mega', ability: 'wingtipvortex', moves: ['protect'] } :
					{ species: 'Dragonite-Mega', ability: 'multiscale', moves: ['protect'] }),
				L50({ species: 'Pelipper', ability: 'drizzle', item: 'sitrusberry', nature: 'Bold', evs: { hp: 32, def: 2, spd: 32 }, moves: ['sleeptalk'] }),
			], [
				L50({ species: 'Rotom-Wash', ability: 'levitate', item: 'leftovers', nature: 'Bold', evs: { hp: 32, def: 32, spd: 2 }, moves: ['thunderbolt'] }),
				L50({ species: 'Magikarp', moves: ['splash'] }),
			]]);
			const pelipper = battle.p1.active[1];
			const rotom = battle.p2.active[0];
			const before = pelipper.hp;
			battle.makeChoices('move protect, move sleeptalk', 'move thunderbolt 2, move splash');
			const out = {
				fainted: pelipper.fainted,
				damage: before - pelipper.hp,
				hp: before,
				pelipperSpD: pelipper.getStat('spd', true, true),
				rotomSpA: rotom.getStat('spa', true, true),
				effectiveness: superEffective(battle),
			};
			battle.destroy(); battle = null; return out;
		};
		const vortex = run(true);
		const control = run(false);
		console.log('PELIPPER_THRESHOLD', JSON.stringify({ vortex, control }));
		assert.false(vortex.fainted, `Wingtip branch should survive: ${JSON.stringify(vortex)}`);
		assert(control.fainted, `control branch should faint: ${JSON.stringify(control)}`);
	});

	function runPranavBranch(kind) {
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

		// T1 identical decision tree: Fake Out denies Tailwind; Rotom targets Pelipper.
		battle.makeChoices('move tailwind mega, move hurricane 1', 'move fakeout 1, move thunderbolt 2');
		const t1 = {
			anchorSpecies: anchorMon.species.name,
			anchorHp: anchorMon.hp,
			anchorMax: anchorMon.maxhp,
			pelipperFainted: pelipper.fainted,
			pelipperHp: pelipper.hp,
			sneaslerHp: sneasler.hp,
			sneaslerMax: sneasler.maxhp,
			pelipperHurricane: usedMove(battle, 'p1b: Pelipper', 'Hurricane'),
		};

		if (pelipper.fainted) battle.choose('p1', 'pass, switch 3');

		// T2 exposes resource-vs-tempo consequence, not a claim about optimal play.
		if (pidgeot) {
			battle.makeChoices('move tailwind, switch 3', 'move closecombat 1, move thunderbolt 2');
		} else {
			battle.makeChoices('move tailwind, move ironhead 1', 'move closecombat 1, move thunderbolt 2');
		}

		const kingambit = battle.p1.active[1];
		const reservePelipper = battle.p1.pokemon.find(mon => mon.species.baseSpecies === 'Pelipper');
		const t2 = {
			anchorHp: anchorMon.hp,
			anchorMax: anchorMon.maxhp,
			kingambitHp: kingambit?.hp,
			kingambitMax: kingambit?.maxhp,
			kingambitIronHead: usedMove(battle, 'p1b: Kingambit', 'Iron Head'),
			sneaslerHp: sneasler.hp,
			sneaslerMax: sneasler.maxhp,
			pelipperAliveInTeam: !!reservePelipper && !reservePelipper.fainted,
			pelipperHpInTeam: reservePelipper?.hp,
			tailwind: !!battle.p1.sideConditions['tailwind'],
		};
		const result = { kind, t1, t2 };
		battle.destroy(); battle = null; return result;
	}

	it('produces the preregistered resource-vs-tempo divergence against Sneasler + Rotom-W', () => {
		const pidgeot = runPranavBranch('pidgeot');
		const dragonite = runPranavBranch('dragonite');
		console.log('TWO_TURN_PAIRED_CONTROL', JSON.stringify({ pidgeot, dragonite }));

		assert.false(pidgeot.t1.pelipperFainted, `Wingtip branch should preserve Pelipper T1: ${JSON.stringify(pidgeot)}`);
		assert(pidgeot.t1.pelipperHurricane, `surviving Pelipper should execute Hurricane: ${JSON.stringify(pidgeot)}`);
		assert(dragonite.t1.pelipperFainted, `control should lose Pelipper to x4 Thunderbolt: ${JSON.stringify(dragonite)}`);
		assert.false(dragonite.t1.pelipperHurricane, `fainted Pelipper should lose queued Hurricane: ${JSON.stringify(dragonite)}`);
		assert(pidgeot.t2.pelipperAliveInTeam, 'Wingtip branch should preserve Pelipper as a reserve resource');
		assert.false(dragonite.t2.pelipperAliveInTeam, 'control has spent the Pelipper resource');
		assert.false(pidgeot.t2.kingambitIronHead, 'Wingtip branch spends T2 slot-two action entering Kingambit');
		assert(dragonite.t2.kingambitIronHead, 'control gets a T2 Kingambit attack because it entered after T1 KO');
		assert(pidgeot.t2.tailwind && dragonite.t2.tailwind, 'both branches should establish Tailwind on T2');
	});
});
