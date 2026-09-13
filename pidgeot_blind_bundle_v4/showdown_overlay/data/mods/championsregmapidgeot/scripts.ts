export const Scripts: ModdedBattleScriptsData = {
	inherit: 'championsregma',
	gen: 9,
	init() {
		// Pidgeot gains Work Up.
		// Learnsets can't use `inherit: true` for this: mod entries are merged shallowly,
		// so a partial `learnset` object would replace Pidgeot's entire movepool.
		this.modData('Learnsets', 'pidgeot').learnset.workup = ['9M'];
	},
};
