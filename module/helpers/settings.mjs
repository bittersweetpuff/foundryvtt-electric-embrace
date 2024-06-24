import { SYSTEM_ID } from "./config.mjs";

export default function registerSettings() {

    	// -------------------
	//  INTERNAL SETTINGS
	// -------------------
	//
	game.settings.register(SYSTEM_ID, "partyAP", {
		name: "Party AP",
		scope: "world",
		config: false,
		default: 0,
		type: Number,
	});
	
	game.settings.register(SYSTEM_ID, "gmAP", {
		name: "GM AP",
		scope: "world",
		config: false,
		default: 0,
		type: Number,
	});

	game.settings.register(SYSTEM_ID, "maxAP", {
		name: "Max AP",
		scope: "world",
		config: false,
		default: 6,
		type: Number,
	});


    game.settings.register(SYSTEM_ID, "gmMomentumShowToPlayers", {
		name: "Show Overseer AP To Players",
		hint: "Shows the Overseer's AP window to everyone. Requires refresh on the players side.",
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register(SYSTEM_ID, "maxAppShowToPlayers", {
		name: "Players Can Setup Max AP",
		hint: "Allows players to settup the Party's MAX AP. Requires refresh on the players side.",
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register(SYSTEM_ID, "editSheetMode", {
		name: "Character Sheet God Mode",
		hint: "Expands ways you can some elements of character sheet, like abilites",
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});


}
