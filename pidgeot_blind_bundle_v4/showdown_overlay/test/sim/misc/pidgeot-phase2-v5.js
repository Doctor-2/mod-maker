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
function usedMove(b, ident, move) {
	return b.log.some(line => line.startsWith(`|move|${ident}|${move}|`));
}

describe('Custom Mega Pidgeot phase 2 v5 — secondary-Mega base-form tax', () => {
	afterEach(() => { if (battle) battle.destroy(); });

	function secondary(kind, moves) {
		if (kind === 'aerodactyl') {
			return L50({ species: 'Aerodactyl', ability: 'unnerve', item: 'aerodactylite', nature: 'Jolly', evs: { hp: 2, atk: 32, spe: 32 }, moves });
		}
		return L50({ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', nature: 'Modest', evs: { hp: 3, spa: 32, spe: 31 }, moves });
	}

	it('shows the Wide Guard role compression lost when Pidgeot replaces Aerodactyl beside Mega Charizard Y', () => {
		const run = kind => {
			battle = custom.createBattle({ gameType: 'doubles', forceRandomChance: true, seed: [6, 6, 6, 6] }, [[
				L50({ species: 'Charizard', ability: 'blaze', item: 'charizarditey', nature: 'Modest', evs: { hp: 2, spa: 32, spe: 32 }, moves: ['heatwave', 'protect'] }),
				secondary(kind, kind === 'aerodactyl' ? ['wideguard', 'tailwind'] : ['tailwind', 'protect']),
			], [
				L50({ species: 'Tyranitar', ability: 'sandstream', nature: 'Jolly', evs: { hp: 2, atk: 32, spe: 32 }, moves: ['rockslide'] }),
				L50({ species: 'Magikarp', moves: ['splash'] }),
			]]);
			const charizard = battle.p1.active[0];
			const support = battle.p1.active[1];
			const c0 = charizard.hp;
			const s0 = support.hp;
			if (kind === 'aerodactyl') {
				battle.makeChoices('move heatwave mega, move wideguard', 'move rockslide, move splash');
			} else {
				battle.makeChoices('move heatwave mega, move tailwind', 'move rockslide, move splash');
			}
			const out = {
				charizardDamage: c0 - charizard.hp,
				supportDamage: s0 - support.hp,
				supportSpecies: support.species.name,
				order: moveOrder(battle),
			};
			battle.destroy(); battle = null; return out;
		};
		const aero = run('aerodactyl');
		const pidgeot = run('pidgeot');
		console.log('SECONDARY_MEGA_WIDE_GUARD_TAX', JSON.stringify({ aero, pidgeot }));
		assert.equal(aero.charizardDamage, 0, `Wide Guard should fully deny Rock Slide: ${JSON.stringify(aero)}`);
		assert.equal(aero.supportDamage, 0, `Wide Guard should protect Aerodactyl too: ${JSON.stringify(aero)}`);
		assert(pidgeot.charizardDamage > 0, `base Pidgeot cannot reproduce Wide Guard protection: ${JSON.stringify(pidgeot)}`);
		assert(pidgeot.supportDamage > 0, `base Pidgeot should also take the Rock Slide itself: ${JSON.stringify(pidgeot)}`);
	});

	it('shows fast base Aerodactyl creating same-turn Charizard tempo that un-Mega Pidgeot cannot', () => {
		const run = kind => {
			battle = custom.createBattle({ gameType: 'doubles', seed: [3, 1, 4, 1] }, [[
				L50({ species: 'Charizard', ability: 'blaze', item: 'charizarditey', nature: 'Modest', evs: { hp: 2, spa: 32, spe: 32 }, moves: ['heatwave'] }),
				secondary(kind, ['tailwind']),
			], [
				L50({ species: 'Sneasler', ability: 'unburden', item: 'whiteherb', nature: 'Jolly', evs: { hp: 2, atk: 32, spe: 32 }, moves: ['closecombat'] }),
				L50({ species: 'Magikarp', moves: ['splash'] }),
			]]);
			const support = battle.p1.active[1];
			const charizard = battle.p1.active[0];
			const sneasler = battle.p2.active[0];
			battle.makeChoices('move heatwave mega, move tailwind', 'move closecombat 1, move splash');
			const out = {
				order: moveOrder(battle),
				supportSpeed: support.getStat('spe', true, true),
				charizardSpeed: charizard.getStat('spe', true, true),
				sneaslerSpeed: sneasler.getStat('spe', true, true),
				sneaslerCloseCombat: usedMove(battle, 'p2a: Sneasler', 'Close Combat'),
			};
			battle.destroy(); battle = null; return out;
		};
		const aero = run('aerodactyl');
		const pidgeot = run('pidgeot');
		console.log('SECONDARY_MEGA_SPEED_TAX', JSON.stringify({ aero, pidgeot }));
		assert.equal(aero.supportSpeed, 200);
		assert.equal(pidgeot.supportSpeed, 152);
		assert.equal(aero.sneaslerSpeed, 189);

		const aeroTailwind = aero.order.findIndex(x => x.includes('Aerodactyl:Tailwind'));
		const aeroCharizard = aero.order.findIndex(x => x.includes('Charizard:Heat Wave'));
		const aeroSneasler = aero.order.findIndex(x => x.includes('Sneasler:Close Combat'));
		assert(aeroTailwind < aeroCharizard && aeroCharizard < aeroSneasler,
			`Aerodactyl should create same-turn Tailwind tempo for Charizard: ${JSON.stringify(aero)}`);

		const pidgeotSneasler = pidgeot.order.findIndex(x => x.includes('Sneasler:Close Combat'));
		const pidgeotTailwind = pidgeot.order.findIndex(x => x.includes('Pidgeot:Tailwind'));
		assert(pidgeotSneasler < pidgeotTailwind,
			`un-Mega Pidgeot should be too slow to establish Tailwind before Sneasler acts: ${JSON.stringify(pidgeot)}`);
	});
});
