export const Formats: import('../sim/dex-formats').FormatList = [
	{
		section: "Custom Mega Pidgeot",
	},
	{
		name: "[Gen 9 Champions] VGC 2026 Reg M-A + Mega Pidgeot",
		desc: `[Gen 9 Champions] VGC 2026 Reg M-A, with Mega Pidgeot rebuilt around Wingtip Vortex.`,
		mod: 'championsregmapidgeot',
		gameType: 'doubles',
		bestOfDefault: true,
		ruleset: ['Flat Rules', 'VGC Timer', 'Open Team Sheets'],
	},
	{
		name: "[championsregmapidgeot] Custom Game",
		mod: 'championsregmapidgeot',
		searchShow: false,
		challengeShow: false,
		debug: true,
		battle: { trunc: Math.trunc },
		ruleset: ['Team Preview', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 50'],
	},
	{
		name: "[championsregmapidgeot] Doubles Custom Game",
		mod: 'championsregmapidgeot',
		gameType: 'doubles',
		searchShow: false,
		challengeShow: false,
		debug: true,
		battle: { trunc: Math.trunc },
		ruleset: ['Team Preview', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 50'],
	},
];
