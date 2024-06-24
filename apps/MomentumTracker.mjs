export class MomentumTracker extends Application {

	constructor(options={}) {
		if (MomentumTracker._instance) {
			throw new Error("APTracker already has an instance!!!");
		}

		super(options);

		MomentumTracker._instance = this;
		MomentumTracker.closed = true;
	}


	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			classes: ["electricembrace", "ap-tracker"],
			height: "200",
			id: "ap-tracker-app",
			popOut: false,
			resizable: false,
			template: "systems/electricembrace/templates/apps/ap-tracker.html",
			title: "AP Tracker",
			width: "auto",
		});
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

			const currentValue = game.settings.get(SYSTEM_ID, type);
			const newValue = parseInt(currentValue) + change;

			MomentumTracker.setAP(type, newValue);
		});

		html.find(".toggle-maxAp").click(ev => {
			html.find(".ap-resource.maxAP-box").slideToggle("fast", function() {
				MomentumTracker.closed = !MomentumTracker.closed;
			});
		});
	}


	static async adjustAP(type, diff) {
		if (!game.user.isGM) {
			game.socket.emit("system.electricembrace", {
				operation: "adjustAP",
				data: { diff, type },
			});
			return;
		}

		diff = Math.round(diff);

		let momentum = game.settings.get(SYSTEM_ID, type);
		momentum += diff;

		this.setAP(type, momentum);
	}


	getData() {
		const data = {
			gmAP: game.settings.get(SYSTEM_ID, "gmAP"),
			isGM: game.user.isGM,
			maxAP: game.settings.get(SYSTEM_ID, "maxAP"),
			partyAP: game.settings.get(SYSTEM_ID, "partyAP"),
		};

		data.showGMMomentumToPlayers = game.user.isGM
			? true
			: game.settings.get(SYSTEM_ID, "gmMomentumShowToPlayers");

		data.maxAppShowToPlayers = game.user.isGM
			? true
			: game.settings.get(SYSTEM_ID, "maxAppShowToPlayers");

		return data;
	}


	static async initialise() {
		if (this._instance) return;

		new MomentumTracker();

		this.renderMomentumTracker();
		this.registerSocketEvents();
	}


	static async registerSocketEvents() {

		game.socket.on("system.electricembrace", ev => {
			if (ev.operation === "adjustAP") {
				if (game.user.isGM) {
					this.adjustAP(ev.data.type, ev.data.diff);
				}
			}

			if (ev.operation === "setAP") {
				if (game.user.isGM) {
					this.setAP(ev.data.type, ev.data.value);
				}
			}

			if (ev.operation === "updateAP") {
					this.updateAP();
				}
		});
	}


	static renderMomentumTracker() {
		if (MomentumTracker._instance){
			MomentumTracker._instance.render(true);
		} 
	}


	static async setAP(type, value) {
		if (!game.user.isGM) {
			game.socket.emit("system.electricembrace", {
				operation: "setAP",
				data: { value: value, type: type },
			});
			return;
		}
		value = Math.round(value);
		value = Math.max(0, value);

		const maxAP = await game.settings.get(SYSTEM_ID, "maxAP");

		if (type === "partyAP") value = Math.min(value, maxAP);

		if (type === "maxAP") {
			const currentPartyAP =
				await game.settings.get(SYSTEM_ID, "partyAP");

			const newPartyAP = Math.min(value, currentPartyAP);

			await game.settings.set(SYSTEM_ID, "partyAP", newPartyAP);
		}



		await game.settings.set(SYSTEM_ID, type, value);

		

		MomentumTracker.renderMomentumTracker();

		// emit socket event for the players to update
		game.socket.emit("system.electricembrace", { operation: "updateAP" });
	}


	static updateAP() {

		MomentumTracker.renderMomentumTracker();
	}
}