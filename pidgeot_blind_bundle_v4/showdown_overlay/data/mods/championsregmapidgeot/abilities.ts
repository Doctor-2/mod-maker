export const Abilities: import('../../../sim/dex-abilities').ModdedAbilityDataTable = {
	wingtipvortex: {
		onStart(pokemon) {
			this.add('-ability', pokemon, 'Wingtip Vortex');
		},

		// Delta Stream's Flying-component weakness reduction, reproduced globally.
		// Delta Stream implements this on the `deltastream` *weather* condition; doing the same
		// here would make the effect exclusive with rain/sun/sand/snow. Running it off the
		// ability instead keeps normal weather untouched, and makes the effect last exactly as
		// long as the holder is active (ability handlers stop firing the moment it leaves,
		// faints, or is suppressed) rather than lingering as a field condition.
		// Delta Stream's condition carries onEffectivenessPriority -1. There is no declared
		// type for the onAny form of that key, and the order is inert here anyway: both
		// handlers return 0 on the same matchups, so whichever runs first leaves typeMod at 0.
		onAnyEffectiveness(typeMod, target, type, move) {
			if (move && move.effectType === 'Move' && move.category !== 'Status' && type === 'Flying' && typeMod > 0) {
				this.add('-fieldactivate', 'ability: Wingtip Vortex');
				return 0;
			}
		},

		// The normal accuracy check is guaranteed for wind-flagged moves, globally.
		// Weather rewrites the accuracy of several wind moves in their own `onModifyMove`
		// (Hurricane: never misses in rain, 50 in sun; Blizzard: never misses in snow/hail;
		// Bleakwind/Sandsear/Wildbolt Storm: never miss in rain). That handler runs in the
		// `singleEvent` at battle-actions.ts:431, before this one at :439, so restoring the
		// move's data accuracy here puts the move back on its ordinary accuracy check.
		// Everything downstream of `move.accuracy` still applies normally: accuracy/evasion
		// stages, Compound Eyes, Wide Lens, Gravity.
		onAnyModifyMove(move) {
			if (!move.flags['wind']) return;
			const baseAccuracy = this.dex.moves.get(move.id).accuracy;
			if (move.accuracy !== baseAccuracy) move.accuracy = baseAccuracy;
		},

		flags: {},
		name: "Wingtip Vortex",
		rating: 4,
		num: 1001,
		shortDesc: "Flying weaknesses are neutralized and wind moves take their normal accuracy check, globally.",
	},
};
