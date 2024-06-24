export class MomentumTracker extends Application {

    constructor(options={}) {
		if (MomentumTracker._instance) {
			throw new Error("MomentumTracker already has an instance!!!");
		}

		super(options);

		MomentumTracker._instance = this;
		MomentumTracker.closed = true;

		this.data = {};
	}

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["electricembrace", "ap-tracker"],
			height: "200",
			id: "ap-tracker-app",
			popOut: false,
			resizable: false,
			template: "systems/electricembrace/templates/apps/ap-tracker.html",
			title: "Momentum Tracker",
			width: "auto",
		});
	}

	// override
	getData() {
		super.getData();

		const maxAppShowToPlayers = game.settings.get(
			"electricembrace", "maxAppShowToPlayers"
		);
		this.data.maxAppShowToPlayers = game.user.isGM || maxAppShowToPlayers;

		const showGMMomentumToPlayers = game.settings.get(
			"electricembrace", "gmMomentumShowToPlayers"
		);
		this.data.showGMMomentumToPlayers =
			game.user.isGM || showGMMomentumToPlayers;

		this.data.gmAP = game.settings.get("electricembrace", "gmAP");
		this.data.maxAP = game.settings.get("electricembrace", "maxAP");
		this.data.partyAP = game.settings.get("electricembrace", "partyAP");

		this.data.isGM = game.user.isGM;

		return this.data;
	}

	static async initialise() {
		if (this._instance) return;

		console.log("Initialising Advantage Tracker");
		new MomentumTracker();

		this.renderMomentumTracker();
		this.registerSocketEvents();
	}

	static renderMomentumTracker() {
		if (MomentumTracker._instance){
			MomentumTracker._instance.render(true);
			console.log("RENDERING TRACKER");
		}
	}

	activateListeners(html) {
		super.activateListeners(html);

		if (MomentumTracker.closed) {
			html.find(".ap-resource.maxAP-box").css("display", "none");
		}

		html.find(".ap-input").change(ev => {
			const type = $(ev.currentTarget).parents(".ap-resource").attr("data-type");
			const value = ev.target.value;

			MomentumTracker.setAP(type, value);
		});

		html.find(".ap-add, .ap-sub").click(ev => {
			const type = $(ev.currentTarget).parents(".ap-resource").attr("data-type");

			const change = $(ev.currentTarget).hasClass("ap-add") ? 1 : -1;

			const currentValue = game.settings.get("electricembrace", type);

			const maxAP = game.settings.get("electricembrace", "maxAP");

			if (parseInt(currentValue) < maxAP || parseInt(currentValue) > 0) {
				const newValue = parseInt(currentValue) + change;
				MomentumTracker.setAP(type, newValue);
			}

		});

		html.find(".toggle-maxAp").click(ev => {
			html.find(".ap-resource.maxAP-box").slideToggle("fast", function() {
				MomentumTracker.closed = !MomentumTracker.closed;
			});
		});
	}


	static async registerSocketEvents() {
		console.log("Registering MomentumTracker socket events");

		game.socket.on("system.electricembrace", ev => {
			if (ev.operation === "setAP") {
				if (game.user.isGM) {
					this.setAP(ev.data.type, ev.data.value);
				}
			}

			if (ev.operation === "updateAP") this.updateAP();
		});
	}

	static async setAP(type, value) {
		value = Math.round(value);

		if (!game.user.isGM) {
			game.socket.emit("system.electricembrace", {
				operation: "setAP",
				data: { value: value, type: type },
			});
			return;
		}

		let maxAP = game.settings.get("electricembrace", "maxAP");
		let partyAP = game.settings.get("electricembrace", "partyAP");

		if (partyAP > value && type === "maxAP") {
			await game.settings.set("electricembrace", "maxAP", value);
			await game.settings.set("electricembrace", "partyAP", value);

			MomentumTracker.renderMomentumTracker();

			game.socket.emit("system.electricembrace", { operation: "updateAP" });
			return;
		}

		if (value > maxAP && type === "partyAP") {
			await game.settings.set("electricembrace", type, maxAP);

			MomentumTracker.renderMomentumTracker();
		}
		else if (value < 0) {
			await game.settings.set("electricembrace", type, 0);

			MomentumTracker.renderMomentumTracker();
		}
		else {
			await game.settings.set("electricembrace", type, value);

			MomentumTracker.renderMomentumTracker();
		}

		// emit socket event for the players to update
		game.socket.emit("system.electricembrace", { operation: "updateAP" });
	}

	static updateAP() {
		MomentumTracker.renderMomentumTracker();
	}


}
