'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

const mod = common.mod('championsregmapidgeot');
const FORMAT = '[Gen 9 Champions] VGC 2026 Reg M-A + Mega Pidgeot';

/**
 * Every `-supereffective` line the battle has emitted, as `<target>|<degree>`,
 * where degree is 1 for 2x and 2 for 4x. A matchup that has been reduced to
 * neutral emits no line at all.
 */
function superEffective(b) {
	const prefix = '|-supereffective|';
	return b.log.filter(line => line.startsWith(prefix)).map(line => line.slice(prefix.length));
}

let battle;

describe('Wingtip Vortex', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should be the ability of a Normal/Flying Mega Pidgeot with 83/93/99/112/88/104 base stats', () => {
		battle = mod.createBattle([[
			{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['workup'] },
		], [
			{ species: 'Wynaut', ability: 'shadowtag', moves: ['splash'] },
		]]);
		battle.makeChoices('move workup mega', 'move splash');
		const pidgeot = battle.p1.active[0];
		assert.species(pidgeot, 'Pidgeot-Mega');
		assert.deepEqual(pidgeot.species.types, ['Normal', 'Flying']);
		assert.deepEqual(pidgeot.species.baseStats, { hp: 83, atk: 93, def: 99, spa: 112, spd: 88, spe: 104 });
		assert.equal(pidgeot.ability, 'wingtipvortex');
	});

	it('should not set any weather of its own', () => {
		battle = mod.createBattle([[
			{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['workup'] },
		], [
			{ species: 'Wynaut', ability: 'shadowtag', moves: ['splash'] },
		]]);
		battle.makeChoices('move workup mega', 'move splash');
		assert.false(battle.field.isWeather('deltastream'));
		assert.equal(battle.field.weather, '');
	});

	it('should coexist with normal weather', () => {
		battle = mod.createBattle([[
			{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['workup'] },
		], [
			{ species: 'Smeargle', ability: 'owntempo', moves: ['raindance', 'sunnyday', 'sandstorm', 'snowscape'] },
		]]);
		battle.makeChoices('move workup mega', 'move raindance');
		assert(battle.field.isWeather('raindance'), 'Rain Dance should set the weather');
		battle.makeChoices('move workup', 'move sunnyday');
		assert(battle.field.isWeather('sunnyday'), 'Sunny Day should set the weather');
		battle.makeChoices('move workup', 'move sandstorm');
		assert(battle.field.isWeather('sandstorm'), 'Sandstorm should set the weather');
		battle.makeChoices('move workup', 'move snowscape');
		assert(battle.field.isWeather('snowscape'), 'Snowscape should set the weather');
	});

	describe(`Flying-component weakness reduction`, () => {
		it('should neutralize a super effective hit on the holder', () => {
			battle = mod.createBattle([[
				{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['workup'] },
			], [
				{ species: 'Smeargle', ability: 'owntempo', moves: ['thundershock'] },
			]]);
			battle.makeChoices('move workup mega', 'move thundershock');
			assert.deepEqual(superEffective(battle), [], 'Electric should be neutral on Normal/Flying here');
		});

		it('should be the reason that hit was neutral', () => {
			// Same battle without the Mega Evolution: the reduction is gone
			battle = mod.createBattle([[
				{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['workup'] },
			], [
				{ species: 'Smeargle', ability: 'owntempo', moves: ['thundershock'] },
			]]);
			battle.makeChoices('move workup', 'move thundershock');
			assert.deepEqual(superEffective(battle), ['p1a: Pidgeot|1']);
		});

		it('should apply to Pokemon other than the ability holder', () => {
			battle = mod.createBattle({ gameType: 'doubles' }, [[
				{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['workup'] },
				{ species: 'Tornadus', ability: 'prankster', moves: ['splash'] },
			], [
				{ species: 'Smeargle', ability: 'owntempo', moves: ['discharge'] },
				{ species: 'Wynaut', ability: 'shadowtag', moves: ['splash'] },
			]]);
			// Discharge hits every adjacent Pokemon, so pure-Flying Tornadus is hit by a
			// Pokemon that is neither the ability holder nor targeting it
			battle.makeChoices('move workup mega, move splash', 'move discharge, move splash');
			assert.deepEqual(superEffective(battle), [], 'Tornadus should have taken a neutral hit');
		});

		it('should stop applying as soon as the holder is no longer active', () => {
			battle = mod.createBattle({ gameType: 'doubles' }, [[
				{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['workup'] },
				{ species: 'Tornadus', ability: 'prankster', moves: ['splash'] },
				{ species: 'Wynaut', ability: 'shadowtag', moves: ['splash'] },
			], [
				{ species: 'Smeargle', ability: 'owntempo', moves: ['discharge'] },
				{ species: 'Ditto', ability: 'limber', moves: ['splash'] },
			]]);
			battle.makeChoices('move workup mega, move splash', 'move discharge, move splash');
			assert.deepEqual(superEffective(battle), []);

			battle.makeChoices('switch 3, move splash', 'move discharge, move splash');
			assert.deepEqual(superEffective(battle), ['p1b: Tornadus|1'], 'the reduction should be gone');
		});

		it('should only reduce the Flying-type component of the matchup', () => {
			battle = mod.createBattle([[
				{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['rockslide'] },
			], [
				{ species: 'Talonflame', ability: 'flamebody', moves: ['splash'] },
			]]);
			// Rock is 4x on Fire/Flying; only the Flying half drops, so it stays 2x
			battle.makeChoices('move rockslide mega', 'move splash');
			assert.deepEqual(superEffective(battle), ['p2a: Talonflame|1']);
		});

		it('should not touch weaknesses with no Flying component', () => {
			battle = mod.createBattle([[
				{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['surf'] },
			], [
				{ species: 'Tyranitar', ability: 'sandstream', moves: ['splash'] },
			]]);
			battle.makeChoices('move surf mega', 'move splash');
			assert.deepEqual(superEffective(battle), ['p2a: Tyranitar|1']);
		});
	});

	describe(`wind-flagged move accuracy`, () => {
		/** Runs the given turns and reports the accuracy `moveid` was checked at each time. */
		function accuracyOf(moveid, teams, choices, options) {
			battle = mod.createBattle(options || {}, teams);
			const seen = [];
			battle.onEvent('Accuracy', battle.format, (accuracy, target, source, move) => {
				if (move.id === moveid) seen.push(accuracy);
				return false; // force a miss, so the rest of the turn stays quiet
			});
			for (const choice of choices) battle.makeChoices(...choice);
			return seen;
		}

		const windTeams = () => [[
			{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['raindance', 'sunnyday', 'snowscape'] },
		], [
			{ species: 'Smeargle', ability: 'owntempo', moves: ['hurricane', 'blizzard', 'thunder'] },
		]];

		it('should give Hurricane its normal accuracy check in rain', () => {
			const seen = accuracyOf('hurricane', windTeams(), [['move raindance mega', 'move hurricane']]);
			assert.deepEqual(seen, [70], 'rain should not let Hurricane skip its accuracy check');
		});

		it('should give Hurricane its normal accuracy check in sun', () => {
			const seen = accuracyOf('hurricane', windTeams(), [['move sunnyday mega', 'move hurricane']]);
			assert.deepEqual(seen, [70], 'sun should not drop Hurricane to 50 accuracy');
		});

		it('should give Blizzard its normal accuracy check in snow', () => {
			const seen = accuracyOf('blizzard', windTeams(), [['move snowscape mega', 'move blizzard']]);
			assert.deepEqual(seen, [70], 'snow should not let Blizzard skip its accuracy check');
		});

		it('should leave moves without the wind flag alone', () => {
			const seen = accuracyOf('thunder', windTeams(), [['move raindance mega', 'move thunder']]);
			assert.deepEqual(seen, [true], 'Thunder is not wind-flagged, so rain should still make it always hit');
		});

		it('should apply to wind moves between two Pokemon that are not the holder', () => {
			const seen = accuracyOf('hurricane', [[
				{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['raindance'] },
				{ species: 'Wynaut', ability: 'shadowtag', moves: ['splash'] },
			], [
				{ species: 'Smeargle', ability: 'owntempo', moves: ['hurricane'] },
				{ species: 'Ditto', ability: 'limber', moves: ['splash'] },
			]], [['move raindance mega, move splash', 'move hurricane 2, move splash']], { gameType: 'doubles' });
			assert.deepEqual(seen, [70]);
		});

		it('should stop normalizing wind moves once the holder leaves the field', () => {
			const seen = accuracyOf('hurricane', [[
				{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['raindance'] },
				{ species: 'Wynaut', ability: 'shadowtag', moves: ['splash'] },
			], [
				{ species: 'Smeargle', ability: 'owntempo', moves: ['hurricane'] },
			]], [
				['move raindance mega', 'move hurricane'],
				['switch 2', 'move hurricane'],
			]);
			assert.deepEqual(seen, [70, true], 'rain should make Hurricane always hit again');
		});
	});
});

