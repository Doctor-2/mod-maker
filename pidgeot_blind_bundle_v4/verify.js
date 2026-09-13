'use strict';
// Step 8 + scope check. Run from the pokemon-showdown repo root, after `npm run build`:
//   node /path/to/pidgeot_blind_bundle_v4/verify.js

const path = require('path');
// resolved against the cwd, so this runs from the pokemon-showdown root wherever it was cloned
const { Dex, Teams } = require(path.resolve(process.cwd(), 'dist/sim'));
const { TeamValidator } = require(path.resolve(process.cwd(), 'dist/sim/team-validator'));

const FORMAT = '[Gen 9 Champions] VGC 2026 Reg M-A + Mega Pidgeot';
const BASE_FORMAT = '[Gen 9 Champions] VGC 2026 Reg M-A';

const team = [
	{ species: 'Pidgeot', ability: 'keeneye', item: 'pidgeotite', moves: ['workup', 'hyperbeam', 'hurricane', 'roost'], nature: 'Modest' },
	{ species: 'Snorlax', ability: 'immunity', item: 'leftovers', moves: ['bodyslam', 'crunch', 'protect', 'curse'], nature: 'Adamant' },
	{ species: 'Tyranitar', ability: 'sandstream', item: 'focussash', moves: ['rockslide', 'crunch', 'protect', 'dragondance'], nature: 'Jolly' },
	{ species: 'Gardevoir', ability: 'synchronize', item: 'sitrusberry', moves: ['psychic', 'moonblast', 'protect', 'trickroom'], nature: 'Modest' },
	{ species: 'Skarmory', ability: 'keeneye', item: 'choicescarf', moves: ['bravebird', 'ironhead', 'protect', 'tailwind'], nature: 'Jolly' },
	{ species: 'Azumarill', ability: 'thickfat', item: 'lumberry', moves: ['aquajet', 'playrough', 'protect', 'bellydrum'], nature: 'Adamant' },
];

function heading(text) {
	console.log(`\n=== ${text} ===`);
}

heading('format');
const format = Dex.formats.get(FORMAT);
console.log(`name:     ${format.name} (${format.name.length} chars, engine limit is 50)`);
console.log(`mod:      ${format.mod}`);
console.log(`gameType: ${format.gameType}`);
console.log(`ruleset:  ${format.ruleset.join(', ')}`);

heading('step 8: team validation');
console.log(Teams.export(team));
const problems = TeamValidator.get(FORMAT).validateTeam(team);
console.log(problems ? `REJECTED:\n${problems.join('\n')}` : 'VALID: no problems reported');

heading('Mega Pidgeot, this format vs. stock Reg M-A');
for (const modid of [format.mod, Dex.formats.get(BASE_FORMAT).mod]) {
	const species = Dex.mod(modid).species.get('Pidgeot-Mega');
	const s = species.baseStats;
	console.log(`${modid.padEnd(24)} ${species.types.join('/')} ${s.hp}/${s.atk}/${s.def}/${s.spa}/${s.spd}/${s.spe}  ability: ${species.abilities['0']}`);
}

heading('Hyper Beam accuracy');
for (const modid of [format.mod, 'championsregma', 'champions', 'gen9']) {
	console.log(`${modid.padEnd(24)} ${Dex.mod(modid).moves.get('hyperbeam').accuracy}`);
}

heading('Work Up');
for (const modid of [format.mod, 'championsregma']) {
	const dex = Dex.mod(modid);
	const learners = dex.species.all()
		.filter(s => !s.isNonstandard && s.tier !== 'Illegal')
		.filter(s => dex.species.getLearnsetData(s.id).learnset?.workup)
		.map(s => s.name);
	console.log(`${modid.padEnd(24)} isNonstandard: ${JSON.stringify(dex.moves.get('workup').isNonstandard)}  legal learners: ${learners.length ? learners.join(', ') : '(none)'}`);
}
