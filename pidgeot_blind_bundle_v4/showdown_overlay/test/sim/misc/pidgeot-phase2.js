'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

const custom = common.mod('championsregmapidgeot');
let battle;

const L50 = set => ({ level: 50, ...set });

function superEffective(b) {
	const prefix = '|-supereffective|';
	return b.log.filter(line => line.startsWith(prefix)).map(line => line.slice(prefix.length));
}
function usedMove(b, ident, move) {
	return b.log.some(line => line.startsWith(`|move|${ident}|${move}|`));
}

describe('Custom Mega Pidgeot phase 2 probes', () => {
	afterEach(() => { if (battle) battle.destroy(); });

	describe('H10: U-turn has a field-duration cost', () => {
		it('early U-turn should restore a later Flying weakness on an ally', () => {
			battle = custom.createBattle({ gameType: 'doubles' }, [[
				L50({ species: 'Pidgeot-Mega', ability: 'wingtipvortex', moves: ['uturn', 'protect'] }),
				L50({ species: 'Tornadus', ability: 'prankster', moves: ['splash'] }),
				L50({ species: 'Wynaut', ability: 'shadowtag', moves: ['splash'] }),
			], [
				L50({ species: 'Smeargle', ability: 'owntempo', moves: ['thundershock'] }),
				L50({ species: 'Magikarp', moves: ['splash'] }),
			]]);
			battle.makeChoices('move uturn 1, move splash', 'move thundershock 2, move splash');
			battle.choose('p1', 'switch 3');
			assert.deepEqual(superEffective(battle), ['p1b: Tornadus|1']);
		});

		it('staying in should keep the later Flying weakness suppressed on an ally', () => {
			battle = custom.createBattle({ gameType: 'doubles' }, [[
				L50({ species: 'Pidgeot-Mega', ability: 'wingtipvortex', moves: ['protect'] }),
				L50({ species: 'Tornadus', ability: 'prankster', moves: ['splash'] }),
			], [
				L50({ species: 'Smeargle', ability: 'owntempo', moves: ['thundershock'] }),
				L50({ species: 'Magikarp', moves: ['splash'] }),
			]]);
			battle.makeChoices('move protect, move splash', 'move thundershock 2, move splash');
			assert.deepEqual(superEffective(battle), []);
		});
	});

	describe('actual damage semantics at Champions level 50', () => {
		it('should roughly halve actual Electric damage when only the Flying weakness component is removed', () => {
			const run = withVortex => {
				battle = custom.createBattle({ gameType: 'doubles', seed: [1, 2, 3, 4] }, [[
					L50(withVortex ?
						{ species: 'Pidgeot-Mega', ability: 'wingtipvortex', moves: ['protect'] } :
						{ species: 'Dragonite-Mega', ability: 'multiscale', moves: ['protect'] }),
					L50({ species: 'Gyarados', ability: 'intimidate', moves: ['splash'] }),
				], [
					L50({ species: 'Pichu', ability: 'static', moves: ['thundershock'] }),
					L50({ species: 'Magikarp', moves: ['splash'] }),
				]]);
				const gyarados = battle.p1.active[1];
				const before = gyarados.hp;
				battle.makeChoices('move protect, move splash', 'move thundershock 2, move splash');
				const out = { damage: before - gyarados.hp, hp: before, effectiveness: superEffective(battle) };
				battle.destroy(); battle = null; return out;
			};
			const vortex = run(true);
			const normal = run(false);
			assert(normal.damage > vortex.damage, `Vortex must reduce actual damage: normal=${JSON.stringify(normal)} vortex=${JSON.stringify(vortex)}`);
			assert(Math.abs(normal.damage - 2 * vortex.damage) <= 3, `expected removed Flying x2 component to approximately halve damage: normal=${JSON.stringify(normal)} vortex=${JSON.stringify(vortex)}`);
		});

		it('should turn this explicit level-50 Pelipper benchmark from a Rotom-W Thunderbolt OHKO into survival', () => {
			const run = withVortex => {
				battle = custom.createBattle({ gameType: 'doubles', forceRandomChance: false, seed: [4, 3, 2, 1] }, [[
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
					fainted: pelipper.fainted, damage: before - pelipper.hp, hp: before,
					pelipperSpD: pelipper.getStat('spd', true, true), rotomSpA: rotom.getStat('spa', true, true),
					effectiveness: superEffective(battle),
				};
				battle.destroy(); battle = null; return out;
			};
			const vortex = run(true);
			const normal = run(false);
			assert.false(vortex.fainted, `level-50 Wingtip branch should survive: ${JSON.stringify(vortex)}`);
			assert(normal.fainted, `level-50 control branch should faint: ${JSON.stringify(normal)}`);
			console.log('Pelipper threshold:', JSON.stringify({ vortex, normal }));
		});
	});

	describe('paired role costs', () => {
		it('should also protect an opposing Charizard Y from one layer of Rock weakness', () => {
			const run = anchor => {
				battle = custom.createBattle({ gameType: 'doubles' }, [[L50(anchor), L50({ species: 'Garchomp', ability: 'roughskin', moves: ['rockslide'] })], [
					L50({ species: 'Charizard-Mega-Y', ability: 'drought', moves: ['sunnyday'] }), L50({ species: 'Magikarp', moves: ['splash'] }),
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

	describe('two-turn Pranav-shell paired decision tree vs Sneasler + Rotom-W pressure', () => {
		function runBranch(kind) {
			const pidgeot = kind === 'pidgeot';
			const anchor = pidgeot ?
				L50({ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', nature: 'Modest', evs: { hp: 32, spa: 32, spd: 2 }, moves: ['tailwind', 'hurricane', 'protect', 'heatwave'] }) :
				L50({ species: 'Dragonite', ability: 'innerfocus', item: 'dragoninite', nature: 'Modest', evs: { hp: 32, spa: 32, spd: 2 }, moves: ['tailwind', 'hurricane', 'protect', 'dragonpulse'] });

			battle = custom.createBattle({ gameType: 'doubles', forceRandomChance: false, seed: [11, 22, 33, 44] }, [[
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

			// T1: identical intentions. Fake Out denies the Mega's Tailwind. Rotom targets Pelipper.
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

			if (pelipper.fainted) {
				// Forced replacement before T2: healthy first slot passes, Kingambit fills slot b.
				battle.choose('p1', 'pass, switch 3');
			}

			// T2 deliberately exposes the tempo/resource difference created by T1.
			if (pidgeot) {
				// Preserve the Pelipper resource; Kingambit spends this turn entering instead of attacking.
				battle.makeChoices('move tailwind, switch 3', 'move closecombat 1, move thunderbolt 2');
			} else {
				// Pelipper is already gone, so the replacement Kingambit can attack while Dragonite sets Tailwind.
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
			const result = { kind, t1, t2, log: battle.log.slice() };
			battle.destroy(); battle = null; return result;
		}

		it('should produce the preregistered resource-vs-tempo divergence', () => {
			const pidgeot = runBranch('pidgeot');
			const dragonite = runBranch('dragonite');

			assert.false(pidgeot.t1.pelipperFainted, `Wingtip branch should keep level-50 Pelipper alive T1: ${JSON.stringify(pidgeot.t1)}`);
			assert(pidgeot.t1.pelipperHurricane, `surviving Pelipper should actually get its T1 Hurricane: ${JSON.stringify(pidgeot.t1)}`);
			assert(dragonite.t1.pelipperFainted, `Dragonite control should lose Pelipper to the x4 hit: ${JSON.stringify(dragonite.t1)}`);
			assert.false(dragonite.t1.pelipperHurricane, `fainted Pelipper should lose its queued action: ${JSON.stringify(dragonite.t1)}`);
			assert(pidgeot.t2.pelipperAliveInTeam, 'Pidgeot branch should preserve Pelipper as a reserve resource after the T2 switch');
			assert.false(dragonite.t2.pelipperAliveInTeam, 'Dragonite control has already spent the Pelipper resource');
			assert.false(pidgeot.t2.kingambitIronHead, 'Pidgeot branch Kingambit spent T2 switching in, so it cannot attack');
			assert(dragonite.t2.kingambitIronHead, 'Dragonite branch Kingambit was already in and should convert T2 into an attack');
			assert(pidgeot.t2.tailwind && dragonite.t2.tailwind, 'both anchors should establish Tailwind on T2');

			console.log('TWO_TURN_PAIRED_CONTROL', JSON.stringify({ pidgeot: { t1: pidgeot.t1, t2: pidgeot.t2 }, dragonite: { t1: dragonite.t1, t2: dragonite.t2 } }));
		});
	});
});
