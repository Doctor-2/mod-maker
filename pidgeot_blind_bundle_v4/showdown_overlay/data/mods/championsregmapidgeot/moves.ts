export const Moves: import('../../../sim/dex-moves').ModdedMoveDataTable = {
	// Hyper Beam accuracy is 100 globally.
	hyperbeam: {
		inherit: true,
		accuracy: 100,
	},
	// Work Up is Past in the Champions mod, which would make it unusable even once it is
	// in Pidgeot's learnset. No other Champions-legal species learns it (see
	// results/verify.txt), so this only enables it for Pidgeot.
	workup: {
		inherit: true,
		isNonstandard: null,
	},
};
