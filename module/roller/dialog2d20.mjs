export class Dialog2d20 extends Dialog {
  constructor(
    rollName,
    diceNum,
    attribute,
    skill,
    tag,
    complication,
    rollLocation,
    actor,
    item,
    dialogData={},
    options={}
  ) {
    super(dialogData, options);
    this.rollName = rollName;
    this.diceNum = diceNum;
    this.attribute = attribute;
    this.skill = skill;
    this.tag = tag;
    this.complication = complication;
    this.rollLocation = rollLocation;
    this.actor = actor;
    this.item = item;
  };

  activatreListeners(html) {
    super.activateListeners(html);
  };

  static async createDialog( {rollName = "Roll D20", diceNum = 2, attribute = 0, skill = 0, tag = false, complication = 20, rollLocation = false, actor = null, item = null} = {}) {
    let dialogData = {};

    dialogData.rollName = rollName;
    dialogData.diceNum = diceNum;
    dialogData.attribute = attribute;
    dialogData.skill = skill;
    dialogData.tag = tag;
    dialogData.complication = complication;
    dialogData.rollLocation = rollLocation;
    dialogData.actor = actor;
    dialogData.item = item;
    
    const html = await renderTemplate("systems/electricembrace/templates/dialogs/dialog2d20.html", dialogData);
    let d = new Dialog2d20(
			rollName,
			diceNum,
			attribute,
			skill,
			tag,
			complication,
			rollLocation,
			actor,
			item,
			{
				title: rollName,
				content: html,
				buttons: {},
			}
		);
		d.render(true);
  }
}
