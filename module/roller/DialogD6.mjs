export class DialogD6 extends Dialog {

	constructor(rollName, diceNum, actor, weapon, EERoll, dialogData = {}, options = {}) {
		super(dialogData, options);
		this.rollName = rollName;
		this.diceNum = diceNum;
		this.actor = actor;
		this.weapon = weapon;
		this.EERoll = EERoll;
		this.options.classes = ["dice-icon"];
	}

	activateListeners(html) {
		// Check when the box is changed if actor has enough ammo
		super.activateListeners(html);
		// html.on('change', '.d-number', async (e, i, a) => {
		//     await this.checkAmmo(html)
		// })

		html.on("click", ".roll", async event => {
			let diceNum = html.find(".d-number").value;

			if (!this.EERoll) {
				electricembrace.EE2d20Roller.rollD6({
					rollname: this.rollName,
					dicenum: parseInt(diceNum),
					weapon: this.weapon,
					actor: this.actor,
				});
			}
			else {
				electricembrace.EE2d20Roller.addD6({
					rollname: this.rollName,
					dicenum: parseInt(diceNum),
					weapon: this.weapon,
					actor: this.actor,
					EERoll: this.EERoll,
				});
			}
		});
	}

	async rollD6() {

	}

	async addD6() {

	}

	static async createDialog({ rollName = "DC Roll", diceNum = 2, EERoll = null, actor= null, weapon = null } = {}) {
		let dialogData = {};

		dialogData.rollName = rollName;
		dialogData.diceNum = diceNum;
		dialogData.EERoll = EERoll;
		dialogData.weapon = weapon;
		dialogData.actor = actor;

		const html = `<div class="flexrow electricembrace-dialog">
		<div class="flexrow resource" style="padding:5px">
		<label class="title-label">Number of Dice:</label><input type="number" class="d-number" value="${diceNum}">
		</div>
		</div>`;

		let d = new DialogD6(rollName, diceNum, actor, weapon, EERoll, {
			title: rollName,
			content: html,
			buttons: {
				roll: {
					icon: '<i class="fas fa-check"></i>',
					label: "ROLL",
				},
			},
			close: () => { },
		});
		d.render(true);
	}

}