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

		// Wind-flagged moves always hit, globally. Same shape as No Guard's accuracy
		// handler, narrowed to the wind flag: returning true from the Accuracy event makes
		// battle-actions.ts skip the accuracy roll entirely, so weather, accuracy/evasion
		// stages and accuracy modifiers all stop mattering for these moves.
		// Deliberately no onAnyInvulnerability counterpart: this is an accuracy guarantee,
		// not a way through Fly/Dig/Dive. A wind move that normally hits a semi-invulnerable
		// target (Gust, Twister) still does; one that doesn't (Blizzard) still doesn't.
		onAnyAccuracy(accuracy, target, source, move) {
			if (move?.flags['wind']) return true;
		},

		flags: {},
		name: "Wingtip Vortex",
		rating: 4,
		num: 1001,
		shortDesc: "Flying weaknesses are neutralized and wind moves always hit, globally.",
	},
};
