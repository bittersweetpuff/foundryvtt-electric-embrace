export function diceSoNiceReadyHook(dice3d) {
  console.log("Running diceSoNiceReadyHook");

  dice3d.addSystem({ id: "electricembrace", name: "Electric Embrace" }, true);

  dice3d.addColorset({
		name: "electricembrace",
		description: "Electric Embrace",
		category: "Colors",
		foreground: "#fcef71",
		background: "#008cd1",
		outline: "gray",
		texture: "none",
	});

  dice3d.addColorset({
		name: "succuban",
		description: "Succuban Pink",
		category: "Colors",
		foreground: "#ffe8e8",
		background: "#d40055",
		outline: "gray",
		texture: "none",
	});

  dice3d.addColorset({
		name: "papaj",
		description: "Papaj 202",
		category: "Colors",
		foreground: "#d59e4a",
		background: "#fcf6d2",
		outline: "gray",
		texture: "none",
	});

	dice3d.addDicePreset({
		type: "dc",
		labels: [
			"systems/electricembrace/assets/dice/d1.webp",
			"systems/electricembrace/assets/dice/d2.webp",
			"systems/electricembrace/assets/dice/d3.webp",
			"systems/electricembrace/assets/dice/d4.webp",
			"systems/electricembrace/assets/dice/d5.webp",
			"systems/electricembrace/assets/dice/d6.webp",
		],
		system: "electricembrace",

	});

	dice3d.addDicePreset({
		type: "dh",
		fontScale: 0.9,
		labels: [
			"systems/electricembrace/assets/dice-locations/head.webp",
			"systems/electricembrace/assets/dice-locations/head.webp",
			"systems/electricembrace/assets/dice-locations/body.webp",
			"systems/electricembrace/assets/dice-locations/body.webp",
			"systems/electricembrace/assets/dice-locations/body.webp",
			"systems/electricembrace/assets/dice-locations/body.webp",
			"systems/electricembrace/assets/dice-locations/body.webp",
			"systems/electricembrace/assets/dice-locations/body.webp",
			"systems/electricembrace/assets/dice-locations/arm-l.webp",
			"systems/electricembrace/assets/dice-locations/arm-l.webp",
			"systems/electricembrace/assets/dice-locations/arm-l.webp",
			"systems/electricembrace/assets/dice-locations/arm-r.webp",
			"systems/electricembrace/assets/dice-locations/arm-r.webp",
			"systems/electricembrace/assets/dice-locations/arm-r.webp",
			"systems/electricembrace/assets/dice-locations/leg-l.webp",
			"systems/electricembrace/assets/dice-locations/leg-l.webp",
			"systems/electricembrace/assets/dice-locations/leg-l.webp",
			"systems/electricembrace/assets/dice-locations/leg-r.webp",
			"systems/electricembrace/assets/dice-locations/leg-r.webp",
			"systems/electricembrace/assets/dice-locations/leg-r.webp",
		],
		system: "electricembrace",
		colorset: "electricembrace",
	});


};


