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
    this.deferred = new Deferred();
  };

  activateListeners(html) {
    super.activateListeners(html);

    this.data.buttons.roll.callback=this.rollButton.bind(this);
  };

  rollButton(){
    console.log("ROLLING 2D20 Lets goooo!");
    let attr = this.element.find('[name="attribute"]').val();
    let skill = this.element.find('[name="skill"]').val();
    let complication = this.element.find('[name="complication"]').val();
    let isTag = this.element.find('[name="tag"]').is(":checked");
    let bonusDice = this.element.find('[name="bonus dice"]').val();

    //Calculating targetNumber
    let targetNumber = parseInt(attr) + parseInt(skill);

    //Calculating double range
    let doubleRange = 1;
    if (isTag) {
      doubleRange = skill;
    }

    //Calculating complication range (TODO REMOVE THIS AND CHANGE IT IN ROLLER!)
    let complicationRange = 21 - parseInt(complication);

    const rollOptions = {
      targetNumber: parseInt(targetNumber) || 10,
      extraDice: parseInt(bonusDice) || 0,
      difficulty: 1,
      doubleRange: parseInt(doubleRange) || 1,
      complicationRange: parseInt(complicationRange) || 1,
    };

    const result = game.electricembrace.Roller2d20.roll2d20(rollOptions);
    console.log("Roll results are like that: ", result);
    const chatData = {
      ...rollOptions,
      ...result,
    };

    renderTemplate('systems/electricembrace/templates/chat-cards/2d20-chat-card.html', chatData).then(
      (html) => {
        const messageData = {
          user: game.user_id,
          type: CONST.CHAT_MESSAGE_TYPES.ROLL,
          content: html,
        };

        console.log(html);

        const rollMode = game.settings.get('core', 'rollMode');
        ChatMessage.applyRollMode(messageData, rollMode);

        //CONFIG.ChatMessage.entityClass.create(messageData);
        ChatMessage.create(messageData).then(msg => {
          return msg;
        });
      }
    );

    console.log(result);
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
        buttons: {
          roll: {
            label: "ROLL",
          },
        },
      },
    );
    d.render(true);
    return d.deferred.promise;
  }
}

class Deferred {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}