describe('Custom Mega Pidgeot mod data', () => {
	it('should give Hyper Beam 100 accuracy', () => {
		assert.equal(mod.dex.moves.get('hyperbeam').accuracy, 100);
	});

	it('should check Hyper Beam at 100 accuracy for any Pokemon', () => {
		const b = mod.createBattle([[
			{ species: 'Smeargle', ability: 'owntempo', moves: ['hyperbeam'] },
		], [
			{ species: 'Wynaut', ability: 'shadowtag', moves: ['splash'] },
		]]);
		const seen = [];
		b.onEvent('Accuracy', b.format, (accuracy, target, source, move) => {
			if (move.id === 'hyperbeam') seen.push(accuracy);
			return false;
		});
		b.makeChoices('move hyperbeam', 'move splash');
		b.destroy();
		assert.deepEqual(seen, [100]);
	});

	it('should give Pidgeot Work Up', () => {
		assert(mod.dex.species.getLearnsetData('pidgeot').learnset.workup, 'Pidgeot should have Work Up in its learnset');
		assert.equal(mod.dex.moves.get('workup').isNonstandard, null, 'Work Up should be usable in this mod');
	});

	it('should validate a team with Pidgeot + Pidgeotite + Work Up', () => {
		const team = [
			{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['workup', 'hyperbeam', 'hurricane', 'roost'], nature: 'Modest' },
			{ species: 'Snorlax', ability: 'immunity', item: 'leftovers', moves: ['bodyslam', 'crunch', 'protect', 'curse'], nature: 'Adamant' },
			{ species: 'Tyranitar', ability: 'sandstream', item: 'focussash', moves: ['rockslide', 'crunch', 'protect', 'dragondance'], nature: 'Jolly' },
			{ species: 'Gardevoir', ability: 'synchronize', item: 'sitrusberry', moves: ['psychic', 'moonblast', 'protect', 'trickroom'], nature: 'Modest' },
			{ species: 'Skarmory', ability: 'keeneye', item: 'choicescarf', moves: ['bravebird', 'ironhead', 'protect', 'tailwind'], nature: 'Jolly' },
			{ species: 'Azumarill', ability: 'thickfat', item: 'lumberry', moves: ['aquajet', 'playrough', 'protect', 'bellydrum'], nature: 'Adamant' },
		];
		assert.legalTeam(team, FORMAT);
	});
});
